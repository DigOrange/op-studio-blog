import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from './src/lib/session'

// 创建 next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 允许访问登录页
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // 保护 /admin 路由 (不受语言前缀影响)
  if (pathname.startsWith('/admin')) {
    // 获取会话
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(
      request as any,
      response as any,
      sessionOptions
    )

    if (!session.isLoggedIn || !session.adminId) {
      // 重定向到登录页面
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // 保护 API 写操作
  if (pathname.startsWith('/api')) {
    const method = request.method

    // 只检查写操作(POST, PUT, DELETE, PATCH)，但排除认证API
    if (
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) &&
      !pathname.startsWith('/api/auth/')
    ) {
      const response = NextResponse.next()
      const session = await getIronSession<SessionData>(
        request as any,
        response as any,
        sessionOptions
      )

      if (!session.isLoggedIn || !session.adminId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // API 路由不需要 i18n 处理
    return NextResponse.next()
  }

  // 对于前台路由,应用 i18n middleware
  // 排除 admin 和其他特殊路由
  if (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/uploads')
  ) {
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 匹配所有路径,除了以下:
    '/((?!_next|uploads|.*\\..*).*)',
    '/admin/:path*',
    '/api/:path*',
  ],
}
