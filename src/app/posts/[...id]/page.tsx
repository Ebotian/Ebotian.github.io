import { getAllPostIds, getPostData } from '../../../lib/posts'
import Link from 'next/link'

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  return (
    <article className="prose lg:prose-xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <Link href="/" className="text-secondary hover:text-primary mb-4 inline-block">&larr; 返回首页</Link>
      <h1 className="text-4xl font-bold mb-4 text-primary">{postData.title || postData.id}</h1>
      {postData.date && <p className="text-gray-500 mb-8">{postData.date}</p>}
      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.id.split('/')
  }))
}
