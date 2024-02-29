const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  // Set the mode to development or production
  mode: "development",
  // Control how source maps are generated
  // devtool: "inline-source-map",
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  // fix server port 8080
  devServer: {
    port: 8081,
    historyApiFallback: true,
    open: true,
    compress: true,
  }
});
