const tap = require('tap');
const { App, System, Component } = require('../dist/ecs');

tap.test('system', t => {
  let app = new App();

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

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      app.tick();

      ent1.addComp('Foo');
      app.tick();

      t.equal(addFooCount, 1);

      addFooCount = 0;
      ent1.addComp('Bar');
      app.tick();

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

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');
      app.tick();

      t.equal(addFooCount, 2);
      t.equal(addBarCount, 1);

      addFooCount = 0;
      addBarCount = 0;

      let ent2 = ent1.clone();
      app.tick();

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

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      let ent1_1 = app.createEntity('ent1_1');
      ent1_1.setParent(ent1);
      app.tick();

      ent1.addComp('Foo');
      ent1_1.addComp('Bar');
      app.tick();

      t.equal(addFooCount, 2);
      t.equal(addBarCount, 1);

      addFooCount = 0;
      addBarCount = 0;

      let ent2 = ent1.deepClone();
      app.tick();

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

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      app.tick();

      let foo1 = ent1.addComp('Foo');

      foo1.destroy();
      app.tick();

      t.equal(rmFooCount, 1);

      rmFooCount = 0;

      let ent2 = app.createEntity('ent2');
      app.tick();
      let foo2 = ent2.addComp('Foo');
      let bar2 = ent2.addComp('Bar');

      bar2.destroy();
      app.tick();

      t.equal(rmFooCount, 1);
      t.equal(rmBarCount, 1);

      rmFooCount = 0;

      foo2.destroy();
      app.tick();

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

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      app.tick();

      ent1.addComp('Foo');

      ent1.destroy();
      app.tick();

      t.equal(rmFooCount, 1);

      rmFooCount = 0;
      rmBarCount = 0;

      let ent2 = app.createEntity('ent2');
      app.tick();
      ent2.addComp('Foo');
      ent2.addComp('Bar');

      ent2.destroy();
      app.tick();

      t.equal(rmFooCount, 2);
      t.equal(rmBarCount, 1);

      t.end();
    });

    t.end();
  });

  t.end();
});