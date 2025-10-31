import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkBasicAuth, createAuthResponse } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/posts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    const post = await db.getPostById(id)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkBasicAuth(request)) {
    return createAuthResponse()
  }

  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    const body = await request.json() as { title?: string; content?: string; tags?: string[] }
    const { title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await db.updatePost(id, {
      title,
      content,
      tags: tags || [],
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkBasicAuth(request)) {
    return createAuthResponse()
  }

  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    const success = await db.deletePost(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}

