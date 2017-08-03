## Input States

Update input states every frame.

## Install

```bash
npm install input.js
```

## Usage

```javascript
let input = new Input();

function animate() {
  if (input.keydown('w')) {
    console.log('key w down');
  }

  input.reset();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

## Documentation

TODO

## TODO

 - options
   - lock-filter (a filter function to decide if enter the lock state)
 - api
   - installTouches()
 - extensions
   - input.mouseclick(name, downupSpan, dragDistance)
   - input.mouseclicks(name, clickCount, downupSpan, clickSpan, dragDistance)
   - input.keyclick(name, downupSpan)
   - input.keyclicks(name, clickCount, downupSpan, clickSpan)

## License

MIT © 2017 Johnny Wu