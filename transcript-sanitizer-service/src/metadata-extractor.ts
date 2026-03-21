import { Speaker, TranscriptMetadata } from './types';

// Common topic keywords for auto-tagging
const TOPIC_KEYWORDS: Record<string, string[]> = {
  finance: ['money', 'budget', 'payment', 'invoice', 'cost', 'price', 'revenue', 'profit', 'expense', 'financial', 'bank', 'account', 'debt', 'loan', 'investment'],
  health: ['doctor', 'medical', 'health', 'hospital', 'diagnosis', 'treatment', 'medication', 'therapy', 'patient', 'insurance', 'prescription', 'symptoms'],
  legal: ['contract', 'agreement', 'lawsuit', 'attorney', 'lawyer', 'court', 'legal', 'compliance', 'regulation', 'clause', 'liability', 'settlement'],
  business: ['meeting', 'project', 'deadline', 'client', 'proposal', 'strategy', 'marketing', 'sales', 'team', 'product', 'service', 'company', 'startup'],
  technology: ['software', 'developer', 'code', 'api', 'database', 'server', 'app', 'platform', 'digital', 'tech', 'system', 'automation', 'ai', 'data'],
  education: ['course', 'training', 'learning', 'student', 'teacher', 'curriculum', 'module', 'lesson', 'skill', 'certification', 'program', 'workshop'],
  support: ['issue', 'problem', 'help', 'support', 'ticket', 'bug', 'error', 'fix', 'resolve', 'complaint', 'feedback', 'urgent', 'escalate'],
  sales: ['prospect', 'lead', 'deal', 'close', 'pitch', 'demo', 'offer', 'discount', 'conversion', 'pipeline', 'quota', 'funnel'],
};

export function extractSpeakers(text: string): Speaker[] {
  const speakerMap = new Map<string, { lines: number; words: number }>();

  // Match common transcript speaker formats:
  // "John Smith: text", "[John]: text", "JOHN: text", "Speaker 1: text"
  const speakerPattern = /^(?:\[([^\]]+)\]|([A-Z][A-Za-z\s\-']+(?:\s[A-Z0-9][a-z]*)?)):\s*.+$/gm;

  let match: RegExpExecArray | null;
  while ((match = speakerPattern.exec(text)) !== null) {
    const speakerName = (match[1] || match[2]).trim();
    const line = match[0];
    const words = line.split(/\s+/).length;

    if (!speakerMap.has(speakerName)) {
      speakerMap.set(speakerName, { lines: 0, words: 0 });
    }
    const stats = speakerMap.get(speakerName)!;
    stats.lines++;
    stats.words += words;
  }

  return Array.from(speakerMap.entries()).map(([name, stats]) => ({
    name,
    lineCount: stats.lines,
    wordCount: stats.words,
  }));
}

export function extractDate(text: string): string | null {
  // Look for date patterns in the first 20 lines
  const header = text.split('\n').slice(0, 20).join('\n');

  const datePatterns = [
    /Date:\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /Date:\s*([A-Za-z]+ \d{1,2},?\s+\d{4})/i,
    /Recorded:\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /Interview Date:\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/,
    /\b([A-Za-z]+ \d{1,2},?\s+\d{4})\b/,
  ];

  for (const pattern of datePatterns) {
    const match = header.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function extractDuration(text: string): string | null {
  const header = text.split('\n').slice(0, 30).join('\n');

  const durationPatterns = [
    /Duration:\s*([\d:]+(?:\s*(?:hours?|hrs?|minutes?|mins?|seconds?|secs?))?)/i,
    /Length:\s*([\d:]+(?:\s*(?:hours?|hrs?|minutes?|mins?|seconds?|secs?))?)/i,
    /Total Time:\s*([\d:]+)/i,
    /\b(\d{1,2}:\d{2}:\d{2})\b/,
    /\b(\d{1,2}:\d{2})\s*(?:minutes?|mins?)/i,
  ];

  for (const pattern of durationPatterns) {
    const match = header.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function extractThemes(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundThemes: string[] = [];

  for (const [theme, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const matchCount = keywords.filter(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      return (lowerText.match(regex) || []).length > 0;
    }).length;

    if (matchCount >= 2) {
      foundThemes.push(theme);
    }
  }

  return foundThemes;
}

export function generateTags(text: string, themes: string[]): string[] {
  const tags = new Set<string>(themes);

  // Add structural tags
  if (/\binterview\b/i.test(text)) tags.add('interview');
  if (/\bmeeting\b/i.test(text)) tags.add('meeting');
  if (/\bcall\b/i.test(text)) tags.add('call');
  if (/\bwebinar\b/i.test(text)) tags.add('webinar');
  if (/\bpodcast\b/i.test(text)) tags.add('podcast');
  if (/\bcoaching\b/i.test(text)) tags.add('coaching');
  if (/\bconsultation\b/i.test(text)) tags.add('consultation');
  if (/\bonboarding\b/i.test(text)) tags.add('onboarding');
  if (/\bintake\b/i.test(text)) tags.add('intake');

  // Sentiment tags
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount > 10) tags.add('qa-heavy');

  const lineCount = text.split('\n').filter(l => l.trim()).length;
  if (lineCount > 200) tags.add('long-transcript');
  else if (lineCount < 30) tags.add('short-transcript');

  return Array.from(tags);
}

export function buildMetadata(
  fileId: string,
  originalFilename: string,
  cleanText: string,
  piiCount: number,
  piiTypes: Record<string, number>
): Omit<TranscriptMetadata, 'fileId' | 'originalFilename' | 'processedAt'> {
  const speakers = extractSpeakers(cleanText);
  const transcriptDate = extractDate(cleanText);
  const duration = extractDuration(cleanText);
  const themes = extractThemes(cleanText);
  const tags = generateTags(cleanText, themes);

  const words = cleanText.split(/\s+/).filter(w => w.trim()).length;
  const lines = cleanText.split('\n').filter(l => l.trim()).length;

  return {
    transcriptDate,
    duration,
    speakers,
    themes,
    tags,
    wordCount: words,
    lineCount: lines,
    piiRemovedCount: piiCount,
    piiTypes,
  };
}
