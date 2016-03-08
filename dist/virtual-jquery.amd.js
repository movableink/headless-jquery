define('virtual-jquery/document', ['exports', 'module', 'virtual-jquery/element', 'virtual-jquery/map'], function (exports, module, _virtualJqueryElement, _virtualJqueryMap) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Element = _interopRequireDefault(_virtualJqueryElement);

  var _Map = _interopRequireDefault(_virtualJqueryMap);

  function Document(root) {
    var elements = new _Map['default']();

    this.element = root.document;
    this.document = this;
    this.trigger = function (eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      root.trigger.apply(root, [eventName].concat(args));
    };

    var self = this;
    this.lookup = function Document$lookup(rawElement) {
      if (!elements.has(rawElement)) {
        elements.set(rawElement, new _Element['default'](rawElement, self));
      }

      return elements.get(rawElement);
    };
  }

  Document.prototype = new _Element['default']();

  module.exports = Document;
});
define('virtual-jquery/element', ['exports', 'module', 'virtual-jquery/selector-for-element'], function (exports, module, _virtualJquerySelectorForElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _selectorForElement = _interopRequireDefault(_virtualJquerySelectorForElement);

  function Element(element, document) {
    this.element = element;

    if (element) {
      this.selector = _selectorForElement['default']($(element));
      this.tagName = element.tagName.toLowerCase();
    }
    this.document = document;
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
      return toCollection($(this.element).find(selector), this);
    }),

    find: function find(selector) {
      return this.$(selector);
    },

    parent: function parent() {
      var parent = $(this.element).parent()[0];
      return this.document.lookup(parent);
    },

    siblings: function siblings() {
      return toCollection($(this.element).parent().children(), this);
    },

    children: function children() {
      return toCollection($(this.element).children(), this);
    },

    contains: function contains(other) {
      return $.contains(this.element, other.element);
    },

    html: function html(value) {
      if (arguments.length === 1) {
        $(this.element).html(value);
        this.document.trigger('setHtml', this.selector, value);
        this.document.trigger('change');
      }
      return $(this.element).html();
    },

    attr: function attr(attrName, value) {
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

    css: function css(key, value) {
      if (arguments.length === 2) {
        $(this.element).css(key, value);
        this.document.trigger('setStyle', this.selector, key, value);
        this.document.trigger('change');
      }
      return $(this.element).css(key);
    },

    replaceWith: function replaceWith(html) {
      $(this.element).replaceWith(html);
      this.document.trigger('setOuterHTML', this.selector, html);
      this.document.trigger('change');
    }
  };

  CollectionMethods = {
    html: function html(value) {
      if (arguments.length === 1) {
        this._elements.forEach(function (element) {
          element.html(value);
        });
      }
      return this._elements[0].html();
    },

    attr: function attr(attrName, value) {
      if (arguments.length === 2) {
        this._elements.forEach(function (element) {
          element.attr(attrName, value);
        });
      }
      return this._elements[0].attr(attrName);
    },

    css: function css(attrName, value) {
      if (arguments.length === 2) {
        this._elements.forEach(function (element) {
          element.css(attrName, value);
        });
      }
      return this._elements[0].css(attrName);
    },

    parent: function parent() {
      return this._elements[0].parent();
    },

    children: function children() {
      var children = this._elements.map(function (element) {
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
    var wrappedElements = elements.toArray().map(function (element) {
      return scope.document.lookup(element);
    });

    Object.keys(CollectionMethods).forEach(function (key) {
      wrappedElements[key] = CollectionMethods[key];
    });

    return wrappedElements;
  }

  module.exports = Element;
});
define('virtual-jquery', ['exports', 'module', 'virtual-jquery/document'], function (exports, module, _virtualJqueryDocument) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Document = _interopRequireDefault(_virtualJqueryDocument);

  function VirtualJQuery(html) {
    var parser = new DOMParser();
    this.document = parser.parseFromString(html, 'text/html');

    // Subscriptions for change events / whatnot
    this._subscriptions = {};
    this._document = new _Document['default'](this);
  };

  VirtualJQuery.prototype = {
    $: function $(selector) {
      return this._document.find(selector);
    },

    find: function find(selector) {
      return this.$(selector);
    },

    on: function on(eventName, callback) {
      if (this._subscriptions[eventName]) {
        this._subscriptions[eventName].push(callback);
      } else {
        this._subscriptions[eventName] = [callback];
      }
    },

    trigger: function trigger(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var callbacks = this._subscriptions[eventName] || [];
      callbacks.forEach(function (callback) {
        callback.apply(undefined, args);
      });
    },

    toString: function toString() {
      return new XMLSerializer().serializeToString(this.document);
    }
  };

  module.exports = VirtualJQuery;
});
define("virtual-jquery/map", ["exports"], function (exports) {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Map = (function () {
    function Map() {
      _classCallCheck(this, Map);

      this._keys = [];
      this._values = [];
      this.size = 0;
    }

    Map.prototype.get = function get(key) {
      var index = this._keys.indexOf(key);
      if (index === -1) {
        return undefined;
      }
      return this._values[index];
    };

    Map.prototype.set = function set(key, value) {
      var index = this._keys.indexOf(key);
      if (index === -1) {
        index = this._keys.length;
        this.size++;
      }
      this._keys[index] = key;
      this._values[index] = value;
    };

    Map.prototype["delete"] = function _delete(key) {
      var index = this._keys.indexOf(key);
      if (index === -1) {
        return false;
      }
      delete this._keys[index];
      delete this._values[index];
      this.size--;
      return true;
    };

    Map.prototype.has = function has(key) {
      return this._keys.indexOf(key) !== -1;
    };

    return Map;
  })();
});
define('virtual-jquery/selector-for-element', ['exports', 'module'], function (exports, module) {
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
      var classNames = $element.attr('class');

      // Add the #id if there is one.
      if (id != null) {
        selector += '#' + id;
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