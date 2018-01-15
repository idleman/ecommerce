import immutable from 'immutable';
import createReducer from 'evoozer/createReducer';
import setProductCategoryMap from '../action/setProductCategoryMap';

module.exports = createReducer({
  setMapAction: setProductCategoryMap,
  Record: immutable.Record({
    //id: -1,
    name: '',
    parent: -1,
    description: ''
  })
});
