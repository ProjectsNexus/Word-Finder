import { useState, useEffect, useMemo } from 'react';
import { getWordList, getTodayAnswer, getStatsForLength } from '../data/wordLoader';
import { filterCandidates } from '../utils/solverLogic';
import { CandidateWord, GuessRow, TileColor } from '../types/solver';
import { SeoHead } from '../components/SeoHead';
import { StatsBlock } from '../components/StatsBlock';
import { FaqSection } from '../components/FaqSection';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { Sparkles, Trophy, RotateCcw, Eye, Lightbulb, Volume2, VolumeX, HelpCircle } from 'lucide-react';

export function GameModePage() {
  const wordLength = 5;
  const wordList = useMemo(() => getWordList(5), []);
  const stats = useMemo(() => getStatsForLength(5), []);

  const [secretWord, setSecretWord] = useState<string>('');
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentCol, setCurrentCol] = useState<number>(0);
  const [boardGuesses, setBoardGuesses] = useState<GuessRow[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showSolverAssist, setShowSolverAssist] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Audio helper using Web Audio API
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.08) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext policy
    }
  };

  // Start new game
  const startNewGame = (customTarget?: string) => {
    let target = customTarget;
    if (!target) {
      const validTargets = wordList.filter(w => !['q','x','z'].some(c => w.includes(c)) && w.length === 5);
      target = validTargets[Math.floor(Math.random() * validTargets.length)].toUpperCase();
    }
    setSecretWord(target);

    // Initialize 6 empty rows
    const initialRows: GuessRow[] = Array.from({ length: 6 }, () => ({
      id: Math.random().toString(36).substring(2, 9),
      word: '',
      clues: Array.from({ length: 5 }, () => ({ letter: '', color: 'gray' as TileColor }))
    }));

    setBoardGuesses(initialRows);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus('playing');
    setMessage('');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Compute solver recommendations based on submitted rows
  const submittedRows = useMemo(() => {
    return boardGuesses.slice(0, currentRow);
  }, [boardGuesses, currentRow]);

  const candidates: CandidateWord[] = useMemo(() => {
    if (submittedRows.length === 0) return [];
    return filterCandidates(wordList, 5, submittedRows, { pattern: '', contains: '', excludes: '' });
  }, [wordList, submittedRows]);

  // Key press handler
  const handleKey = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      const row = boardGuesses[currentRow];
      if (row.word.length < 5) {
        setMessage('Not enough letters');
        setTimeout(() => setMessage(''), 2000);
        playBeep(220, 'sawtooth', 0.12);
        return;
      }

      // Check if valid word in dictionary
      const guessWordLower = row.word.toLowerCase();
      if (!wordList.includes(guessWordLower)) {
        setMessage('Not in word list');
        setTimeout(() => setMessage(''), 2000);
        playBeep(220, 'sawtooth', 0.12);
        return;
      }

      // Evaluate Wordle clues against secretWord
      const targetLetters = secretWord.split('');
      const guessLetters = row.word.split('');
      const newClues: { letter: string; color: TileColor }[] = Array.from({ length: 5 }, () => ({
        letter: '',
        color: 'gray'
      }));

      // Step 1: Mark Greens
      const remainingTarget: (string | null)[] = [...targetLetters];
      for (let i = 0; i < 5; i++) {
        newClues[i].letter = guessLetters[i];
        if (guessLetters[i] === targetLetters[i]) {
          newClues[i].color = 'green';
          remainingTarget[i] = null;
        }
      }

      // Step 2: Mark Yellows
      for (let i = 0; i < 5; i++) {
        if (newClues[i].color !== 'green') {
          const letter = guessLetters[i];
          const matchIdx = remainingTarget.indexOf(letter);
          if (matchIdx !== -1) {
            newClues[i].color = 'yellow';
            remainingTarget[matchIdx] = null;
          } else {
            newClues[i].color = 'gray';
          }
        }
      }

      const updatedRow = {
        ...row,
        clues: newClues
      };

      const newRows = [...boardGuesses];
      newRows[currentRow] = updatedRow;
      setBoardGuesses(newRows);

      // Play success chime
      if (row.word === secretWord) {
        setGameStatus('won');
        setMessage('Splendid! You solved the puzzle!');
        playBeep(587.33, 'sine', 0.15);
        setTimeout(() => playBeep(880, 'sine', 0.25), 150);
      } else if (currentRow >= 5) {
        setGameStatus('lost');
        setMessage(`Game Over. The secret word was ${secretWord}.`);
        playBeep(261.63, 'sine', 0.3);
      } else {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
        playBeep(440, 'sine', 0.08);
      }
      return;
    }

    if (key === 'BACKSPACE') {
      const row = boardGuesses[currentRow];
      if (currentCol > 0 || row.clues[currentCol]?.letter) {
        const targetCol = row.clues[currentCol]?.letter ? currentCol : currentCol - 1;
        const newClues = [...row.clues];
        const newWordArr = row.word.split('');
        newClues[targetCol] = { letter: '', color: 'gray' };
        newWordArr[targetCol] = '';

        const newRows = [...boardGuesses];
        newRows[currentRow] = {
          ...row,
          word: newWordArr.join(''),
          clues: newClues
        };
        setBoardGuesses(newRows);
        setCurrentCol(Math.max(0, targetCol));
        playBeep(330, 'triangle', 0.04);
      }
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      const row = boardGuesses[currentRow];
      if (row.word.length >= 5 && currentCol >= 5) return;

      const targetCol = Math.min(4, currentCol);
      const newClues = [...row.clues];
      const newWordArr = row.word.split('');

      newClues[targetCol] = { letter: key, color: 'gray' };
      newWordArr[targetCol] = key;

      const newRows = [...boardGuesses];
      newRows[currentRow] = {
        ...row,
        word: newWordArr.join(''),
        clues: newClues
      };
      setBoardGuesses(newRows);
      setCurrentCol(Math.min(5, targetCol + 1));
      playBeep(493.88, 'triangle', 0.03);
    }
  };

  // Keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Enter') handleKey('ENTER');
      else if (e.key === 'Backspace') handleKey('BACKSPACE');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Wordle Solver Game – Play Wordle with Live AI Information Gain Solver"
        description="Play Wordle online with an interactive real-time solver assistant. Test your guesses against mathematical information gain and view remaining candidate words."
        canonicalPath="/wordle-solver-game/"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight text-balance">
            Wordle Solver Game
          </h1>
          <p className="text-stone-600 text-sm max-w-xl mx-auto text-balance">
            Play standard Wordle with an optional real-time solver companion. Watch how the candidate pool shrinks with every letter clue.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1 text-xs text-stone-600">
            <button
              type="button"
              onClick={() => setShowSolverAssist(!showSolverAssist)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 font-medium transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showSolverAssist ? 'Hide Solver Assist' : 'Show Solver Assist'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 font-medium transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-stone-700" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
              <span>{soundEnabled ? 'Audio On' : 'Audio Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => startNewGame()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Word</span>
            </button>
          </div>
        </div>

        {/* Status Message Toast */}
        {message && (
          <div className="max-w-sm mx-auto p-2.5 bg-stone-900 text-stone-50 text-xs text-center rounded-lg shadow-lg font-medium animate-in fade-in">
            {message}
          </div>
        )}

        {/* Game Area + Live Solver Split */}
        <div className={`grid grid-cols-1 ${showSolverAssist ? 'lg:grid-cols-12 gap-8' : 'max-w-md mx-auto'} items-start`}>
          {/* Game Board */}
          <div className={showSolverAssist ? 'lg:col-span-7 space-y-4' : 'space-y-4'}>
            <div className="bg-[#F2EFE9]/70 p-4 sm:p-5 rounded-2xl border border-stone-300/80 shadow-xs max-w-sm mx-auto">
              <div className="space-y-2">
                {boardGuesses.map((row, rIdx) => {
                  const isCurrent = rIdx === currentRow;
                  const isEvaluated = rIdx < currentRow || gameStatus !== 'playing';

                  return (
                    <div key={rIdx} className="flex gap-2 justify-center">
                      {row.clues.map((clue, cIdx) => {
                        let bg = 'bg-white border-2 border-stone-200 text-stone-900';
                        if (isEvaluated && clue.letter) {
                          if (clue.color === 'green') bg = 'bg-[#538d4e] border-2 border-[#538d4e] text-white';
                          else if (clue.color === 'yellow') bg = 'bg-[#b59f3b] border-2 border-[#b59f3b] text-white';
                          else bg = 'bg-[#787c7e] border-2 border-[#787c7e] text-white';
                        } else if (clue.letter) {
                          bg = 'bg-white border-2 border-stone-800 text-stone-900 animate-in zoom-in-90 duration-75';
                        }

                        return (
                          <div
                            key={cIdx}
                            className={`w-12 h-12 sm:w-14 sm:h-14 font-sans font-bold text-xl sm:text-2xl rounded-lg flex items-center justify-center select-none transition-colors ${bg}`}
                          >
                            {clue.letter}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Virtual Keyboard */}
            <VirtualKeyboard
              guesses={submittedRows}
              onKeyPress={handleKey}
            />
          </div>

          {/* Live Solver Companion Panel */}
          {showSolverAssist && (
            <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Live Solver Analysis
                  </h3>
                </div>
                <div className="text-xs font-mono text-stone-500 tabular-nums">
                  Turn {currentRow + 1} of 6
                </div>
              </div>

              {submittedRows.length === 0 ? (
                <div className="text-xs text-stone-500 space-y-2 py-4 text-center">
                  <p>Make your first guess to begin real-time algorithmic analysis.</p>
                  <p className="text-stone-400">
                    Recommended starter: <strong className="text-stone-800">SOARE</strong> or <strong className="text-stone-800">ROATE</strong>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Candidates remaining */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-150 flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-700">Remaining Candidates:</span>
                    <span className="font-serif font-bold text-lg text-stone-900 font-mono tabular-nums">
                      {candidates.length.toLocaleString()}
                    </span>
                  </div>

                  {/* Top 5 Smart Next Guesses */}
                  <div>
                    <div className="text-xs font-semibold text-stone-900 mb-2 flex items-center justify-between">
                      <span>Top 5 Smart Next Guesses:</span>
                      <span className="text-[10px] text-stone-600 font-mono">Info Gain %</span>
                    </div>

                    <div className="space-y-1.5">
                      {candidates.slice(0, 5).map((cand, idx) => (
                        <div
                          key={cand.word}
                          className="px-3 py-2 rounded-lg border border-stone-150 bg-stone-50/50 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-stone-600 font-mono text-[11px]">#{idx + 1}</span>
                            <span className="font-mono font-bold text-sm tracking-wider text-stone-900">{cand.word}</span>
                          </div>
                          <span className="font-mono text-stone-600 tabular-nums">{cand.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Candidates list */}
                  <div>
                    <div className="text-xs font-semibold text-stone-900 mb-2">
                      Matching Words ({candidates.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 text-xs font-mono">
                      {candidates.slice(0, 30).map(c => (
                        <span key={c.word} className="px-2 py-1 bg-stone-100 rounded text-stone-800">
                          {c.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats & FAQ */}
        <StatsBlock stats={stats} />
        <FaqSection wordLength={5} />
      </div>
    </div>
  );
}
