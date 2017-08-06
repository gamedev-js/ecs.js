import { FixedArray } from 'memop';
import Entity from './entity';

export default class Engine {
  /**
   * @param {object} opts
   * @param {number} opts.poolSize
   * @param {Array} opts.systems
   */
  constructor(opts = {}) {
    const poolSize = opts.poolSize || 100;

    this._classes = {};
    this._systems = [];

    // NOTE: we don't use recycles pool here because reused entity may be refereced by others
    this._entities = new FixedArray(poolSize);
    this._newComponents = new FixedArray(poolSize);
    this._deadComponents = new FixedArray(poolSize);

    //
    if (opts.systems) {
      for (let i = 0; i < opts.systems.length; ++i) {
        let info = opts.systems[i];
        this.registerSystem(
          info.id,
          info.system,
          info.component,
          info.priority,
          info.size
        );
      }
    }
    this._sortSystems();
  }

  // ====================
  // class
  // ====================

  /**
   * @param {string} name
   * @param {class} cls
   * @param {object} opts
   * @param {boolean} opts.multiple
   * @param {Array} opts.requires
   */
  registerClass(name, cls, opts = {}) {
    cls.__classname__ = name;
    cls.__multiple__ = opts.multiple;
    cls.__requires__ = opts.requires;

    this._classes[name] = cls;
  }

  /**
   * @param {string} name
   */
  getClass(name) {
    return this._classes[name];
  }

  /**
   * @param {function|object} clsOrInst
   */
  getClassName(clsOrInst) {
    if (typeof clsOrInst === 'function') {
      return clsOrInst.__classname__;
    }

    return clsOrInst.constructor.__classname__;
  }

  // ====================
  // entity & component
  // ====================

  createEntity(name) {
    let ent = new Entity(name);
    ent._engine = this;
    ent._poolID = this._entities.length;

    // emit enable
    if (ent.enabledInHierarchy) {
      ent.emit('enable');
    }

    // manage it
    this._entities.push(ent);

    return ent;
  }

  _destroyEntity(ent) {
    // mark as destroyed
    this._destroyed = true;

    // emit disable
    if (ent.enabledInHierarchy) {
      ent.emit('disable');
    }

    // TODO: emit disable in children

    // unmanage it
    let lastEnt = this._entities.data[this._entities.length - 1];
    this._entities.fastRemove(ent._poolID);
    lastEnt._poolID = ent._poolID;
    ent._poolID = -1;
  }

  _createComp(ctor, ent) {
    let comp = new ctor();
    comp._entity = ent;
    comp._engine = this;

    // invoke onEnable
    if (comp.onEnable && ent.enabledInHierarchy ) {
      comp.onEnable();
    }

    //
    this._newComponents.push(comp);

    return comp;
  }

  _destroyComp(comp) {
    // mark as destroyed
    comp._destroyed = true;

    // invoke onDisable
    if (comp.onDisable && comp._entity.enabledInHierarchy) {
      comp.onDisable();
    }

    //
    this._deadComponents.push(comp);
  }

  // ====================
  // system
  // ====================

  registerSystem(id, systemCls, compClsName, priority = 0, poolSize = 100) {
    let sys = new systemCls();

    sys._id = id;
    sys._engine = this;
    sys._priority = priority;
    sys._poolSize = poolSize;
    sys._compClass = this.getClass(compClsName);
    sys.finalize();

    this._systems.push(sys);

    return sys;
  }

  getSystem(id) {
    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      if (sys.id === id) {
        return sys;
      }
    }

    return null;
  }

  _sortSystems() {
    this._systems.sort((a, b) => {
      return a._priority - b._priority;
    });
  }

  _addComp(comp) {
    comp._entity._comps.push(comp);

    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      if (comp instanceof sys._compClass) {
        sys.add(comp);
      }
    }
  }

  _removeComp(comp) {
    let entComps = comp._entity._comps;
    for (let i = 0; i < entComps.length; ++i) {
      if (entComps[i] === comp) {
        entComps.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      if (comp instanceof sys._compClass) {
        sys.remove(comp);
      }
    }
  }

  // ====================
  // loop
  // ====================

  tick() {
    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      sys.tick();
    }

    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      sys.postTick();
    }

    // handle new components
    for (let i = 0; i < this._newComponents.length; ++i) {
      let comp = this._newComponents.data[i];
      this._addComp(comp);
    }

    // handle dead components
    for (let i = 0; i < this._deadComponents.length; ++i) {
      let comp = this._deadComponents.data[i];
      this._removeComp(comp);
    }

    this._newComponents.reset();
    this._deadComponents.reset();
  }
}