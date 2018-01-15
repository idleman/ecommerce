import immutable from 'immutable';
import createSelectorFactory from 'evoozer/createSelectorFactory';
import getProductCategoryMap from '../../getProductCategoryMap/factory';
import getProductItemMap from '../../getProductItemMap/factory';
import getProductCategoryId from '../../getProductCategoryId/factory';

export default createSelectorFactory(
  [ getProductCategoryMap, getProductItemMap, getProductCategoryId ],
  ( categoryMap, productMap, productCategoryId ) => {

    const categoriesGroupedByParent = categoryMap.groupBy(map => map.get('parent', -1));
    const productsGroupedByCategory = productMap.groupBy(map => map.get('category', -1));

    const collectProductCategoryIds = (set, item, id) => set.concat(id);


    const collectProductItemByCategoryId = (set, productCategoryId) => {
      const matchedProductMap = productsGroupedByCategory.get(productCategoryId, immutable.Map());
      return set.merge(matchedProductMap.keySeq());
    };

    return categoriesGroupedByParent.get(productCategoryId, immutable.Map())
      .reduce(collectProductCategoryIds, immutable.Set([ productCategoryId ]))
      .reduce(collectProductItemByCategoryId, immutable.Set());
  }
);
