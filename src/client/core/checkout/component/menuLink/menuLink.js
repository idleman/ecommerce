/**
 * Construct the checkout menu link.
 */
import "./menuLink.less";

export default [
  'view',
  'router/link',
  '/theme/icon',
  '/theme/popup',
  function constructCheckoutMenuLink(View, Link, Icon, Popup) {

    class CheckoutBagPopup extends View.Component {

      constructor(...args) {
        super(...args);
        this.handleOnClick = this.handleOnClick.bind(this);
      }

      handleOnClick(ev) {
        if(ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      }

      render() {
        return (
          <Popup skin="checkout-menu-link" onClick={this.handleOnClick}>
            <div>Your cart is empty</div>
          </Popup>
        )
      }
    }

    return class CheckoutMenuLink extends View.Component {

      render() {

        return (
          <Link href="/checkout" className="component-theme-checkout-menu-link">
            <div>Checkout <Icon type="shopping-bag" /></div>
            <CheckoutBagPopup />
          </Link>
        );
      }

    };
  }
];