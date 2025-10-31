import Link from 'next/link'

interface SidebarProps {
  tags?: string[]
}

export default function Sidebar({ tags = [] }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0">
      {/* About Section */}
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">About</h3>
        <div className="text-sm text-gray-700">
          <p>記録と感覚の交差点、unbelongの雑記ブログ。</p>
        </div>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Tags</h3>
          <ul className="space-y-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="text-sm text-blue-600 hover:text-blue-800 no-underline"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

