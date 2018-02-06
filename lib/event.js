import { Event } from 'event-sys';

export default class ComponentEvent extends Event {
  /**
   * @param {string} name
   * @param {object} opts
   * @param {object} [opts.detail]
   * @param {boolean} [opts.bubbles]
   */
  constructor(name, opts) {
    super(name, opts);

    this.component = null;
  }
}