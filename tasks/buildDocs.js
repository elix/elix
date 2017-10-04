/*jslint node: true */
'use strict';

const bd = require('./buildDocsHelper');

bd.setInputPath('./');
bd.setOutputPath('./build/Docs/');
bd.buildDocs();