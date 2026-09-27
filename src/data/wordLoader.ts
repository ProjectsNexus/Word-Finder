import { LengthStats, WordlePastAnswer } from '../types/solver';

import words3 from './words-3.json';
import words4 from './words-4.json';
import words5 from './words-5.json';
import words6 from './words-6.json';
import words7 from './words-7.json';
import words8 from './words-8.json';

import stats3 from './stats-3.json';
import stats4 from './stats-4.json';
import stats5 from './stats-5.json';
import stats6 from './stats-6.json';
import stats7 from './stats-7.json';
import stats8 from './stats-8.json';

import pastAnswersData from './past-answers.json';
import todayData from './today-puzzle.json';

const wordLists: Record<number, string[]> = {
  3: words3 as string[],
  4: words4 as string[],
  5: words5 as string[],
  6: words6 as string[],
  7: words7 as string[],
  8: words8 as string[],
};

const statsLists: Record<number, LengthStats> = {
  3: stats3 as unknown as LengthStats,
  4: stats4 as unknown as LengthStats,
  5: stats5 as unknown as LengthStats,
  6: stats6 as unknown as LengthStats,
  7: stats7 as unknown as LengthStats,
  8: stats8 as unknown as LengthStats,
};

export function getWordList(length: number): string[] {
  return wordLists[length] || wordLists[5];
}

export function getStatsForLength(length: number): LengthStats {
  return statsLists[length] || statsLists[5];
}

export function getAllStats(): Record<number, LengthStats> {
  return statsLists;
}

export function getPastAnswers(): WordlePastAnswer[] {
  return pastAnswersData as unknown as WordlePastAnswer[];
}

export function getTodayAnswer(): WordlePastAnswer {
  return todayData as unknown as WordlePastAnswer;
}
