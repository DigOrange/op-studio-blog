import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/session'

// GET - 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        parent: true,
        children: true,
        postCategories: {
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

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT - 更新分类
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
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: parseInt(id) },
        },
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // 如果更新父分类，验证不能设置自己为父分类
    if (data.parentId && parseInt(data.parentId) === parseInt(id)) {
      return NextResponse.json(
        { error: 'Category cannot be its own parent' },
        { status: 400 }
      )
    }

    // 如果有父分类，验证父分类是否存在且不会形成循环
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parseInt(data.parentId) },
        include: {
          parent: true,
        },
      })

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        )
      }

      // 简单检查：父分类的父分类不能是当前分类
      if (parentCategory.parentId === parseInt(id)) {
        return NextResponse.json(
          { error: 'This would create a circular reference' },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        parentId: data.parentId ? parseInt(data.parentId) : null,
      },
      include: {
        parent: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE - 删除分类
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

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        children: true,
        postCategories: true,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // 检查是否有子分类
    if (category.children.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. It has ${category.children.length} child categor${category.children.length === 1 ? 'y' : 'ies'}`,
        },
        { status: 400 }
      )
    }

    // 检查是否被使用
    if (category.postCategories.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. It is used by ${category.postCategories.length} post(s)`,
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
