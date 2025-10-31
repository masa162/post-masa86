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

export interface PostInput {
  title: string
  content: string
  tags: string[]
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

  async getPostById(id: number): Promise<Post | null> {
    try {
      const DB = getD1()
      if (!DB) return null
      
      const result = await DB.prepare(
        'SELECT * FROM posts WHERE id = ?'
      ).bind(id).first() as any
      
      if (!result) return null
      
      return {
        ...result,
        tags: JSON.parse(result.tags || '[]')
      } as Post
    } catch (error) {
      console.error('Error fetching post by id:', error)
      return null
    }
  },

  async createPost(post: PostInput): Promise<Post> {
    const DB = getD1()
    if (!DB) throw new Error('D1 not available')

    const now = new Date().toISOString()
    
    // Get next slug number
    const lastPost = await DB.prepare(
      'SELECT slug FROM posts ORDER BY id DESC LIMIT 1'
    ).first() as any
    
    let nextNum = 1
    if (lastPost && lastPost.slug) {
      nextNum = parseInt(lastPost.slug) + 1
    }
    const slug = nextNum.toString().padStart(4, '0')

    const result = await DB.prepare(
      'INSERT INTO posts (slug, title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      slug,
      post.title,
      post.content,
      JSON.stringify(post.tags),
      now,
      now
    ).run()

    return {
      id: result.meta.last_row_id,
      slug,
      title: post.title,
      content: post.content,
      tags: post.tags,
      created_at: now,
      updated_at: now,
    }
  },

  async updatePost(id: number, post: PostInput): Promise<Post | null> {
    const DB = getD1()
    if (!DB) throw new Error('D1 not available')

    const now = new Date().toISOString()

    await DB.prepare(
      'UPDATE posts SET title = ?, content = ?, tags = ?, updated_at = ? WHERE id = ?'
    ).bind(
      post.title,
      post.content,
      JSON.stringify(post.tags),
      now,
      id
    ).run()

    return await this.getPostById(id)
  },

  async deletePost(id: number): Promise<boolean> {
    const DB = getD1()
    if (!DB) throw new Error('D1 not available')

    await DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
    return true
  },

  async getPostsByTag(tag: string, limit = 20): Promise<Post[]> {
    try {
      const DB = getD1()
      if (!DB) return []
      
      const results = await DB.prepare(
        "SELECT * FROM posts WHERE tags LIKE ? ORDER BY created_at DESC LIMIT ?"
      ).bind(`%"${tag}"%`, limit).all()
      
      return results.results.map((row: any) => ({
        ...row,
        tags: JSON.parse(row.tags || '[]')
      }))
    } catch (error) {
      console.error('Error fetching posts by tag:', error)
      return []
    }
  },

  async getAllTags(): Promise<string[]> {
    try {
      const DB = getD1()
      if (!DB) return []
      
      const results = await DB.prepare(
        'SELECT DISTINCT tags FROM posts'
      ).all()
      
      const tagSet = new Set<string>()
      results.results.forEach((row: any) => {
        const tags = JSON.parse(row.tags || '[]')
        tags.forEach((tag: string) => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  },

  async searchPosts(query: string, limit = 20): Promise<Post[]> {
    try {
      const DB = getD1()
      if (!DB) return []
      
      const results = await DB.prepare(
        'SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC LIMIT ?'
      ).bind(`%${query}%`, `%${query}%`, limit).all()
      
      return results.results.map((row: any) => ({
        ...row,
        tags: JSON.parse(row.tags || '[]')
      }))
    } catch (error) {
      console.error('Error searching posts:', error)
      return []
    }
  },
}

