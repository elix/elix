import * as fs from "fs/promises";
import path from "path";
import createDefineModules from "./createDefineModules.js";
import createLibraryFiles from "./createLibraryFiles.js";
import createWeekData from "./createWeekData.js";

function baseModuleName(file) {
  const moduleName = path.basename(file, ".js");
  const plainRegex = /^Plain(?<name>.+)/;
  const match = plainRegex.exec(moduleName);
  return match ? match.groups.name : moduleName;
}

// Return the files in the indicated folder sorted into categories.
async function categorizeFiles(folder) {
  const result = {
    components: [],
    helpers: [],
    mixins: [],
  };
  const files = await getJavaScriptFiles(folder);
  files.forEach((file) => {
    const fileName = path.basename(file);
    if (fileName.toLowerCase()[0] === fileName[0]) {
      // Helpers start with lowercase letter.
      result.helpers.push(file);
    } else if (path.basename(fileName, ".js").endsWith("Mixin")) {
      // Mixin names end with "Mixin".
      result.mixins.push(file);
    } else {
      // Component
      result.components.push(file);
    }
  });
  return result;
}

async function createEmptyDefineFolder(defineFolder) {
  try {
    const files = await fs.readdir(defineFolder);
    // If we get this far, the folder already exists.
    // Remove all existing files.
    const removePromises = files.map((file) => {
      const filePath = path.join(defineFolder, file);
      fs.unlink(filePath);
    });
    await Promise.all(removePromises);
  } catch (e) {
    if (e.code === "ENOENT") {
      // Folder doesn't exist; create it.
      await fs.mkdir(defineFolder);
    } else {
      throw e;
    }
  }
}

async function getJavaScriptFiles(folder) {
  /** @type {string[]} */ const files = await fs.readdir(folder);
  // Source files have a .js extension. Also, ignore generated files.
  const generatedFiles = ["elix.js", "weekData.js"];
  const fileNames = files.filter(
    (file) => path.extname(file) === ".js" && !generatedFiles.includes(file)
  );
  const filePaths = fileNames.map((name) => path.join(folder, name));
  return filePaths;
}

function mergeCategorizedFiles(...fileSets) {
  const result = {
    components: [],
    helpers: [],
    mixins: [],
  };
  fileSets.forEach((categorizedFiles) => {
    result.components = mergeFiles(
      result.components,
      categorizedFiles.components
    );
    result.helpers = mergeFiles(result.helpers, categorizedFiles.helpers);
    result.mixins = mergeFiles(result.mixins, categorizedFiles.mixins);
  });
  return result;
}

// Merge two lists of files.
//
// The second list wins file name conflicts: if the second list has a file whose
// name matches a file in the first list, prefer the second file.
//
// In this comparison, we ignore the prefix "Plain" on the base filename, as we
// want PlainFoo to overwrite Foo.
function mergeFiles(files1, files2) {
  const moduleNames2 = files2.map((file) => baseModuleName(file));
  const filesIn1NotIn2 = files1.filter((file) => {
    const moduleName1 = baseModuleName(file);
    return !moduleNames2.includes(moduleName1);
  });
  return [...filesIn1NotIn2, ...files2];
}

const dirname = process.cwd();
const sourceRootFolder = path.join(dirname, "src");
const coreFolder = path.join(dirname, "src/core");
const baseFolder = path.join(dirname, "src/base");
const plainFolder = path.join(dirname, "src/plain");
const defineFolder = path.join(dirname, "define");

// Generate week data file.
await createWeekData(baseFolder);

// Load the source files and categorize them: components/mixins/helpers.
const [coreFiles, baseFiles, plainFiles] = await Promise.all([
  categorizeFiles(coreFolder),
  categorizeFiles(baseFolder),
  categorizeFiles(plainFolder),
]);

// Generate the define modules based on the plain components.
await createEmptyDefineFolder(defineFolder);
await createDefineModules(defineFolder, plainFiles.components);

// Get the set of define components we just generated.
const defineFiles = await categorizeFiles(defineFolder);

// Regular library file does *not* register components.
const regularFiles = mergeCategorizedFiles(coreFiles, baseFiles, plainFiles);

// The define library file *does* register components.
const registerFiles = mergeCategorizedFiles(coreFiles, baseFiles, defineFiles);

await Promise.all([
  createLibraryFiles(regularFiles, sourceRootFolder),
  createLibraryFiles(registerFiles, defineFolder),
]);
