# Transcript Sanitizer Service

A production-ready PII sanitization service for transcript files. Processes markdown transcripts, removes all personal information, extracts metadata, auto-tags content, and maintains a full audit trail.

## Features

- **PII Detection & Removal**: SSNs, credit cards, phone numbers, emails, IP addresses, zip codes, street addresses, dates of birth
- **Metadata Extraction**: Date, duration, speakers, word count
- **Auto-tagging**: Detects business, finance, health, legal, technology, education, sales, and support themes
- **Audit Trail**: Full record of every piece of PII removed with position and type
- **Batch Processing**: Handle up to 20 files per request
- **Docker Ready**: Production Dockerfile and docker-compose included

## Quick Start

```bash
# Install dependencies
npm install

# Development mode (ts-node)
npm run dev

# Build and run
npm run build && npm start
```

Service runs on `http://localhost:4001`

## API Reference

### `GET /health`
Returns service health status.

```json
{
  "status": "ok",
  "service": "transcript-sanitizer",
  "version": "1.0.0",
  "timestamp": "2024-03-21T00:00:00.000Z"
}
```

---

### `POST /sanitize`
Sanitize a single transcript.

**Option A: File upload**
```bash
curl -X POST http://localhost:4001/sanitize \
  -F "file=@your-transcript.md"
```

**Option B: JSON body**
```bash
curl -X POST http://localhost:4001/sanitize \
  -H "Content-Type: application/json" \
  -d '{"content": "# Transcript\n\nJohn: My email is john@example.com", "filename": "call.md"}'
```

**Response:**
```json
{
  "fileId": "uuid-here",
  "cleanContent": "---\nfileId: ...\n---\n# Transcript\n\nJohn: My email is [EMAIL REDACTED]",
  "metadata": {
    "fileId": "uuid",
    "originalFilename": "call.md",
    "processedAt": "2024-03-21T00:00:00.000Z",
    "transcriptDate": "March 15, 2024",
    "duration": "45:32",
    "speakers": [{"name": "John", "lineCount": 3, "wordCount": 45}],
    "themes": ["business", "sales"],
    "tags": ["coaching", "business", "sales"],
    "wordCount": 1203,
    "lineCount": 87,
    "piiRemovedCount": 6,
    "piiTypes": {"EMAIL": 2, "PHONE": 1, "SSN": 1, "CREDIT_CARD": 1, "IP_ADDRESS": 1}
  },
  "auditId": "uuid-here"
}
```

---

### `POST /sanitize-batch`
Sanitize multiple files at once (max 20).

```bash
curl -X POST http://localhost:4001/sanitize-batch \
  -F "files=@transcript1.md" \
  -F "files=@transcript2.md"
```

---

### `GET /audit/:fileId`
Retrieve the audit record for a processed file.

```bash
curl http://localhost:4001/audit/{fileId}
```

**Response:**
```json
{
  "fileId": "uuid",
  "originalFilename": "call.md",
  "processedAt": "2024-03-21T00:00:00.000Z",
  "piiMatches": [
    {
      "type": "EMAIL",
      "original": "john@example.com",
      "replacement": "[EMAIL REDACTED]",
      "position": 142,
      "length": 16
    }
  ],
  "summary": {
    "total": 6,
    "byType": {"EMAIL": 2, "PHONE": 1, "SSN": 1}
  }
}
```

---

### `GET /audit`
List all audit record IDs.

---

## PII Types Detected

| Type | Examples |
|------|----------|
| SSN | `123-45-6789`, `123 45 6789` |
| CREDIT_CARD | `4532015112830366`, `4532-0151-1283-0366` |
| EMAIL | `user@example.com` |
| PHONE | `(555) 234-5678`, `+1 800-555-0199` |
| IP_ADDRESS | `192.168.1.45` |
| ZIP_CODE | `90210`, `90210-1234` |
| ADDRESS | `1234 Maple Street`, `999 Oak Avenue` |
| DATE_OF_BIRTH | `DOB: 03/15/1985`, `date of birth: 3/15/85` |

## Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# Or build manually
docker build -t transcript-sanitizer .
docker run -p 4001:4001 -v $(pwd)/data:/app/data transcript-sanitizer
```

## Running Tests

```bash
# Start the service first
npm run dev &

# Run tests
npm test
```

## File Structure

```
transcript-sanitizer-service/
├── src/
│   ├── index.ts           # Express app entry point
│   ├── routes.ts          # API route handlers
│   ├── sanitizer.ts       # Core sanitization orchestrator
│   ├── pii-detector.ts    # PII regex patterns + redaction
│   ├── metadata-extractor.ts  # Speaker/date/theme extraction
│   ├── audit-store.ts     # Audit persistence layer
│   └── types.ts           # TypeScript interfaces
├── data/
│   ├── input/             # Drop transcripts here for batch processing
│   ├── output/            # Clean markdown + metadata JSON output
│   └── audit/             # Audit trail JSON files
├── tests/
│   └── test.ts            # Integration test suite
├── Dockerfile
├── docker-compose.yml
└── README.md
```
