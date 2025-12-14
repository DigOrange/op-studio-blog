import Hero from '@/components/Hero'
import Features from '@/components/Features'
import PostList from '@/components/PostList'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // 获取最新的3篇文章
  const posts = await prisma.post.findMany({
    where: {
      status: 'published',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    include: {
      author: {
        select: {
          name: true,
        },
      },
      postTags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <PostList posts={posts} />
    </main>
  )
}
