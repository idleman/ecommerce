/**
 * Contains all search related stuff.
 */
import Module from 'evoozer/module';
import view from 'evoozer/module/view';
import router from 'evoozer/module/router';
import theme from '../theme';
import setupRouter from './config/setupRouter';
import error404Page from './page/error404';

export default new Module('error', [ view , router, theme ])
  .factory('/error/page', error404Page)
  .config(setupRouter);