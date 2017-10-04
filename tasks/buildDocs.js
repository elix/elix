/*jslint node: true */
'use strict';

const bd = require('./buildDocsHelper');

bd.setInputPath('./');
bd.setOutputPath('./build/docs/');
bd.buildDocs();