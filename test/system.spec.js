const tap = require('tap');
const { Engine, System, Component } = require('../dist/ecs');

tap.test('system', t => {
  class Foo extends Component {
    constructor() {
      super();
    }
  }

  let addCount = 0;
  let removeCount = 0;

  class FooSystem extends System {
    constructor() {
      super();
    }

    add() {
      addCount += 1;
    }

    remove() {
      removeCount += 1;
    }
  }

  let engine = new Engine();
  engine.registerClass('Foo', Foo);
  engine.registerSystem('foo.sys', FooSystem, 'Foo');

  //addComp callback
  let ent1 = engine.createEntity();
  ent1.addComp('Foo');
  engine.tick();

  t.equal(addCount, 1);

  //removeComp callback
  ent1.destroy();
  engine.tick();

  t.equal(removeCount, 1);

  t.end();
})