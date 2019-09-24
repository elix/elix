// Create modules that export Elix components *and* define them as custom
// elements.
//
// For each component module Foo.js in the /src folder, create a
// corresponding Foo.js file in the /define folder that exports the same
// Foo component, and also defines it as `elix-foo`.


const fs = require('fs').promises;
const path = require('path');


async function createDefineModules(componentFiles) {
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
