# Finance Friend v3 — Optimization Guide

**Status:** Build-ready with optimization opportunities  
**Date:** Friday, March 20, 2026

---

## 📊 Current Performance Metrics

### Build Size
- **Total JS:** 643.15 KB (188.21 KB gzipped)
- **Total CSS:** 25.63 KB (5.20 KB gzipped)
- **HTML:** 0.76 KB (0.41 KB gzipped)
- **Bundle:** 669.54 KB uncompressed

### Performance Targets
- ✅ **CSS:** Good (5.2 KB gzipped is excellent)
- ⚠️ **JS:** Needs optimization (188 KB gzipped for SPA is acceptable but improvable)
- 📊 **Target:** 120 KB JS gzipped (35% reduction)

---

## 🎯 Optimization Opportunities

### 1. Code Splitting (Quick Win)

**Problem:** All code bundled in one 643KB chunk  
**Solution:** Split into logical chunks (routes, components, libraries)

**Implementation:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['recharts', 'lucide-react'],
          'coach': ['./src/components/Coach', './src/pages/CoachPage'],
          'dashboard': ['./src/pages/DashboardPage', './src/components/Dashboard']
        }
      }
    }
  }
})
```

**Expected Improvement:** -30% bundle size (parallel loading gains)

---

### 2. Dynamic Imports (Medium Effort)

**Problem:** Pages load everything upfront  
**Solution:** Lazy-load routes that aren't immediately visible

**Implementation:**
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CoachPage = lazy(() => import('./pages/CoachPage'))
const TaxPage = lazy(() => import('./pages/TaxPage'))

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/tax" element={<TaxPage />} />
      </Routes>
    </Suspense>
  )
}
```

**Expected Improvement:** -25% initial load (defers non-critical routes)

---

### 3. Library Optimization (Medium Effort)

**Problem:** Some libraries might be oversized  
**Solution:** Audit and replace if needed

**Current Libraries to Audit:**
```bash
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer ./dist/stats.json
```

**Common Culprits:**
- Recharts (100KB+) → Consider Lightweight alternative (visx, plotly)
- MUI components → Consider Headless UI
- Moment.js (if used) → Replace with date-fns

---

### 4. Tree Shaking & Minification (Quick Win)

**Ensure optimal Vite/rollup config:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
      mangle: true
    },
    sourcemap: false, // Disable for production
    rollupOptions: {
      external: []
    }
  }
})
```

**Expected Improvement:** -10% through better compression

---

### 5. Asset Optimization (Quick Win)

**Images:**
- Use WebP format (30% smaller than PNG/JPEG)
- Lazy-load images below fold
- Use srcset for responsive images

**Fonts:**
- Subset fonts to only used characters
- Use system fonts for body text
- Preload critical fonts

```html
<!-- In index.html -->
<link rel="preload" as="font" href="/fonts/inter.woff2" crossorigin />
```

---

## 📈 Expected Results After Optimization

| Metric | Current | Target | Improvement |
|--------|---------|--------|------------|
| JS Bundle (gzipped) | 188 KB | 120 KB | -36% |
| First Load | ~2.5s | ~1.5s | -40% |
| FCP (First Contentful Paint) | ~1.2s | ~0.7s | -42% |
| Lighthouse Score | 75 | 90+ | +20 points |

---

## 🛠️ Implementation Order

**Phase 1 (Quick Wins) — 1 hour:**
1. Enable tree-shaking in vite.config.ts
2. Add `drop_console` to terser
3. Disable sourcemaps in production

**Phase 2 (Code Splitting) — 2 hours:**
1. Split vendor/UI/coach/dashboard chunks
2. Test routes still work
3. Verify chunk loading

**Phase 3 (Dynamic Imports) — 2 hours:**
1. Lazy-load non-critical pages
2. Add loading fallback UI
3. Test navigation performance

**Phase 4 (Library Audit) — 2-3 hours:**
1. Run bundle analyzer
2. Identify oversized libraries
3. Replace or remove as needed

---

## 🔍 Monitoring Performance

**Setup Lighthouse CI:**
```bash
npm install @lhci/cli@
lhci autorun --config=lighthouserc.json
```

**Configure (.lighthouserc.json):**
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "staticDistDir": "./dist"
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:all",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## 📋 Checklist

**Before Launch:**
- [ ] Code splitting implemented
- [ ] Dynamic imports for non-critical routes
- [ ] Bundle analysis complete
- [ ] Lighthouse score ≥ 85
- [ ] First Load Time < 2s
- [ ] Mobile performance tested
- [ ] Sourcemaps disabled (production)
- [ ] Caching headers configured (Vercel)

---

## 🚀 Production Configuration

**Vercel Deployment:**
```json
{
  "env": {
    "VITE_API_URL": "@finance_friend_api_url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

---

## 💡 Post-Launch Monitoring

**Track these metrics:**
- PageSpeed Insights score
- Core Web Vitals (CLS, LCP, FID)
- Real User Monitoring (RUM) via Vercel Analytics
- Error tracking via Sentry

**Setup Sentry:**
```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 0.1
})
```

---

## 📝 Notes

- Optimization should be applied before public launch
- Current build is acceptable for beta testing
- Performance budget: Keep JS gzipped < 150 KB
- Monitor Core Web Vitals after launch

---

**Recommendation:** Apply Phase 1 & 2 before production launch (3 hours of work)  
**ROI:** 40% faster load, better SEO, improved UX

---

Authored by Moriah  
Last Updated: March 20, 2026 — 21:20 HADT
