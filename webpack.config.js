const path = require('path')
module.exports = {
    devtool: 'eval-source-map',
    mode: 'development',
    entry: './ts/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'ts')]
            }
        ]
    }, resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        publicPath: 'buildBundel',
        filename: 'jsBundle.js',
        path: path.resolve(__dirname, 'buildBundel')
    }
}