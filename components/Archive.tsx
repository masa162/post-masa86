'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ArchiveProps {
  archive: {
    [year: string]: {
      [month: string]: Array<{
        id: number
        slug: string
        title: string
        created_at: string
      }>
    }
  }
  currentSlug?: string
}

export default function Archive({ archive, currentSlug }: ArchiveProps) {
  const years = Object.keys(archive).sort((a, b) => parseInt(b) - parseInt(a))
  
  // Find current post's year and month
  let currentYear = years[0]
  let currentMonth = ''
  
  if (currentSlug) {
    for (const year of years) {
      for (const month of Object.keys(archive[year])) {
        const posts = archive[year][month]
        if (posts.some(post => post.slug === currentSlug)) {
          currentYear = year
          currentMonth = month
          break
        }
      }
      if (currentMonth) break
    }
  }

  const [openYears, setOpenYears] = useState<Set<string>>(new Set([currentYear]))
  const [openMonths, setOpenMonths] = useState<Set<string>>(
    new Set(currentMonth ? [`${currentYear}-${currentMonth}`] : 
           (years[0] ? [`${years[0]}-${Object.keys(archive[years[0]])[0]}`] : []))
  )

  // Update open state when currentSlug changes
  useEffect(() => {
    if (currentSlug) {
      for (const year of years) {
        for (const month of Object.keys(archive[year])) {
          const posts = archive[year][month]
          if (posts.some(post => post.slug === currentSlug)) {
            setOpenYears(new Set([year]))
            setOpenMonths(new Set([`${year}-${month}`]))
            return
          }
        }
      }
    }
  }, [currentSlug, years, archive])

  const toggleYear = (year: string) => {
    const newOpenYears = new Set(openYears)
    if (newOpenYears.has(year)) {
      newOpenYears.delete(year)
      // Close all months in this year
      const newOpenMonths = new Set(openMonths)
      Object.keys(archive[year]).forEach(month => {
        newOpenMonths.delete(`${year}-${month}`)
      })
      setOpenMonths(newOpenMonths)
    } else {
      newOpenYears.add(year)
    }
    setOpenYears(newOpenYears)
  }

  const toggleMonth = (year: string, month: string) => {
    const key = `${year}-${month}`
    const newOpenMonths = new Set(openMonths)
    if (newOpenMonths.has(key)) {
      newOpenMonths.delete(key)
    } else {
      newOpenMonths.add(key)
    }
    setOpenMonths(newOpenMonths)
  }

  return (
    <div className="archive-hierarchical">
      {years.map(year => {
        const isYearOpen = openYears.has(year)
        const months = Object.keys(archive[year]).sort((a, b) => parseInt(b) - parseInt(a))
        const postCount = months.reduce((sum, month) => sum + archive[year][month].length, 0)

        return (
          <div key={year} className="archive-year">
            <div
              className="archive-year-toggle"
              onClick={() => toggleYear(year)}
            >
              <span className={`toggle-arrow ${isYearOpen ? 'open' : 'closed'}`}>
                {isYearOpen ? '▼' : '▶'}
              </span>
              <span className="archive-year-label">
                {year} ({postCount})
              </span>
            </div>

            {isYearOpen && (
              <div className="archive-months">
                {months.map(month => {
                  const monthKey = `${year}-${month}`
                  const isMonthOpen = openMonths.has(monthKey)
                  const posts = archive[year][month]

                  return (
                    <div key={month} className="archive-month">
                      <div
                        className="archive-month-toggle"
                        onClick={() => toggleMonth(year, month)}
                      >
                        <span className={`toggle-arrow ${isMonthOpen ? 'open' : 'closed'}`}>
                          {isMonthOpen ? '▼' : '▶'}
                        </span>
                        <span className="archive-month-label">
                          {month}月 ({posts.length})
                        </span>
                      </div>

                      {isMonthOpen && (
                        <div className="archive-posts">
                          {posts.map(post => (
                            <div 
                              key={post.id} 
                              className={`archive-post ${currentSlug === post.slug ? 'active' : ''}`}
                            >
                              <Link href={`/${post.slug}`}>
                                {post.title}
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
