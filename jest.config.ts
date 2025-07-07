import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@scripts/(.*)$': '<rootDir>/scripts/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@batch/(.*)$': '<rootDir>/src/batch/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@queues/(.*)$': '<rootDir>/src/queues/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};

export default config;
