# OP工作室博客系统 - 完整用户手册

## 📚 目录

1. [项目简介](#项目简介)
2. [技术栈](#技术栈)
3. [系统要求](#系统要求)
4. [安装指南](#安装指南)
5. [管理员登录](#管理员登录)
6. [数据库管理](#数据库管理)
7. [内容管理](#内容管理)
8. [系统配置](#系统配置)
9. [部署指南](#部署指南)
10. [故障排除](#故障排除)
11. [常见问题](#常见问题)

---

## 📖 项目简介

OP工作室博客是一个现代化的博客管理系统,专注于AI自动化与开发者生产力技术内容分享。

### 主要特性

- ✅ 现代化的响应式设计
- ✅ 完整的内容管理系统
- ✅ 多语言支持 (中文/英文/日语/韩语)
- ✅ Markdown 编辑器
- ✅ 图片上传管理
- ✅ 标签和分类系统
- ✅ SEO 优化
- ✅ 深色/浅色主题切换

---

## 🛠 技术栈

### 前端框架
- **Next.js 15** - React 框架
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架

### 后端服务
- **Neon PostgreSQL** - 数据库
- **Prisma ORM** - 数据库工具
- **Stack Auth** - 认证系统

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Turbopack** - 快速构建

---

## 💻 系统要求

### 必需环境
- Node.js >= 18.0.0
- npm >= 9.0.0
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 推荐配置
- 操作系统: macOS, Linux, Windows 10+
- 内存: 4GB RAM 以上
- 存储: 1GB 可用空间

---

## 📥 安装指南

### 1. 克隆项目

```bash
git clone <项目地址>
cd mysite
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env`:

```bash
cp .env.example .env
```

编辑 `.env` 文件,配置以下内容:

```env
# 数据库连接
DATABASE_URL="你的Neon数据库连接字符串"

# Stack Auth 认证
NEXT_PUBLIC_STACK_PROJECT_ID="你的项目ID"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="你的公开密钥"
STACK_SECRET_SERVER_KEY="你的服务器密钥"

# 应用配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. 初始化数据库

生成 Prisma Client:

```bash
npm run db:generate
```

运行数据库迁移:

```bash
npm run db:migrate
```

初始化数据 (创建管理员账号):

```bash
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

---

## 🔐 管理员登录

### 默认管理员账号

系统初始化后会自动创建默认管理员账号:

```
📧 邮箱: admin@op-studio.com
🔑 密码: OP工作室2024!
```

**⚠️ 重要提示**: 首次登录后请立即修改默认密码!

### 登录步骤

1. 访问登录页面: http://localhost:3000/handler/sign-in
2. 输入邮箱和密码
3. 点击"登录"按钮
4. 登录成功后会跳转到管理后台

### 修改密码

1. 登录后访问账户设置
2. 点击"修改密码"
3. 输入当前密码和新密码
4. 保存更改

### 退出登录

点击右上角用户菜单中的"退出登录"按钮。

---

## 🗄 数据库管理

### 可用命令

```bash
# 生成 Prisma Client
npm run db:generate

# 推送 schema 到数据库 (开发环境)
npm run db:push

# 创建新的迁移
npm run db:migrate

# 打开 Prisma Studio (可视化管理界面)
npm run db:studio

# 测试数据库连接
npm run db:test

# 初始化数据 (创建管理员和示例数据)
npm run db:seed
```

### 使用 Prisma Studio

Prisma Studio 是一个可视化的数据库管理工具:

```bash
npm run db:studio
```

访问 http://localhost:5555 查看数据库内容。

### 数据库表结构

系统包含以下数据表:

#### 核心表
- **admins** - 管理员账号
- **posts** - 博客文章
- **tags** - 标签
- **categories** - 分类
- **media** - 媒体文件
- **activity_logs** - 操作日志

#### 关联表
- **post_tags** - 文章-标签关联
- **post_categories** - 文章-分类关联

### 备份数据库

使用 Neon 控制台进行数据库备份:

1. 登录 Neon 控制台
2. 选择你的项目
3. 进入 Backups 页面
4. 创建备份快照

---

## ✍️ 内容管理

### 文章管理

#### 创建新文章

1. 登录管理后台
2. 点击"文章管理" → "新建文章"
3. 填写文章信息:
   - 标题 (支持4种语言)
   - 内容 (Markdown 格式)
   - 摘要
   - 缩略图
   - 标签和分类
4. 选择发布状态:
   - **草稿** - 保存但不发布
   - **已发布** - 立即发布
   - **定时发布** - 设置发布时间
5. 点击"保存"或"发布"

#### 编辑文章

1. 进入"文章管理"
2. 找到要编辑的文章
3. 点击"编辑"按钮
4. 修改内容后保存

#### 删除文章

1. 进入"文章管理"
2. 找到要删除的文章
3. 点击"删除"按钮
4. 确认删除操作

⚠️ **注意**: 删除操作不可恢复!

### 标签管理

#### 创建标签

1. 进入"标签管理"
2. 点击"新建标签"
3. 填写:
   - 标签名称
   - URL 友好的 slug
   - 描述
   - 颜色 (用于显示)
4. 保存

#### 管理标签

- 编辑标签信息
- 删除未使用的标签
- 查看标签使用统计

### 分类管理

#### 创建分类

1. 进入"分类管理"
2. 点击"新建分类"
3. 填写:
   - 分类名称
   - URL 友好的 slug
   - 描述
   - 父分类 (可选,用于创建子分类)
4. 保存

#### 分类层级

系统支持父子分类关系:
- AI工具
  - Claude Code
  - GitHub Copilot
- 生产力
  - 工作流优化
  - 开发技巧

### 媒体管理

#### 上传图片

1. 进入"媒体库"
2. 点击"上传文件"或拖拽文件到上传区域
3. 支持的格式: JPG, PNG, GIF, WebP
4. 最大文件大小: 5MB

#### 使用图片

上传后的图片可以:
- 作为文章缩略图
- 作为文章封面
- 在文章内容中引用

---

## ⚙️ 系统配置

### 多语言配置

系统支持4种语言:
- 简体中文 (zh)
- 英语 (en)
- 日语 (ja)
- 韩语 (ko)

在创建文章时,为每种语言填写对应内容。

### 主题配置

系统支持深色/浅色主题:
- 自动跟随系统设置
- 用户可手动切换
- 主题偏好保存在本地

### SEO 配置

每篇文章可配置:
- Meta 标题
- Meta 描述
- Meta 关键词
- Open Graph 图片

### 网站配置

在 `.env` 文件中配置:

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

---

## 🚀 部署指南

### Vercel 部署 (推荐)

#### 1. 准备工作

确保你有:
- GitHub 仓库
- Vercel 账号
- Neon 数据库

#### 2. 部署步骤

1. 登录 Vercel
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. 点击 "Deploy"

#### 3. 数据库迁移

部署后需要运行数据库迁移:

```bash
# 在 Vercel 控制台或本地运行
npx prisma migrate deploy
```

#### 4. 初始化数据

```bash
npm run db:seed
```

### 自定义域名

在 Vercel 项目设置中:
1. 进入 "Domains"
2. 添加你的域名
3. 配置 DNS 记录
4. 更新 `NEXT_PUBLIC_APP_URL` 环境变量

---

## 🔧 故障排除

### 常见问题

#### 问题 1: 无法连接数据库

**症状**: 启动时出现数据库连接错误

**解决方案**:
1. 检查 `.env` 中的 `DATABASE_URL` 是否正确
2. 确认 Neon 数据库正在运行
3. 测试连接: `npm run db:test`

#### 问题 2: 登录失败

**症状**: 输入账号密码后无法登录

**解决方案**:
1. 确认使用正确的邮箱和密码
2. 重置管理员密码:
   ```bash
   npm run db:seed
   ```
3. 检查 Stack Auth 配置是否正确

#### 问题 3: 图片上传失败

**症状**: 上传图片时出错

**解决方案**:
1. 检查文件大小 (< 5MB)
2. 确认文件格式 (JPG, PNG, GIF, WebP)
3. 检查存储配置

#### 问题 4: 页面编译错误

**症状**: 访问页面时显示编译错误

**解决方案**:
1. 清理缓存:
   ```bash
   rm -rf .next
   npm run dev
   ```
2. 重新安装依赖:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### 问题 5: Prisma Client 错误

**症状**: 提示 Prisma Client 未生成

**解决方案**:
```bash
npm run db:generate
```

### 日志查看

#### 开发环境

开发服务器会在终端显示所有日志。

#### 生产环境

在 Vercel 控制台查看:
1. 进入项目
2. 点击 "Logs"
3. 查看实时日志

---

## ❓ 常见问题

### 如何添加新的管理员?

目前系统只支持单管理员模式。如需添加多管理员,需要:
1. 修改 `prisma/seed.ts`
2. 添加新的管理员记录
3. 运行 seed 脚本

### 如何备份文章?

使用 Neon 数据库备份功能:
1. 访问 Neon 控制台
2. 创建数据库快照
3. 下载备份文件

### 如何更换数据库?

1. 导出当前数据库数据
2. 更新 `.env` 中的 `DATABASE_URL`
3. 运行迁移: `npm run db:migrate`
4. 导入数据

### 如何自定义样式?

系统使用 Tailwind CSS:
1. 修改 `tailwind.config.ts` 自定义主题
2. 编辑 `app/globals.css` 添加全局样式
3. 在组件中使用 Tailwind 类名

### 如何添加新的页面?

在 `app` 目录下创建新文件:
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>新页面内容</div>
}
```

访问: http://localhost:3000/new-page

---

## 📞 技术支持

### 获取帮助

- 查看项目文档: `docs/` 目录
- 查看 Next.js 文档: https://nextjs.org/docs
- 查看 Prisma 文档: https://prisma.io/docs
- 查看 Stack Auth 文档: https://docs.stack-auth.com

### 报告问题

发现 Bug 或有功能建议?
1. 检查是否已有相同问题
2. 创建详细的问题报告
3. 包含错误日志和复现步骤

---

## 📝 更新日志

### v1.0.0 (2024-12-04)

- ✅ 初始版本发布
- ✅ 基础内容管理系统
- ✅ 管理员认证系统
- ✅ 数据库架构设计
- ✅ 响应式前端界面

---

## 📄 许可证

MIT License

---

**文档版本**: v1.0.0
**最后更新**: 2024-12-04
**维护者**: OP工作室
