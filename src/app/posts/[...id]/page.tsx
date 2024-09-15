import { getAllPostIds, getPostData } from '../../../lib/posts'
import Link from 'next/link'

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  return (
    <article className="prose lg:prose-xl mx-auto">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; 返回首页</Link>
      <h1 className="text-4xl font-bold mb-4">{postData.title || postData.id}</h1>
      {postData.date && <p className="text-gray-500 mb-8">{postData.date}</p>}
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      {/* 这里可以添加评论系统和访问统计 */}
    </article>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.id.split('/')
  }))
}
