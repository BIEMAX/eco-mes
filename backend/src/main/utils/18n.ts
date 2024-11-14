// import fs from 'fs/promises';
import { promises as fsPromises, constants } from 'fs';

let { mkdir, exists, access, readdir } = fsPromises;
import InvalidLanguageException from '../exceptions/invalid-language.exception';

/**
 * Includes the directory for i18n files
 */
let __i18nDir = 'src/main/i18n';
const __language: string = process.env?.LANGUAGE || 'en';

/**
 * Get available services in the current repository
 * @returns String array
 */
async function getLanguagesFiles(): Promise<string[] | undefined> {
  if (!await exists(__i18nDir)) {
    console.log('No i18n folder/files found');
    return undefined;
  } else {
    const languages = await readdir(__i18nDir);
    return languages;
  }
}

/**
 * Detect the folder with the language files.
 */
async function detectFolder() {
  console.log('1. ')
  if (!await exists('src/main/i18n')) {
    console.log('\t1.1 ')
    if (!await exists('./i18n')) {
      console.log('\t\t1.1.1 ')
      __i18nDir = './i18n';
      await mkdir(__i18nDir);
      console.log('\t\t1.1.1 ')
    }
    console.log('\t1.2 ')
  }
  console.log('2. ')
}

/**
 * Load the translation keys into the global dictionary.
 */
async function loadTranslations () {
  // await detectFolder();
  const languageJsonFile: string = `${__i18nDir}/${__language.toLowerCase()}.json`;
  if (!await exists(languageJsonFile)) {
    console.warn(`No language file found. Must be created manually (default file is ${__language}).`);
    global.translationDictionary = {};
    return;
  }
  const fileContent = await Bun.file(languageJsonFile).json();

  if (fileContent) {
    global.translationDictionary = fileContent;
  } 
  else throw new InvalidLanguageException(__language);
}

/**
 * Translate the term to the desired language
 * @param termToBeTranslated Term to find translation
 * @returns String with translated term
 */
function translate (termToBeTranslated: string) {
  return global.translationDictionary[termToBeTranslated]; 
}

export {
  translate,
  loadTranslations
}