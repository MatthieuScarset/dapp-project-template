const path = require('path');

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 9000,
  },
  entry: [
    './scripts/main.js',
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  watch: false
};
