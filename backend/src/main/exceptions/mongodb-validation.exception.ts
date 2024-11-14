/**
 * Throws an exception when it was a required field that was not filled or a field that was filled with an invalid value.
 */
export default class MongodbValidationException extends Error {
  statusCode: number = 400;
  constructor(message: string) {
    super(message);
    this.name = 'MongodbValidationException';
  }
}