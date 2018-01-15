/**
 * Contains all product related stuff.
 */
import Module from 'evoozer/module';
import http from 'evoozer/module/http';
import setupRouterAndTheme from './config/setupRouterAndTheme';
import setupStore from './config/setupStore';

import categoryPage from './component/page/category';
import indexPage from './component/page/index';

export default new Module('product', [  http ])
  .config(setupRouterAndTheme)
  .config(setupStore)
  .factory('/product/page/category', categoryPage)
  .factory('/product/page/index', indexPage);