const path = require('path');

const baseConfig = {
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
};

module.exports = [
	{
		...baseConfig,
		output: {
			filename: 'obsidize-logger.js',
			path: path.resolve(__dirname, 'packed'),
			library: {
				name: 'ObsidizeLogger',
				type: 'global',
			},
		},
	},
	{
		...baseConfig,
		output: {
			filename: 'index.cjs',
			path: path.resolve(__dirname, 'dist'),
			library: {
				type: 'commonjs2',
			},
		},
	},
];
