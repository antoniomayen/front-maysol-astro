// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://www.granjasmaysol.com/',
  integrations: [tailwind()],
  server: {
    host: '0.0.0.0',
    port: 3006
  }
});
