const tap = require('tap');
const { Engine, System, Component } = require('../dist/ecs');

tap.test('engine', t => {

  tap.test('registerClass', t => {
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

    let engine = new Engine();
    engine.registerClass('Foo', Foo);
    engine.registerClass('Bar', Bar);

    let foo = new Foo();
    let bar = new Bar();

    t.equal(foo.constructor, Foo);
    t.equal(engine.getClass('Foo'), Foo);
    t.equal(engine.getClassName(foo), 'Foo');
    t.equal(engine.getClassName(Foo), 'Foo');

    t.equal(bar.constructor, Bar);
    t.equal(engine.getClass('Bar'), Bar);
    t.equal(engine.getClassName(bar), 'Bar');
    t.equal(engine.getClassName(Bar), 'Bar');

    t.end();
  });

  tap.test('registerSystem', t => {
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

    let engine = new Engine();
    engine.registerClass('Foo', Foo);
    engine.registerClass('Bar', Bar);

    let tickCount = 0;

    class FooSystem extends System {
      constructor() {
        super();
      }

      tick () {
        tickCount += 1;
      }
    }

    class BarSystem extends System {
      constructor() {
        super();
      }

      tick () {
        tickCount += 1;
      }
    }

    engine.registerSystem('foo.sys', FooSystem, 'Foo', 10);
    engine.registerSystem('bar.sys', BarSystem, 'Bar', 20);

    let ent1 = engine.createEntity();
    ent1.addComp('Foo');
    ent1.addComp('Bar');

    engine.tick();

    t.equal(tickCount, 2);
    t.equal(engine._systems[0]._items.length, 2);
    t.equal(engine._systems[1]._items.length, 1);

    t.end();
  });

  t.end();
});