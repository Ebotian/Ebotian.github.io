import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home() {
  const allPostsData = getSortedPostsData()
  return (
    <div>
      <div className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{backgroundImage: 'url("/background.png")'}}>
        <h1 className="text-6xl font-bold text-white text-center shadow-lg p-6 bg-black bg-opacity-50 rounded-lg">欢迎来到 Ebotian 的博客</h1>
      </div>
      <div className="py-16">
        <h2 className="text-4xl font-bold mb-8 text-primary">最新文章</h2>
        <ul className="space-y-4">
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
              <Link href={`/posts/${id.split('/').map(encodeURIComponent).join('/')}`}>
                <h3 className="text-2xl font-semibold text-secondary hover:text-primary mb-2">{title || id}</h3>
              </Link>
              {date && <p className="text-gray-500 text-sm">{date}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
