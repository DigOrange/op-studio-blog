import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n/request'
import { I18nProvider } from '@/lib/i18n-provider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/theme-provider'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // 验证locale是否有效
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // 直接导入消息文件
  let messages
  try {
    messages = (await import(`@/i18n/locales/${locale}.json`)).default
  } catch {
    notFound()
  }

  return (
    <I18nProvider messages={messages} locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        {children}
        <Footer />
      </ThemeProvider>
    </I18nProvider>
  )
}
