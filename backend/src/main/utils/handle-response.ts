const _locale: string = process.env.LOCALE || 'en-US';

/**
 * Process the request and print in console/terminal the result (success or error).
 */
function handleResponse (request: Request, data?: any, statusCode?: number): Response {
  if (!statusCode || statusCode <= 0) statusCode = data instanceof Error ? (data as any)?.statusCode || 400 : 400;

  const timeElapsed = elapsedTime(request);
  const dateNow = new Date().toLocaleString(_locale);
  const type: string = data instanceof Error ? 'ERROR' : 'INFO';

  let messageToPrint = `${dateNow}  \u001b[${32}m${type}\u001b[0m  \x1b`;
  messageToPrint += `[35m${request.method}\x1b`;
  messageToPrint += `[0m${addEmptySpaces(request.method)}: \x1b`;
  messageToPrint += `[30m${request.url}\u001b[0m${addEmptySpacesFollowingUrl(request.url)}\x1b`;
  messageToPrint += `[32m${statusCode}\x1b[0m \x1b[36m${timeElapsed}ms\x1b[0m`;
  messageToPrint += (type === 'ERROR' ? `\n\x1b[${31}m${data?.message}\x1b[0m\n\x1b[${31}m${'    ' + (data?.stack || data?.message)}\x1b[0m` : '');

  console.log(messageToPrint);
  return mountResponse(data, statusCode);
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
 * Format the log message to be printed in console
 * @param method Request method
 * @returns White spaces to be used in log
 */
function addEmptySpaces (method: string) {
  switch (method) {
    case 'GET': return '    '
    case 'POST': return '   '
    case 'PUT': return '    '
    case 'DELETE': return ' '
    case 'OPTIONS': return ''
    default: return '\t'
  }
}

/**
 * Format empty spaces to be put into log message.
 * @param url URL requested
 * @returns String with empty spaces to be used in log
 */
function addEmptySpacesFollowingUrl (url: string) {
  return ' '.repeat(50 - url.length)
}

/**
 * Return a response for http request, with data and status
 * @param data Data to return in http request
 * @param statusCode Status code
 * @returns Response object
 */
function mountResponse (data: any, statusCode?: number) : Response {
  const response = data instanceof Error
      ? new Response(JSON.stringify({ message: data.message, stackTrace: data?.stack }), { status: (data as any)?.statusCode || statusCode })
      : new Response(JSON.stringify(data), { status: statusCode });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Content-Type', 'application/json');
  return response;
}

export {
  handleResponse
}