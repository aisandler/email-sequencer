// Cold Email Rules Engine
// Based on the 5 Mistakes framework from cold-email-practices.md

export const EMAIL_RULES = {
  // Word count constraints (from transcript: 50-125 words optimal, strict 50-80 for cold)
  MIN_WORDS: 50,
  MAX_WORDS: 80,

  // Paragraph constraints
  MAX_SENTENCES_PER_PARAGRAPH: 2,

  // Forbidden "me first" openers - these fail instantly
  FORBIDDEN_OPENERS: [
    /^my name is/i,
    /^i'm the founder/i,
    /^i'm reaching out/i,
    /^i wanted to/i,
    /^we are a/i,
    /^we help/i,
    /^our company/i,
    /^i work with/i,
    /^i specialize in/i,
  ],

  // "Me First" detection patterns - email should start with THEM
  ME_FIRST_PATTERNS: [/^(I|We|My|Our)\s/i],

  // Generic opener patterns that fail the "Only Them Test"
  GENERIC_PATTERNS: [
    /as a (VP|Director|Head|Manager|CEO|Founder)/i,
    /you probably want more/i,
    /companies like yours/i,
    /I saw you posted on LinkedIn/i,
    /I'm sure you're focusing on/i,
    /I noticed your company/i,
    /I saw your company is growing/i,
    /want to grow revenue/i,
  ],

  // Lazy follow-up patterns - each email must add NEW value
  LAZY_FOLLOWUP_PATTERNS: [
    /just (checking in|following up|bumping)/i,
    /circling back/i,
    /still interested/i,
    /wanted to follow up/i,
    /touching base/i,
    /any thoughts/i,
    /did you get my/i,
    /haven't heard back/i,
  ],
} as const

export const SUBJECT_LINE_RULES = {
  MIN_WORDS: 2,
  MAX_WORDS: 4,

  // Forbidden patterns in subject lines
  FORBIDDEN_PATTERNS: [
    /\{\{firstName\}\}/i, // No first name in subjects
    /^re:/i, // No fake reply
    /^fwd:/i, // No fake forward
  ],

  // Email 3 can use company name
  EMAIL_3_ALLOWED: [/\{\{companyName\}\}/i],

  // Case rules: lowercase or sentence case only
  CASE_RULES: {
    allowLowercase: true,
    allowSentenceCase: true,
    forbidAllCaps: true,
  },
} as const

export const CTA_RULES = {
  // Email 1: Absolutely no call ask
  EMAIL_1_FORBIDDEN: [
    /can we (hop on|schedule|book) a call/i,
    /free for a (call|chat|meeting)/i,
    /15.?minutes/i,
    /quick call/i,
    /jump on a call/i,
    /schedule a time/i,
    /grab some time/i,
  ],

  // Encouraged value-first CTA patterns
  VALUE_FIRST_PATTERNS: [
    'would it make sense to send',
    'can I shoot it over',
    'happy to share',
    'no call required',
    'want me to send',
    'interested in seeing',
  ],
} as const

export const SEQUENCE_STRUCTURE = {
  emails: [
    {
      day: 0,
      type: 'value_offer' as const,
      focus: 'Offer audit, playbook, or case study',
      mustInclude: ['value offer', 'no call required'],
    },
    {
      day: 3,
      type: 'insight' as const,
      focus: 'Additional insight or data',
      mustInclude: ['new data', 'specific insight'],
    },
    {
      day: 6,
      type: 'social_proof' as const,
      focus: 'Social proof angle',
      mustInclude: ['similar company', 'results'],
    },
    {
      day: 9,
      type: 'free_resource' as const,
      focus: 'Free resource, no strings attached',
      mustInclude: ['free resource', 'no strings'],
    },
  ],
} as const
