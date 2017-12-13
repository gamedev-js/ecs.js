const tap = require('tap');
const { Engine, System, Component } = require('../dist/ecs');

tap.test('system', t => {
  let engine = new Engine();

  tap.test('system.add()', t => {
    tap.test('system.add() during entity.addComp()', t => {
      let addFooCount = 0;
      let addBarCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }

        add() {
          addFooCount += 1;
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }

        add() {
          addBarCount += 1;
        }
      }

      engine.registerClass('Foo', Foo);
      engine.registerClass('Bar', Bar);
      engine.registerSystem('foo.sys', FooSystem, 'Foo');
      engine.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = engine.createEntity('ent1');
      engine.tick();

      ent1.addComp('Foo');
      engine.tick();

      t.equal(addFooCount, 1);

      addFooCount = 0;
      ent1.addComp('Bar');
      engine.tick();

      t.equal(addFooCount, 1);
      t.equal(addBarCount, 1);

      t.end();
    });

    tap.test('system.add() during entity.clone()', t => {
      let addFooCount = 0;
      let addBarCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }

        add() {
          addFooCount += 1;
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }

        add() {
          addBarCount += 1;
        }
      }

      engine.registerClass('Foo', Foo);
      engine.registerClass('Bar', Bar);
      engine.registerSystem('foo.sys', FooSystem, 'Foo');
      engine.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = engine.createEntity('ent1');
      engine.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');
      engine.tick();

      t.equal(addFooCount, 2);
      t.equal(addBarCount, 1);

      addFooCount = 0;
      addBarCount = 0;

      let ent2 = ent1.clone();
      engine.tick();

      t.equal(addFooCount, 2);
      t.equal(addBarCount, 1);

      t.end();
    });

    tap.test('system.add() during entity.deepClone()', t => {

      /**
      * ent1 <= Foo
      *  |- ent1_1 <= Bar
      *
      * ent1.deepClone()
      */

      let addFooCount = 0;
      let addBarCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }

        add() {
          addFooCount += 1;
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }

        add() {
          addBarCount += 1;
        }
      }

      engine.registerClass('Foo', Foo);
      engine.registerClass('Bar', Bar);
      engine.registerSystem('foo.sys', FooSystem, 'Foo');
      engine.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = engine.createEntity('ent1');
      let ent1_1 = engine.createEntity('ent1_1');
      ent1_1.setParent(ent1);
      engine.tick();

      ent1.addComp('Foo');
      ent1_1.addComp('Bar');
      engine.tick();

      t.equal(addFooCount, 2);
      t.equal(addBarCount, 1);

      addFooCount = 0;
      addBarCount = 0;

      let ent2 = ent1.deepClone();
      engine.tick();

      t.equal(addFooCount, 2);
      t.equal(addBarCount, 1);

      t.end();
    });

    t.end();
  });

  tap.test('system.remove()', t => {

    tap.test('remove component during component.destroy()', t => {
      let rmFooCount = 0;
      let rmBarCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }

        remove() {
          rmFooCount += 1;
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }

        remove() {
          rmBarCount += 1;
        }
      }

      engine.registerClass('Foo', Foo);
      engine.registerClass('Bar', Bar);
      engine.registerSystem('foo.sys', FooSystem, 'Foo');
      engine.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = engine.createEntity('ent1');
      engine.tick();

      let foo1 = ent1.addComp('Foo');

      foo1.destroy();
      engine.tick();

      t.equal(rmFooCount, 1);

      rmFooCount = 0;

      let ent2 = engine.createEntity('ent2');
      engine.tick();
      let foo2 = ent2.addComp('Foo');
      let bar2 = ent2.addComp('Bar');

      bar2.destroy();
      engine.tick();

      t.equal(rmFooCount, 1);
      t.equal(rmBarCount, 1);

      rmFooCount = 0;

      foo2.destroy();
      engine.tick();

      t.equal(rmFooCount, 1);

      t.end();
    });

    tap.test('remove component during entity.destroy()', t => {
      let rmFooCount = 0;
      let rmBarCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }

        remove() {
          rmFooCount += 1;
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }

        remove() {
          rmBarCount += 1;
        }
      }

      engine.registerClass('Foo', Foo);
      engine.registerClass('Bar', Bar);
      engine.registerSystem('foo.sys', FooSystem, 'Foo');
      engine.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = engine.createEntity('ent1');
      engine.tick();

      ent1.addComp('Foo');

      ent1.destroy();
      engine.tick();

      t.equal(rmFooCount, 1);

      rmFooCount = 0;
      rmBarCount = 0;

      let ent2 = engine.createEntity('ent2');
      engine.tick();
      ent2.addComp('Foo');
      ent2.addComp('Bar');

      ent2.destroy();
      engine.tick();

      t.equal(rmFooCount, 2);
      t.equal(rmBarCount, 1);

      t.end();
    });

    t.end();
  });

  t.end();
});