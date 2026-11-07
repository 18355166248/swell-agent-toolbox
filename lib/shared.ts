import { createGetUrl } from 'fumadocs-core/source';
import { asset } from './paths';

export const appName = 'Swell / Agent Toolbox';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: '18355166248',
  repo: 'swell-agent-toolbox',
  branch: 'main',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  // Fumadocs page actions prepend the framework base path themselves.
  return { segments, url: getContentUrl(segments, page.locale) };
}

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: asset('/social-card.svg') };
}
