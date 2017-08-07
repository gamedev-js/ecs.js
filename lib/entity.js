import { Node, utils } from 'scene-graph';
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

    // NOTE: _ancestorEnabled not include self
    this._ancestorEnabled = true;
    this._destroyed = false;
    this._comps = [];

    // engine internal data
    this._engine = null;
    this._poolID = -1;
  }

  set enabled(val) {
    if (this._enabled === val) {
      return;
    }

    this._enabled = val;

    if (this._ancestorEnabled) {
      // NOTE: we can not emit event during calculating the _enabledInHierarchy
      utils.walk(this, function (n) {
        n._ancestorEnabled = n._parent.enabledInHierarchy;
        return true;
      });

      this._engine._notifyEnableChanged(this, val);
    }
  }

  get enabledInHierarchy() {
    return this._enabled && this._ancestorEnabled;
  }

  get destroyed () {
    return this._destroyed;
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    // mark as destroyed
    this._destroyed = true;

    // recursively destroy child entities
    for (let i = 0; i < this._children.length; ++i) {
      let child = this._children[i];
      child.destroy();
    }

    // remove all components
    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      comp.destroy();
    }

    // submit destroy request
    this._engine._destroyEntity(this);
  }

  _onParentChanged() {
    // update _acestorEnabled
    let oldEnabledInHierarchy = this.enabledInHierarchy;

    if (!this._parent) {
      this._ancestorEnabled = true;
    } else {
      this._ancestorEnabled = this._parent.enabledInHierarchy;
    }

    let newEnabledInHierarchy = this.enabledInHierarchy;

    // emit parent-changed event
    this.emit('parent-changed');

    // if enabledInHierarchy changed
    if ( oldEnabledInHierarchy !== newEnabledInHierarchy ) {
      this._notifyEnableChanged(this, newEnabledInHierarchy);
    }
  }

  clone() {
    // TODO: clone & deepClone will mute the event and component callback
    // return utils.clone(this, (newNode, cur) => {
    //   newNode._app = cur._app;
    //   // TODO: clone components
    // });
  }

  deepClone() {
    // TODO
    // return utils.deepClone(this, (newNode, cur) => {
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

    return this._engine._createComp(ctor, this);
  }
}
