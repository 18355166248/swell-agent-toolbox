'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return <RootProvider
    theme={{ defaultTheme: 'light', enableSystem: false }}
    search={{ SearchDialog }}
    i18n={{ translations: {
      'Search': '搜索文档', 'Open Search': '打开搜索', 'Close Search': '关闭搜索',
      'Search Documentation': '搜索文档', 'No results found': '未找到匹配内容',
      'On this page': '本页目录', 'Next Page': '下一页', 'Previous Page': '上一页',
      'Copy Markdown': '复制 Markdown', 'Copied Markdown': '已复制 Markdown',
      'Copy Anchor Link': '复制章节链接', 'Copied Anchor Link': '链接已复制',
      'Open': '打开', 'Toggle Theme': '切换主题', 'Collapse Sidebar': '收起侧栏',
      'Expand Sidebar': '展开侧栏', 'Skip to Content': '跳到正文',
    } }}
  >{children}</RootProvider>;
}
