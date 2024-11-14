export default class InvalidEndpointException extends Error {
  statusCode: number = 404;
  constructor(endpoint: string) {
    super(global.t('exception.invalid-endpoint').replace('%s', endpoint));
    this.name = 'InvalidEndpointException';
  }
}