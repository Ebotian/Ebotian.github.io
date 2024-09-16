import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

function getFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];
  for (const file of files) {
    if (file.isDirectory()) {
      result = result.concat(getFiles(path.join(dir, file.name)).map(f => path.join(file.name, f)));
    } else if (file.name.endsWith('.md')) {
      result.push(file.name);
    }
  }
  return result;
}

function formatDate(date: string | Date): string {
  if (!date) return '未知日期';
  const d = new Date(date);
  return isNaN(d.getTime()) ? '未知日期' : d.toISOString().split('T')[0];
}

export function getSortedPostsData() {
  const fileNames = getFiles(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
      date: formatDate(matterResult.data.date)
    }
  })
  return allPostsData.sort((a, b) => a.date < b.date ? 1 : -1)
}

export function getAllPostIds() {
  const fileNames = getFiles(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '').split(path.sep)
      }
    }
  })
}

export function getPostData(id: string[]) {
  const fullPath = path.join(postsDirectory, ...id) + '.md'
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const processedContent = remark()
      .use(html)
      .processSync(matterResult.content)
    const contentHtml = processedContent.toString()
    return {
      id: id.join('/'),
      contentHtml,
      ...(matterResult.data as { date: string; title: string }),
      date: formatDate(matterResult.data.date)
    }
  } catch (error) {
    console.error(`Error reading file: ${fullPath}`, error)
    return {
      id: id.join('/'),
      contentHtml: '<p>文章内容不可用</p>',
      title: '文章不存在',
      date: '未知日期'
    }
  }
}