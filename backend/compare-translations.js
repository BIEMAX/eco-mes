/**
 * @author: Dionei Beilke dos Santos
 * @version: 1.0.1
 * @description: This script will compare all translations files in the folder and will show the missing keys in the other languages.
 * changelog:
 * - 1.0.0: First version of the script
 * - 1.0.1: Add support for JS and JSON files
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

/**
 * Folder where the translations are stored.
 */
let translationsFolder = './src/i18n/';

/**
 * Language to use as 'model' to verify which keys are missing in other languages.
 */
let defaultLanguage = 'pt';

/**
 * Array with all missing keys in the other languages.
 */
let missingKeys = [];

/**
 * Show the missing keys in a table format.
 */
let showAsTable = true;

/**
 * Create interface to read input from console
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askUserParams () {
  if (!validateDefinition()) {
    rl.question('\n\n1. Folder with translations (default: \'./src/i18n/\'): ', (folder) => {
      rl.question('2. Language to be used as example (default: pt): ', (defaultLanguage) => {
        rl.question('3. Show the missing keys as table (default: true): ', (showAsTable) => {
          translationsFolder = folder || './src/i18n/';
          defaultLanguage = defaultLanguage || 'pt';
          showAsTable = (['false', 'true'].includes(showAsTable.trim().toLowerCase())) || true;

          readFilesFromFolder();
          rl.close();
        });
      });
    });
  }
  else readFilesFromFolder();
}

/**
 * Validate if the folder and default language are defined.
 * @returns true or false
 */
function validateDefinition () {
  console.log('\nValidating if the folder and default language are defined...');
  return (translationsFolder != undefined && translationsFolder.trim() != '') && (defaultLanguage != undefined && defaultLanguage.trim() != '');
}

/**
 * Get all translations files in the folder.
 */
function readFilesFromFolder () {
  const files = fs.readdirSync(translationsFolder);
  const languageFiles = files.filter(file => fs.statSync(path.join(translationsFolder, file)).isFile());
  const languages = languageFiles.map(file => {
    if (!file.toLowerCase().trim().includes('index') && file.length >= 5) {

      const content = fs.readFileSync(path.join(translationsFolder, file), 'utf8')
      const extension = path.extname(file).slice(1);

      return {
        language: file.toLowerCase().replace(`.${extension}`, '').trim(),
        extension: extension,
        content: extension === 'js' ? content.replace('export default', '') : content
      }
    }
  }).filter(l => l !== undefined && l?.language != '');

  if (!languages || languages.length === 0) throw new Error(`No languages found in the folder '${translationsFolder}'. Verified if the files are in the correct folder.`);

  compareTranslations(languages);
}

/**
 * Will compare translations files and show the missing keys in the other languages.
 * @param {Array} languages
 */
function compareTranslations (languages) {
  const defaultLanguageContent = getDefaultLanguageContent(languages);

  // For each language identified, will perform the following loop to compare the keys.
  languages.forEach(l => {
    if (l.language !== defaultLanguage) { // Ignore the default language

      let languageContent = getLanguageContent(l);
      if (typeof(languageContent) === 'string') languageContent = JSON.parse(languageContent);
      // console.log('languageContent: ', languageContent);

      defaultLanguageContent.forEach((key, index) => {
        if (!key.trim().startsWith('//') && !['{', '}', ''].includes(key.trim())) {

          // Get the key to be validate in others translations
          const propertyNameToFound = getTranslatePropertyNameToCheck(l.extension, key);

          if (!showAsTable) {
            console.log(`line: \x1b[35m${index + 1}\x1b[0m  expected: '\x1b[32m${propertyNameToFound}\x1b[0m' \t\t got: '\x1b[31m${'Missing key in the file'}\x1b[0m'`);
            addMissingKey(propertyNameToFound, '', l.language, index);
          } else {
            if (propertyNameToFound != undefined && !Object.prototype.hasOwnProperty.call(languageContent, propertyNameToFound))
              addMissingKey(propertyNameToFound, '', l.language, index);
          }
        }
      });
    }
  });

  if (showAsTable && missingKeys != undefined && missingKeys.length > 0) {
    console.table(missingKeys);
    console.log(`\x1b[31m${'\n\nCompare process have been finish!\n\n'}\x1b[0m`);
  } else {
    console.log(`\x1b[32m${'\n\nNo missing keys found in the other languages.\n\nGreat job!\n'}\x1b[0m`);
  }

  process.exit(0);
}

/**
 * Get the default language content and convert the data base on the file extension.
 * @param {Array} languages
 * @returns Json object or array with the content
 */
function getDefaultLanguageContent (languages) {
  const def = languages.find(l => l.language === defaultLanguage);
  if (def.extension === 'js') {
    return convertJsToJSON(def.content).split('\n');
  } else return def.content.split('\n');
}

/**
 * Get the language content and convert the data base on the file extension
 * @param {object} l Language object
 */
function getLanguageContent (l) {
  if (l.extension === 'js') {
    return convertJsToJSON(l.content);
  }
  else if (l.extension === 'json') return parseContentToJson(l.content);
  else throw new Error(`The extension '${l.extension}' is not supported!`);
}

/**
 * Convert JS object file to JSON
 * @param {string} content
 */
function convertJsToJSON (content) {
  // console.log('l.content: ', l.content)
  const purifiedContent = content.replace(/export default/g, '')
  // Parse the purified content into a JavaScript object
  const obj = eval(`(${purifiedContent})`);
  // Flatten the object
  const flattenedObj = flattenObject(obj);
  // Convert to JSON
  const json = JSON.stringify(flattenedObj, null, 2);
  return json;
}

/**
 * Flatten an object to be used in the JSON file
 * @param {object} obj
 * @param {string} prefix
 * @returns object Object to be flatten
 */
function flattenObject(obj, prefix = '') {
  let flatObj = {};
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flatObj = {
        ...flatObj,
        ...flattenObject(obj[key], `${prefix}${key}.`)
      };
    } else {
      flatObj[`${prefix}${key}`] = obj[key];
    }
  }
  return flatObj;
}

/**
 * Parse an string to JSON object
 * @param {string} content
 * @returns JSON parse object
 */
function parseContentToJson (content) {
  try {
    return JSON.parse(content);
  }
  catch (error) {
    throw new Error(`Error parsing the JSON file of the language '${l.language}'. Verify if the file is a valid JSON file.`);
  }
}

/**
 * Get the JS/JSON property name from the translation file.
 * @param {string} extension Extension of the file
 * @param {string} key Key from the translation file
 * @returns Property name only
 */
function getTranslatePropertyNameToCheck (extension, key) {
  if (['{', '}', ''].includes(key.trim())) return undefined;
  if (extension === 'js') return key = key.split(':')[0].trim().replace(/"/g, '').replace(/'/g, '').trim();
  else if (extension === 'json') return key.split(':')[0].trim().replace(/"/g, '').replace(/'/g, '').trim();
}

/**
 * Add a missing key to the array of missing keys.
 * @param {string} expected String that was to be expected in the line number in the file
 * @param {string} got String that was found in the file or 'Missing key in the file' in the case of missing key
 * @param {string} language Language affected
 * @param {number} line Line number affected
 */
function addMissingKey (expected, got, language, line) {
  missingKeys.push({
    line: line + 1,
    language: language,
    expected: expected,
    got: got || 'Missing key in the file'
  });
}

askUserParams();
