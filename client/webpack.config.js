const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'distro/assets/js'),
        filename: 'main.js',
    },
};