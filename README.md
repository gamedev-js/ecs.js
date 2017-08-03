## ECS.js

Entity-Component-System

## Install

```bash
npm install ecs.js
```

## Usage

```javascript
let engine = new Engine();

class Foo extends Component {}
class FooSystem extends System {}

engine.registerClass('Foo', Foo);
engine.registerSystem('foo.sys', FooSystem, 'Foo');

let ent = engine.createEntity();
ent.addComp('Foo');

engine.tick();
```

## Documentation

TODO

## License

MIT © 2017 Johnny Wu