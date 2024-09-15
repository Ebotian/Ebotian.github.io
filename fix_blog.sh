#!/bin/bash

# 确保我们在正确的目录
cd ~/ebotian_blog

# 更新 [...id]/page.tsx 文件
cat > src/app/posts/[...id]/page.tsx << EOL
import { getAllPostIds, getPostData } from '../../../lib/posts'
import Link from 'next/link'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.params.id
  }))
}

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
      <div className="text-gray-500 mb-4">{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.content || '' }} />
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
EOL

echo "[...id]/page.tsx 文件已更新，修复了 dangerouslySetInnerHTML 的类型问题。"

# 更新 posts.ts 文件以确保 content 总是返回一个字符串
cat > src/lib/posts.ts << EOL
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Post = {
  id: string;
  date: string;
  title: string;
  content: string;
};

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

function getAllFiles(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file))
    } else if (file.endsWith('.md')) {
      results.push(file)
    }
  })
  return results
}

export function getSortedPostsData(): Post[] {
  const fileNames = getAllFiles(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(postsDirectory, '').replace(/^\//, '').replace(/\.md$/, '')
    const fullPath = fileName
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const stats = fs.statSync(fullPath)

    return {
      id,
      date: stats.mtime.toISOString().split('T')[0],
      title: matterResult.data.title as string,
      content: matterResult.content
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
  const fileNames = getAllFiles(postsDirectory)
  return fileNames.map(fileName => {
    const id = fileName.replace(postsDirectory, '').replace(/^\//, '').replace(/\.md$/, '')
    return {
      params: {
        id: id.split('/')
      }
    }
  })
}

export async function getPostData(id: string[]): Promise<Post> {
  const fullPath = path.join(postsDirectory, ...id) + '.md'
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const stats = fs.statSync(fullPath)

  return {
    id: id.join('/'),
    date: stats.mtime.toISOString().split('T')[0],
    title: matterResult.data.title as string,
    content: matterResult.content
  }
}
EOL

echo "posts.ts 文件已更新，确保 content 总是返回一个字符串。"