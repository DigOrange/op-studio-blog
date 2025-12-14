# EffiFlow 博客网站 1:1 还原项目计划

## 📋 项目概述

本项目旨在完全还原 [https://jangwook.net/zh/](https://jangwook.net/zh/) 博客网站的设计和功能。

**技术栈**:
- 前端框架: Next.js 15 (App Router)
- 数据库: Neon PostgreSQL
- ORM: Prisma 或 Drizzle ORM
- 样式: Tailwind CSS
- 多语言: next-intl
- 主题: next-themes
- 认证: Neon Auth + Stack Auth
- 部署: Vercel

---

## 🎯 网站核心特性分析

### 1. 设计风格
- 现代简约风格,使用浅色背景
- 大标题采用黑色+蓝色渐变效果
- 卡片式布局,带阴影和圆角
- 深色/浅色主题切换
- 自定义字体(Atkinson)
- 响应式设计(移动端、平板、桌面端)

### 2. 主要功能模块

#### 前台功能

**导航栏**
- Logo: EffiFlow
- 菜单项: 首页、博客、关于、联系方式、社交媒体、改进历史
- 主题切换按钮(月亮/太阳图标)
- 语言选择器: 支持英语、简体中文

**首页布局**
- Hero 区域:
  - Badge 标签: "AI & Productivity"
  - 大标题: "用AI 提升生产力" (带渐变效果)
  - 描述文字
  - 双 CTA 按钮: "查看博客"、"了解更多"
- 三个特性卡片:
  - AI工具介绍 (⚡图标)
  - 生产力技巧 (✓图标)
  - 教程 (📖图标)
- 最新文章区:
  - 展示 6 篇文章
  - 包含: 缩略图、发布日期、标签、标题、摘要、"Read more"链接
- FAQ 区域:
  - 可折叠的常见问题列表
  - 手风琴式交互

**Footer**
- 三列布局:
  - 品牌描述
  - 导航链接 (首页、博客、关于、联系方式、社交媒体、隐私政策、服务条款)
  - 社交媒体图标 (Twitter, Medium, LinkedIn, YouTube)
- 版权信息: "© 2025 EffiFlow. 保留所有权利."

**博客页面**
- 文章列表
- 分页功能
- 标签筛选
- 搜索功能

**文章详情页**
- 文章内容 (Markdown 渲染)
- 代码高亮
- 目录导航
- 阅读时间显示
- 相关文章推荐

#### 后台管理功能

**认证系统**
- 管理员登录/登出
- Session 管理
- 密码加密存储

**Dashboard 仪表板**
- 网站统计 (文章总数、访问量、标签数)
- 最近发布的文章
- 快速操作入口
- 访问趋势图表

**文章管理**
- 文章列表 (搜索、筛选、排序)
- 创建文章 (多语言支持)
- 编辑文章 (Markdown 编辑器 + 实时预览)
- 删除文章
- 状态管理 (草稿、已发布、定时发布、归档)
- 批量操作

**媒体管理**
- 图片上传 (拖拽上传)
- 图片预览
- 图片库管理
- 复制图片 URL

**标签和分类管理**
- 标签 CRUD
- 分类 CRUD
- 使用统计

**权限控制**
- 路由保护
- API 接口鉴权
- 操作日志记录

---

## 🗄️ 数据库设计

### Schema 结构

#### 1. 管理员表 (admins)
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'admin', -- admin, editor
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

#### 2. 文章表 (posts)
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- 多语言内容
  title_zh VARCHAR(255),
  title_en VARCHAR(255),
  title_ja VARCHAR(255),
  title_ko VARCHAR(255),

  content_zh TEXT,
  content_en TEXT,
  content_ja TEXT,
  content_ko TEXT,

  excerpt_zh TEXT,
  excerpt_en TEXT,
  excerpt_ja TEXT,
  excerpt_ko TEXT,

  -- 媒体
  thumbnail_url VARCHAR(500),
  cover_url VARCHAR(500),

  -- 状态管理
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled, archived
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,

  -- 统计
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- 分钟数

  -- 作者信息
  author_id INTEGER REFERENCES admins(id),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. 标签表 (tags)
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7), -- 颜色代码如 #FF5733
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. 文章-标签关联表 (post_tags)
```sql
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

#### 5. 分类表 (categories)
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. 文章分类关联表 (post_categories)
```sql
CREATE TABLE post_categories (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
```

#### 7. 媒体库表 (media)
```sql
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(500) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  uploaded_by INTEGER REFERENCES admins(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. 操作日志表 (activity_logs)
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admins(id),
  action VARCHAR(50), -- create, update, delete, login
  entity_type VARCHAR(50), -- post, tag, category
  entity_id INTEGER,
  description TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📂 项目结构

```
mysite/
├── docs/                      # 项目文档
│   └── project-plan.md
├── public/                    # 静态资源
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── [locale]/          # 多语言路由
│   │   │   ├── page.tsx       # 首页
│   │   │   ├── blog/          # 博客列表
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/    # 文章详情
│   │   │   │       └── page.tsx
│   │   │   ├── about/         # 关于页面
│   │   │   ├── contact/       # 联系页面
│   │   │   ├── social/        # 社交媒体
│   │   │   └── improvement-history/ # 改进历史
│   │   ├── admin/             # 管理后台
│   │   │   ├── login/         # 登录页
│   │   │   ├── dashboard/     # 仪表板
│   │   │   ├── posts/         # 文章管理
│   │   │   ├── tags/          # 标签管理
│   │   │   ├── media/         # 媒体管理
│   │   │   └── settings/      # 设置
│   │   ├── api/               # API 路由
│   │   │   ├── posts/
│   │   │   ├── tags/
│   │   │   ├── auth/
│   │   │   └── upload/
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── ui/                # UI 组件库
│   │   ├── layout/            # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── blog/              # 博客相关组件
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── PostDetail.tsx
│   │   ├── admin/             # 管理后台组件
│   │   │   ├── PostEditor.tsx
│   │   │   ├── MediaUpload.tsx
│   │   │   └── Dashboard.tsx
│   │   └── shared/            # 共享组件
│   │       ├── ThemeToggle.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       └── SearchBar.tsx
│   ├── lib/                   # 工具函数
│   │   ├── db.ts              # 数据库连接
│   │   ├── auth.ts            # 认证逻辑
│   │   ├── utils.ts           # 工具函数
│   │   └── constants.ts       # 常量定义
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useLocale.ts
│   ├── types/                 # TypeScript 类型定义
│   │   ├── post.ts
│   │   ├── user.ts
│   │   └── index.ts
│   └── i18n/                  # 国际化配置
│       ├── locales/
│       │   ├── zh.json
│       │   ├── en.json
│       │   ├── ja.json
│       │   └── ko.json
│       └── config.ts
├── prisma/                    # Prisma ORM
│   └── schema.prisma
├── .env.local                 # 环境变量
├── next.config.js             # Next.js 配置
├── tailwind.config.js         # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 依赖配置
```

---

## 🚀 开发任务清单

### 阶段 1: 基础设施 (任务 1-5)

#### ✅ 任务 1: 项目初始化
- [ ] 创建 Next.js 15 项目 (App Router)
- [ ] 安装基础依赖
  - `next`, `react`, `react-dom`
  - `typescript`, `@types/node`, `@types/react`
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `@prisma/client`, `prisma`
- [ ] 配置 TypeScript
- [ ] 配置 Tailwind CSS
- [ ] 配置 ESLint 和 Prettier

#### ✅ 任务 2: 配置 Neon 数据库
- [ ] 注册 Neon 账号
- [ ] 创建 Neon 项目
- [ ] 获取数据库连接字符串
- [ ] 配置环境变量 `.env.local`
  ```
  DATABASE_URL="postgresql://..."
  ```
- [ ] 测试数据库连接

#### ✅ 任务 3: 实现数据库模型
- [ ] 创建 Prisma Schema
- [ ] 定义所有数据表模型
  - admins (管理员)
  - posts (文章)
  - tags (标签)
  - categories (分类)
  - post_tags (文章-标签关联)
  - post_categories (文章-分类关联)
  - media (媒体库)
  - activity_logs (操作日志)
- [ ] 运行数据库迁移
- [ ] 生成 Prisma Client

#### ✅ 任务 4: 配置 Neon Auth 认证系统
- [ ] 安装认证相关依赖
  - `@stackframe/stack`
  - `next-auth` (备选)
- [ ] 配置 Neon Auth
- [ ] 创建认证 API 路由
- [ ] 实现 Session 管理
- [ ] 配置环境变量
  ```
  NEXT_PUBLIC_STACK_PROJECT_ID="..."
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="..."
  STACK_SECRET_SERVER_KEY="..."
  ```

#### ✅ 任务 5: 开发管理员登录页面
- [ ] 创建登录页面 UI (`/admin/login`)
- [ ] 实现登录表单
- [ ] 表单验证 (React Hook Form + Zod)
- [ ] 连接认证 API
- [ ] 错误处理和提示
- [ ] 记住登录状态

---

### 阶段 2: 管理后台开发 (任务 6-12)

#### ✅ 任务 6: 开发管理员 Dashboard 主页
- [ ] 创建 Dashboard 布局
- [ ] 侧边栏导航
- [ ] 顶部栏 (用户信息、退出按钮)
- [ ] 统计卡片组件
  - 文章总数
  - 今日访问量
  - 标签总数
  - 草稿文章数
- [ ] 最近发布文章列表
- [ ] 快速操作按钮

#### ✅ 任务 7: 开发文章管理界面
- [ ] 文章列表页 (`/admin/posts`)
  - 数据表格 (TanStack Table)
  - 搜索功能
  - 状态筛选 (草稿/已发布/归档)
  - 标签筛选
  - 排序功能 (日期、标题)
  - 批量操作 (删除、发布)
  - 分页
- [ ] 文章创建页 (`/admin/posts/new`)
- [ ] 文章编辑页 (`/admin/posts/edit/[id]`)
- [ ] 连接 API 接口

#### ✅ 任务 8: 开发 Markdown 编辑器组件
- [ ] 安装 Markdown 编辑器
  - `react-md-editor` 或 `@uiw/react-md-editor`
- [ ] 编辑器功能
  - 实时预览
  - 语法高亮
  - 工具栏 (加粗、斜体、链接、图片、代码块)
  - 快捷键支持
- [ ] 多语言标签切换
  - 简体中文、英语、日语、韩语
- [ ] 自动保存功能 (草稿)
- [ ] 字数统计
- [ ] 阅读时间计算

#### ✅ 任务 9: 开发图片上传功能
- [ ] 安装文件上传库
  - `uploadthing` 或 `vercel/blob`
  - `react-dropzone`
- [ ] 拖拽上传组件
- [ ] 图片预览
- [ ] 进度条显示
- [ ] 图片压缩 (可选)
- [ ] 图片裁剪 (可选)
- [ ] 图片库管理页面
- [ ] 复制图片 URL 功能

#### ✅ 任务 10: 开发标签和分类管理界面
- [ ] 标签管理页 (`/admin/tags`)
  - 标签列表
  - 创建标签
  - 编辑标签 (名称、颜色、描述)
  - 删除标签
  - 使用统计
- [ ] 分类管理页 (`/admin/categories`)
  - 分类列表
  - 创建分类
  - 编辑分类
  - 删除分类
  - 父子分类关系

#### ✅ 任务 11: 开发文章状态管理
- [ ] 状态枚举定义
  - draft (草稿)
  - published (已发布)
  - scheduled (定时发布)
  - archived (归档)
- [ ] 状态切换功能
- [ ] 定时发布设置
- [ ] 发布时间选择器
- [ ] 状态变更日志

#### ✅ 任务 12: 开发管理员权限控制
- [ ] 路由保护中间件
- [ ] 未登录重定向到登录页
- [ ] API 接口鉴权
- [ ] 角色权限区分 (admin, editor)
- [ ] 操作日志记录
- [ ] 敏感操作二次确认

---

### 阶段 3: 前台功能开发 (任务 13-28)

#### ✅ 任务 13: 配置多语言支持 (i18n)
- [ ] 安装 `next-intl`
- [ ] 配置 i18n 路由
- [ ] 创建语言文件
  - `i18n/locales/zh.json`
  - `i18n/locales/en.json`
  - `i18n/locales/ja.json`
  - `i18n/locales/ko.json`
- [ ] 配置语言切换逻辑
- [ ] 测试多语言路由

#### ✅ 任务 14: 实现主题切换功能
- [ ] 安装 `next-themes`
- [ ] 配置主题提供者
- [ ] 创建主题切换按钮
- [ ] 定义深色/浅色主题样式
- [ ] 本地存储主题偏好

#### ✅ 任务 15: 开发导航栏组件
- [ ] Header 组件布局
- [ ] Logo 和品牌名
- [ ] 导航菜单
  - 首页
  - 博客
  - 关于
  - 联系方式
  - 社交媒体
  - 改进历史
- [ ] 主题切换按钮
- [ ] 语言选择器下拉菜单
- [ ] 移动端响应式菜单
- [ ] 滚动时导航栏样式变化

#### ✅ 任务 16: 开发首页 Hero 区域
- [ ] Hero 区域布局
- [ ] Badge 标签 "AI & Productivity"
- [ ] 大标题渐变效果
  - 黑色 + 蓝色渐变
- [ ] 描述文字
- [ ] 双 CTA 按钮
  - "查看博客" (主按钮)
  - "了解更多" (次要按钮)
- [ ] 按钮悬停效果
- [ ] 响应式布局

#### ✅ 任务 17: 开发特性卡片区
- [ ] 三个特性卡片布局
- [ ] 卡片设计
  - 图标
  - 标题
  - 描述
  - 悬停效果 (阴影、位移)
- [ ] 特性内容
  - AI工具介绍 ⚡
  - 生产力技巧 ✓
  - 教程 📖
- [ ] 响应式网格布局

#### ✅ 任务 18: 开发文章列表组件
- [ ] PostCard 组件
  - 缩略图
  - 发布日期
  - 标签列表
  - 文章标题
  - 摘要
  - "Read more" 链接
  - 悬停效果
- [ ] PostList 组件
  - 网格布局
  - 加载状态
  - 空状态
- [ ] 响应式布局 (1列/2列/3列)

#### ✅ 任务 19: 开发文章详情页
- [ ] 文章页面布局
- [ ] 文章头部
  - 标题
  - 发布日期
  - 标签
  - 阅读时间
  - 作者信息
- [ ] Markdown 内容渲染
  - 安装 `react-markdown`
  - 安装 `remark-gfm` (GitHub Flavored Markdown)
  - 安装 `rehype-highlight` (代码高亮)
- [ ] 代码高亮主题
- [ ] 目录导航 (TOC)
- [ ] 相关文章推荐
- [ ] 社交分享按钮

#### ✅ 任务 20: 开发博客列表页
- [ ] 博客列表页布局 (`/blog`)
- [ ] 文章列表展示
- [ ] 分页组件
- [ ] 标签筛选
- [ ] 搜索功能
  - 搜索框
  - 搜索 API
  - 搜索结果展示
- [ ] 排序功能 (最新、最热)
- [ ] 加载更多/无限滚动 (可选)

#### ✅ 任务 21: 开发 FAQ 组件
- [ ] FAQ 区域布局
- [ ] 手风琴组件
- [ ] 可折叠问题列表
- [ ] 展开/收起动画
- [ ] FAQ 内容管理
  - EffiFlow 是什么?
  - Claude Code 是什么?
  - MCP 是什么?
  - 博客涵盖哪些主题?
  - 博客作者是谁?

#### ✅ 任务 22: 开发 Footer 组件
- [ ] Footer 布局 (三列)
- [ ] 第一列: 品牌描述
- [ ] 第二列: 导航链接
  - 首页
  - 博客
  - 关于
  - 联系方式
  - 社交媒体
  - 隐私政策
  - 服务条款
- [ ] 第三列: 社交媒体图标
  - Twitter
  - Medium
  - LinkedIn
  - YouTube
- [ ] 版权信息
- [ ] 响应式布局

#### ✅ 任务 23: 开发关于页面
- [ ] 关于页面布局 (`/about`)
- [ ] 个人/团队介绍
- [ ] 使命和愿景
- [ ] 技能展示
- [ ] 联系方式

#### ✅ 任务 24: 开发联系页面
- [ ] 联系页面布局 (`/contact`)
- [ ] 联系表单
  - 姓名
  - 邮箱
  - 主题
  - 消息
- [ ] 表单验证
- [ ] 提交处理 (发送邮件或保存到数据库)
- [ ] 成功/错误提示

#### ✅ 任务 25: 开发社交媒体页面
- [ ] 社交媒体页面布局 (`/social`)
- [ ] 社交平台链接展示
- [ ] 平台图标和描述
- [ ] 关注按钮

#### ✅ 任务 26: 开发改进历史页面
- [ ] 改进历史页面布局 (`/improvement-history`)
- [ ] 时间线组件
- [ ] 版本更新记录
- [ ] 功能更新说明

#### ✅ 任务 27: 开发隐私政策页面
- [ ] 隐私政策页面 (`/privacy`)
- [ ] Markdown 内容渲染
- [ ] 目录导航

#### ✅ 任务 28: 开发服务条款页面
- [ ] 服务条款页面 (`/terms`)
- [ ] Markdown 内容渲染
- [ ] 目录导航

---

### 阶段 4: 高级功能和优化 (任务 29-39)

#### ✅ 任务 29: 实现 SEO 优化
- [ ] 配置 Next.js Metadata API
- [ ] 动态元标签生成
  - title
  - description
  - keywords
  - author
- [ ] Open Graph 标签
  - og:title
  - og:description
  - og:image
  - og:url
- [ ] Twitter Card 标签
- [ ] 结构化数据 (JSON-LD)
  - Article
  - BreadcrumbList
  - Organization
- [ ] Sitemap 生成
- [ ] Robots.txt 配置

#### ✅ 任务 30: 实现响应式设计
- [ ] 移动端适配 (< 768px)
- [ ] 平板适配 (768px - 1024px)
- [ ] 桌面端适配 (> 1024px)
- [ ] 测试不同设备
- [ ] 触摸优化
- [ ] 性能优化

#### ✅ 任务 31: 配置 Google Analytics
- [ ] 注册 Google Analytics 账号
- [ ] 获取跟踪 ID
- [ ] 安装 `@next/third-parties`
- [ ] 配置 GA 脚本
- [ ] 事件跟踪
  - 页面浏览
  - 链接点击
  - 表单提交
- [ ] 隐私合规 (Cookie 同意)

#### ✅ 任务 32: 配置图片优化
- [ ] 使用 Next.js Image 组件
- [ ] 图片懒加载
- [ ] 响应式图片
- [ ] 图片格式优化 (WebP)
- [ ] 模糊占位符
- [ ] CDN 配置 (可选)

#### ✅ 任务 33: 实现文章阅读时间计算
- [ ] 安装 `reading-time` 库
- [ ] 计算文章字数
- [ ] 估算阅读时间
- [ ] 在文章详情页显示
- [ ] 在文章卡片显示

#### ✅ 任务 34: 配置自定义字体
- [ ] 下载 Atkinson 字体文件
- [ ] 添加到 `/public/fonts/`
- [ ] 使用 Next.js Font Optimization
- [ ] 配置 Tailwind 字体
- [ ] 应用到全局样式

#### ✅ 任务 35: 实现标签和分类筛选功能
- [ ] 标签页面 (`/tags/[slug]`)
- [ ] 分类页面 (`/categories/[slug]`)
- [ ] 筛选逻辑
- [ ] 面包屑导航
- [ ] 标签云组件 (可选)

#### ✅ 任务 36: 开发 RSS 订阅功能
- [ ] 创建 RSS 路由 (`/rss.xml`)
- [ ] 生成 RSS Feed
- [ ] 包含文章列表
- [ ] 添加 RSS 图标到 Footer

#### ✅ 任务 37: 性能优化
- [ ] 代码分割
  - 动态导入
  - 路由级别分割
- [ ] 懒加载
  - 图片懒加载
  - 组件懒加载
- [ ] 缓存策略
  - HTTP 缓存
  - Next.js 缓存
  - API 缓存
- [ ] 压缩资源
  - Gzip/Brotli
  - 最小化 CSS/JS
- [ ] 性能监控
  - Lighthouse 测试
  - Core Web Vitals

#### ✅ 任务 38: 安全性优化
- [ ] HTTPS 配置
- [ ] CSRF 保护
- [ ] XSS 防护
- [ ] SQL 注入防护
- [ ] Rate Limiting
- [ ] 环境变量保护
- [ ] 安全头配置
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options

#### ✅ 任务 39: 测试与部署
- [ ] 单元测试 (可选)
  - Jest
  - React Testing Library
- [ ] E2E 测试 (可选)
  - Playwright
  - Cypress
- [ ] 配置 Vercel 部署
  - 连接 Git 仓库
  - 配置环境变量
  - 配置域名
  - SSL 证书
- [ ] 生产环境测试
- [ ] 性能监控设置
- [ ] 错误跟踪 (Sentry)

---

## 🎨 UI/UX 设计规范

### 颜色方案

#### 浅色主题
```css
--background: #ffffff
--foreground: #0a0a0a
--primary: #4f46e5  /* 蓝色 */
--primary-hover: #4338ca
--secondary: #f3f4f6
--accent: #6366f1
--border: #e5e7eb
--card: #ffffff
--card-hover: #f9fafb
```

#### 深色主题
```css
--background: #0a0a0a
--foreground: #ffffff
--primary: #6366f1
--primary-hover: #818cf8
--secondary: #1f2937
--accent: #818cf8
--border: #374151
--card: #111827
--card-hover: #1f2937
```

### 字体系统
- 主字体: Atkinson (自定义)
- 备用字体: system-ui, -apple-system, sans-serif
- 代码字体: 'Fira Code', 'Courier New', monospace

### 间距系统
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### 圆角
- sm: 0.25rem (4px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- 2xl: 1.5rem (24px)

### 阴影
- sm: 0 1px 2px rgba(0, 0, 0, 0.05)
- md: 0 4px 6px rgba(0, 0, 0, 0.1)
- lg: 0 10px 15px rgba(0, 0, 0, 0.1)
- xl: 0 20px 25px rgba(0, 0, 0, 0.15)

---

## 📦 依赖清单

### 核心依赖
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.3.0",

    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",

    "@stackframe/stack": "^2.0.0",
    "next-auth": "^5.0.0",

    "next-intl": "^3.5.0",
    "next-themes": "^0.2.1",

    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",

    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "reading-time": "^1.5.0",

    "@uiw/react-md-editor": "^4.0.0",
    "react-dropzone": "^14.2.0",
    "uploadthing": "^6.0.0",

    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",

    "@tanstack/react-table": "^8.10.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",

    "date-fns": "^3.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## 🔒 安全清单

- [ ] 使用 HTTPS
- [ ] 密码哈希 (bcrypt)
- [ ] JWT Token 保护
- [ ] CSRF 令牌
- [ ] XSS 防护 (内容过滤)
- [ ] SQL 注入防护 (ORM)
- [ ] 文件上传验证
- [ ] Rate Limiting
- [ ] 环境变量保护
- [ ] 安全头配置
- [ ] 日志记录
- [ ] 错误处理 (不暴露敏感信息)

---

## 📊 性能指标

### 目标指标
- Lighthouse Score: > 90
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Blocking Time (TBT): < 300ms
- Cumulative Layout Shift (CLS): < 0.1

---

## 🚦 里程碑

1. **M1: 基础设施完成** (预计 1-2 周)
   - 项目初始化
   - 数据库配置
   - 认证系统

2. **M2: 管理后台完成** (预计 2-3 周)
   - Dashboard
   - 文章管理
   - 媒体管理
   - 权限控制

3. **M3: 前台功能完成** (预计 2-3 周)
   - 所有页面开发
   - 多语言支持
   - 主题切换

4. **M4: 优化和部署** (预计 1 周)
   - SEO 优化
   - 性能优化
   - 测试
   - 部署上线

**总预计时间**: 6-9 周

---

## 📝 注意事项

1. **响应式设计**: 所有页面必须在移动端、平板、桌面端完美展示
2. **多语言支持**: 所有文本内容都要支持 4 种语言
3. **SEO 优化**: 每个页面都要有完整的 SEO 元标签
4. **性能优化**: 图片优化、代码分割、懒加载
5. **安全性**: 认证、鉴权、数据验证、防护措施
6. **用户体验**: 加载状态、错误处理、友好提示
7. **代码质量**: TypeScript 类型、代码注释、统一规范
8. **测试**: 单元测试、E2E 测试(可选)

---

## 📚 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Neon 官方文档](https://neon.tech/docs)
- [Prisma 官方文档](https://www.prisma.io/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Next-intl 文档](https://next-intl-docs.vercel.app/)
- [Stack Auth 文档](https://docs.stack-auth.com/)
- [shadcn/ui 组件库](https://ui.shadcn.com/)

---

**最后更新**: 2025-12-03
**版本**: 1.0.0
