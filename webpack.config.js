const path = require('path');

module.exports = {
    mode: 'development',
    // entry: './src/main/typescript/main.ts',
    entry: './src/main/react/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/, // .tsまたは.tsxで終わるファイルに適用
                use: 'ts-loader', // ts-loaderを使用してトランスパイル
                exclude: /node_modules/, // node_modulesディレクトリを除外
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'], // .tsと.tsxと.jsファイルをモジュールとして解決
    },
    output: {
        filename: 'bundle.js', // 出力ファイル名
        path: path.resolve(__dirname, 'src/main/resources/static'), // 出力ディレクトリ
    },
};
