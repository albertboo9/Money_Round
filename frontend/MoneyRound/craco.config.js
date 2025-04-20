const { ProvidePlugin } = require("webpack");

module.exports = {
  webpack: {
    plugins: [
      new ProvidePlugin({
        React: "react",
      }),
    ],
  },
};