const webpack = require('webpack');

const API_HOST = JSON.stringify(process.env.API_HOST || 'http://localhost:3000');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        API_HOST,
      }),
    ],
  },
};
