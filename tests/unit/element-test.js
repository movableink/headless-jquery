import Symbol from 'headless-jquery/symbol';
import selectorForElement from 'headless-jquery/selector-for-element';
import Element from 'headless-jquery/element';

function MockDocument() {
  const LOOKUP = Symbol.for('lookup');
  const TRIGGER = Symbol.for('trigger');

  let document = {
    lookup: {
      called: 0
    }
  };

  document[TRIGGER] = function (eventName, ...args) {
    if (document[eventName]) {
      document[eventName].called++;
    } else {
      document[eventName] = { called: 1 };
    }

    document[eventName].calledWith = args;
  };

  document[LOOKUP] = function (...args) {
    document.lookup.called++;
    document.lookup.calledWith = args;
    return new Element(args[0], document);
  };

  return document;
}

module('headless-jquery/element');

test('tagName is set on the element', function (assert) {
  let doc = MockDocument();
  let el = new Element($('#qunit-fixture ul')[0], doc);

  assert.equal(el.tagName, 'ul');
});

test('the selector is set on the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture ul');
  let el = new Element($el[0], doc);

  assert.equal(el.selector, selectorForElement($el));
});

test('find returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  let test = el.find('#test-id');
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);

  assert.equal(doc.lookup.called, 1);
  assert.equal(doc.lookup.calledWith.length, 1);
  assert.equal(doc.lookup.calledWith[0].id, 'test-id');
});

test('$ returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  let test = el.$('#test-id');
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);

  assert.equal(doc.lookup.called, 1);
  assert.equal(doc.lookup.calledWith.length, 1);
  assert.equal(doc.lookup.calledWith[0].id, 'test-id');
});

test('parent returns the parent element wrapped', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id');
  let el = new Element($el[0], doc);

  let test = el.parent();
  assert.ok(test instanceof Element);
  assert.equal(test.selector, '#qunit-fixture');
});

test('siblings returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id');
  let el = new Element($el[0], doc);

  let test = el.siblings();
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);
  assert.equal(test.length, 6);
});

test('children returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('.test-position');
  let el = new Element($el[0], doc);

  let test = el.children();
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);
  assert.equal(test.length, 3);
});

test('html() will returns the html of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  assert.equal(el.html(), 'Test');
});

test('html() can set the html of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.html('');

  assert.equal($el.html(), '');
});

test('setting html will trigger a setHTML event and a change event', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.html('');

  assert.deepEqual(doc.setHTML.called, 1);
  assert.deepEqual(doc.setHTML.calledWith, ['#test-id', '']);
  assert.deepEqual(doc.change.called, 1);
  assert.deepEqual(doc.change.calledWith, []);
});

test('attr() will returns the requested attribute of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  assert.equal(el.attr('id'), 'test-id');
});

test('attr() can set the attribute of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.attr('class', 'test-attr');
  assert.ok($el.hasClass('test-attr'));
});

test('setting an attribute will trigger a setAttr event and a change event', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.attr('tabindex', '0');

  assert.deepEqual(doc.setAttr.called, 1);
  assert.deepEqual(doc.setAttr.calledWith, ['#test-id', 'tabindex', '0']);
  assert.deepEqual(doc.change.called, 1);
  assert.deepEqual(doc.change.calledWith, []);
});

test("updating an attribute's id or class name will update the selector", function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture ul li')
  let el = new Element($el[0], doc);

  let selector = el.selector;
  el.attr('class', 'updated-class');
  assert.notEqual(selector, el.selector);

  selector = el.selector;
  el.attr('id', 'updated-id');
  assert.notEqual(selector, el.selector);
});

test('css() will returns the requested style of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  assert.equal(el.css('fontSize'), '12px');
});

test('css() can set a style of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.css('fontSize', '20px');
  assert.equal($el.css('fontSize'), '20px');
});

test('setting a style will trigger a setStyle event and a change event', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.css('color', 'blue');

  assert.deepEqual(doc.setStyle.called, 1);
  assert.deepEqual(doc.setStyle.calledWith, ['#test-id', 'color', 'blue']);
  assert.deepEqual(doc.change.called, 1);
  assert.deepEqual(doc.change.calledWith, []);
});

test('data() will returns the value of a data-* attribute of an element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id');
  let el = new Element($el[0], doc);

  assert.equal(el.data('test'), '✔');
});

test('data() can set a data attribute of an element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.data('pet', '🐹');
  assert.equal($el.data('pet'), '🐹');
});

test('setting a style will trigger a setStyle event and a change event', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-id')
  let el = new Element($el[0], doc);

  el.data('pet', '🐶');

  assert.deepEqual(doc.setData.called, 1);
  assert.deepEqual(doc.setData.calledWith, ['#test-id', 'data-pet', '🐶']);
  assert.deepEqual(doc.change.called, 1);
  assert.deepEqual(doc.change.calledWith, []);
});

test('replaceWith() will replace the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#replace-with-tester')
  let el = new Element($el[0], doc);

  el.replaceWith("<span id='replaced'></span>");

  assert.notOk($('#replace-with-tester').length);
  assert.ok($('#replaced').length);
});

test('replacing an element will trigger a setOuterHTML event and a change event', function (assert) {
  let doc = MockDocument();
  let $el = $('#replace-with-tester-event')
  let el = new Element($el[0], doc);

  el.replaceWith("<span id='replaced-event'></span>");

  assert.deepEqual(doc.setOuterHTML.called, 1);
  assert.deepEqual(doc.setOuterHTML.calledWith, ['#replace-with-tester-event', "<span id='replaced-event'></span>"]);
  assert.deepEqual(doc.change.called, 1);
  assert.deepEqual(doc.change.calledWith, []);
});
