import VirtualJQuery from 'virtual-jquery';

module('virtual-jquery');

test('toString returns the HTML serialized back to a string', function (assert) {
  let $ = new VirtualJQuery(`
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

test('event subscriptions can be triggered', function (assert) {
  assert.expect(1);

  let $ = new VirtualJQuery('');
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

  let $ = new VirtualJQuery('');
  let callback = function () {
    assert.ok(true);
  };

  $.on('change', callback);
  $.trigger('change');
  $.off('change', callback);
  $.trigger('change');
});
