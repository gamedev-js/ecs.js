const tap = require('tap');
const { Engine, Entity } = require('../dist/ecs');

tap.test('entity', t => {

  tap.test('constructor', t => {
    let ent1 = new Entity('ent1');

    t.end();
  });

  t.end();
});