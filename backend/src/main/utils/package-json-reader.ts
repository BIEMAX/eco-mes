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
async function importPackageJson (): Promise<Package> {
  const content = await Bun.file(fileDir).json();
  return content;
}

export {
  importPackageJson
}