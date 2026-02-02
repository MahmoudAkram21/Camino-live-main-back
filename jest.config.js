module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/api/**/*.test.js'],
  globalTeardown: '<rootDir>/tests/api/globalTeardown.js',
  verbose: true,
};


