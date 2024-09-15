'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Highlighter from 'react-highlight-words'

export default function SearchResults() {
  const [results, setResults] = useState([])
  const [debug, setDebug] = useState('')
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data)
          setDebug(JSON.stringify(data, null, 2))
        })
    }
  }, [query])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">搜索结果: {query}</h1>
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((post: any, index: number) => (
            <li key={post.id || index} className="bg-white shadow rounded-lg p-4">
              <Link href={`/posts/${encodeURIComponent(post.id || '')}`}>
                <h2 className="text-xl font-semibold text-primary hover:text-secondary">
                  <Highlighter
                    highlightClassName="bg-yellow-200"
                    searchWords={[query]}
                    autoEscape={true}
                    textToHighlight={post.title || post.id || `未知标题 ${index + 1}`}
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
      <details className="mt-8">
        <summary className="cursor-pointer">调试信息</summary>
        <pre className="bg-gray-100 p-4 mt-2 rounded">{debug}</pre>
      </details>
    </div>
  )
}
