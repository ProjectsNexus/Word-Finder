import { Delete, CornerDownLeft } from 'lucide-react';
import { GuessRow, TileColor } from '../types/solver';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: GuessRow[];
}

export function VirtualKeyboard({ onKeyPress, guesses }: VirtualKeyboardProps) {
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  // Determine keyboard key states from all clues
  const keyStatus: Record<string, TileColor> = {};
  for (const row of guesses) {
    for (const clue of row.clues) {
      if (!clue.letter) continue;
      const char = clue.letter.toUpperCase();
      const current = keyStatus[char];

      // Green takes precedence over yellow, yellow over gray
      if (clue.color === 'green') {
        keyStatus[char] = 'green';
      } else if (clue.color === 'yellow' && current !== 'green') {
        keyStatus[char] = 'yellow';
      } else if (clue.color === 'gray' && !current) {
        keyStatus[char] = 'gray';
      }
    }
  }

  const getKeyClasses = (char: string) => {
    const status = keyStatus[char];
    if (status === 'green') {
      return 'bg-[#538d4e] text-white hover:bg-[#467742]';
    }
    if (status === 'yellow') {
      return 'bg-[#b59f3b] text-white hover:bg-[#9c8932]';
    }
    if (status === 'gray') {
      return 'bg-[#787c7e] text-white hover:bg-[#686b6d]';
    }
    return 'bg-stone-200/90 text-stone-800 hover:bg-stone-300';
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-1.5 pt-2 select-none">
      {/* Row 1 */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        {row1.map(char => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className={`
              h-11 sm:h-12 flex-1 max-w-[42px] font-sans font-bold text-sm sm:text-base 
              rounded-md flex items-center justify-center transition-colors active:scale-95 shadow-xs
              ${getKeyClasses(char)}
            `}
            aria-label={`Key ${char}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 sm:gap-1.5 px-3">
        {row2.map(char => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className={`
              h-11 sm:h-12 flex-1 max-w-[42px] font-sans font-bold text-sm sm:text-base 
              rounded-md flex items-center justify-center transition-colors active:scale-95 shadow-xs
              ${getKeyClasses(char)}
            `}
            aria-label={`Key ${char}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() => onKeyPress('ENTER')}
          className="h-11 sm:h-12 px-2.5 sm:px-3 font-sans font-semibold text-xs sm:text-sm rounded-md bg-stone-300 text-stone-800 hover:bg-stone-400/80 flex items-center justify-center transition-colors active:scale-95 shadow-xs whitespace-nowrap"
          aria-label="Enter"
        >
          <span className="hidden sm:inline mr-1">ENTER</span>
          <CornerDownLeft className="w-4 h-4" />
        </button>

        {row3.map(char => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className={`
              h-11 sm:h-12 flex-1 max-w-[42px] font-sans font-bold text-sm sm:text-base 
              rounded-md flex items-center justify-center transition-colors active:scale-95 shadow-xs
              ${getKeyClasses(char)}
            `}
            aria-label={`Key ${char}`}
          >
            {char}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onKeyPress('BACKSPACE')}
          className="h-11 sm:h-12 px-2.5 sm:px-3 font-sans font-semibold text-xs sm:text-sm rounded-md bg-stone-300 text-stone-800 hover:bg-stone-400/80 flex items-center justify-center transition-colors active:scale-95 shadow-xs"
          aria-label="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
