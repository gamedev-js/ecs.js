const tap = require('tap');
const { App, Component } = require('../dist/ecs');

tap.test('component', t => {

  tap.test('onInit', t => {
    let app = new App();

    tap.test('init component during entity.addcomp()', t => {
      let fooInitCount = 0;
      let barInitCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onInit() {
          fooInitCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onInit() {
          barInitCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');

      t.equal(fooInitCount, 1);
      t.equal(barInitCount, 1);

      t.end();
    });

    tap.test('init component during entity.clone()', t => {
      let fooInitCount = 0;
      let barInitCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onInit() {
          fooInitCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onInit() {
          barInitCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');
      t.equal(fooInitCount, 1);
      t.equal(barInitCount, 1);

      let ent2 = ent1.clone();

      t.equal(fooInitCount, 2);
      t.equal(barInitCount, 2);

      t.end();
    });

    tap.test('init component during entity.deepClone()', t => {
      let fooInitCount = 0;
      let barInitCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onInit() {
          fooInitCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onInit() {
          barInitCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('ent1');
      let ent1_1 = app.createEntity('ent1_1');
      let ent1_1_1 = app.createEntity('ent1_1_1');
      ent1_1.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      app.tick();

      ent1_1.addComp('Foo');
      ent1_1_1.addComp('Bar');
      t.equal(fooInitCount, 1);
      t.equal(barInitCount, 1);

      let ent2 = ent1.deepClone();

      t.equal(fooInitCount, 2);
      t.equal(barInitCount, 2);

      t.end();
    });

    t.end();
  });

  tap.test('onEnable', t => {
    let app = new App();

    tap.test('create compontent during entity.addComp()', t => {
      let fooEnableCount = 0;
      let barEnableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onEnable() {
          fooEnableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');

      t.equal(fooEnableCount, 1);
      t.equal(barEnableCount, 1);

      t.end();
    });

    tap.test('entity.enabled = true', t => {
      let fooEnableCount = 0;
      let barEnableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onEnable() {
          fooEnableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');

      t.equal(fooEnableCount, 1);
      t.equal(barEnableCount, 1);

      ent1.enabled = false;
      ent1.enabled = true;

      t.equal(fooEnableCount, 2);
      t.equal(barEnableCount, 2);

      t.end();
    });

    tap.test('move the entity from disabled parent to a enabled parent', t => {

      /**
       * [o] ent0
       * [x] ent1
       *  |- [o] ent1_1 <= Foo
       *      |- [o] ent1_1_1 <= Bar
       *
       * ent1_1.setParent(ent0)
       */

      let fooEnableCount = 0;
      let barEnableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onEnable() {
          fooEnableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent0 = app.createEntity('ent0');
      let ent1 = app.createEntity('ent1');
      let ent1_1 = app.createEntity('ent1_1');
      let ent1_1_1 = app.createEntity('ent1_1_1');
      ent1.enabled = false;
      ent1_1.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      app.tick();

      ent1_1.addComp('Foo');
      ent1_1_1.addComp('Bar');

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 0);

      ent1_1.setParent(ent0);

      t.equal(fooEnableCount, 1);
      t.equal(barEnableCount, 1);

      t.end();
    });

    t.end();
  });

  tap.test('onDisable', t => {
    let app = new App();

    tap.test('create Component and Component.enabled = false', t => {
      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      let foo = ent1.addComp('Foo');
      let bar = ent1.addComp('Bar');

      foo.enabled = false;
      bar.enabled = false;

      t.equal(fooDisableCount, 1);
      t.equal(fooDisableCount, 1);

      t.end();
    });

    tap.test('comp.destroy() during entity.distroy()', t => {
      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');

      ent1.destroy();

      t.equal(fooDisableCount, 1);
      t.equal(fooDisableCount, 1);

      t.end();
    });

    tap.test('entity.enabled = false', t => {
      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent1 = app.createEntity('Entity1');
      app.tick();

      ent1.addComp('Foo');
      ent1.addComp('Bar');

      ent1.enabled = false;

      t.equal(fooDisableCount, 1);
      t.equal(barDisableCount, 1);

      t.end();
    });

    tap.test('move the entity from enable parent to a disable parent', t => {

      /**
       * [x] ent0
       * [o] ent1
       *  |- [o] ent1_1 <= Foo
       *      |- [o] ent1_1_1 <= Bar
       *
       * ent1_1.setParent(ent0)
       */

      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
        }

        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Foo {
        constructor() {
          super();
        }

        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent0 = app.createEntity('ent0');
      let ent1 = app.createEntity('ent1');
      let ent1_1 = app.createEntity('ent1_1');
      let ent1_1_1 = app.createEntity('ent1_1_1');
      ent0.enabled = false;
      ent1_1.setParent(ent1);
      ent1_1_1.setParent(ent1_1);
      app.tick();

      ent1_1.addComp('Foo');
      ent1_1_1.addComp('Bar');

      ent1_1.setParent(ent0);

      t.equal(fooDisableCount, 1);
      t.equal(barDisableCount, 1);

      t.end();
    });

    t.end();
  });

  tap.test('change the entity status when entity has different status components', t => {
    let app = new App();

    tap.test('ent0.enabled change from true to false', t => {

      /**
       *  [o] ent0 <= (Foo.enabled = false)
       *  [o] ent0 <= (Bar.enabled = true)
       *
       * ent0.enabled change to false
       */

      let fooDisableCount = 0;
      let barDisableCount = 0;
      let fooEnableCount = 0;
      let barEnableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
          this._enabled = false;
        }

        onEnable() {
          fooEnableCount += 1;
        }
        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent0 = app.createEntity('ent0');
      app.tick();

      ent0.addComp('Foo');
      ent0.addComp('Bar');

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 1);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 0);

      ent0.enabled = false;

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 1);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 1);

      t.end();
    });

    tap.test('ent0.enabled change from false to true', t => {

      /**
       *  [o] ent0 <= (Foo.enabled = false)
       *  [o] ent0 <= (Bar.enabled = true)
       *
       * ent0.enabled change from false to true
       */

      let fooEnableCount = 0;
      let barEnableCount = 0;
      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
          this._enabled = false;
        }

        onEnable() {
          fooEnableCount += 1;
        }
        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent0 = app.createEntity('ent0');
      app.tick();

      ent0.addComp('Foo');
      ent0.addComp('Bar');

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 1);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 0);

      ent0.enabled = false;
      ent0.enabled = true;

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 2);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 1);

      t.end();
    });

    tap.test('move the entity which has enabled false components from enable parent to a disable parent', t => {

      /**
       * [x] ent0
       * [o] ent1
       *  |- [o] ent1_1 <= (Foo.enabled = false)
       *  |- [o] ent1_1 <= (Bar.enabled = true)
       *
       * ent1_1.setParent(ent0)
       */

      let fooEnableCount = 0;
      let barEnableCount = 0;
      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
          this._enabled = false;
        }

        onEnable() {
          fooEnableCount += 1;
        }
        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent0 = app.createEntity('ent0');
      let ent1 = app.createEntity('ent1');
      let ent1_1 = app.createEntity('ent1_1');
      ent0.enabled = false;
      ent1_1.setParent(ent1);
      app.tick();

      ent1_1.addComp('Foo');
      ent1_1.addComp('Bar');

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 1);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 0);

      ent1_1.setParent(ent0);

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 1);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 1);

      t.end();
    });

    tap.test('move the entity which has enabled false components from enable parent to a disable parent', t => {

      /**
       * [o] ent0
       * [x] ent1
       *  |- [o] ent1_1 <= (Foo.enabled = false)
       *  |- [o] ent1_1 <= (Bar.enabled = true)
       *
       * ent1_1.setParent(ent0)
       */

      let fooEnableCount = 0;
      let barEnableCount = 0;
      let fooDisableCount = 0;
      let barDisableCount = 0;

      class Foo extends Component {
        constructor() {
          super();
          this._enabled = false;
        }

        onEnable() {
          fooEnableCount += 1;
        }
        onDisable() {
          fooDisableCount += 1;
        }
      }

      class Bar extends Component {
        constructor() {
          super();
        }

        onEnable() {
          barEnableCount += 1;
        }
        onDisable() {
          barDisableCount += 1;
        }
      }

      app.registerClass('Foo', Foo);
      app.registerClass('Bar', Bar);
      let ent0 = app.createEntity('ent0');
      let ent1 = app.createEntity('ent1');
      let ent1_1 = app.createEntity('ent1_1');
      ent1.enabled = false;
      ent1_1.setParent(ent1);
      app.tick();

      ent1_1.addComp('Foo');
      ent1_1.addComp('Bar');

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 0);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 0);

      ent1_1.setParent(ent0);

      t.equal(fooEnableCount, 0);
      t.equal(barEnableCount, 1);
      t.equal(fooDisableCount, 0);
      t.equal(barDisableCount, 0);

      t.end();
    });

    t.end();
  });

  t.end();
});