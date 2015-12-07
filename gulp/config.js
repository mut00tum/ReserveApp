var path    = require('path');
var webpack = require("webpack");

var src = './src';  // ソースディレクトリ
var dest = './build'; // 出力先ディレクトリ
var relativeSrcPath  = path.relative('.', src);
var relativeDestPath = path.relative('.', dest);

module.exports = {
  // 出力先の指定
  dest: dest,

  // jsのビルド設定
  js: {
    src: src + '/files/js/**/*.js',
    dest: dest
  },

  sass: {
    src: src + '/files/scss/**/*scss',
    dest: dest
  },

  html: {
    dest: dest + '/**/*.html'
  },

  watch: {
    sass: relativeSrcPath  + '/files/scss/**/*scss',
    js  : relativeSrcPath  + '/files/js/**/*.js',
    html: relativeDestPath + '/**/*.html'
  },

  // webpackの設定
  webpack: {
    entry: src + '/files/js/app.js',
    output: {
      filename: dest + '/files/js/app.js'
    },  
    resolve: {
        root: [
            path.join( process.cwd(), 'node_modules')
        ],
        extensions: ['', '.js', '.html'],
        modulesDirectories: ['node_modules'],
        alias: {
            npm: process.cwd() + 'node_modules',
            TweenLite: process.cwd() + '/node_modules/gsap/src/uncompressed/TweenLite.js',
            TweenMax: process.cwd() + '/node_modules/gsap/src/uncompressed/TweenMax.js',
            TimelineLite: process.cwd() + '/node_modules/gsap/src/uncompressed/TimelineLite.js',
            TimelineMax: process.cwd() + '/node_modules/gsap/src/uncompressed/TimelineMax.js'
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        // ▼ bowerのmoduleをrequireで使う
        // new webpack.ResolverPlugin(
        //     new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        // ),
        // ▼ ライブラリ間で依存しているモジュールが重複している場合、二重に読み込まないようにする
        new webpack.optimize.DedupePlugin(),
        // ▼ ファイルを細かく分析し、まとめられるところはできるだけまとめてコードを圧縮する
        new webpack.optimize.AggressiveMergingPlugin(),
        // ▼ 指定した変数を他のモジュール内で使用
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            jquery: "jquery"
        })
    ]
  }
}