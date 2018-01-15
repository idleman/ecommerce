/**
 * Construct the the complete checkout page here
 */

export default ['view', '/theme/page', function constructProductCatalogComponent(View, Page) {

  return class CheckoutPage extends View.Component {

    render() {
      return (
        <Page>
          <h1>I am checkout page</h1>
        </Page>
      );
    }

  };
}];