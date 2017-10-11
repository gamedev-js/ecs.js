const tap = require('tap');
const { Engine, System, Component, Entity } = require('../dist/ecs');

tap.test('entity', t => {

  tap.test('enable', t => {
    let engine = new Engine();

    tap.test('engine.createEntity()', t => {
      let enableCount = 0;
      let ent1 = engine.createEntity('Entity1');

      t.assert(ent1.enabled === true, 'The enabled is true for new entity');

      ent1.on('enable', function () {
        enableCount += 1;
      });
      engine.tick();

      t.equal(enableCount, 1);

      t.end();
    });

    tap.test('entity.enabled = true', t => {
      let enableCount = 0;
      let ent1 = engine.createEntity('Entity1');

      t.assert(ent1.enabled === true);

      ent1.on('enable', function () {
        enableCount += 1;
      });
      engine.tick();

      t.equal(enableCount, 1);

      ent1.enabled = false;
      ent1.enabled = true;

      t.assert(ent1.enabled === true);
      t.equal(enableCount, 2);

      t.end();
    });

    tap.test('entity.clone()', t => {
      let enableCount = 0;
      let ent1 = engine.createEntity('Entity1');

      let ent2 = ent1.clone();

      t.assert(ent2.enabled === true);

      ent2.on('enable', function () {
        enableCount += 1;
      });
      engine.tick();

      t.equal(enableCount, 1);

      ent2.enabled = false;
      ent2.enabled = true;

      t.equal(enableCount, 2);

      t.end();
    });

    tap.test('entity.deepClone()', t => {
      let ent1 = engine.createEntity('ent1');
      let ent1_1 = engine.createEntity('ent1_1');
      let ent1_2 = engine.createEntity('ent1_2');
      let ent1_1_1 = engine.createEntity('ent1_1_1');
      let ent1_1_2 = engine.createEntity('ent1_1_2');
      let ent1_2_1 = engine.createEntity('ent1_2_1');
      let ent1_2_2 = engine.createEntity('ent1_2_2');
      ent1_1.setParent(ent1);
      ent1_2.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      ent1_1_2.setParent(ent1_1);
      ent1_2_1.setParent(ent1_2);
      ent1_2_2.setParent(ent1_2);

      let ent2 = ent1.deepClone();

      t.assert(ent2.enabled === true)
      t.assert(ent2._children[0].enabled === true)
      t.assert(ent2._children[1].enabled === true)
      t.assert(ent2._children[0]._children[0].enabled === true)
      t.assert(ent2._children[0]._children[1].enabled === true)
      t.assert(ent2._children[1]._children[0].enabled === true)
      t.assert(ent2._children[1]._children[1].enabled === true)

      let enableCount = 0;
      let enableCount_1 = 0;
      let enableCount_2 = 0;
      let enableCount_1_1 = 0;
      let enableCount_1_2 = 0;
      let enableCount_2_1 = 0;
      let enableCount_2_2 = 0;

      ent2.on('enable', function () {
        enableCount += 1;
      });
      ent2._children[0].on('enable', function () {
        enableCount_1 += 1;
      });
      ent2._children[1].on('enable', function () {
        enableCount_2 += 1;
      });
      ent2._children[0]._children[0].on('enable', function () {
        enableCount_1_1 += 1;
      });
      ent2._children[0]._children[1].on('enable', function () {
        enableCount_1_2 += 1;
      });
      ent2._children[1]._children[0].on('enable', function () {
        enableCount_2_1 += 1;
      });
      ent2._children[1]._children[1].on('enable', function () {
        enableCount_2_2 += 1;
      });
      engine.tick();

      t.equal(enableCount, 1);
      t.equal(enableCount_1, 1);
      t.equal(enableCount_2, 1);
      t.equal(enableCount_1_1, 1);
      t.equal(enableCount_1_2, 1);
      t.equal(enableCount_2_1, 1);
      t.equal(enableCount_2_2, 1);

      enableCount = 0;
      enableCount_1 = 0;
      enableCount_2 = 0;
      enableCount_1_1 = 0;
      enableCount_1_2 = 0;
      enableCount_2_1 = 0;
      enableCount_2_2 = 0;

      ent2.enabled = false;
      ent2.enabled = true;

      t.equal(enableCount, 1);
      t.equal(enableCount_1, 1);
      t.equal(enableCount_2, 1);
      t.equal(enableCount_1_1, 1);
      t.equal(enableCount_1_2, 1);
      t.equal(enableCount_2_1, 1);
      t.equal(enableCount_2_2, 1);

      t.end();
    });

    tap.test('move the entity from disabled parent to a enabled parent', t => {

      /**
       * [o] ent0
       * [x] ent1
       *  |- [o] ent1_1
       *      |- [o] ent1_1_1
       *      |- [o] ent1_1_2
       *  |- [x] ent1_2
       *      |- [o] ent1_2_1
       *      |- [o] ent1_2_1
       * 
       * ent1_1.setParent(ent0)
       * ent1_2.setParent(ent0)
       */

      let ent0 = engine.createEntity('ent0');
      let ent1 = engine.createEntity('ent1');
      let ent1_1 = engine.createEntity('ent1_1');
      let ent1_2 = engine.createEntity('ent1_2');
      let ent1_1_1 = engine.createEntity('ent1_1_1');
      let ent1_1_2 = engine.createEntity('ent1_1_2');
      let ent1_2_1 = engine.createEntity('ent1_2_1');
      let ent1_2_2 = engine.createEntity('ent1_2_2');
      ent1.enabled = false;
      ent1_2.enabled = false;
      ent1_1.setParent(ent1);
      ent1_2.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      ent1_1_2.setParent(ent1_1);
      ent1_2_1.setParent(ent1_2);
      ent1_2_2.setParent(ent1_2);
      engine.tick();

      let enableCount_1 = 0;
      let enableCount_2 = 0;
      let enableCount_1_1 = 0;
      let enableCount_1_2 = 0;
      let enableCount_2_1 = 0;
      let enableCount_2_2 = 0;
      ent1_1.on('enable', function () {
        enableCount_1 += 1;
      });
      ent1_1_1.on('enable', function () {
        enableCount_1_1 += 1;
      });
      ent1_1_2.on('enable', function () {
        enableCount_1_2 += 1;
      });
      ent1_2.on('enable', function () {
        enableCount_2 += 1;
      });
      ent1_2_1.on('enable', function () {
        enableCount_2_1 += 1;
      });
      ent1_2_2.on('enable', function () {
        enableCount_2_2 += 1;
      });

      ent1_1.setParent(ent0);
      ent1_2.setParent(ent0);
      engine.tick();

      t.equal(enableCount_1, 1);
      t.equal(enableCount_1_1, 1);
      t.equal(enableCount_1_2, 1);
      t.equal(enableCount_2, 0);
      t.equal(enableCount_2_1, 0);
      t.equal(enableCount_2_2, 0);

      t.end();
    });

    t.end();
  });

  tap.test('disable', t => {
    let engine = new Engine();

    tap.test('entity.destroy()', t => {
      let disableCount = 0;
      let ent1 = engine.createEntity('Entity1');
      engine.tick();
      ent1.on('disable', function () {
        disableCount += 1;
      });

      ent1.destroy();
      engine.tick();
      t.equal(disableCount, 1);

      t.end();
    });

    tap.test('entity.deepClone() then entity.destroy()', t => {
      let ent1 = engine.createEntity();
      let ent1_1 = engine.createEntity();
      let ent1_2 = engine.createEntity();
      let ent1_1_1 = engine.createEntity();
      let ent1_1_2 = engine.createEntity();
      let ent1_2_1 = engine.createEntity();
      let ent1_2_2 = engine.createEntity();
      ent1_1.setParent(ent1);
      ent1_2.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      ent1_1_2.setParent(ent1_1);
      ent1_2_1.setParent(ent1_2);
      ent1_2_2.setParent(ent1_2);

      let ent2 = ent1.deepClone();

      let disableCount = 0;
      let disableCount_1 = 0;
      let disableCount_2 = 0;
      let disableCount_1_1 = 0;
      let disableCount_1_2 = 0;
      let disableCount_2_1 = 0;
      let disableCount_2_2 = 0;

      ent2.on('disable', function () {
        disableCount += 1;
      });
      ent2._children[0].on('disable', function () {
        disableCount_1 += 1;
      });
      ent2._children[1].on('disable', function () {
        disableCount_2 += 1;
      });
      ent2._children[0]._children[0].on('disable', function () {
        disableCount_1_1 += 1;
      });
      ent2._children[0]._children[1].on('disable', function () {
        disableCount_1_2 += 1;
      });
      ent2._children[1]._children[0].on('disable', function () {
        disableCount_2_1 += 1;
      });
      ent2._children[1]._children[1].on('disable', function () {
        disableCount_2_2 += 1;
      });
      engine.tick();

      ent2.destroy();
      engine.tick();

      t.equal(disableCount, 1);
      t.equal(disableCount_1, 1);
      t.equal(disableCount_2, 1);
      t.equal(disableCount_1_1, 1);
      t.equal(disableCount_1_2, 1);
      t.equal(disableCount_2_1, 1);
      t.equal(disableCount_2_2, 1);

      t.end();
    });

    tap.test('entity.enabled = false', t => {
      let disableCount = 0;
      let ent1 = engine.createEntity('Entity1');
      engine.tick();
      ent1.on('disable', function () {
        disableCount += 1;
      });
      ent1.enabled = false;

      t.equal(disableCount, 1);

      t.end();
    });

    tap.test('entity.deepClone() then entity.enabled = false', t => {
      let ent1 = engine.createEntity();
      let ent1_1 = engine.createEntity();
      let ent1_2 = engine.createEntity();
      let ent1_1_1 = engine.createEntity();
      let ent1_1_2 = engine.createEntity();
      let ent1_2_1 = engine.createEntity();
      let ent1_2_2 = engine.createEntity();
      ent1_1.setParent(ent1);
      ent1_2.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      ent1_1_2.setParent(ent1_1);
      ent1_2_1.setParent(ent1_2);
      ent1_2_2.setParent(ent1_2);

      let ent2 = ent1.deepClone();

      let disableCount = 0;
      let disableCount_1 = 0;
      let disableCount_2 = 0;
      let disableCount_1_1 = 0;
      let disableCount_1_2 = 0;
      let disableCount_2_1 = 0;
      let disableCount_2_2 = 0;

      ent2.on('disable', function () {
        disableCount += 1;
      });
      ent2._children[0].on('disable', function () {
        disableCount_1 += 1;
      });
      ent2._children[1].on('disable', function () {
        disableCount_2 += 1;
      });
      ent2._children[0]._children[0].on('disable', function () {
        disableCount_1_1 += 1;
      });
      ent2._children[0]._children[1].on('disable', function () {
        disableCount_1_2 += 1;
      });
      ent2._children[1]._children[0].on('disable', function () {
        disableCount_2_1 += 1;
      });
      ent2._children[1]._children[1].on('disable', function () {
        disableCount_2_2 += 1;
      });
      engine.tick();

      ent2.enabled = false;

      t.equal(disableCount, 1);
      t.equal(disableCount_1, 1);
      t.equal(disableCount_2, 1);
      t.equal(disableCount_1_1, 1);
      t.equal(disableCount_1_2, 1);
      t.equal(disableCount_2_1, 1);
      t.equal(disableCount_2_2, 1);

      t.end();
    });

    tap.test('move the entity from enabled parent to a disabled parent', t => {

      /**
       * [x] ent0
       * [o] ent1
       *  |- [o] ent1_1
       *      |- [o] ent1_1_1
       *      |- [o] ent1_1_2
       *  |- [x] ent1_2
       *      |- [o] ent1_2_1
       *      |- [o] ent1_2_1
       * 
       * ent1.setParent(ent0)
       */

      let ent0 = engine.createEntity('ent0');
      let ent1 = engine.createEntity('ent1');
      let ent1_1 = engine.createEntity('ent1_1');
      let ent1_2 = engine.createEntity('ent1_2');
      let ent1_1_1 = engine.createEntity('ent1_1_1');
      let ent1_1_2 = engine.createEntity('ent1_1_2');
      let ent1_2_1 = engine.createEntity('ent1_2_1');
      let ent1_2_2 = engine.createEntity('ent1_2_2');

      ent0.enabled = false;
      ent1_2.enabled = false;

      ent1_1.setParent(ent1);
      ent1_2.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      ent1_1_2.setParent(ent1_1);
      ent1_2_1.setParent(ent1_2);
      ent1_2_2.setParent(ent1_2);
      engine.tick();

      let disableCount_1 = 0;
      let disableCount_2 = 0;
      let disableCount_1_1 = 0;
      let disableCount_1_2 = 0;
      let disableCount_2_1 = 0;
      let disableCount_2_2 = 0;
      ent1_1.on('disable', function () {
        disableCount_1 += 1;
      });
      ent1_1_1.on('disable', function () {
        disableCount_1_1 += 1;
      });
      ent1_1_2.on('disable', function () {
        disableCount_1_2 += 1;
      });
      ent1_2.on('disable', function () {
        disableCount_2 += 1;
      });
      ent1_2_1.on('disable', function () {
        disableCount_2_1 += 1;
      });
      ent1_2_2.on('disable', function () {
        disableCount_2_2 += 1;
      });

      ent1.setParent(ent0);
      engine.tick();

      t.equal(disableCount_1, 1);
      t.equal(disableCount_1_1, 1);
      t.equal(disableCount_1_2, 1);
      t.equal(disableCount_2, 0);
      t.equal(disableCount_2_1, 0);
      t.equal(disableCount_2_2, 0);

      t.end();
    });

    t.end();
  });

  tap.test('ready', t => {
    let engine = new Engine();

    tap.test('entity.create()', t => {
      let readyCount = 0;
      let ent1 = engine.createEntity('Entity1');
      ent1.on('ready', function () {
        readyCount += 1;
      });
      engine.tick();
      t.equal(readyCount, 1);

      t.end();
    });

    tap.test('entity.clone()', t => {
      let readyCount = 0;
      let ent1 = engine.createEntity('Entity1');

      let ent2 = ent1.clone();
      ent2.on('ready', function () {
        readyCount += 1;
      });
      engine.tick();
      t.equal(readyCount, 1);

      t.end();
    });

    tap.test('entity.deepClone()', t => {
      let ent1 = engine.createEntity();
      let ent1_1 = engine.createEntity();
      let ent1_2 = engine.createEntity();
      let ent1_1_1 = engine.createEntity();
      let ent1_1_2 = engine.createEntity();
      let ent1_2_1 = engine.createEntity();
      let ent1_2_2 = engine.createEntity();
      ent1_1.setParent(ent1);
      ent1_2.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      ent1_1_2.setParent(ent1_1);
      ent1_2_1.setParent(ent1_2);
      ent1_2_2.setParent(ent1_2);

      let ent2 = ent1.deepClone();

      let readyCount = 0;
      let readyCount_1 = 0;
      let readyCount_2 = 0;
      let readyCount_1_1 = 0;
      let readyCount_1_2 = 0;
      let readyCount_2_1 = 0;
      let readyCount_2_2 = 0;

      ent2.on('ready', function () {
        readyCount += 1;
      });
      ent2._children[0].on('ready', function () {
        readyCount_1 += 1;
      });
      ent2._children[1].on('ready', function () {
        readyCount_2 += 1;
      });
      ent2._children[0]._children[0].on('ready', function () {
        readyCount_1_1 += 1;
      });
      ent2._children[0]._children[1].on('ready', function () {
        readyCount_1_2 += 1;
      });
      ent2._children[1]._children[0].on('ready', function () {
        readyCount_2_1 += 1;
      });
      ent2._children[1]._children[1].on('ready', function () {
        readyCount_2_2 += 1;
      });
      engine.tick();

      t.equal(readyCount, 1);
      t.equal(readyCount_1, 1);
      t.equal(readyCount_2, 1);
      t.equal(readyCount_1_1, 1);
      t.equal(readyCount_1_2, 1);
      t.equal(readyCount_2_1, 1);
      t.equal(readyCount_2_2, 1);

      t.end();
    });

    t.end();
  });

  t.end();
});