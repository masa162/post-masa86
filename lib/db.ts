import { Post } from './types'
import { D1Database } from '@cloudflare/workers-types'
import '../types/cloudflare'

function getD1(): D1Database | null {
  if (typeof window !== 'undefined') return null
  
  if (process.env.DB) {
    return process.env.DB as D1Database
  }

  return createMockD1()
}

function createMockD1(): D1Database {
  return {
    prepare: () => ({
      bind: () => ({
        all: async () => ({ results: [], success: true, meta: { duration: 0 } }),
        first: async () => null,
        run: async () => ({ success: true, meta: { duration: 0, last_row_id: 0, changes: 0 }, results: [] }),
        raw: async () => [],
      }),
      all: async () => ({ results: [], success: true, meta: { duration: 0 } }),
      first: async () => null,
      run: async () => ({ success: true, meta: { duration: 0, last_row_id: 0, changes: 0 }, results: [] }),
      raw: async () => [],
    }),
    dump: async () => new ArrayBuffer(0),
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 }),
  } as any
}

export const db = {
  async getPosts(limit = 20): Promise<Post[]> {
    try {
      const DB = getD1()
      if (!DB) {
        console.warn('D1 not available')
        return []
      }
      
      const results = await DB.prepare(
        'SELECT * FROM posts ORDER BY created_at DESC LIMIT ?'
      ).bind(limit).all()
      
      return results.results.map((row: any) => ({
        ...row,
        tags: JSON.parse(row.tags || '[]')
      }))
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const DB = getD1()
      if (!DB) {
        console.warn('D1 not available')
        return null
      }
      
      const result = await DB.prepare(
        'SELECT * FROM posts WHERE slug = ?'
      ).bind(slug).first() as any
      
      if (!result) return null
      
      return {
        ...result,
        tags: JSON.parse(result.tags || '[]')
      } as Post
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
  },
}

