import React, { useRef, useEffect } from 'react';
import { GuessRow, TileColor } from '../types/solver';
import { getNextTileColor } from '../utils/solverLogic';
import { Plus, RotateCcw, Trash2, HelpCircle } from 'lucide-react';

interface TileClueGridProps {
  wordLength: number;
  guesses: GuessRow[];
  activeRowIdx: number;
  activeColIdx: number;
  onGuessesChange: (guesses: GuessRow[]) => void;
  onActiveCellChange: (row: number, col: number) => void;
  onReset: () => void;
}

export function TileClueGrid({
  wordLength,
  guesses,
  activeRowIdx,
  activeColIdx,
  onGuessesChange,
  onActiveCellChange,
  onReset
}: TileClueGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Cycle color of tile at (rowIdx, colIdx)
  const handleTileClick = (rowIdx: number, colIdx: number) => {
    const row = guesses[rowIdx];
    if (!row || !row.clues[colIdx] || !row.clues[colIdx].letter) return;

    const currentClue = row.clues[colIdx];
    const nextColor = getNextTileColor(currentClue.color);

    const newGuesses = [...guesses];
    const newClues = [...row.clues];
    newClues[colIdx] = {
      ...currentClue,
      color: nextColor
    };
    newGuesses[rowIdx] = {
      ...row,
      clues: newClues
    };

    onGuessesChange(newGuesses);
    onActiveCellChange(rowIdx, colIdx);
  };

  // Add new guess row
  const handleAddRow = () => {
    if (guesses.length >= 6) return;
    const newRow: GuessRow = {
      id: Math.random().toString(36).substring(2, 9),
      word: '',
      clues: Array.from({ length: wordLength }, () => ({ letter: '', color: 'gray' as TileColor }))
    };
    onGuessesChange([...guesses, newRow]);
    onActiveCellChange(guesses.length, 0);
  };

  // Delete row
  const handleDeleteRow = (rowIdx: number) => {
    if (guesses.length <= 1) {
      // Clear instead of removing last row
      const clearedRow: GuessRow = {
        id: Math.random().toString(36).substring(2, 9),
        word: '',
        clues: Array.from({ length: wordLength }, () => ({ letter: '', color: 'gray' as TileColor }))
      };
      onGuessesChange([clearedRow]);
      onActiveCellChange(0, 0);
      return;
    }
    const newGuesses = guesses.filter((_, idx) => idx !== rowIdx);
    onGuessesChange(newGuesses);
    onActiveCellChange(Math.max(0, rowIdx - 1), 0);
  };

  // Global keyboard listener for direct typing when grid is in view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not capture if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key >= 'a' && e.key <= 'z' || e.key >= 'A' && e.key <= 'Z') {
        e.preventDefault();
        const letter = e.key.toUpperCase();
        const row = guesses[activeRowIdx];
        if (!row) return;

        const newClues = [...row.clues];
        const newWordArr = row.word.split('');

        newClues[activeColIdx] = {
          letter,
          color: newClues[activeColIdx]?.color || 'gray'
        };
        newWordArr[activeColIdx] = letter;

        const updatedRow: GuessRow = {
          ...row,
          word: newWordArr.join(''),
          clues: newClues
        };

        const newGuesses = [...guesses];
        newGuesses[activeRowIdx] = updatedRow;
        onGuessesChange(newGuesses);

        // Move to next cell if not at end
        if (activeColIdx < wordLength - 1) {
          onActiveCellChange(activeRowIdx, activeColIdx + 1);
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        const row = guesses[activeRowIdx];
        if (!row) return;

        const newClues = [...row.clues];
        const newWordArr = row.word.split('');

        // If current cell has letter, delete it; else move left and delete
        let targetCol = activeColIdx;
        if (!newClues[targetCol]?.letter && targetCol > 0) {
          targetCol = targetCol - 1;
        }

        newClues[targetCol] = { letter: '', color: 'gray' };
        newWordArr[targetCol] = '';

        const updatedRow: GuessRow = {
          ...row,
          word: newWordArr.join(''),
          clues: newClues
        };

        const newGuesses = [...guesses];
        newGuesses[activeRowIdx] = updatedRow;
        onGuessesChange(newGuesses);
        onActiveCellChange(activeRowIdx, targetCol);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const row = guesses[activeRowIdx];
        if (row && row.word.length === wordLength && activeRowIdx < 5) {
          if (activeRowIdx === guesses.length - 1) {
            handleAddRow();
          } else {
            onActiveCellChange(activeRowIdx + 1, 0);
          }
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        // Spacebar cycles color of active tile
        e.preventDefault();
        handleTileClick(activeRowIdx, activeColIdx);
      } else if (e.key === 'ArrowLeft' && activeColIdx > 0) {
        e.preventDefault();
        onActiveCellChange(activeRowIdx, activeColIdx - 1);
      } else if (e.key === 'ArrowRight' && activeColIdx < wordLength - 1) {
        e.preventDefault();
        onActiveCellChange(activeRowIdx, activeColIdx + 1);
      } else if (e.key === 'ArrowUp' && activeRowIdx > 0) {
        e.preventDefault();
        onActiveCellChange(activeRowIdx - 1, activeColIdx);
      } else if (e.key === 'ArrowDown' && activeRowIdx < guesses.length - 1) {
        e.preventDefault();
        onActiveCellChange(activeRowIdx + 1, activeColIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guesses, activeRowIdx, activeColIdx, wordLength]);

  const getColorClasses = (color: TileColor, hasLetter: boolean) => {
    if (!hasLetter) {
      return 'bg-white text-stone-900 border-2 border-stone-200 hover:border-stone-300';
    }
    switch (color) {
      case 'green':
        return 'bg-[#538d4e] text-white border-2 border-[#538d4e] shadow-sm';
      case 'yellow':
        return 'bg-[#b59f3b] text-white border-2 border-[#b59f3b] shadow-sm';
      case 'gray':
      default:
        return 'bg-[#787c7e] text-white border-2 border-[#787c7e] shadow-sm';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto" ref={containerRef}>
      {/* Tile Legend / Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1 text-xs text-stone-600">
        <div className="flex items-center gap-1.5 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
          <span>Tap any letter tile to cycle its clue status:</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#787c7e] inline-block" />
            <span className="text-stone-700">Gray (Absent/Capped)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#b59f3b] inline-block" />
            <span className="text-stone-700">Yellow (Wrong spot)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#538d4e] inline-block" />
            <span className="text-stone-700">Green (Exact)</span>
          </span>
        </div>
      </div>

      {/* Rows Container */}
      <div className="space-y-2 bg-[#F2EFE9]/70 p-3 sm:p-5 rounded-2xl border border-stone-300/80 shadow-xs">
        {guesses.map((row, rowIdx) => {
          const isRowActive = rowIdx === activeRowIdx;
          return (
            <div key={row.id || rowIdx} className="flex items-center gap-2 justify-center">
              <span className="text-[11px] font-mono text-stone-600 w-4 text-right">
                {rowIdx + 1}
              </span>

              {/* Tiles in row */}
              <div className="flex gap-1.5 sm:gap-2 justify-center">
                {Array.from({ length: wordLength }).map((_, colIdx) => {
                  const clue = row.clues[colIdx] || { letter: '', color: 'gray' as TileColor };
                  const isCellFocused = isRowActive && colIdx === activeColIdx;
                  const hasLetter = Boolean(clue.letter);

                  return (
                    <button
                      key={colIdx}
                      type="button"
                      onClick={() => {
                        onActiveCellChange(rowIdx, colIdx);
                        if (hasLetter) {
                          handleTileClick(rowIdx, colIdx);
                        }
                      }}
                      className={`
                        w-11 h-12 sm:w-14 sm:h-14 font-sans font-bold text-xl sm:text-2xl 
                        rounded-lg flex items-center justify-center select-none 
                        cursor-pointer transition-transform duration-100 active:scale-95
                        ${getColorClasses(clue.color, hasLetter)}
                        ${isCellFocused ? 'ring-2 ring-stone-900 ring-offset-2' : ''}
                      `}
                      aria-label={`Row ${rowIdx + 1}, Letter ${colIdx + 1}: ${clue.letter || 'Empty'}, Status: ${clue.color}. Click to cycle color.`}
                    >
                      {clue.letter}
                    </button>
                  );
                })}
              </div>

              {/* Row action: remove or clear */}
              <button
                type="button"
                onClick={() => handleDeleteRow(rowIdx)}
                title="Clear or remove row"
                className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-stone-200/60 rounded-md transition-colors"
                aria-label={`Delete row ${rowIdx + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Bottom controls */}
        <div className="pt-2 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={guesses.length >= 6}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Next Guess ({guesses.length}/6)</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200/60 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Board</span>
          </button>
        </div>
      </div>
    </div>
  );
}
