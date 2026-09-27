import { useState } from 'react';
import { LengthStats } from '../types/solver';
import { BarChart3, TrendingUp, Hash, Layers, Sparkles, Sliders } from 'lucide-react';

interface StatsBlockProps {
  stats: LengthStats;
  candidateStats?: LengthStats;
  isFiltered?: boolean;
  onSelectWord?: (word: string) => void;
}

export function StatsBlock({
  stats,
  candidateStats,
  isFiltered = false,
  onSelectWord
}: StatsBlockProps) {
  // Mode: 'candidates' (dynamic current remaining word list) or 'dictionary' (full base word list)
  const [viewScope, setViewScope] = useState<'candidates' | 'dictionary'>(
    isFiltered && candidateStats && candidateStats.totalWords > 0 ? 'candidates' : 'dictionary'
  );

  const [activeTab, setActiveTab] = useState<'frequency' | 'openings' | 'endings' | 'vowels'>('frequency');

  // Choose active stats object based on viewScope
  const activeStats = (viewScope === 'candidates' && candidateStats && candidateStats.totalWords > 0)
    ? candidateStats
    : stats;

  const topOpenings = activeStats.topOpenings || [];
  const topEndings = activeStats.topEndings || [];
  const vowelSpread = activeStats.vowelSpread || [];
  const letterFreq = activeStats.letterFrequency || [];
  const bestStarters = activeStats.bestStartingWords || [];

  const hasCandidateScope = Boolean(candidateStats && candidateStats.totalWords > 0 && candidateStats.totalWords !== stats.totalWords);

  return (
    <section className="w-full max-w-4xl mx-auto space-y-6 pt-6">
      {/* Header with Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              Linguistic Analytics & Letter Distribution
            </h2>
            {viewScope === 'candidates' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-amber-700" />
                Live Dynamic
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {viewScope === 'candidates'
              ? `Computed dynamically for the ${activeStats.totalWords.toLocaleString()} currently remaining candidate words.`
              : `Computed across all ${stats.totalWords.toLocaleString()} words in the ${stats.length}-letter dictionary.`}
          </p>
        </div>

        {/* Dynamic scope switcher */}
        {hasCandidateScope && (
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewScope('candidates')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewScope === 'candidates'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Current Candidates ({candidateStats?.totalWords.toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => setViewScope('dictionary')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewScope === 'dictionary'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Full Dictionary ({stats.totalWords.toLocaleString()})
            </button>
          </div>
        )}
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
            <Hash className="w-3.5 h-3.5" />
            <span>Words Analyzed</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {activeStats.totalWords.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-600 mt-0.5">
            {viewScope === 'candidates' ? 'Active matching pool' : `${activeStats.length}-letter lexicon`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Duplicate Letters</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {activeStats.repeatedPercent}%
          </div>
          <div className="text-[11px] text-stone-600 mt-0.5">
            {Math.round((activeStats.repeatedPercent / 100) * activeStats.totalWords).toLocaleString()} words with &ge;1 repeat
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Top Letter</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 font-mono">
            {letterFreq[0]?.letter || '—'}
          </div>
          <div className="text-[11px] text-stone-600 mt-0.5 tabular-nums">
            {letterFreq[0]?.wordCoveragePercent || 0}% word presence
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
            <span>Top Suggestion</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 font-mono truncate">
            {bestStarters[0]?.word || '—'}
          </div>
          <div className="text-[11px] text-stone-600 mt-0.5 tabular-nums">
            {bestStarters[0]?.score || 0}% pool coverage
          </div>
        </div>
      </div>

      {/* Best Starting / Testing Words */}
      {bestStarters.length > 0 && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {viewScope === 'candidates'
                  ? `Optimal Testing Words for Current Candidates`
                  : `Optimal ${activeStats.length}-Letter Starting Words`}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ranked mathematically by unique letter frequency and maximum candidate pool elimination rate.
              </p>
            </div>
            <div className="text-xs text-stone-600 font-mono">
              Coverage Score (0–100)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {bestStarters.slice(0, 10).map((starter, index) => (
              <button
                key={starter.word}
                type="button"
                onClick={() => onSelectWord?.(starter.word)}
                className="p-2.5 rounded-lg border border-stone-200 hover:border-stone-900 bg-stone-50/50 hover:bg-white text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                  <span>#{index + 1}</span>
                  <span className="font-mono tabular-nums">{starter.score}%</span>
                </div>
                <div className="font-mono font-bold text-base text-stone-900 group-hover:text-stone-700 tracking-wider">
                  {starter.word}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Linguistic Analytics Tabs */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4 flex-wrap gap-2">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            {viewScope === 'candidates'
              ? `Current Word List Structure Analytics`
              : `${activeStats.length}-Letter Lexicon Structure Analytics`}
          </h3>

          {/* Segmented controls */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('frequency')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'frequency'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Letter Frequency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('openings')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'openings'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Top Openings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('endings')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'endings'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Top Endings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vowels')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'vowels'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Vowel Spread
            </button>
          </div>
        </div>

        {/* Tab 1: Letter Frequency Table */}
        {activeTab === 'frequency' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>
                Distribution across {activeStats.totalWords.toLocaleString()} analyzed words (sorted by % presence).
              </span>
              <span className="font-mono text-[11px] text-stone-600">
                A–Z Distribution
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {letterFreq.filter(item => item.count > 0).slice(0, 18).map((item, idx) => (
                <div
                  key={item.letter}
                  className="p-2.5 rounded-lg border border-stone-150 bg-stone-50/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-stone-600">#{idx + 1}</span>
                    <span className="font-mono font-bold text-base text-stone-900">
                      {item.letter}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                      {item.wordCoveragePercent}%
                    </div>
                    <div className="text-[10px] text-stone-600 tabular-nums">
                      {item.count.toLocaleString()} uses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Top 2-letter Openings */}
        {activeTab === 'openings' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Most frequent two-letter prefixes in this word list.
            </p>
            {topOpenings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {topOpenings.map((op, idx) => (
                  <div
                    key={op.pair}
                    className="p-3 rounded-lg border border-stone-150 bg-stone-50/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-stone-600 block">#{idx + 1} Prefix</span>
                      <span className="font-mono font-bold text-lg text-stone-900">{op.pair}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">{op.percent}%</span>
                      <span className="text-[10px] text-stone-600 block tabular-nums">{op.count} words</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-stone-400">No opening data available for this selection.</div>
            )}
          </div>
        )}

        {/* Tab 3: Top 2-letter Endings */}
        {activeTab === 'endings' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Most frequent two-letter suffixes in this word list.
            </p>
            {topEndings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {topEndings.map((ed, idx) => (
                  <div
                    key={ed.pair}
                    className="p-3 rounded-lg border border-stone-150 bg-stone-50/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-stone-600 block">#{idx + 1} Suffix</span>
                      <span className="font-mono font-bold text-lg text-stone-900">{ed.pair}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">{ed.percent}%</span>
                      <span className="text-[10px] text-stone-600 block tabular-nums">{ed.count} words</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-stone-400">No ending data available for this selection.</div>
            )}
          </div>
        )}

        {/* Tab 4: Vowel Spread */}
        {activeTab === 'vowels' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Vowel count distribution (A, E, I, O, U) per word across the analyzed word list.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {vowelSpread.map(v => (
                <div
                  key={v.vowels}
                  className="p-3 rounded-lg border border-stone-150 bg-stone-50/40 text-center"
                >
                  <span className="text-xs text-stone-500 block mb-1">
                    {v.vowels} Vowel{v.vowels === '1' ? '' : 's'}
                  </span>
                  <span className="font-serif font-bold text-xl text-stone-900 block tabular-nums">
                    {v.percent}%
                  </span>
                  <span className="text-[10px] text-stone-600 font-mono tabular-nums">
                    {v.count.toLocaleString()} words
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
