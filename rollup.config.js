import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    file: 'dev/bundle.js',
    format: 'esm',
    declaration: true
  },
  plugins: [ resolve(), typescript() ]
};