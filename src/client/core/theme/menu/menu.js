/**
 * The component that renders all menus on the website
 */
import URL from 'evoozer/http/url';
import immutable from 'immutable';

import "./menu.less";

export default [
  'view',
  'location',
  'router/link',
  'store/view/connect',
  function constructThemeLogo(View, location, Link, connect) {


    const isActive = (href, url) => {
      if(!(url && href)) {
        return false;
      }
      const obj = new URL(href, location.url());
      return obj.href === url;
    };

    const hasActive = (item, url) => {
      if(item.has('href')) {
        const href = item.get('href');
        if(isActive(href, url)) {
          return true;
        }
      }
      return item.get('items', immutable.List()).some(item => hasActive(item, url));
    };

    const MenuItem = (props) => {
      const { MenuList, active, show, source = immutable.Map() } = props;
      const name = source.get('name', '');
      const href = source.get('href', '');
      const Component = source.get('Component', null);
      const items = source.get('items', immutable.List());
      const alwaysShowItems = source.get('alwaysShowItems', false);

      if(Component) {
        return (<Component />);
      }


      const cssClassNameIsActive = 'component-theme-menu--item-is-active';
      const cssClassNameHasActive = 'component-theme-menu--item-has-active';

      const $isActive = isActive(href, active);
      const $hasActive = $isActive ? true : hasActive(source, active);

      const element = href ? (<Link href={href}>{name}</Link>) : (<div>{name}</div>);
      const length = items.count();
      const content = length ? (<h3>{element}</h3>) : element;
      const children = (length && (alwaysShowItems || $hasActive)) ? (<MenuList active={active} items={items} />) : null;

      const className = $isActive ? cssClassNameIsActive : ($hasActive ? cssClassNameHasActive : '');


      return (
        <li className={className}>
          {content}
          {children}
        </li>
      );
    };


    class MenuList extends View.Component {

      render() {
        const { items = immutable.List(), active,  ...extraProps } = this.props;
        const compiledItems = items.map(item => (<MenuItem MenuList={MenuList} active={active} source={item} />));
        return (
          <ul { ...extraProps }>{compiledItems}</ul>
        );
      }

    }

    class ThemeMenu extends View.Component {

      render() {
        const { skin = 'default', ...props } = this.props;
        const componentClassName = 'component-theme-menu';
        const className = (componentClassName + ' ' + skin.split(' ').map(skinName => `${componentClassName}--${skinName}`).join(' ')).trim();
        return (
          <MenuList className={className} { ...props } />
        );
      }

    }


    const mapStateToProps = (state) => {
      const history = state.getIn(['router', 'history'], immutable.List());
      const last = history.last();
      const active = last.get('url');
      return {
        active
      };
    };
    return connect(mapStateToProps, null, null, { pure: false})(ThemeMenu);
  }
];