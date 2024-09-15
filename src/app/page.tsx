import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home() {
  const allPostsData = getSortedPostsData()
  return (
    <div>
      <div className="h-screen bg-cover bg-center flex items-center justify-center" style={{backgroundImage: 'url("/welcome-bg.jpg")'}}>
        <h1 className="text-6xl font-bold text-white text-center">欢迎来到 Ebotian 的博客</h1>
      </div>
      <div className="py-16">
        <h2 className="text-4xl font-bold mb-8">最新文章</h2>
        <ul className="space-y-4">
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="bg-white shadow rounded-lg p-6">
              <Link href={`/posts/${id.split('/').map(encodeURIComponent).join('/')}`}>
                <h3 className="text-2xl font-semibold text-blue-600 hover:text-blue-800 mb-2">{title || id}</h3>
              </Link>
              {date && <p className="text-gray-500 text-sm">{date}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
