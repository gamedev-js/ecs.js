const tap = require('tap');
const { Engine, System, Component } = require('../dist/ecs');

tap.test('component', t => {

  tap.test('onInit', t => {
    let initCount = 0;

    class Foo extends Component {
      constructor() {
        super();
      }

      onInit() {
        initCount += 1;
      }
    }

    class Bar extends Foo {
      constructor() {
        super();
      }

      onInit() {
        console.log('Bar onInit');
        initCount += 1;
      }
    }

    class Tip extends Foo {
      constructor() {
        super();
      }

      onInit() {
        console.log('Tip onInit');
        initCount += 1;
      }
    }

    let engine = new Engine();
    engine.registerClass('Foo', Foo);
    engine.registerClass('Bar', Bar);
    engine.registerClass('Tip', Tip);

    let ent1 = engine.createEntity('Entity1');

    //Clone, deepClone a empty entity and add component to trigger onInit
    let ent2 = ent1.clone();
    ent2.addComp('Foo');
    t.equal(initCount, 1);
    
    let ent3 = ent1.deepClone();
    ent3.addComp('Foo');
    t.equal(initCount, 2);

    engine.tick();

    //Add a component to ent1 and clone, deepClone it to trigger onInit
    ent1.addComp('Foo');
    t.equal(initCount, 3);

    ent1.clone();
    t.equal(initCount, 4);

    ent1.deepClone();
    t.equal(initCount, 5);

    //Add components
    console.log('Add components trigger sequence:');
    ent1.addComp('Bar');
    t.equal(initCount, 6);
    ent1.addComp('Tip');
    t.equal(initCount, 7);

    console.log('Clone trigger sequence:');
    ent1.clone();
    t.equal(initCount, 10);

    console.log('DeepClone trigger sequence:');
    ent1.deepClone();
    t.equal(initCount, 13);

    // create childEnt1,childEnt2 belong to a hierarchy
    let childEnt1 = engine.createEntity('childEnt1');
    engine.tick();
    childEnt1.setParent(ent1);
    let childEnt2 = engine.createEntity('childEnt2');
    engine.tick();
    childEnt2.setParent(ent1);
    
    childEnt1.addComp('Foo');
    t.equal(initCount, 14);
    childEnt1.clone();
    t.equal(initCount, 15);
    childEnt1.deepClone();
    t.equal(initCount, 16);

    childEnt2.addComp('Foo');
    t.equal(initCount, 17);
    childEnt2.clone();
    t.equal(initCount, 18);
    childEnt2.deepClone();
    t.equal(initCount, 19);

    t.end();
  });

  tap.test('onEnable', t => {
    let onEnableCount = 0;

    class Foo extends Component {
      constructor() {
        super();
      }

      onEnable() {
        onEnableCount += 1;
      }
    }

    let engine = new Engine();
    engine.registerClass('Foo', Foo);

    //createComp trigger
    let ent1 = engine.createEntity('Entity1');
    let com1 = ent1.addComp('Foo');
    engine.tick();
    t.equal(onEnableCount, 1);

    //entity enabled trigger
    ent1._onEnableChanged();
    t.equal(onEnableCount, 2);

    t.end();
  });

  tap.test('onDisable', t => {
    let onDisableCount = 0;

    class Foo extends Component {
      constructor() {
        super();
      }

      onDisable() {
        onDisableCount += 1;
      }
    }

    let engine = new Engine();
    engine.registerClass('Foo', Foo);
    let ent1 = engine.createEntity('Entity1');
    let com1 = ent1.addComp('Foo');
    engine.tick();

    // component destroy trigger
    com1.destroy();
    t.equal(onDisableCount, 1);

    t.end();
  });

  t.end();
});