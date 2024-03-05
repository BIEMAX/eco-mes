import { readdir, exists } from 'fs/promises'

/**
 * Includes the directory for i18n files
 */
const __i18nDir = 'src/main/i18n'

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

function readYamlFile(file: string) {
  // Read the file
  const fileContent = fs.readFileSync(`${
    __i18nDir
  }/${
    file
  }`, 'utf8')
  // Parse the file
  const fileParsed = yaml.parse(fileContent)
  return fileParsed
}

function readJsonFile (file: string) {
  // Read the file
  const fileContent = Bun.file(file)
}