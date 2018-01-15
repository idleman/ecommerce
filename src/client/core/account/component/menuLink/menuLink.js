/**
 * Construct the checkout menu link.
 */
import "./menuLink.less";

export default [
  'location',
  'view',
  'router/link',
  '/theme/icon',
  '/theme/popup',
  function constructAccountMenuLink(location, View, Link, Icon, Popup) {

    const loginUrl = '/account/login';
    class AccountPopup extends View.Component {

      render() {
        return (
          <Popup skin="account-menu-link">
            <Link href="/account/login" className="component-account-link">Sign In</Link>
          </Popup>
        );
      }

    }


    return class AccountLink extends View.Component {

      render() {
        return (
          //<Link href={loginUrl} className="component-account-menu-link">
            <div>Sign In <Icon type="caret-down" /></div>
            //<AccountPopup />
          //</Link>
        );
      }

    };
  }
];