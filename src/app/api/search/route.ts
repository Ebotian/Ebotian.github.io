import { NextResponse } from 'next/server'
import { getSortedPostsData } from '../../../lib/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'No search query provided' }, { status: 400 })
  }

  const allPosts = getSortedPostsData()
  const flatPosts = Object.values(allPosts).flat()

  const results = flatPosts.filter(post =>
    (post.title?.toLowerCase().includes(query.toLowerCase()) || false) ||
    (post.content?.toLowerCase().includes(query.toLowerCase()) || false)
  )

  return NextResponse.json(results)
}
