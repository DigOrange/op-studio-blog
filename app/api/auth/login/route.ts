import { NextRequest, NextResponse } from 'next/server'
import {
  validateAdminCredentials,
  updateLastLogin,
  logLoginActivity,
} from '@/lib/auth'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 验证凭证
    const admin = await validateAdminCredentials(email, password)

    if (!admin) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    // 创建会话
    await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      avatarUrl: admin.avatarUrl,
      role: admin.role,
    })

    // 更新登录时间
    await updateLastLogin(admin.id)

    // 记录登录日志
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    await logLoginActivity(admin.id, ip)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '登录失败,请稍后重试' }, { status: 500 })
  }
}
