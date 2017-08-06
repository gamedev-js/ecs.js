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

function _notifyEnableChanged(ent, enabled) {
  if (enabled) {
    ent.emit('enable');

    for (let i = 0; i < ent._comps.length; ++i) {
      let comp = ent._comps[i];
      if (comp.onEnable) {
        comp.onEnable();
      }
    }
  } else {
    ent.emit('disable');

    for (let i = 0; i < ent._comps.length; ++i) {
      let comp = ent._comps[i];
      if (comp.onDisable) {
        comp.onDisable();
      }
    }
  }
}

export default class Entity extends Base {
  constructor(name, flags) {
    super(name);

    // NOTE: _enabledInHierarchy not include self
    this._enabledInHierarchy = true;
    this._comps = [];
    this._flags = flags;

    // set by engine
    this._engine = null;
    this._destroyed = false;
    this._poolID = -1;
  }

  set enabled(val) {
    if (this._enabled !== val) {
      this._enabled = val;

      if (this._enabledInHierarchy) {
        // NOTE: we can not emit event during calculating the _enabledInHierarchy
        utils.walk(this, function (n) {
          n._enabledInHierarchy = n._parent.enabledInHierarchy;
          return true;
        });

        // emit event and trigger cmoponents' onEnable/onDisble callback at root
        _notifyEnableChanged(this, val);

        // recursively emit event trigger cmoponents' onEnable/onDisble callback in children
        utils.walk(this, function (n) {
          if (n._enabled) {
            _notifyEnableChanged(this, val);
            return true;
          }

          return false;
        });
      }
    }
  }

  get enabledInHierarchy() {
    return this._enabled && this._enabledInHierarchy;
  }

  get destroyed () {
    return this._destroyed;
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    // TODO: destroy all children

    // remove all components
    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      comp.destroy();
    }
    this._comps = [];

    // request destroy in engine
    this._engine._destroyEntity(this);
  }

  _onParentChanged() {
    if (!this._parent) {
      this._enabledInHierarchy = true;
      return;
    }

    this._enabledInHierarchy = this._parent.enabledInHierarchy;
    this.emit('parent-changed');
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
