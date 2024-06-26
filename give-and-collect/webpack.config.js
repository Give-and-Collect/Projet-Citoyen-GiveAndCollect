// webpack.config.js

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // ... autres configurations

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    // Autres options de configuration de Terser
                    compress: {
                        drop_console: true, // Supprimer les console.log() en production
                    },
                },
            }),
        ],
    },
};
