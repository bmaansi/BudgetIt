const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
  // Add Babel plugins for optional chaining and nullish coalescing
  ...addBabelPlugins(
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ),
  // Add custom rule to process MUI files with Babel
  (config) => {
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@mui/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        }
      }
    });
    return config;
  }
);
