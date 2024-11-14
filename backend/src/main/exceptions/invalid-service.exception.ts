export default class InvalidServiceException extends Error {
  statusCode: number = 404;
  constructor(service: string) {
    super(global.t('exception.invalid-service').replace('%s', service));
    this.name = 'InvalidServiceException';
  }
}