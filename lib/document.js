import Element from 'virtual-jquery/element';
import Map from 'virtual-jquery/map';
import Symbol from 'virtual-jquery/symbol';

const LOOKUP = Symbol.for('lookup');
const TRIGGER = Symbol.for('trigger');

function Document(root) {
  let elements = new Map();

  this.element = root.document;
  this.document = this;
  this[TRIGGER] = function (eventName, ...args) {
    root.trigger(eventName, ...args);
  }

  let self = this;
  this[LOOKUP] = function Document$lookup(rawElement) {
    if (!elements.has(rawElement)) {
      elements.set(rawElement, new Element(rawElement, self));
    }

    return elements.get(rawElement);
  };
}

Document.prototype = new Element();

export default Document;
