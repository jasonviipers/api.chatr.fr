module.exports = {
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    roots: ['./src'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest'
    }
  };