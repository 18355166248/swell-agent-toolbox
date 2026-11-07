import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  basePath: process.env.SITE_BASE_PATH || '',
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: process.env.SITE_BASE_PATH || '' },
};

export default withMDX(config);
