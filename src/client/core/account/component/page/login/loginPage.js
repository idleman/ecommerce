/**
 * Construct the the complete product catalog page component
 */

export default ['view', '/theme/page', function constructloginPage(View, Page) {

  return class SearchPage extends View.Component {

    render() {
      return (
        <Page>
          <h1>Login page here</h1>
        </Page>
      );
    }

  };
}];