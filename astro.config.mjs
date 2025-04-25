import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/echoes-of-ancestral-wars' : '/',
});
