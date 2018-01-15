import immutable from 'immutable';
import createReducer from 'evoozer/createReducer';
import setProductItemMap from '../action/setProductItemMap';

module.exports = createReducer({
  setMapAction: setProductItemMap,
  Record: immutable.Record({
    name: '',
    amount: 0,
    currency: '',
    category: ''
  })
});
