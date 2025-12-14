import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'

// 会话数据类型
export interface SessionData {
  adminId: number
  email: string
  name?: string
  avatarUrl?: string
  role: string
  isLoggedIn: boolean
  loginTime?: number // Unix timestamp
}

// 默认会话数据
export const defaultSession: SessionData = {
  adminId: 0,
  email: '',
  isLoggedIn: false,
  role: 'admin',
}

// 会话配置
export const sessionOptions = {
  password: process.env.SESSION_SECRET || '',
  cookieName: process.env.SESSION_NAME || 'admin_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: parseInt(process.env.SESSION_TTL || '604800'), // 7天
    path: '/',
  },
}

// 验证配置
if (!sessionOptions.password || sessionOptions.password.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters')
}

// 获取会话
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

// 验证是否已登录
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session.isLoggedIn === true && !!session.adminId
}

// 获取当前管理员信息
export async function getCurrentAdmin(): Promise<SessionData | null> {
  const session = await getSession()
  if (!session.isLoggedIn || !session.adminId) {
    return null
  }
  return {
    adminId: session.adminId,
    email: session.email,
    name: session.name,
    avatarUrl: session.avatarUrl,
    role: session.role,
    isLoggedIn: session.isLoggedIn,
    loginTime: session.loginTime,
  }
}

// 创建会话
export async function createSession(admin: {
  id: number
  email: string
  name?: string | null
  avatarUrl?: string | null
  role: string
}): Promise<void> {
  const session = await getSession()

  session.adminId = admin.id
  session.email = admin.email
  session.name = admin.name || undefined
  session.avatarUrl = admin.avatarUrl || undefined
  session.role = admin.role
  session.isLoggedIn = true
  session.loginTime = Date.now()

  await session.save()
}

// 销毁会话
export async function destroySession(): Promise<void> {
  const session = await getSession()
  session.destroy()
}
