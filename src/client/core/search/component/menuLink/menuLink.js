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
  function constructSearchMenuLink(location, View, Link, Icon, Popup) {

    class SearchPopup extends View.Component {

      constructor(...args) {
        super(...args);
        const value = '';
        this.state = { value };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
      }

      handleOnChange(ev) {
        // do a pre-search here
        const { value } = ev.target;
        this.setState({ value });
      }

      handleOnSubmit(ev) {
        // do a pre-search here
        ev.preventDefault();
        const { value } = this.state;
        if(!value) {
          return;
        }
        const encoded = encodeURIComponent(value);
        const href = `/search/${encoded}`;
        location.set({ href });
      }

      render() {
        return (
          <Popup skin="search-menu-link">
            <form onSubmit={this.handleOnSubmit}>
              <input type="text" onChange={this.handleOnChange} autoFocus={true} placeholder="What can we help you find?" />
            </form>
          </Popup>
        )
      }
    }

    return class SearchMenuLink extends View.Component {

      render() {

        return (
          <div className="component-theme-search-menu-link">
            <div><Icon type="search" /> Search</div>
            <SearchPopup />
          </div>
        );
      }

    };
  }
];