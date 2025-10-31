import { marked } from 'marked'

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
})

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

export function parseMarkdown(markdown: string): string {
  // Hugoのショートコードを変換
  let processed = markdown
  
  // YouTube shortcode: {{< youtube VIDEO_ID >}} → iframe (width/height属性を削除)
  processed = processed.replace(
    /\{\{<\s*youtube\s+([a-zA-Z0-9_-]+)\s*>\}\}/g,
    '<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
  )
  
  // Markdownを解析
  let html = marked.parse(processed) as string
  
  // 画像タグからwidth/height属性を削除
  html = html.replace(/<img([^>]*)\s+width="[^"]*"([^>]*)>/gi, '<img$1$2>')
  html = html.replace(/<img([^>]*)\s+height="[^"]*"([^>]*)>/gi, '<img$1$2>')
  
  return html
}

