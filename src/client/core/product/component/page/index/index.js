export default [
  'view',
  '/theme/page',
  function constructIndexPage(View, Page) {

    return class IndexPage extends View.Component {

      render() {
        return (
          <Page>
            <h1>This is the start page</h1>
            <p>Please, test to click in the menu to the left. And of course, remember that this is a single page application and is just a proof-of-concept.</p>
          </Page>
        );
      }

    };
  }
];