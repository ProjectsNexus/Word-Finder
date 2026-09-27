import { LengthStats } from '../types/solver';

/**
 * generateWordStats utility
 * Calculates dynamic letter frequency, duplicate letter percentage,
 * vowel spread, common openings/endings, and best candidate coverage
 * for any given word list.
 */
export function generateWordStats(words: string[], targetLength?: number): LengthStats {
  const cleanWords = words
    .map(w => w.trim().toUpperCase())
    .filter(w => /^[A-Z]+$/.test(w));

  const totalWords = cleanWords.length;
  const wordLength = targetLength || (cleanWords[0] ? cleanWords[0].length : 5);

  if (totalWords === 0) {
    return {
      length: wordLength,
      totalWords: 0,
      repeatedPercent: 0,
      topOpenings: [],
      topEndings: [],
      vowelSpread: [
        { vowels: '0', count: 0, percent: 0 },
        { vowels: '1', count: 0, percent: 0 },
        { vowels: '2', count: 0, percent: 0 },
        { vowels: '3', count: 0, percent: 0 },
        { vowels: '4+', count: 0, percent: 0 }
      ],
      letterFrequency: [],
      bestStartingWords: []
    };
  }

  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);

  // 1. Letter frequency count across all letter slots
  const letterCounts: Record<string, number> = {};
  // Word presence count (how many distinct words contain this letter at least once)
  const letterWordPresence: Record<string, number> = {};

  for (let c = 65; c <= 90; c++) {
    const ch = String.fromCharCode(c);
    letterCounts[ch] = 0;
    letterWordPresence[ch] = 0;
  }

  let totalLetterPositions = 0;
  let repeatedLetterWordsCount = 0;

  // Openings and Endings
  const openings: Record<string, number> = {};
  const endings: Record<string, number> = {};

  // Vowel distribution
  const vowelCounts: Record<string, number> = { '0': 0, '1': 0, '2': 0, '3': 0, '4+': 0 };

  for (let wIdx = 0; wIdx < totalWords; wIdx++) {
    const word = cleanWords[wIdx];
    const len = word.length;
    const uniqueCharsInWord = new Set<string>();
    let vCount = 0;

    for (let i = 0; i < len; i++) {
      const char = word[i];
      letterCounts[char] = (letterCounts[char] || 0) + 1;
      totalLetterPositions++;
      uniqueCharsInWord.add(char);
      if (vowels.has(char)) {
        vCount++;
      }
    }

    for (const ch of uniqueCharsInWord) {
      letterWordPresence[ch] = (letterWordPresence[ch] || 0) + 1;
    }

    // Check duplicate letters
    if (uniqueCharsInWord.size < len) {
      repeatedLetterWordsCount++;
    }

    // Vowel group
    const vKey = vCount >= 4 ? '4+' : String(vCount);
    vowelCounts[vKey] = (vowelCounts[vKey] || 0) + 1;

    // 2-letter opening
    if (len >= 2) {
      const op = word.slice(0, 2);
      openings[op] = (openings[op] || 0) + 1;
    }

    // 2-letter ending
    if (len >= 2) {
      const ed = word.slice(-2);
      endings[ed] = (endings[ed] || 0) + 1;
    }
  }

  // Calculate duplicate letter percentage
  const repeatedPercent = Number(((repeatedLetterWordsCount / totalWords) * 100).toFixed(1));

  // Format letter frequencies
  const letterFrequency = Object.entries(letterCounts)
    .map(([letter, count]) => {
      const percent = totalLetterPositions > 0
        ? Number(((count / totalLetterPositions) * 100).toFixed(2))
        : 0;
      const wordCoveragePercent = totalWords > 0
        ? Number(((letterWordPresence[letter] / totalWords) * 100).toFixed(1))
        : 0;

      return {
        letter,
        count,
        percent,
        wordCoveragePercent
      };
    })
    .sort((a, b) => {
      if (b.wordCoveragePercent !== a.wordCoveragePercent) {
        return b.wordCoveragePercent - a.wordCoveragePercent;
      }
      return b.count - a.count;
    });

  // Top openings
  const topOpenings = Object.entries(openings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([pair, count]) => ({
      pair,
      count,
      percent: Number(((count / totalWords) * 100).toFixed(1))
    }));

  // Top endings
  const topEndings = Object.entries(endings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([pair, count]) => ({
      pair,
      count,
      percent: Number(((count / totalWords) * 100).toFixed(1))
    }));

  // Vowel spread
  const vowelSpread = Object.entries(vowelCounts).map(([count, num]) => ({
    vowels: count,
    count: num,
    percent: Number(((num / totalWords) * 100).toFixed(1))
  }));

  // Best starting words (coverage scoring)
  const scoredWords = cleanWords.map(w => {
    const uniqueChars = Array.from(new Set(w.split('')));
    let score = 0;
    for (const ch of uniqueChars) {
      score += (letterWordPresence[ch] / totalWords);
    }
    const avgCoverage = (score / wordLength) * 100;
    return {
      word: w,
      score: Number(avgCoverage.toFixed(2)),
      uniqueLetters: uniqueChars.length
    };
  });

  scoredWords.sort((a, b) => {
    if (b.uniqueLetters !== a.uniqueLetters) {
      return b.uniqueLetters - a.uniqueLetters;
    }
    return b.score - a.score;
  });

  const bestStartingWords = scoredWords.slice(0, 20);

  return {
    length: wordLength,
    totalWords,
    repeatedPercent,
    topOpenings,
    topEndings,
    vowelSpread,
    letterFrequency,
    bestStartingWords
  };
}
