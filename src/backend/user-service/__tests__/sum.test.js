const sum = require('../src/sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
// This is a unit test for the sum function.
// It checks if the sum of 1 and 2 equals 3.
// The test uses Jest framework for assertions.
// To run the test, use the command: jest src/backend/user-service/__tests__/sum.test.js