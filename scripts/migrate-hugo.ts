import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const HUGO_CONTENT_PATH = 'D:\\github\\masa86\\content\\posts'

interface HugoPost {
  title: string
  date: string
  slug: string
  tags: string[]
  content: string
}

interface MigratedPost {
  slug: string
  title: string
  content: string
  tags: string
  created_at: string
  updated_at: string
}

function readHugoPosts(): HugoPost[] {
  const posts: HugoPost[] = []

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath)
      } else if (file.endsWith('.md') && !file.startsWith('templete')) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)

        if (data.title && data.date) {
          posts.push({
            title: data.title,
            date: data.date,
            slug: data.slug || path.basename(file, '.md'),
            tags: Array.isArray(data.tags) ? data.tags : [],
            content: content.trim(),
          })
        }
      }
    }
  }

  walkDir(HUGO_CONTENT_PATH)
  return posts
}

function assignSequentialSlugs(posts: HugoPost[]): MigratedPost[] {
  const sorted = posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB
  })

  return sorted.map((post, index) => {
    const slugNumber = (index + 1).toString().padStart(4, '0')
    const createdAt = new Date(post.date).toISOString()

    return {
      slug: slugNumber,
      title: post.title,
      content: post.content,
      tags: JSON.stringify(post.tags),
      created_at: createdAt,
      updated_at: createdAt,
    }
  })
}

function generateInsertSQL(posts: MigratedPost[]): string {
  const statements = posts.map((post) => {
    const slug = post.slug.replace(/'/g, "''")
    const title = post.title.replace(/'/g, "''")
    const content = post.content.replace(/'/g, "''")
    const tags = post.tags.replace(/'/g, "''")
    const createdAt = post.created_at
    const updatedAt = post.updated_at

    return `INSERT INTO posts (slug, title, content, tags, created_at, updated_at) VALUES ('${slug}', '${title}', '${content}', '${tags}', '${createdAt}', '${updatedAt}');`
  })

  const sql = `-- Migrated posts from Hugo\n\n`
    + statements.join('\n\n')
    + '\n'

  return sql
}

async function main() {
  console.log('🔍 Reading Hugo posts from:', HUGO_CONTENT_PATH)
  
  try {
    const hugoPosts = readHugoPosts()
    console.log(`✅ Found ${hugoPosts.length} posts`)

    console.log('🔄 Assigning sequential slugs...')
    const migratedPosts = assignSequentialSlugs(hugoPosts)

    const sql = generateInsertSQL(migratedPosts)
    const outputPath = path.join(process.cwd(), 'migrate-data.sql')
    fs.writeFileSync(outputPath, sql, 'utf-8')

    console.log(`✅ Migration SQL generated: ${outputPath}`)
    console.log(`\n📊 Summary:`)
    console.log(`   Total posts: ${migratedPosts.length}`)
    console.log(`   Slug range: ${migratedPosts[0].slug} - ${migratedPosts[migratedPosts.length - 1].slug}`)
    console.log(`\n🚀 Next step:`)
    console.log(`   npx wrangler d1 execute post-masa86-db --remote --file=./migrate-data.sql`)

    console.log(`\n📝 First 5 posts:`)
    migratedPosts.slice(0, 5).forEach((post) => {
      console.log(`   ${post.slug}: ${post.title}`)
    })

  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

main()

