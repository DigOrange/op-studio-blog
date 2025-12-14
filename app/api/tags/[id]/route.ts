import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/session'

// GET - 获取单个标签
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        postTags: {
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                titleZh: true,
                titleEn: true,
                status: true,
              },
            },
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

// PUT - 更新标签
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

    // 如果更新 slug，检查是否已存在
    if (data.slug) {
      const existingTag = await prisma.tag.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: parseInt(id) },
        },
      })

      if (existingTag) {
        return NextResponse.json(
          { error: 'Tag with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        color: data.color || null,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

// DELETE - 删除标签
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

    // 检查标签是否被使用
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        postTags: true,
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    if (tag.postTags.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag. It is used by ${tag.postTags.length} post(s)`,
        },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
