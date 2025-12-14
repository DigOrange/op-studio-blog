'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import ImageUpload from '@/components/admin/ImageUpload'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'zh' | 'en' | 'ja' | 'ko'>('zh')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>('draft')
  const [scheduledDate, setScheduledDate] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  // Markdown content state
  const [contentZh, setContentZh] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [contentJa, setContentJa] = useState('')
  const [contentKo, setContentKo] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const data = {
      slug: formData.get('slug'),
      titleZh: formData.get('titleZh'),
      titleEn: formData.get('titleEn'),
      titleJa: formData.get('titleJa'),
      titleKo: formData.get('titleKo'),
      contentZh: contentZh || null,
      contentEn: contentEn || null,
      contentJa: contentJa || null,
      contentKo: contentKo || null,
      excerptZh: formData.get('excerptZh'),
      excerptEn: formData.get('excerptEn'),
      excerptJa: formData.get('excerptJa'),
      excerptKo: formData.get('excerptKo'),
      thumbnailUrl: thumbnailUrl || null,
      coverUrl: coverUrl || null,
      status: status,
      scheduledAt: status === 'scheduled' && scheduledDate ? new Date(scheduledDate).toISOString() : null,
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create post')

      router.push('/admin/posts')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('创建文章失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          新建文章
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          填写文章信息并发布
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            基本信息
          </h3>

          {/* Slug */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              required
              placeholder="url-friendly-slug"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              文章的URL路径,只能包含小写字母、数字和连字符
            </p>
          </div>

          {/* 状态 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              状态
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled' | 'archived')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">草稿</option>
              <option value="published">立即发布</option>
              <option value="scheduled">定时发布</option>
              <option value="archived">归档</option>
            </select>
          </div>

          {/* 定时发布时间 */}
          {status === 'scheduled' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                发布时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                文章将在指定时间自动发布
              </p>
            </div>
          )}

          {/* 缩略图 */}
          <div>
            <ImageUpload
              label="缩略图"
              onUpload={setThumbnailUrl}
              currentImage={thumbnailUrl}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              用于文章列表展示(推荐尺寸: 1200x630)
            </p>
          </div>

          {/* 封面图 */}
          <div>
            <ImageUpload
              label="封面图"
              onUpload={setCoverUrl}
              currentImage={coverUrl}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              用于文章详情页顶部(推荐尺寸: 1920x1080)
            </p>
          </div>
        </div>

        {/* 多语言内容 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            文章内容
          </h3>

          {/* 语言切换标签 */}
          <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'zh', label: '简体中文' },
              { key: 'en', label: 'English' },
              { key: 'ja', label: '日本語' },
              { key: 'ko', label: '한국어' },
            ].map((lang) => (
              <button
                key={lang.key}
                type="button"
                onClick={() => setActiveTab(lang.key as 'zh' | 'en' | 'ja' | 'ko')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === lang.key
                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* 中文内容 */}
          {activeTab === 'zh' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  标题
                </label>
                <input
                  type="text"
                  name="titleZh"
                  placeholder="文章标题"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  摘要
                </label>
                <textarea
                  name="excerptZh"
                  rows={3}
                  placeholder="文章摘要..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  内容 (Markdown)
                </label>
                <MarkdownEditor
                  value={contentZh}
                  onChange={setContentZh}
                  placeholder="使用 Markdown 编写文章内容..."
                />
              </div>
            </div>
          )}

          {/* 英文内容 */}
          {activeTab === 'en' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="titleEn"
                  placeholder="Post title"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Excerpt
                </label>
                <textarea
                  name="excerptEn"
                  rows={3}
                  placeholder="Post excerpt..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content (Markdown)
                </label>
                <MarkdownEditor
                  value={contentEn}
                  onChange={setContentEn}
                  placeholder="Write your post content in Markdown..."
                />
              </div>
            </div>
          )}

          {/* 日文内容 */}
          {activeTab === 'ja' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  タイトル
                </label>
                <input
                  type="text"
                  name="titleJa"
                  placeholder="記事のタイトル"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  抜粋
                </label>
                <textarea
                  name="excerptJa"
                  rows={3}
                  placeholder="記事の抜粋..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  内容 (Markdown)
                </label>
                <MarkdownEditor
                  value={contentJa}
                  onChange={setContentJa}
                  placeholder="Markdownで記事を書く..."
                />
              </div>
            </div>
          )}

          {/* 韩文内容 */}
          {activeTab === 'ko' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  제목
                </label>
                <input
                  type="text"
                  name="titleKo"
                  placeholder="게시물 제목"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  발췌
                </label>
                <textarea
                  name="excerptKo"
                  rows={3}
                  placeholder="게시물 발췌..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  내용 (Markdown)
                </label>
                <MarkdownEditor
                  value={contentKo}
                  onChange={setContentKo}
                  placeholder="Markdown으로 게시물 작성..."
                />
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {loading ? '创建中...' : '创建文章'}
          </button>
        </div>
      </form>
    </div>
  )
}
