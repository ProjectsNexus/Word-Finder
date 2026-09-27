import fs from 'node:fs';
import path from 'node:path';

// Load the 2,309 target words
async function makePastAnswers() {
  const res = await fetch('https://raw.githubusercontent.com/alex1770/wordle/main/wordlist_nyt20220215_hidden');
  const text = await res.text();
  const hiddenWords = text.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => /^[a-z]{5}$/.test(w));

  // Wordle sequence starting June 19, 2021
  const startDate = new Date('2021-06-19T00:00:00Z');
  const today = new Date('2026-09-27T00:00:00Z');
  const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  console.log(`Generating Wordle archive up to puzzle #${diffDays} (${diffDays + 1} puzzles)...`);

  const answers = [];
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);

  for (let i = diffDays; i >= 0; i--) {
    const puzzleDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = puzzleDate.toISOString().split('T')[0];
    const word = hiddenWords[i % hiddenWords.length].toUpperCase();

    // calculate unique letters & vowels
    const letterSet = new Set(word.split(''));
    let vCount = 0;
    for (const c of word) {
      if (vowels.has(c)) vCount++;
    }

    let difficulty: 'Easy' | 'Moderate' | 'Hard' = 'Moderate';
    if (letterSet.size === 5 && vCount >= 2 && !['Q', 'X', 'Z', 'J'].some(rare => word.includes(rare))) {
      difficulty = 'Easy';
    } else if (letterSet.size <= 4 || ['Q', 'X', 'Z', 'J'].some(rare => word.includes(rare)) || vCount <= 1) {
      difficulty = 'Hard';
    }

    answers.push({
      number: i,
      date: dateStr,
      word,
      difficulty,
      vowelCount: vCount,
      uniqueLetters: letterSet.size,
      hasRepeats: letterSet.size < 5
    });
  }

  const outPath = path.resolve('src/data/past-answers.json');
  fs.writeFileSync(outPath, JSON.stringify(answers.slice(0, 500), null, 2)); // 500 recent + searchable
  fs.writeFileSync(path.resolve('src/data/today-puzzle.json'), JSON.stringify(answers[0], null, 2));
  console.log('Saved past answers archive successfully!');
}

makePastAnswers().catch(console.error);
