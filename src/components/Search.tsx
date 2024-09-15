'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="搜索文章..."
        className="px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
      />
      <button type="submit" className="bg-secondary text-white px-4 py-1 rounded-r-md hover:bg-primary transition-colors">
        搜索
      </button>
    </form>
  )
}
