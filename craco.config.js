console.log("✅ craco.config.js loaded");

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert/"),
        os: require.resolve("os-browserify/browser"),
        url: require.resolve("url/")
      };

      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        buffer: require.resolve("buffer/"),
      };

      webpackConfig.resolve.extensions = [
        ...(webpackConfig.resolve.extensions || []),
        '.mjs',
      ];

      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      webpackConfig.plugins.push(new NodePolyfillPlugin());

      return webpackConfig;
    },
  },
};