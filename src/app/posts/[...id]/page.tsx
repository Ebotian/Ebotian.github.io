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
      <Link href="/" className="inline-block mb-6 transition duration-300 ease-in-out transform hover:-translate-y-1">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回首页
        </button>
      </Link>
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