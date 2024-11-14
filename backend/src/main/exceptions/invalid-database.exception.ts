export default class InvalidDatabaseConnection extends Error {
  constructor() {
    super(global.t('exception.invalid-mongo-connection'))
    this.name = 'InvalidDatabaseConnection'
  }
}