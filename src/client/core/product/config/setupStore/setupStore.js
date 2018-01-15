import immutable from 'immutable';
import productCategoryMapReducer from '../../reducer/productCategoryMapReducer';
import productItemMapReducer from '../../reducer/productItemMapReducer';

export default ['storeProvider', function setupStore(storeProvider) {

  storeProvider
    .reducer('productCategoryMap', productCategoryMapReducer, immutable.Map())
    .reducer('productItemMap', productItemMapReducer, immutable.Map())
}];