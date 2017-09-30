const tap = require('tap');
const { Engine, System, Component, Entity } = require('../dist/ecs');

tap.test('entity', t => {

  tap.test('enable', t => {
    let engine = new Engine();
    let enableCount = 0;

    //createEntity emit
    let ent1 = engine.createEntity('Entity1');
    ent1.on('enable', function () {
      enableCount += 1;
    });
    engine.tick();
    t.equal(enableCount, 1);

    //entity.enabled true emit
    ent1._onEnableChanged();
    t.equal(enableCount, 2);

    //cloneEntity emit
    let ent2 = ent1.clone();
    ent2.on('enable', function () {
      enableCount += 1;
    });
    engine.tick();
    t.equal(enableCount, 3);

    //cloneEntity emit
    let ent3 = ent1.deepClone();
    ent3.on('enable', function () {
      enableCount += 1;
    });
    engine.tick();
    t.equal(enableCount, 4);

    t.end();
  });

  tap.test('disable', t => {

    let engine = new Engine();
    let disableCount = 0;

    let ent1 = engine.createEntity('Entity1');
    engine.tick();
    ent1.on('disable', function () {
      disableCount += 1;
    });

    //entity.enabled false emit
    engine._notifyEnableChanged(ent1, false);
    t.equal(disableCount, 1);

    //destroy entity emit
    ent1.destroy();
    ent1.setParent(null);
    engine.tick();
    t.equal(disableCount, 2);

    t.end();
  });

  tap.test('ready', t => {

    let engine = new Engine();
    let readyCount = 0;

    //createEntity emit
    let ent1 = engine.createEntity('Entity1');
    ent1.on('ready', function () {
      readyCount += 1;
    });
    engine.tick();
    t.equal(readyCount, 1);

    //cloneEntity emit
    let ent2 = ent1.clone();
    ent2.on('ready', function () {
      readyCount += 1;
    });
    engine.tick();
    t.equal(readyCount, 2);

    //deepCloneEntity emit
    let ent3 = ent1.deepClone();
    ent3.on('ready', function () {
      readyCount += 1;
    });
    engine.tick();
    t.equal(readyCount, 3);

    t.end();
  });

  t.end();
});