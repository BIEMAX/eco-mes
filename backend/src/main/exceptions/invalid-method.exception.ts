export default class InvalidMethodException extends Error {
  /**
   * Throws exception when method is not allowed (invalid method)
   * @param expected Method expected
   * @param got Method got
   */
  constructor(expected: string, got: string) {
    super(`Method '${got}' not allowed. '${expected}' expected instead.`)
    this.name = 'InvalidMethodException'
  }
}