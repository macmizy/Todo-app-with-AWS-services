const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'], // File extensions to resolve
    fallback: {
        util: require.resolve('util/')
    },
  },
  
};




