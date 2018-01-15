/**
 * Core implements only no browser-specific data, so the client can, if needed, be rendered on the server.
 */
import Module from 'evoozer/module';
import product from './product';
import theme from './theme';
import search from './search';
import checkout from './checkout';
import account from './account';
import error from './error';
import setupRouter from './config/setupRouter';

export default new Module('core', [ product, search, checkout, account, theme, error ])
  .config(setupRouter);