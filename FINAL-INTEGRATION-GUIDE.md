# COMPLETE FILE DELIVERY — Drop-In Guide

## FILES TO REPLACE (copy these over your existing files)

### HTML Pages (7 total — replace all)
| File | What it does |
|---|---|
| `index.html` | **NEW** — Theme-forward homepage: "Your Community Resource Hub" hero, 4 feature cards, stats bar, CTA section |
| `eventfinder.html` | **UPDATED** — Spotlight section (3 featured resources) + sort dropdown + results count + map-ready |
| `cte.html` | **UPDATED** — How It Works with accurate content + mobile tap-to-flip cards |
| `about.html` | **UPDATED** — Submission form with aligned categories matching the resource hub |
| `impact.html` | **NEW** — 4 stat cards + 4 Chart.js visualizations + 3 success stories tied to actual resources |
| `upcoming-events.html` | **NEW** — 8 events with category filters, all tied to resources in the directory |
| `documentation.html` | **NEW** — Copyright checklist, work log links, sources table, tech stack, framework statement |

### JavaScript Files (place in `js/` folder)
| File | What it does |
|---|---|
| `js/components.js` | **NEW** — Shared navbar + footer loaded on every page. Active page highlighting, dark mode toggle, accessible aria-labels |
| `js/particles.js` | **NEW** — Shared particle animation (replaces ~60 lines of inline script per page) |
| `js/spotlight.js` | **NEW** — Spotlight section scroll animations + "View in Directory" linking |
| `js/resource-map.js` | **NEW** — Interactive Leaflet.js map with 15 color-coded markers and category filters |

### CSS Files (place in `css/` folder)
| File | What it does |
|---|---|
| `css/spotlight.css` | **NEW** — Spotlight section styling (glassmorphism cards, responsive, dark mode) |

---

## TO ADD THE MAP TO eventfinder.html

The map-snippet.html is NOT a standalone page. Add these to eventfinder.html:

1. In `<head>`, add:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

2. Paste the map section HTML (from map-snippet.html) between the spotlight section and the search/directory section.

3. Before `</body>`, add:
```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="js/resource-map.js"></script>
```

---

## WHAT TO DELETE

- **AIDA page** — Remove the file and all links to it
- **stories.html** — If it exists with the blue color scheme, remove it (the success stories are now on impact.html)
- **Inline particle scripts** — Already removed from all 7 HTML files above (now uses shared js/particles.js)
- **Duplicate jQuery loads** — Already fixed in all 7 files (single jquery-3.2.1.min.js)

---

## WHAT YOU STILL NEED TO DO MANUALLY

1. **Create `docs/copyright-checklist.pdf`** — Fill out the TSA Student Copyright Checklist and save as PDF in a `docs/` folder
2. **Create `docs/work-log.pdf`** — Your Plan of Work Log as PDF
3. **Add team member names** — In documentation.html, uncomment the team members list and fill in names/roles
4. **Proofread everything** — Read every page aloud to find the spelling error costing you 1 point
5. **Test on mobile** — Open each page on your phone or Chrome DevTools mobile view
6. **Test cross-browser** — Check Chrome, Firefox, Safari, Edge
7. **Run a link checker** — Click every link on every page

---

## EXISTING FILES YOU KEEP (don't change)
- `css/bootstrap.min.css`
- `css/example.css`
- `css/style.css`
- `css/animsition.min.css`
- `css/theme.css`
- `js/jquery-3.2.1.min.js`
- `js/bootstrap.bundle.min.js`
- `js/animsition.min.js`
- `js/sketch.js`
- `img/` folder (all images)

---

## RUBRIC COVERAGE CHECKLIST

✅ **Theme (x2)**: Homepage hero says "Community Resource Hub", every page reinforces the theme, consistent green design  
✅ **Challenge (x3)**:  
  - ✅ Interactive directory with search + filter + sort  
  - ✅ Spotlight section for 3 resources  
  - ✅ Submission form with matching categories  
  - ✅ Additional content: interactive map, events calendar, impact dashboard  
✅ **Content (x2)**: Every page has relevant, original content. No irrelevant pages. How It Works matches actual features.  
✅ **Layout & Nav (x2)**: Consistent navbar on every page with active highlighting, footer with quick links, scroll animations  
✅ **Graphics & Color (x2)**: Green theme throughout, hover effects, scroll fade-ins, Chart.js visualizations, interactive map  
✅ **Function & Compat (x1)**: Fixed HTML structure, single jQuery, shared scripts, mobile-responsive, accessible  
✅ **Spelling & Grammar (x1)**: Proofread all generated content (you still need to check manually)
