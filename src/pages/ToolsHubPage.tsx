import { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { Link } from '../utils/router';
import { getAllStats } from '../data/wordLoader';
import { Sparkles, Grid, Sliders, BookOpen, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

export function ToolsHubPage() {
  const allStats = getAllStats();
  const [filterType, setFilterType] = useState<'all' | 'wordle' | 'pattern' | 'guides'>('all');

  const tools = [
    {
      title: '5-Letter Wordle Solver (Pro)',
      href: '/',
      category: 'wordle',
      length: '5 Letters',
      wordCount: allStats[5]?.totalWords.toLocaleString() || '14,855',
      description: 'The standard solver for daily Wordle, Quordle, and Octordle with full duplicate-letter precision and information gain scoring.'
    },
    {
      title: 'Wordle Solver Game (Interactive)',
      href: '/wordle-solver-game/',
      category: 'wordle',
      length: '5 Letters',
      wordCount: 'Full Target Lexicon',
      description: 'Play unlimited Wordle rounds with a real-time mathematical solver assistant revealing remaining candidates after each turn.'
    },
    {
      title: '7-Letter Wordle Solver',
      href: '/wordle-solver-7-letter/',
      category: 'wordle',
      length: '7 Letters',
      wordCount: allStats[7]?.totalWords.toLocaleString() || '24,029',
      description: 'Engineered for 7-letter word games and Scrabble bingos. Filter over 24,000 words with exact position and exclusion constraints.'
    },
    {
      title: '6-Letter Wordle Solver',
      href: '/wordle-solver-6-letter/',
      category: 'wordle',
      length: '6 Letters',
      wordCount: allStats[6]?.totalWords.toLocaleString() || '15,788',
      description: 'Designed for Hurdle, Sedecordle 6-letter modes, and hex-letter vocabulary games with precomputed frequency distribution.'
    },
    {
      title: '4-Letter Wordle Solver',
      href: '/wordle-solver-4-letter/',
      category: 'wordle',
      length: '4 Letters',
      wordCount: allStats[4]?.totalWords.toLocaleString() || '4,030',
      description: 'Fast solver for 4-letter mini-wordles, Boggle grids, and rapid word ladders.'
    },
    {
      title: '3-Letter Word Solver',
      href: '/wordle-solver-3-letter/',
      category: 'wordle',
      length: '3 Letters',
      wordCount: allStats[3]?.totalWords.toLocaleString() || '1,015',
      description: 'Instant 3-letter word finder for Scrabble hooks, crosswords, and anagram roots.'
    },
    {
      title: '8-Letter Wordle Solver',
      href: '/wordle-solver-8-letter/',
      category: 'wordle',
      length: '8 Letters',
      wordCount: allStats[8]?.totalWords.toLocaleString() || '29,766',
      description: 'Powerful long-word solver indexing nearly 30,000 eight-letter English words for advanced puzzle enthusiasts.'
    },
    {
      title: 'Advanced Word Finder & Anagram Solver',
      href: '/word-finder/',
      category: 'pattern',
      length: 'Any Length',
      wordCount: '89,500+ Words',
      description: 'Scrabble and Crossword pattern search. Enter slot wildcards (_A__E), letters present, and excluded characters.'
    },
    {
      title: 'Every Wordle Answer Ever (Archive)',
      href: '/blog/every-wordle-answer-ever/',
      category: 'guides',
      length: 'Archive',
      wordCount: '1,900+ Solutions',
      description: 'Searchable, filterable chronological database of past Wordle solutions from puzzle #0 to present day.'
    },
    {
      title: 'Best Wordle Starting Words (Ranked)',
      href: '/blog/best-wordle-starting-words/',
      category: 'guides',
      length: 'Guide',
      wordCount: 'Coverage Analysis',
      description: 'Comprehensive analysis of mathematically optimal opening words based on vowel-to-consonant ratios and entropy.'
    },
    {
      title: 'How Wordle Solver Works',
      href: '/blog/how-wordle-solver-works/',
      category: 'guides',
      length: 'Guide',
      wordCount: 'Algorithm Breakdown',
      description: 'The mathematics of Information Gain, letter presence frequency, and handling duplicate letters correctly.'
    },
    {
      title: 'Try Harder Wordle Solver Guide',
      href: '/blog/try-harder-wordle-solver/',
      category: 'guides',
      length: 'Guide',
      wordCount: 'Hard Mode Tactics',
      description: 'Proven strategies for surviving Wordle Hard Mode trap patterns like _IGHT, _ATCH, and _OUND without losing streaks.'
    }
  ];

  const filteredTools = tools.filter(t => {
    if (filterType === 'all') return true;
    return t.category === filterType;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Wordle Solver Tools & Free Word Game Solvers Directory"
        description="Comprehensive directory of free Wordle solver tools for 3, 4, 5, 6, 7, and 8-letter boards. Filter words, analyze letter entropy, and solve any word puzzle."
        canonicalPath="/tools/"
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Hub Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight text-balance">
            Wordle Solver Tools Directory
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
            Choose your board length or puzzle style below. Every tool runs 100% in-browser with zero tracking, precomputed lexicons, and duplicate-letter precision.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-mono text-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Forever · Client-Side Execution</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-700">89,584 Indexed Words</span>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Tools ({tools.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('wordle')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'wordle' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Board Solvers (3–8 Letters)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('pattern')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'pattern' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pattern & Anagram
            </button>
            <button
              type="button"
              onClick={() => setFilterType('guides')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'guides' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Archives & Guides
            </button>
          </div>
        </div>

        {/* Grid of Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-mono text-stone-600">{tool.length}</span>
                  <span className="font-mono text-stone-600">{tool.wordCount}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-stone-700 transition-colors mb-2">
                  {tool.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-900 group-hover:text-stone-600">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Five-Letter Words Quick Browse Section */}
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                5-Letter Words Directory by Letter
              </h3>
              <p className="text-xs text-stone-500">
                Browse our indexed vocabulary by starting letter or containing letter.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">A to Z Index</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-stone-800 block mb-2">Starting With:</span>
            <div className="flex flex-wrap gap-1.5">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                <Link
                  key={char}
                  href={`/five-letter-words/starting-with/${char.toLowerCase()}/`}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:border-stone-900 flex items-center justify-center font-mono font-bold text-xs text-stone-900 transition-colors"
                >
                  {char}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-stone-800 block mb-2">Containing Letter:</span>
            <div className="flex flex-wrap gap-1.5">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                <Link
                  key={char}
                  href={`/five-letter-words/containing/${char.toLowerCase()}/`}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:border-stone-900 flex items-center justify-center font-mono font-bold text-xs text-stone-900 transition-colors"
                >
                  {char}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
