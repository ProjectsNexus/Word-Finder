import { GuessRow, AdvancedFilters, CandidateWord } from '../types/solver';

/**
 * Filter words according to Wordle tile clues and optional advanced constraints.
 * Implements exact duplicate-letter logic.
 */
export function filterCandidates(
  wordList: string[],
  wordLength: number,
  guesses: GuessRow[],
  advanced: AdvancedFilters
): CandidateWord[] {
  if (!wordList || wordList.length === 0) return [];

  // Parse advanced constraints
  const patternUpper = (advanced.pattern || '').trim().toUpperCase();
  const containsUpper = (advanced.contains || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('');
  const excludesUpper = new Set(
    (advanced.excludes || '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('')
  );

  // Active guesses with full word
  const activeGuesses = guesses.filter(
    g => g.word.length === wordLength && g.clues.length === wordLength
  );

  // Pre-analyze constraints per guess to enforce duplicate letter bounds
  const guessConstraints = activeGuesses.map(g => {
    const letters = g.clues.map(c => c.letter.toUpperCase());
    const colors = g.clues.map(c => c.color);

    // Count confirmed (green or yellow) per character
    const confirmedCount: Record<string, number> = {};
    const hasGray: Record<string, boolean> = {};

    for (let i = 0; i < wordLength; i++) {
      const char = letters[i];
      if (!char) continue;
      if (!confirmedCount[char]) confirmedCount[char] = 0;

      if (colors[i] === 'green' || colors[i] === 'yellow') {
        confirmedCount[char]++;
      } else if (colors[i] === 'gray') {
        hasGray[char] = true;
      }
    }

    return {
      letters,
      colors,
      confirmedCount,
      hasGray
    };
  });

  // Calculate global min and max count per letter across all guesses
  const globalMinCount: Record<string, number> = {};
  const globalMaxCount: Record<string, number> = {};

  for (let c = 65; c <= 90; c++) {
    const char = String.fromCharCode(c);
    globalMinCount[char] = 0;
    globalMaxCount[char] = Infinity;
  }

  // Account for advanced 'contains'
  const advContainsCounts: Record<string, number> = {};
  for (const ch of containsUpper) {
    advContainsCounts[ch] = (advContainsCounts[ch] || 0) + 1;
  }
  for (const [ch, cnt] of Object.entries(advContainsCounts)) {
    globalMinCount[ch] = Math.max(globalMinCount[ch] || 0, cnt);
  }

  // Account for advanced 'excludes'
  for (const ch of excludesUpper) {
    // If user explicitly excluded, max count is 0 (unless overridden by green/yellow)
    globalMaxCount[ch] = Math.min(globalMaxCount[ch], 0);
  }

  // Aggregate guess constraints
  for (const gc of guessConstraints) {
    for (const [char, confirmed] of Object.entries(gc.confirmedCount)) {
      globalMinCount[char] = Math.max(globalMinCount[char] || 0, confirmed);
      if (gc.hasGray[char]) {
        // A gray was seen for this letter!
        // That means the target word CANNOT have more occurrences than confirmed in this guess.
        globalMaxCount[char] = Math.min(globalMaxCount[char], confirmed);
      }
    }

    // Letters that only appeared as gray in this guess have confirmed = 0
    for (const [char, isGray] of Object.entries(gc.hasGray)) {
      if (isGray && !gc.confirmedCount[char]) {
        globalMaxCount[char] = Math.min(globalMaxCount[char], 0);
      }
    }
  }

  // Quick contradiction check
  for (let c = 65; c <= 90; c++) {
    const char = String.fromCharCode(c);
    if (globalMinCount[char] > globalMaxCount[char]) {
      return []; // Inconsistent clues entered
    }
  }

  // Filter dictionary
  const matchingWords: string[] = [];

  outerLoop: for (let wIdx = 0; wIdx < wordList.length; wIdx++) {
    const rawWord = wordList[wIdx];
    if (rawWord.length !== wordLength) continue;
    const word = rawWord.toUpperCase();

    // 1. Check advanced pattern (e.g. "_A__E")
    if (patternUpper.length > 0) {
      for (let i = 0; i < wordLength; i++) {
        const pChar = patternUpper[i];
        if (pChar && pChar !== '_' && pChar !== '.' && pChar !== ' ' && pChar !== word[i]) {
          continue outerLoop;
        }
      }
    }

    // 2. Check position-specific green & yellow rules
    for (const gc of guessConstraints) {
      for (let i = 0; i < wordLength; i++) {
        const guessChar = gc.letters[i];
        const color = gc.colors[i];

        if (color === 'green') {
          if (word[i] !== guessChar) {
            continue outerLoop;
          }
        } else if (color === 'yellow') {
          // Yellow means the letter MUST exist elsewhere in the word, NOT at this position
          if (word[i] === guessChar) {
            continue outerLoop;
          }
        }
      }
    }

    // 3. Count frequencies in candidate word and check global min/max letter bounds
    const charCounts: Record<string, number> = {};
    for (let i = 0; i < wordLength; i++) {
      const c = word[i];
      charCounts[c] = (charCounts[c] || 0) + 1;
    }

    for (let c = 65; c <= 90; c++) {
      const char = String.fromCharCode(c);
      const count = charCounts[char] || 0;
      if (count < (globalMinCount[char] || 0) || count > (globalMaxCount[char] ?? Infinity)) {
        continue outerLoop;
      }
    }

    matchingWords.push(word);
  }

  if (matchingWords.length === 0) return [];

  // Calculate Information Gain score for each candidate word
  // Information gain formula:
  // For each letter ch: what % of remaining candidate pool contains ch at least once?
  // Candidate score = (sum of % coverage for unique letters in candidate) / wordLength
  const totalMatches = matchingWords.length;
  const letterPresenceCount: Record<string, number> = {};
  for (let c = 65; c <= 90; c++) {
    letterPresenceCount[String.fromCharCode(c)] = 0;
  }

  for (const w of matchingWords) {
    const seen = new Set<string>();
    for (let i = 0; i < wordLength; i++) {
      seen.add(w[i]);
    }
    for (const ch of seen) {
      letterPresenceCount[ch] = (letterPresenceCount[ch] || 0) + 1;
    }
  }

  const letterPoolPercent: Record<string, number> = {};
  for (let c = 65; c <= 90; c++) {
    const char = String.fromCharCode(c);
    letterPoolPercent[char] = letterPresenceCount[char] / totalMatches;
  }

  const scoredCandidates: CandidateWord[] = matchingWords.map(w => {
    const uniqueChars = Array.from(new Set(w.split('')));
    let sumCoverage = 0;
    for (const ch of uniqueChars) {
      sumCoverage += letterPoolPercent[ch] || 0;
    }
    const score = Number(((sumCoverage / wordLength) * 100).toFixed(2));
    return {
      word: w,
      score,
      uniqueLetters: uniqueChars.length
    };
  });

  // Sort descending by information gain score
  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.word.localeCompare(b.word);
  });

  return scoredCandidates;
}

/**
 * Cycle tile clue color: gray -> yellow -> green -> gray
 */
export function getNextTileColor(current: 'gray' | 'yellow' | 'green'): 'gray' | 'yellow' | 'green' {
  if (current === 'gray') return 'yellow';
  if (current === 'yellow') return 'green';
  return 'gray';
}
