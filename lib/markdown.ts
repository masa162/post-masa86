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
  
  // YouTube shortcode: {{< youtube VIDEO_ID >}} → iframe
  processed = processed.replace(
    /\{\{<\s*youtube\s+([a-zA-Z0-9_-]+)\s*>\}\}/g,
    '<div class="youtube-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
  )
  
  // Markdownを解析
  const html = marked.parse(processed) as string
  
  return html
}

