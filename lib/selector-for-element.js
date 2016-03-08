function getSelector($element, path='') {
  // If this element is <html> we've reached the end of the path.
  if ($element.is('html')) {
    return path.slice(3);
  }

  // Add the element name.
  let tagName = $element.get(0).nodeName.toLowerCase();
  let selector = tagName;

  // Determine the IDs and path.
  let id = $element.attr('id');
  let classNames = $element.attr('class');

  // Add the #id if there is one.
  if (id != null) {
    selector += '#' + id;
  // Add any classes.
  } else if (classNames != null) {
    selector += '.' + classNames.split(/[\s\n]+/).join('.');
  } else {
    let index = $element.index();
    if (['body', 'head'].indexOf(tagName) === -1 && index >= 0) {
      selector += ':eq(' + index + ')';
    }
  }

  // Recurse up the DOM.
  return getSelector($element.parent(), ' > ' + selector + path);
}

export default getSelector;
