/**
 * Throws an exception when the authorization in request header is missing.
 */
export default class MissingAuthorizationException extends Error {
  statusCode: number = 401;
  constructor() {
    super(global.t('exception.missing-authorization'));
    this.name = 'MissingAuthorizationException';
  }
}