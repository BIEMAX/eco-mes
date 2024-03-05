import type LogType from '../interfaces/log.interface'

/**
 * Print into console, success message and return a customized response 
 * @param request Request object
 * @param resultData Data to return in http response
 * @param statusCode Status of the code (default = 200)
 */
function logRequestSuccess (request: any, resultData: any, statusCode: number = 200) : Response {
  const url = request.url.replace('http://localhost:3000', '')
  const timeElapsed = elapsedTime(request)
  console.log(`${new Date().toISOString()}  \u001b[${32}m${'INFO'}\u001b[0m  \x1b[35m${request.method}\x1b[0m  : \x1b[30m${url}\u001b[0m \x1b[32m${statusCode}\x1b[0m  \x1b[36m${timeElapsed}ms\x1b[0m`)
  return mountResponse({ data: resultData, status: statusCode }, statusCode)
}

/**
 * Print into console, the error generated from request and return a customized response
 * @param exception Exception generated
 * @param request Request object
 * @param statusCode Status of the code (default = 500)
 */
function logRequestError (exception: Error, request: any, statusCode: number = 500) : Response {
  const url = request.url.replace('http://localhost:3000', '')
  const timeElapsed = elapsedTime(request)
  console.log(`${new Date().toISOString()}  \u001b[${32}m${'ERROR'}\u001b[0m  \x1b[35m${request.method}\x1b[0m  : \x1b[30m${url}\u001b[0m \x1b[32m${statusCode}\x1b[0m  \x1b[36m${timeElapsed}ms\x1b[0m\n\x1b[${31}m${exception.message}\x1b[0m\n\x1b[${31}m${'    ' + exception.stack}\x1b[0m`)
  return mountResponse({ message: exception.message, status: statusCode, stack: exception?.stack }, statusCode)
}

/**
 * Calculate the time elapsed from request start to now
 * @param request Request object
 * @returns Number of milliseconds
 */
function elapsedTime (request: any) : number {
  let timeElapsed = 0;
  if (request?.custom?.tsStart) {
    timeElapsed = performance.now() - request.custom.tsStart
    timeElapsed = timeElapsed.toString().length > 3 ? Number(timeElapsed.toString().slice(0, 5)) : timeElapsed
  }
  return timeElapsed
}

/**
 * Return a response for http request, with data and status
 * @param data Data to return in http request
 * @param status Status code
 * @returns Response object
 */
function mountResponse (data: any, status: number) : Response {
  return new Response(
    JSON.stringify(data),
    { status: status, headers: { 'Content-Type': 'application/json' }}
  )
}

export {
  logRequestSuccess,
  logRequestError
}