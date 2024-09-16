'use client'

import { useEffect, useState } from 'react'
import { getPostData, getAllPostIds } from '../../../lib/posts'
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa'

export default function Post({ params }: { params: { id: string[] } }) {
  const postData = getPostData(params.id.map(decodeURIComponent))
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
          <div className="text-gray-500 mb-4">{postData.date}</div>
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
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(postData.title)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}