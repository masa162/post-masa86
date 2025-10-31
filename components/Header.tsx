'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import SearchBox from './SearchBox'

interface HeaderProps {
  tags?: string[]
  archive?: any
  currentSlug?: string
}

export default function Header({ tags = [], archive = {}, currentSlug }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="site-header">
        <div className="header-content">
          <h1 className="site-title">
            <Link href="/">中山雑記</Link>
          </h1>
          <button
            className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="メニューを開く"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>
      
      {/* モバイル用ハンバーガーメニューオーバーレイ */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      ></div>
      
      {/* モバイル用サイドメニュー */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-sidebar-header">
          <h3>メニュー</h3>
          <button
            className="mobile-menu-close"
            onClick={toggleMobileMenu}
            aria-label="メニューを閉じる"
          >
            ×
          </button>
        </div>
        <div className="mobile-sidebar-content">
          <p className="mb-4 text-sm">記録と感覚の交差点、unbelongの雑記ブログ。</p>
          <nav className="space-y-2 mb-6">
            <Link href="/" className="block py-2 text-sm hover:text-blue-600" onClick={toggleMobileMenu}>
              ホーム
            </Link>
            <Link href="/posts" className="block py-2 text-sm hover:text-blue-600" onClick={toggleMobileMenu}>
              記事一覧
            </Link>
            <Link href="/search" className="block py-2 text-sm hover:text-blue-600" onClick={toggleMobileMenu}>
              検索
            </Link>
          </nav>
          <SearchBox />
          <Sidebar tags={tags} archive={archive} currentSlug={currentSlug} />
        </div>
      </div>
    </>
  )
}
