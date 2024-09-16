import { getPostData, getAllPostIds } from '../../../lib/posts'

export default function Post({ params }: { params: { id: string[] } }) {
  const postData = getPostData(params.id)

  return (
    <article className="prose lg:prose-xl mx-auto px-4 py-8">
      <h1>{postData.title}</h1>
      <div className="text-gray-500 mb-4">{new Date(postData.date).toLocaleDateString()}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  )
}

export function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}
