import Symbol from 'virtual-jquery/symbol';

const KEYS = Symbol();
const VALUES = Symbol();

class Map {
  constructor() {
    this[KEYS] = [];
    this[VALUES] = [];
    this.size = 0;
  }

  get(key) {
    let index = this[KEYS].indexOf(key);
    if (index === -1) {
      return undefined;
    }
    return this[VALUES][index];
  }

  set(key, value) {
    let index = this[KEYS].indexOf(key);
    if (index === -1) {
      index = this[KEYS].length;
      this.size++;
    }
    this[KEYS][index] = key;
    this[VALUES][index] = value;
  }

  delete(key) {
    let index = this[KEYS].indexOf(key);
    if (index === -1) {
      return false;
    }
    delete this[KEYS][index];
    delete this[VALUES][index];
    this.size--;
    return true;
  }

  has(key) {
    return this[KEYS].indexOf(key) !== -1;
  }
}

export default Map;
