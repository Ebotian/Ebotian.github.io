import { getPostData, getAllPostIds } from '../../../lib/posts'
import ClientPost from './ClientPost'

export default function Post({ params }: { params: { id: string[] } }) {
  const postData = getPostData(params.id.map(decodeURIComponent))

  return <ClientPost postData={postData} />
}

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}
