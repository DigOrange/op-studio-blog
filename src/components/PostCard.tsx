import Link from 'next/link'
import { Post, PostTag, Tag } from '@/generated/prisma'

type PostWithTags = Post & {
  postTags: (PostTag & { tag: Tag })[]
}

interface PostCardProps {
  post: PostWithTags
  locale?: string
}

export default function PostCard({ post, locale = 'zh' }: PostCardProps) {
  // 根据语言选择标题和摘要
  const getTitle = () => {
    switch (locale) {
      case 'en':
        return post.titleEn || post.titleZh
      case 'ja':
        return post.titleJa || post.titleZh
      case 'ko':
        return post.titleKo || post.titleZh
      default:
        return post.titleZh
    }
  }

  const getExcerpt = () => {
    switch (locale) {
      case 'en':
        return post.excerptEn || post.excerptZh
      case 'ja':
        return post.excerptJa || post.excerptZh
      case 'ko':
        return post.excerptKo || post.excerptZh
      default:
        return post.excerptZh
    }
  }

  return (
    <article className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      {post.thumbnailUrl && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-800">
          <img
            src={post.thumbnailUrl}
            alt={getTitle() || ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {post.postTags.slice(0, 2).map(({ tag }) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
                color: tag.color || '#6b7280',
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {getTitle()}
          </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {getExcerpt()}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
          <span>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(
                  locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'ko-KR',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )
              : ''}
          </span>
          {post.readingTime && <span>{post.readingTime} 分钟阅读</span>}
        </div>
      </div>
    </article>
  )
}
