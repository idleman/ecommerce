import immutable from 'immutable';
import assert from 'assert';
import getProductItemFactory from './getProductItemFactory';

const { strictEqual } = assert;

describe('getProductItemFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductItemFactory, 'function');
  });

  it('should return a function', function() {
    const getProductItemId = getProductItemFactory();
    strictEqual(typeof getProductItemId, 'function');
  });

  describe('getProductItem', function() {

    it('should return a empty string as default', function() {
      const getProductItem = getProductItemFactory();
      const seq = getProductItem(immutable.Map(), {});
      strictEqual(seq.isEmpty(), true);
    });

    it('should return all props.productItemMap[productItemId]', function() {
      const getProductItem = getProductItemFactory();
      const productItemId = 'id';
      const productItem = immutable.Map({ name:'Name' });
      const productItemMap = immutable.Map({
        [productItemId]: productItem
      });

      const state = immutable.Map({ productItemMap });
      const result = getProductItem(state, { productItemId });
      strictEqual(result, productItem);
    });

  });

});
