import Entity from './entity';

export default class Level extends Entity {
  constructor(name) {
    super(name);
  }

  addComp() {
    console.warn('Can not add component in level');
  }
}