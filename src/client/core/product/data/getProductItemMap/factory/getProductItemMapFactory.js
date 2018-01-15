import immutable from 'immutable';
import createSelectorFactory from 'evoozer/createSelectorFactory';
import getState from 'evoozer/data/getState/factory';

export default createSelectorFactory(
  [ getState ],
  ( state ) => {
    return state.get('productItemMap', immutable.Map())
  }
);
