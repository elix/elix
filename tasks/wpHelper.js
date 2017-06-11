/*jslint node: true */
'use strict';

const webpack = require('webpack');
const glob = require('glob');
const path = require('path');

let buildTargets = null;

function buildBuildTargets(options) {
  const demosPath = path.resolve('./build/demos.js');
  const testsPath = path.resolve('./build/tests.js');
  const elixPath = path.resolve('./build/elix.js');

  if (options.minify) {
    buildTargets = {
      [`${demosPath}`]: {
        globItems: ['./demos/demos.js'],
        includes: [/\//, /demos/]
      }
    };
  }
  else {
    buildTargets = {
      [`${testsPath}`]: {
        globItems: ['./test/tests.js'],
        includes: [/mixins/, /elements/, /test/]
      },
      [`${elixPath}`]: {
        globItems: ['./globals.js'],
        includes: [/\//]
      },
      [`${demosPath}`]: {
        globItems: ['./demos/demos.js'],
        includes: [/\//, /demos/]
      }
    };
  }
}

const watchifyTask = function() {
  webpackHelperTask({watch: true});
};

const webpackTask = function() {
  let promise = new Promise((resolve, reject) => {
    webpackHelperTask({watch: false}, resolve);
  });

  return promise;
};

const webpackHelperTask = function(options, done) {
  let packOptionsArray = [];
  let processedCount = 0;
  let packOptionsCount = 0;

  function packIt(packOptions) {
    webpack(packOptions, function(err, stats) {
      if (err) {
        throw new Error(`webpack: ${err}`);
      }

      console.log(`Processed ${packOptions.entry} and wrote ${packOptions.output.path}${packOptions.output.filename}`);
      //console.log('[webpack]', stats.toString({}));
      processedCount++;
      if (processedCount >= packOptionsCount) {
        if (options.watch) {
          // Do not call task completion callback in the watch case
          console.log('Now watching for changes...');
        }
        else {
          if (!options.minify) {
            options.minify = true;
            webpackHelperTask(options, done);
          }
          else if (done) {
            done();
          }
        }
      }
    });
  }

  if (options.minify) {
    console.log('preparing build for demos.min.js...');
  }
  else {
    console.log('Preparing build...');
  }

  buildBuildTargets(options);

  /*jshint loopfunc: true */
  for (let key in buildTargets) {
    let entries = [];
    let includes = buildTargets[key].includes;

    buildTargets[key].globItems.forEach(globItem => {
      let a = glob.sync(globItem);
      Array.prototype.push.apply(entries, a);
    });

    let filename = path.basename(key);
    if (options.minify) {
      let ext = path.extname(filename);
      filename = path.basename(filename, ext) + '.min' + ext;
    }
    let packOptions = {
      watch: options.watch,
      entry: entries,
      output: {
        path: path.dirname(key) + path.sep,
        filename: filename,
        sourceMapFilename: filename + '.map'
      },
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: includes,
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      plugins: options.minify ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false // https://github.com/webpack/webpack/issues/1496
          }
        })
      ] :
      []
    };

    packOptionsArray.push(packOptions);
  }

  packOptionsCount = packOptionsArray.length;

  packOptionsArray.forEach(packOptions => {
    packIt(packOptions);
  });
};

module.exports = {
  webpackTask,
  watchifyTask
};
