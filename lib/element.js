import Symbol from 'headless-jquery/symbol';
import Map from 'headless-jquery/map';
import selectorForElement from 'headless-jquery/selector-for-element';

const LOOKUP  = Symbol.for('lookup');
const TRIGGER = Symbol.for('trigger');
const DATA    = Symbol.for('data');

function Element(element, document) {
  this.element = element;

  if (element) {
    this.selector = selectorForElement($(element));
    this.tagName = element.tagName.toLowerCase();
  }
  this.document = document;
  this[DATA] = new Map();
}

Element.prototype = {
  $(selector) {
    return castJQueryToCollection($(this.element).find(selector), this);
  },

  find(selector) {
    return this.$(selector);
  },

  parent(selector) {
    let parent = $(this.element).parent(selector)[0];
    return this.document[LOOKUP](parent);
  },

  siblings(selector) {
    return castJQueryToCollection($(this.element).parent().children(selector), this);
  },

  children(selector) {
    return castJQueryToCollection($(this.element).children(selector), this);
  },

  contains(other) {
    return $.contains(this.element, other.element);
  },

  html(value) {
    if (arguments.length === 1) {
      $(this.element).html(value);
      this.document[TRIGGER]('setHTML', this.selector, value);
      this.document[TRIGGER]('change');
    }
    return $(this.element).html();
  },

  attr(attrName, value) {
    if (arguments.length === 2) {
      $(this.element).attr(attrName, value);
      this.document[TRIGGER]('setAttr', this.selector, attrName, value);
      this.document[TRIGGER]('change');

      if (attrName === 'id' || attrName === 'class') {
        this.selector = selectorForElement($(this.element));
      }
    }
    return $(this.element).attr(attrName);
  },

  css(key, value) {
    if (arguments.length === 2) {
      $(this.element).css(key, value);
      this.document[TRIGGER]('setStyle', this.selector, key, value);
      this.document[TRIGGER]('change');
    }
    return $(this.element).css(key);
  },

  data(key, value) {
    if (arguments.length === 2) {
      if (value instanceof Object) {
        this[DATA].set(key, value);
      } else {
        $(this.element)[0].setAttribute(`data-${key}`, value);
        this.document[TRIGGER]('setData', this.selector, `data-${key}`, value);
        this.document[TRIGGER]('change');
      }
    }

    if (value instanceof Object) {
      return this[DATA].get(key);
    } else {
      return $(this.element).data(key);
    }
  },

  append(html) {
    if (typeof html === 'string') {
      $(this.element).append(html);
      this.document[TRIGGER]('appendHTML', this.selector, html);
    } else {
      let elements = html;
      if (!Array.isArray(elements)) {
        elements = [elements];
      }
      elements.forEach((element) => {
        $(this.element).append($(element.element));
        this.document[TRIGGER]('moveElement', this.selector, element.selector);
      });
    }
    this.document[TRIGGER]('change');
  },

  prepend(html) {
    $(this.element).prepend(html);
    this.document[TRIGGER]('prependHTML', this.selector, html);
    this.document[TRIGGER]('change');
  },

  replaceWith(html) {
    $(this.element).replaceWith(html);
    this.document[TRIGGER]('setOuterHTML', this.selector, html);
    this.document[TRIGGER]('change');
  },

  remove() {
    $(this.element).remove();
    this.document[TRIGGER]('remove', this.selector);
    this.document[TRIGGER]('change');
  },

  unwrap() {
    $(this.element).unwrap();
    this.document[TRIGGER]('unwrap', this.selector);
    this.document[TRIGGER]('change');
  }
};

function createAccessor(name, { arity }) {
  return function (...args) {
    if (args.length === arity) {
      this.forEach(function (element) {
        element[name](...args);
      });
    }
    return this[0][name](...args);
  }
}

function createInvokeEach(name) {
  return function (...args) {
    return castCollection(this.map(function (element) {
      return element[name](...args);
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []).reduce(function (collection, item) {
      if (collection.indexOf(item) === -1) {
        collection.push(item);
      }
      return collection;
    }, []), this);
  }
}

let CollectionMethods = {
  html: createAccessor('html', { arity: 1 }),
  attr: createAccessor('attr', { arity: 2 }),
  css: createAccessor('css', { arity: 2 }),
  data: createAccessor('data', { arity: 2 }),

  append: createInvokeEach('append'),
  prepend: createInvokeEach('prepend'),
  replaceWith: createInvokeEach('replaceWith'),
  remove: createInvokeEach('remove'),
  unwrap: createInvokeEach('unwrap'),

  $: createInvokeEach('$'),
  find: createInvokeEach('find'),
  siblings: createInvokeEach('siblings'),
  children: createInvokeEach('children'),

  parent(selector) {
    return this[0].parent(selector);
  }
};

function castCollection(elements, scope) {
  Object.keys(CollectionMethods).forEach(function (key) {
    elements[key] = CollectionMethods[key];
  });

  elements.document = scope.document;
  return elements;
}

function castJQueryToCollection(elements, scope) {
  let wrappedElements = elements.toArray().map((element) => {
    return scope.document[LOOKUP](element);
  });

  return castCollection(wrappedElements, scope);
}

export default Element;
