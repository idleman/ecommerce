
export default class NavigationProvider {

  static get $inject() {
    return ['$invoke'];
  }

  constructor($invoke) {
    const configure = [];
    // const footerMenu = [];
    // const verticalMenu = [];
    // const horizontalMenu = [];

    const productCategoryMenuSelector = () => ({ items : [] });
    const SearchElement = null;
    const AccountElement = null;
    const CheckoutElement = null;

    this._NavigationProvider = {
      $invoke,
      configure,
      // footerMenu,
      // verticalMenu,
      // horizontalMenu,
      productCategoryMenuSelector,
      SearchElement,
      CheckoutElement,
      AccountElement,

    };
  }

  setCheckoutElement(CheckoutElement) {
    this._NavigationProvider.CheckoutElement = CheckoutElement;
    return this;
  }

  setAccountElement(AccountElement) {
    this._NavigationProvider.AccountElement = AccountElement;
    return this;
  }

  setSearchElement(SearchElement) {
    this._NavigationProvider.SearchElement = SearchElement;
    return this;
  }

  setProductCategoryMenuSelector(productCategoryMenuSelector) {
    this._NavigationProvider.productCategoryMenuSelector = productCategoryMenuSelector;
    return this;
  }

  configure(...args) {
    this._NavigationProvider.configure.push(...args);
    return this;
  }

  $get() {
    return new Promise((resolve, reject) => {
      const { configure, $invoke } = this._NavigationProvider;

      const onConfigured = () => {
        const { CheckoutElement, SearchElement, AccountElement, productCategoryMenuSelector } = this._NavigationProvider;
        return {
          productCategoryMenuSelector,
          SearchElement,
          CheckoutElement,
          AccountElement
        };
      };

      Promise.all(configure.map((cb) => $invoke(cb)))
        .then(onConfigured)
        .then(resolve, reject);
    });
  }

};