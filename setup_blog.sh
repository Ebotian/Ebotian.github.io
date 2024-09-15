#!/bin/bash

# 确保我们在正确的目录
cd ~/ebotian_blog

# 创建必要的目录
mkdir -p src/content/posts src/app/posts/[id] src/lib

# 复制 Markdown 文件
cp -R ~/temp_fanta_sea/Markdown/* src/content/posts/

# 创建 posts.ts 文件
cat > src/lib/posts.ts << EOL
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts')

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    return {
      id,
      ...(matterResult.data as { date: string; title: string })
    }
  })
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, \`\${id}.md\`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string })
  }
}
EOL

# 修改 src/app/page.tsx
cat > src/app/page.tsx << EOL
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'

export default function Home() {
  const allPostsData = getSortedPostsData()
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">欢迎来到 Ebotian 的博客</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} className="mb-5">
            <Link href={\`/posts/\${id}\`}>
              <span className="text-blue-500 hover:underline">{title}</span>
            </Link>
            <br />
            <small className="text-gray-500">{date}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
EOL

# 创建 src/app/posts/[id]/page.tsx
cat > src/app/posts/[id]/page.tsx << EOL
import { getAllPostIds, getPostData } from '../../../lib/posts'

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id)
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">{postData.title}</h1>
      <div className="text-gray-500 mb-4">{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.params.id,
  }))
}
EOL

# 安装必要的 npm 包
npm install gray-matter remark remark-html

echo "Blog setup complete!"