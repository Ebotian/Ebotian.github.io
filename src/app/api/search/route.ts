import { NextResponse } from 'next/server'
import { getSortedPostsData } from '../../../lib/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const allPosts = getSortedPostsData()

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(query?.toLowerCase() || '') ||
    post.id.toLowerCase().includes(query?.toLowerCase() || '')
  )

  return NextResponse.json(filteredPosts)
}
