import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Post = {
  id: string;
  date: string;
  title: string;
  content?: string;
};

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

// ... 其余代码保持不变 ...
