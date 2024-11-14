typeof import("mongoose");

export {};

declare global {
  /**
   * Connection to the Mongo database.
   */
  var conn: typeof import("mongoose");
  /**
   * i18n translation function
   */
  var t: (key: string) => string;
  /**
   * Translation dictionary based on the language defined in the environment variable LANGUAGE.
   */
  var translationDictionary: { [key: string]: string };
}