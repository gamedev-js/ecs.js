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

    //
    if (opts.systems) {
      for (let i = 0; i < opts.systems.length; ++i) {
        let info = opts.systems[i];
        this.registerSystem(
          info.system,
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
  // system
  // ====================

  registerSystem(name, sys, priority = 0, poolSize = 100) {
    if (sys._engine) {
      console.warn(`Failed to registerSystem for ${name}: the system already registered.`);
      return;
    }

    sys._engine = this;
    sys._priority = priority;
    sys._poolSize = poolSize;
    sys._compClass = this.getClass(name);

    sys._finalize();

    this._systems.push(sys);
  }

  _sortSystems() {
    this._systems.sort((a, b) => {
      return a._priority - b._priority;
    });
  }

  _onAddComp(entity, comp) {
    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      if (comp instanceof sys._compClass) {
        sys.add(entity, comp);
      }
    }
  }

  _onRemoveComp(entity, comp) {
    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      if (comp instanceof sys._compClass) {
        sys.remove(entity, comp);
      }
    }
  }

  // ====================
  // entity
  // ====================

  createEntity(name) {
    let ent = new Entity(name);
    ent._engine = this;
    ent._poolID = this._entities.length;

    this._entities.push(ent);

    return ent;
  }

  _destroy(ent) {
    let lastEnt = this._entities.data[this._entities.length - 1];
    this._entities.fastRemove(ent._poolID);

    lastEnt._poolID = ent._poolID;
    ent._poolID = -1;
  }

  // ====================
  // loop
  // ====================

  tick() {
    for (let i = 0; i < this._systems.length; ++i) {
      let sys = this._systems[i];
      sys.tick();
    }
  }
}