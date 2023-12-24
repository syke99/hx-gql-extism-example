const path = require('path');

module.exports = {
    entry: './src/js/client/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
};