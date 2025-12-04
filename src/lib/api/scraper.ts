// Web scraping utility for prospect enrichment
// Uses Jina Reader API for clean markdown extraction

const JINA_READER_URL = 'https://r.jina.ai/'

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`

    // Use Jina Reader API for clean markdown extraction
    const response = await fetch(`${JINA_READER_URL}${fullUrl}`, {
      headers: {
        Accept: 'text/plain',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`)
    }

    const content = await response.text()

    // Truncate to reasonable length for AI processing
    const maxLength = 8000
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '\n\n[Content truncated...]'
    }

    return content
  } catch (error) {
    console.error('Scraping error:', error)
    throw new Error('Failed to fetch website content')
  }
}

export function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@([^@]+)$/)
  if (!match) return null

  const domain = match[1].toLowerCase()

  // Skip common email providers - these don't give company info
  const genericDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
  ]

  if (genericDomains.includes(domain)) {
    return null
  }

  return domain
}

export async function enrichProspect(email: string): Promise<{
  domain: string | null
  websiteContent: string | null
  companyName: string | null
}> {
  const domain = extractDomainFromEmail(email)

  if (!domain) {
    return {
      domain: null,
      websiteContent: null,
      companyName: null,
    }
  }

  try {
    const websiteContent = await scrapeWebsite(domain)

    // Try to extract company name from content
    let companyName: string | null = null
    const titleMatch = websiteContent.match(/^#\s*(.+?)(?:\n|$)/m)
    if (titleMatch) {
      companyName = titleMatch[1].trim()
    }

    return {
      domain,
      websiteContent,
      companyName,
    }
  } catch {
    return {
      domain,
      websiteContent: null,
      companyName: null,
    }
  }
}
