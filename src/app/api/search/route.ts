import { NextResponse } from 'next/server'
import { getSortedPostsData } from '../../../lib/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const allPosts = getSortedPostsData()
  
  const filteredPosts = allPosts.filter(post => {
    const title = post.title?.toLowerCase() || ''
    const id = post.id?.toLowerCase() || ''
    const searchQuery = query?.toLowerCase() || ''
    return title.includes(searchQuery) || id.includes(searchQuery)
  })

  return NextResponse.json(filteredPosts)
}
