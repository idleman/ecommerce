import immutable from 'immutable';
import createSelectorFactory from 'evoozer/createSelectorFactory';
import getProductCategoryMap from '../../getProductCategoryMap/factory';

const MenuItem = immutable.Record({
  name: '',
  href: '',
  items: immutable.List()
});


export default createSelectorFactory(
  [ getProductCategoryMap ],
  ( categoryMap ) => {
    const groupedMap = categoryMap.groupBy(map => map.get('parent', -1));
    const items  = groupedMap.get(-1, immutable.Map());
    const collectChildren = (item, id, ids = immutable.List()) => {
      ids = ids.push(id);
      const href = '/' + ids.join('/');
      const children = groupedMap.get(id, immutable.List())
        .map((child, childId) => collectChildren(child, childId, ids))
        .toList();

      return MenuItem(item
        .set('href', href)
        .set('items', children)
      );
    };
    return items.map((menu, id) => collectChildren(menu, id)).toList();
  }
);
