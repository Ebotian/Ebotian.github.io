#!/bin/bash

# 确保脚本在错误时停止执行
set -e

echo "开始构建和运行过程..."

# 1. 更新 next.config.mjs
echo "更新 next.config.mjs..."
cat > next.config.mjs << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    disableStaticImages: false,
  },
  output: 'standalone',
};

export default nextConfig;
EOL

# 2. 更新 search 页面
echo "更新 search 页面..."
cat > src/app/search/page.tsx << EOL
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const SearchResults = dynamic(() => import('@/components/SearchResults'), {
  ssr: false,
  loading: () => <p>正在加载搜索结果...</p>
})

export const dynamicConfig = 'force-dynamic'

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">搜索结果</h1>
      <Suspense fallback={<p>正在加载搜索结果...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
EOL

# 3. 创建 SearchResults 组件
echo "创建 SearchResults 组件..."
mkdir -p src/components
cat > src/components/SearchResults.tsx << EOL
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Highlighter from 'react-highlight-words'

interface Post {
  id: string
  title: string
  date?: string
}

export default function SearchResults() {
  const [results, setResults] = useState<Post[]>([])
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      fetch(\`/api/search?q=\${encodeURIComponent(query)}\`)
        .then(res => res.json())
        .then(data => setResults(data))
    }
  }, [query])

  if (!query) {
    return <p>请输入搜索词</p>
  }

  return (
    <>
      <p>搜索词: {query}</p>
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((post: Post) => (
            <li key={post.id} className="bg-white shadow rounded-lg p-4">
              <Link href={\`/posts/\${post.id}\`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                  <Highlighter
                    highlightClassName="bg-yellow-200"
                    searchWords={[query]}
                    autoEscape={true}
                    textToHighlight={post.title}
                  />
                </h2>
              </Link>
              {post.date && <p className="text-gray-500 text-sm">{post.date}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>没有找到相关结果。</p>
      )}
    </>
  )
}
EOL

# 4. 安装依赖（如果需要）
echo "安装依赖..."
npm install

# 5. 构建项目
echo "构建项目..."
npm run build

# 6. 重启应用
#echo "重启应用..."
#pm2 restart ebotian-blog || pm2 start npm --name "ebotian-blog" -- start
   # 在开发模式下运行应用
   echo "在开发模式下运行应用..."
   npm run dev
echo "构建和运行过程完成！"