import fs from 'node:fs';
import path from 'node:path';

const domain = 'https://wordlesolverpro.com';

interface PageMetadata {
  path: string;
  title: string;
  description: string;
  heading: string;
  subheading: string;
  faqs?: Array<{ q: string; a: string }>;
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const pages: PageMetadata[] = [
  {
    path: '/tools/',
    title: 'Wordle Solver Tools & Free Word Game Solvers Directory',
    description: 'Comprehensive directory of free Wordle solver tools for 3, 4, 5, 6, 7, and 8-letter boards. Filter words, analyze letter entropy, and solve any word puzzle.',
    heading: 'Wordle Solver Tools & Free Word Game Solvers',
    subheading: 'Select your word length and puzzle mode below to open the dedicated solver tool with exact tile-color clues, duplicate letter handling, and live candidate filtering.',
    faqs: [
      {
        q: 'What is Wordle Solver Tools?',
        a: 'Wordle Solver Tools is a comprehensive suite of free linguistic calculators designed to solve any word puzzle variant from 3 to 8 letters.'
      },
      {
        q: 'Can I solve 6-letter and 7-letter Wordle games?',
        a: 'Yes, we provide dedicated solvers with complete dictionaries for 6-letter (Hurdle) and 7-letter word games.'
      }
    ]
  },
  {
    path: '/wordle-solver-game/',
    title: 'Wordle Solver Game – Play Wordle with Live AI Information Gain Solver',
    description: 'Play Wordle online with an interactive real-time solver assistant. Test your guesses against mathematical information gain and view remaining candidate words.',
    heading: 'Play Wordle Solver Game Online',
    subheading: 'Test your puzzle-solving skills with our interactive Wordle game featuring a real-time mathematical solver assistant, entropy ranking, and candidate elimination tracking.',
    faqs: [
      {
        q: 'How does the interactive Wordle Solver Game work?',
        a: 'You play Wordle just like the daily puzzle, but a real-time assistant reveals the remaining possible solutions and ranks your guesses.'
      }
    ]
  },
  {
    path: '/word-finder/',
    title: 'Word Finder & Scrabble Anagram Solver – Filter 89,584 Words',
    description: 'Search dictionary words by pattern (_A__E), anagram letters, and exclusions. Calculate Scrabble points and optimal tile placement instantly.',
    heading: 'Word Finder & Scrabble Anagram Solver',
    subheading: 'Search 89,584 words by exact wildcard patterns, rack letters, and exclusions with live Scrabble score calculation.',
    faqs: [
      {
        q: 'How do wildcards work in Word Finder?',
        a: 'Use an underscore (_) or question mark (?) as a blank tile or unknown letter.'
      }
    ]
  },
  {
    path: '/wordle-solver-7-letter/',
    title: '7 Letter Wordle Solver: Filter 24,029 Words',
    description: 'Fast, intelligent 7-letter Wordle solver. Filter 24,029 words with exact tile clues, anagram constraints, and information gain scoring.',
    heading: '7-Letter Wordle Solver',
    subheading: 'Filter 24,029 seven-letter English words using green, yellow, and gray tile clues.',
    faqs: [
      {
        q: 'How do I solve a 7-letter Wordle puzzle?',
        a: 'Enter your 7-letter guess, tap each tile to match your game colors, and our solver eliminates impossible words.'
      }
    ]
  },
  {
    path: '/wordle-solver-6-letter/',
    title: 'Wordle Solver 6 Letters: Filter 15,788 Six-Letter Words',
    description: 'Fast, intelligent 6-letter Wordle solver. Filter 15,788 words with exact tile clues, anagram constraints, and information gain scoring.',
    heading: '6-Letter Wordle Solver',
    subheading: 'Filter 15,788 six-letter English words using green, yellow, and gray tile clues.',
    faqs: [
      {
        q: 'Does this work for Hurdle and 6-letter Wordle?',
        a: 'Yes, it supports all 6-letter Wordle and Hurdle puzzle variations.'
      }
    ]
  },
  {
    path: '/wordle-solver-4-letter/',
    title: '4-Letter Wordle Solver: Filter 4,030 Words',
    description: 'Fast, intelligent 4-letter Wordle solver. Filter 4,030 words with exact tile clues, anagram constraints, and information gain scoring.',
    heading: '4-Letter Wordle Solver',
    subheading: 'Filter 4,030 four-letter English words using green, yellow, and gray tile clues.',
    faqs: [
      {
        q: 'What games use 4-letter words?',
        a: 'Mini-Wordle, Jumble, and word ladder games use 4-letter lexicons.'
      }
    ]
  },
  {
    path: '/wordle-solver-3-letter/',
    title: '3-Letter Wordle Solver: Filter 1,015 Words',
    description: 'Fast, intelligent 3-letter Wordle solver. Filter 1,015 words with exact tile clues, anagram constraints, and information gain scoring.',
    heading: '3-Letter Wordle Solver',
    subheading: 'Filter 1,015 three-letter English words using green, yellow, and gray tile clues.',
    faqs: [
      {
        q: 'Why use a 3-letter word solver?',
        a: 'Essential for Scrabble hooks, crosswords, and speed word puzzles.'
      }
    ]
  },
  {
    path: '/wordle-solver-8-letter/',
    title: '8-Letter Wordle Solver: Filter 29,766 Words',
    description: 'Fast, intelligent 8-letter Wordle solver. Filter 29,766 words with exact tile clues, anagram constraints, and information gain scoring.',
    heading: '8-Letter Wordle Solver',
    subheading: 'Filter 29,766 eight-letter English words using green, yellow, and gray tile clues.',
    faqs: [
      {
        q: 'How many 8-letter words exist in the dictionary?',
        a: 'Our verified dictionary indexes 29,766 valid 8-letter English words.'
      }
    ]
  },
  {
    path: '/blog/every-wordle-answer-ever/',
    title: 'Every Wordle Answer Ever (Updated Daily) – Complete Past Solutions Archive',
    description: 'Search every official Wordle answer ever released from puzzle #0 to today. Check past Wordle solutions, letter patterns, difficulty ratings, and today\'s Wordle answer.',
    heading: 'Every Wordle Answer Ever: Complete Past Solutions Archive',
    subheading: 'Browse, filter, and search every past Wordle solution from puzzle #0 to today. Check if a word has already been used as the official daily answer.',
    faqs: [
      {
        q: 'Has a Wordle answer ever been repeated?',
        a: 'No. The New York Times has not repeated any past solution in regular daily play.'
      }
    ]
  },
  {
    path: '/blog/best-wordle-starting-words/',
    title: 'Best Wordle Starting Words (Ranked Mathematically by Information Gain)',
    description: 'Discover the best Wordle starting words ranked by information gain, letter frequency, and candidate elimination. Why SOARE, ROATE, and RAISE win.',
    heading: 'Best Wordle Starting Words Ranked Mathematically',
    subheading: 'A deep linguistic analysis of optimal opening words using Claude Shannon information theory and letter positional frequencies.',
    faqs: [
      {
        q: 'What is the mathematically best starting word for Wordle?',
        a: 'Information theory calculations establish SOARE, ROATE, RAISE, and CRANE as the top openers.'
      }
    ]
  },
  {
    path: '/blog/try-harder-wordle-solver/',
    title: 'Try Harder Wordle Solver: Hard Mode Strategies & Trap Elimination',
    description: 'Looking for a try harder Wordle solver? Master Wordle Hard Mode, conquer tricky 1-letter traps (_IGHT, _ATCH), and keep your winning streak alive.',
    heading: 'Try Harder Wordle Solver: Hard Mode & Trap Strategy Guide',
    subheading: 'How to avoid catastrophic losing streaks in Wordle Hard Mode when trapped in rhyming families like _OUND and _IGHT.',
    faqs: [
      {
        q: 'What is Wordle Hard Mode?',
        a: 'Hard Mode requires you to use any revealed green or yellow clues in all subsequent guesses.'
      }
    ]
  },
  {
    path: '/blog/best-wordle-solver-alternatives/',
    title: 'Best Wordle Solver Alternatives (Ranked & Compared)',
    description: 'Looking for the best Wordle solver alternative to Rock Paper Shotgun, Wordlesolver.online, or 5-letter-words? Compare features, privacy, and accuracy.',
    heading: 'Best Wordle Solver Alternatives Compared',
    subheading: 'An honest side-by-side comparison of Wordle Solver Pro vs Rock Paper Shotgun, Wordlesolver.online, and WordFinder.',
    faqs: [
      {
        q: 'What makes Wordle Solver Pro different?',
        a: 'Wordle Solver Pro handles complex duplicate letter logic, supports multi-length boards (3-8 letters), and runs 100% in-browser with zero tracking.'
      }
    ]
  },
  {
    path: '/blog/how-wordle-solver-works/',
    title: 'How Our Wordle Solver Works: The Math Behind the Algorithm',
    description: 'Learn how our Wordle solver algorithm calculates entropy, duplicate letter constraints, and candidate filtering in milliseconds.',
    heading: 'How Our Wordle Solver Works: The Mathematics of Wordle',
    subheading: 'An in-depth explanation of constraint satisfaction, letter positional matrices, and Shannon entropy.',
    faqs: [
      {
        q: 'How does the solver filter words so quickly?',
        a: 'We pre-compile dictionary word arrays and evaluate bitwise tile masks in client-side memory in less than 2 milliseconds.'
      }
    ]
  },
  {
    path: '/sitemap/',
    title: 'Wordle Solver Pro – Complete URL Sitemap & Google Indexing Map',
    description: 'Comprehensive index of all 67 pages on Wordle Solver Pro with exact target search keywords, estimated monthly search volumes, and crawler priority.',
    heading: 'Wordle Solver Pro Sitemap & SEO Index',
    subheading: 'Complete directory of all 67 published solver tools, letter directories, and strategy archives.',
    faqs: [
      {
        q: 'What pages are indexed on Wordle Solver Pro?',
        a: 'The site includes 9 solver boards, 5 strategy archives, 26 starting-letter directories, and 26 containing-letter directories.'
      }
    ]
  }
];

// Add 26 starting-with pages
for (const char of alphabet) {
  const upper = char.toUpperCase();
  pages.push({
    path: `/five-letter-words/starting-with/${char}/`,
    title: `5-Letter Words Starting With ${upper}: Complete Filtered Word List`,
    description: `Comprehensive list of verified 5-letter English words starting with ${upper}. Filter by tile clues, duplicate letters, and find the perfect Wordle or Scrabble word.`,
    heading: `5-Letter Words Starting With ${upper}`,
    subheading: `Browse verified five-letter English words beginning with the letter ${upper}.`,
    faqs: [
      {
        q: `How many 5-letter words start with ${upper}?`,
        a: `Our dictionary contains every verified 5-letter English word starting with ${upper}, fully compatible with Wordle and Scrabble.`
      }
    ]
  });
}

// Add 26 containing pages
for (const char of alphabet) {
  const upper = char.toUpperCase();
  pages.push({
    path: `/five-letter-words/containing/${char}/`,
    title: `5-Letter Words Containing ${upper}: Complete Filtered Word List`,
    description: `Comprehensive list of verified 5-letter English words containing the letter ${upper}. Filter by tile clues, duplicate letters, and find the perfect Wordle or Scrabble word.`,
    heading: `5-Letter Words Containing ${upper}`,
    subheading: `Browse verified five-letter English words that contain the letter ${upper} in any position.`,
    faqs: [
      {
        q: `How many 5-letter words contain ${upper}?`,
        a: `Our dictionary contains every verified 5-letter English word containing the letter ${upper}, fully compatible with Wordle and Scrabble.`
      }
    ]
  });
}

function generateHtml(page: PageMetadata, scriptTags: string, linkTags: string): string {
  const canonicalUrl = `${domain}${page.path}`;
  const faqsJson = page.faqs && page.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map(faq => ({
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
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- OpenGraph Tags -->
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${page.title.split('–')[0].split(':')[0].trim()}",
      "url": "${canonicalUrl}",
      "description": "${page.description}",
      "applicationCategory": "GameApplication",
      "operatingSystem": "All"
    }
    </script>
    ${faqsJson ? `<script type="application/ld+json">\n${JSON.stringify(faqsJson, null, 2)}\n</script>` : ''}

    ${linkTags}
    ${scriptTags}
  </head>
  <body class="bg-[#F8F7F3] text-stone-900 antialiased selection:bg-amber-200">
    <div id="root">
      <!-- Static Pre-Rendered Crawl Content for Search Engines & Non-JS Clients -->
      <header style="max-width: 1200px; margin: 0 auto; padding: 24px 16px; border-bottom: 1px solid #e7e5e4;">
        <nav style="display: flex; justify-content: space-between; align-items: center;">
          <a href="/" style="font-family: serif; font-weight: bold; font-size: 20px; text-decoration: none; color: #1c1917;">Wordle Solver Pro</a>
          <div style="display: flex; gap: 16px; font-size: 14px;">
            <a href="/" style="color: #44403c; text-decoration: none;">5-Letter Solver</a>
            <a href="/tools/" style="color: #44403c; text-decoration: none;">All Solvers</a>
            <a href="/wordle-solver-game/" style="color: #44403c; text-decoration: none;">Play Game</a>
            <a href="/word-finder/" style="color: #44403c; text-decoration: none;">Word Finder</a>
            <a href="/blog/every-wordle-answer-ever/" style="color: #44403c; text-decoration: none;">Past Answers</a>
          </div>
        </nav>
      </header>
      <main style="max-width: 900px; margin: 40px auto; padding: 0 16px; font-family: sans-serif;">
        <h1 style="font-family: serif; font-size: 32px; font-weight: bold; color: #1c1917; margin-bottom: 12px;">${page.heading}</h1>
        <p style="font-size: 16px; color: #57534e; line-height: 1.6; margin-bottom: 24px;">${page.subheading}</p>
        <div style="padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e7e5e4; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #292524; line-height: 1.6;">${page.description}</p>
          <div style="margin-top: 16px;">
            <a href="${page.path}" style="display: inline-block; padding: 10px 20px; background: #1c1917; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Launch Interactive Solver</a>
          </div>
        </div>
        ${page.faqs && page.faqs.length > 0 ? `
        <section style="margin-top: 40px;">
          <h2 style="font-family: serif; font-size: 22px; font-weight: bold; color: #1c1917; margin-bottom: 16px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${page.faqs.map(faq => `
            <div style="padding: 16px; background: #ffffff; border-radius: 8px; border: 1px solid #e7e5e4;">
              <h3 style="font-size: 16px; font-weight: 600; color: #1c1917; margin-bottom: 8px;">${faq.q}</h3>
              <p style="font-size: 14px; color: #57534e; line-height: 1.5;">${faq.a}</p>
            </div>
            `).join('')}
          </div>
        </section>` : ''}
      </main>
    </div>
  </body>
</html>`;
}

// 1. Generate into public/ folder
export function generatePublicStaticFiles() {
  console.log(`Generating static files into public/ folder for ${pages.length} pages...`);
  
  // Script tag for Vite dev mode
  const devScriptTag = '<script type="module" src="/src/main.tsx"></script>';
  const devLinkTag = '';

  for (const page of pages) {
    // Relative target path inside public/
    // e.g. /tools/ -> public/tools/index.html
    const cleanPath = page.path.replace(/^\//, '').replace(/\/$/, '');
    const targetDir = path.join(process.cwd(), 'public', cleanPath);
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const htmlContent = generateHtml(page, devScriptTag, devLinkTag);
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
  }

  console.log(`Successfully generated ${pages.length} static HTML files in public/!`);
}

// 2. Sync into dist/ folder after vite build
export function syncDistStaticFiles() {
  const distDir = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distDir, 'index.html');

  if (!fs.existsSync(distIndexHtml)) {
    console.warn('dist/index.html not found, skipping dist sync.');
    return;
  }

  const distContent = fs.readFileSync(distIndexHtml, 'utf-8');

  // Extract compiled script and link tags from dist/index.html
  const scriptMatches = distContent.match(/<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/g) || [];
  const linkMatches = distContent.match(/<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">/g) || [];

  const scriptTags = scriptMatches.join('\n    ');
  const linkTags = linkMatches.join('\n    ');

  console.log(`Syncing static files into dist/ folder using bundle tags...`);

  for (const page of pages) {
    const cleanPath = page.path.replace(/^\//, '').replace(/\/$/, '');
    const targetDir = path.join(distDir, cleanPath);
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const htmlContent = generateHtml(page, scriptTags, linkTags);
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
  }

  console.log(`Successfully synced ${pages.length} static HTML files in dist/!`);
}

// Run immediately if executed directly
const isSync = process.argv.includes('--dist-only');
if (isSync) {
  syncDistStaticFiles();
} else {
  generatePublicStaticFiles();
  if (fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
    syncDistStaticFiles();
  }
}
