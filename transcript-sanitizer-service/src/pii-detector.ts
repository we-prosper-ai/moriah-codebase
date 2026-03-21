import { PIIMatch, PIIType } from './types';

interface PIIPattern {
  type: PIIType;
  pattern: RegExp;
  replacement: string;
}

const PII_PATTERNS: PIIPattern[] = [
  // Social Security Numbers: 123-45-6789, 123 45 6789, 123456789
  {
    type: 'SSN',
    pattern: /\b(?!000|666|9\d{2})\d{3}[-\s]?(?!00)\d{2}[-\s]?(?!0000)\d{4}\b/g,
    replacement: '[SSN REDACTED]',
  },

  // Credit Card Numbers (Visa, MC, Amex, Discover) with or without spaces/dashes
  {
    type: 'CREDIT_CARD',
    pattern:
      /\b(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/g,
    replacement: '[CREDIT CARD REDACTED]',
  },

  // Credit cards with spaces or dashes
  {
    type: 'CREDIT_CARD',
    pattern:
      /\b(?:\d{4}[-\s]){3}\d{4}\b/g,
    replacement: '[CREDIT CARD REDACTED]',
  },

  // Email addresses
  {
    type: 'EMAIL',
    pattern: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[EMAIL REDACTED]',
  },

  // Phone numbers: various formats
  {
    type: 'PHONE',
    pattern:
      /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}(?:\s?(?:x|ext)\.?\s?\d{1,5})?/g,
    replacement: '[PHONE REDACTED]',
  },

  // IP addresses (IPv4)
  {
    type: 'IP_ADDRESS',
    pattern:
      /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: '[IP ADDRESS REDACTED]',
  },

  // US Zip codes: 12345 or 12345-6789
  {
    type: 'ZIP_CODE',
    pattern: /\b\d{5}(?:-\d{4})?\b(?=\s*(?:,|\.|$|\s(?:US|USA|United States)))/g,
    replacement: '[ZIP REDACTED]',
  },

  // Street addresses: number + street name patterns
  {
    type: 'ADDRESS',
    pattern:
      /\b\d+\s+(?:[A-Z][a-z]+\s+){1,3}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Circle|Cir|Place|Pl|Way|Terrace|Ter|Trail|Trl)\b\.?/gi,
    replacement: '[ADDRESS REDACTED]',
  },

  // Date of birth patterns
  {
    type: 'DATE_OF_BIRTH',
    pattern:
      /\b(?:DOB|date of birth|born|birthday)(?::?\s+(?:is|was|:))?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
    replacement: '[DOB REDACTED]',
  },
];

export function detectAndRedactPII(text: string): {
  cleanText: string;
  matches: PIIMatch[];
} {
  const matches: PIIMatch[] = [];
  let cleanText = text;
  let offset = 0;

  for (const { type, pattern, replacement } of PII_PATTERNS) {
    // Reset regex state
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    const tempMatches: PIIMatch[] = [];

    while ((match = pattern.exec(text)) !== null) {
      tempMatches.push({
        type,
        original: match[0],
        replacement,
        position: match.index,
        length: match[0].length,
      });
    }

    // Apply replacements to cleanText
    pattern.lastIndex = 0;
    cleanText = cleanText.replace(pattern, replacement);
    matches.push(...tempMatches);
  }

  // Sort matches by position for readability
  matches.sort((a, b) => a.position - b.position);

  return { cleanText, matches };
}

export function countPIIByType(matches: PIIMatch[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const match of matches) {
    counts[match.type] = (counts[match.type] || 0) + 1;
  }
  return counts;
}
