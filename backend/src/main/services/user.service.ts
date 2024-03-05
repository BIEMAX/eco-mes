import InvalidMethodException from "../exceptions/invalid-method.exception"


export function login (request: any) {
  if (request.method !== 'GET') throw new InvalidMethodException('GET', request.method)
  return {
    name: 'John Doe',
    email: 'test@gmail.com',
    token: '1234567890'
  }
}
