import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkBasicAuth, createAuthResponse } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    let posts
    if (tag) {
      posts = await db.getPostsByTag(tag, limit)
    } else if (search) {
      posts = await db.searchPosts(search, limit)
    } else {
      posts = await db.getPosts(limit)
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  if (!checkBasicAuth(request)) {
    return createAuthResponse()
  }

  try {
    const body = await request.json() as { title?: string; content?: string; tags?: string[] }
    const { title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await db.createPost({
      title,
      content,
      tags: tags || [],
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

