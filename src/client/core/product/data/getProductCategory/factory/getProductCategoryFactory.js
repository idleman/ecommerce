import immutable from 'immutable';
import createSelectorFactory from 'evoozer/createSelectorFactory';
import getProductCategoryId from '../../getProductCategoryId/factory';
import getProductCategoryMap from '../../getProductCategoryMap/factory';

export default createSelectorFactory(
  [ getProductCategoryMap, getProductCategoryId ],
  ( productCategoryMap, productCategoryId ) => {
    return productCategoryMap.get(productCategoryId, immutable.Map());
  }
);
