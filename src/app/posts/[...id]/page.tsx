import { getAllPostIds, getPostData } from '../../../lib/posts'
import Link from 'next/link'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.params.id
  }))
}

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
      <div className="text-gray-500 mb-4">{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.content || '' }} />
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
