const path = require('path');

module.exports = {
	entry: './src/index.ts',
	mode: 'production',
	target: ['web', 'es5'],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: 'ts-loader',
				exclude: [/node_modules/, /\.test\.ts$/, /\.mock\.ts$/, /src\/test\//],
			},
		],
	},
	resolve: {
		extensions: ['.ts'],
	},
	output: {
		filename: 'index.es5.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			name: 'ObsidizeLogger',
			type: 'global',
		},
	},
};
