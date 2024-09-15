import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ebotian 的博客',
  description: '分享技术、生活和思考',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Ebotian 的博客</Link>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/Ebotian" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-2xl" />
              </Link>
              <Link href="https://x.com/AsilenA123" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl" />
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            © 2024 Ebotian 的博客. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
