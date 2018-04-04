/*jslint node: true */
'use strict';

const fs = require('fs-extra');
const extendDocs = require('./extendDocs');
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

// Build documentation for source files.
// The paths argument is an object containing:
// * inputPath: The directory to search for source files.
// * outputPath: The directory to write documentation to.
async function buildDocs(paths) {

  const { inputPath, outputPath } = paths;

  const sourcePaths = await sourceFilesInDirectory(inputPath);
  const docs = await docsFromSourceFiles(sourcePaths);
  
  // Skip extending documentation in diagnostic mode.
  if (!WRITE_UNEXTENDEDONLY) {
    extendDocs(docs);
  }
  
  // Clean output folder by removing it then recreating it.
  await removeAsync(outputPath);
  await ensureDirAsync(outputPath);

  await writeDocsToDirectory(docs, outputPath);
  
  if (WRITE_UNEXTENDEDONLY) {
    // Issue an error to note this diagnostic path.
    process.exit(1);
  }
}

// Extract the basic JSDoc documentation from the specified source file.
// This documentation is *not* extended with @mixes or @inherits references.
// Sample result:
//     {
//       'myObject1': {docThing1: 'blah', docThing2: 'blah'},
//       'myObject2': {docThing1: 'blah', docThing2: 'blah'},
//       ...
//     }
async function docsFromSourceFile(filePath) {

  console.log(`Reading ${path.basename(filePath)}`);

  // Extract JSDoc from comments in source file. 
  const jsdocJson = await jsdoc.explain({
    files: filePath
  });

  // Process JSON into something more useful.
  const docs = jsdocParse(jsdocJson);

  if (docs.length === 0) {
    // Return a placeholder.
    const name = path.basename(filePath, '.js');
    return [{
      id: name,
      longname: name,
      name,
      noWrite: true,
      kind: "module",
      description: `Need documentation for ${name}`,
      order: 0
    }];
  }

  return docs;
}

// Given a set of file paths, return a map of file name to the basic JSDoc
// documentation for the objects in those files.
async function docsFromSourceFiles(filePaths) {
  const docs = {};
  await mapPromiseFn(filePaths, async filePath => {
    const name = path.basename(filePath, '.js');
    docs[name] = await docsFromSourceFile(filePath);
  });
  return docs;
}

// Apply the given promise-returning function to each member of the array. Note:
// Versions of before Node 9.x seemed to spin up too many file operations,
// forcing us to execute the promises in sequence. As of 9.x, Node appears to be
// sufficiently smart enough that we can kick off all operations at once.
function mapPromiseFn(array, promiseFn) {
  const promises = array ? array.map(promiseFn) : [];
  return Promise.all(promises);
}

// Return an array of paths for each source file in the given directory.
async function sourceFilesInDirectory(directory) {
  const files = await readdirAsync(directory);
  const javascriptFiles = files.filter(file => file.endsWith('.js'));
  return javascriptFiles.map(file => path.join(directory, file));
}

// Write all docs to the directory specified by the path.
async function writeDocsToDirectory(docs, directory) {
  const objectNames = Object.keys(docs);
  await mapPromiseFn(objectNames, async objectName => {
    const objectDocs = docs[objectName];
    const destinationPath = path.join(directory, `${objectName}.json`);
    await writeFileDocs(objectDocs, destinationPath);
  });
}

// Write documentation for the given source file to the destination.
async function writeFileDocs(objectDocs, destinationPath) {
  const primaryDoclet = objectDocs[0];
  if (primaryDoclet.noWrite) {
    // const objectName = primaryDoclet.name;
    // console.log(`Skipping undocumented ${objectName}`);
    return null;
  }
  // console.log(`Writing ${path.basename(destinationPath)}`);
  await writeJsonAsync(destinationPath, objectDocs, { spaces: 2 });
}


module.exports = buildDocs;


if (require.main === module) {
  // Invoked from command line instead of require().
  // Build docs with default paths.
  buildDocs({
    inputPath: './src',
    outputPath: './build/docs'
  });
}
