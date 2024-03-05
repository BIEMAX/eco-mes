import { importPackage } from './utils/import-package'
import { validateRoutes } from './routes/routes.config'
import newUUIDv4 from './utils/uuid-gen'

const port = 3000
const packageJson = await importPackage()

const appName =
  " _______  _______  _______         _______  _______  _______  \n" +
  "(  ____ \\(  ____ \\(  ___  )       (       )(  ____ \\(  ____ \\ \n" +
  "| (    \\/| (    \\/| (   ) |       | () () || (    \\/| (    \\/ \n" +
  "| (__    | |      | |   | | _____ | || || || (__    | (_____  \n" +
  "|  __)   | |      | |   | |(_____)| |(_)| ||  __)   (_____  ) \n" +
  "| (      | |      | |   | |       | |   | || (            ) | \n" +
  "| (____/\\| (____/\\| (___) |       | )   ( || (____/\\/\\____) | \n" +
  "(_______/(_______/(_______)       |/     \\|(_______/\\_______) \n"

interface CustomRequest extends Request {
  custom: {
    tsStart: number;
    transactionId?: string;
  };
}

const server = Bun.serve({
  port: port,
  fetch(req: CustomRequest) {
    req.custom = {
      tsStart: performance.now(),
      transactionId: newUUIDv4()
    }
    return validateRoutes(req);
  },
});

console.log(`\u001b[${32}m${appName}\u001b[0m`);
console.log(`\u001b[${32}mCurrent version: ${packageJson.version}\u001b[0m`)
console.log(`\u001b[${32}mServer is running on port ${server.port}\u001b[0m`)
console.log('--------------------------------------------------------------')
console.log(`\u001b[${32}m${"Press Ctrl + C to stop the server"}\u001b[0m`)
console.log('--------------------------------------------------------------')
