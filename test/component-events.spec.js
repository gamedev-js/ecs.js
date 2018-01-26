const tap = require('tap');
const { App, Component } = require('../dist/ecs');

tap.test('component.events', t => {

  tap.test('register', t => {
    let app = new App();
    let onFooCount = 0;

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
    };

    app.registerClass('Foo', Foo);

    let ent1 = app.createEntity('Entity1');
    ent1.addComp('Foo');
    ent1.emit('foo');

    app.tick();

    t.equal(onFooCount, 1);

    t.end();
  });

  tap.test('register with unused event', t => {
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

  tap.test('register with inherit', t => {
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
    };

    class Bar extends Foo {
      constructor() {
        super();
      }

      onBar() {
        onBarCount += 1;
        t.assert(this instanceof Foo);
      }
    }
    Bar.events = {
      'bar': 'onBar',
    };

    app.registerClass('Foo', Foo);
    app.registerClass('Bar', Bar);

    let ent1 = app.createEntity('Entity1');
    ent1.addComp('Bar');
    ent1.emit('foo');
    ent1.emit('bar');

    app.tick();

    t.equal(onFooCount, 1);
    t.equal(onBarCount, 1);

    t.end();
  });

  tap.test('unregister', t => {
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

  tap.test('unregister with inherit', t => {
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
    };

    class Bar extends Foo {
      constructor() {
        super();
      }

      onBar() {
        onBarCount += 1;
        t.assert(this instanceof Foo);
      }
    }
    Bar.events = {
      'bar': 'onBar',
    };

    app.registerClass('Foo', Foo);
    app.registerClass('Bar', Bar);

    let ent1 = app.createEntity('Entity1');
    let bar = ent1.addComp('Bar');
    app.tick();

    bar.destroy();
    app.tick();

    ent1.emit('foo');
    ent1.emit('bar');

    t.equal(onFooCount, 0);
    t.equal(onBarCount, 0);

    t.end();
  });

  tap.test('clone', t => {
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

    let ent2 = app.cloneEntity(ent1);
    ent2.emit('foo');

    app.tick();

    t.equal(onFooCount, 1);
    t.equal(onBarCount, 0);

    t.end();
  });

  tap.test('deepClone', t => {
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
    let ent11 = app.createEntity('Entity11');
    ent11.addComp('Foo');
    ent11.setParent(ent1);

    let ent2 = app.deepCloneEntity(ent1);
    ent2.children[0].emit('foo');

    app.tick();

    t.equal(onFooCount, 1);
    t.equal(onBarCount, 0);

    t.end();
  });

  t.end();
});