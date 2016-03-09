import Symbol from 'virtual-jquery/symbol';

module('virtual-jquery/symbol');

test('creating an instance of a Symbol with throw an error', function (assert) {
  assert.throws(function () {
    new Symbol();
  });
});

test('calling Symbol returns a new value every time', function (assert) {
  let a = Symbol();
  let b = Symbol();

  assert.notEqual(a, b);
});

test('Symbol.for generates a new symbol if none exists', function (assert) {
  assert.ok(Symbol.for('iterator'));
});

test('Symbol.for returns the same symbol when asked multiple times', function (assert) {
  assert.ok(Symbol.for('generator'), Symbol.for('generator'));
});
