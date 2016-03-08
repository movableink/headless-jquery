import Document from 'virtual-jquery/document';
import Symbol from 'virtual-jquery/symbol';

const EVENTS = Symbol();
const DOCUMENT = Symbol();

function Root(html) {
  let parser = new DOMParser();
  this.document = parser.parseFromString(html, 'text/html');

  this[EVENTS] = {};
  this[DOCUMENT] = new Document(this);
}

Root.prototype = {
  $(selector) {
    return this[DOCUMENT].find(selector);
  },

  find(selector) {
    return this[DOCUMENT].find(selector);
  },

  on(eventName, callback) {
    let events = this[EVENTS];
    if (events[eventName]) {
      events[eventName].push(callback);
    } else {
      events[eventName] = [callback];
    }
  },

  off(eventName, callback) {
    let events = this[EVENTS];
    if (events[eventName]) {
      let index = events[eventName].indexOf(callback);
      events[eventName].splice(index, 1);
    }
  },

  trigger(eventName, ...args) {
    let events = this[EVENTS];
    let callbacks = events[eventName] || [];
    callbacks.forEach(function (callback) {
      callback(...args);
    });
  },

  toString() {
    return new XMLSerializer().serializeToString(this.document);
  }
}

export default function (html) {
  return new Root(html);
}
