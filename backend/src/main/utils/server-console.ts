import { importPackageJson } from './package-json-reader';
import * as os from 'os';

// Get the network interfaces
const networkInterfaces = os.networkInterfaces();
const localIpAddress = networkInterfaces['en0']?.filter((a) => a.family === 'IPv4')[0]?.address || 'localhost'

const port = process.env.CUSTOM_PORT || 3000;
const packageJson = await importPackageJson();

/**
 * To gerenate the ascii art, access: https://www.askapache.com/online-tools/figlet-ascii/
 * 
 * Note: the following model is '+--- basic'
 */
const appName = '\n' +
'd88888b  .o88b.  .d88b.         .88b  d88. d88888b .d8888.  \n' + 
'88\'     d8P  Y8 .8P  Y8.        88\'YbdP`88 88\'     88\'  YP  \n' + 
'88ooooo 8P      88    88        88  88  88 88ooooo `8bo.  \n' +   
'88~~~~~ 8b      88    88 C8888D 88  88  88 88~~~~~   `Y8b.  \n' + 
'88.     Y8b  d8 `8b  d8\'        88  88  88 88.     db   8D  \n' +
'Y88888P  `Y88P\'  `Y88P\'         YP  YP  YP Y88888P `8888Y \n';

/**
 * Start the server in the terminal, printing the current version, api url, start time and how to stop the server.
 */
function startServerConsole () {

  console.log(`\u001b[${32}m \t\t\t${appName}\u001b[0m`);
  console.log(`\u001b[${32}m »\u001b[0m Current version: \t${packageJson.version}`);
  console.log(`\u001b[${32}m »\u001b[0m Api Url: \t\t\u001b[${32}mhttp://localhost:${port}\u001b[0m`);
  console.log(`\u001b[${32}m »\u001b[0m          \t\t\u001b[${32}mhttp://127.0.0.1:${port}\u001b[0m`);
  console.log(`\u001b[${32}m »\u001b[0m          \t\t\u001b[${32}mhttp://${localIpAddress}:${port}\u001b[0m`);
  console.log(`\u001b[${32}m »\u001b[0m Start at: \t\t${new Date().toLocaleString(process.env?.LANGUAGE || 'en-US')}`);
  console.log(`\n\u001b[${32}m${"Press Ctrl + C to stop the server"}\u001b[0m\n`);
}

export {
  startServerConsole
}