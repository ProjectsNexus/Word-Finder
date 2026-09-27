export type TileColor = 'gray' | 'yellow' | 'green';

export interface TileClue {
  letter: string;
  color: TileColor;
}

export interface GuessRow {
  id: string;
  word: string;
  clues: TileClue[];
}

export interface AdvancedFilters {
  pattern: string; // e.g. "S__E" or slots
  contains: string; // letters that must be in the word
  excludes: string; // letters that must not be in the word
}

export interface CandidateWord {
  word: string;
  score: number; // information gain %
  uniqueLetters: number;
}

export interface LengthStats {
  length: number;
  totalWords: number;
  repeatedPercent: number;
  topOpenings: Array<{ pair: string; count: number; percent: number }>;
  topEndings: Array<{ pair: string; count: number; percent: number }>;
  vowelSpread: Array<{ vowels: string; count: number; percent: number }>;
  letterFrequency: Array<{ letter: string; count: number; percent: number; wordCoveragePercent: number }>;
  bestStartingWords: Array<{ word: string; score: number; uniqueLetters: number }>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WordlePastAnswer {
  number: number;
  date: string;
  word: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  vowelCount: number;
  uniqueLetters: number;
  hasRepeats: boolean;
}
