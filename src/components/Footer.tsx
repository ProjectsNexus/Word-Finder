import { Link } from '../utils/router';
import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200/80 bg-white/70 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Privacy Statement */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 font-serif font-bold text-lg text-stone-900 group">
              <Logo size={28} className="transition-transform group-hover:scale-105" />
              <span>Wordle Solver Pro</span>
            </Link>
            <p className="text-stone-500 leading-relaxed text-xs">
              Fast, privacy-first word solver and linguistic helper with mathematically verified duplicate-letter handling and maximum information gain.
            </p>
            <div className="inline-flex items-center gap-1.5 text-stone-700 bg-stone-100/80 px-2.5 py-1 rounded-md text-[11px] font-medium border border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Side · Zero Data Stored</span>
            </div>
          </div>

          {/* Column 1: Board Solvers */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-stone-900 text-sm">
              Board Solvers
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-stone-900 transition-colors">
                  5-Letter Wordle Solver (Home)
                </Link>
              </li>
              <li>
                <Link href="/wordle-solver-game" className="hover:text-stone-900 transition-colors">
                  Interactive Wordle Game Mode
                </Link>
              </li>
              <li>
                <Link href="/wordle-solver-7-letter" className="hover:text-stone-900 transition-colors">
                  7-Letter Wordle Solver
                </Link>
              </li>
              <li>
                <Link href="/wordle-solver-6-letter" className="hover:text-stone-900 transition-colors">
                  6-Letter Wordle Solver
                </Link>
              </li>
              <li>
                <Link href="/wordle-solver-4-letter" className="hover:text-stone-900 transition-colors">
                  4-Letter Wordle Solver
                </Link>
              </li>
              <li>
                <Link href="/wordle-solver-3-letter" className="hover:text-stone-900 transition-colors">
                  3-Letter Solver
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Word Lists & Browse */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-stone-900 text-sm">
              Word Lists & Tools
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/word-finder" className="hover:text-stone-900 transition-colors">
                  Anagram & Scrabble Word Finder
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-stone-900 transition-colors">
                  All Wordle Solver Tools Hub
                </Link>
              </li>
              <li>
                <Link href="/five-letter-words/starting-with/s" className="hover:text-stone-900 transition-colors">
                  5-Letter Words Starting With S
                </Link>
              </li>
              <li>
                <Link href="/five-letter-words/starting-with/c" className="hover:text-stone-900 transition-colors">
                  5-Letter Words Starting With C
                </Link>
              </li>
              <li>
                <Link href="/five-letter-words/containing/e" className="hover:text-stone-900 transition-colors">
                  5-Letter Words Containing E
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-stone-900 transition-colors font-medium">
                  Sitemap & Keyword Index (67 URLs)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Strategy & Guides */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-stone-900 text-sm">
              Strategy & Guides
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/blog/every-wordle-answer-ever" className="hover:text-stone-900 transition-colors">
                  Every Wordle Answer Ever Archive
                </Link>
              </li>
              <li>
                <Link href="/blog/best-wordle-starting-words" className="hover:text-stone-900 transition-colors">
                  Best Wordle Starting Words (Ranked)
                </Link>
              </li>
              <li>
                <Link href="/blog/how-wordle-solver-works" className="hover:text-stone-900 transition-colors">
                  How Our Solver Algorithm Works
                </Link>
              </li>
              <li>
                <Link href="/blog/try-harder-wordle-solver" className="hover:text-stone-900 transition-colors">
                  Try Harder Wordle Solver Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/best-wordle-solver-alternatives" className="hover:text-stone-900 transition-colors">
                  Wordle Solver Alternatives Review
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span>&copy; {new Date().getFullYear()} Wordle Solver Pro</span>
            <span aria-hidden="true">·</span>
            <Link href="/sitemap" className="hover:text-stone-900 underline">HTML Sitemap</Link>
            <span aria-hidden="true">·</span>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-stone-900 underline font-mono">sitemap.xml</a>
            <span aria-hidden="true">·</span>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-stone-900 underline font-mono">robots.txt</a>
          </div>

          <div className="flex items-center gap-3">
            <span>Your clues stay in this browser, nothing is sent or saved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
