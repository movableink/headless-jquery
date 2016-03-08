import Element from 'virtual-jquery/element';
import Map from 'virtual-jquery/map';

function Document(root) {
  let elements = new Map();

  this.element = root.document;
  this.document = this;
  this.trigger = function (eventName, ...args) {
    root.trigger(eventName, ...args);
  }

  let self = this;
  this.lookup = function Document$lookup(rawElement) {
    if (!elements.has(rawElement)) {
      elements.set(rawElement, new Element(rawElement, self));
    }

    return elements.get(rawElement);
  };
}

Document.prototype = new Element();

export default Document;
