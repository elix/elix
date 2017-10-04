/*jslint node: true */
'use strict';

const fs = require('fs-extra');
const jsdoc = require('jsdoc-api');
const jsdocParse = require('jsdoc-parse');
const promisify = require('./promisify');

let outputPath;
let inputPath;

//
// Array of peer directories for use in docsList
//
let sourceDirs = [];

//
// docsList is an array of objects listing the name, src, and dest of each
// element/mixin/utility file:
//
// Eg:
// [{name: MyClass, src: '.../myClass.js', dest: './build/docs/myClass.json'}, ...]
//
let docsList;

//
// unextendedDocumentationMap is the dictionary of object names to jsDoc
// json documentation. The json documentation is the jsDoc for the
// source file alone, not extended with @mixes or @extends references.
//
// Eg:
// { 'myObject1': {docThing1: 'blah', docThing2: 'blah'},
//   'myObject2': {docThing1: 'blah', docThing2: 'blah'},
//   ...
// }
//
// We use unextendedDocumentationMap as a cache of each file's raw jsDoc
// documentation from which we build extended documentation that gets
// written to build/docs.
//
let unextendedDocumentationMap = {};

//
// extendedDocumentationMap the resulting dictionary of jsDoc objects
// with extended schema, and which get written to disk. We keep this
// map in memory so we can do reverse-lookup sorts of analysis and extension,
// such as "What objects use this mixin?" or "What objects inherit from
// this class?".
//
let extendedDocumentationMap = {};

function buildDocsList() {
  return mapAndChain(sourceDirs, buildDocsListForDirectory)
  .catch(error => {
    console.error(`buildDocsList: ${error}`);
  });
}

//
// Build the portion of docsList that represents the individual source files
// within the specified directory.
//
function buildDocsListForDirectory(dirName) {
  const readdirPromise = promisify(fs.readdir);
  
  return readdirPromise(`${dirName}/`)
  .then((files) => {
    let array = files.filter(file => file.endsWith('.js'))
    .map(file => {
      const fileRoot = file.replace('.js', '');
      let obj = {
        name: fileRoot,
        src: `${dirName}/${file}`,
        dest: `${outputPath}${fileRoot}.json`
      };
      
      // Prepare an entry in the unextendedDocumentationMap
      unextendedDocumentationMap[obj.name] = {};
      
      return obj;
    });
    
    docsList = docsList ? docsList.concat(array) : array;
  })
  .catch(error => {
    console.error(`buildDocsListForDirectory: ${error}`);
  });
}

//
// Uses jsdoc-api to convert a .js file to jsDoc json
//
function parseScriptToJSDocJSON(src) {
  return jsdoc.explain({
    files: src
  })
  .then(json => {
    return jsdocParse(json);
  });
}

//
// Build the jsDoc json for a specified source file and stuff
// it in the unextendedDocumentationMap keyed on the object's name
//
function buildUnextendedJson(docItem) {
  console.log(`Building cached and unextended jsdoc json for ${docItem.name} from ${docItem.src}`);

  return parseScriptToJSDocJSON(docItem.src)
  .then(json => {
    unextendedDocumentationMap[docItem.name] = json;
  })
  .catch(error => {
    console.error(`buildUnextendedJson: ${error}`);
  });
}

//
// After the unextendedDocumentationMap cache is built, we build
// the extended documentation for objects having @extend and @mixes
// attributes.
//
// buildAndMapExtendedJson takes a single item from the docsList array
// and builds the extended documentation for that item.
//
function buildAndMapExtendedJson(docsListItem) {
  // Make a copy of the unextended json so we don't corrupt the cache
  let srcJson = unextendedDocumentationMap[docsListItem.name];
  let componentJson = cloneJSON(srcJson);
  
  // Initialize the componentJson with an array parallel to
  // the mixes array, specifying the origin class inserting the mixin
  componentJson[0].mixinOrigins = [];
  if (componentJson[0].mixes != null && componentJson[0].mixes !== undefined) {
    componentJson[0].mixinOrigins = componentJson[0].mixes.map(mixin => {
      return componentJson[0].name;
    });
  }

  return mergeExtensionDocs(componentJson)
  .then((json) => {
    // Sort the array, leaving the order:0 item alone at the
    // front of the list (the class identifier section)
    json.sort((a, b) => {
      if (a.order === 0) { return -1; }
      if (b.order === 0) { return 1; }

      return a.name.localeCompare(b.name);
    });

    // Set the order value
    json.map((item, index) => {
      item.order = index;
    });
    
    return json;
  })
  .then((json) => {
    // Add the item to the extendedDocumentationMap
    extendedDocumentationMap[json[0].name] = json;
    return json;
  })
  .catch(error => {
    console.error(`buildAndMapExtendedJson: ${error}`);
  });
}

//
// Once the extendedDocumentationMap is fully constructed, it can
// be analyzed for reverse relationships such as classInheritedBy and
// mixinUsedBy. Anything that needs to be done once the map is completed
// is done here.
//
function analyzeAndUpdateExtendedJson(docsListItem) {
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

  return Promise.resolve();
}

//
// Updates the extended json by checking another extended json object
// in the extendedDocumentationMap to see if this object is included
// as a mixin.
//
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

//
// Updates the extended json by checking another extended json object
// in the extendedDocumentationMap to see if this object is
// inherited from the other object.
//
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

//
// Writes an extendedDocumentationMap item to disk
//
function writeExtendedJson(docsListItem) {
  const json = extendedDocumentationMap[docsListItem.name];
  const dest = docsListItem.dest;
  const writeJsonPromise = promisify(fs.writeJson);
  
  console.log(`Writing ${dest}`);
  return writeJsonPromise(dest, json, {spaces: 2})
  .catch(error => {
    console.error(`writeExtendedJson: ${error}`);
  });
}

//
// Recursive function that extends the root item's mixin array, and extends
// an array of names representing inheritance items that need to be parsed
// and added to the root item.
//
// This function is first called with the root item as the json parameter.
// There's nothing asynchronous about this work; the function is used as
// a utility and does not return a Promise.
//
// Note that due to the recursive calling, the json array field, inheritance,
// will be constructed in an ordered manner with the 0th index holding the
// immediate class parent, the 1st index holding the grandparent, etc.
//
function buildAugmentsListAndExtendMixinsArray(json, augmentsArray, mixinArray) {
  if (json[0].augments == null || json[0].augments === undefined) {
    // Break the recursive chain by returning without another recursive call
    return;
  }  
  
  // We're interested only in single-inheritance
  const augmentsName = json[0].augments[0];
  const augmentsItem = unextendedDocumentationMap[augmentsName];
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
  return buildAugmentsListAndExtendMixinsArray(augmentsItem, augmentsArray, mixinArray);
}

//
// mergeExtensionDocs does the work of adding the @extends and @mixes
// documentation to the original, unextended jsDoc documentation json object.
// The componentJson object is the cloned json mapped from the
// unextendedDocumentationMap cache, and is updated with extended documentation
// and eventually written to file.
//
function mergeExtensionDocs(componentJson) {
  if (componentJson.length === 0) {
    return Promise.resolve(componentJson);
  }
  
  //
  // First, walk the inheritance list, adding to the root item's mixin array,
  // and building an array of augments/extends items in the order of
  // ancestry.
  //
  
  let augmentsList = [];
  let mixinsList = [];
  buildAugmentsListAndExtendMixinsArray(componentJson, augmentsList, mixinsList);

  //
  // We create a new field, "inheritance," which is an array of object names
  // the documented item inherits from, gleaned from walking each object's
  // augments array. We could have updated the augments array, but instead
  // we choose to create a new field so we don't tamper with augment's original
  // intention.
  //
  if (augmentsList.length > 0) {
    componentJson[0].inheritance = augmentsList;
  }

  //
  // We update the object's mixes field to include those mixins contributed
  // by @extends objects. We create a mixinOrigins array that is identically
  // sized to the mixins field, and contains the name of the contributing
  // class. The two arrays can be used to build documentation where we
  // specify, say, a method that is defined by FooMixin, and where
  // FooMixin is contributed by/inherited from class Bar.
  //
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

  // Merge the @extends class documentation into componentJson
  augmentsList.forEach((augmentsItem) => {
    mergeExtensionIntoBag(augmentsItem, componentJson, hostId);
  });

  // Merge the @mixes class documentation into componentJson
  let mixes = componentJson[0].mixes;
  if (mixes != null && mixes !== undefined && mixes.length > 0) {
    mixes.forEach(mixin => {
      mergeExtensionIntoBag(mixin, componentJson, hostId);
    });
  }

  return Promise.resolve(componentJson);
}

//
// Helper function that resolves the name to be referenced
// by the origininalmemberof field.
//
function resolveOriginalMemberOf(omo) {
  if (omo !== undefined) {
    let strings = omo.split(/:|~/);
    switch (strings.length) {
      case 1:
        // First test to see if strings[0] represents an inherited object
        const trial = strings[0];
        if (unextendedDocumentationMap[trial] != null) {
          omo = trial;
        }
        else {
          omo = `${trial}Mixin`;
        }
        break;
      case 2:
      case 3:
        omo = strings[1];
        break;
      default:
        break;
    }
  }
  
  return omo;
}

//
// Merge a mixin or inherited class data into the root item's json
//
function mergeExtensionIntoBag(extensionName, componentJson, hostId) {
  const extensionJson = cloneJSON(unextendedDocumentationMap[extensionName]);

  for (let i = 1; i < extensionJson.length; i++) {
    const originalmemberof = resolveOriginalMemberOf(extensionJson[i].memberof);
    extensionJson[i].originalmemberof = originalmemberof;
    extensionJson[i].memberof = hostId;
    
    //
    // We specify that the new documentation item is inherited from the
    // originalmemberof object if we can find originalmemberof in the
    // root item's inheritance array.
    //
    // Otherwise, we test if the originalmemberof and memberof fields of
    // the new documentation items are different, which would be the case
    // if the new documentation item is contributed from a mixin. In that
    // case, we look for originalmemberof within the root item's array
    // of mixins, and then map the inheritedfrom field from the root item's
    // mixinOrigins array.
    //
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

//
// Make a copy of a json object. This is typically used to avoid corrupting
// the cached json in unextendedDocumentationMap.
//
function cloneJSON(json) {
  return JSON.parse(JSON.stringify(json));
}

//
// Remove the outputPath folder and contents
//
function clean() {
  const removePromise = promisify(fs.remove);
  return removePromise(outputPath);
}

//
// Creates the outputPath directory
//
function createOutputPathDirectory(path) {
  const ensureDirPromise = promisify(fs.ensureDir);
  return ensureDirPromise(path);
}

//
// Apply the given promise-returning function to each member of the array.
// Ensure each promise completes before starting the next one to avoid
// spinning up too many file operations at once. This is effectively like
// Promise.all(), while ensuring that the items are processed in a completely
// sequential order.
//
function mapAndChain(array, promiseFn) {
  if (array == null || array.length === 0) {
    return Promise.resolve();
  }
  
  // Start the promise chain with a resolved promise.
  return array.reduce((chain, item) => chain.then(() => promiseFn(item)), Promise.resolve());
}

const buildDocs = function() {
  clean()
  .then(() => {
    return createOutputPathDirectory(outputPath);
  })
  .then(() => {
    return buildDocsList();
  })
  .then(() => {
    return mapAndChain(docsList, buildUnextendedJson);
  })
  .then(() => {
    return mapAndChain(docsList, buildAndMapExtendedJson);
  })
  .then(() => {
    return mapAndChain(docsList, analyzeAndUpdateExtendedJson);
  })
  .then(() => {
    return mapAndChain(docsList, writeExtendedJson);
  });
};

const setInputPath = function(path) {
  inputPath = path;
  sourceDirs = [`${inputPath}elements`, `${inputPath}mixins`];
};

const setOutputPath = function(path) {
  outputPath = path;
};

module.exports = {
  buildDocs,
  setInputPath,
  setOutputPath
};