import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { RouterProvider, useRouter } from './utils/router';
import { SolverPage } from './pages/SolverPage';
import { GameModePage } from './pages/GameModePage';
import { ToolsHubPage } from './pages/ToolsHubPage';
import { WordFinderPage } from './pages/WordFinderPage';
import { LetterBrowserPage } from './pages/LetterBrowserPage';
import { WordleArchivePage } from './pages/WordleArchivePage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { SitemapIndexPage } from './pages/SitemapIndexPage';

function AppContent() {
  const { pathname } = useRouter();

  // Normalize path (strip trailing slash if not root)
  const normPath = pathname.length > 1 && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;

  // 1. Homepage: 5-Letter Solver with primary keywords "wordle solver" & "wordle solver pro"
  if (normPath === '/' || normPath === '') {
    return (
      <SolverPage
        wordLength={5}
        routePath="/"
        customTitle="Wordle Solver & Wordle Solver Pro – Fast Word Game & Letter Clue Solver"
        customH1="Wordle Solver & Wordle Solver Pro"
        customSubtitle="Type your guess, click any tile to toggle its clue color (gray, yellow, green), and instantly filter 14,855 candidate words with exact duplicate letter handling."
      />
    );
  }

  // 2. Game-styled variant: "wordle solver game"
  if (normPath === '/wordle-solver-game') {
    return <GameModePage />;
  }

  // 3. Tools Hub: "wordle solver tools" / "wordle solver tool"
  if (normPath === '/tools') {
    return <ToolsHubPage />;
  }

  // 4. Word Finder / Anagram mode:
  if (normPath === '/word-finder') {
    return <WordFinderPage />;
  }

  // 5. Board length solvers:
  if (normPath === '/wordle-solver-3-letter') {
    return <SolverPage wordLength={3} routePath="/wordle-solver-3-letter/" />;
  }
  if (normPath === '/wordle-solver-4-letter') {
    return <SolverPage wordLength={4} routePath="/wordle-solver-4-letter/" />;
  }
  if (normPath === '/wordle-solver-5-letter') {
    return <SolverPage wordLength={5} routePath="/" />;
  }
  if (normPath === '/wordle-solver-6-letter') {
    return (
      <SolverPage
        wordLength={6}
        routePath="/wordle-solver-6-letter/"
        customTitle="Wordle Solver 6 Letters: Filter 15,788 Six-Letter Words"
        customH1="6-Letter Wordle Solver (Wordle Solver 6 Letters)"
      />
    );
  }
  if (normPath === '/wordle-solver-7-letter') {
    return (
      <SolverPage
        wordLength={7}
        routePath="/wordle-solver-7-letter/"
        customTitle="7 Letter Wordle Solver: Filter 24,029 Seven-Letter Words"
        customH1="7-Letter Wordle Solver (7 Letter Wordle Solver)"
      />
    );
  }
  if (normPath === '/wordle-solver-8-letter') {
    return <SolverPage wordLength={8} routePath="/wordle-solver-8-letter/" />;
  }

  // 6. Letter browser: /five-letter-words/starting-with/:letter
  const startingWithMatch = normPath.match(/^\/five-letter-words\/starting-with\/([a-z])$/i);
  if (startingWithMatch) {
    return <LetterBrowserPage mode="starting-with" letter={startingWithMatch[1]} />;
  }

  // 7. Letter browser: /five-letter-words/containing/:letter
  const containingMatch = normPath.match(/^\/five-letter-words\/containing\/([a-z])$/i);
  if (containingMatch) {
    return <LetterBrowserPage mode="containing" letter={containingMatch[1]} />;
  }

  // 8. Wordle Archive: /blog/every-wordle-answer-ever/
  if (normPath === '/blog/every-wordle-answer-ever') {
    return <WordleArchivePage />;
  }

  // 9. Sitemap & Google Index Directory
  if (normPath === '/sitemap' || normPath === '/seo-index') {
    return <SitemapIndexPage />;
  }

  // 10. Blog Strategy & Guides:
  if (normPath.startsWith('/blog/')) {
    const slug = normPath.replace('/blog/', '');
    return <BlogArticlePage slug={slug} />;
  }

  // Default fallback to 5-letter solver
  return <SolverPage wordLength={5} routePath="/" />;
}

export default function App() {
  return (
    <RouterProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F7F3] text-stone-900 font-sans selection:bg-amber-200">
        <Navigation />
        <main className="flex-1">
          <AppContent />
        </main>
        <Footer />
      </div>
    </RouterProvider>
  );
}
