import Link from 'next/link'

export default function Header() {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold">
        <Link href="/" className="text-gray-900 hover:text-blue-600 no-underline">
          中山雑記
        </Link>
      </h1>
    </header>
  )
}

