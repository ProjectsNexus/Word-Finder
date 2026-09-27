import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { getPastAnswers, getTodayAnswer, getStatsForLength } from '../data/wordLoader';
import { WordlePastAnswer } from '../types/solver';
import { StatsBlock } from '../components/StatsBlock';
import { FaqSection } from '../components/FaqSection';
import { Link } from '../utils/router';
import { Search, Eye, EyeOff, Calendar, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export function WordleArchivePage() {
  const allAnswers = useMemo(() => getPastAnswers(), []);
  const todayPuzzle = useMemo(() => getTodayAnswer(), []);
  const stats = useMemo(() => getStatsForLength(5), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'Easy' | 'Moderate' | 'Hard'>('all');
  const [onlyRepeats, setOnlyRepeats] = useState(false);
  const [revealToday, setRevealToday] = useState(false);
  const [displayCount, setDisplayCount] = useState(50);

  const filtered = useMemo(() => {
    return allAnswers.filter(item => {
      if (filterDifficulty !== 'all' && item.difficulty !== filterDifficulty) return false;
      if (onlyRepeats && !item.hasRepeats) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        const matchWord = item.word.toLowerCase().includes(term);
        const matchNum = item.number.toString().includes(term);
        const matchDate = item.date.includes(term);
        if (!matchWord && !matchNum && !matchDate) return false;
      }

      return true;
    });
  }, [allAnswers, filterDifficulty, onlyRepeats, searchTerm]);

  const displayedList = filtered.slice(0, displayCount);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Every Wordle Answer Ever (Updated Daily) – Complete Past Solutions Archive"
        description="Search every official Wordle answer ever released from puzzle #0 to today. Check past Wordle solutions, letter patterns, difficulty ratings, and today's Wordle answer."
        canonicalPath="/blog/every-wordle-answer-ever/"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight text-balance">
            Every Wordle Answer Ever
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
            The definitive, daily-updated archive of all official New York Times Wordle solutions. Search by puzzle number, date, or past word.
          </p>
          <div className="text-xs text-stone-500 font-mono">
            Updated Daily · Archive includes {allAnswers.length.toLocaleString()}+ Past Wordles
          </div>
        </div>

        {/* Today's Wordle Card with Spoiler Shield */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-stone-600" />
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Today's Wordle (#{todayPuzzle.number}) · {todayPuzzle.date}
                </span>
              </div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                Wordle Solution for Today
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Spoiler Warning: Click below to reveal today's official 5-letter solution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRevealToday(!revealToday)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
              >
                {revealToday ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{revealToday ? 'Hide Answer' : 'Reveal Today’s Answer'}</span>
              </button>
            </div>
          </div>

          {/* Reveal Box */}
          {revealToday ? (
            <div className="mt-5 p-4 rounded-xl bg-white border border-stone-200 animate-in fade-in flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 block">Today's Word:</span>
                <span className="font-mono font-bold text-3xl tracking-widest text-stone-950">
                  {todayPuzzle.word}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-600 font-mono">
                <div>
                  <span className="text-stone-400 block text-[10px]">VOWELS</span>
                  <span className="font-bold">{todayPuzzle.vowelCount}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">REPEATS</span>
                  <span className="font-bold">{todayPuzzle.hasRepeats ? 'Yes' : 'None'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">DIFFICULTY</span>
                  <span className="font-bold">{todayPuzzle.difficulty}</span>
                </div>
              </div>

              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-800 hover:bg-stone-100"
              >
                Test in Solver
              </Link>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-lg bg-stone-100/80 border border-stone-200/60 text-xs text-stone-500 text-center">
              Today's Wordle hint: Contains {todayPuzzle.vowelCount} vowel{todayPuzzle.vowelCount === 1 ? '' : 's'}{todayPuzzle.hasRepeats ? ' and at least one duplicate letter.' : ' with all unique letters.'}
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by word (e.g. CRANE), puzzle number (#120), or date (2024-05)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Filter pills / buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'Easy', 'Moderate', 'Hard'] as const).map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filterDifficulty === diff
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {diff === 'all' ? 'All Difficulties' : diff}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setOnlyRepeats(!onlyRepeats)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  onlyRepeats
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Duplicate Letters Only
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-medium">
                  <th className="py-2.5 px-3"># No.</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Answer</th>
                  <th className="py-2.5 px-3">Vowels</th>
                  <th className="py-2.5 px-3">Letters</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displayedList.map(item => (
                  <tr key={item.number} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-stone-500">#{item.number}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{item.date}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-sm tracking-wider text-stone-900">
                      {item.word}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{item.vowelCount}</td>
                    <td className="py-2.5 px-3 text-stone-600">
                      {item.hasRepeats ? 'Repeats' : '5 Unique'}
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      <span className={`inline-block text-[11px] ${
                        item.difficulty === 'Easy' ? 'text-emerald-700 font-semibold' :
                        item.difficulty === 'Hard' ? 'text-red-700 font-semibold' :
                        'text-stone-700 font-semibold'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > displayCount && (
            <div className="text-center pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDisplayCount(prev => prev + 50)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              >
                Load More Past Answers (+50 of {filtered.length - displayCount} left)
              </button>
            </div>
          )}
        </div>

        {/* In-depth Editorial Content for SEO */}
        <article className="prose prose-stone max-w-none bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            Historical Wordle Trends & Linguistic Insights
          </h2>
          <p>
            The official Wordle dictionary originally curated by Josh Wardle contained 2,309 hand-selected five-letter solutions designed to be familiar everyday English words, avoiding obscure jargon and offensive slang. Since The New York Times acquired the game, editorial changes have occasionally adjusted answer order and removed archaic terms.
          </p>
          <p>
            Our historical analysis of past answers reveals that approximately 28% of all official Wordle answers contain at least one repeated letter (such as <em>ABBEY</em>, <em>ROBOT</em>, <em>SPEED</em>, and <em>LEVEL</em>). This single statistic explains why novice players struggle with Wordle: human intuition resists guessing repeated letters until forced, even though nearly one out of every three solutions requires them.
          </p>
        </article>

        {/* Stats & FAQ */}
        <StatsBlock stats={stats} />
        <FaqSection wordLength={5} />
      </div>
    </div>
  );
}
