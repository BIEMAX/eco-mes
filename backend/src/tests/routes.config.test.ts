import { isFunctionNameValid } from '../main/routes/routes.config';

describe('isFunctionNameValid', () => {
  it('should return the same function name if it does not contain a hyphen', () => {
    const functionName = 'validFunctionName';
    const result = isFunctionNameValid(functionName);
    expect(result).toBe(functionName);
  });

  it('should convert hyphen-separated words to camel case', () => {
    const functionName = 'invalid-function-name';
    const expected = 'invalidFunctionName';
    const result = isFunctionNameValid(functionName);
    expect(result).toBe(expected);
  });
});