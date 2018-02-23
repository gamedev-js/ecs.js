const tap = require('tap');
const { App } = require('../dist/ecs');

tap.test('component.schema', t => {
  tap.test('register', t => {
    let app = new App();

    app.registerType('number', {
      default: 0,
      parse(data) {
        return data;
      },
    });
    app.registerType('string', {
      default: '',
      parse(data) {
        return data;
      }
    });

    class Foo {
      constructor() {
      }
    }
    Foo.schema = {
      name: { type: 'string' },
      id: { default: 20 },
    };

    app.registerClass('Foo', Foo);

    let foo = app.createObject('Foo');

    t.equal(foo._name, '');
    t.equal(foo._id, 20);

    t.equal(foo.name, '');
    t.equal(foo.id, 20);

    t.end();
  });

  tap.test('register array', t => {
    let app = new App();

    app.registerType('number', {
      default: 0,
      parse(data) {
        if (typeof data === 'string') {
          return parseInt(data);
        }
        return data;
      },
    });
    app.registerType('string', {
      default: '',
      parse(data) {
        return data;
      }
    });

    class Foo {
      constructor() {
      }
    }
    Foo.schema = {
      names: { type: 'string', default: [] },
      ids: { type: 'number', default: [10, 20, 30]  },
      ids2: { type: 'number', default: ['11', '21', '31']  },
    };

    app.registerClass('Foo', Foo);

    let foo = app.createObject('Foo');

    t.deepEqual(foo.names, []);
    t.equal(foo.ids[1], 20);
    t.equal(foo.ids2[1], 21);

    t.end();
  });

  tap.test('register object', t => {
    let app = new App();

    app.registerType('number', {
      default: 0,
      parse(data) {
        if (typeof data === 'string') {
          return parseInt(data);
        }
        return data;
      },
    });
    app.registerType('string', {
      default: '',
      parse(data) {
        return data;
      }
    });

    class Foo {
      constructor() {
      }
    }
    Foo.schema = {
      name: { type: 'string' },
      id: { default: 20 },
    };
    app.registerClass('Foo', Foo);

    class Bar {
      constructor() {
      }
    }
    Bar.schema = {
      foo: { type: 'Foo' },
    };
    app.registerClass('Bar', Bar);

    let bar = app.createObject('Bar');
    t.assert(bar.foo instanceof Foo);
    t.equal(bar.foo.name, '');
    t.equal(bar.foo.id, 20);

    bar.foo = { name: 'Mike', id: 1001 };
    t.assert(bar.foo instanceof Foo);
    t.equal(bar.foo.name, 'Mike');
    t.equal(bar.foo.id, 1001);

    t.end();
  });

  t.end();
});