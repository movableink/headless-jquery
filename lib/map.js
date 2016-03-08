class Map {
  constructor() {
    this._keys = [];
    this._values = [];
    this.size = 0;
  }

  get(key) {
    let index = this._keys.indexOf(key);
    if (index === -1) {
      return undefined;
    }
    return this._values[index];
  }

  set(key, value) {
    let index = this._keys.indexOf(key);
    if (index === -1) {
      index = this._keys.length;
      this.size++;
    }
    this._keys[index] = key;
    this._values[index] = value;
  }

  delete(key) {
    let index = this._keys.indexOf(key);
    if (index === -1) {
      return false;
    }
    delete this._keys[index];
    delete this._values[index];
    this.size--;
    return true;
  }

  has(key) {
    return this._keys.indexOf(key) !== -1;
  }
}

export default Map;
