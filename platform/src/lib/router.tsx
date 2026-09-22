import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Routeur minimaliste basé sur le hash (#/chemin), sans dépendance externe.

interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

const readHash = (): string => {
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
};

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(readHash());

  useEffect(() => {
    const onHash = () => setPath(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
    // au cas où le hash serait identique
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
};

export const useRouter = () => useContext(RouterContext);

// Découpe le chemin en segments : '/conseiller/client/cl_1' -> ['conseiller','client','cl_1']
export const segments = (path: string): string[] =>
  path.split('/').filter(Boolean);
