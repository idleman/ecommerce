export default function getPropsFactory() {
  return function getProps(state, props) {
    return props || {};
  };
};
