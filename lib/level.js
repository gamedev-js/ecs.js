import Entity from './entity';

export default class Level extends Entity {
  constructor(engine, name) {
    super(name);
    this._engine = engine;
  }

  addComp() {
    console.warn('Can not add component in level');
  }
}