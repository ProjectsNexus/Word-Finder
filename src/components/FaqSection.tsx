import { useState } from 'react';
import { FaqItem } from '../types/solver';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from '../utils/router';

interface FaqSectionProps {
  wordLength: number;
  faqs?: FaqItem[];
}

export function FaqSection({ wordLength, faqs }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const defaultFaqs: FaqItem[] = [
    {
      question: `How does the ${wordLength}-Letter Wordle Solver handle duplicate letters?`,
      answer: `Most word solvers treat gray tiles as a global ban on that letter, which breaks whenever a word contains duplicate letters (e.g. ABBEY, SPEED, LEVEL). Wordle Solver Pro accurately enforces Wordle duplicate-letter logic: a gray tile only caps the maximum occurrences of that letter to the number of confirmed green/yellow tiles in the same guess. If a letter is marked yellow/green once and gray once, the solver locks that letter's count to exactly 1.`
    },
    {
      question: `What is the "Information Gain" algorithm used for smart next guesses?`,
      answer: `Rather than picking words randomly, Wordle Solver Pro recalculates the exact letter frequency distribution across the remaining candidate pool after each clue. Each candidate is scored by how many candidate words contain its letters. The top 5 words maximize the likelihood of eliminating the highest fraction of remaining possibilities on your next turn.`
    },
    {
      question: `Can I use this tool for games other than standard Wordle?`,
      answer: `Yes! You can solve 3, 4, 5, 6, 7, and 8-letter word games like Quordle, Octordle, Sedecordle, Scrabble, Anagrams, and Crosswords. Use our Advanced Filter Mode to set known slot patterns (e.g. _A__E) or letter inclusion/exclusion constraints.`
    },
    {
      question: `Does Wordle Solver Pro send my clues to an external server?`,
      answer: `No. All dictionary filtering, pattern matching, duplicate-letter calculations, and information gain scoring execute 100% locally in your web browser. Your guesses and clues never leave your device.`
    },
    {
      question: `What are the best starting words for a ${wordLength}-letter puzzle?`,
      answer: `According to our precomputed linguistic data across the open ENABLE dictionary, words composed of high-frequency vowels and consonants with zero repeated letters (such as ${wordLength === 5 ? 'SOARE, ROATE, RAISE, and CRANE' : wordLength === 6 ? 'STAREN and CARNIE' : 'STEARIN'}) provide the highest initial letter pool coverage.`
    },
    {
      question: `How do I enter clues quickly using my keyboard?`,
      answer: `You can type letters directly with your physical keyboard or the on-screen virtual keypad. Click or tap any letter tile, or press the Spacebar, to cycle its color: Gray (Absent/Capped) → Yellow (Present in wrong slot) → Green (Correct position). Press Enter to advance to the next row.`
    }
  ];

  const items = faqs || defaultFaqs;

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-4xl mx-auto pt-10">
      <div className="text-center mb-6">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Everything you need to know about the solver algorithm, duplicate letters, and strategy.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-stone-200/80 rounded-xl bg-white overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50/60 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-serif font-semibold text-stone-900 text-sm sm:text-base pr-4">
                  {item.question}
                </span>
                <span className="text-stone-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Internal Navigation Links block required by brief */}
      <div className="mt-8 p-4 rounded-xl bg-stone-100/70 border border-stone-200 text-xs text-stone-600">
        <div className="font-semibold text-stone-800 mb-2">Explore Other Board Solvers & Strategy Guides:</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-stone-700">
          <Link href="/wordle-solver-3-letter" className="hover:text-stone-950 underline underline-offset-2">3-Letter Solver</Link>
          <span aria-hidden="true">·</span>
          <Link href="/wordle-solver-4-letter" className="hover:text-stone-950 underline underline-offset-2">4-Letter Solver</Link>
          <span aria-hidden="true">·</span>
          <Link href="/" className="hover:text-stone-950 underline underline-offset-2">5-Letter Solver (Wordle)</Link>
          <span aria-hidden="true">·</span>
          <Link href="/wordle-solver-6-letter" className="hover:text-stone-950 underline underline-offset-2">6-Letter Solver</Link>
          <span aria-hidden="true">·</span>
          <Link href="/wordle-solver-7-letter" className="hover:text-stone-950 underline underline-offset-2">7-Letter Solver</Link>
          <span aria-hidden="true">·</span>
          <Link href="/wordle-solver-8-letter" className="hover:text-stone-950 underline underline-offset-2">8-Letter Solver</Link>
          <span aria-hidden="true">·</span>
          <Link href="/tools" className="hover:text-stone-950 underline underline-offset-2 font-medium">All Solver Tools</Link>
          <span aria-hidden="true">·</span>
          <Link href="/blog/how-wordle-solver-works" className="hover:text-stone-950 underline underline-offset-2 font-medium">How Algorithm Works</Link>
        </div>
      </div>
    </section>
  );
}
