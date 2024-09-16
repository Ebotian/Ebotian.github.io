import { getPostData, getAllPostIds } from '../../../lib/posts'
import Link from 'next/link'
import ShareButtons from '../../../components/ShareButtons'
import { headers } from 'next/headers'

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id)
  const headersList = headers()
  const domain = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const currentUrl = `${protocol}://${domain}/posts/${params.id.join('/')}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回首页</Link>
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{postData.title}</h1>
          <div className="text-gray-600 mb-4">{postData.date}</div>
          <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
      </article>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">分享这篇文章</h2>
        <ShareButtons url={currentUrl} title={postData.title} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}
