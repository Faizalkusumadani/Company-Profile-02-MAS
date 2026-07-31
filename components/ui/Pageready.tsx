"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface PageReadyContextValue {
  heroReady: boolean;
  markHeroReady: () => void;
}

const PageReadyContext = createContext<PageReadyContextValue | null>(null);

export function PageReadyProvider({ children }: { children: ReactNode }) {
  const [heroReady, setHeroReady] = useState(false);
  const hasMarked = useRef(false);

  const markHeroReady = useCallback(() => {
    if (hasMarked.current) return;
    hasMarked.current = true;
    setHeroReady(true);
  }, []);

  return (
    <PageReadyContext.Provider value={{ heroReady, markHeroReady }}>
      {children}
    </PageReadyContext.Provider>
  );
}

export function usePageReady() {
  const ctx = useContext(PageReadyContext);

  // Fallback: kalau dipakai di halaman/komponen yang tidak dibungkus provider
  // (mis. halaman tanpa hero image), anggap langsung "ready" supaya Pageloader
  // tidak menunggu sinyal yang tidak akan pernah datang.
  if (!ctx) {
    return { heroReady: true, markHeroReady: () => {} };
  }

  return ctx;
}
