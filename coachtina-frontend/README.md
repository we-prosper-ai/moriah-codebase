# CoachTinaMarie Frontend

AI Coaching Platform built with React, TypeScript, and Vite.

## Features

- 🔐 Authentication system (login/signup)
- 💬 AI chat interface with Coach Tina
- 📚 Teaching browser and module system
- 👥 Community features (events, members, discussions)
- 💳 Subscription management
- 📊 Dashboard with progress tracking

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Server runs on `http://localhost:5001`

### Build for Production
```bash
npm run build
npm run preview
```

## Architecture

```
src/
├── components/     # Reusable React components
├── pages/          # Page-level components
├── stores/         # Zustand state management
├── api/            # API client functions
├── types/          # TypeScript type definitions
└── main.tsx        # React entry point
```

## State Management

Using Zustand for lightweight state management:
- `authStore` - Authentication and user state
- `teachingStore` - Teaching content and filtering
- `chatStore` - Chat sessions and messages

## API Integration

Frontend proxies requests to the CoachTinaMarie backend:
- Base URL: `http://localhost:5000`
- Proxy path: `/api`
- Authentication: Bearer token in Authorization header

## Deployment

Build output is in `dist/` directory. Deploy as static SPA:

```bash
npm run build
# Deploy dist/ to your hosting provider
```

## Development Notes

- All components use TypeScript
- Styling with Tailwind CSS
- Form handling with React hooks
- Async operations with async/await and fetch API
- State persistence using Zustand middleware

## Testing

```bash
npm test              # Run tests once
npm run test:watch   # Watch mode
```

---

Built with 🏔️ by Moriah for Tina Marie
