/*jslint node: true */
'use strict';

const fs = require('fs-extra');
const jsdoc = require('jsdoc-api');
const jsdocParse = require('jsdoc-parse');
const path = require('path');
const promisify = require('util').promisify;

const ensureDirAsync = promisify(fs.ensureDir);
const readdirAsync = promisify(fs.readdir);
const removeAsync = promisify(fs.remove);
const writeJsonAsync = promisify(fs.writeJson);

// Diagnostic switch. Set to true to see unextendedDocumentationMap
// written to disk - a diagnostic code path.
const WRITE_UNEXTENDEDONLY = false;


// extendedDocumentationMap the resulting dictionary of jsDoc objects
// with extended schema, and which get written to disk. We keep this
// map in memory so we can do reverse-lookup sorts of analysis and extension,
// such as "What objects use this mixin?" or "What objects inherit from
// this class?".
const extendedDocumentationMap = {};


// Once the extendedDocumentationMap is fully constructed, it can
// be analyzed for reverse relationships such as classInheritedBy and
// mixinUsedBy. Anything that needs to be done once the map is completed
// is done here.
function analyzeAndUpdateExtendedJson(docsList, docsListItem) {
  let json = extendedDocumentationMap[docsListItem.name];
  if (json) {
    let itemName = json[0].name;
    
    docsList.forEach(docsListItem => {
      // Don't process the item itself
      if (docsListItem.name === itemName) {
        return;
      }
      
      updateMixinUsedBy(json, docsListItem.name);
      updateClassInheritedBy(json, docsListItem.name);
    });
  }
}

// After the unextendedDocumentationMap cache is built, we build
// the extended documentation for objects having @extend and @mixes
// attributes.
// buildAndMapExtendedJson takes a single item from the docsList array
// and builds the extended documentation for that item.
function buildAndMapExtendedJson(docsListItem, docs) {
  // Make a copy of the unextended json so we don't corrupt the cache
  let srcJson = docs[docsListItem.name];
  let componentJson = clone(srcJson);
  
  // Initialize the componentJson with an array parallel to
  // the mixes array, specifying the origin class inserting the mixin
  componentJson[0].mixinOrigins = [];
  if (componentJson[0].mixes != null && componentJson[0].mixes !== undefined) {
    componentJson[0].mixinOrigins = componentJson[0].mixes.map(() => {
      return componentJson[0].name;
    });
  }

  mergeExtensionDocs(componentJson, docs);

  // Sort the array, leaving the order:0 item alone at the
  // front of the list (the class identifier section)
  componentJson.sort((a, b) => {
    if (a.order === 0) { return -1; }
    if (b.order === 0) { return 1; }

    return a.name.localeCompare(b.name);
  });

  // Set the order value
  componentJson.map((item, index) => {
    item.order = index;
  });
    
  // Add the item to the extendedDocumentationMap
  extendedDocumentationMap[componentJson[0].name] = componentJson;
}

// Recursive function that extends the root item's mixin array, and extends
// an array of names representing inheritance items that need to be parsed
// and added to the root item.
// This function is first called with the root item as the json parameter.
// There's nothing asynchronous about this work; the function is used as
// a utility and does not return a Promise.
// Note that due to the recursive calling, the json array field, inheritance,
// will be constructed in an ordered manner with the 0th index holding the
// immediate class parent, the 1st index holding the grandparent, etc.
function buildAugmentsListAndExtendMixinsArray(json, augmentsArray, mixinArray, docs) {

  // Extract @inherits value.
  const inheritsValue = docs.customTags && 
      docs.customTags.length > 0 && 
      docs.customTags[0].tag === 'inherits' &&
      docs.customTags[0].value;
  if (!inheritsValue) {
    // Break the recursive chain by returning without another recursive call
    return;
  }

  // We're interested only in single-inheritance
  const augmentsName = inheritsValue;
  const augmentsItem = docs[augmentsName];
  if (augmentsItem == null || augmentsItem === undefined) {
    // Break the recursive chain by returning without another recursive call
    return;
  }

  if (augmentsItem[0].mixes != null &&
      augmentsItem[0].mixes !== undefined &&
      augmentsItem[0].mixes.length > 0) {
        
    for (let i = 0; i < augmentsItem[0].mixes.length; i++) {
      mixinArray.push({mixin: augmentsItem[0].mixes[i], source: augmentsName});
    }
  }
  
  augmentsArray.push(augmentsName);
  return buildAugmentsListAndExtendMixinsArray(augmentsItem, augmentsArray, mixinArray, docs);
}

// Build documentation for source files.
// The paths argument is an object containing:
// * inputPath: The directory to search for source files.
// * outputPath: The directory to write documentation to.
async function buildDocs(paths) {

  const { inputPath, outputPath } = paths;

  const sourceFiles = await sourceFilesInDirectory(inputPath);
  const basicDocs = await docsFromSourceFiles(sourceFiles);
  
  // Skip extended documentation in diagnostic mode.
  const docs = WRITE_UNEXTENDEDONLY ?
    basicDocs :
    extendDocs(sourceFiles, basicDocs);
  
  // Clean output folder by removing it then recreating it.
  await removeAsync(outputPath);
  await ensureDirAsync(outputPath);

  await writeDocsToDirectory(sourceFiles, docs, outputPath);
  
  if (WRITE_UNEXTENDEDONLY) {
    // Issue an error to note this diagnostic path.
    process.exit(1);
  }
}

// Make a deep copy of a object.
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

// Extract the basic JSDoc documentation from the specified source file.
// This documentation is *not* extended with @mixes or @inherits references.
// Sample result:
//     {
//       'myObject1': {docThing1: 'blah', docThing2: 'blah'},
//       'myObject2': {docThing1: 'blah', docThing2: 'blah'},
//       ...
//     }
async function docsFromSourceFile(file) {

  const src = file.src;
  console.log(`Reading ${path.basename(src)}`);

  // Extract JSDoc from comments in source file. 
  const jsdocJson = await jsdoc.explain({
    files: src
  });

  // Process JSON into something more useful.
  const docs = jsdocParse(jsdocJson);

  if (docs.length === 0) {
    // Return a placeholder.
    return [{
      "id": file.name,
      "longname": file.name,
      "name": file.name,
      "noWrite": true,
      "kind": "module",
      "description": `Need documentation for ${file.name}`,
      "order": 0
    }];
  }

  return docs;
}

// Given a set of files, return a map of file name to the basic JSDoc
// documentation for the objects in those files.
async function docsFromSourceFiles(files) {
  const docs = {};
  await mapPromiseFn(files, async file => {
    docs[file.name] = await docsFromSourceFile(file);
  });
  return docs;
}

// Extend the standard JSDoc results with @mixes and @inherits references.
function extendDocs(files, basicDocs) {
  files.forEach(file => buildAndMapExtendedJson(file, basicDocs));
  files.forEach(file => {
    analyzeAndUpdateExtendedJson(files, file);
  });
  return extendedDocumentationMap;
}

// Apply the given promise-returning function to each member of the array. Note:
// Versions of before Node 9.x seemed to spin up too many file operations,
// forcing us to execute the promises in sequence. As of 9.x, Node appears to be
// sufficiently smart enough that we can kick off all operations at once.
function mapPromiseFn(array, promiseFn) {
  const promises = array ? array.map(promiseFn) : [];
  return Promise.all(promises);
}

// mergeExtensionDocs does the work of adding the @inherits and @mixes
// documentation to the original, unextended jsDoc documentation json object.
// The componentJson object is the cloned json mapped from the
// unextendedDocumentationMap cache, and is updated with extended documentation
// and eventually written to file.
function mergeExtensionDocs(componentJson, docs) {
  if (componentJson.length === 0) {
    return;
  }
  
  // First, walk the inheritance list, adding to the root item's mixin array,
  // and building an array of augments/inherits items in the order of
  // ancestry.
  let augmentsList = [];
  let mixinsList = [];
  buildAugmentsListAndExtendMixinsArray(componentJson, augmentsList, mixinsList, docs);

  // We create a new field, "inheritance," which is an array of object names
  // the documented item inherits from, gleaned from walking each object's
  // augments array. We could have updated the augments array, but instead
  // we choose to create a new field so we don't tamper with augment's original
  // intention.
  if (augmentsList.length > 0) {
    componentJson[0].inheritance = augmentsList;
  }

  // We update the object's mixes field to include those mixins contributed
  // by @inherits objects. We create a mixinOrigins array that is identically
  // sized to the mixins field, and contains the name of the contributing
  // class. The two arrays can be used to build documentation where we
  // specify, say, a method that is defined by FooMixin, and where
  // FooMixin is contributed by/inherited from class Bar.
  if (mixinsList.length > 0) {
    if (componentJson[0].mixes == null || componentJson[0].mixes === undefined) {
      componentJson[0].mixes = [];
    }

    const newMixins = mixinsList.map(item => {
      return item.mixin;
    });
    const newMixinsSources = mixinsList.map(item => {
      return item.source;
    });
    componentJson[0].mixes = componentJson[0].mixes.concat(newMixins);
    componentJson[0].mixinOrigins = componentJson[0].mixinOrigins.concat(newMixinsSources);
  }
  
  const hostId = componentJson[0].id;

  // Merge the @inherits class documentation into componentJson
  augmentsList.forEach((augmentsItem) => {
    mergeExtensionIntoBag(augmentsItem, componentJson, hostId, docs);
  });
  
  // Merge the @mixes class documentation into componentJson
  let mixes = componentJson[0].mixes;
  if (mixes != null && mixes !== undefined && mixes.length > 0) {
    mixes.forEach(mixin => {
      mergeExtensionIntoBag(mixin, componentJson, hostId, docs);
    });
  }
}

// Merge a mixin or inherited class data into the root item's json
function mergeExtensionIntoBag(extensionName, componentJson, hostId, docs) {

  const json = docs[extensionName];
  if (!json) {
    throw `Can't find documentation for ${extensionName}`;
  }

  const extensionJson = clone(json);

  for (let i = 1; i < extensionJson.length; i++) {
    const originalmemberof = resolveOriginalmemberof(docs, extensionJson[i].memberof);
    extensionJson[i].originalmemberof = originalmemberof;
    extensionJson[i].memberof = hostId;
    
      // We specify that the new documentation item is inherited from the
    // originalmemberof object if we can find originalmemberof in the
    // root item's inheritance array.
      // Otherwise, we test if the originalmemberof and memberof fields of
    // the new documentation items are different, which would be the case
    // if the new documentation item is contributed from a mixin. In that
    // case, we look for originalmemberof within the root item's array
    // of mixins, and then map the inheritedfrom field from the root item's
    // mixinOrigins array.
      if (componentJson[0].inheritance && componentJson[0].inheritance.indexOf(originalmemberof) >= 0) {
      extensionJson[i].inheritedfrom = originalmemberof;
    }
    else if (extensionJson[i].originalmemberof !== extensionJson[i].memberof) {
      // Find the owning class of the possible mixin
      const index = componentJson[0].mixes.indexOf(extensionJson[i].originalmemberof);
      if (index >= 0) {
        extensionJson[i].inheritedfrom = componentJson[0].mixinOrigins[index];
      }
    }

    componentJson.push(extensionJson[i]);
  }
}

// Helper function that resolves the name to be referenced by the
// origininalmemberof field.
function resolveOriginalmemberof(docs, memberOf) {
  if (memberOf !== undefined) {
    let strings = memberOf.split(/:|~/);
    switch (strings.length) {
      case 1:
        // First test to see if strings[0] represents an inherited object
        const trial = strings[0];
        if (docs[trial] != null) {
          memberOf = trial;
        }
        else {
          memberOf = `${trial}Mixin`;
        }
        break;
      case 2:
      case 3:
        memberOf = strings[1];
        break;
      default:
        break;
    }
  }
  
  return memberOf;
}

// Return file descriptors for each source file in the given directory.
async function sourceFilesInDirectory(path) {
  const files = await readdirAsync(path);
  const javascriptFiles = files.filter(file => file.endsWith('.js'));
  return javascriptFiles.map(file => {
    return {
      name: file.replace('.js', ''),
      src: `${path}/${file}`
    };
  });
}

// Updates the extended json by checking another extended json object
// in the extendedDocumentationMap to see if this object is included
// as a mixin.
function updateMixinUsedBy(json, objectName) {
  const name = json[0].name;
  
  const searchItem = extendedDocumentationMap[objectName];
  if (searchItem &&
      searchItem[0].mixes &&
      searchItem[0].mixes.length > 0 &&
      searchItem[0].mixes.includes(name)) {
    
    if (json[0].mixinUsedBy === undefined) {
      json[0].mixinUsedBy = [];
    }
    
    json[0].mixinUsedBy.push(objectName);
  }    
}

// Updates the extended json by checking another extended json object
// in the extendedDocumentationMap to see if this object is
// inherited from the other object.
function updateClassInheritedBy(json, objectName) {
  const name = json[0].name;
  
  const searchItem = extendedDocumentationMap[objectName];
  if (searchItem &&
      searchItem[0].inheritance &&
      searchItem[0].inheritance.length > 0 &&
      searchItem[0].inheritance[0] === name) {
    
    if (json[0].classInheritedBy === undefined) {
      json[0].classInheritedBy = [];
    }    
    
    json[0].classInheritedBy.push(objectName);
  }    
}

// Write all docs to the directory specified by the path.
async function writeDocsToDirectory(sourceFiles, docs, directory) {
  await mapPromiseFn(sourceFiles, async sourceFile => {
    const name = sourceFile.name;
    const fileDocs = docs[name];
    const dest = path.join(directory, `${name}.json`);
    await writeFileDocs(name, fileDocs, dest);
  });
}

// Write documentation for the given source file to the destination.
async function writeFileDocs(sourceFile, fileDocs, dest) {
  const name = sourceFile.name;
  if (!fileDocs) {
    throw `Can't find documentation for ${name}`;
  }
  if (fileDocs[0].noWrite) {
    console.log(`Skipping undocumented ${name}`);
    return null;
  }
  console.log(`Writing ${path.basename(dest)}`);
  await writeJsonAsync(dest, fileDocs, { spaces: 2 });
}


module.exports = buildDocs;
