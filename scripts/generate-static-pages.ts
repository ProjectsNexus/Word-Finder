import fs from 'node:fs';
import path from 'node:path';

export const DOMAIN = 'https://royzacademia.com';

export interface PageDefinition {
  path: string; // e.g. '/tools/' or '/wordle-solver-7-letter/'
  title: string;
  description: string;
  keywords: string;
  category?: string;
  faqList?: Array<{ q: string; a: string }>;
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const allPages: PageDefinition[] = [
  // 1. Homepage / 5-Letter Solver
  {
    path: '/',
    title: 'Wordle Solver & Wordle Solver Pro – Fast Word Game & Letter Clue Solver',
    description: 'Solve Wordle fast with our intelligent 5-letter Wordle Solver Pro. Filter 14,855 words using tile clues, duplicate letter handling, and smart next guesses.',
    keywords: 'wordle solver, wordle solver pro, word game letter clue solver, 5 letter wordle solver, wordle hint, wordle helper',
    category: 'GameApplication',
    faqList: [
      {
        q: 'What is Wordle Solver Pro?',
        a: 'Wordle Solver Pro is a fast, mathematically optimal Wordle solver that filters 14,855 candidate words using exact tile color clues (green, yellow, and gray) and advanced duplicate letter constraints.'
      },
      {
        q: 'How do I use this Wordle Solver?',
        a: 'Enter your 5-letter guess, click each tile to match your in-game colors (gray for absent, yellow for wrong spot, green for correct spot), and our solver instantly calculates the top candidate words ranked by information gain.'
      },
      {
        q: 'Does it handle duplicate letters properly?',
        a: 'Yes! Our algorithm precisely enforces Wordle rules for duplicate letters. If a guess has two of the same letter (like SPEED) and one is green while the other is gray, candidate words are restricted to exactly one E.'
      }
    ]
  },

  // 2. Wordle Solver Game
  {
    path: '/wordle-solver-game',
    title: 'Wordle Solver Game – Play Wordle with Live AI Information Gain Solver',
    description: 'Play Wordle online with an interactive real-time solver assistant. Test your guesses against mathematical information gain and view remaining candidate words.',
    keywords: 'wordle solver game, play wordle online, wordle with solver, interactive wordle, wordle assistant game',
    category: 'GameApplication',
    faqList: [
      {
        q: 'What is Wordle Solver Game?',
        a: 'Wordle Solver Game is an interactive playable version of Wordle paired with a real-time solver assistant that analyzes your moves and shows remaining possible solutions.'
      },
      {
        q: 'Can I play unlimited games?',
        a: 'Yes, you can play unlimited Wordle puzzles with instant hints, entropy analysis, and candidate counts.'
      }
    ]
  },

  // 3. Tools Hub
  {
    path: '/tools',
    title: 'Wordle Solver Tools & Free Word Game Solvers Directory',
    description: 'Comprehensive directory of free Wordle solver tools for 3, 4, 5, 6, 7, and 8-letter boards. Filter words, analyze letter entropy, and solve any word puzzle.',
    keywords: 'wordle solver tools, wordle solver tool, free word game solvers directory, wordle word length solvers, wordle helper tools',
    category: 'WebApplication',
    faqList: [
      {
        q: 'What tools are available in Wordle Solver Tools?',
        a: 'Wordle Solver Tools includes dedicated solvers for 3, 4, 5, 6, 7, and 8-letter boards, an interactive Wordle game, an anagram word finder, and letter frequency analytics.'
      },
      {
        q: 'Are all Wordle tools completely free?',
        a: 'Yes, 100% free with no sign-up or download required.'
      }
    ]
  },

  // 4. Word Finder
  {
    path: '/word-finder',
    title: 'Word Finder & Scrabble Anagram Solver – Filter 89,584 Words',
    description: 'Search dictionary words by pattern (_A__E), anagram letters, and exclusions. Calculate Scrabble points and optimal tile placement instantly.',
    keywords: 'word finder, anagram solver, scrabble word finder, pattern word search, unscramble words, blank tile solver',
    category: 'WebApplication',
    faqList: [
      {
        q: 'How does the Word Finder pattern search work?',
        a: 'Enter wildcard patterns like _A__E or ?O?E to find words where specific letters are locked into exact positions.'
      },
      {
        q: 'Does it calculate Scrabble scores?',
        a: 'Yes, standard English Scrabble tile values are calculated and displayed for every word.'
      }
    ]
  },

  // 5. Length-Specific Solvers
  {
    path: '/wordle-solver-3-letter',
    title: '3-Letter Wordle Solver: Filter 1,015 Three-Letter Words',
    description: 'Fast, intelligent 3-letter Wordle solver. Filter 1,015 words with exact tile clues, anagram constraints, and information gain scoring.',
    keywords: '3 letter wordle solver, 3-letter word solver, three letter wordle solver, mini wordle solver',
    category: 'WebApplication',
    faqList: [
      {
        q: 'When should I use a 3-letter Wordle solver?',
        a: 'Use it for 3-letter mini word puzzles, Scrabble tile hooks, and crossword speed challenges.'
      }
    ]
  },
  {
    path: '/wordle-solver-4-letter',
    title: '4-Letter Wordle Solver: Filter 4,030 Four-Letter Words',
    description: 'Fast, intelligent 4-letter Wordle solver. Filter 4,030 words with exact tile clues, anagram constraints, and information gain scoring.',
    keywords: '4 letter wordle solver, 4-letter word solver, four letter wordle solver, mini wordle 4 letters',
    category: 'WebApplication',
    faqList: [
      {
        q: 'What puzzles use 4-letter words?',
        a: 'Wordle mini editions, Wordle 4-letter variants, Jumble, and word ladder games.'
      }
    ]
  },
  {
    path: '/wordle-solver-6-letter',
    title: 'Wordle Solver 6 Letters: Filter 15,788 Six-Letter Words',
    description: 'Fast, intelligent 6-letter Wordle solver. Filter 15,788 words with exact tile clues, anagram constraints, and information gain scoring.',
    keywords: 'wordle solver 6 letters, 6 letter wordle solver, hurdle solver 6 letters, six letter wordle helper',
    category: 'WebApplication',
    faqList: [
      {
        q: 'Does this work for Hurdle and 6-letter Wordle games?',
        a: 'Yes, our 6-letter solver contains 15,788 valid six-letter words covering Hurdle, Wordle 6, and custom word puzzles.'
      }
    ]
  },
  {
    path: '/wordle-solver-7-letter',
    title: '7 Letter Wordle Solver: Filter 24,029 Seven-Letter Words',
    description: 'Fast, intelligent 7-letter Wordle solver. Filter 24,029 words with exact tile clues, anagram constraints, and information gain scoring.',
    keywords: '7 letter wordle solver, 7-letter word solver, seven letter wordle solver, long wordle solver',
    category: 'WebApplication',
    faqList: [
      {
        q: 'How many 7-letter words are in the database?',
        a: 'We index 24,029 verified 7-letter English words with real-time positional filtering.'
      }
    ]
  },
  {
    path: '/wordle-solver-8-letter',
    title: '8-Letter Wordle Solver: Filter 29,766 Eight-Letter Words',
    description: 'Fast, intelligent 8-letter Wordle solver. Filter 29,766 words with exact tile clues, anagram constraints, and information gain scoring.',
    keywords: '8 letter wordle solver, 8-letter word solver, eight letter wordle solver, master wordle solver',
    category: 'WebApplication',
    faqList: [
      {
        q: 'How fast is the 8-letter solver?',
        a: 'Filters through all 29,766 eight-letter words in under 3 milliseconds in your browser.'
      }
    ]
  },

  // 6. Strategy & Editorial Guides
  {
    path: '/blog/every-wordle-answer-ever',
    title: 'Every Wordle Answer Ever (Updated Daily) – Complete Past Solutions Archive',
    description: 'Search every official Wordle answer ever released from puzzle #0 to today. Check past Wordle solutions, letter patterns, difficulty ratings, and today\'s Wordle answer.',
    keywords: 'every wordle answer ever, past wordle answers, wordle archive, list of wordle answers, previous wordle solutions, today\'s wordle answer',
    category: 'Article',
    faqList: [
      {
        q: 'Has an official Wordle answer ever been repeated?',
        a: 'No, The New York Times has never repeated a past answer in the official daily game.'
      },
      {
        q: 'Is today\'s Wordle answer included in this archive?',
        a: 'Yes, this archive updates every midnight with the official daily solution and letter pattern analysis.'
      }
    ]
  },
  {
    path: '/blog/best-wordle-starting-words',
    title: 'Best Wordle Starting Words (Ranked Mathematically by Information Gain)',
    description: 'Discover the best Wordle starting words ranked by information gain, letter frequency, and candidate elimination. Why SOARE, ROATE, and RAISE win.',
    keywords: 'best wordle starting words, best wordle opener, best word to start wordle, soare roate raise, mathematical wordle opening',
    category: 'Article',
    faqList: [
      {
        q: 'What is the mathematically best starting word in Wordle?',
        a: 'Using Shannon entropy and letter frequency metrics, SOARE, ROATE, and RAISE eliminate the most possible candidate words on turn 1.'
      }
    ]
  },
  {
    path: '/blog/try-harder-wordle-solver',
    title: 'Try Harder Wordle Solver: Hard Mode Strategies & Trap Elimination',
    description: 'Looking for a try harder Wordle solver? Master Wordle Hard Mode, conquer tricky 1-letter traps (_IGHT, _ATCH), and keep your winning streak alive.',
    keywords: 'try harder wordle solver, wordle hard mode solver, hard mode wordle strategy, wordle trap words, beat wordle hard mode',
    category: 'Article',
    faqList: [
      {
        q: 'What is Wordle Hard Mode?',
        a: 'In Wordle Hard Mode, any revealed green or yellow clues MUST be used in all subsequent guesses.'
      },
      {
        q: 'How do you escape letter traps in Hard Mode?',
        a: 'Anticipate rhyming word families (_OUND, _IGHT) on your second guess before locking in green tiles.'
      }
    ]
  },
  {
    path: '/blog/best-wordle-solver-alternatives',
    title: 'Best Wordle Solver Alternatives (Ranked & Compared)',
    description: 'Looking for the best Wordle solver alternative to Rock Paper Shotgun, Wordlesolver.online, or 5-letter-words? Compare features, privacy, and accuracy.',
    keywords: 'best wordle solver alternatives, rock paper shotgun wordle solver, wordlesolver online alternative, 5 letter words solver comparison',
    category: 'Article',
    faqList: [
      {
        q: 'What makes Wordle Solver Pro better than Rock Paper Shotgun?',
        a: 'Wordle Solver Pro handles multi-length boards (3-8 letters), provides real-time information gain ranking, strict duplicate letter logic, and zero ad bloat.'
      }
    ]
  },
  {
    path: '/blog/how-wordle-solver-works',
    title: 'How Our Wordle Solver Works: The Math Behind the Algorithm',
    description: 'Learn how our Wordle solver algorithm calculates entropy, duplicate letter constraints, and candidate filtering in milliseconds.',
    keywords: 'how wordle solver works, wordle solver math, wordle entropy algorithm, duplicate letter wordle logic',
    category: 'Article',
    faqList: [
      {
        q: 'How does information gain work in Wordle?',
        a: 'Each guess produces one of 243 possible color patterns (3^5). A word with high information gain divides the candidate list into small, uniform buckets.'
      }
    ]
  },
  {
    path: '/sitemap',
    title: 'Wordle Solver Pro – Complete URL Sitemap & Google Indexing Map',
    description: 'Comprehensive index of all 68 pages on Wordle Solver Pro with exact target search keywords, estimated monthly search volumes, and crawler priority.',
    keywords: 'wordle solver sitemap, wordle solver index, all wordle solver pages, royzacademia sitemap',
    category: 'WebApplication'
  }
];

// Add 26 starting-with pages
for (const char of alphabet) {
  const upper = char.toUpperCase();
  allPages.push({
    path: `/five-letter-words/starting-with/${char}`,
    title: `5-Letter Words Starting With ${upper}: Complete Filtered Word List`,
    description: `Comprehensive list of verified 5-letter English words starting with ${upper}. Filter by tile clues, duplicate letters, and find the perfect Wordle or Scrabble word.`,
    keywords: `5 letter words starting with ${char}, 5 letter words starting with ${upper}, five letter words start with ${upper}, wordle words starting with ${upper}`,
    category: 'WebApplication',
    faqList: [
      {
        q: `How many 5-letter words start with ${upper}?`,
        a: `Our dictionary contains every verified 5-letter English word starting with the letter ${upper}, completely playable in Wordle and Scrabble.`
      }
    ]
  });
}

// Add 26 containing pages
for (const char of alphabet) {
  const upper = char.toUpperCase();
  allPages.push({
    path: `/five-letter-words/containing/${char}`,
    title: `5-Letter Words Containing ${upper}: Complete Filtered Word List`,
    description: `Comprehensive list of verified 5-letter English words containing the letter ${upper}. Filter by tile clues, duplicate letters, and find the perfect Wordle or Scrabble word.`,
    keywords: `5 letter words containing ${char}, 5 letter words containing ${upper}, five letter words with ${upper}, wordle words containing ${upper}`,
    category: 'WebApplication',
    faqList: [
      {
        q: `How many 5-letter words contain the letter ${upper}?`,
        a: `Our dictionary indexes all 5-letter English words with ${upper} in any position, with instant filter tools.`
      }
    ]
  });
}

export function buildPageHtml(page: PageDefinition, headAssets: string, bodyScript: string): string {
  const cleanPath = page.path.replace(/^\//, '').replace(/\/$/, '');
  const canonicalUrl = cleanPath ? `${DOMAIN}/${cleanPath}` : `${DOMAIN}/`;
  const faqsJson = page.faqList && page.faqList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqList.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="keywords" content="${page.keywords}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="alternate icon" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/logo.svg" />

    <!-- OpenGraph Tags -->
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${DOMAIN}/logo.svg" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${DOMAIN}/logo.svg" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "${page.category || 'WebApplication'}",
      "name": "${page.title.split('–')[0].split(':')[0].trim()}",
      "url": "${canonicalUrl}",
      "description": "${page.description}",
      "applicationCategory": "GameApplication",
      "operatingSystem": "All"
    }
    </script>
    ${faqsJson ? `<script type="application/ld+json">\n${JSON.stringify(faqsJson, null, 2)}\n</script>` : ''}

    ${headAssets}
  </head>
  <body class="bg-[#F8F7F3] text-stone-900 antialiased selection:bg-amber-200">
    <div id="root"></div>
    ${bodyScript}
  </body>
</html>`;
}

// 1. Generate into public/ folder (for Dev mode & direct repository cloning)
export function generatePublicPages() {
  console.log(`[Public] Generating ${allPages.length} HTML pages in public/ folder...`);

  const devHead = '';
  const devScript = '<script type="module" src="/src/main.tsx"></script>';

  for (const page of allPages) {
    if (page.path === '/') continue; // Root index.html is in root
    const cleanPath = page.path.replace(/^\//, '').replace(/\/$/, '');
    const targetDir = path.join(process.cwd(), 'public', cleanPath);

    fs.mkdirSync(targetDir, { recursive: true });
    const html = buildPageHtml(page, devHead, devScript);
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
  }

  console.log(`[Public] Generated all static HTML files in public/ successfully.`);
}

// 2. Generate into dist/ folder (for Production builds with bundled CSS/JS)
export function generateDistPages() {
  const distDir = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distDir, 'index.html');

  if (!fs.existsSync(distIndexHtml)) {
    console.error(`[Dist Error] ${distIndexHtml} not found. Run 'vite build' first!`);
    return;
  }

  const distContent = fs.readFileSync(distIndexHtml, 'utf-8');

  // Extract production script and link tags from dist/index.html
  const scriptMatches = distContent.match(/<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/g) || [];
  const linkMatches = distContent.match(/<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">/g) || [];

  const headAssets = linkMatches.join('\n    ');
  const bodyScript = scriptMatches.join('\n    ');

  console.log(`[Dist] Generating ${allPages.length} HTML pages in dist/ folder with production assets...`);

  for (const page of allPages) {
    if (page.path === '/') {
      // Update root dist/index.html with home page SEO
      const rootHtml = buildPageHtml(page, headAssets, bodyScript);
      fs.writeFileSync(distIndexHtml, rootHtml, 'utf-8');
      continue;
    }

    const cleanPath = page.path.replace(/^\//, '').replace(/\/$/, '');
    const targetDir = path.join(distDir, cleanPath);

    fs.mkdirSync(targetDir, { recursive: true });
    const html = buildPageHtml(page, headAssets, bodyScript);
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
  }

  // Also ensure vercel.json is in dist
  const vercelSrc = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelSrc)) {
    fs.copyFileSync(vercelSrc, path.join(distDir, 'vercel.json'));
  }

  console.log(`[Dist] All ${allPages.length} static HTML pages created in dist/ successfully!`);
}

// Command-line execution
const isDistOnly = process.argv.includes('--dist');
if (isDistOnly) {
  generateDistPages();
} else {
  generatePublicPages();
  if (fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
    generateDistPages();
  }
}
