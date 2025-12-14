import { NextResponse } from 'next/server'
import { destroySession, getCurrentAdmin } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // 获取当前用户(用于日志)
    const admin = await getCurrentAdmin()

    // 记录登出日志
    if (admin?.adminId) {
      await prisma.activityLog.create({
        data: {
          adminId: admin.adminId,
          action: 'logout',
          description: '管理员登出',
        },
      })
    }

    // 销毁会话
    await destroySession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: '登出失败' }, { status: 500 })
  }
}
