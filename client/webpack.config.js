const path = require('path');

module.exports = {
    entry: {
        './src/js/index.js': './src/js/index.js',
        './src/js/plugin.js': './src/js/plugin.js',
    },
    output: {
        path: path.resolve(__dirname, 'distro/assets'),
        filename: '[name]',
    }
};