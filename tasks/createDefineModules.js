// Create modules that export Elix components *and* define them as custom
// elements.
//
// For each component module Foo.js in the /src folder, create a
// corresponding Foo.js file in the /define folder that exports the same
// Foo component, and also defines it as `elix-foo`.

const fs = require("fs").promises;
const path = require("path");

async function createDefineModules(defineFolder, componentFiles) {
  const modulePromises = componentFiles.map(componentFile => {
    const className = path.basename(componentFile, ".js");
    const tag = tagFromClassName(className);

    // Create JavaScript file.
    const jsContent = `import ${className} from "../src/plain/${className}.js";
export default class Elix${className} extends ${className} {}
customElements.define("${tag}", Elix${className});
`;
    const jsPath = path.join(defineFolder, `${className}.js`);
    const jsPromise = fs.writeFile(jsPath, jsContent);

    // Create TypeScript file.
    const tsContent = `import ${className} from "../src/plain/${componentFile}";
export default ${className};
`;
    const tsPath = path.join(defineFolder, `${className}.d.ts`);
    const tsPromise = fs.writeFile(tsPath, tsContent);

    return Promise.all([jsPromise, tsPromise]);
  });
  await Promise.all(modulePromises);
}

// Given the class name `FooBar`, calculate the tag name `elix-foo-bar`.
function tagFromClassName(className) {
  const uppercaseRegEx = /([A-Z])/g;
  const tag = "elix" + className.replace(uppercaseRegEx, "-$1").toLowerCase();
  return tag;
}

module.exports = createDefineModules;
