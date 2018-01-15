import Module from '../module'
import view from '../view';
import StoreProvider from './StoreProvider';
import ConnectProvider from './ConnectProvider';

export default new Module('store', [ view ])
  .provider('store', StoreProvider)
  .provider('store/view/connect', ConnectProvider);


