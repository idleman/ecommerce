import assert from 'assert';
import getProductCategoryMenuFactory from './getProductCategoryMenuFactory';
import immutable from 'immutable';

const { strictEqual } = assert;

describe('getProductCategoryMenuFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductCategoryMenuFactory, 'function');
  });

  it('should return a function', function() {
    const getProductCategoryMenu = getProductCategoryMenuFactory();
    strictEqual(typeof getProductCategoryMenu, 'function');
  });

  describe('getProductCategoryMenu', function() {

    it('should return a empty list as default', function() {
      const getProductCategoryMenu = getProductCategoryMenuFactory();
      const seq = getProductCategoryMenu(immutable.Map(), {});
      strictEqual(seq.isEmpty(), true);
    });

    it('should return all list with correct indentation', function() {
      const getProductCategoryMenu = getProductCategoryMenuFactory();
      const productCategoryMap = immutable.fromJS({
        "eye-complaint": { name:'Eye complaint', parent: 'allergy' },
        'allergy': { name: 'Allergy' }
      });

      const state = immutable.Map({ productCategoryMap });

      const result = getProductCategoryMenu(state, {});
      const expected = immutable.fromJS([
        {
          name: 'Allergy',
          href: '/allergy',
          items: [
            {
              name: 'Eye complaint',
              href: '/allergy/eye-complaint',
              items: []
            }
          ]
        }
      ]);
      strictEqual(immutable.is(expected, result), true);
    });

  });

});
