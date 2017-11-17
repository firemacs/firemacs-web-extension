const path = require('path');

module.exports = {
    watch: true,
    devtool: 'inline-cheap-module-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'background.js'
    },
    module: {
        rules: [
            {
                test: /src\/.*\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
