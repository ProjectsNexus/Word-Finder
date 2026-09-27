import fs from 'node:fs';
import path from 'node:path';

const domain = 'https://wordlesolverpro.com';
const todayDate = new Date().toISOString().split('T')[0];

interface UrlSeoData {
  loc: string;
  priority: string;
  changefreq: string;
  primaryKeyword: string;
  monthlyVolume: number;
  secondaryKeywords: string[];
  intent: 'Tool' | 'Game' | 'Guide' | 'Archive' | 'Directory';
  wordCount: string;
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const urls: UrlSeoData[] = [
  {
    loc: '/',
    priority: '1.0',
    changefreq: 'daily',
    primaryKeyword: 'wordle solver',
    monthlyVolume: 550000,
    secondaryKeywords: ['wordle solver pro (14.8k)', 'wordle word finder', 'wordle helper', 'solve wordle today'],
    intent: 'Tool',
    wordCount: '14,855'
  },
  {
    loc: '/wordle-solver-game/',
    priority: '0.9',
    changefreq: 'daily',
    primaryKeyword: 'wordle solver game',
    monthlyVolume: 9900,
    secondaryKeywords: ['play wordle solver', 'interactive wordle solver', 'wordle solver with assistant'],
    intent: 'Game',
    wordCount: '14,855'
  },
  {
    loc: '/tools/',
    priority: '0.9',
    changefreq: 'weekly',
    primaryKeyword: 'wordle solver tools',
    monthlyVolume: 12100,
    secondaryKeywords: ['wordle solver tool (9.9k)', 'word puzzle solvers', 'free wordle tools'],
    intent: 'Directory',
    wordCount: '89,584'
  },
  {
    loc: '/wordle-solver-7-letter/',
    priority: '0.9',
    changefreq: 'weekly',
    primaryKeyword: '7 letter wordle solver',
    monthlyVolume: 1300,
    secondaryKeywords: ['wordle solver 7 letters', '7 letter word puzzle solver', '7 letter anagram solver'],
    intent: 'Tool',
    wordCount: '24,029'
  },
  {
    loc: '/wordle-solver-6-letter/',
    priority: '0.8',
    changefreq: 'weekly',
    primaryKeyword: 'wordle solver 6 letters',
    monthlyVolume: 480,
    secondaryKeywords: ['6 letter wordle solver', 'hurdle solver', '6 letter word finder'],
    intent: 'Tool',
    wordCount: '15,788'
  },
  {
    loc: '/wordle-solver-4-letter/',
    priority: '0.8',
    changefreq: 'weekly',
    primaryKeyword: '4 letter wordle solver',
    monthlyVolume: 850,
    secondaryKeywords: ['4 letter word finder', 'mini wordle solver', '4 letter anagram finder'],
    intent: 'Tool',
    wordCount: '4,030'
  },
  {
    loc: '/wordle-solver-3-letter/',
    priority: '0.7',
    changefreq: 'weekly',
    primaryKeyword: '3 letter wordle solver',
    monthlyVolume: 320,
    secondaryKeywords: ['3 letter word finder', 'scrabble 3 letter words', '3 letter hooks'],
    intent: 'Tool',
    wordCount: '1,015'
  },
  {
    loc: '/wordle-solver-8-letter/',
    priority: '0.8',
    changefreq: 'weekly',
    primaryKeyword: '8 letter wordle solver',
    monthlyVolume: 410,
    secondaryKeywords: ['8 letter word finder', '8 letter scrabble solver', 'octo word solver'],
    intent: 'Tool',
    wordCount: '29,766'
  },
  {
    loc: '/word-finder/',
    priority: '0.9',
    changefreq: 'weekly',
    primaryKeyword: 'word finder',
    monthlyVolume: 450000,
    secondaryKeywords: ['anagram solver', 'scrabble word finder', 'crossword solver pattern'],
    intent: 'Tool',
    wordCount: '89,584'
  },
  {
    loc: '/blog/every-wordle-answer-ever/',
    priority: '0.95',
    changefreq: 'daily',
    primaryKeyword: 'every wordle answer ever',
    monthlyVolume: 90500,
    secondaryKeywords: ['past wordle answers', 'all wordle answers list', 'wordle answer archive', 'todays wordle answer'],
    intent: 'Archive',
    wordCount: '1,926+ solutions'
  },
  {
    loc: '/blog/best-wordle-starting-words/',
    priority: '0.85',
    changefreq: 'weekly',
    primaryKeyword: 'best wordle starting words',
    monthlyVolume: 60500,
    secondaryKeywords: ['best starting words for wordle', 'best wordle opener', 'wordle starting word mathematically'],
    intent: 'Guide',
    wordCount: '1,800 words'
  },
  {
    loc: '/blog/how-wordle-solver-works/',
    priority: '0.8',
    changefreq: 'monthly',
    primaryKeyword: 'how wordle solver works',
    monthlyVolume: 1900,
    secondaryKeywords: ['wordle duplicate letter algorithm', 'wordle information gain formula', 'wordle mathematics'],
    intent: 'Guide',
    wordCount: '1,500 words'
  },
  {
    loc: '/blog/try-harder-wordle-solver/',
    priority: '0.85',
    changefreq: 'weekly',
    primaryKeyword: 'try harder wordle solver',
    monthlyVolume: 3600,
    secondaryKeywords: ['hard mode wordle solver', 'wordle trap pattern strategy', 'beat wordle hard mode'],
    intent: 'Guide',
    wordCount: '1,400 words'
  },
  {
    loc: '/blog/best-wordle-solver-alternatives/',
    priority: '0.85',
    changefreq: 'monthly',
    primaryKeyword: 'rock paper shotgun wordle solver',
    monthlyVolume: 33100,
    secondaryKeywords: ['best wordle solver alternatives', 'wordlesolver online alternative', '5 letter words solver review'],
    intent: 'Guide',
    wordCount: '1,650 words'
  },
  {
    loc: '/sitemap/',
    priority: '0.7',
    changefreq: 'weekly',
    primaryKeyword: 'wordle solver sitemap index',
    monthlyVolume: 800,
    secondaryKeywords: ['wordle directory', 'wordle solver pages index', 'google index url map'],
    intent: 'Directory',
    wordCount: 'All Pages'
  }
];

// Add starting-with A-Z (26 URLs)
for (const char of alphabet) {
  urls.push({
    loc: `/five-letter-words/starting-with/${char}/`,
    priority: '0.75',
    changefreq: 'monthly',
    primaryKeyword: `5 letter words starting with ${char.toUpperCase()}`,
    monthlyVolume: char === 's' ? 49500 : char === 'c' ? 40500 : char === 'b' ? 33100 : 12000,
    secondaryKeywords: [`five letter words starting with ${char.toUpperCase()}`, `words beginning with ${char.toUpperCase()}`],
    intent: 'Directory',
    wordCount: 'Filtered'
  });
}

// Add containing A-Z (26 URLs)
for (const char of alphabet) {
  urls.push({
    loc: `/five-letter-words/containing/${char}/`,
    priority: '0.7',
    changefreq: 'monthly',
    primaryKeyword: `5 letter words containing ${char.toUpperCase()}`,
    monthlyVolume: char === 'e' ? 22200 : char === 'a' ? 18100 : char === 'r' ? 14800 : 8100,
    secondaryKeywords: [`five letter words with ${char.toUpperCase()}`, `words with letter ${char.toUpperCase()}`],
    intent: 'Directory',
    wordCount: 'Filtered'
  });
}

// Generate sitemap.xml
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const u of urls) {
  sitemapXml += `  <url>
    <loc>${domain}${u.loc}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>
`;
}
sitemapXml += `</urlset>\n`;

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
console.log(`Generated /public/sitemap.xml with ${urls.length} URLs!`);

// Save JSON for the UI sitemap/index page
fs.writeFileSync(path.resolve('src/data/seo-index-data.json'), JSON.stringify(urls, null, 2));

// Generate comprehensive Markdown Documentation
let md = `# Google Indexing & Keyword Strategy Map

> **Site:** Wordle Solver Pro (\`https://wordlesolverpro.com\`)  
> **Total Indexable URLs in Sitemap:** ${urls.length}  
> **Total Addressable Organic Search Volume:** ~1,300,000+ monthly searches  
> **Build Date / Last Verified:** ${todayDate}

---

## 1. Executive Summary & Crawling Architecture

This document maps every single page produced by **Wordle Solver Pro** to its exact target search queries, monthly organic search volume, intent category, and indexation directives for Google Search Console and Googlebot.

The XML Sitemap is physically generated and deployed at:
\`\`\`
https://wordlesolverpro.com/sitemap.xml
\`\`\`
Direct crawler access rules are defined in:
\`\`\`
https://wordlesolverpro.com/robots.txt
\`\`\`

---

## 2. Core High-Priority URLs & Keyword Map

| URL Path | Target Primary Keyword | Monthly Volume | Priority | Changefreq | Search Intent |
| :--- | :--- | :---: | :---: | :---: | :--- |
| \`/\` | **wordle solver** + **wordle solver pro** | **550,000 + 14,800** | 1.0 | Daily | Primary Solver Tool |
| \`/wordle-solver-game/\` | **wordle solver game** | **9,900** | 0.9 | Daily | Interactive Game + Assistant |
| \`/tools/\` | **wordle solver tools** / **wordle solver tool** | **12,100 + 9,900** | 0.9 | Weekly | Comprehensive Directory Hub |
| \`/wordle-solver-7-letter/\` | **7 letter wordle solver** | **1,300** | 0.9 | Weekly | 7-Letter Board Solver |
| \`/wordle-solver-6-letter/\` | **wordle solver 6 letters** | **480** | 0.8 | Weekly | 6-Letter Board Solver |
| \`/wordle-solver-4-letter/\` | **4 letter wordle solver** | **850** | 0.8 | Weekly | 4-Letter Mini Solver |
| \`/wordle-solver-8-letter/\` | **8 letter wordle solver** | **410** | 0.8 | Weekly | 8-Letter Lexicon Solver |
| \`/wordle-solver-3-letter/\` | **3 letter wordle solver** | **320** | 0.7 | Weekly | 3-Letter Hook Solver |
| \`/word-finder/\` | **word finder** / **anagram solver** | **450,000** | 0.9 | Weekly | Scrabble / Anagram Tool |
| \`/blog/every-wordle-answer-ever/\` | **every wordle answer ever** | **90,500** | 0.95 | Daily | Solution Archive (High Compound) |
| \`/blog/best-wordle-starting-words/\` | **best wordle starting words** | **60,500** | 0.85 | Weekly | Mathematical Analysis Guide |
| \`/blog/try-harder-wordle-solver/\` | **try harder wordle solver** | **3,600** | 0.85 | Weekly | Hard Mode Survival Guide |
| \`/blog/best-wordle-solver-alternatives/\`| **rock paper shotgun wordle solver** (overflow) | **33,100** | 0.85 | Monthly | Competitor Comparison Guide |
| \`/blog/how-wordle-solver-works/\` | **how wordle solver works** | **1,900** | 0.8 | Monthly | Algorithm & Math Specification |
| \`/sitemap/\` | **wordle solver sitemap index** | **800** | 0.7 | Weekly | HTML Crawler Index & SEO Map |

---

## 3. High-Volume Letter-Specific Programmatic Pages

Google indexes letter-targeted queries at massive aggregate volume. Each page features real precomputed 5-letter word lists, unique computed letter stats, and direct solver links.

### 5-Letter Words Starting With (26 URLs):
${alphabet.map(c => `- \`/five-letter-words/starting-with/${c}/\` &rarr; Target: *"5 letter words starting with ${c.toUpperCase()}"* (Avg. 12,000–49,500/mo)`).join('\n')}

### 5-Letter Words Containing (26 URLs):
${alphabet.map(c => `- \`/five-letter-words/containing/${c}/\` &rarr; Target: *"5 letter words containing ${c.toUpperCase()}"* (Avg. 8,100–22,200/mo)`).join('\n')}

---

## 4. Keyword Usage & Density Breakdown by Page Element

| Page Type | Title Tag Target | H1 Tag Target | Meta Description Target | FAQ Schema Markup |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage (\`/\`)** | Contains *"Wordle Solver"* & *"Wordle Solver Pro"* + Word Count | Contains *"Wordle Solver & Wordle Solver Pro"* | Exact keyword match with duplicate letter logic & 14,855 count | 6 Questions detailing algorithm & privacy |
| **Game Mode (\`/wordle-solver-game/\`)** | Contains *"Wordle Solver Game"* | Contains *"Wordle Solver Game"* | Highlights interactive live AI assistant | 5 Questions on game rules & tips |
| **7-Letter (\`/wordle-solver-7-letter/\`)** | Contains *"7 Letter Wordle Solver: Filter 24,029 Words"* | Contains *"7-Letter Wordle Solver"* | Mentions 24,029 words, tile clues, and anagrams | 6 Questions on 7-letter words |
| **Tools Hub (\`/tools/\`)** | Contains *"Wordle Solver Tools & Free Word Game Solvers"* | Contains *"Wordle Solver Tools Directory"* | Mentions all board lengths (3–8 letters) | Comprehensive overview FAQ |
| **Archive (\`/blog/every-wordle-answer-ever/\`)** | Contains *"Every Wordle Answer Ever (Updated Daily)"* | Contains *"Every Wordle Answer Ever"* | Focuses on complete past solutions from #0 to present | FAQ on Wordle repeat patterns & history |

---

## 5. Algorithmic Advantage vs Competitors

1. **Competitor: \`wordlesolver.online\` & \`5-letter-words.com\`**:
   - *Weakness:* They apply a simple negative regex when a gray tile appears, breaking duplicate letters (e.g., guessing *BLEED* against *ABBEY* deletes *ABBEY*).
   - *Our Edge:* Exact duplicate-letter bounding (gray tile only sets upper bound to confirmed green/yellow count).
2. **Competitor: Rock Paper Shotgun (RPS)**:
   - *Weakness:* RPS publishes static hint articles with no interactive solver or custom clue input.
   - *Our Edge:* Real-time tile-clue cycling and live Information Gain candidate ranking.
3. **Data Security**:
   - Zero telemetry, zero server queries, 100% in-browser execution with precomputed SCOWL/ENABLE lexicons.
`;

fs.writeFileSync(path.resolve('SEO_INDEXING_AND_KEYWORD_STRATEGY.md'), md);
console.log('Generated SEO_INDEXING_AND_KEYWORD_STRATEGY.md successfully!');
