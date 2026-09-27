import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { getWordList, getStatsForLength } from '../data/wordLoader';
import { Link } from '../utils/router';
import { StatsBlock } from '../components/StatsBlock';
import { FaqSection } from '../components/FaqSection';
import { Search, ArrowRight, Copy, Check } from 'lucide-react';

interface LetterBrowserPageProps {
  mode: 'starting-with' | 'containing';
  letter: string;
}

export function LetterBrowserPage({ mode, letter }: LetterBrowserPageProps) {
  const char = (letter || 's').toUpperCase();
  const wordList = useMemo(() => getWordList(5), []);
  const stats = useMemo(() => getStatsForLength(5), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [displayCount, setDisplayCount] = useState(80);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter 5-letter words
  const matchingWords = useMemo(() => {
    const charLower = char.toLowerCase();
    if (mode === 'starting-with') {
      return wordList.filter(w => w.startsWith(charLower)).map(w => w.toUpperCase());
    } else {
      return wordList.filter(w => w.includes(charLower)).map(w => w.toUpperCase());
    }
  }, [wordList, mode, char]);

  const searchFiltered = useMemo(() => {
    if (!searchTerm.trim()) return matchingWords;
    const term = searchTerm.trim().toUpperCase();
    return matchingWords.filter(w => w.includes(term));
  }, [matchingWords, searchTerm]);

  const displayedList = searchFiltered.slice(0, displayCount);

  const titleMode = mode === 'starting-with' ? 'Starting With' : 'Containing';
  const pageTitle = `5-Letter Words ${titleMode} ${char}: Filter ${matchingWords.length.toLocaleString()} Words`;
  const metaDesc = `Comprehensive list of all ${matchingWords.length.toLocaleString()} 5-letter English words ${titleMode.toLowerCase()} ${char}. Verified for Wordle, Scrabble, and word puzzles.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(matchingWords.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={pageTitle}
        description={metaDesc}
        canonicalPath={`/five-letter-words/${mode}/${char.toLowerCase()}/`}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight text-balance">
            5-Letter Words {titleMode} '{char}'
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
            Browse {matchingWords.length.toLocaleString()} five-letter words {titleMode.toLowerCase()} letter {char}. Sourced from the official open dictionary for Wordle, Scrabble, and anagram puzzles.
          </p>
        </div>

        {/* Letter A-Z Bar */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 text-center">
            Jump to Another Letter ({titleMode})
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {alphabet.map(c => {
              const isSelected = c === char;
              return (
                <Link
                  key={c}
                  href={`/five-letter-words/${mode}/${c.toLowerCase()}/`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-150 text-stone-700'
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Words Grid Container */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  {matchingWords.length.toLocaleString()} Words Found
                </h2>
                <span className="text-xs font-mono text-stone-500 tabular-nums">
                  ({((matchingWords.length / wordList.length) * 100).toFixed(1)}% of 5-letter vocabulary)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copied ? 'Copied' : 'Copy Words'}</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                <span>Launch Solver</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick search filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Filter through words ${titleMode.toLowerCase()} ${char}...`}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[460px] overflow-y-auto pr-1">
            {displayedList.map(w => (
              <div
                key={w}
                className="p-2.5 rounded-lg border border-stone-150 bg-stone-50/40 font-mono font-bold text-sm tracking-wider text-stone-900 text-center"
              >
                {w}
              </div>
            ))}
          </div>

          {searchFiltered.length > displayCount && (
            <div className="text-center pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDisplayCount(prev => prev + 100)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              >
                Show More Words (+100 of {searchFiltered.length - displayCount} left)
              </button>
            </div>
          )}
        </div>

        {/* Stats Block & FAQ */}
        <StatsBlock stats={stats} />
        <FaqSection wordLength={5} />
      </div>
    </div>
  );
}
