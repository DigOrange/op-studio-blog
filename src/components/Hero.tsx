'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n-provider'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* 徽章 */}
          <div className="mb-8 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-4 py-2">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {t('badge')}
            </span>
          </div>

          {/* 主标题 */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mb-10 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
            {t('subtitle')}
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/blog"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              {t('viewBlog')}
            </Link>
            <Link
              href="/about"
              className="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              {t('learnMore')}
            </Link>
          </div>

          {/* 动画装饰元素 */}
          <div className="mt-16 grid grid-cols-3 gap-8 opacity-50">
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-75" />
            </div>
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
