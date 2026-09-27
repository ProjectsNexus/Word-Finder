import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  navigate: (path: string, options?: { replace?: boolean; scroll?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
  navigate: () => {}
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (to: string, options?: { replace?: boolean; scroll?: boolean }) => {
    if (typeof window === 'undefined') return;
    
    // Normalize path
    let target = to;
    if (!target.startsWith('/')) {
      target = '/' + target;
    }

    if (target === window.location.pathname) {
      if (options?.scroll !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (options?.replace) {
      window.history.replaceState({}, '', target);
    } else {
      window.history.pushState({}, '', target);
    }

    setPathname(target);

    if (options?.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  replace?: boolean;
  scroll?: boolean;
}

export function Link({ href, children, replace, scroll, className, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If command or control key is pressed, let default browser tab opening occur
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    
    // External link
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      return;
    }

    e.preventDefault();
    onClick?.(e);
    navigate(href, { replace, scroll });
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}
