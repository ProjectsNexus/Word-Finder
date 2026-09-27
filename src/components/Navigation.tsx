import { useState } from 'react';
import { Link, useRouter } from '../utils/router';
import { Menu, X, ChevronDown, Sparkles, BookOpen } from 'lucide-react';
import { Logo } from './Logo';

export function Navigation() {
  const { pathname, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { label: '5-Letter', href: '/' },
    { label: 'Game Mode', href: '/wordle-solver-game/' },
    { label: 'Word Finder', href: '/word-finder/' },
    { label: 'Past Answers', href: '/blog/every-wordle-answer-ever/' },
    { label: 'Strategy', href: '/blog/best-wordle-starting-words/' },
    { label: 'Tools', href: '/tools/' },
  ];

  const boardLengths = [
    { label: '3-Letter Solver', href: '/wordle-solver-3-letter/' },
    { label: '4-Letter Solver', href: '/wordle-solver-4-letter/' },
    { label: '5-Letter Solver (Standard)', href: '/' },
    { label: '6-Letter Solver', href: '/wordle-solver-6-letter/' },
    { label: '7-Letter Solver', href: '/wordle-solver-7-letter/' },
    { label: '8-Letter Solver', href: '/wordle-solver-8-letter/' },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F8F7F3]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand logo + wordmark */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap group"
        >
          <Logo size={34} className="transition-transform group-hover:scale-105" />
          <span>Wordle Solver Pro</span>
        </Link>

        {/* Zone 2: 4–6 nav links, 1–2 word labels, single-line */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navLinks.map(link => {
            const cleanCur = (pathname || '/').replace(/\/$/, '') || '/';
            const cleanTarget = (link.href || '/').replace(/\/$/, '') || '/';
            const isActive = cleanCur === cleanTarget;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative whitespace-nowrap ${
                  isActive 
                    ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900' 
                    : 'hover:text-stone-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Board length switcher dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 transition-colors border border-stone-300/80 whitespace-nowrap"
              aria-expanded={dropdownOpen}
            >
              <span>Board Lengths</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-600" />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Word Length Solvers
                  </div>
                  {boardLengths.map(b => (
                    <button
                      key={b.href}
                      onClick={() => handleNavClick(b.href)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                        pathname === b.href 
                          ? 'bg-stone-100 text-stone-950 font-semibold' 
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => handleNavClick('/tools/')}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-stone-900 hover:bg-stone-50 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                    <span>View All Solver Tools</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Solve CTA button */}
          <Link
            href="/wordle-solver-game/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Play & Solve</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-950 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#F8F7F3] px-4 pt-3 pb-6 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
                pathname === link.href
                  ? 'bg-stone-200/80 text-stone-950 font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-200 text-xs font-semibold text-stone-400 px-3 uppercase tracking-wider">
            All Board Lengths
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {boardLengths.map(b => (
              <button
                key={b.href}
                onClick={() => handleNavClick(b.href)}
                className="text-left text-xs py-1.5 px-3 rounded-md bg-stone-100/70 text-stone-800 hover:bg-stone-200 transition-colors"
              >
                {b.label.replace(' Solver', '')}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
