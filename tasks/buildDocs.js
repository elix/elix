/*jslint node: true */
'use strict';

/*
 * Build Elix documentation from JSDoc comments in the source files.
 */

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

/*
 * Top-level entry point for building project documentation from source files.
 * 
 * The paths argument is an object containing:
 * * inputPath: The directory to search for source files.
 * * outputPath: The directory to write documentation to.
 */
async function buildDocs(paths) {

  const { inputPath, outputPath } = paths;

  const sourcePaths = await sourceFilesInDirectory(inputPath);
  const projectDocs = await projectDocsFromSourceFiles(sourcePaths);
  
  // Skip extending documentation in diagnostic mode.
  if (!WRITE_UNEXTENDEDONLY) {
    extendDocs(projectDocs);
  }
  
  // Clean output folder by removing it then recreating it.
  await removeAsync(outputPath);
  await ensureDirAsync(outputPath);

  await writeProjectDocsToDirectory(projectDocs, outputPath);
  
  if (WRITE_UNEXTENDEDONLY) {
    // Issue an error to note this diagnostic path.
    process.exit(1);
  }
}

/*
 * Apply the given promise-returning function to each member of the array. Note:
 * Versions of before Node 9.x seemed to spin up too many file operations,
 * forcing us to execute the promises in sequence. As of 9.x, Node appears to be
 * sufficiently smart enough that we can kick off all operations at once.
 */
function mapPromiseFn(array, promiseFn) {
  const promises = array ? array.map(promiseFn) : [];
  return Promise.all(promises);
}

/*
 * Extract the basic JSDoc documentation from the specified source file.
 * This documentation is *not* extended with @mixes or @inherits references.
 * Sample result:
 *     {
 *       'myObject1': {docThing1: 'blah', docThing2: 'blah'},
 *       'myObject2': {docThing1: 'blah', docThing2: 'blah'},
 *       ...
 *     }
 */
async function objectDocsFromSourceFile(filePath) {

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

/*
 * Given a set of file paths, return a map of file name to the basic JSDoc
 * documentation for the objects in those files.
 */
async function projectDocsFromSourceFiles(filePaths) {
  const docs = {};
  await mapPromiseFn(filePaths, async filePath => {
    const name = path.basename(filePath, '.js');
    docs[name] = await objectDocsFromSourceFile(filePath);
  });
  return docs;
}

/*
 * Return an array of paths for each source file in the given directory.
 */
async function sourceFilesInDirectory(directory) {
  const files = await readdirAsync(directory);
  const javascriptFiles = files.filter(file => file.endsWith('.js'));
  return javascriptFiles.map(file => path.join(directory, file));
}

/*
 * Write documentation for the given source file to the destination.
 */
async function writeObjectDocsToFile(objectDocs, destinationPath) {
  const primaryDoclet = objectDocs[0];
  if (primaryDoclet.noWrite) {
    return null;
  }
  await writeJsonAsync(destinationPath, objectDocs, { spaces: 2 });
}

/*
 * Write all docs to the directory specified by the path.
 */
async function writeProjectDocsToDirectory(projectDocs, directory) {
  const objectNames = Object.keys(projectDocs);
  await mapPromiseFn(objectNames, async objectName => {
    const objectDocs = projectDocs[objectName];
    const destinationPath = path.join(directory, `${objectName}.json`);
    await writeObjectDocsToFile(objectDocs, destinationPath);
  });
}


module.exports = buildDocs;


// Invoked from command line (instead of loaded via require)?
if (require.main === module) {
  // Build docs with default paths.
  buildDocs({
    inputPath: './src',
    outputPath: './build/docs'
  });
}
