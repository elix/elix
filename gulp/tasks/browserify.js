/*jslint node: true */
/*jshint loopfunc: true */
'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const glob = require('glob');
const browserify = require('browserify');
const watchify = require('watchify');
const buffer = require('vinyl-buffer');
const vinylStream = require('vinyl-source-stream');
const sourceMaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const allPackages = require('../lib/allPackages');

//
// Build the global buildList object for use in browserifyTask
//
function buildBuildList() {
  const buildList = {
    'build/tests.js': allPackages.map(pkg => `elements/${pkg}/test/*.js`)
  };
  allPackages.forEach(pkg => {
    buildList[`elements/${pkg}/dist/${pkg}.js`] = [`elements/${pkg}/globals.js`];
  });

  return buildList;
}
const buildList = buildBuildList();

const watchifyTask = function(done) {
  browserifyHelperTask(true, done);
};

const browserifyTask = function(done) {
  browserifyHelperTask(false, done);
};

const browserifyHelperTask = function(watch, done) {
  let processedCount = 0;
  let bundlerCount = 0;
  let bundlers = [];
  
  function bundleIt(bundler) {
    bundler.bundler
      .bundle()
      .pipe(vinylStream(bundler.outputFile))
      .pipe(buffer()) // Convert to gulp pipeline
      .pipe(sourceMaps.init({loadMaps : true})) // Strip inline source maps
      .pipe(uglify())   // Minimize
      .on('error', gutil.log)
      .pipe(sourceMaps.write('./')) // Relative to bundler.outputDir below
      .pipe(gulp.dest(bundler.outputDir))
      .on('end', function() {
        gutil.log(`Processed ${bundler.source} and wrote ${bundler.outputDir}${bundler.outputFile}`);
        processedCount++;
        if (processedCount >= bundlerCount) {
          if (watch) {
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
  
  for (let key in buildList) {
    let entries = [];
    
    buildList[key].forEach(globItem => {
      let a = glob.sync(globItem);
      Array.prototype.push.apply(entries, a);
    });
    
    const props = watch ? {
        entries: entries,
        debug: true,
        cache: {},
        packageCache: {},
        plugin: [watchify]
      } : {
        entries: entries,
        debug: true
      };

    let bundler = browserify(props);
    if (watch) {
      bundler.on('update', function() {
        bundleIt(this.bundlerData);
      });
    }
    
    let bundlerData = {
      bundler: bundler,
      source: entries,
      outputFile: key.split('/').pop(),
      outputDir: key.substring(0, key.lastIndexOf('/') + 1)
    };
    
    // Attach bundlerData to the bundler object so we can fetch
    // details about the bundler in the update event
    bundler.bundlerData = bundlerData;
    
    bundlers.push(bundlerData);
  }
  
  bundlerCount = bundlers.length;
  
  bundlers.forEach(bundler => {
    //
    // Remember: we have .babelrc in the root specifying the ES2015 preset,
    // and the babelify transform specified in package.json.
    // This was necessary for the Grunt build. The following line is
    // therefore unnecessary:
    //
    // bundler.bundler.transform(babelify, {presets: ['es2015']});
    
    bundleIt(bundler);
  });
};

module.exports = {browserifyTask: browserifyTask, watchifyTask: watchifyTask};
