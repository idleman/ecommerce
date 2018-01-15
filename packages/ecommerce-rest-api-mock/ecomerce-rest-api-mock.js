/**
 *  This module will mock away all the HTTP calls to the server. Can be really useful for testing.
 */

import Module from '../evoozer/module';
import http from '../evoozer/module/http';
import setupProducts from './config/setupProducts';
import setupList from './config/setupList';
import setupCategories from './config/setupCategories';

export default new Module('ecommerce-rest-api-mock', [ http ])
  .config(setupList)
  .config(setupProducts)
  .config(setupCategories);
