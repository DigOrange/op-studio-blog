import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/session'

// GET - 获取所有标签
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const tags = await prisma.tag.findMany({
      where,
      include: {
        postTags: {
          select: {
            postId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 添加使用统计
    const tagsWithCount = tags.map((tag) => ({
      ...tag,
      postCount: tag.postTags.length,
    }))

    return NextResponse.json(tagsWithCount)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST - 创建新标签
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // 验证必填字段
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // 检查 slug 是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { slug: data.slug },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this slug already exists' },
        { status: 400 }
      )
    }

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        color: data.color || null,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
