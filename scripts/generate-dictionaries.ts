import fs from 'node:fs';
import path from 'node:path';

async function generate() {
  console.log('Fetching word lists...');
  const [scrabbleRes, wordleRes] = await Promise.all([
    fetch('https://raw.githubusercontent.com/raun/Scrabble/master/words.txt').then(r => r.text()),
    fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words').then(r => r.text()).catch(() => '')
  ]);

  const rawWords1 = scrabbleRes.split(/\r?\n/).map(w => w.trim().toLowerCase());
  const rawWords2 = wordleRes ? wordleRes.split(/\r?\n/).map(w => w.trim().toLowerCase()) : [];
  
  const allWordSet = new Set<string>();
  for (const w of [...rawWords1, ...rawWords2]) {
    if (/^[a-z]+$/.test(w)) {
      allWordSet.add(w);
    }
  }

  console.log(`Total unique dictionary words loaded: ${allWordSet.size}`);

  const outDir = path.resolve('src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

  const summaryStats: Record<number, any> = {};

  for (let len = 3; len <= 8; len++) {
    const words = Array.from(allWordSet).filter(w => w.length === len).sort();
    const total = words.length;
    console.log(`Length ${len}: ${total} words`);

    // 1. Letter frequency across all letter slots
    const letterCounts: Record<string, number> = {};
    for (let c = 97; c <= 122; c++) {
      letterCounts[String.fromCharCode(c)] = 0;
    }
    let totalLetterPositions = 0;

    // Word coverage per letter (how many words contain this letter at least once)
    const letterWordPresence: Record<string, number> = {};
    for (let c = 97; c <= 122; c++) {
      letterWordPresence[String.fromCharCode(c)] = 0;
    }

    // 2. Openings & Endings
    const openings: Record<string, number> = {};
    const endings: Record<string, number> = {};

    // 3. Vowel counts
    const vowelDist: Record<string, number> = { '0': 0, '1': 0, '2': 0, '3': 0, '4+': 0 };

    // 4. Repeated letter count
    let repeatedLetterCount = 0;

    for (const w of words) {
      // letter positions
      const uniqueInWord = new Set<string>();
      let vCount = 0;
      for (let i = 0; i < len; i++) {
        const char = w[i];
        letterCounts[char] = (letterCounts[char] || 0) + 1;
        totalLetterPositions++;
        uniqueInWord.add(char);
        if (vowels.has(char)) vCount++;
      }

      for (const ch of uniqueInWord) {
        letterWordPresence[ch] = (letterWordPresence[ch] || 0) + 1;
      }

      if (uniqueInWord.size < len) {
        repeatedLetterCount++;
      }

      const vKey = vCount >= 4 ? '4+' : String(vCount);
      vowelDist[vKey] = (vowelDist[vKey] || 0) + 1;

      // 2-letter opening
      if (len >= 2) {
        const op = w.slice(0, 2);
        openings[op] = (openings[op] || 0) + 1;
      }

      // 2-letter ending
      if (len >= 2) {
        const ed = w.slice(-2);
        endings[ed] = (endings[ed] || 0) + 1;
      }
    }

    // Format letter frequencies
    const letterFrequency = Object.entries(letterCounts)
      .map(([char, count]) => ({
        letter: char.toUpperCase(),
        count,
        percent: Number(((count / (totalLetterPositions || 1)) * 100).toFixed(2)),
        wordCoveragePercent: Number(((letterWordPresence[char] / (total || 1)) * 100).toFixed(2))
      }))
      .sort((a, b) => b.count - a.count);

    const topOpenings = Object.entries(openings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pair, count]) => ({
        pair: pair.toUpperCase(),
        count,
        percent: Number(((count / total) * 100).toFixed(1))
      }));

    const topEndings = Object.entries(endings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pair, count]) => ({
        pair: pair.toUpperCase(),
        count,
        percent: Number(((count / total) * 100).toFixed(1))
      }));

    const vowelSpread = Object.entries(vowelDist).map(([count, num]) => ({
      vowels: count,
      count: num,
      percent: Number(((num / total) * 100).toFixed(1))
    }));

    const repeatedPercent = Number(((repeatedLetterCount / total) * 100).toFixed(1));

    // Best starting words scored by letter pool coverage
    // Each unique letter scores the % of pool that contains it
    const scoredWords = words.map(w => {
      const uniqueChars = Array.from(new Set(w.split('')));
      let score = 0;
      for (const ch of uniqueChars) {
        score += (letterWordPresence[ch] / total);
      }
      const avgCoverage = (score / len) * 100;
      return {
        word: w.toUpperCase(),
        score: Number(avgCoverage.toFixed(2)),
        uniqueLetters: uniqueChars.length
      };
    });

    // Sort descending by score, prioritizing words with all unique letters
    scoredWords.sort((a, b) => {
      if (b.uniqueLetters !== a.uniqueLetters) {
        return b.uniqueLetters - a.uniqueLetters;
      }
      return b.score - a.score;
    });

    const bestStartingWords = scoredWords.slice(0, 20);

    const statsData = {
      length: len,
      totalWords: total,
      repeatedPercent,
      topOpenings,
      topEndings,
      vowelSpread,
      letterFrequency,
      bestStartingWords
    };

    summaryStats[len] = statsData;

    // Write words json
    fs.writeFileSync(path.join(outDir, `words-${len}.json`), JSON.stringify(words));
    // Write stats json
    fs.writeFileSync(path.join(outDir, `stats-${len}.json`), JSON.stringify(statsData, null, 2));
  }

  fs.writeFileSync(path.join(outDir, `stats-all.json`), JSON.stringify(summaryStats, null, 2));
  console.log('Successfully generated all precomputed word lists and stats!');
}

generate().catch(console.error);
