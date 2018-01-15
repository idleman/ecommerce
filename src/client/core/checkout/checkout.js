/**
 * Contains all search related stuff.
 */
import Module from 'evoozer/module';
import view from 'evoozer/module/view';
import router from 'evoozer/module/router';
import theme from '../theme';
import setupRouter from './config/setupRouter';
import setupTheme from './config/setupTheme';
import checkoutPage from './component/page';
import menuLink from './component/menuLink';

export default new Module('checkout', [ view , router, theme ])
  .factory('/checkout/menuLink', menuLink)
  .factory('/checkout/page', checkoutPage)
  .config(setupTheme)
  .config(setupRouter);