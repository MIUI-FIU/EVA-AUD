const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      
      // Add the rule to handle ESM modules
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,  // Disable the need for fully specified imports
        },
      });

      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          "net": false,
          "tls": false,
          "dns": false,
          "pg": false,
          "memjs": false,
          "redis": false,
          "fs": false,
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer"),
          "assert": require.resolve("assert"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "url": require.resolve("url"),
          "path": require.resolve("path-browserify"),
          "zlib": require.resolve("browserify-zlib")
        }
      };

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ];

      return webpackConfig;
    }
  }
};