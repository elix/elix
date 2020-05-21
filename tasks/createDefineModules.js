const fs = require("fs").promises;
const path = require("path");

// Create modules that export Elix components *and* define them as custom
// elements.
//
// For each component module PlainFoo.js in the /src/plain folder, create a
// corresponding Foo.js file in the /define folder that exports the same
// Foo component, and also defines it as `elix-foo`.
async function createDefineModules(defineFolder, componentFiles) {
  const modulePromises = componentFiles.map((componentFile) => {
    // Strip 'Plain' from beginning of class name.
    const plainClassName = path.basename(componentFile, ".js");
    const plainRegex = /^Plain(?<name>.+)/;
    const match = plainRegex.exec(plainClassName);
    const className = match ? match.groups.name : plainClassName;

    const tag = tagFromClassName(className);

    let relativePath = path.relative(defineFolder, componentFile);
    if (path.sep === "\\") {
      // On Windows: convert backslashes to web-friendly slashes.
      relativePath = relativePath.replace(/\\/g, "/");
    }
    // Include a "." if there's not already a "." at the beginning.
    const importPath =
      relativePath[0] === "." ? relativePath : `./${relativePath}`;

    // Create JavaScript file.
    const jsContent = `import ${plainClassName} from "${importPath}";
export default class Elix${className} extends ${plainClassName} {}
customElements.define("${tag}", Elix${className});
`;
    const jsPath = path.join(defineFolder, `${className}.js`);
    const jsPromise = fs.writeFile(jsPath, jsContent);

    // Create TypeScript file.
    const tsContent = `import ${plainClassName} from "${importPath}";
export default class Elix${className} extends ${plainClassName} {}
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
