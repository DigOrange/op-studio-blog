import { PrismaClient } from '@/generated/prisma'
import { hashPassword } from '../src/lib/auth'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: '密码至少需要8个字符' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码至少需要一个大写字母' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码至少需要一个小写字母' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密码至少需要一个数字' }
  }
  return { valid: true }
}

async function createAdmin() {
  try {
    console.log('=== 创建管理员账户 ===\n')

    // 输入邮箱
    let email = ''
    let emailValid = false
    while (!emailValid) {
      email = await question('请输入邮箱: ')
      if (!email) {
        console.log('❌ 邮箱不能为空')
        continue
      }
      if (!validateEmail(email)) {
        console.log('❌ 邮箱格式无效')
        continue
      }

      // 检查邮箱是否已存在
      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      })

      if (existingAdmin) {
        console.log('❌ 该邮箱已被使用')
        continue
      }

      emailValid = true
    }

    // 输入密码
    let password = ''
    let passwordValid = false
    while (!passwordValid) {
      password = await question('请输入密码 (至少8个字符，包含大小写字母和数字): ')
      if (!password) {
        console.log('❌ 密码不能为空')
        continue
      }

      const validation = validatePassword(password)
      if (!validation.valid) {
        console.log(`❌ ${validation.message}`)
        continue
      }

      // 确认密码
      const confirmPassword = await question('请再次输入密码: ')
      if (password !== confirmPassword) {
        console.log('❌ 两次输入的密码不一致')
        continue
      }

      passwordValid = true
    }

    // 输入名称（可选）
    const name = await question('请输入名称 (可选，直接回车跳过): ')

    // 哈希密码
    console.log('\n正在创建管理员账户...')
    const hashedPassword = await hashPassword(password)

    // 创建管理员
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: name || null,
      },
    })

    console.log('\n✅ 管理员账户创建成功!')
    console.log(`\n账户信息:`)
    console.log(`- ID: ${admin.id}`)
    console.log(`- 邮箱: ${admin.email}`)
    console.log(`- 名称: ${admin.name || '未设置'}`)
    console.log(`- 创建时间: ${admin.createdAt}`)
    console.log(`\n您现在可以使用该账户登录到管理后台。`)
  } catch (error) {
    console.error('\n❌ 创建管理员账户失败:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdmin()
