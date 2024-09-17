import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import Search from '../components/Search'
import dynamic from 'next/dynamic'

const GoogleAnalytics = dynamic(() => import('../components/GoogleAnalytics'), { ssr: false })

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
    <html lang="zh" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-full bg-background text-gray-800`}>
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-secondary mb-4 md:mb-0">Ebotian 的博客</Link>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Search />
              <div className="flex items-center space-x-4">
                <Link href="https://github.com/Ebotian" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="text-2xl hover:text-secondary" />
                </Link>
                <Link href="https://x.com/AsilenA123" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-2xl hover:text-secondary" />
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-primary text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            © 2024 Ebotian 的博客. All rights reserved.
          </div>
        </footer>
        <GoogleAnalytics GA_MEASUREMENT_ID="G-NDXHPC8TS9" />
      </body>
    </html>
  )
}