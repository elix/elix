const fs = require('fs').promises;
const path = require('path');

const createDefineModules = require('./createDefineModules.js');
const createLibraryFiles = require('./createLibraryFiles.js');


async function getSourceFiles() {
  const sourceFolder = path.join(__dirname, '../src');
  const files = await fs.readdir(sourceFolder);
  const generatedFiles = [
    'elix.d.ts',
    'elix.js'
  ];
  // Source files have a .js extension. Also, ignore generated files.
  const jsFiles = files.filter(file =>
    path.extname(file) === '.js' &&
    !generatedFiles.includes(file)
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
    const sourceFiles = await getSourceFiles();
    await Promise.all(
      createDefineModules(sourceFiles.components),
      createLibraryFiles(sourceFiles)
    );
  } catch (e) {
    // We have to deal with top-level exceptions.
    console.error(e);
  }  
})();
