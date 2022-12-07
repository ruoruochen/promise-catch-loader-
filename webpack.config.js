const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: path.resolve(__dirname, 'src/index.js') }
        ]
      }
    ]
  }
}