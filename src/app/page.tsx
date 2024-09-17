import Link from 'next/link'
import { getPostsByMonth, countWords } from '../lib/posts'

export default function Home() {
  const postsByMonth = getPostsByMonth()

  const totalWordCount = Object.values(postsByMonth).flat().reduce((total, post) => total + (post.wordCount || 0), 0)

  return (
    <div>
      <div className="h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative" style={{backgroundImage: 'url("/background.png")'}}>
        <h1 className="text-6xl font-bold text-white text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>欢迎来到 Ebotian 的博客</h1>
        <p className="text-2xl text-white mt-4" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>总字数：{totalWordCount} 字</p>
        <a href="https://www.pixiv.net/artworks/110554663" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 text-white text-sm opacity-70 hover:opacity-100 transition-opacity">
          背景图片来源: Pixiv
        </a>
      </div>
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-primary">我的文章</h2>
        {Object.entries(postsByMonth).map(([monthKey, posts]) => (
          <div key={monthKey} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-secondary">{formatMonthKey(monthKey)}</h3>
            <ul className="space-y-4">
              {posts.map(({ id, date, title, wordCount }) => (
                <li key={id} className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
                  <Link href={`/posts/${id}`} className="block">
                    <h4 className="text-xl font-semibold text-secondary hover:text-primary mb-2">{title}</h4>
                    <p className="text-gray-500 text-sm">{date} • {wordCount} 字</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleString('zh-CN', { year: 'numeric', month: 'long' })
}