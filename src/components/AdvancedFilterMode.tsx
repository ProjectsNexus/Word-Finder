import { useState } from 'react';
import { AdvancedFilters } from '../types/solver';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface AdvancedFilterModeProps {
  wordLength: number;
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClear: () => void;
  defaultExpanded?: boolean;
}

export function AdvancedFilterMode({
  wordLength,
  filters,
  onFiltersChange,
  onClear,
  defaultExpanded = false
}: AdvancedFilterModeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hasActiveAdvanced = Boolean(
    filters.pattern.trim() || filters.contains.trim() || filters.excludes.trim()
  );

  const handlePatternChange = (val: string) => {
    // Only allow letters, underscores, dots, or spaces up to wordLength
    const sanitized = val.toUpperCase().slice(0, wordLength);
    onFiltersChange({ ...filters, pattern: sanitized });
  };

  const handleContainsChange = (val: string) => {
    const sanitized = val.toUpperCase().replace(/[^A-Z]/g, '');
    onFiltersChange({ ...filters, contains: sanitized });
  };

  const handleExcludesChange = (val: string) => {
    const sanitized = val.toUpperCase().replace(/[^A-Z]/g, '');
    onFiltersChange({ ...filters, excludes: sanitized });
  };

  return (
    <div className="w-full max-w-xl mx-auto border border-stone-200/80 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-stone-50/70 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-stone-600" />
          <span className="text-sm font-semibold text-stone-900">
            Advanced Pattern & Anagram Filters
          </span>
          {hasActiveAdvanced && (
            <span className="text-[11px] font-mono text-stone-600">
              (Active)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <span>{isExpanded ? 'Hide' : 'Show'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 pt-2 border-t border-stone-200/60 space-y-3.5 bg-stone-50/30">
          <p className="text-xs text-stone-500">
            Scrabble, Crossword, and Anagram solver controls. Works together with the tile clues above.
          </p>

          <div className="space-y-3">
            {/* 1. Known Position */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Known Positions (Pattern)
                </label>
                <span className="text-[11px] text-stone-600">
                  Use _ or . for blanks (e.g. {wordLength === 5 ? 'S__TE' : 'C__E'})
                </span>
              </div>
              <input
                type="text"
                value={filters.pattern}
                onChange={e => handlePatternChange(e.target.value)}
                placeholder={'_'.repeat(wordLength)}
                maxLength={wordLength}
                className="w-full px-3 py-2 text-sm font-mono tracking-widest bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 uppercase"
              />
            </div>

            {/* 2. Unknown Position (Contains) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Unknown Position (Must Contain)
                </label>
                <span className="text-[11px] text-stone-600">
                  Letters anywhere in word
                </span>
              </div>
              <input
                type="text"
                value={filters.contains}
                onChange={e => handleContainsChange(e.target.value)}
                placeholder="e.g. A E R"
                className="w-full px-3 py-2 text-sm font-mono tracking-wider bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 uppercase"
              />
            </div>

            {/* 3. Exclude */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Exclude Letters
                </label>
                <span className="text-[11px] text-stone-600">
                  Letters completely absent
                </span>
              </div>
              <input
                type="text"
                value={filters.excludes}
                onChange={e => handleExcludesChange(e.target.value)}
                placeholder="e.g. Q Z X J"
                className="w-full px-3 py-2 text-sm font-mono tracking-wider bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 uppercase"
              />
            </div>
          </div>

          {hasActiveAdvanced && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 py-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Advanced Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
