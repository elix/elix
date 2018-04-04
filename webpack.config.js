const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const demosConfig = {

  devtool: 'source-map',

  mode: 'development',

  entry: {
    'demos': './demos/demos.js',
    'demos.min': './demos/demos.js'
  },

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
        query: {
          plugins: [
            'transform-object-assign',
            'transform-runtime'
          ],
          presets: [
            ['env', {
              targets: {
                browsers: [
                  'last 2 Chrome versions',
                  'last 2 Safari versions',
                  'last 2 Firefox versions',
                  'last 2 Edge versions'
                ]
              }
            }]
          ]
        }
			}
    ]
  },
  
  plugins: [
    new UglifyJsPlugin({
      include: /\.min\.js$/
    })
  ],

  output: {
    filename: '[name].js',
    libraryTarget: 'umd', /* So output can work in Node and in browser */
    path: path.resolve(__dirname, 'build')
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  }

};


const testsConfig = {

  devtool: 'source-map',

  mode: 'production',

  entry: {
    'tests': './test/tests.js',
  },

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
        query: {
          plugins: [
            'transform-object-assign',
            'transform-runtime'
          ],
          presets: [
            ['env', {
              targets: {
                browsers: [
                  'last 2 Chrome versions',
                  'last 2 Safari versions',
                  'last 2 Firefox versions',
                  'last 2 Edge versions'
                ]
              }
            }]
          ]
        }
			}
    ]
  },
  
  output: {
    filename: '[name].js',
    libraryTarget: 'umd', /* So output can work in Node and in browser */
    path: path.resolve(__dirname, 'build')
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  }
  
};


module.exports = [ demosConfig, testsConfig ];