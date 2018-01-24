'use strict';

const buble = require('rollup-plugin-buble');
const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @gamedev-js
 * Released under the MIT License.
 */
`;

let dest = './dist';
let file = 'ecs';
let name = 'ecs';
let sourcemap = true;
let globals = {
  'vmath': 'window.vmath',
  'event-sys': 'window.eventsys',
  'scene-graph': 'window.sgraph',
  'memop': 'window.memop',
};

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  input: './index.js',
  output: [
    {
      file: `${dest}/${file}.dev.js`,
      format: 'iife',
      name,
      banner,
      globals,
      sourcemap
    },
    {
      file: `${dest}/${file}.js`,
      format: 'cjs',
      name,
      banner,
      globals,
      sourcemap
    },
  ],
  external: [
    'vmath',
    'scene-graph',
    'event-sys',
    'memop',
  ],
  plugins: [
    buble(),
  ]
};