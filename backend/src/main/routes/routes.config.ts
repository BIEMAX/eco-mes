import { readdir } from 'fs/promises'
import { logRequestError, logRequestSuccess } from '../utils/request-tracer-log'

/**
 * Get available services in the current repository
 * @returns String array
 */
async function getRoutes() : Promise<string[]> {
  const routes = await readdir('src/main/services')
  return routes.map((r: string) => { return r.replace('.service.ts', '') })
}

/**
 * 
 * @param request 
 * @returns 
 */
async function validateRoutes (request: any) : Promise<Response | any> {
  const routes = await getRoutes()

  const desireRoute = request.url.replace('http://localhost:3000/', '').split('/')

  if (!routes.includes(desireRoute[0])) {
    const errorMessage = `Endpoint '${desireRoute}' not found`
    logRequestError(new Error(errorMessage), request, 404)
  } else {
    const result = import(`../services/${desireRoute[0]}.service.ts`)
      .then((module) => {
        const serviceResponse = module[transcriptFunctionName(desireRoute[1])](request)
        return logRequestSuccess(request, serviceResponse, 200)
      })
      .catch((error: any) => {
        return logRequestError(error, request, 500)
      })
    return result
  }
}

/**
 * Transcript the function name to camel case
 * @param functionName Function name
 * @returns Function name in *.service.ts
 */
function transcriptFunctionName (functionName: string) : string {
  if (functionName.includes('-')) {
    const words = functionName.split('-').map((word) => { return word.charAt(0).toUpperCase() + word.slice(1) })
  }
  return functionName
}

export {
  validateRoutes
}