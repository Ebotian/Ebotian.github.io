import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts')

function getAllFiles(dir: string): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let fileList: string[] = []

  for (const file of files) {
    const filePath = path.join(dir, file.name)
    if (file.isDirectory()) {
      fileList = [...fileList, ...getAllFiles(filePath)]
    } else if (file.name.endsWith('.md')) {
      fileList.push(filePath)
    }
  }

  return fileList
}

export function getSortedPostsData() {
  const allPostsData = getAllFiles(postsDirectory)
    .map(file => {
      const id = path.relative(postsDirectory, file).replace(/\.md$/, '')
      const fileContents = fs.readFileSync(file, 'utf8')
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
  return getAllFiles(postsDirectory).map(file => {
    const id = path.relative(postsDirectory, file).replace(/\.md$/, '')
    return {
      id: id
    }
  })
}

export async function getPostData(id: string[]) {
  const decodedId = id.map(segment => decodeURIComponent(segment))
  const fullPath = path.join(postsDirectory, ...decodedId) + '.md'
  console.log('Attempting to read file:', fullPath)
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    console.log('File contents read successfully')
    const matterResult = matter(fileContents)
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id: id.join('/'),
      contentHtml,
      ...(matterResult.data as { date: string; title: string })
    }
  } catch (error) {
    console.error(`Error reading file: ${fullPath}`)
    console.error('Error details:', error)
    return {
      id: id.join('/'),
      contentHtml: '<p>Error: Could not load content.</p>',
      title: 'Error',
      date: ''
    }
  }
}
