import '@testing-library/jest-dom/vitest'

import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { server }
