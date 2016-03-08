import V$ from 'virtual-jquery';

module('virtual-jquery');

test('toString returns the HTML serialized back to a string', function (assert) {
  let $ = V$(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hello</title>
      </head>
      <body></body>
    </html>
  `);

  assert.equal($.toString().replace(/\n\s+/g, ''), `<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Hello</title></head><body></body></html>`);
});

test('find() returns the element that matches the selector', function (assert) {
  let $ = V$(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hello</title>
      </head>
      <body></body>
    </html>
  `);

  let title = $.find('title');
  assert.equal(title.length, 1);
  assert.equal(title[0].tagName, 'title');
});

test('invoking the return value is the same as find()', function (assert) {
  let $ = V$(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hello</title>
      </head>
      <body></body>
    </html>
  `);

  let title = $.find('title');
  assert.equal(title.length, 1);
  assert.equal(title[0].tagName, 'title');
});

test('event subscriptions can be triggered', function (assert) {
  assert.expect(1);

  let $ = V$('');
  $.on('setStyle', function (...args) {
    assert.deepEqual(args, ['nav', 'backgroundColor', 'blue']);
  });
  $.on('setAttr', function () {
    assert.ok(false);
  });

  $.trigger('setStyle', 'nav', 'backgroundColor', 'blue');
});

test('removed event handlers will not be triggered', function (assert) {
  assert.expect(1);

  let $ = V$('');
  let callback = function () {
    assert.ok(true);
  };

  $.on('change', callback);
  $.trigger('change');
  $.off('change', callback);
  $.trigger('change');
});