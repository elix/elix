const getPort = require('get-port');
const path = require('path');
const StaticServer = require('static-server');

const start = async ({directory}) => {
  const server = new StaticServer({
    rootPath: path.join(directory, '..'),
    port: await getPort()
  });
  await new Promise((resolve) => {server.start(resolve);});
  return {stop: () => server.stop(), port: server.port};
};

module.exports = {start};