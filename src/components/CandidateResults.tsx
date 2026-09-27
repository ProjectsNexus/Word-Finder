import { useState } from 'react';
import { CandidateWord } from '../types/solver';
import { Sparkles, ArrowUpDown, Copy, Check, Search } from 'lucide-react';

interface CandidateResultsProps {
  candidates: CandidateWord[];
  totalDictionaryWords: number;
  wordLength: number;
  onSelectWord: (word: string) => void;
}

export function CandidateResults({
  candidates,
  totalDictionaryWords,
  wordLength,
  onSelectWord
}: CandidateResultsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'alpha'>('score');
  const [copied, setCopied] = useState(false);
  const [displayCount, setDisplayCount] = useState(60);

  // Top 5 "Smart Next Guesses" (highest information gain)
  const topGuesses = candidates.slice(0, 5);

  // Filter candidates by inner search term
  const filtered = candidates.filter(c =>
    c.word.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    }
    return a.word.localeCompare(b.word);
  });

  const displayedList = sorted.slice(0, displayCount);

  const handleCopyAll = () => {
    const text = candidates.map(c => c.word).join(', ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 1. Smart Next Guesses Section */}
      {candidates.length > 0 ? (
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                Top Smart Next Guesses
              </h3>
            </div>
            <div className="text-xs text-stone-500 tabular-nums">
              Ranked by Information Gain
            </div>
          </div>

          <p className="text-xs text-stone-600 mb-3.5 leading-relaxed">
            These 5 words test the highest percentage of remaining candidate letters, eliminating the largest fraction of possibilities on your next turn. Click any word to apply it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {topGuesses.map((item, idx) => (
              <button
                key={item.word}
                type="button"
                onClick={() => onSelectWord(item.word)}
                className="group p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-900 hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-stone-600">
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-stone-600">
                    {item.score}%
                  </span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-stone-900 group-hover:text-stone-700 tracking-wider">
                  {item.word}
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  {item.uniqueLetters} unique letters
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-2xl">
          <div className="font-serif text-lg font-bold text-stone-900 mb-1">
            No Words Found Matching These Clues
          </div>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Double check your tiles for conflicting clues (e.g. a letter marked gray in one spot that is required in another, or duplicate bounds that cannot be met).
          </p>
        </div>
      )}

      {/* 2. Candidate Words Header & Controls */}
      <div className="border border-stone-200/80 rounded-2xl bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Possible Candidate Words
              </h3>
              <span className="text-xs font-mono text-stone-500 tabular-nums">
                ({candidates.length.toLocaleString()} of {totalDictionaryWords.toLocaleString()} words)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Filtered from the {wordLength}-letter ENABLE/SCOWL open dictionary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={candidates.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy(sortBy === 'score' ? 'alpha' : 'score')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <span>{sortBy === 'score' ? 'Best Coverage' : 'A-Z'}</span>
            </button>
          </div>
        </div>

        {/* Filter input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Search within these ${candidates.length} candidates...`}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50/60 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1 max-h-[420px] overflow-y-auto pr-1">
          {displayedList.map(item => (
            <button
              key={item.word}
              type="button"
              onClick={() => onSelectWord(item.word)}
              className="group p-2 rounded-lg border border-stone-150 hover:border-stone-900 bg-stone-50/50 hover:bg-white transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <span className="font-mono font-bold text-sm tracking-wider text-stone-900 group-hover:text-stone-950">
                {item.word}
              </span>
              <span className="text-[11px] font-mono text-stone-600 tabular-nums">
                {item.score}%
              </span>
            </button>
          ))}
        </div>

        {/* Pagination / Load more */}
        {sorted.length > displayCount && (
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setDisplayCount(prev => prev + 80)}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              Show More Candidates (+80 of {sorted.length - displayCount} left)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
