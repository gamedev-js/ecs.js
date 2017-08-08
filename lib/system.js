export default class System {
  constructor() {
    this._enabled = true;

    // set by engine
    this._id = '';
    this._engine = null;
    this._priority = 0;
    this._compClass = null;
  }

  finalize() {
    console.warn('Please implement finalize');

    // Example:
    // this._components = new FixedArray(this._poolSize);
  }

  add(/*comp*/) {
    console.warn('Please implement add');

    // Example:
    // this._components.push(comp);
  }

  remove(/*comp*/) {
    console.warn('Please implement remove');

    // Example:
    // for (let i = 0; i < this._components.length; ++i) {
    //   let component = this._components.data[i];
    //   if (component === comp) {
    //     this._components.fastRemove(i);
    //     break;
    //   }
    // }
  }

  tick() {
    console.warn('Please implement tick for your system');

    // Example:
    // for (let i = 0; i < this._components.length; ++i) {
    //   let comp = this._components[i];
    //   comp.update();
    // }
  }

  postTick() {
    console.warn('Please implement postTick for your system');

    // Example:
    // for (let i = 0; i < this._components.length; ++i) {
    //   let comp = this._components[i];
    //   comp.postUpdate();
    // }
  }
}