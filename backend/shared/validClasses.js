const VALID_CLASSES = new Set(['X', 'S2', 'S1', 'A', 'B', 'C', 'D']);

function isValidClass(cls) {
  return cls && VALID_CLASSES.has(cls.toUpperCase());
}

module.exports = { isValidClass };