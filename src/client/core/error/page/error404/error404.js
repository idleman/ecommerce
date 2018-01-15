export default ['view', '/theme/page', function constructError404Page(View, Page) {

  return class Error404Page extends View.Component {

    render() {
      return (
        <Page>
          <h1>Error 404</h1>
          <p>This page does not exists. Maybe have it not been implemented yet?</p>
        </Page>
      );
    }

  };
}];