import { readFile } from 'fs/promises'

const fileDir = 'package.json'

interface Package {
  name: string,
  version: string,
  description: string
}

/**
 * Import package.json and convert to an object
 * @returns Package package properties
 */
async function importPackage (): Promise<Package> {
  const content = await readFile(fileDir, 'utf-8')
  return JSON.parse(content)
}

export {
  importPackage
}