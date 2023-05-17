module.exports = {
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'\\.(scss|css)$': 'identity-obj-proxy',
	},
	setupFilesAfterEnv: [ '<rootDir>/jest.setup.js' ],
};
