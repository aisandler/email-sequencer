import { callOpenRouter } from '../api/openrouter'
import { enrichProspect } from '../api/scraper'
import type { FormData, AIConfig } from '../../types'

function buildIcebreakerPrompt(
  formData: FormData,
  prospectEmail: string,
  websiteContent: string | null,
  companyName: string | null
): string {
  return `You are an expert cold email personalization assistant. Generate a single, highly personalized icebreaker line.

## Prospect Information
- Email: ${prospectEmail}
- Company: ${companyName || 'Unknown'}

## Website Content (if available)
${websiteContent || 'No website content available - use role-based personalization instead'}

## Target ICP Context
- Role: ${formData.icp.role}
- Industry: ${formData.icp.industry}
- Pain Points: ${formData.icp.painPoints.join(', ')}
- Their Language: ${formData.icp.languageTheyUse.join(', ')}

## Your Task
Generate ONE personalized opening line that:

1. **References something SPECIFIC** about their company from the website content
2. **Could NOT apply to 1000 other companies** (passes the "Only Them Test")
3. **Naturally bridges to** their likely pain point: ${formData.icp.painPoints[0] || 'operational challenges'}

## STRICT Rules
- Start with an observation about THEM, not "I" or "We"
- NO "I saw...", "I noticed...", "I came across..."
- NO generic statements like "As a [role]..." or "Companies like yours..."
- One sentence only, max 25 words
- Make it feel like you genuinely researched them

## Good Examples
- "Your recent move into enterprise sales usually creates handoff chaos between SDRs and AEs."
- "The Series B announcement looked solid - scaling outbound at this stage usually breaks when founders stop doing it."
- "Three new BDR roles posted this month - that hiring pace usually outstrips the existing playbook."

## Bad Examples (NEVER use these patterns)
- "As a VP of Sales, you probably..."
- "I noticed your company is growing..."
- "Hope this email finds you well..."
- "I saw your LinkedIn post..."

Return ONLY the icebreaker line - no explanation, no quotes, just the line itself.`
}

export async function generateLiveIcebreaker(
  prospectEmail: string,
  formData: FormData,
  config: AIConfig
): Promise<string> {
  // Enrich prospect data by scraping their company website
  const { websiteContent, companyName } = await enrichProspect(prospectEmail)

  const prompt = buildIcebreakerPrompt(
    formData,
    prospectEmail,
    websiteContent,
    companyName
  )

  const result = await callOpenRouter(
    [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: `Generate a personalized icebreaker for: ${prospectEmail}`,
      },
    ],
    config
  )

  // Clean up the result - remove quotes if present
  return result.trim().replace(/^["']|["']$/g, '')
}
