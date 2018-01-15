/**
 * Contains The visual components that decide the design.
 */
import Module from 'evoozer/module';
import view from 'evoozer/module/view';
import header from './header';
import footer from './footer';
import menu from './menu';
import icon from './icon';
import logo from './logo';
import aside from './aside';
import page from './page';
import popup from './popup';

import NavigationProvider from './NavigationProvider';

export default new Module('theme', [ view ])
  .factory('/theme/page', page)
  .factory('/theme/header', header)
  .factory('/theme/footer', footer)
  .factory('/theme/aside', aside)
  .factory('/theme/menu', menu)
  .factory('/theme/logo', logo)
  .factory('/theme/icon', icon)
  .factory('/theme/popup', popup)
  .provider('/theme/navigation', NavigationProvider);

