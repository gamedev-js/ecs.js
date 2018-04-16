import { Node, utils } from 'scene-graph';
import { EventEmitter } from 'event-sys';

const _setParent = Node.prototype.setParent;

export default class Entity {
  constructor(name) {
    this.__initNode();
    this.__initEventEmitter();

    this.name = name || '';
    // NOTE: _ancestorEnabled not include self
    this._ancestorEnabled = true;
    this._ready = false;
    this._destroyed = false;
    this._comps = [];
    this._tweens = null;

    // app internal data
    this._app = null;
    this._poolID = -1;
  }

  get tweens() {
    return this._tweens;
  }

  get enabledInHierarchy() {
    return this._enabled && this._ancestorEnabled;
  }

  get ready() {
    return this._ready;
  }

  get destroyed() {
    return this._destroyed;
  }

  addTween(component, prop, option) {
    if (!this._tweens) {
      this._tweens = this._app._vtween.newTimeLine({});
    }

    if (component === 'Entity') {
      let vtween = this._app._vtween.newTask(this, prop, option);
      this._tweens.add(vtween);
      return;
    }

    let com = this.getComp(component);

    if (!com) {
      return;
    }

    let vtween = this._app._vtween.newTask(com, prop, option);
    this._tweens.add(vtween);
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
    this._app._destroyEntity(this);
  }

  setParent(newParent) {
    // NOTE: if we destroy the entity,
    // we need to set parent to null to remove it from parent
    if (newParent === null && this._destroyed === false) {
      newParent = this._app.activeLevel;
    }

    _setParent.call(this, newParent);
  }

  _onEnableChanged() {
    if (this._ancestorEnabled) {
      // NOTE: we can not emit event during calculating the _enabledInHierarchy
      utils.walk(this, function (n) {
        n._ancestorEnabled = n._parent.enabledInHierarchy;
      });

      if (this._ready) {
        this._app._notifyEnableChanged(this, this._enabled);
      }
    }
  }

  _onParentChanged(oldParent, newParent) {
    // update _acestorEnabled
    let oldEnabledInHierarchy = this.enabledInHierarchy;

    if (!this._parent) {
      this._ancestorEnabled = true;
    } else {
      this._ancestorEnabled = this._parent.enabledInHierarchy;
    }

    let newEnabledInHierarchy = this.enabledInHierarchy;

    // don't do anything if we didn't ready
    if (this._ready) {
      // emit parent-changed event
      this.emit('parent-changed', oldParent, newParent);

      // if enabledInHierarchy changed
      if (oldEnabledInHierarchy !== newEnabledInHierarchy) {
        this._app._notifyEnableChanged(this, newEnabledInHierarchy);
      }
    }
  }

  clone() {
    return this._app.cloneEntity(this);
  }

  deepClone() {
    return this._app.deepCloneEntity(this);
  }

  getComp(classname) {
    const ctor = this._app.getClass(classname);

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        return comp;
      }
    }

    return null;
  }

  getComps(classname) {
    const ctor = this._app.getClass(classname);
    let results = [];

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        results.push(comp);
      }
    }

    return results;
  }

  getCompsInChildren(classname) {
    const ctor = this._app.getClass(classname);
    let results = [];

    utils.walk(this, function (n) {
      for (let i = 0; i < n._comps.length; ++i) {
        let comp = n._comps[i];
        if (comp instanceof ctor) {
          results.push(comp);
        }
      }
    });

    return results;
  }

  addComp(classname, data) {
    const ctor = this._app.getClass(classname);

    if (!ctor.multiple) {
      if (this.getComp(classname)) {
        return null;
      }
    }

    let comp = this._app._createComp(ctor, this, data);
    this._comps.push(comp);

    return comp;
  }

  // call by app
  _removeComp(comp) {
    for (let i = 0; i < this._comps.length; ++i) {
      let c = this._comps[i];
      if (c === comp) {
        this._comps.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}

Node.mixin(Entity);
EventEmitter.mixin(Entity);