## ECS.js

Entity-Component-System

## Install

```bash
npm install ecs.js
```

## Usage

```javascript
let app = new App();

class Foo extends Component {}
class FooSystem extends System {}

app.registerClass('Foo', Foo);
app.registerSystem('foo.sys', FooSystem, 'Foo');

let ent = app.createEntity();
ent.addComp('Foo');

app.tick();
```

## Documentation

TODO

## License

MIT © 2017 Johnny Wu