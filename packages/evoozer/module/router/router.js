import Module from '../module';
import store from '../store';
import location from '../location';
import view from '../view';

import RouterProvider from './RouterProvider';
import Link from './Link';

// Provides 2 things:
//
//  - A link between the location and the store and always keep them in sync
//  - A component that renders a component based on url.
export default new Module('router', [ location, store, view ])
  .provider('router', RouterProvider)
  .factory('router/link', Link);