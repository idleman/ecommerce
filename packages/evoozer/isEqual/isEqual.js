const hasOwn = Object.prototype.hasOwnProperty;
export default function isEqual(first, second) {
  if(first === second) {
    return true;
  }

  if(!(typeof first === 'object' && typeof second === 'object')) {
    return false;
  }

  let countA = 0;
  let countB = 0;

  for (const key in first) {
    if (hasOwn.call(first, key) && !isEqual(first[key], second[key])) {
      return false;
    }

    countA++;
  }

  for (const key in second) {
    if (hasOwn.call(second, key)) {
      countB++;
    }
  }

  return countA === countB;
};