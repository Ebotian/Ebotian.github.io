import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

interface PostData {
  id: string
  date: string
  title: string
  contentHtml: string
}

interface MatterResult {
  data: {
    [key: string]: any
    date?: string | Date
  }
  content: string
}

function getAllFiles(dir: string): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let fileList: string[] = []

  for (const file of files) {
    if (file.isDirectory()) {
      fileList = [...fileList, ...getAllFiles(path.join(dir, file.name))]
    } else if (file.name.endsWith('.md')) {
      fileList.push(path.join(dir, file.name))
    }
  }

  return fileList
}

function extractDateFromFileName(fileName: string): string | null {
  const dateRegex = /(\d{4}[-./]\d{2}[-./]\d{2})/
  const match = fileName.match(dateRegex)
  return match ? match[1].replace(/[./]/g, '-') : null
}

function getFileModificationDate(filePath: string): string {
  const stats = fs.statSync(filePath)
  return stats.mtime.toISOString().split('T')[0]
}

function getTitleFromFileName(fileName: string): string {
  return path.basename(fileName, '.md').replace(/^\d{4}[-./]\d{2}[-./]\d{2}-/, '')
}

export function getSortedPostsData(): { [key: string]: PostData[] } {
  const fileNames = getAllFiles(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.slice(postsDirectory.length + 1).replace(/\.md$/, '')
    const fileContents = fs.readFileSync(fileName, 'utf8')

    let matterResult: MatterResult
    try {
      matterResult = matter(fileContents) as MatterResult
    } catch (error) {
      console.error(`Error parsing frontmatter for file: ${fileName}`, error)
      matterResult = { data: {}, content: fileContents }
    }

    let date = extractDateFromFileName(fileName) ||
               (matterResult.data.date ? new Date(matterResult.data.date).toISOString().split('T')[0] : null) ||
               getFileModificationDate(fileName)

    const title = getTitleFromFileName(fileName)

    // 使用 remark 将 Markdown 转换为 HTML
    const processedContent = remark()
      .use(html)
      .processSync(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id,
      date: date,
      title: title,
      contentHtml: contentHtml
    }
  })

  const sortedPosts = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  const groupedPosts: { [key: string]: PostData[] } = {}

  sortedPosts.forEach(post => {
    const year = post.date.substring(0, 4)
    const month = post.date.substring(5, 7)
    const key = `${year}.${month}`
    if (!groupedPosts[key]) {
      groupedPosts[key] = []
    }
    groupedPosts[key].push(post)
  })

  return groupedPosts
}

export function getAllPostIds() {
  const fileNames = getAllFiles(postsDirectory)
  return fileNames.map(fileName => {
    const relativePath = fileName.slice(postsDirectory.length + 1).replace(/\.md$/, '')
    return {
      params: {
        id: relativePath.split('/').map(encodeURIComponent)
      }
    }
  })
}

export async function getPostData(id: string[]): Promise<PostData> {
  const decodedId = id.map(segment => decodeURIComponent(segment))
  const fullPath = path.join(postsDirectory, ...decodedId) + '.md'

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    let matterResult: MatterResult
    try {
      matterResult = matter(fileContents) as MatterResult
    } catch (error) {
      console.error(`Error parsing frontmatter for file: ${fullPath}`, error)
      matterResult = { data: {}, content: fileContents }
    }

    let date = extractDateFromFileName(fullPath) ||
               (matterResult.data.date ? new Date(matterResult.data.date).toISOString().split('T')[0] : null) ||
               getFileModificationDate(fullPath)

    const title = getTitleFromFileName(fullPath)

    // 使用 remark 将 Markdown 转换为 HTML
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id: decodedId.join('/'),
      title: title,
      date: date,
      contentHtml: contentHtml,
    }
  } catch (error) {
    console.error(`Error reading file: ${fullPath}`, error)
    return {
      id: decodedId.join('/'),
      title: '文章不存在',
      date: '未知日期',
      contentHtml: '<p>抱歉，该文章不存在或已被删除。</p>',
    }
  }
}
