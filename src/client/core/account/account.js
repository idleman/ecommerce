/**
 * Contains all search related stuff.
 */
import Module from 'evoozer/module';
import view from 'evoozer/module/view';
import router from 'evoozer/module/router';
import theme from '../theme';
import setupRouter from './config/setupRouter';
import setupTheme from './config/setupTheme';
import loginPage from './component/page/login';
import menuLink from './component/menuLink';

export default new Module('search', [ view , router, theme ])
  .factory('/account/page/login', loginPage)
  .factory('/account/menuLink', menuLink)
  .config(setupTheme)
  .config(setupRouter);