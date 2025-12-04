import { callOpenRouterJSON } from '../api/openrouter'
import { EMAIL_RULES, SUBJECT_LINE_RULES, CTA_RULES, SEQUENCE_STRUCTURE } from '../rules/emailRules'
import type { FormData, Email, EmailSequence, AIConfig, ValidationItem } from '../../types'

interface GeneratedEmailSequence {
  emails: Array<{
    subjectLine: string
    body: string
  }>
}

function buildSystemPrompt(formData: FormData): string {
  return `You are an expert cold email copywriter. Generate a 4-email sequence following these STRICT rules:

## CRITICAL RULES (MUST FOLLOW)

### Word Count
- Each email MUST be ${EMAIL_RULES.MIN_WORDS}-${EMAIL_RULES.MAX_WORDS} words (this is non-negotiable)
- Use 1-2 sentences per paragraph for mobile scannability

### Opening Line Rules
- NEVER start with "I" or "We" - always start with THEM (observation about their company/situation)
- NEVER use: "My name is...", "I'm the founder of...", "I wanted to reach out...", "We help companies..."
- First line must pass the "Only Them Test" - could NOT apply to 1000 other companies

### Subject Line Rules
- ${SUBJECT_LINE_RULES.MIN_WORDS}-${SUBJECT_LINE_RULES.MAX_WORDS} words only
- Lowercase or sentence case (never ALL CAPS)
- NO {{firstName}} in subjects
- NO fake "Re:" or "Fwd:"
- Email 3 can use {{companyName}}

### CTA Rules
- Email 1: NEVER ask for a call - offer value first (audit, playbook, resource)
- Use phrases like "Would it make sense to send...", "No call required"
- Make it easy to say yes in 10 seconds

### Follow-up Rules
- Each email MUST add NEW value - never "just checking in" or "circling back"
- Each follow-up should stand alone as valuable

## SEQUENCE STRUCTURE
- Email 1 (Day 0): Value offer - offer audit, playbook, or case study
- Email 2 (Day 3): Additional insight or data point
- Email 3 (Day 6): Social proof angle with similar company
- Email 4 (Day 9): Free resource, no strings attached

## CONTEXT PROVIDED

### Target ICP
- Role: ${formData.icp.role || 'Not specified'}
- Company Size: ${formData.icp.companySize || 'Not specified'}
- Industry: ${formData.icp.industry || 'Not specified'}
- Pain Points: ${formData.icp.painPoints.length > 0 ? formData.icp.painPoints.join(', ') : 'Not specified'}
- Their Language: ${formData.icp.languageTheyUse.length > 0 ? formData.icp.languageTheyUse.join(', ') : 'Not specified'}

### Offer
- Offering: ${formData.offer.offering || 'Not specified'}
- Deliverable: ${formData.offer.deliverable || 'Not specified'}
- Timeline: ${formData.offer.timeline || 'Not specified'}
- Value Prop: ${formData.offer.valueProp || 'Not specified'}

### Brand Context
- Sender: ${formData.brand.senderName || 'Not specified'}
- Company: ${formData.brand.companyName || 'Not specified'}
- Credentials: ${formData.brand.credentials || 'Not specified'}
- Website: ${formData.brand.website || 'Not specified'}
- Calendly: ${formData.brand.calendlyLink || 'Not specified'}

### Social Proof
- Metrics: ${formData.socialProof.metrics.length > 0 ? formData.socialProof.metrics.join(', ') : 'Not specified'}
- Results: ${formData.socialProof.results.length > 0 ? formData.socialProof.results.join(', ') : 'Not specified'}
- Case Studies: ${formData.socialProof.caseStudyReferences.length > 0 ? formData.socialProof.caseStudyReferences.join(', ') : 'Not specified'}

## OUTPUT FORMAT
Generate exactly 4 emails. Use {{firstName}} for prospect's first name and {{personalization}} as a placeholder for the icebreaker line (first line of email).

Each email body should follow this structure:
{{firstName}},

{{personalization}}

[2-3 short paragraphs with your pitch]

[Sign-off]
${formData.brand.senderName}
${formData.brand.credentials ? formData.brand.credentials + ', ' : ''}${formData.brand.companyName}
${formData.brand.calendlyLink ? 'Book a call: ' + formData.brand.calendlyLink : ''}
${formData.brand.website || ''}

Return your response as valid JSON with this exact structure:
{
  "emails": [
    { "subjectLine": "...", "body": "..." },
    { "subjectLine": "...", "body": "..." },
    { "subjectLine": "...", "body": "..." },
    { "subjectLine": "...", "body": "..." }
  ]
}`
}

function countWords(text: string): number {
  return text
    .replace(/\{\{[^}]+\}\}/g, 'placeholder') // Count placeholders as single words
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function validateSequence(emails: Email[], _formData: FormData): ValidationItem[] {
  const results: ValidationItem[] = []

  emails.forEach((email, index) => {
    // Word count validation
    const wordCount = email.wordCount
    results.push({
      rule: `Email ${index + 1}: Word Count`,
      description:
        wordCount >= EMAIL_RULES.MIN_WORDS && wordCount <= EMAIL_RULES.MAX_WORDS
          ? `${wordCount} words (within ${EMAIL_RULES.MIN_WORDS}-${EMAIL_RULES.MAX_WORDS} range)`
          : `${wordCount} words (should be ${EMAIL_RULES.MIN_WORDS}-${EMAIL_RULES.MAX_WORDS})`,
      passed: wordCount >= EMAIL_RULES.MIN_WORDS && wordCount <= EMAIL_RULES.MAX_WORDS,
      emailIndex: index,
    })

    // "Me First" check - skip if starts with placeholder
    const firstLine = email.body.split('\n').find((line) => line.trim() && !line.includes('{{'))
    if (firstLine) {
      const hasMeFirst = EMAIL_RULES.ME_FIRST_PATTERNS.some((p) => p.test(firstLine))
      results.push({
        rule: `Email ${index + 1}: Starts with THEM`,
        description: hasMeFirst
          ? 'First line starts with I/We/My/Our - should start with them'
          : 'First line focuses on the prospect',
        passed: !hasMeFirst,
        emailIndex: index,
      })
    }

    // Email 1: No call ask
    if (index === 0) {
      const hasCallAsk = CTA_RULES.EMAIL_1_FORBIDDEN.some((p) => p.test(email.body))
      results.push({
        rule: 'Email 1: No Call Ask',
        description: hasCallAsk
          ? 'Contains call ask - Email 1 should offer value, not ask for call'
          : 'Offers value first without asking for a call',
        passed: !hasCallAsk,
        emailIndex: 0,
      })
    }

    // Subject line validation
    const subjectWords = email.subjectLine.split(/\s+/).filter(Boolean).length
    const subjectValid =
      subjectWords >= SUBJECT_LINE_RULES.MIN_WORDS &&
      subjectWords <= SUBJECT_LINE_RULES.MAX_WORDS
    results.push({
      rule: `Email ${index + 1}: Subject Line Length`,
      description: subjectValid
        ? `${subjectWords} words (within ${SUBJECT_LINE_RULES.MIN_WORDS}-${SUBJECT_LINE_RULES.MAX_WORDS} range)`
        : `${subjectWords} words (should be ${SUBJECT_LINE_RULES.MIN_WORDS}-${SUBJECT_LINE_RULES.MAX_WORDS})`,
      passed: subjectValid,
      emailIndex: index,
    })

    // No firstName in subject (except for Email 3 which can have companyName)
    const hasFirstNameInSubject = /\{\{firstName\}\}/i.test(email.subjectLine)
    results.push({
      rule: `Email ${index + 1}: No {{firstName}} in Subject`,
      description: hasFirstNameInSubject
        ? 'Subject contains {{firstName}} - not allowed'
        : 'Subject follows personalization rules',
      passed: !hasFirstNameInSubject,
      emailIndex: index,
    })

    // Check for lazy follow-up patterns (emails 2-4)
    if (index > 0) {
      const hasLazyFollowup = EMAIL_RULES.LAZY_FOLLOWUP_PATTERNS.some((p) =>
        p.test(email.body)
      )
      results.push({
        rule: `Email ${index + 1}: Adds New Value`,
        description: hasLazyFollowup
          ? 'Contains lazy follow-up language - should add new value'
          : 'Provides new value instead of just following up',
        passed: !hasLazyFollowup,
        emailIndex: index,
      })
    }
  })

  return results
}

function generateIcebreakerPrompt(formData: FormData): string {
  return `You are an expert cold email personalization assistant. Generate observation-first icebreaker lines for cold email outreach.

## Context
- Target Role: ${formData.icp.role}
- Company Size: ${formData.icp.companySize}
- Industry: ${formData.icp.industry}
- Pain Points: ${formData.icp.painPoints.join(', ')}
- Their Language: ${formData.icp.languageTheyUse.join(', ')}

## Your Task
For each prospect, analyze their website/LinkedIn and generate a personalized first line that:

1. **Starts with THEM** - Reference something specific about their company
2. **Passes the "Only Them Test"** - Could NOT apply to 1000 other companies
3. **Connects to a pain point** - Bridges to: ${formData.icp.painPoints[0] || 'their core challenge'}

## Format Requirements
- 1 sentence only
- No "I saw..." or "I noticed..."
- Lead with the observation, not yourself
- Max 20 words

## Examples of GOOD icebreakers:
- "Your recent expansion into {{market}} usually creates {{specific challenge}}."
- "The {{feature}} launch looks solid - teams at this stage often hit {{pain point}}."
- "Noticed you're hiring {{role}} - that transition usually breaks {{process}}."

## Examples of BAD icebreakers (AVOID):
- "As the VP of Sales, you probably..."
- "I saw your company is growing..."
- "I noticed you posted on LinkedIn..."

## Input Variables Available
- {{company_name}} - The prospect's company name
- {{prospect_name}} - The prospect's name
- {{prospect_role}} - The prospect's job title
- {{website_content}} - Content scraped from their website
- {{linkedin_summary}} - Their LinkedIn summary
- {{recent_news}} - Recent news about the company
- {{job_postings}} - Current job openings

## Output Format
Return a JSON object:
{
  "icebreaker": "Your personalized first line here",
  "observation_source": "website|linkedin|news|job_posting",
  "pain_point_connection": "How this connects to their likely pain"
}`
}

export async function generateEmailSequence(
  formData: FormData,
  config: AIConfig
): Promise<EmailSequence> {
  const systemPrompt = buildSystemPrompt(formData)

  const result = await callOpenRouterJSON<GeneratedEmailSequence>(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content:
          'Generate the 4-email cold email sequence following all the rules. Return valid JSON only.',
      },
    ],
    config
  )

  // Map to our Email type with word counts
  const emails: Email[] = result.emails.map((email, index) => ({
    day: SEQUENCE_STRUCTURE.emails[index].day,
    type: SEQUENCE_STRUCTURE.emails[index].type,
    subjectLine: email.subjectLine,
    body: email.body,
    wordCount: countWords(email.body),
  }))

  // Validate the sequence
  const validationResults = validateSequence(emails, formData)

  // Generate icebreaker prompt
  const icebreakerPrompt = generateIcebreakerPrompt(formData)

  return {
    emails,
    icebreakerPrompt,
    validationResults,
    generatedAt: new Date(),
  }
}
