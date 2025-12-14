import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OP工作室 | AI自动化与开发者生产力技术博客',
  description: '探索 Claude Code、MCP（模型上下文协议）、工作流自动化和 AI 驱动开发。为开发者提供 LLM 集成的实用指南和深度分析。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
