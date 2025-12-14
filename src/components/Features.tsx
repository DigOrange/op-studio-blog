'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n-provider'

export default function Features() {
  const t = useTranslations('features')

  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: t('aiTools.title'),
      description: t('aiTools.description'),
      link: '/blog?category=ai-tools',
      iconBgClass: 'bg-indigo-100 dark:bg-indigo-950',
      iconColorClass: 'text-indigo-600 dark:text-indigo-400',
      linkColorClass: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: t('productivity.title'),
      description: t('productivity.description'),
      link: '/blog?category=productivity',
      iconBgClass: 'bg-purple-100 dark:bg-purple-950',
      iconColorClass: 'text-purple-600 dark:text-purple-400',
      linkColorClass: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      title: t('tutorials.title'),
      description: t('tutorials.description'),
      link: '/blog?category=tutorials',
      iconBgClass: 'bg-pink-100 dark:bg-pink-950',
      iconColorClass: 'text-pink-600 dark:text-pink-400',
      linkColorClass: 'text-pink-600 dark:text-pink-400',
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          深入探索 AI 驱动的开发工具
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.iconBgClass} rounded-lg flex items-center justify-center mb-4 ${feature.iconColorClass}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>
              <Link
                href={feature.link}
                className={`${feature.linkColorClass} font-medium hover:underline`}
              >
                了解更多 →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
