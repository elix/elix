/*jslint node: true */
'use strict';

const fs = require('fs');
const path = require('path');

//
// allPackages is the global array of the element packages in this repo.
// This is all folders inside the ./elements folder that start with the prefix
// "elix-".
//
const PACKAGE_FOLDER = './elements';
let allPackages = fs.readdirSync(PACKAGE_FOLDER).filter(fileName => {
  const filePath = path.join(PACKAGE_FOLDER, fileName);
  const stat = fs.statSync(filePath);
  return stat && stat.isDirectory() && fileName.startsWith('elix-');
});

module.exports = allPackages;
