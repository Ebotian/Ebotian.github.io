'use client'

import { useEffect, useState } from 'react'
import { FaTwitter, FaFacebook } from 'react-icons/fa'
import { SiBilibili } from 'react-icons/si'

export default function ClientPost({ postData }) {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
          <div className="text-gray-500 mb-4">
            {postData.date} • {postData.wordCount} 字
          </div>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
      </article>

      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">分享这篇文章</h2>
        <div className="flex space-x-4">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(postData.title)}&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
            <FaTwitter size={24} />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
            <FaFacebook size={24} />
          </a>
          <a href={`https://t.bilibili.com/?tab=article&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(postData.title)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
            <SiBilibili size={24} />
          </a>
        </div>
      </div>
    </div>
  )
}