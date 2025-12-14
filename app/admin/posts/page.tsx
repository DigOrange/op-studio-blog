import { prisma } from '@/lib/db'
import Link from 'next/link'
import PostsListClient from '@/components/admin/PostsListClient'
import { Prisma } from '@/generated/prisma'

export const dynamic = 'force-dynamic'

interface SearchParams {
  search?: string
  status?: string
  page?: string
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const search = params.search || ''
  const status = params.status || ''
  const page = parseInt(params.page || '1')
  const perPage = 10

  // 构建查询条件
  const where: Prisma.PostWhereInput = {}

  if (search) {
    where.OR = [
      { titleZh: { contains: search, mode: 'insensitive' } },
      { titleEn: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) {
    where.status = status
  }

  // 获取文章列表和总数
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            文章管理
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            共 {total} 篇文章
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建文章
        </Link>
      </div>

      {/* 筛选和搜索 */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <form className="flex flex-wrap gap-4">
          {/* 搜索框 */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              placeholder="搜索文章标题或slug..."
              defaultValue={search}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 状态筛选 */}
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="scheduled">定时发布</option>
            <option value="archived">归档</option>
          </select>

          {/* 筛选按钮 */}
          <button
            type="submit"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            筛选
          </button>

          {/* 重置按钮 */}
          <Link
            href="/admin/posts"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            重置
          </Link>
        </form>
      </div>

      {/* 文章列表 - 使用客户端组件 */}
      <PostsListClient initialData={{ posts, total }} />

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            显示第 <span className="font-medium">{(page - 1) * perPage + 1}</span> 到{' '}
            <span className="font-medium">{Math.min(page * perPage, total)}</span> 条，
            共 <span className="font-medium">{total}</span> 条
          </div>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/posts?page=${page - 1}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                上一页
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/posts?page=${page + 1}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                下一页
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
