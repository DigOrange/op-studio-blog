import PostCard from './PostCard'
import { Post, PostTag, Tag } from '@/generated/prisma'

type PostWithTags = Post & {
  postTags: (PostTag & { tag: Tag })[]
}

interface PostListProps {
  posts: PostWithTags[]
  locale?: string
}

export default function PostList({ posts, locale = 'zh' }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          暂无文章,敬请期待...
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} />
      ))}
    </div>
  )
}
