'use client'

import { useI18n } from '@/lib/i18n-provider'
import { usePathname, useRouter } from 'next/navigation'
import { locales } from '@/i18n/request'

const languageNames: Record<string, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
}

export default function LanguageSwitcher() {
  const { locale } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageChange = (newLocale: string) => {
    // 移除当前的语言前缀,替换为新的语言前缀
    const currentLocale = locale
    let newPathname = pathname

    // 如果当前路径包含语言前缀,移除它
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPathname = pathname.slice(`/${currentLocale}`.length) || '/'
    }

    // 如果新语言不是默认语言,添加语言前缀
    if (newLocale !== 'zh') {
      newPathname = `/${newLocale}${newPathname}`
    }

    router.push(newPathname)
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Select language"
      >
        <svg
          className="h-5 w-5 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {languageNames[locale]}
        </span>
      </button>

      {/* 下拉菜单 */}
      <div className="absolute right-0 mt-2 w-32 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all dark:bg-gray-800 dark:ring-gray-700">
        {locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
              locale === lang
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {languageNames[lang]}
          </button>
        ))}
      </div>
    </div>
  )
}
