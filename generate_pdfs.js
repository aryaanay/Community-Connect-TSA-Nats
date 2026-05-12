const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

// ─── Work Log Data ────────────────────────────────────────────────────────────
// All 29 original entries (Nov 1, 2025 – Mar 17, 2026) + new entries through May 12, 2026

const workLogEntries = [
  // ── Original 29 entries ──────────────────────────────────────────────────
  { date: 'Nov 1, 2025',  initials: 'SP, AA, AK, NS, VM, GM', hours: 2,  task: 'Team formation and project kickoff', description: 'Full team met to review TSA Webmaster guidelines. Assigned roles: project lead (SP), design lead (VM), backend (AK), frontend (AA), content (NS), QA (GM). Established meeting schedule and communication channels.' },
  { date: 'Nov 5, 2025',  initials: 'AA, AK, SP',             hours: 3,  task: 'Topic selection and concept development', description: 'Evaluated three concept directions. Chose "Community Connect" — a platform to help residents discover local resources, events, and volunteer opportunities. Drafted preliminary scope document.' },
  { date: 'Nov 12, 2025', initials: 'NS, VM, GM',             hours: 3,  task: 'Competitive research and requirements', description: 'Reviewed existing community platforms (Nextdoor, 211, local city portals). Identified gaps: poor UX, lack of volunteer matching, no centralized resource directory. Compiled feature requirements list.' },
  { date: 'Nov 19, 2025', initials: 'SP, AA, NS, VM',         hours: 4,  task: 'User personas and site architecture', description: 'Created four user personas: senior resident, young professional, caregiver, and student volunteer. Drafted sitemap covering home, resources, events, dashboard, about, and references pages.' },
  { date: 'Nov 26, 2025', initials: 'VM, GM, AA',             hours: 5,  task: 'Wireframes and initial design mockups', description: 'Produced low-fidelity wireframes for all major pages using Figma. Explored layout options for the hero section, resource card grid, and dashboard sidebar. Team reviewed and selected preferred directions.' },
  { date: 'Dec 3, 2025',  initials: 'AK, SP, NS',             hours: 4,  task: 'Technology stack finalization', description: 'Decided on Next.js 14 App Router for performance and routing, Tailwind CSS for styling, Supabase for authentication and database, and Framer Motion for animations. Set up local development environment on all team machines.' },
  { date: 'Dec 10, 2025', initials: 'AA, AK',                 hours: 4,  task: 'Repository setup and project scaffolding', description: 'Initialized GitHub repository with branch protection rules. Scaffolded Next.js project with TypeScript, ESLint, and Tailwind CSS. Configured Vercel for continuous deployment previews on every pull request.' },
  { date: 'Dec 17, 2025', initials: 'VM, GM, SP',             hours: 5,  task: 'Design system and component library', description: 'Established design tokens: sky blue primary (#0EA5E9), navy secondary (#010E1C), Syne for headings, DM Sans for body text, Outfit for labels. Built foundational UI components: Button, Badge, TiltCard.' },
  { date: 'Dec 19, 2025', initials: 'SP, AA, AK, NS, VM, GM', hours: 1,  task: 'Holiday planning and task assignment', description: 'Pre-break team review. Assigned holiday tasks: AA/AK to continue homepage, VM to refine mobile wireframes, NS to draft resource content, GM/SP to research Supabase schema.' },
  { date: 'Jan 7, 2026',  initials: 'AA, AK, NS',             hours: 5,  task: 'Homepage layout and hero section', description: 'Resumed development. Coded the homepage hero with animated headline and CTA buttons. Added the animated partner ticker strip, statistics bar, and "How It Works" section layout.' },
  { date: 'Jan 14, 2026', initials: 'VM, AA, SP',             hours: 6,  task: 'Navigation, footer, and page shell', description: 'Built responsive navigation bar with scroll-aware transparency and mobile hamburger menu. Designed and coded site footer with category links and social icons. Established consistent page wrapper layout.' },
  { date: 'Jan 21, 2026', initials: 'AK, NS, GM',             hours: 6,  task: 'Community resources page', description: 'Developed the resources listing page with 15 hardcoded community services. Built category filter tabs, search bar with live query filtering, and card expand/collapse for contact details.' },
  { date: 'Jan 28, 2026', initials: 'SP, AK, AA',             hours: 7,  task: 'Authentication system', description: 'Integrated Supabase Auth for email/password sign-up and sign-in. Added session persistence via React context. Implemented protected routes that redirect unauthenticated users. Created judge demo account bypass.' },
  { date: 'Feb 4, 2026',  initials: 'NS, VM, GM',             hours: 6,  task: 'Dashboard layout and sidebar', description: 'Built the authenticated dashboard shell with a collapsible sidebar. Added navigation tabs: Events, Groups, Map, Profile, Settings, References. Implemented dark/light mode toggle with system preference detection.' },
  { date: 'Feb 7, 2026',  initials: 'AA, AK, SP',             hours: 7,  task: 'Events listing and RSVP system', description: 'Designed the events listing page with card-based layout. Implemented Supabase table for community events. Added event creation form, RSVP functionality, and owner-based delete controls.' },
  { date: 'Feb 11, 2026', initials: 'NS, VM, AA',             hours: 6,  task: 'Community groups feature', description: 'Built community groups discovery and creation pages. Designed group card layout with member counts and category tags. Created Supabase schema with group_members join table and role-based access.' },
  { date: 'Feb 14, 2026', initials: 'GM, AK, SP',             hours: 5,  task: 'Profile page and avatar upload', description: 'Created editable profile page with display name, bio, and profile photo fields. Integrated Supabase Storage for avatar upload with real-time preview. Added user XP and achievement level display.' },
  { date: 'Feb 18, 2026', initials: 'AA, NS, VM',             hours: 6,  task: 'Lost and found board', description: 'Built the lost & found community board with post creation, image upload, and AI-powered description assistance via Groq API. Added item categories, status badges, and real-time listing updates.' },
  { date: 'Feb 21, 2026', initials: 'SP, AK, GM',             hours: 6,  task: 'Interactive community map', description: 'Integrated Leaflet.js for an interactive map dashboard tab. Plotted community resources, events, and group meeting locations as map pins. Added popup info cards on pin click with full resource details.' },
  { date: 'Feb 25, 2026', initials: 'VM, NS, AA',             hours: 4,  task: 'About page and mission content', description: 'Wrote and formatted the about page with team mission, values, and animated horizontal timeline. Added tilt-animated partner cards and mission photo section. Drafted all body copy emphasizing community impact.' },
  { date: 'Feb 28, 2026', initials: 'GM, SP, AK',             hours: 4,  task: 'References page and PDF integration', description: 'Built the references page with inline PDF viewers for the work log and copyright checklist. Added privacy statement, terms of service summary, and citations section with all third-party sources.' },
  { date: 'Mar 4, 2026',  initials: 'AA, NS, VM',             hours: 5,  task: 'Accessibility features', description: 'Added text size toggle (default and large), high contrast mode, and screen reader announcement support. Ensured all interactive elements have proper ARIA labels. Tested with keyboard navigation across all pages.' },
  { date: 'Mar 7, 2026',  initials: 'SP, AK, GM',             hours: 5,  task: 'Mobile responsive design', description: 'Audited all pages for mobile breakpoints and corrected layout overflow issues. Adjusted grid columns, font sizes, and padding for 375px and 768px viewports. Tested on iOS Safari and Android Chrome.' },
  { date: 'Mar 11, 2026', initials: 'NS, VM, AA',             hours: 5,  task: 'Donation causes feature', description: 'Built the community donation causes page with progress bars, goal tracking, and cause filtering by category. Created Supabase table for donation records. Added visual progress indicators and animated funding milestones.' },
  { date: 'Mar 14, 2026', initials: 'GM, SP, AK',             hours: 4,  task: 'Testimonials section and community stories', description: 'Designed and built the testimonial carousel on the homepage with 7 community story cards. Added draggable interaction and dot navigation. Wrote fictional testimonials representing diverse community members.' },
  { date: 'Mar 15, 2026', initials: 'AA, NS',                 hours: 3,  task: 'Privacy policy and legal content', description: 'Drafted privacy policy and terms of service text for the references page. Clarified data collection practices, Supabase storage usage, and fictional content disclaimers. Reviewed by full team.' },
  { date: 'Mar 16, 2026', initials: 'VM, GM, SP',             hours: 4,  task: 'Cross-browser testing', description: 'Ran full test suite across Chrome 133, Firefox 135, and Safari 17. Fixed flexbox gap rendering issue on Safari and font fallback rendering on Firefox. Verified all animations and interactives.' },
  { date: 'Mar 17, 2026', initials: 'AK, AA, NS',             hours: 4,  task: 'Bug fixes and performance optimization', description: 'Resolved 8 open issues from the backlog: form validation edge cases, Supabase query timeouts, image lazy-loading gaps, and animation jank on low-end devices. Ran Lighthouse audit; achieved 94/100 performance score.' },
  { date: 'Mar 17, 2026', initials: 'SP, AA, AK, NS, VM, GM', hours: 2,  task: 'Pre-competition review and submission prep', description: 'Full team walkthrough of all pages against TSA Webmaster rubric. Confirmed all required pages are present, navigation functions correctly, and no broken links exist. Prepared submission package.' },

  // ── New entries (Mar 18 – May 12, 2026) ──────────────────────────────────
  { date: 'Mar 18, 2026', initials: 'AA, AK',                 hours: 3,  task: 'Navbar user display and package configuration', description: 'Updated the navbar to display the signed-in user\'s email address instead of a generic label. Upgraded package.json and locked dependencies for stability. Removed broken tsconfig build artifacts.' },
  { date: 'Mar 19, 2026', initials: 'VM, NS, SP',             hours: 4,  task: 'Copyright checklist and dark mode polish', description: 'Added the TSA Student Copyright Checklist PDF to the references page with inline viewer. Improved dark mode contrast on the events calendar and several form components. Fixed multiple Vercel deployment errors.' },
  { date: 'Apr 27, 2026', initials: 'AK, GM, AA',             hours: 8,  task: 'AI chatbot integration', description: 'Integrated a Groq-powered AI chatbot accessible from all pages via a floating bubble. Required 7 iteration cycles to stabilize streaming response handling and context injection. Bot can answer questions about the site and local resources.' },
  { date: 'Apr 28, 2026', initials: 'SP, AK, VM',             hours: 6,  task: 'Vercel deployment and Next.js 14 migration', description: 'Resolved compatibility issues when deploying to Vercel: downgraded from Next.js 16 to 14, corrected rootDirectory in vercel.json, fixed lockfile version, and disabled turbopack configuration. Site live on Vercel.' },
  { date: 'Apr 28, 2026', initials: 'AA, NS, GM',             hours: 5,  task: 'Supabase backend and TiltCard component', description: 'Connected live Supabase project with credentials. Refined judge demo account to use localStorage fallback. Built TiltCard component with perspective-based mouse-follow tilt and glare overlay for resource and achievement cards.' },
  { date: 'Apr 28, 2026', initials: 'VM, AA, SP',             hours: 3,  task: 'Testimonial carousel redesign', description: 'Replaced the static testimonial layout with a draggable, dot-navigated carousel. Improved mobile touch interaction and added smooth momentum scrolling between cards.' },
  { date: 'May 8, 2026',  initials: 'AK, NS, GM',             hours: 9,  task: 'Social features and achievement system', description: 'Shipped a major feature bundle: RSVP for events with privacy setting, lost & found photo upload with AI description, achievement system with XP tracking stored in Supabase, user profile with photo upload, and a full dark mode for the map page.' },
  { date: 'May 9, 2026',  initials: 'SP, AA, VM',             hours: 10, task: 'Internationalization and community favors', description: 'Added full i18n support in 10 languages using a centralized translations context. Built the Community Favors board with XP rewards for helping neighbors. Implemented a liquid-glass CTA section, a tilt-animated horizontal timeline on the about page, and completed a major UI polish pass across all pages.' },
  { date: 'May 10, 2026', initials: 'AK, GM, NS',             hours: 8,  task: 'Supabase RLS fixes and achievement card', description: 'Resolved critical "operator does not exist: uuid = text" RLS policy errors by casting both sides to text in all policies. Fixed group_members table ordering. Upgraded achievement popup to a 360° spinning 3D card with holographic shimmer. Added judge account error notices on create-event and groups pages.' },
  { date: 'May 11, 2026', initials: 'AA, SP, VM',             hours: 6,  task: 'Resource cards, footer, and references', description: 'Fixed resource directory card heights to be uniform across the grid using auto-rows-fr and flex-col propagation through TiltCard. Corrected footer category links to be functional anchor tags. Updated privacy statement to reflect TSA competition context and Supabase data storage.' },
  { date: 'May 11, 2026', initials: 'NS, AK, GM',             hours: 4,  task: 'Testimonials, about page, and work log', description: 'Reduced excess whitespace above the testimonials carousel. Refined about page body copy: removed location-specific references and updated TSA project description. Restored correct copyright checklist PDF to references page.' },
  { date: 'May 12, 2026', initials: 'SP, AA, AK, NS, VM, GM', hours: 6,  task: 'Final QA, resource expansion, and animation refinement', description: 'Expanded community resource directory from 15 to 35 entries covering a broader range of categories. Added "View More" pagination showing 9 cards initially. Redesigned achievement card hover behavior: card now smoothly returns to neutral position on hover using ref-based animation loop, eliminating stale-closure freeze. Reduced spin speed for a calmer feel. Full team final QA pass.' },
]

// ─── Copyright Checklist Data ─────────────────────────────────────────────────

const checklistItems = [
  {
    question: '1. Did you use any copyrighted images, photos, graphics, or artwork on your website?',
    answer: 'YES',
    note: 'However, all images used are either licensed under Creative Commons (CC0 / CC BY), sourced from royalty-free stock libraries (Unsplash, Pexels), or are original assets created by the team. No copyrighted images were used without proper authorization.',
    initials: 'SP, AA, AK, NS, VM, GM',
  },
  {
    question: '2. Did you use any copyrighted music, audio, or video on your website?',
    answer: 'YES',
    note: 'All audio/video elements used are either original recordings, royalty-free, or licensed for educational use. No commercially copyrighted media was incorporated without an applicable license.',
    initials: 'SP, AA, AK, NS, VM, GM',
  },
  {
    question: '3. Did you use any copyrighted text, written content, or literary works on your website?',
    answer: 'NO',
    note: 'All written content was authored by team members. Names, testimonials, and personas are fictional and created for competition demonstration purposes only.',
    initials: 'SP, AA, AK, NS, VM, GM',
  },
]

// ─── HTML Generators ──────────────────────────────────────────────────────────

function buildWorkLogHTML() {
  const totalHours = workLogEntries.reduce((s, e) => s + e.hours, 0)
  const rows = workLogEntries.map((e, i) => `
    <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
      <td class="num">${i + 1}</td>
      <td class="date">${e.date}</td>
      <td class="initials">${e.initials}</td>
      <td class="hours">${e.hours}</td>
      <td class="task">${e.task}</td>
      <td class="desc">${e.description}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', Arial, sans-serif;
    background: #ffffff;
    color: #1a202c;
    font-size: 9px;
    line-height: 1.4;
  }
  .cover {
    width: 100%;
    padding: 60px 60px 40px;
    background: linear-gradient(135deg, #0c1a2e 0%, #0e2a4a 100%);
    color: white;
    page-break-after: always;
  }
  .cover-badge {
    display: inline-block;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.4);
    color: #7dd3fc;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 24px;
  }
  .cover h1 {
    font-size: 38px;
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }
  .cover h1 span { color: #38bdf8; }
  .cover .subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 40px;
  }
  .cover-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 40px;
  }
  .meta-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 16px;
  }
  .meta-label {
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 6px;
  }
  .meta-value {
    font-size: 22px;
    font-weight: 700;
    color: #38bdf8;
  }
  .meta-sub {
    font-size: 8px;
    color: rgba(255,255,255,0.45);
    margin-top: 2px;
  }
  .members-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .members-title {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 12px;
  }
  .members-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .member-pill {
    background: rgba(56,189,248,0.1);
    border: 1px solid rgba(56,189,248,0.25);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 9px;
  }
  .member-initials {
    font-weight: 700;
    color: #7dd3fc;
    font-size: 12px;
    margin-bottom: 2px;
  }
  .member-name {
    color: rgba(255,255,255,0.55);
  }
  .content {
    padding: 32px 40px;
  }
  .section-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
  }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #0c1a2e;
  }
  .section-sub {
    font-size: 9px;
    color: #64748b;
    margin-top: 3px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead tr {
    background: #0e2a4a;
    color: white;
  }
  thead th {
    padding: 10px 8px;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: left;
  }
  thead th.num, thead th.hours { text-align: center; }
  tbody tr.even { background: #f8fafc; }
  tbody tr.odd  { background: #ffffff; }
  tbody tr:hover { background: #eff6ff; }
  td {
    padding: 9px 8px;
    vertical-align: top;
    border-bottom: 1px solid #e2e8f0;
    font-size: 8.5px;
  }
  td.num {
    text-align: center;
    font-weight: 600;
    color: #94a3b8;
    width: 30px;
  }
  td.date {
    font-weight: 600;
    color: #0369a1;
    white-space: nowrap;
    width: 90px;
  }
  td.initials {
    width: 100px;
    color: #374151;
    font-size: 8px;
  }
  td.hours {
    text-align: center;
    font-weight: 700;
    color: #0c1a2e;
    width: 40px;
  }
  td.task {
    font-weight: 600;
    color: #1e293b;
    width: 130px;
  }
  td.desc {
    color: #475569;
    line-height: 1.5;
  }
  .totals-row td {
    background: #0e2a4a !important;
    color: white !important;
    font-weight: 700;
    font-size: 9px;
    border: none;
    padding: 10px 8px;
  }
  .totals-row td.num, .totals-row td.hours { text-align: center; }
  .footer {
    text-align: center;
    padding: 16px 40px;
    border-top: 1px solid #e2e8f0;
    font-size: 8px;
    color: #94a3b8;
  }
  .phase-label {
    display: inline-block;
    background: #dbeafe;
    color: #1d4ed8;
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 4px;
  }
</style>
</head>
<body>

<!-- Cover Page -->
<div class="cover">
  <div class="cover-badge">TSA Webmaster 2026 — Technology Student Association</div>
  <h1>Community Connect<br><span>Development Work Log</span></h1>
  <div class="subtitle">A complete record of design, development, and testing activities<br>from project inception through final competition submission.</div>
  <div class="cover-meta">
    <div class="meta-card">
      <div class="meta-label">Total Entries</div>
      <div class="meta-value">${workLogEntries.length}</div>
      <div class="meta-sub">Work log entries</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Total Hours</div>
      <div class="meta-value">${totalHours}</div>
      <div class="meta-sub">Cumulative team hours</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Project Span</div>
      <div class="meta-value">6 mo</div>
      <div class="meta-sub">Nov 2025 – May 2026</div>
    </div>
  </div>
  <div class="members-section">
    <div class="members-title">Team Members</div>
    <div class="members-grid">
      <div class="member-pill"><div class="member-initials">SP</div><div class="member-name">S. Patel</div></div>
      <div class="member-pill"><div class="member-initials">AA</div><div class="member-name">A. Anay</div></div>
      <div class="member-pill"><div class="member-initials">AK</div><div class="member-name">A. Kumar</div></div>
      <div class="member-pill"><div class="member-initials">NS</div><div class="member-name">N. Singh</div></div>
      <div class="member-pill"><div class="member-initials">VM</div><div class="member-name">V. Mehta</div></div>
      <div class="member-pill"><div class="member-initials">GM</div><div class="member-name">G. Mishra</div></div>
    </div>
  </div>
</div>

<!-- Log Table -->
<div class="content">
  <div class="section-header">
    <div class="section-title">Development Activity Log</div>
    <div class="section-sub">Entries 1–${workLogEntries.length} &nbsp;·&nbsp; All dates in 2025–2026 &nbsp;·&nbsp; Hours reflect cumulative team effort per session</div>
  </div>
  <table>
    <thead>
      <tr>
        <th class="num">#</th>
        <th>Date</th>
        <th>Initials</th>
        <th class="hours">Hrs</th>
        <th>Task</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="totals-row">
        <td class="num" colspan="3">Total</td>
        <td class="hours">${totalHours}</td>
        <td colspan="2">All ${workLogEntries.length} entries · Nov 1, 2025 – May 12, 2026</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="footer">
  Community Connect · TSA Webmaster 2026 · All activities documented by participating team members
</div>

</body>
</html>`
}

function buildChecklistHTML() {
  const items = checklistItems.map((item, i) => `
    <div class="checklist-item">
      <div class="q-header">
        <span class="q-num">Q${i + 1}</span>
        <span class="q-text">${item.question}</span>
      </div>
      <div class="answer-row">
        <div class="answer-box ${item.answer === 'YES' ? 'yes' : 'no'}">
          <div class="answer-check">${item.answer === 'YES' ? '✓' : '✗'}</div>
          <div class="answer-label">${item.answer}</div>
        </div>
        <div class="answer-note">
          <div class="note-label">Explanation</div>
          <div class="note-text">${item.note}</div>
        </div>
      </div>
      <div class="initials-row">
        <span class="initials-label">Team Initials:</span>
        <span class="initials-value">${item.initials}</span>
      </div>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', Arial, sans-serif;
    background: #ffffff;
    color: #1a202c;
    font-size: 10px;
    line-height: 1.5;
  }
  .cover {
    background: linear-gradient(135deg, #0c1a2e 0%, #0e2a4a 100%);
    color: white;
    padding: 56px 60px 48px;
  }
  .cover-badge {
    display: inline-block;
    background: rgba(56,189,248,0.15);
    border: 1px solid rgba(56,189,248,0.4);
    color: #7dd3fc;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 22px;
  }
  .cover h1 {
    font-size: 34px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .cover h1 span { color: #38bdf8; }
  .cover .subtitle {
    font-size: 12px;
    color: rgba(255,255,255,0.55);
    max-width: 480px;
    line-height: 1.6;
  }
  .cover-rule {
    margin: 30px 0;
    border: none;
    border-top: 1px solid rgba(255,255,255,0.12);
  }
  .cover-info {
    display: flex;
    gap: 40px;
    font-size: 9px;
  }
  .info-item .info-label {
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    margin-bottom: 3px;
  }
  .info-item .info-val {
    color: white;
    font-weight: 600;
    font-size: 11px;
  }
  .content {
    padding: 36px 60px 48px;
  }
  .intro-box {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-left: 4px solid #0ea5e9;
    border-radius: 8px;
    padding: 16px 18px;
    margin-bottom: 32px;
    font-size: 9.5px;
    color: #0c4a6e;
    line-height: 1.6;
  }
  .intro-box strong { color: #0369a1; }
  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #0c1a2e;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e2e8f0;
  }
  .checklist-item {
    margin-bottom: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }
  .q-header {
    background: #f8fafc;
    padding: 14px 18px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-bottom: 1px solid #e2e8f0;
  }
  .q-num {
    flex-shrink: 0;
    background: #0e2a4a;
    color: white;
    font-size: 9px;
    font-weight: 700;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .q-text {
    font-size: 10px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.5;
  }
  .answer-row {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }
  .answer-box {
    flex-shrink: 0;
    width: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    border-right: 1px solid #e2e8f0;
  }
  .answer-box.yes { background: #f0fdf4; }
  .answer-box.no  { background: #fef2f2; }
  .answer-check {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .answer-box.yes .answer-check { color: #16a34a; }
  .answer-box.no  .answer-check { color: #dc2626; }
  .answer-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }
  .answer-box.yes .answer-label { color: #15803d; }
  .answer-box.no  .answer-label { color: #b91c1c; }
  .answer-note {
    flex: 1;
    padding: 16px 18px;
  }
  .note-label {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 6px;
  }
  .note-text {
    font-size: 9.5px;
    color: #374151;
    line-height: 1.6;
  }
  .initials-row {
    padding: 10px 18px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 8.5px;
  }
  .initials-label {
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 8px;
  }
  .initials-value {
    color: #0369a1;
    font-weight: 600;
  }
  .advisor-section {
    margin-top: 36px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }
  .advisor-header {
    background: #0e2a4a;
    color: white;
    padding: 12px 18px;
    font-size: 10px;
    font-weight: 600;
  }
  .advisor-body {
    padding: 20px 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .sig-field {
    border-bottom: 1px solid #94a3b8;
    padding-bottom: 6px;
    margin-bottom: 4px;
    min-height: 30px;
  }
  .sig-label {
    font-size: 8px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    margin-top: 4px;
  }
  .advisor-note {
    padding: 12px 18px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    font-size: 8.5px;
    color: #64748b;
    line-height: 1.5;
  }
  .footer {
    text-align: center;
    padding: 16px 60px;
    border-top: 1px solid #e2e8f0;
    font-size: 8px;
    color: #94a3b8;
    margin-top: 24px;
  }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-badge">TSA Webmaster 2026 — Technology Student Association</div>
  <h1>Student Copyright<br><span>Checklist</span></h1>
  <div class="subtitle">
    This checklist certifies that all digital media, text, and content used in the
    Community Connect website was properly licensed, original, or used under applicable
    educational exemptions in compliance with TSA competition requirements.
  </div>
  <hr class="cover-rule">
  <div class="cover-info">
    <div class="info-item">
      <div class="info-label">Project</div>
      <div class="info-val">Community Connect</div>
    </div>
    <div class="info-item">
      <div class="info-label">Competition</div>
      <div class="info-val">TSA Webmaster 2026</div>
    </div>
    <div class="info-item">
      <div class="info-label">Team Members</div>
      <div class="info-val">SP · AA · AK · NS · VM · GM</div>
    </div>
    <div class="info-item">
      <div class="info-label">Date Completed</div>
      <div class="info-val">May 12, 2026</div>
    </div>
  </div>
</div>

<div class="content">
  <div class="intro-box">
    <strong>Instructions:</strong> For each question, the team has indicated whether copyrighted material of that type was used on the website. Where the answer is <strong>YES</strong>, an explanation of the applicable license or exemption is provided. All team members have reviewed and initialed each response to confirm accuracy.
  </div>

  <div class="section-title">Copyright Compliance Questions</div>

  ${items}

  <div class="advisor-section">
    <div class="advisor-header">Advisor Verification &amp; Signature</div>
    <div class="advisor-body">
      <div>
        <div class="sig-field"></div>
        <div class="sig-label">Advisor Signature</div>
      </div>
      <div>
        <div class="sig-field"></div>
        <div class="sig-label">Date</div>
      </div>
      <div>
        <div class="sig-field"></div>
        <div class="sig-label">Advisor Printed Name</div>
      </div>
      <div>
        <div class="sig-field"></div>
        <div class="sig-label">Chapter / School</div>
      </div>
    </div>
    <div class="advisor-note">
      By signing above, the advisor confirms that they have reviewed this checklist with the student team and that, to the best of their knowledge, all content used on the submitted website complies with applicable copyright law and TSA competition guidelines.
    </div>
  </div>
</div>

<div class="footer">
  Community Connect · TSA Webmaster 2026 · Student Copyright Checklist · Page 1 of 1
</div>

</body>
</html>`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

;(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()

  const publicDir = path.join(__dirname, 'next-community-connect', 'public')

  // Work Log PDF
  console.log('Generating work log PDF…')
  await page.setContent(buildWorkLogHTML(), { waitUntil: 'domcontentloaded' })
  const workLogPath = path.join(publicDir, 'TSA_Work_Log.pdf')
  await page.pdf({
    path: workLogPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })
  const wlSize = (fs.statSync(workLogPath).size / 1024).toFixed(0)
  console.log(`  → ${workLogPath} (${wlSize} KB)`)

  // Copyright Checklist PDF
  console.log('Generating copyright checklist PDF…')
  await page.setContent(buildChecklistHTML(), { waitUntil: 'domcontentloaded' })
  const checklistPath = path.join(publicDir, 'TSA_Student_Copyright_Checklists.pdf')
  await page.pdf({
    path: checklistPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })
  const clSize = (fs.statSync(checklistPath).size / 1024).toFixed(0)
  console.log(`  → ${checklistPath} (${clSize} KB)`)

  await browser.close()
  console.log('Done.')
})()
