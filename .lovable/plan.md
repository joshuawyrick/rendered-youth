

# Comprehensive Sitemap Update

## Current Problem
The existing `sitemap.xml` is outdated — it uses external URLs that don't match internal routes (e.g., `/shop` instead of `/store`), is missing collection pages, product pages, and creator profile pages, and includes non-existent routes like `/dashboard`.

## What Will Change

**Update `public/sitemap.xml`** with all real URLs. The sitemap will use the actual internal routes since that's what the app serves.

### Pages to include:

**Static pages (public-facing):**
| URL | Priority | Frequency |
|-----|----------|-----------|
| `/` | 1.0 | weekly |
| `/store` | 0.9 | daily |
| `/creators` | 0.8 | weekly |
| `/how-it-works` | 0.7 | monthly |
| `/training-program` | 0.7 | monthly |
| `/about` | 0.6 | monthly |
| `/contact` | 0.5 | monthly |
| `/age-verification` | 0.5 | monthly |
| `/auth` | 0.4 | monthly |
| `/sign-in` | 0.4 | monthly |
| `/terms` | 0.3 | yearly |
| `/privacy` | 0.3 | yearly |

**Collection pages (dynamic, from database):**
| URL | Priority | Frequency |
|-----|----------|-----------|
| `/collections/animals` | 0.7 | weekly |
| `/collections/fantasy` | 0.7 | weekly |
| `/collections/seasonal` | 0.7 | weekly |
| `/collections/tuckers-tees` | 0.7 | weekly |
| `/collections/4th-of-july-` | 0.7 | weekly |

**Product pages (dynamic, from database):**
| URL | Priority | Frequency |
|-----|----------|-----------|
| `/store/stay-positive` | 0.8 | weekly |

**Creator profile pages (dynamic, from database):**
| URL | Priority | Frequency |
|-----|----------|-----------|
| `/creator/220a45d0-71aa-4300-8de4-b1493c1f6843` | 0.5 | weekly |

**Excluded (private/auth-gated, should NOT be in sitemap):**
- `/admin`, `/creator/dashboard`, `/creator/upload`, `/creator/profile`, `/design-review`

### Also update `public/robots.txt`
- Keep existing bot rules
- Disallow private paths (`/admin`, `/creator/dashboard`, etc.)
- Update the Sitemap URL to match the actual published domain

### Note
The "4th of July" collection has a trailing dash in its slug (`4th-of-july-`). This should ideally be fixed in the database, but the sitemap will reflect the current slug as-is.

## Technical Details
- Two files modified: `public/sitemap.xml`, `public/robots.txt`
- No code changes needed — these are static public files
- Domain used: `https://renderedyouth.com` (matching current sitemap)

