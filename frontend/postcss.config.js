const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	plugins: [
		postcssFocus(),
		postcssPresetEnv({ browsers: 'last 2 versions' }),
		postcssReporter({ clearMessages: true }),
	]
};