let sharedSymbols = {};

function generateSymbol() {
  let uid = [1, 2, 3].map(function () {
    return Math.round(Math.random() * 0x100000).toString(16);
  }).join('-');
  return '_symbol_' + uid;
}

function Symbol(key) {
  if (this instanceof Symbol) {
    throw new TypeError('Cannot call `new` on Symbol');
  }

  let symbol = generateSymbol();
  if (key) {
    sharedSymbols[key] = symbol;
  }
  return symbol;
}

Symbol.for = function (key) {
  if (sharedSymbols[key]) {
    return sharedSymbols[key];
  }
  return Symbol(key);
}

export default Symbol;
