import Map from 'virtual-jquery/map';

module('virtual-jquery/map', {
  beforeEach() {
    this.subject = new Map();
  }
});

test('Map#size is initially 0', function (assert) {
  assert.equal(this.subject.size, 0);
});

test("Map#get returns undefined if the key doesn't exist", function (assert) {
  assert.equal(this.subject.get('key'), void(0));
});

test("Map#get returns the value that was set", function (assert) {
  this.subject.set('key', 'value');
  assert.equal(this.subject.get('key'), 'value');
});

test('Map#set allows DOM elements to be keys', function (assert) {
  let body = document.body;
  this.subject.set(body, 'value');
  assert.equal(this.subject.get(body), 'value');
});

test('Map#set allows null / undefined to be a key', function (assert) {
  this.subject.set(null, 'a');
  this.subject.set(void(0), 'b');
  assert.equal(this.subject.get(null), 'a');
  assert.equal(this.subject.get(void(0)), 'b');
});

test('Map#set will overwrite old values if the key is reset', function (assert) {
  this.subject.set('key', 'a');
  assert.equal(this.subject.get('key'), 'a');

  this.subject.set('key', 'b');
  assert.equal(this.subject.get('key'), 'b');
});

test('Map#delete will remove the value from the map', function (assert) {
  this.subject.set('key', 'a');
  this.subject.delete('key');
  assert.notOk(this.subject.has('key'));
});

test('Map#set will overwrite old values if the key is reset', function (assert) {
  this.subject.set('key', 'a');
  assert.equal(this.subject.get('key'), 'a');

  this.subject.set('key', 'b');
  assert.equal(this.subject.get('key'), 'b');
});

test("Map#has returns false if the key doesn't exist", function (assert) {
  assert.notOk(this.subject.has('key'));
});

test("Map#has returns true if the key does exist", function (assert) {
  this.subject.set('key', 'value');
  assert.ok(this.subject.has('key'));
});

test('Map#has will return true if the value is set to undefined', function (assert) {
  this.subject.set('key', void(0));
  assert.ok(this.subject.has('key'));
});
