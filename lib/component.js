export default class Component {
  constructor() {
    this._enabled = true;

    // set by engine
    this._entity = null;
    this._engine = null;
    this._destroyed = false;
  }

  get enabled() {
    return this._enabled;
  }
  set enabled(val) {
    if (this._enabled !== val) {
      this._enabled = val;

      if (val) {
        if (this.onEnable && this._entity.enabledInHierarchy) {
          this.onEnable();
        }
      } else {
        if (this.onDisable && this._entity.enabledInHierarchy) {
          this.onDisable();
        }
      }
    }
  }

  get destroyed () {
    return this._destroyed;
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    this._engine._destroyComp(this);
  }
}