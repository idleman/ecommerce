import immutable from 'immutable';

export default function ensureSameReferenceIfIdentical(cb) {
  let current = 0;
  return function(...args) {
    const next = cb(...args);
    if(immutable.is(current, next)) {
      return current;
    }
    current = next;
    return current;
  };
};
