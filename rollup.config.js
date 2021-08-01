import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [ resolve() ]
};