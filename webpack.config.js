// webpack.config.js file
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "swc-loader",
        exclude: /node_modules/,
      },
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
  // output: {
  //   filename: "main.js", // 出力ファイル名を main.js に指定
  //   path: path.resolve(__dirname, "public"), // 出力先ディレクトリ
  // },
  devServer: {
    static: {
      directory: path.join(__dirname, "/"),
    },
    compress: true,
    port: 9000,
  },
};
