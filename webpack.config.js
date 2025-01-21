// webpack.config.js file
const path = require("path");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader", // Turns CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js", // 出力ファイル名を bundle.js に指定
    path: path.resolve(__dirname, "dist"), // 出力先ディレクトリ
    publicPath: "/",
    clean: true,
  },
  // plugins: [
  //   new CopyPlugin({
  //     patterns: [
  //       {
  //         from: "static",
  //         to: "static",
  //       },
  //     ],
  //   }),
  // ],
  devServer: {
    static: {
      directory: path.join(__dirname, "/"),
    },
    compress: true,
    port: 9000,
    headers: {
      "Cache-control": "no-store",
    },
  },
};
