import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { Link } from '../utils/router';
import seoIndexData from '../data/seo-index-data.json';
import { Search, ExternalLink, Globe, FileCode, CheckCircle2, TrendingUp, Filter } from 'lucide-react';

interface SeoEntry {
  loc: string;
  priority: string;
  changefreq: string;
  primaryKeyword: string;
  monthlyVolume: number;
  secondaryKeywords: string[];
  intent: 'Tool' | 'Game' | 'Guide' | 'Archive' | 'Directory';
  wordCount: string;
}

export function SitemapIndexPage() {
  const entries = seoIndexData as unknown as SeoEntry[];
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Total volume calculation
  const totalVolume = useMemo(() => {
    return entries.reduce((acc, curr) => acc + (curr.monthlyVolume || 0), 0);
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (filterIntent !== 'all' && e.intent !== filterIntent) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesLoc = e.loc.toLowerCase().includes(term);
        const matchesKw = e.primaryKeyword.toLowerCase().includes(term);
        const matchesSec = e.secondaryKeywords.some(s => s.toLowerCase().includes(term));
        if (!matchesLoc && !matchesKw && !matchesSec) return false;
      }
      return true;
    });
  }, [entries, filterIntent, searchTerm]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Wordle Solver Pro – Complete URL Sitemap & Google Indexing Map"
        description="Comprehensive index of all 67 pages on Wordle Solver Pro with exact target search keywords, estimated monthly search volumes, and crawler priority."
        canonicalPath="/sitemap/"
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700">
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>Google Indexation & Search Architecture</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight text-balance">
            Sitemap & Keyword Index
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
            Every indexed URL, its target organic query, monthly search volume, crawler priority, and internal linking structure.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">Total Indexed Pages</span>
            <span className="font-serif font-bold text-2xl text-stone-900 font-mono">{entries.length}</span>
            <span className="text-[11px] text-stone-600 block mt-0.5">Active in sitemap.xml</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">Total Search Volume</span>
            <span className="font-serif font-bold text-2xl text-stone-900 font-mono">
              {(totalVolume / 1000).toFixed(0)}k+/mo
            </span>
            <span className="text-[11px] text-stone-600 block mt-0.5">Global monthly searches</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">Primary Root Query</span>
            <span className="font-serif font-bold text-lg text-stone-900 truncate block">
              wordle solver
            </span>
            <span className="text-[11px] text-stone-600 block mt-0.5">550,000 / month</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">XML & Crawler Feeds</span>
            <div className="flex items-center gap-2 mt-1">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-stone-900 font-semibold underline hover:text-stone-600"
              >
                sitemap.xml
              </a>
              <span className="text-stone-300">|</span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-stone-900 font-semibold underline hover:text-stone-600"
              >
                robots.txt
              </a>
            </div>
            <span className="text-[11px] text-stone-600 block mt-1">Googlebot directives</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search index by URL, keyword, or letter..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'Tool', 'Game', 'Guide', 'Archive', 'Directory'].map(intent => (
                <button
                  key={intent}
                  type="button"
                  onClick={() => setFilterIntent(intent)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filterIntent === intent
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {intent === 'all' ? `All (${entries.length})` : intent}
                </button>
              ))}
            </div>
          </div>

          {/* Table of URLs */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-medium bg-stone-50/50">
                  <th className="py-3 px-3">Live URL Path</th>
                  <th className="py-3 px-3">Target Primary Keyword</th>
                  <th className="py-3 px-3">Est. Monthly Volume</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Changefreq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(item => (
                  <tr key={item.loc} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-stone-900">
                      <Link
                        href={item.loc}
                        className="hover:underline flex items-center gap-1 text-stone-900 hover:text-stone-700"
                      >
                        <span>{item.loc}</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-stone-900">
                      <div>
                        <span className="font-semibold text-stone-950 block">{item.primaryKeyword}</span>
                        {item.secondaryKeywords.length > 0 && (
                          <span className="text-[10px] text-stone-500 block truncate max-w-xs">
                            {item.secondaryKeywords.join(', ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-stone-900 tabular-nums">
                      {item.monthlyVolume ? `${item.monthlyVolume.toLocaleString()}/mo` : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700">
                        {item.intent}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600">{item.priority}</td>
                    <td className="py-3 px-3 font-mono text-stone-600 capitalize">{item.changefreq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documentation notice */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-700 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-sm">
            <FileCode className="w-4 h-4 text-stone-600" />
            <span>Markdown Documentation Available:</span>
          </div>
          <p>
            Detailed strategic documentation is saved at <code className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-stone-900 font-semibold">/SEO_INDEXING_AND_KEYWORD_STRATEGY.md</code>, including competitor conquesting targets against <em>wordlesolver.online</em>, <em>5-letter-words.com</em>, and <em>rock paper shotgun wordle solver</em>.
          </p>
        </div>
      </div>
    </div>
  );
}
