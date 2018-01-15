/**
 * Contains all search related stuff.
 */
import Module from 'evoozer/module';
import view from 'evoozer/module/view';
import router from 'evoozer/module/router';
import theme from '../theme';
import setupRouter from './config/setupRouter';
import setupTheme from './config/setupTheme';
import searchPage from './component/page';
import menuLink from './component/menuLink';

export default new Module('search', [ view , router, theme ])
  .factory('/search/page', searchPage)
  .factory('/search/menuLink', menuLink)
  .config(setupTheme)
  .config(setupRouter);