import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { getWordList, getStatsForLength } from '../data/wordLoader';
import { filterCandidates } from '../utils/solverLogic';
import { CandidateWord } from '../types/solver';
import { StatsBlock } from '../components/StatsBlock';
import { FaqSection } from '../components/FaqSection';
import { Search, SlidersHorizontal, ArrowUpDown, Copy, Check, Hash, Sparkles } from 'lucide-react';

const SCRABBLE_POINTS: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

export function WordFinderPage() {
  const [selectedLength, setSelectedLength] = useState<number>(5);
  const [pattern, setPattern] = useState<string>('');
  const [rackLetters, setRackLetters] = useState<string>('');
  const [excludes, setExcludes] = useState<string>('');
  const [sortBy, setSortBy] = useState<'points' | 'score' | 'alpha'>('points');
  const [copied, setCopied] = useState(false);
  const [displayCount, setDisplayCount] = useState(60);

  const wordList = useMemo(() => getWordList(selectedLength), [selectedLength]);
  const stats = useMemo(() => getStatsForLength(selectedLength), [selectedLength]);

  // Compute Scrabble points for a word
  const getPoints = (word: string) => {
    let pts = 0;
    for (const char of word.toUpperCase()) {
      pts += SCRABBLE_POINTS[char] || 0;
    }
    return pts;
  };

  // Filter candidates using advanced logic
  const filteredCandidates = useMemo(() => {
    const rawMatches = filterCandidates(wordList, selectedLength, [], {
      pattern,
      contains: rackLetters,
      excludes
    });

    return rawMatches.map(c => ({
      ...c,
      points: getPoints(c.word)
    }));
  }, [wordList, selectedLength, pattern, rackLetters, excludes]);

  // Sort
  const sorted = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      if (sortBy === 'points') return (b.points || 0) - (a.points || 0);
      if (sortBy === 'score') return b.score - a.score;
      return a.word.localeCompare(b.word);
    });
  }, [filteredCandidates, sortBy]);

  const displayedList = sorted.slice(0, displayCount);

  const handleCopy = () => {
    navigator.clipboard.writeText(sorted.map(s => s.word).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={`Word Finder & Scrabble Anagram Solver – Filter ${stats.totalWords.toLocaleString()} Words`}
        description="Search dictionary words by pattern (_A__E), anagram letters, and exclusions. Calculate Scrabble points and optimal tile placement instantly."
        canonicalPath="/word-finder/"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight text-balance">
            Word Finder & Anagram Solver
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
            Find high-scoring Scrabble words, crossword fits, and anagram solutions. Filter by exact slot patterns, letter pools, and point values.
          </p>
        </div>

        {/* Word Length Selector */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-stone-500 mr-1">Length:</span>
          {[3, 4, 5, 6, 7, 8].map(len => (
            <button
              key={len}
              type="button"
              onClick={() => {
                setSelectedLength(len);
                setPattern('');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedLength === len
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {len} Letters
            </button>
          ))}
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                Pattern & Rack Search ({selectedLength}-Letter Words)
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              {stats.totalWords.toLocaleString()} available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Pattern */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Known Pattern
              </label>
              <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value.toUpperCase().slice(0, selectedLength))}
                placeholder={`${'_'.repeat(selectedLength)} (e.g. ${selectedLength === 5 ? 'S__TE' : 'C__E'})`}
                className="w-full px-3 py-2 text-sm font-mono tracking-widest bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 uppercase"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Use _ or . for blanks
              </span>
            </div>

            {/* 2. Contains / Rack */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Letters Present (Rack)
              </label>
              <input
                type="text"
                value={rackLetters}
                onChange={e => setRackLetters(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                placeholder="e.g. A E R T"
                className="w-full px-3 py-2 text-sm font-mono tracking-wider bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 uppercase"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Must contain these letters
              </span>
            </div>

            {/* 3. Excludes */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Exclude Letters
              </label>
              <input
                type="text"
                value={excludes}
                onChange={e => setExcludes(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                placeholder="e.g. Q Z X"
                className="w-full px-3 py-2 text-sm font-mono tracking-wider bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 uppercase"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Exclude absent characters
              </span>
            </div>
          </div>

          {(pattern || rackLetters || excludes) && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setPattern('');
                  setRackLetters('');
                  setExcludes('');
                }}
                className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Box */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Matching Words
                </h3>
                <span className="text-xs font-mono text-stone-500 tabular-nums">
                  ({sorted.length.toLocaleString()} matches)
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Sorted by Scrabble point value.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={sorted.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'points' ? 'score' : sortBy === 'score' ? 'alpha' : 'points')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {sortBy === 'points' ? 'Highest Points' : sortBy === 'score' ? 'Information Gain' : 'A to Z'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {displayedList.map(item => (
              <div
                key={item.word}
                className="p-3 rounded-xl border border-stone-150 bg-stone-50/50 hover:bg-white transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-base text-stone-900 tracking-wider block">
                    {item.word}
                  </span>
                  <span className="text-[10px] text-stone-600 font-mono">
                    {item.uniqueLetters} unique letters
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-stone-900 tabular-nums block">
                    {item.points} pts
                  </span>
                  <span className="text-[10px] text-stone-600 font-mono tabular-nums">
                    {item.score}% info
                  </span>
                </div>
              </div>
            ))}
          </div>

          {sorted.length > displayCount && (
            <div className="text-center pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDisplayCount(prev => prev + 60)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              >
                Show More Words (+60 of {sorted.length - displayCount} left)
              </button>
            </div>
          )}
        </div>

        {/* Stats & FAQ */}
        <StatsBlock stats={stats} />
        <FaqSection wordLength={selectedLength} />
      </div>
    </div>
  );
}
