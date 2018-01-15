/**
 * Construct a page header.
 */
import "./header.less";
import immutable from 'immutable';

export default [
  'view',
  '/theme/logo',
  '/theme/menu',
  '/theme/navigation',
  function constructThemeHeader(View, Logo, PageMenu, navigation) {

    const { SearchElement, AccountElement, CheckoutElement } = navigation;
    const wrap = (Element) => (props) => (<li><Element { ...props } /></li>);

    const menuItems = immutable.List([
      immutable.Map({ Component: wrap(SearchElement) }),
      immutable.Map({ Component: wrap(AccountElement) }),
      immutable.Map({ Component: wrap(CheckoutElement) })
    ]);

    return class ThemeHeader extends View.Component {

      render() {

        return (
          <header className="component-theme-header">
            <div className="theme-data-container">
              <Logo />
              <PageMenu items={menuItems} />
            </div>
          </header>
        );
      }

    };
  }
];