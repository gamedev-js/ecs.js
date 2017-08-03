import { RecyclePool } from 'memop';

export default class System {
  constructor() {
    this._enabled = true;
    this._items = null;

    // set by engine
    this._engine = null;
    this._priority = 0;
    this._poolSize = 100;
    this._compClass = null;
  }

  _finalize() {
    this._items = new RecyclePool(() => {
      return {
        entity: null,
        component: null,
      };
    }, this._poolSize);
  }

  add(entity, comp) {
    let item = this._items.add();
    item.entity = entity;
    item.component = comp;
  }

  remove(entity, comp) {
    for (let i = 0; i < this._items.length; ++i) {
      let item = this._items.data[i];
      if (item.component === comp) {
        item.entity = null;
        item.component = null;

        this._items.remove(i);
        break;
      }
    }
  }

  tick() {
    console.warn('Please implement tick for your system');
  }
}