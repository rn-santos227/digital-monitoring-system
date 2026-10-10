import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import { createEvent } from 'h3'

/** Creates an in-memory HTTP event without opening a port or making a request. */
export const createTestEvent = (
  path = '/api/test',
  method = 'GET',
  headers: Record<string, string> = {},
) => {
  const request = new IncomingMessage(new Socket())
  request.url = path
  request.method = method
  request.headers = { host: 'unit.example.test', ...headers }
  return createEvent(request, new ServerResponse(request))
}
