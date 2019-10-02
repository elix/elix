const express = require('express');
const path = require('path');

/*
 * Simplistic static server using Express.
 */
async function start(port) {
  const app = express();
  const rootPath = path.join(__dirname, '..');
  app.use('/', express.static(rootPath));
  let server;
  await new Promise(resolve => {
    server = app.listen(port, resolve);
  });
  return server;
}

module.exports = start;
