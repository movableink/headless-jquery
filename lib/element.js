import selectorForElement from 'virtual-jquery/selector-for-element';

function Element(element, document) {
  this.element = element;

  if (element) {
    this.selector = selectorForElement($(element));
    this.tagName = element.tagName.toLowerCase();
  }
  this.document = document;
}

Element.prototype = {
  $(selector) {
    return toCollection($(this.element).find(selector), this);
  },

  find(selector) {
    return this.$(selector);
  },

  parent() {
    let parent = $(this.element).parent()[0];
    return this.document.lookup(parent);
  },

  siblings() {
    return toCollection($(this.element).parent().children(), this);
  },

  children() {
    return toCollection($(this.element).children(), this);
  },

  contains(other) {
    return $.contains(this.element, other.element);
  },

  html(value) {
    if (arguments.length === 1) {
      $(this.element).html(value);
      this.document.trigger('setHTML', this.selector, value);
      this.document.trigger('change');
    }
    return $(this.element).html();
  },

  attr(attrName, value) {
    if (arguments.length === 2) {
      $(this.element).attr(attrName, value);
      this.document.trigger('setAttr', this.selector, attrName, value);
      this.document.trigger('change');

      if (attrName === 'id' || attrName === 'class') {
        this.selector = getSelector($(this.element));
      }
    }
    return $(this.element).attr(attrName);
  },

  css(key, value) {
    if (arguments.length === 2) {
      $(this.element).css(key, value);
      this.document.trigger('setStyle', this.selector, key, value);
      this.document.trigger('change');
    }
    return $(this.element).css(key);
  },

  replaceWith(html) {
    $(this.element).replaceWith(html);
    this.document.trigger('setOuterHTML', this.selector, html);
    this.document.trigger('change');
  }
};

let CollectionMethods = {
  html(value) {
    if (arguments.length === 1) {
      this._elements.forEach(function (element) {
        element.html(value);
      });
    }
    return this._elements[0].html();
  },

  attr(attrName, value) {
    if (arguments.length === 2) {
      this._elements.forEach(function (element) {
        element.attr(attrName, value);
      });
    }
    return this._elements[0].attr(attrName);
  },

  css(attrName, value) {
    if (arguments.length === 2) {
      this._elements.forEach(function (element) {
        element.css(attrName, value);
      });
    }
    return this._elements[0].css(attrName);
  },

  parent() {
    return this._elements[0].parent();
  },

  children() {
    let children = this._elements.map(function (element) {
      return element.children().toArray();
    }).reduce(function (a, b) {
      return a.concat(b);
    }).reduce(function (collection, item) {
      if (collection.indexOf(item) === -1) {
        collection.push(item);
      }
      return collection;
    });

    return toCollection(children);
  }
};

function toCollection(elements, scope) {
  let wrappedElements = elements.toArray().map((element) => {
    return scope.document.lookup(element);
  });

  Object.keys(CollectionMethods).forEach(function (key) {
    wrappedElements[key] = CollectionMethods[key];
  });

  return wrappedElements;
}

export default Element;
