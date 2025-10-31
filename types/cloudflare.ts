import { D1Database } from '@cloudflare/workers-types'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB?: D1Database
      BASIC_AUTH_USER?: string
      BASIC_AUTH_PASS?: string
    }
  }
}

export {}

