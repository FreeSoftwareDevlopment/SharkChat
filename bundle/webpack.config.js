const path = require('path');

module.exports = {
  entry: './ws.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ws.bundle.js'
  }
};