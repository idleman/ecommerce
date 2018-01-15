/**
 * Construct the the complete product catalog page component
 */

export default ['view', '/theme/page', function constructProductCatalogComponent(View, Page) {

  return class SearchPage extends View.Component {

    render() {
      return (
        <Page>
          <h1>I am search page !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>
        </Page>
      );
    }

  };
}];