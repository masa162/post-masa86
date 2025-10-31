export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

export function parseMarkdown(markdown: string): string {
  // シンプルなMarkdown→HTML変換（後で marked を追加）
  return markdown
    .split('\n')
    .map(line => {
      // 見出し
      if (line.startsWith('## ')) {
        return `<h2>${line.slice(3)}</h2>`
      }
      if (line.startsWith('# ')) {
        return `<h1>${line.slice(2)}</h1>`
      }
      // リンク
      line = line.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
      // 画像
      line = line.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />')
      // 段落
      if (line.trim()) {
        return `<p>${line}</p>`
      }
      return ''
    })
    .join('\n')
}

