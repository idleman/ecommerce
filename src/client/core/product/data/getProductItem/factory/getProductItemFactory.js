import immutable from 'immutable';
import createSelectorFactory from 'evoozer/createSelectorFactory';
import getProductItemId from '../../getProductItemId/factory';
import getProductItemMap from '../../getProductItemMap/factory';

export default createSelectorFactory(
  [ getProductItemMap, getProductItemId ],
  ( productItemMap, productItemId ) => {
    return productItemMap.get(productItemId, immutable.Map());
  }
);
