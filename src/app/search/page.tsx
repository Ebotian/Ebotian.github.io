'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Highlighter from 'react-highlight-words'
import { Post } from '../../lib/posts'

export default function SearchResults() {
  const [results, setResults] = useState<Post[]>([])
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data))
    }
  }, [query])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">搜索结果: {query}</h1>
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((post: Post) => (
            <li key={post.id} className="bg-white shadow rounded-lg p-4">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                  <Highlighter
                    highlightClassName="bg-yellow-200"
                    searchWords={[query]}
                    autoEscape={true}
                    textToHighlight={post.title}
                  />
                </h2>
              </Link>
              {post.date && <p className="text-gray-500 text-sm">{post.date}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>没有找到相关结果。</p>
      )}
    </div>
  )
}
