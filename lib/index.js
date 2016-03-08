import Document from 'virtual-jquery/document';

function VirtualJQuery(html) {
  let parser = new DOMParser();
  this.document = parser.parseFromString(html, 'text/html');

  // Subscriptions for change events / whatnot
  this._subscriptions = {};
  this._document = new Document(this);
};

VirtualJQuery.prototype = {
  $(selector) {
    return this._document.find(selector);
  },

  find(selector) {
    return this.$(selector);
  },

  on(eventName, callback) {
    if (this._subscriptions[eventName]) {
      this._subscriptions[eventName].push(callback);
    } else {
      this._subscriptions[eventName] = [callback];
    }
  },

  off(eventName, callback) {
    if (this._subscriptions[eventName]) {
      let index = this._subscriptions[eventName].indexOf(callback);
      this._subscriptions[eventName].splice(index, 1);
    }
  },

  trigger(eventName, ...args) {
    let callbacks = this._subscriptions[eventName] || [];
    callbacks.forEach(function (callback) {
      callback(...args);
    });
  },

  toString() {
    return new XMLSerializer().serializeToString(this.document);
  }
};

export default VirtualJQuery;
