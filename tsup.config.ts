import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  dts: true,
  entry: ['src/node.ts', 'src/react.ts'],
  format: ['esm', 'cjs'],
  minify: isProduction,
  sourcemap: true,
});
