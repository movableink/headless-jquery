import Element from 'headless-jquery/element';
import Map from 'headless-jquery/map';
import Symbol from 'headless-jquery/symbol';

const LOOKUP = Symbol.for('lookup');
const TRIGGER = Symbol.for('trigger');

function Document(root) {
  let elements = new Map();

  this.element = root.document;
  this.document = this;
  this[TRIGGER] = function (eventName, ...args) {
    root.trigger(eventName, ...args);
  };

  let self = this;
  this[LOOKUP] = function Document$lookup(rawElement) {
    if (!elements.has(rawElement)) {
      let element = new Element(rawElement, self);
      elements.set(rawElement, element);
    }

    return elements.get(rawElement);
  };
}

Document.prototype = new Element();

export default Document;
