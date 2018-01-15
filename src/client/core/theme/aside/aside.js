/**
 * Construct a page container.
 */
import "./aside.less";
import immutable from 'immutable';

export default [
  'view',
  '/theme/menu',
  '/theme/navigation',
  'store/view/connect',
  function constructThemeLogo(View, ThemeMenu, navigation, connect) {

    const { productCategoryMenuSelector } = navigation;
    class ThemeAside extends View.Component {

      render() {


        const { productCategoryMenu = immutable.Map() } = this.props;
        const menuItems = immutable.List([
          immutable.Map({
            name: 'Categories',
            href: '/',
            alwaysShowItems: true,
            items: productCategoryMenu
          })
        ]);

        return (
          <aside className="component-theme-aside">
            <ThemeMenu items={menuItems} skin="aside" />
          </aside>
        );
      }

    }

    const mapStateToThemeAsideProps = (...args) => {
      const productCategoryMenu = productCategoryMenuSelector(...args);
      //console.log('mapStateToThemeAsideProps, ', productCategoryMenu.toJS());
      return {
        productCategoryMenu
      };
    };
    return connect(mapStateToThemeAsideProps, null, null, { pure: false })(ThemeAside);
  }
];