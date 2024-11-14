export default class InvalidLanguageException extends Error {
  constructor(language: string) {
    super(global.t('exception.invalid-language').replace('%s', language));
    this.name = 'InvalidLanguageException';
  }
}