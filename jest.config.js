module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    setupFiles: [
      "<rootDir>/src/jest/setEnvVars.js"
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
  };