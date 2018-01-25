const tap = require('tap');
const { App, Component } = require('../dist/ecs');

tap.test('component registry', t => {

  tap.test('component.events', t => {
    let app = new App();
    let onFooCount = 0;
    let onBarCount = 0;

    class Foo extends Component {
      constructor() {
        super();
      }

      onFoo() {
        onFooCount += 1;
        t.assert(this instanceof Foo);
      }
    }
    Foo.events = {
      'foo': 'onFoo',
      'bar': 'onBar',
    };

    app.registerClass('Foo', Foo);

    let ent1 = app.createEntity('Entity1');
    ent1.addComp('Foo');
    ent1.emit('foo');

    app.tick();

    t.equal(onFooCount, 1);
    t.equal(onBarCount, 0);

    t.end();
  });

  tap.test('component.events unregister', t => {
    let app = new App();
    let onFooCount = 0;
    let onBarCount = 0;

    class Foo extends Component {
      constructor() {
        super();
      }

      onFoo() {
        onFooCount += 1;
        t.assert(this instanceof Foo);
      }

      onBar() {
        onBarCount += 1;
        t.assert(this instanceof Foo);
      }
    }
    Foo.events = {
      'foo': 'onFoo',
      'bar': 'onBar',
    };

    app.registerClass('Foo', Foo);

    let ent1 = app.createEntity('Entity1');
    let foo = ent1.addComp('Foo');
    ent1.emit('foo');
    ent1.emit('bar');

    // 1st frame
    app.tick();

    t.equal(onFooCount, 1);
    t.equal(onBarCount, 1);

    // if a component destroyed in this frame, it can recieve events
    foo.destroy();
    ent1.emit('foo');
    ent1.emit('bar');

    t.equal(onFooCount, 2);
    t.equal(onBarCount, 2);

    // 2nd frame
    app.tick();

    ent1.emit('foo');
    ent1.emit('bar');

    t.equal(onFooCount, 2);
    t.equal(onBarCount, 2);

    t.end();
  });

  t.end();
});