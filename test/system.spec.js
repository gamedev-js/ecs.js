const tap = require('tap');
const { App, System, Component } = require('../dist/ecs');

tap.test('system', t => {
  let app = new App();

  tap.test('system reference', t => {
    tap.test('system reference during entity.addComp()', t => {
      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      app.tick();

      let foo = ent1.addComp('Foo');
      app.tick();

      t.equal(foo._system._id, 'foo.sys');

      let bar = ent1.addComp('Bar');
      app.tick();

      t.equal(bar._system._id, 'bar.sys');

      t.end();
    });

    tap.test('system referenced during entity.clone()', t => {
      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');
      let ent1 = app.createEntity('ent1');
      app.tick();

      let foo = ent1.addComp('Foo');
      let bar = ent1.addComp('Bar');
      app.tick();

      t.equal(foo._system._id, 'foo.sys');
      t.equal(bar._system._id, 'bar.sys');

      let ent2 = ent1.clone();
      app.tick();

      t.equal(ent2.getComp('Foo')._system._id, 'foo.sys');
      t.equal(ent2.getComp('Bar')._system._id, 'bar.sys');

      t.end();
    });

    tap.test('system referenced during entity.deepClone()', t => {

      /**
      * ent1 <= Foo
      *  |- ent1_1 <= Bar
      *
      * ent1.deepClone()
      */

      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
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

      let foo = ent1.addComp('Foo');
      let bar = ent1_1.addComp('Bar');
      app.tick();

      t.equal(foo._system._id, 'foo.sys');
      t.equal(bar._system._id, 'bar.sys');

      let ent2 = ent1.deepClone();
      app.tick();

      t.equal(ent2.getComp('Foo')._system._id, 'foo.sys');
      t.equal(ent2.children[0].getComp('Bar')._system._id, 'bar.sys');

      t.end();
    });

    t.end();
  });

  tap.test('system dereference', t => {

    tap.test('remove component during component.destroy()', t => {
      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
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

      t.equal(foo1._system, null);

      let ent2 = app.createEntity('ent2');
      app.tick();
      let foo2 = ent2.addComp('Foo');
      let bar2 = ent2.addComp('Bar');

      bar2.destroy();
      app.tick();

      t.equal(foo2._system._id, 'foo.sys');
      t.equal(bar2._system, null);

      foo2.destroy();
      app.tick();

      t.equal(foo2._system, null);

      t.end();
    });

    tap.test('remove component during entity.destroy()', t => {
      class Foo extends Component {
        constructor() {
          super();
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }
      }

      class FooSystem extends System {
        constructor() {
          super();
        }
      }

      class BarSystem extends System {
        constructor() {
          super();
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      app.registerSystem('foo.sys', FooSystem, 'Foo');
      app.registerSystem('bar.sys', BarSystem, 'Bar');

      let ent1 = app.createEntity('ent1');
      app.tick();

      let foo = ent1.addComp('Foo');
      let bar = ent1.addComp('Bar');

      ent1.destroy();
      app.tick();

      t.equal(foo._system, null);
      t.equal(bar._system, null);

      t.end();
    });

    t.end();
  });

  t.end();
});