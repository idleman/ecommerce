
export default function isUndefined(...argv) {
  return !argv.some(t => typeof t !== 'undefined');
};