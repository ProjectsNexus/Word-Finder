import { useState, useMemo, useEffect } from 'react';
import { GuessRow, TileColor, AdvancedFilters } from '../types/solver';
import { getWordList, getStatsForLength } from '../data/wordLoader';
import { filterCandidates } from '../utils/solverLogic';
import { generateWordStats } from '../utils/generateWordStats';
import { TileClueGrid } from '../components/TileClueGrid';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { AdvancedFilterMode } from '../components/AdvancedFilterMode';
import { CandidateResults } from '../components/CandidateResults';
import { StatsBlock } from '../components/StatsBlock';
import { FaqSection } from '../components/FaqSection';
import { SeoHead } from '../components/SeoHead';
import { Link } from '../utils/router';
import { ShieldCheck, Sparkles, BookOpen, BarChart3, Layers } from 'lucide-react';

interface SolverPageProps {
  wordLength: number;
  routePath: string;
  customTitle?: string;
  customH1?: string;
  customSubtitle?: string;
}

export function SolverPage({
  wordLength,
  routePath,
  customTitle,
  customH1,
  customSubtitle
}: SolverPageProps) {
  // Load precomputed word list and stats
  const wordList = useMemo(() => getWordList(wordLength), [wordLength]);
  const stats = useMemo(() => getStatsForLength(wordLength), [wordLength]);

  // Initial single row
  const createEmptyRow = (length: number): GuessRow => ({
    id: Math.random().toString(36).substring(2, 9),
    word: '',
    clues: Array.from({ length }, () => ({ letter: '', color: 'gray' as TileColor }))
  });

  const [guesses, setGuesses] = useState<GuessRow[]>([createEmptyRow(wordLength)]);
  const [activeRowIdx, setActiveRowIdx] = useState(0);
  const [activeColIdx, setActiveColIdx] = useState(0);

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    pattern: '',
    contains: '',
    excludes: ''
  });

  // When wordLength prop changes (navigating between board lengths), reset state
  useEffect(() => {
    setGuesses([createEmptyRow(wordLength)]);
    setActiveRowIdx(0);
    setActiveColIdx(0);
    setAdvancedFilters({ pattern: '', contains: '', excludes: '' });
  }, [wordLength]);

  // Filter candidates dynamically
  const candidates = useMemo(() => {
    return filterCandidates(wordList, wordLength, guesses, advancedFilters);
  }, [wordList, wordLength, guesses, advancedFilters]);

  // Dynamically calculate word stats for current candidate word list using generateWordStats
  const dynamicWordStats = useMemo(() => {
    const currentWords = candidates.map(c => c.word);
    return generateWordStats(currentWords, wordLength);
  }, [candidates, wordLength]);

  // Check if clues have filtered down the pool
  const isFiltered = candidates.length > 0 && candidates.length < wordList.length;

  // Reset handler
  const handleReset = () => {
    setGuesses([createEmptyRow(wordLength)]);
    setActiveRowIdx(0);
    setActiveColIdx(0);
    setAdvancedFilters({ pattern: '', contains: '', excludes: '' });
  };

  // Keyboard button click handler
  const handleKeyPress = (key: string) => {
    const row = guesses[activeRowIdx];
    if (!row) return;

    if (key === 'ENTER') {
      if (row.word.length === wordLength && activeRowIdx < 5) {
        if (activeRowIdx === guesses.length - 1) {
          // Add new row
          const newRow = createEmptyRow(wordLength);
          setGuesses([...guesses, newRow]);
          setActiveRowIdx(guesses.length);
          setActiveColIdx(0);
        } else {
          setActiveRowIdx(activeRowIdx + 1);
          setActiveColIdx(0);
        }
      }
      return;
    }

    if (key === 'BACKSPACE') {
      const newClues = [...row.clues];
      const newWordArr = row.word.split('');

      let targetCol = activeColIdx;
      if (!newClues[targetCol]?.letter && targetCol > 0) {
        targetCol = targetCol - 1;
      }

      newClues[targetCol] = { letter: '', color: 'gray' };
      newWordArr[targetCol] = '';

      const updatedRow = {
        ...row,
        word: newWordArr.join(''),
        clues: newClues
      };

      const newGuesses = [...guesses];
      newGuesses[activeRowIdx] = updatedRow;
      setGuesses(newGuesses);
      setActiveColIdx(targetCol);
      return;
    }

    // Letter key A-Z
    if (/^[A-Z]$/.test(key)) {
      const newClues = [...row.clues];
      const newWordArr = row.word.split('');

      newClues[activeColIdx] = {
        letter: key,
        color: newClues[activeColIdx]?.color || 'gray'
      };
      newWordArr[activeColIdx] = key;

      const updatedRow = {
        ...row,
        word: newWordArr.join(''),
        clues: newClues
      };

      const newGuesses = [...guesses];
      newGuesses[activeRowIdx] = updatedRow;
      setGuesses(newGuesses);

      if (activeColIdx < wordLength - 1) {
        setActiveColIdx(activeColIdx + 1);
      }
    }
  };

  // Insert a candidate or starter word into current active row
  const handleSelectWord = (word: string) => {
    const upper = word.toUpperCase().slice(0, wordLength);
    const row = guesses[activeRowIdx];
    if (!row) return;

    const newClues = upper.split('').map((char, idx) => ({
      letter: char,
      color: row.clues[idx]?.color || 'gray'
    }));

    const updatedRow = {
      ...row,
      word: upper,
      clues: newClues
    };

    const newGuesses = [...guesses];
    newGuesses[activeRowIdx] = updatedRow;
    setGuesses(newGuesses);
  };

  // Compute SEO titles matching volume keywords
  const pageTitle = customTitle || (
    wordLength === 5
      ? `Wordle Solver & Wordle Solver Pro – Filter ${stats.totalWords.toLocaleString()} Words`
      : wordLength === 7
      ? `7 Letter Wordle Solver: Filter ${stats.totalWords.toLocaleString()} Words`
      : wordLength === 6
      ? `Wordle Solver 6 Letters: Filter ${stats.totalWords.toLocaleString()} Words`
      : `${wordLength}-Letter Wordle Solver: Filter ${stats.totalWords.toLocaleString()} Words`
  );

  const h1Title = customH1 || (
    wordLength === 5
      ? 'Wordle Solver & Wordle Solver Pro'
      : wordLength === 7
      ? '7-Letter Wordle Solver'
      : wordLength === 6
      ? '6-Letter Wordle Solver'
      : `${wordLength}-Letter Wordle Solver`
  );

  const metaDesc = (
    wordLength === 5
      ? `Solve Wordle fast with our intelligent 5-letter Wordle Solver Pro. Filter ${stats.totalWords.toLocaleString()} words using tile clues, duplicate letter handling, and smart next guesses.`
      : `Fast, intelligent ${wordLength}-letter Wordle solver. Filter ${stats.totalWords.toLocaleString()} words with exact tile clues, anagram constraints, and information gain scoring.`
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={pageTitle}
        description={metaDesc}
        canonicalPath={routePath}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight text-balance">
            {h1Title}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
            {customSubtitle || `Type your guess, click any tile to toggle its clue color (gray, yellow, green), and instantly filter ${stats.totalWords.toLocaleString()} candidate words.`}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-mono text-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero server tracking · In-browser solver</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-700">
              {stats.totalWords.toLocaleString()} Words
            </span>
          </div>
        </div>

        {/* Board Length Pills / Quick Switcher */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {[3, 4, 5, 6, 7, 8].map(len => {
            const targetPath = len === 5 ? '/' : `/wordle-solver-${len}-letter/`;
            const isCurrent = len === wordLength;
            return (
              <Link
                key={len}
                href={targetPath}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-stone-900 text-white font-semibold shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {len}-Letter {len === 5 ? '(Classic)' : ''}
              </Link>
            );
          })}
        </div>

        {/* Primary Interactive Tile Clue Grid */}
        <div className="space-y-4">
          <TileClueGrid
            wordLength={wordLength}
            guesses={guesses}
            activeRowIdx={activeRowIdx}
            activeColIdx={activeColIdx}
            onGuessesChange={setGuesses}
            onActiveCellChange={(r, c) => {
              setActiveRowIdx(r);
              setActiveColIdx(c);
            }}
            onReset={handleReset}
          />

          {/* Virtual On-Screen QWERTY Keyboard */}
          <VirtualKeyboard
            guesses={guesses}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Secondary Collapsible Advanced Filter Mode */}
        <AdvancedFilterMode
          wordLength={wordLength}
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
          onClear={() => setAdvancedFilters({ pattern: '', contains: '', excludes: '' })}
        />

        {/* Candidate Pool & Smart Next Guesses */}
        <CandidateResults
          candidates={candidates}
          totalDictionaryWords={wordList.length}
          wordLength={wordLength}
          onSelectWord={handleSelectWord}
        />

        {/* Dynamic Word Stats Dashboard for Active Filtered List */}
        {isFiltered && dynamicWordStats.totalWords > 0 && (
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Dynamic Stats for Remaining {dynamicWordStats.totalWords.toLocaleString()} Candidates
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">
                  Calculated Live via generateWordStats
                </span>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                {((dynamicWordStats.totalWords / wordList.length) * 100).toFixed(1)}% of base dictionary left
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Duplicate Letter Percentage in Current Filtered Pool */}
              <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-150 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-stone-600 block">Candidate Duplicate Letters</span>
                  <span className="font-serif font-bold text-xl text-stone-900 tabular-nums">
                    {dynamicWordStats.repeatedPercent}%
                  </span>
                </div>
                <div className="text-right text-[11px] text-stone-500 font-mono">
                  <span>{Math.round((dynamicWordStats.repeatedPercent / 100) * dynamicWordStats.totalWords)} of {dynamicWordStats.totalWords} words</span>
                  <span className="block text-stone-400 text-[10px]">contain repeated letters</span>
                </div>
              </div>

              {/* Dominant Letter in Current Pool */}
              <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-150 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-stone-600 block">Most Common Letter</span>
                  <span className="font-mono font-bold text-xl text-stone-900">
                    {dynamicWordStats.letterFrequency[0]?.letter || '—'}
                  </span>
                </div>
                <div className="text-right text-[11px] text-stone-500 font-mono">
                  <span>{dynamicWordStats.letterFrequency[0]?.wordCoveragePercent || 0}% presence</span>
                  <span className="block text-stone-400 text-[10px]">in remaining pool</span>
                </div>
              </div>

              {/* Top 5 Letters to Test Next */}
              <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-150">
                <span className="text-[11px] font-medium text-stone-600 block mb-1">Top Letters to Test</span>
                <div className="flex gap-1.5 flex-wrap">
                  {dynamicWordStats.letterFrequency.slice(0, 5).map(item => (
                    <span
                      key={item.letter}
                      className="px-2 py-0.5 rounded bg-white border border-stone-200 text-xs font-mono font-bold text-stone-900"
                      title={`${item.letter}: ${item.wordCoveragePercent}% presence`}
                    >
                      {item.letter} <span className="text-[10px] font-normal text-stone-500">{item.wordCoveragePercent}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Computed Linguistic Statistics Block */}
        <StatsBlock
          stats={stats}
          candidateStats={dynamicWordStats}
          isFiltered={isFiltered}
          onSelectWord={handleSelectWord}
        />

        {/* FAQ Section marked up with FAQPage Schema */}
        <FaqSection
          wordLength={wordLength}
        />
      </div>
    </div>
  );
}
