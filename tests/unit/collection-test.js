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

module('headless-jquery/element-collection');

test('find returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('body');
  let el = new Element($el[0], doc);

  let test = el.find('#qunit-fixture').find('#test-id');
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);

  assert.equal(doc.lookup.called, 2);
  assert.equal(doc.lookup.calledWith.length, 1);
  assert.equal(doc.lookup.calledWith[0].id, 'test-id');
});

test('$ returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('body');
  let el = new Element($el[0], doc);

  let test = el.$('#qunit-fixture').$('#test-id');
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);

  assert.equal(doc.lookup.called, 2);
  assert.equal(doc.lookup.calledWith.length, 1);
  assert.equal(doc.lookup.calledWith[0].id, 'test-id');
});

test('parent returns the parent element wrapped', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  let test = el.find('#test-id').parent();
  assert.ok(test instanceof Element);
  assert.equal(test.selector, '#qunit-fixture');
});

test('siblings returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  let test = el.find('#test-id').siblings();
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);
  assert.equal(test.length, 7);
});

test('children returns an array of wrapped elements', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  let test = el.find('.test-position').children();
  assert.ok(Array.isArray(test));
  assert.ok(test[0] instanceof Element);
  assert.equal(test.length, 3);
});

test('html() will returns the html of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  assert.equal(el.find('#test-id').html(), 'Test');
});

test('html() can set the html of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  el.find('#test-collection li').html(';)');
  $el.find('#test-collection li').toArray().forEach(function (li) {
    assert.equal($(li).html(), ';)');
  });
});

test('attr() will returns the requested attribute of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  assert.equal($el.find('#test-id').attr('id'), 'test-id');
});

test('attr() can set the attribute of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  el.find('#test-id').attr('class', 'test-attr');
  assert.ok($el.find('#test-id').hasClass('test-attr'));
});

test('css() will returns the requested style of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  assert.equal($el.find('#test-id').css('fontSize'), '12px');
});

test('css() can set a style of the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  el.find('#test-id').css('fontSize', '20px');
  assert.equal($el.find('#test-id').css('fontSize'), '20px');
});

test('data() will returns the value of a data-* attribute of an element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  assert.equal($el.find('#test-id').data('test'), '✔');
});

test('data() can set a data attribute of an element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture');
  let el = new Element($el[0], doc);

  el.find('#test-id').data('pet', '🐹');
  assert.equal($el.find('#test-id').data('pet'), '🐹');
});

test('replaceWith() will replace the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#test-collection')
  let el = new Element($el[0], doc);

  el.find('.replace-collection').replaceWith("<span class='replaced'></span>");

  assert.notOk($('.replace-collection').length);
  assert.ok($('.replaced').length);
});

test('append() will append HTML to the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture')
  let el = new Element($el[0], doc);

  el.find('#test-collection').append("<span class='appended'></span>");

  assert.ok($('.appended').length);
  assert.ok($('.appended').index() !== 0);
});

test('prepend() will append HTML to the element', function (assert) {
  let doc = MockDocument();
  let $el = $('#qunit-fixture')
  let el = new Element($el[0], doc);

  el.find('#test-collection').prepend("<span class='prepended'></span>");

  assert.ok($('.prepended').length);
  assert.equal($('.prepended').index(), 0);
});
