import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">欢迎来到Ebotian的博客</h1>
      <p className="text-xl mb-8">这里是我分享想法和经验的地方。</p>
    </main>
  )
}