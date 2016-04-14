define('headless-jquery/document', ['exports', 'module', 'headless-jquery/element', 'headless-jquery/map', 'headless-jquery/symbol'], function (exports, module, _headlessJqueryElement, _headlessJqueryMap, _headlessJquerySymbol) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Element = _interopRequireDefault(_headlessJqueryElement);

  var _Map = _interopRequireDefault(_headlessJqueryMap);

  var _Symbol = _interopRequireDefault(_headlessJquerySymbol);

  var LOOKUP = _Symbol['default']['for']('lookup');
  var TRIGGER = _Symbol['default']['for']('trigger');

  function Document(root) {
    var elements = new _Map['default']();

    this.element = root.document;
    this.document = this;
    this[TRIGGER] = function (eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      root.trigger.apply(root, [eventName].concat(args));
    };

    var self = this;
    this[LOOKUP] = function Document$lookup(rawElement) {
      if (!elements.has(rawElement)) {
        var element = new _Element['default'](rawElement, self);
        elements.set(rawElement, element);
      }

      return elements.get(rawElement);
    };
  }

  Document.prototype = new _Element['default']();

  module.exports = Document;
});
define('headless-jquery/element', ['exports', 'module', 'headless-jquery/symbol', 'headless-jquery/map', 'headless-jquery/selector-for-element'], function (exports, module, _headlessJquerySymbol, _headlessJqueryMap, _headlessJquerySelectorForElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Symbol = _interopRequireDefault(_headlessJquerySymbol);

  var _Map = _interopRequireDefault(_headlessJqueryMap);

  var _selectorForElement = _interopRequireDefault(_headlessJquerySelectorForElement);

  var LOOKUP = _Symbol['default']['for']('lookup');
  var TRIGGER = _Symbol['default']['for']('trigger');
  var DATA = _Symbol['default']['for']('data');

  function Element(element, document) {
    this.element = element;

    if (element) {
      this.selector = _selectorForElement['default']($(element));
      this.tagName = element.tagName.toLowerCase();
    }
    this.document = document;
    this[DATA] = new _Map['default']();
  }

  Element.prototype = {
    $: (function (_$) {
      function $(_x) {
        return _$.apply(this, arguments);
      }

      $.toString = function () {
        return _$.toString();
      };

      return $;
    })(function (selector) {
      return castJQueryToCollection($(this.element).find(selector), this);
    }),

    find: function find(selector) {
      return this.$(selector);
    },

    parent: function parent(selector) {
      var parent = $(this.element).parent(selector)[0];
      return this.document[LOOKUP](parent);
    },

    siblings: function siblings(selector) {
      return castJQueryToCollection($(this.element).parent().children(selector), this);
    },

    children: function children(selector) {
      return castJQueryToCollection($(this.element).children(selector), this);
    },

    contains: function contains(other) {
      return $.contains(this.element, other.element);
    },

    html: function html(value) {
      if (arguments.length === 1) {
        $(this.element).html(value);
        this.document[TRIGGER]('setHTML', this.selector, value);
        this.document[TRIGGER]('change');
      }
      return $(this.element).html();
    },

    attr: function attr(attrName, value) {
      if (arguments.length === 2) {
        $(this.element).attr(attrName, value);
        this.document[TRIGGER]('setAttr', this.selector, attrName, value);
        this.document[TRIGGER]('change');

        if (attrName === 'id' || attrName === 'class') {
          this.selector = _selectorForElement['default']($(this.element));
        }
      }
      return $(this.element).attr(attrName);
    },

    css: function css(key, value) {
      if (arguments.length === 2) {
        $(this.element).css(key, value);
        this.document[TRIGGER]('setStyle', this.selector, key, value);
        this.document[TRIGGER]('change');
      }
      return $(this.element).css(key);
    },

    data: function data(key, value) {
      if (arguments.length === 2) {
        if (value instanceof Object) {
          this[DATA].set(key, value);
        } else {
          $(this.element)[0].setAttribute('data-' + key, value);
          this.document[TRIGGER]('setData', this.selector, 'data-' + key, value);
          this.document[TRIGGER]('change');
        }
      }

      if (value instanceof Object) {
        return this[DATA].get(key);
      } else {
        return $(this.element).data(key);
      }
    },

    append: function append(html) {
      var _this = this;

      if (typeof html === 'string') {
        $(this.element).append(html);
        this.document[TRIGGER]('appendHTML', this.selector, html);
      } else {
        var elements = html;
        if (!Array.isArray(elements)) {
          elements = [elements];
        }
        elements.forEach(function (element) {
          $(_this.element).append($(element.element));
          _this.document[TRIGGER]('moveElement', _this.selector, element.selector);
        });
      }
      this.document[TRIGGER]('change');
    },

    prepend: function prepend(html) {
      $(this.element).prepend(html);
      this.document[TRIGGER]('prependHTML', this.selector, html);
      this.document[TRIGGER]('change');
    },

    after: function after(html) {
      $(this.element).after(html);
      this.document[TRIGGER]('after', this.selector, html);
      this.document[TRIGGER]('change');
    },

    replaceWith: function replaceWith(html) {
      $(this.element).replaceWith(html);
      this.document[TRIGGER]('setOuterHTML', this.selector, html);
      this.document[TRIGGER]('change');
    },

    remove: function remove() {
      $(this.element).remove();
      this.document[TRIGGER]('remove', this.selector);
      this.document[TRIGGER]('change');
    },

    unwrap: function unwrap() {
      $(this.element).unwrap();
      this.document[TRIGGER]('unwrap', this.selector);
      this.document[TRIGGER]('change');
    }
  };

  function createAccessor(name, _ref) {
    var arity = _ref.arity;

    return function () {
      var _;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length === arity) {
        this.forEach(function (element) {
          element[name].apply(element, args);
        });
      }
      return (_ = this[0])[name].apply(_, args);
    };
  }

  function createInvokeEach(name) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return castCollection(this.map(function (element) {
        return element[name].apply(element, args);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []).reduce(function (collection, item) {
        if (collection.indexOf(item) === -1) {
          collection.push(item);
        }
        return collection;
      }, []), this);
    };
  }

  var CollectionMethods = {
    html: createAccessor('html', { arity: 1 }),
    attr: createAccessor('attr', { arity: 2 }),
    css: createAccessor('css', { arity: 2 }),
    data: createAccessor('data', { arity: 2 }),

    append: createInvokeEach('append'),
    prepend: createInvokeEach('prepend'),
    after: createInvokeEach('after'),
    replaceWith: createInvokeEach('replaceWith'),
    remove: createInvokeEach('remove'),
    unwrap: createInvokeEach('unwrap'),

    $: createInvokeEach('$'),
    find: createInvokeEach('find'),
    siblings: createInvokeEach('siblings'),
    children: createInvokeEach('children'),

    parent: function parent(selector) {
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
    var wrappedElements = elements.toArray().map(function (element) {
      return scope.document[LOOKUP](element);
    });

    return castCollection(wrappedElements, scope);
  }

  module.exports = Element;
});
define('headless-jquery', ['exports', 'module', 'headless-jquery/document', 'headless-jquery/symbol'], function (exports, module, _headlessJqueryDocument, _headlessJquerySymbol) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Document = _interopRequireDefault(_headlessJqueryDocument);

  var _Symbol = _interopRequireDefault(_headlessJquerySymbol);

  var EVENTS = _Symbol['default']();
  var DOCUMENT = _Symbol['default']();

  function Root(html) {
    this.document = document.implementation.createHTMLDocument();
    this.document.documentElement.innerHTML = html;

    this[EVENTS] = {};
    this[DOCUMENT] = new _Document['default'](this);
  }

  Root.prototype = {
    $: function $(selector) {
      return this[DOCUMENT].find(selector);
    },

    find: function find(selector) {
      return this[DOCUMENT].find(selector);
    },

    on: function on(eventName, callback) {
      var events = this[EVENTS];
      if (events[eventName]) {
        events[eventName].push(callback);
      } else {
        events[eventName] = [callback];
      }
    },

    off: function off(eventName, callback) {
      var events = this[EVENTS];
      if (events[eventName]) {
        var index = events[eventName].indexOf(callback);
        events[eventName].splice(index, 1);
      }
    },

    trigger: function trigger(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var events = this[EVENTS];
      var callbacks = events[eventName] || [];
      callbacks.forEach(function (callback) {
        callback.apply(undefined, args);
      });
    },

    toString: function toString() {
      return new XMLSerializer().serializeToString(this.document);
    }
  };

  module.exports = function (html) {
    return new Root(html);
  };
});
define('headless-jquery/map', ['exports', 'module', 'headless-jquery/symbol'], function (exports, module, _headlessJquerySymbol) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Symbol = _interopRequireDefault(_headlessJquerySymbol);

  var KEYS = _Symbol['default']();
  var VALUES = _Symbol['default']();

  var Map = (function () {
    function Map() {
      _classCallCheck(this, Map);

      this[KEYS] = [];
      this[VALUES] = [];
      this.size = 0;
    }

    Map.prototype.get = function get(key) {
      var index = this[KEYS].indexOf(key);
      if (index === -1) {
        return undefined;
      }
      return this[VALUES][index];
    };

    Map.prototype.set = function set(key, value) {
      var index = this[KEYS].indexOf(key);
      if (index === -1) {
        index = this[KEYS].length;
        this.size++;
      }
      this[KEYS][index] = key;
      this[VALUES][index] = value;
    };

    Map.prototype['delete'] = function _delete(key) {
      var index = this[KEYS].indexOf(key);
      if (index === -1) {
        return false;
      }
      delete this[KEYS][index];
      delete this[VALUES][index];
      this.size--;
      return true;
    };

    Map.prototype.has = function has(key) {
      return this[KEYS].indexOf(key) !== -1;
    };

    return Map;
  })();

  module.exports = Map;
});
define('headless-jquery/selector-for-element', ['exports', 'module'], function (exports, module) {
  'use strict';

  function getSelector(_x2) {
    var _arguments = arguments;
    var _again = true;

    _function: while (_again) {
      var $element = _x2;
      _again = false;
      var path = _arguments.length <= 1 || _arguments[1] === undefined ? '' : _arguments[1];

      // If this element is <html> we've reached the end of the path.
      if ($element.is('html')) {
        return path.slice(3);
      }

      // Add the element name.
      var tagName = $element.get(0).nodeName.toLowerCase();
      var selector = tagName;

      // Determine the IDs and path.
      var id = $element.attr('id');
      if (id) {
        if (path === '') {
          return '#' + id;
        }
      }

      var classNames = $element.attr('class');

      // Add the #id if there is one.
      if (id != null) {
        selector = '#' + id;
        // Add any classes.
      } else if (classNames != null) {
          selector += '.' + classNames.split(/[\s\n]+/).join('.');
        } else {
          var index = $element.index();
          if (['body', 'head'].indexOf(tagName) === -1 && index >= 0) {
            selector += ':eq(' + index + ')';
          }
        }

      // Recurse up the DOM.
      _arguments = [_x2 = $element.parent(), ' > ' + selector + path];
      _again = true;
      path = tagName = selector = id = classNames = index = undefined;
      continue _function;
    }
  }

  module.exports = getSelector;
});
define('headless-jquery/symbol', ['exports', 'module'], function (exports, module) {
  'use strict';

  var sharedSymbols = {};

  function generateSymbol() {
    var uid = [1, 2, 3].map(function () {
      return Math.round(Math.random() * 0x100000).toString(16);
    }).join('-');
    return '_symbol_' + uid;
  }

  function Symbol(key) {
    if (this instanceof Symbol) {
      throw new TypeError('Cannot call `new` on Symbol');
    }

    var symbol = generateSymbol();
    if (key) {
      sharedSymbols[key] = symbol;
    }
    return symbol;
  }

  Symbol['for'] = function (key) {
    if (sharedSymbols[key]) {
      return sharedSymbols[key];
    }
    return Symbol(key);
  };

  module.exports = Symbol;
});