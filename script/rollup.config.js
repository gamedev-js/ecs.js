'use strict';

const buble = require('rollup-plugin-buble');
const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @Johnny Wu
 * Released under the MIT License.
 */
`;

let dest = './dist';
let file = 'ecs';
let moduleName = 'ecs';

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  entry: './index.js',
  targets: [
    { dest: `${dest}/${file}.dev.js`, format: 'iife' },
    { dest: `${dest}/${file}.js`, format: 'cjs' },
  ],
  moduleName,
  banner,
  external: [
    'vmath',
    'scene-graph',
    'event-sys',
    'memop',
  ],
  globals: {
    'vmath': 'window.vmath',
    'event-sys': 'window.eventsys',
    'scene-graph': 'window.sgraph',
    'memop': 'window.memop',
  },
  sourceMap: true,
  plugins: [
    buble(),
  ]
};