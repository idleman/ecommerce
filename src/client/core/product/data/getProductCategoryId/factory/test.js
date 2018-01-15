import assert from 'assert';
import getProductCategoryIdFactory from './getProductCategoryIdFactory';

const { strictEqual } = assert;

describe('getProductCategoryIdFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductCategoryIdFactory, 'function');
  });

  it('should return a function', function() {
    const getProductCategoryId = getProductCategoryIdFactory();
    strictEqual(typeof getProductCategoryId, 'function');
  });

  describe('getProductCategoryId', function() {

    it('should return a empty string as default', function() {
      const getProductCategoryId = getProductCategoryIdFactory();
      const seq = getProductCategoryId(null, {});
      strictEqual(seq, '');
    });

    it('should return all props.productCategoryId', function() {
      const getProductCategoryId = getProductCategoryIdFactory();
      const dummy = 123;
      const productCategoryId = '8623';
      const result = getProductCategoryId(null, { dummy, productCategoryId });
      strictEqual(result, productCategoryId);
    });

  });

});
