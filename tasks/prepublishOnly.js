const fs = require('fs').promises;
const path = require('path');

const createDefineModules = require('./createDefineModules.js');
const createLibraryFiles = require('./createLibraryFiles.js');
const createWeekData = require('./createWeekData.js');

async function createEmptyDefineFolder(defineFolder) {
  try {
    const files = await fs.readdir(defineFolder);
    // If we get this far, the folder already exists.
    // Remove all existing files.
    const removePromises = files.map(file => {
      const filePath = path.join(defineFolder, file);
      fs.unlink(filePath);
    });
    await Promise.all(removePromises);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // Folder doesn't exist; create it.
      await fs.mkdir(defineFolder);
    } else {
      throw e;
    }
  }
}

async function getSourceFiles(sourceFolder) {
  /** @type {string[]} */ const files = await fs.readdir(sourceFolder);
  const generatedFiles = ['elix.js', 'weekData.js'];
  // Source files have a .js extension. Also, ignore generated files.
  const jsFiles = files.filter(
    file => path.extname(file) === '.js' && !generatedFiles.includes(file)
  );
  // Sort source files into categories.
  const sourceFiles = {
    components: [],
    helpers: [],
    mixins: []
  };
  jsFiles.forEach(file => {
    if (file.toLowerCase()[0] === file[0]) {
      // Helpers start with lowercase letter.
      sourceFiles.helpers.push(file);
    } else if (path.basename(file, '.js').endsWith('Mixin')) {
      // Mixin names end with "Mixin".
      sourceFiles.mixins.push(file);
    } else {
      // Component
      sourceFiles.components.push(file);
    }
  });
  return sourceFiles;
}

(async () => {
  try {
    const sourceFolder = path.join(__dirname, '../src');
    const defineFolder = path.join(__dirname, '../define');
    // Preparation
    const sourceFilesPromise = await getSourceFiles(sourceFolder);
    await Promise.all([
      sourceFilesPromise,
      createEmptyDefineFolder(defineFolder)
    ]);
    const sourceFiles = await sourceFilesPromise; // Resolves immediately
    await Promise.all([
      createDefineModules(defineFolder, sourceFiles.components),
      createLibraryFiles(sourceFolder, defineFolder, sourceFiles),
      createWeekData()
    ]);
  } catch (e) {
    // We have to deal with top-level exceptions.
    console.error(e);
  }
})();
