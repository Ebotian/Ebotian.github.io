#!/bin/bash

# 确保我们在正确的目录
cd ~/ebotian_blog

# 安装必要的依赖
npm install @tailwindcss/typography react-icons

# 更新 src/app/layout.tsx
cat > src/app/layout.tsx << EOL
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ebotian 的博客',
  description: '分享技术、生活和思考',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Ebotian 的博客</Link>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/Ebotian" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-2xl" />
              </Link>
              <Link href="https://x.com/AsilenA123" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl" />
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            © 2024 Ebotian 的博客. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
EOL

# 创建欢迎页面
cat > src/app/page.tsx << EOL
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home() {
  const allPostsData = getSortedPostsData()
  return (
    <div>
      <div className="h-screen bg-cover bg-center flex items-center justify-center" style={{backgroundImage: 'url("/welcome-bg.jpg")'}}>
        <h1 className="text-6xl font-bold text-white text-center">欢迎来到 Ebotian 的博客</h1>
      </div>
      <div className="py-16">
        <h2 className="text-4xl font-bold mb-8">最新文章</h2>
        <ul className="space-y-4">
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="bg-white shadow rounded-lg p-6">
              <Link href={\`/posts/\${id.split('/').map(encodeURIComponent).join('/')}\`}>
                <h3 className="text-2xl font-semibold text-blue-600 hover:text-blue-800 mb-2">{title || id}</h3>
              </Link>
              {date && <p className="text-gray-500 text-sm">{date}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
EOL

# 更新 src/app/posts/[...id]/page.tsx
cat > src/app/posts/[...id]/page.tsx << EOL
import { getAllPostIds, getPostData } from '../../../lib/posts'
import Link from 'next/link'

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  return (
    <article className="prose lg:prose-xl mx-auto">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; 返回首页</Link>
      <h1 className="text-4xl font-bold mb-4">{postData.title || postData.id}</h1>
      {postData.date && <p className="text-gray-500 mb-8">{postData.date}</p>}
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      {/* 这里可以添加评论系统和访问统计 */}
    </article>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.id.split('/')
  }))
}
EOL

# 创建搜索API路由
mkdir -p src/app/api
cat > src/app/api/search/route.ts << EOL
import { NextResponse } from 'next/server'
import { getSortedPostsData } from '../../../lib/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const allPosts = getSortedPostsData()

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(query?.toLowerCase() || '') ||
    post.id.toLowerCase().includes(query?.toLowerCase() || '')
  )

  return NextResponse.json(filteredPosts)
}
EOL

echo "Blog enhancements applied successfully!"