# Profile Website

## Follow these instructions

1. Install Node.js and npm. You can download them from the official Node.js website.
2. Initialize NPM.
```shell
npm init -y
```
3. Install Required Packages.
```shell
npm install -D @swc/core @swc/cli webpack webpack-cli webpack-dev-server swc-loader
npm install p5
npm install --save-dev sass-loader sass style-loader css-loader
```
4. Create a `.swcrc` file to setup SWC.
```json
// .swcrc file
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
    }
  }
}
```
5. Create a `webpack.config.js` file to setup Webpack.
```js
// webpack.config.js file
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'swc-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader',   // Turns CSS into CommonJS
          'sass-loader'   // Compiles Sass to CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist',
  },
};
```
6. Start developing in `src/index.ts`.
7. Run the dev server.
```shell
npm run start
```

## How to develop

Start off by creating a simple website with minimal SCSS.

Learn how to use Chrome devtools and Safari devtools to see what SCSS and HTML the website uses to create cool effects.

[Keita Yamada on X: "そういえば喋ってなかった、俺がよくやるスクロール連動アニメーションの話。ブラウザデフォルトのスクロールは発生しないようにしつつ、gsapのtimeline機能を使って画像とかテキスト切り替えのアニメーションを作る。timelineのpausedプロパティをtrueにしておいて、自動で再生されないようにする。例" / X](https://x.com/P5_keita/status/1845705308146151922)

GSAP, Tweakpane, Alpine.js を自分で検索して使ってみて何かを作ってみよう。
