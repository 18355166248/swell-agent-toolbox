'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';
import { chineseUI } from '@/lib/translations';

export function Provider({ children }: { children: ReactNode }) {
  return <RootProvider
    theme={{ defaultTheme: 'light', enableSystem: false }}
    search={{ SearchDialog }}
    i18n={chineseUI}
  >{children}</RootProvider>;
}
