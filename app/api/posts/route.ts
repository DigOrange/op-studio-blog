import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // 创建文章
    const post = await prisma.post.create({
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
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? new Date() : null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
