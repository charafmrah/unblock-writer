module.exports = {
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'\\.(scss|css)$': 'identity-obj-proxy',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	testMatch: ['<rootDir>/test/**/*.test.js'],
	collectCoverageFrom: ['<rootDir>/src/**/*.js'],
	coverageReporters: ['html', 'text-summary'],
};
