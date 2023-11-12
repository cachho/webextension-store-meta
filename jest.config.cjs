module.exports = {
  testEnvironment: 'node',
  // transform: {}, // Disable Babel transformations
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/fixtures.js',
    '!**/node_modules/**',
  ],
}
