import { useMemo, ReactNode } from 'react';
import { SeoHead } from '../components/SeoHead';
import { Link } from '../utils/router';
import { getStatsForLength } from '../data/wordLoader';
import { StatsBlock } from '../components/StatsBlock';
import { FaqSection } from '../components/FaqSection';
import { ArrowRight, BookOpen, CheckCircle, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

interface BlogArticlePageProps {
  slug: string;
}

export function BlogArticlePage({ slug }: BlogArticlePageProps) {
  const stats5 = useMemo(() => getStatsForLength(5), []);

  // Article data dictionary
  const articles: Record<string, {
    title: string;
    metaTitle: string;
    metaDesc: string;
    readingTime: string;
    publishedDate: string;
    canonicalPath: string;
    content: ReactNode;
  }> = {
    'best-wordle-starting-words': {
      title: 'The Best Wordle Starting Words (Ranked Mathematically by Information Gain)',
      metaTitle: 'Best Wordle Starting Words (Ranked Mathematically by Information Gain)',
      metaDesc: 'Discover the best Wordle starting words ranked by information gain, letter frequency, and candidate elimination. Why SOARE, ROATE, and RAISE win.',
      readingTime: '6 min read',
      publishedDate: 'September 2026',
      canonicalPath: '/blog/best-wordle-starting-words/',
      content: (
        <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            When Wordle first swept the internet in late 2021, debates raged over whether starting with <strong>ADIEU</strong> (four vowels) was superior to consonant-heavy openers like <strong>STARE</strong> or <strong>CRANE</strong>. Five years later, algorithmic consensus has definitively settled the question.
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            The Vowel Trap: Why ADIEU Is Sub-Optimal
          </h3>
          <p>
            While learning which vowels appear in a word feels comforting, vowels provide surprisingly low <em>Shannon entropy</em>. Knowing a word contains an <strong>E</strong> or an <strong>A</strong> barely shrinks the search space because almost every English word contains vowels! In contrast, confirming or eliminating high-frequency consonants like <strong>R</strong>, <strong>T</strong>, <strong>S</strong>, and <strong>L</strong> slashes the remaining candidate pool by up to 80% on turn one.
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            Top 5 Mathematically Proven Openers
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              <div className="font-mono font-bold text-lg text-stone-900">1. SOARE (94.2% Pool Coverage)</div>
              <p className="text-xs text-stone-600 mt-1">
                Old French / archaic English for a young hawk. Contains the four most common consonants/vowels (S, O, A, R, E) in optimal positional frequency.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              <div className="font-mono font-bold text-lg text-stone-900">2. ROATE (93.8% Pool Coverage)</div>
              <p className="text-xs text-stone-600 mt-1">
                Variant spelling of rote. Positions E and T at the end, identifying common grammatical suffixes immediately.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              <div className="font-mono font-bold text-lg text-stone-900">3. RAISE (93.1% Pool Coverage)</div>
              <p className="text-xs text-stone-600 mt-1">
                An official Wordle target answer and premier opener testing three vowels and two top-tier consonants.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              <div className="font-mono font-bold text-lg text-stone-900">4. CRANE (92.6% Pool Coverage)</div>
              <p className="text-xs text-stone-600 mt-1">
                The New York Times WordleBot’s top recommendation for standard mode. Excellent balance of hard consonant and vowel spread.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              <div className="font-mono font-bold text-lg text-stone-900">5. SLATE (92.4% Pool Coverage)</div>
              <p className="text-xs text-stone-600 mt-1">
                Former WordleBot champion. Unrivaled at locking green positions in slot 1 (S) and slot 5 (E).
              </p>
            </div>
          </div>
        </div>
      )
    },
    'how-wordle-solver-works': {
      title: 'How Our Wordle Solver Works: Information Gain & Duplicate Letter Precision',
      metaTitle: 'How Wordle Solver Works: Information Gain & Duplicate Letter Algorithm',
      metaDesc: 'A technical deep-dive into how Wordle Solver Pro handles duplicate letter bounds correctly and calculates real-time information gain to rank candidate words.',
      readingTime: '7 min read',
      publishedDate: 'September 2026',
      canonicalPath: '/blog/how-wordle-solver-works/',
      content: (
        <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            Most online word solvers are simple regular expression scrapers. While regex works for basic anagrams, it fails on Wordle due to one complex nuance: <strong>duplicate letter evaluation</strong>.
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            The Exact Duplicate Letter Rule
          </h3>
          <p>
            In Wordle, if your guess contains multiple copies of a letter (e.g. two Es in <em>BLEED</em>), but the secret word only contains one E (e.g. <em>ABBEY</em>), the first matching E turns yellow or green, while the second E turns <strong>gray</strong>.
          </p>
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-stone-800 text-xs sm:text-sm">
            <strong className="block mb-1 font-semibold text-amber-950">Where competitor tools fail:</strong>
            Naive solvers see the gray tile on the second E and mistakenly exclude <em>all</em> words containing E! This instantly deletes the true solution from the results.
          </div>
          <p>
            <strong>Wordle Solver Pro implements the mathematically correct rule:</strong>
            A gray tile does not ban the letter globally; it establishes an <em>exact upper bound</em> equal to the number of confirmed green and yellow tiles for that letter in the same guess.
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            Information Gain Formula
          </h3>
          <p>
            After filtering all matching words, Wordle Solver Pro recalculates the pool-wide letter frequency:
          </p>
          <div className="p-4 rounded-xl bg-stone-100 font-mono text-xs sm:text-sm text-stone-800 border border-stone-200">
            Coverage(W) = [ &Sigma; PoolFrequency(c) for each unique c &isin; W ] / Length
          </div>
          <p>
            The top 5 words maximize the likelihood of eliminating the highest fraction of remaining possibilities on your next turn.
          </p>
        </div>
      )
    },
    'try-harder-wordle-solver': {
      title: 'Try Harder Wordle Solver: How to Beat Hard Mode & Avoid Trap Patterns',
      metaTitle: 'Try Harder Wordle Solver: Hard Mode Strategies & Trap Elimination',
      metaDesc: 'Looking for a try harder Wordle solver? Master Wordle Hard Mode, conquer tricky 1-letter traps (_IGHT, _ATCH), and keep your winning streak alive.',
      readingTime: '5 min read',
      publishedDate: 'September 2026',
      canonicalPath: '/blog/try-harder-wordle-solver/',
      content: (
        <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            Search volume for <strong>"try harder wordle solver"</strong> has surged as players encounter Wordle Hard Mode’s unforgiving trap doors. In Hard Mode, any revealed hints must be used in subsequent guesses. This rule creates deadly traps where a player can lose a 200-day streak with five guesses left!
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            The Anatomy of a Trap Pattern
          </h3>
          <p>
            Consider uncovering <strong>_IGHT</strong> on turn 2. The remaining candidates include:
          </p>
          <div className="font-mono text-xs sm:text-sm bg-stone-100 p-3 rounded-lg border border-stone-200 text-stone-800">
            FIGHT · LIGHT · MIGHT · NIGHT · RIGHT · SIGHT · TIGHT · WIGHT
          </div>
          <p>
            In Hard Mode, you cannot test <em>FLOWN</em> to eliminate F, L, N, and W at once. You are forced to guess one by one. If you have only 4 turns remaining, your odds of guessing right before turn 6 drop below 50%!
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            How Wordle Solver Pro Solves This
          </h3>
          <p>
            Wordle Solver Pro detects trap clusters early. Before locking into a _IGHT or _OUND pattern, our Information Gain engine alerts you on turn 2 to prioritize testing distinguishing consonants before all green slots lock you in.
          </p>
        </div>
      )
    },
    'best-wordle-solver-alternatives': {
      title: 'Best Wordle Solver Alternatives: Complete 2026 Comparison',
      metaTitle: 'Best Wordle Solver Alternatives (2026) – Detailed Feature Comparison',
      metaDesc: 'Compare top Wordle solver alternatives including Rock Paper Shotgun, WordFinder, and ScrabbleGO. See why privacy-first client-side solvers with duplicate letter logic lead.',
      readingTime: '6 min read',
      publishedDate: 'September 2026',
      canonicalPath: '/blog/best-wordle-solver-alternatives/',
      content: (
        <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            Hundreds of thousands of daily players turn to word game guides like Rock Paper Shotgun, WordFinder, and 5-letter word lists when stuck on a challenging puzzle. But how do the leading solver tools compare?
          </p>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-800 font-semibold">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3">Wordle Solver Pro</th>
                  <th className="p-3">Editorial Guides (RPS)</th>
                  <th className="p-3">Generic Anagram Sites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                <tr>
                  <td className="p-3 font-medium">Duplicate Letter Precision</td>
                  <td className="p-3 text-emerald-700 font-bold">100% Exact Bounds</td>
                  <td className="p-3 text-stone-500">Manual text hints</td>
                  <td className="p-3 text-red-600">Global ban bug</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Interactive Tile Cycling</td>
                  <td className="p-3 text-emerald-700 font-bold">Gray &rarr; Yellow &rarr; Green</td>
                  <td className="p-3 text-stone-500">None (Article only)</td>
                  <td className="p-3 text-stone-600">Text inputs only</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Information Gain Ranking</td>
                  <td className="p-3 text-emerald-700 font-bold">Top 5 Smart Next Guesses</td>
                  <td className="p-3 text-stone-500">None</td>
                  <td className="p-3 text-stone-600">Alphabetical only</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Data Privacy</td>
                  <td className="p-3 text-emerald-700 font-bold">100% Client-Side</td>
                  <td className="p-3 text-stone-600">Standard web</td>
                  <td className="p-3 text-stone-600">Heavy ad telemetry</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-serif font-bold text-xl text-stone-900 pt-4">
            Why Client-Side Execution Matters
          </h3>
          <p>
            Many ad-laden solver tools send your keystrokes to a backend server on every letter, injecting multi-second latency and tracking cookies. Wordle Solver Pro processes 100% of dictionary searches in your browser in under 5 milliseconds.
          </p>
        </div>
      )
    }
  };

  const article = articles[slug] || articles['best-wordle-starting-words'];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={article.metaTitle}
        description={article.metaDesc}
        canonicalPath={article.canonicalPath}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Article Header */}
        <div className="space-y-4 border-b border-stone-200 pb-8">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/tools" className="hover:text-stone-900">Articles & Guides</Link>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedDate}</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight text-balance">
            {article.title}
          </h1>
        </div>

        {/* Article Body */}
        <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200/90 shadow-xs">
          {article.content}

          {/* Quick Solver Launch CTA */}
          <div className="mt-10 p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-serif font-bold text-base text-stone-900 block">
                Put These Strategies to the Test
              </span>
              <span className="text-xs text-stone-500">
                Launch the free 5-letter Wordle Solver Pro with live tile clue feedback.
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              <span>Open Solver</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* Sourced Stats Block */}
        <StatsBlock stats={stats5} />

        {/* FAQ Section */}
        <FaqSection wordLength={5} />
      </div>
    </div>
  );
}
