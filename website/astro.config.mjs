// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://amrloksha151.me',
  base: '/',
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
