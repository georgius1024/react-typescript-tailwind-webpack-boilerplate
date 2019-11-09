const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const paths = {
  src: path.join(__dirname, 'src')
}

module.exports = (env, arg) => {
  const production = arg.mode === 'production'
  return {
    entry: {
      index: './src/index.js',
      vendor: ['react', 'react-dom']
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: production ? '[name].[hash].js' : '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !production
              }
            },
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public', 'index.html'),
        fileName: './index.html',
        inject: true,
        hash: true
      }),
      new MiniCssExtractPlugin({
        filename: production ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: production ? '[id].[contenthash].css' : '[id].css',
        ignoreOrder: false
      }),
      new PurgecssPlugin({
         paths: glob.sync(`${paths.src}/**/*`, { nodir: true })
      })
    ],
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin(), new UglifyJsPlugin()],
      splitChunks: {
        chunks: 'async',
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        name: true,
        cacheGroups: {
          vendors: {
            chunks: 'initial',
            name: 'vendor',
            test: 'vendor',
            enforce: true
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    devServer: {
      contentBase: './public',
      publicPath: '/',
      hot: true,
      open: true
    }
  }
}
