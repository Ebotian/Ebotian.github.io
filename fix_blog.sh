#!/bin/bash

# 确保我们在正确的目录
cd ~/ebotian_blog

# 安装必要的依赖
npm install @tailwindcss/typography react-icons
pip3 install pillow

# 创建颜色提取脚本
cat > color_extractor.py << EOL
import sys
from PIL import Image
import colorsys

def get_dominant_colors(image_path, num_colors=5):
    image = Image.open(image_path)
    image = image.resize((100, 100))  # Resize for faster processing
    result = image.convert('P', palette=Image.ADAPTIVE, colors=num_colors)
    result = result.convert('RGB')
    colors = result.getcolors(100*100)

    # Sort colors by count
    sorted_colors = sorted(colors, key=lambda x: x[0], reverse=True)

    # Convert RGB to HSL and sort by lightness
    hsl_colors = [colorsys.rgb_to_hls(r/255, g/255, b/255) for count, (r, g, b) in sorted_colors]
    sorted_hsl = sorted(hsl_colors, key=lambda x: x[1])  # Sort by lightness

    # Convert back to RGB
    sorted_rgb = [colorsys.hls_to_rgb(h, l, s) for h, l, s in sorted_hsl]

    # Convert to hex
    hex_colors = ['#%02x%02x%02x' % tuple(int(x*255) for x in rgb) for rgb in sorted_rgb]

    return hex_colors

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the path to the image file.")
        sys.exit(1)

    image_path = sys.argv[1]
    colors = get_dominant_colors(image_path)

    print(f"primary: '{colors[0]}',")
    print(f"secondary: '{colors[1]}',")
    print(f"background: '{colors[-1]}',")
EOL

# 运行 Python 脚本来提取颜色
echo "正在从背景图提取颜色..."
colors=$(python3 color_extractor.py public/background.png)

# 更新 tailwind.config.js 以使用提取的颜色
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ${colors}
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.secondary'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
EOL

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
      <body className={\`\${inter.className} bg-background text-gray-800\`}>
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-secondary">Ebotian 的博客</Link>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/Ebotian" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-2xl hover:text-secondary" />
              </Link>
              <Link href="https://x.com/AsilenA123" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl hover:text-secondary" />
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-primary text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            © 2024 Ebotian 的博客. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
EOL

# 更新 src/app/page.tsx
cat > src/app/page.tsx << EOL
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home() {
  const allPostsData = getSortedPostsData()
  return (
    <div>
      <div className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{backgroundImage: 'url("/background.png")'}}>
        <h1 className="text-6xl font-bold text-white text-center shadow-lg p-6 bg-black bg-opacity-50 rounded-lg">欢迎来到 Ebotian 的博客</h1>
      </div>
      <div className="py-16">
        <h2 className="text-4xl font-bold mb-8 text-primary">最新文章</h2>
        <ul className="space-y-4">
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
              <Link href={\`/posts/\${id.split('/').map(encodeURIComponent).join('/')}\`}>
                <h3 className="text-2xl font-semibold text-secondary hover:text-primary mb-2">{title || id}</h3>
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
mkdir -p src/app/posts/[...id]
cat > src/app/posts/[...id]/page.tsx << EOL
import { getAllPostIds, getPostData } from '../../../lib/posts'
import Link from 'next/link'

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  return (
    <article className="prose lg:prose-xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <Link href="/" className="text-secondary hover:text-primary mb-4 inline-block">&larr; 返回首页</Link>
      <h1 className="text-4xl font-bold mb-4 text-primary">{postData.title || postData.id}</h1>
      {postData.date && <p className="text-gray-500 mb-8">{postData.date}</p>}
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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
mkdir -p src/app/api/search
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

# 确保背景图片在正确的位置
if [ -f ~/background.png ]; then
  mv ~/background.png public/
  echo "背景图片已移动到 public 文件夹"
else
  echo "警告：未找到 background.png 文件。请确保将其放置在 public 文件夹中。"
fi

echo "博客修复和增强已成功应用！颜色方案已根据背景图自动调整。"