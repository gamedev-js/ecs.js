import { Node } from 'scene-graph';
import { EventEmitter } from 'event-sys';

class Base {
  constructor(name) {
    //
    this.__initNode();
    this.__initEventEmitter();

    this.name = name || '';
  }
}
Node.mixin(Base);
EventEmitter.mixin(Base);

export default class Entity extends Base {
  constructor(name) {
    super(name);
    this._comps = [];

    // set by engine
    this._engine = null;
    this._poolID = -1;
    this._destroyed = false;
  }

  get destroyed () {
    return this._destroyed;
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    // TODO: remove all components

    this._destroyed = true;
    this._engine._destroy(this);
  }

  clone() {
    return super.clone((newNode, cur) => {
      newNode._app = cur._app;
      // TODO: clone components
    });
  }

  deepClone() {
    // TODO
    // return super.deepClone((newNode, cur) => {
    //   newNode._app = cur._app;
    //   // TODO: clone components
    // });
  }

  getComp(classname) {
    const ctor = this._engine.getClass(classname);

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        return comp;
      }
    }

    return null;
  }

  getComps(classname) {
    const ctor = this._engine.getClass(classname);
    let results = [];

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        results.push(comp);
      }
    }

    return results;
  }

  addComp(classname) {
    const ctor = this._engine.getClass(classname);

    if (!ctor.__multiple__) {
      if (this.getComp(classname)) {
        return null;
      }
    }

    let comp = new ctor();

    this._comps.push(comp);
    this._engine._onAddComp(this, comp);
    return comp;
  }

  removeComp(classname) {
    const ctor = this._engine.getClass(classname);

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        this._comps.splice(i, 1);
        this._engine._onRemoveComp(this, comp);
        return true;
      }
    }

    return false;
  }

  removeComps(classname) {
    const ctor = this._engine.getClass(classname);
    let removed = false;

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        this._comps.splice(i, 1);
        this._engine._onRemoveComp(this, comp);
        removed = true;
      }
    }

    return removed;
  }
}
