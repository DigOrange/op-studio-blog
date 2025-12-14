import { PrismaClient } from '@/generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化数据库...')

  // 检查是否已存在管理员
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@op-studio.com' },
  })

  if (existingAdmin) {
    console.log('✅ 管理员账号已存在，跳过创建')
    return
  }

  // 管理员密码
  const password = 'OP工作室2024!'
  const passwordHash = await bcrypt.hash(password, 10)

  // 创建管理员账号
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@op-studio.com',
      passwordHash: passwordHash,
      name: 'OP工作室 Admin',
      role: 'admin',
    },
  })

  console.log('✅ 管理员账号创建成功!')
  console.log('\n📧 登录信息:')
  console.log('   邮箱: admin@op-studio.com')
  console.log('   密码: OP工作室2024!')
  console.log('\n⚠️  请在生产环境中修改默认密码!\n')

  // 创建一些示例分类
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'AI工具',
        slug: 'ai-tools',
        description: 'AI自动化工具介绍与使用指南',
      },
      {
        name: '生产力',
        slug: 'productivity',
        description: '开发者生产力提升技巧',
      },
      {
        name: '教程',
        slug: 'tutorials',
        description: '深度技术教程',
      },
    ],
  })

  console.log(`✅ 创建了 ${categories.count} 个默认分类`)

  // 创建一些示例标签
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Claude Code', slug: 'claude-code', color: '#8B5CF6' },
      { name: 'MCP', slug: 'mcp', color: '#3B82F6' },
      { name: 'AI', slug: 'ai', color: '#10B981' },
      { name: 'Next.js', slug: 'nextjs', color: '#000000' },
      { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    ],
  })

  console.log(`✅ 创建了 ${tags.count} 个默认标签`)

  console.log('\n🎉 数据库初始化完成!')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
