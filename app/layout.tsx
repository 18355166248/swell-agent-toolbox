import { Provider } from '@/components/provider';
import type { Metadata } from 'next';
import { asset } from '@/lib/paths';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://18355166248.github.io'),
  icons: { icon: asset('/icon.svg') },
  title: { default: 'Swell · Agent Toolbox', template: '%s · Swell' },
  description: 'Swell 的个人智能体工具箱。把经过实践的 Skills、MCP 连接和工作流，整理成可以反复使用的能力。',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
