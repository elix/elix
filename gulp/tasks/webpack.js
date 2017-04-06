/*jslint node: true */
'use strict';

const gutil = require('gulp-util');
const webpack = require('webpack');
const glob = require('glob');


const buildTargets = {
  './build/tests.js': {
    globItems: ['./test/**/*.js'],
    includes: [/mixins/, /elements/, /test/]
  },
  './build/elix.js': {
    globItems: ['./globals.js'],
    includes: [/\//]
  },
  './build/demos.js': {
    globItems: ['./globals.js', './demos/src/*.js'],
    includes: [/\//, /demos/]
  }
};

const watchifyTask = function(done) {
  webpackHelperTask({minify: false, watch: true}, done);
};

const webpackTask = function(done) {
  webpackHelperTask({minify: true, watch: false}, done);
};

const debugWebpackTask = function(done) {
  webpackHelperTask({minify: false, watch: false}, done);
};

const webpackHelperTask = function(options, done) {
  let packOptionsArray = [];
  let processedCount = 0;
  let packOptionsCount = 0;

  function packIt(packOptions) {
    webpack(packOptions, function(err, stats) {
      if (err) {
        throw new gutil.PluginError('webpack', err);
      }

      gutil.log(`Processed ${packOptions.entry} and wrote ${packOptions.output.path}${packOptions.output.filename}`);
      //gutil.log('[webpack]', stats.toString({}));
      processedCount++;
      if (processedCount >= packOptionsCount) {
        if (options.watch) {
          // Do not call task completion callback in the watch case
          gutil.log('Now watching for changes...');
        }
        else {
          done();
        }
      }
    });
  }

  gutil.log('Preparing build...');

  /*jshint loopfunc: true */
  for (let key in buildTargets) {
    let entries = [];
    let includes = buildTargets[key].includes;

    buildTargets[key].globItems.forEach(globItem => {
      let a = glob.sync(globItem);
      Array.prototype.push.apply(entries, a);
    });

    let filename = key.split('/').pop();
    if (options.minify) {
      let a = filename.split('.');
      let ext = a.pop();
      filename = '';
      for (let i = 0; i < a.length; i++) {
        filename += a[i];
      }
      filename += '.min.' + ext;
    }
    let packOptions = {
      watch: options.watch,
      entry: entries,
      output: {
        path: key.substring(0, key.lastIndexOf('/') + 1),
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
  debugWebpackTask,
  watchifyTask
};
