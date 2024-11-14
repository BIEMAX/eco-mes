import fs from 'fs/promises'
import { handleResponse } from '../utils/handle-response'

import InvalidServiceException from '../exceptions/invalid-service.exception'
import InvalidEndpointException from '../exceptions/invalid-endpoint.exception'

/**
 * Handle the request to validating endpoint and service
 * @param request Request object
 * @returns Promise with response (in case of success) or any (in case of failure).
 */
async function handleRequest (request: Request) : Promise<Response | any> {
  if (request.method === 'OPTIONS') return validateCorsPolicy(request.headers?.get('Origin') || '');
  const routes = await getRoutes();

  const pattern: RegExp = /^https?:\/\/(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost):\d+\/(.*)$/;
  const match = request.url.match(pattern) || '';
  const desireRoute: any = match[1].split('/');

  if (!routes.includes(desireRoute[0])) handleResponse(request, new InvalidEndpointException(desireRoute[0]));

  const controller: string = `../controllers/${desireRoute[0]}.controller.ts`;
  const file = Bun.file(controller)

  if (!file.exists()) throw new InvalidServiceException(desireRoute[0])

  const result = import(controller)
    .then(async (module) => {
      const serviceResponse = await module[transcriptFunctionName(desireRoute[1])](request);
      const statusCode: number = serviceResponse.hasOwnProperty('statusCode') ? serviceResponse?.statusCode : 200;
      return handleResponse(request, serviceResponse, statusCode);
    })
    .catch((error: Error) => {
      if (error.message.includes('module[transcriptFunctionName(desireRoute[1])] is not a function'))
        return handleResponse(request, new InvalidEndpointException(desireRoute[1]));
      return handleResponse(request, error, 500);
    })
  return result
}

/**
 * Return valid response in the case of CORS policy request.
 * @param origin Server origin
 * @returns Response
 */
function validateCorsPolicy (origin: string) {
  return new Response('Departed', {
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    }
  });
}

/**
 * Get available services in the current repository
 * @returns String array
 */
async function getRoutes() : Promise<string[]> {
  const routes = await fs.readdir('src/main/services');
  console.log(routes)
  return routes.map((r: string) => { return r.replace('.service.ts', '') });
}

/**
 * Transcript the function name to camel case
 * @param functionName Function name
 * @returns Function name in *.service.ts
 */
function transcriptFunctionName (functionName: string) : string {
  if (functionName.includes('-')) {
    const words = functionName.split('-').map((word, index) => {
      if (index !== 0) return word.charAt(0).toUpperCase() + word.slice(1) 
      return word
    })
    return words.join('')
  }
  return functionName
}

export {
  handleRequest
}