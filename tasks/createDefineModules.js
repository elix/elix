// Create modules that export Elix components *and* define them as custom
// elements.
//
// For each component module Foo.js in the /src folder, create a
// corresponding Foo.js file in the /define folder that exports the same
// Foo component, and also defines it as `elix-foo`.


const fs = require('fs').promises;
const path = require('path');


async function getComponentFiles() {
  const srcFolder = path.join(__dirname, '../src');
  const srcFiles = await fs.readdir(srcFolder);
  // Component files have a .js extension, start with an uppercase letter,
  // and have a name that doesn't end with "Mixin".
  const componentFiles = srcFiles.filter(file => {
    return path.extname(file) === '.js' &&
      file.toUpperCase()[0] === file[0] &&
      !path.basename(file, '.js').endsWith('Mixin');
  });
  return componentFiles;
}


async function createDefineModules() {
  const componentFiles = await getComponentFiles();
  const defineFolder = path.join(__dirname, '../define');
  await fs.mkdir(defineFolder, { recursive: true });
  const modulePromises = componentFiles.map(componentFile => {
    const className = path.basename(componentFile, '.js');
    const defineContent = defineSourceFor(className);
    const definePath = path.join(__dirname, '../define', `${className}.js`);
    return fs.writeFile(definePath, defineContent);
  });
  await Promise.all(modulePromises);
}


function defineSourceFor(className) {
  // Given the class name `FooBar`, calculate the tag name `elix-foo-bar`.
  const uppercaseRegEx = /([A-Z])/g;
  const tag = 'elix' + className.replace(uppercaseRegEx, '-$1').toLowerCase();
  return `import ${className} from '../src/${className}.js';
customElements.define('${tag}', ${className});
export default ${className};
`;
}


module.exports = createDefineModules;
