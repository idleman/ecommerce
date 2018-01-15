import createSelectorFactory from 'evoozer/createSelectorFactory';
import getProps from 'evoozer/data/getProps/factory';

export default createSelectorFactory(
  [ getProps ],
  ( props ) => {
    return props.productItemId || '';
  }
);
