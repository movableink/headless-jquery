import Document from 'virtual-jquery/document';

function Root(html) {
  // Subscriptions for change events
  let subscriptions = {};
  let parser = new DOMParser();

  let $ = function $(selector) {
    return document.find(selector);
  };
  $.document = parser.parseFromString(html, 'text/html');

  $.find = $;
  $.on = function on(eventName, callback) {
    if (subscriptions[eventName]) {
      subscriptions[eventName].push(callback);
    } else {
      subscriptions[eventName] = [callback];
    }
  };

  $.off = function off(eventName, callback) {
    if (subscriptions[eventName]) {
      let index = subscriptions[eventName].indexOf(callback);
      subscriptions[eventName].splice(index, 1);
    }
  };

  $.trigger = function trigger(eventName, ...args) {
    let callbacks = subscriptions[eventName] || [];
    callbacks.forEach(function (callback) {
      callback(...args);
    });
  };

  $.toString = function toString() {
    return new XMLSerializer().serializeToString(this.document);
  };

  let document = new Document($);

  return $;
};

export default function (html) {
  return Root(html);
}
