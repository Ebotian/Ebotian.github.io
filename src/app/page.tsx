import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home() {
  const allPosts = getSortedPostsData()
  const latestPostIds = new Set(allPosts.slice(0, 5).map(post => post.id))

  return (
    <div>
      <div className="h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative" style={{backgroundImage: 'url("/background.png")'}}>
        <h1 className="text-6xl font-bold text-white text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>欢迎来到 Ebotian 的博客</h1>
        <a href="https://www.pixiv.net/artworks/110554663" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 text-white text-sm opacity-70 hover:opacity-100 transition-opacity">
          背景图片来源: Pixiv
        </a>
      </div>
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-primary">最新文章</h2>
        <ul className="space-y-4">
          {allPosts.slice(0, 5).map(({ id, date, title }) => (
            <li key={id} className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
              <Link href={`/posts/${id.split('/').join('/')}`}>
                <h3 className="text-2xl font-semibold text-secondary hover:text-primary mb-2">{title || id}</h3>
              </Link>
              <p className="text-gray-500">{date}</p>
            </li>
          ))}
        </ul>
        <h2 className="text-4xl font-bold my-8 text-primary">文章归档</h2>
        <ul className="space-y-4">
          {allPosts.filter(post => !latestPostIds.has(post.id)).map(({ id, date, title }) => (
            <li key={id} className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
              <Link href={`/posts/${id.split('/').join('/')}`}>
                <h4 className="text-xl font-semibold text-secondary hover:text-primary mb-2">{title || id}</h4>
              </Link>
              <p className="text-gray-500 text-sm">{date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}