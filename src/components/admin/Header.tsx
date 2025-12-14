'use client'

import { useRouter } from 'next/navigation'
import { SessionData } from '@/lib/session'

interface HeaderProps {
  admin: SessionData
}

export default function Header({ admin }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (res.ok) {
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      {/* 标题 */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          管理后台
        </h1>
      </div>

      {/* 用户信息 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          欢迎, {admin.name || admin.email}
        </span>

        {/* 自定义用户头像 */}
        <div className="relative">
          {admin.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={admin.name || admin.email}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {(admin.name || admin.email).charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* 登出按钮 */}
        <button
          onClick={handleLogout}
          className="rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          登出
        </button>
      </div>
    </header>
  )
}
