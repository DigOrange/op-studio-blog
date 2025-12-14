import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { Admin } from '@/generated/prisma'

// 验证密码
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// 哈希密码
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// 通过邮箱获取管理员
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  return prisma.admin.findUnique({
    where: { email },
  })
}

// 验证管理员凭证
export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<Admin | null> {
  const admin = await getAdminByEmail(email)

  if (!admin) {
    return null
  }

  const isValid = await verifyPassword(password, admin.passwordHash)

  if (!isValid) {
    return null
  }

  return admin
}

// 更新最后登录时间
export async function updateLastLogin(adminId: number): Promise<void> {
  await prisma.admin.update({
    where: { id: adminId },
    data: { lastLoginAt: new Date() },
  })
}

// 记录登录活动
export async function logLoginActivity(
  adminId: number,
  ipAddress?: string
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      adminId,
      action: 'login',
      description: '管理员登录',
      ipAddress,
    },
  })
}

// 验证密码强度(可选)
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('密码长度至少8个字符')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密码必须包含至少一个数字')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
