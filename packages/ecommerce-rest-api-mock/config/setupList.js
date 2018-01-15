import Headers from '../../evoozer/http/headers';
import Response from '../../evoozer/http/response';

import immutable from 'immutable';

import db from '../db';

export default ['httpProvider', function setupHttpProvider(httpProvider) {
  const API_URL = '/api';

  const { categories, products } = db;
  const categoryMap = immutable.fromJS(categories);
  const productMap = immutable.fromJS(products);

  const categoriesGroupedByParent = categoryMap.groupBy(map => map.get('parent', -1));
  const productsGroupedByCategory = productMap.groupBy(map => map.get('category', -1));

  const collectProductCategoryIds = (set, item, id) => set.concat(id);

  const LiteProduct = immutable.Record({
    name: '',
    category: '',
    amount: 0,
    currency: ''
  });

  const collectProductByCategoryId = (result, productCategoryId) => {
    const matchedProductMap = productsGroupedByCategory.get(productCategoryId, immutable.Map());
    return result.merge(matchedProductMap.map(item => LiteProduct(item)));
  };

  // list all products below a specific category
  httpProvider.when(`${API_URL}/list/:productCategoryId`, function onProductRequest(request, params) {
    const { productCategoryId } =  params;
    const listResult = categoriesGroupedByParent.get(productCategoryId, immutable.Map())
      .reduce(collectProductCategoryIds, immutable.Set([productCategoryId]))
      .reduce(collectProductByCategoryId, immutable.Map());

    const body = JSON.stringify(listResult.toJS());
    return new Response(body, {
      headers: new Headers({ 'Content-Type' : 'application/json'})
    });
  });

}];