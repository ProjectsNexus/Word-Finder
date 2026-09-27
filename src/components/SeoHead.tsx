import { useEffect } from 'react';
import { FaqItem } from '../types/solver';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  faqList?: FaqItem[];
  jsonLdExtra?: Record<string, any>;
}

export function SeoHead({ title, description, canonicalPath, faqList, jsonLdExtra }: SeoHeadProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let elem = document.querySelector(`meta[${attr}="${key}"]`);
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attr, key);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wordlesolverpro.com';
    const fullUrl = `${origin}${canonicalPath}`;
    setMetaTag('property', 'og:url', fullUrl);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Structured Data JSON-LD
    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Wordle Solver Pro',
        url: fullUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    ];

    if (faqList && faqList.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqList.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      });
    }

    if (jsonLdExtra) {
      schemas.push(jsonLdExtra);
    }

    let script = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas);
  }, [title, description, canonicalPath, faqList, jsonLdExtra]);

  return null;
}
