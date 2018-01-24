const tap = require('tap');
const { App, System, Component } = require('../dist/ecs');

tap.test('app', t => {

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

    let app = new App();
    app.registerClass('Foo', Foo);
    app.registerClass('Bar', Bar);

    let foo = new Foo();
    let bar = new Bar();

    t.equal(foo.constructor, Foo);
    t.equal(app.getClass('Foo'), Foo);
    t.equal(app.getClassName(foo), 'Foo');
    t.equal(app.getClassName(Foo), 'Foo');

    t.equal(bar.constructor, Bar);
    t.equal(app.getClass('Bar'), Bar);
    t.equal(app.getClassName(bar), 'Bar');
    t.equal(app.getClassName(Bar), 'Bar');

    t.end();
  });

  tap.test('registerSystem', t => {
    class Foo extends Component {
      constructor() {
        super();
      }

      onInit () {
        this._system.add(this);
      }

      onDestroy () {
        this._system.remove(this);
      }
    }

    class Bar extends Foo {
      constructor() {
        super();
      }
    }

    let app = new App();
    app.registerClass('Foo', Foo);
    app.registerClass('Bar', Bar);

    let tickCount = 0;
    let postTickCount = 0;

    class FooSystem extends System {
      constructor() {
        super();
        this._components = [];
      }

      init () {
      }

      tick () {
        tickCount += 1;
      }

      postTick() {
        postTickCount += 1;
      }

      add(comp) {
        this._components.push(comp);
      }

      remove(comp) {
        this._components.splice(this._components.indexOf(comp), 1);
      }
    }

    app.registerSystem('foo.sys', FooSystem, 'Foo', 10);

    let ent1 = app.createEntity();
    ent1.addComp('Foo');
    ent1.addComp('Bar');

    app.tick();

    t.equal(tickCount, 1);
    t.equal(postTickCount, 1);
    t.equal(app._systems[0]._components.length, 2);

    t.end();
  });

  t.end();
});