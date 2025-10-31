import Link from 'next/link'
import Archive from './Archive'

interface SidebarProps {
  tags?: string[]
  archive?: any
}

export default function Sidebar({ tags = [], archive = {} }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* About Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">About</h3>
        <div className="sidebar-content">
          <p>記録と感覚の交差点、unbelongの雑記ブログ。</p>
        </div>
      </div>

      {/* Archive Section */}
      {Object.keys(archive).length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">アーカイブ</h3>
          <div className="sidebar-content">
            <Archive archive={archive} />
          </div>
        </div>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Tags</h3>
          <div className="sidebar-content">
            <ul className="tag-list">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/tags/${encodeURIComponent(tag)}`}>
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  )
}
