
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from 'rollup-plugin-terser';

export default {
	input: 'src/index.js',
	output: [
		{
			file: 'dist/index.js',
			format: 'esm',
			plugins: [terser.terser()]
		},
		{
			file: 'dist/index.cjs',
			format: 'cjs',
			plugins: [terser.terser()]
		}
	],
	plugins: [nodeResolve()]
};
