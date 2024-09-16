import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const SearchResults = dynamic(() => import('@/components/SearchResults'), {
  ssr: false,
  loading: () => <p>正在加载搜索结果...</p>
})

export const dynamicConfig = 'force-dynamic'

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">搜索结果</h1>
      <Suspense fallback={<p>正在加载搜索结果...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
