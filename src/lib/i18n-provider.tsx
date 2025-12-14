'use client'

import { createContext, useContext } from 'react'

type Messages = Record<string, any>

const I18nContext = createContext<{
  locale: string
  messages: Messages
}>({
  locale: 'zh',
  messages: {},
})

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode
  locale: string
  messages: Messages
}) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

export function useTranslations(namespace?: string) {
  const { messages } = useI18n()

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    const keys = fullKey.split('.')
    let value: any = messages

    for (const k of keys) {
      value = value?.[k]
    }

    return value || fullKey
  }
}
