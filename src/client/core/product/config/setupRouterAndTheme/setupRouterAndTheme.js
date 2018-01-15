import setProductCategoryMap from '../../action/setProductCategoryMap';
import setProductItemMap from '../../action/setProductItemMap';
import getProductCategoryMenu from '../../data/getProductCategoryMenu';

module.exports = ['routerProvider', '/theme/navigationProvider', function setupRouter(routerProvider, navigationProvider) {

  // we want to dynamically generate all urls for all products and ids,
  // so the user can visit a product page or a category page. To make
  // sure the user can do it, do we need to fetch all available products.
  //
  // We create two configure handlers to prevent incorrect invocation order.
  // the below navigationProvider configure handler with router as dependency
  // force router to be instantiated before navigation. Otherwise may not the
  // setProductCategoryMenu have any effect (must be invoked before construction).

  navigationProvider.configure(['router', () => null]);


  routerProvider.configure(['http', 'store', (http, store) => {
    const API_URL = '/api';
    const fetchAllCategories = () => http.fetch(`${API_URL}/category`).then(res => res.json());
    const fetchCategoryData = (id) => http.fetch(`${API_URL}/category/${id}`).then(res => res.json());
    const fetchList = (productCategoryId) => http.fetch(`${API_URL}/list/${productCategoryId}`).then(res => res.json());


    const updateCategoryInStore = (productCategoryId, data) => {
      const action = setProductCategoryMap({ [productCategoryId]: data });
      store.dispatch(action);
    };

    const updateProductItemMapInStore = (productItemMap) => {
      const action = setProductItemMap(productItemMap);
      store.dispatch(action);
    };

    const onCategoryMap = (categoryMap) => {
      const action = setProductCategoryMap(categoryMap);
      store.dispatch(action);
      navigationProvider.setProductCategoryMenuSelector(getProductCategoryMenu);
      const items = getProductCategoryMenu(store.getState(), {});

      const addCategoryRoute = (item) => {
        const href = item.get('href');
        const productCategoryId = href.split('/').pop();
        const onFetchResponse = (data) => {
          const [categoryData, productItemMap] = data; // updateCategoryInStore.bind(null, productCategoryId)]
          updateCategoryInStore(productCategoryId, categoryData);
          updateProductItemMapInStore(productItemMap);
        };

        const onEnter = () => {
          return Promise.all([fetchCategoryData(productCategoryId), fetchList(productCategoryId) ])
            .then(onFetchResponse)
        };
        const component = '/product/page/category';
        const props = { productCategoryId }; // dynamically props added
        routerProvider.when(href, { onEnter, component, props });
        item.get('items').forEach(addCategoryRoute);
      };
      items.forEach(addCategoryRoute);
    };

    return fetchAllCategories()
      .then(onCategoryMap);
  }])

}];