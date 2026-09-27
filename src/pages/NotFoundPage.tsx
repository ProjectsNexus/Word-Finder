import { SeoHead } from '../components/SeoHead';
import { Link } from '../utils/router';
import { Compass, Home, Search, Layers, Grid, ArrowRight } from 'lucide-react';

export function NotFoundPage({ attemptedPath }: { attemptedPath: string }) {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Page Not Found (404) – Wordle Solver Pro"
        description="The requested Wordle Solver page could not be found. Browse our available 3 to 8-letter solvers, word finder tools, and Wordle strategy guides."
        canonicalPath="/404"
      />

      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200">
          <Compass className="w-8 h-8 text-amber-800" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold">
            Error 404
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
            Page Not Found
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            The URL <code className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-stone-900 text-xs font-semibold">{attemptedPath}</code> does not exist or has moved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 text-left shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-stone-900">
            Popular Wordle Tools & Solvers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/"
              className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-stone-900 block group-hover:text-stone-700">5-Letter Wordle Solver</span>
                <span className="text-[11px] text-stone-500">Official daily Wordle solver</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/wordle-solver-game/"
              className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-stone-900 block group-hover:text-stone-700">Play Wordle Game</span>
                <span className="text-[11px] text-stone-500">With live AI assistant</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/tools/"
              className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-stone-900 block group-hover:text-stone-700">All Solver Tools</span>
                <span className="text-[11px] text-stone-500">3, 4, 6, 7, 8 letters</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/word-finder/"
              className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-stone-900 block group-hover:text-stone-700">Word Finder & Anagrams</span>
                <span className="text-[11px] text-stone-500">Pattern search & Scrabble</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/blog/every-wordle-answer-ever/"
              className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-stone-900 block group-hover:text-stone-700">Every Wordle Answer</span>
                <span className="text-[11px] text-stone-500">Complete historical archive</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/sitemap/"
              className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-stone-900 block group-hover:text-stone-700">Complete Sitemap</span>
                <span className="text-[11px] text-stone-500">All 67 indexed pages</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
            </Link>
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Wordle Solver Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
