export default class UserAlreadyExistException extends Error {
  statusCode: number = 409;
  constructor(email: string) {
    super(global.t('exception.user.already-exist').replace('%s', email));
    this.name = 'UserAlreadyExistException';
  }
}