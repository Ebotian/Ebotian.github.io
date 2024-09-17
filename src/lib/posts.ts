import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

function getFiles(dir: string): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let result: string[] = [];
  for (const file of files) {
    if (file.isDirectory()) {
      result = result.concat(getFiles(path.join(dir, file.name)).map(f => path.join(file.name, f)));
    } else if (file.name.endsWith('.md')) {
      result.push(file.name);
    }
  }
  return result;
}

function getDateFromFile(filePath: string, fileContent: string): string {
  const matterResult = matter(fileContent)

  if (matterResult.data.date) {
    return formatDate(matterResult.data.date)
  }

  const dateMatch = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/)
  if (dateMatch) {
    return formatDate(dateMatch[1])
  }

  const stats = fs.statSync(filePath)
  return formatDate(stats.mtime)
}

function formatDate(date: string | Date): string {
  if (!date) return '未知日期';
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    const parts = date.toString().split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
        return newDate.toISOString().split('T')[0];
      }
    }
    return '未知日期';
  }
  return d.toISOString().split('T')[0];
}

export function countWords(str: string): number {
  str = str.replace(/<[^>]*>/g, '');
  str = str.replace(/[^\w\s\u4e00-\u9fa5]/g, '');
  const words = str.trim().split(/\s+/);
  const chineseCharacters = str.match(/[\u4e00-\u9fa5]/g) || [];
  return words.length + chineseCharacters.length;
}

interface PostData {
  id: string;
  title: string;
  date: string;
  contentHtml?: string;
  wordCount?: number;
}

export function getSortedPostsData(): PostData[] {
  const fileNames = getFiles(postsDirectory)
  const allPostsData = fileNames.map((fileName): PostData => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const date = getDateFromFile(fullPath, fileContents)
    const processedContent = remark().use(html).processSync(fileContents)
    const contentHtml = processedContent.toString()

    return {
      id,
      title: path.basename(id),
      date: date,
      contentHtml: contentHtml,
      wordCount: countWords(contentHtml)
    }
  })
  return allPostsData.sort((a, b) => a.date < b.date ? 1 : -1)
}

export function getPostsByMonth(): { [key: string]: PostData[] } {
  const posts = getSortedPostsData()
  const postsByMonth: { [key: string]: PostData[] } = {}

  posts.forEach(post => {
    const [year, month] = post.date.split('-')
    const key = `${year}-${month}`
    if (!postsByMonth[key]) {
      postsByMonth[key] = []
    }
    postsByMonth[key].push(post)
  })

  return postsByMonth
}

export function getAllPostIds(): { params: { id: string[] } }[] {
  const fileNames = getFiles(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '').split(path.sep)
      }
    }
  })
}

export function getPostData(id: string[]): PostData {
  const fullPath = path.join(postsDirectory, ...id) + '.md'
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const processedContent = remark()
      .use(html)
      .processSync(matterResult.content)
    const contentHtml = processedContent.toString()

    const date = getDateFromFile(fullPath, fileContents)

    return {
      id: id.join('/'),
      title: path.basename(id[id.length - 1]),
      contentHtml,
      date: date,
      wordCount: countWords(contentHtml)
    }
  } catch (error) {
    console.error(`Error reading file: ${fullPath}`, error)
    return {
      id: id.join('/'),
      contentHtml: '<p>文章内容不可用</p>',
      title: '文章不存在',
      date: '未知日期',
      wordCount: 0
    }
  }
}