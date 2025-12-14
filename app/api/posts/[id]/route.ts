import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/session'

// GET - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        slug: data.slug,
        titleZh: data.titleZh || null,
        titleEn: data.titleEn || null,
        titleJa: data.titleJa || null,
        titleKo: data.titleKo || null,
        contentZh: data.contentZh || null,
        contentEn: data.contentEn || null,
        contentJa: data.contentJa || null,
        contentKo: data.contentKo || null,
        excerptZh: data.excerptZh || null,
        excerptEn: data.excerptEn || null,
        excerptJa: data.excerptJa || null,
        excerptKo: data.excerptKo || null,
        thumbnailUrl: data.thumbnailUrl || null,
        coverUrl: data.coverUrl || null,
        status: data.status,
        publishedAt:
          data.status === 'published' && !data.publishedAt
            ? new Date()
            : data.publishedAt,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.post.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
