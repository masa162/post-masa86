'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const runtime = 'edge'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const credentials = localStorage.getItem('adminCredentials')
    
    if (!credentials) {
      promptForCredentials()
      return
    }

    try {
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setIsChecking(false)
      } else {
        localStorage.removeItem('adminCredentials')
        promptForCredentials()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      promptForCredentials()
    }
  }

  const promptForCredentials = () => {
    const username = prompt('Username:')
    const password = prompt('Password:')

    if (username && password) {
      const credentials = btoa(`${username}:${password}`)
      localStorage.setItem('adminCredentials', credentials)
      setIsAuthenticated(true)
      setIsChecking(false)
    } else {
      router.push('/')
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">認証中...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">管理画面 - 中山雑記</h1>
            <div className="flex gap-4">
              <a
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                サイトを表示
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('adminCredentials')
                  router.push('/')
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

