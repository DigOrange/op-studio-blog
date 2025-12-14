import { prisma } from './db'

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // 测试数据库连接
    await prisma.$connect()
    console.log('✅ Database connected successfully!')

    // 检查所有表
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `
    
    console.log('\n📊 Database tables:')
    tables.forEach(table => console.log(`  - ${table.tablename}`))

    // 统计数据
    const [adminCount, postCount, tagCount, categoryCount] = await Promise.all([
      prisma.admin.count(),
      prisma.post.count(),
      prisma.tag.count(),
      prisma.category.count(),
    ])

    console.log('\n📈 Database statistics:')
    console.log(`  - Admins: ${adminCount}`)
    console.log(`  - Posts: ${postCount}`)
    console.log(`  - Tags: ${tagCount}`)
    console.log(`  - Categories: ${categoryCount}`)

    await prisma.$disconnect()
    console.log('\n✅ Test completed successfully!')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()
