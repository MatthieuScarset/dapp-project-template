const path = require('path');

module.exports = {
  entry: './scripts/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  watch: false
};
