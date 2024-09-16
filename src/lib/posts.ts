import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/posts')

function getFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];
  for (const file of files) {
    if (file.isDirectory()) {
      result = result.concat(getFiles(path.join(dir, file.name)).map(f => path.join(file.name, f)));
    } else {
      result.push(file.name);
    }
  }
  return result;
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
      date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : 'Unknown Date'
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
    date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : 'Unknown Date'
  }
}
