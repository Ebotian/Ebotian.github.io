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
