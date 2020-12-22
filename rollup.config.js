
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import externalGlobals from "rollup-plugin-external-globals";
import { terser } from "rollup-plugin-terser";
export default {
	input: 'src/arnft/ARnft.ts', // our source file
	output: [
		{
			//umd
			format: 'umd',
			name: 'ARNFT',
			file: 'public/arnft.core.js',
			sourcemap: true,
			globals: {
				babylonjs: 'babylonjs',
			}
		}
	],
external: [
	...Object.keys(pkg.dependencies || {}),
	"BABYLON"
],
	plugins: [
		typescript({
			tsconfig: "tsconfig.json",
			typescript: require('typescript'),
		}),
		externalGlobals({
			babylonjs: "BABYLON"
		}),
		json(),
		nodeResolve(),
		terser() // minifies generated bundles
	]
};