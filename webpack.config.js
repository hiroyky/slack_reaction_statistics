
const path = require("path");

const config = {
    mode: 'none',
    target: 'node',
    entry: {
        "main": "./src/main.ts",
    },
    output: {
        libraryTarget: "commonjs",
        filename: "[name].js",
        path: path.join(__dirname, "./dest/")
    },
    externals: [
        "aws-sdk",
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    }
};


module.exports = config;
