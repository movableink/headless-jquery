import selectorForElement from 'headless-jquery/selector-for-element';

module('headless-jquery/selector-for-element');

test('id attribute for element', function (assert) {
  assert.equal(selectorForElement($('#test-id')), '#test-id');
});

test('class names for elements', function (assert) {
  assert.equal(selectorForElement($('.test-class')), 'body > #qunit-fixture > div.test-class');
});

test('missing class and tag name', function (assert) {
  assert.equal(selectorForElement($('.test-position li:last-child')), 'body > #qunit-fixture > ul.test-position > li:eq(2)');
});

test('multiple class names', function (assert) {
  assert.equal(selectorForElement($('.multiple')), 'body > #qunit-fixture > div.test-class.multiple');
});
