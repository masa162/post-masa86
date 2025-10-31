export default function Loading() {
  return (
    <div className="main-container">
      <div className="content-wrapper">
        <main className="main-content">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </main>
      </div>
    </div>
  )
}

