/**
 * Construct a page container.
 */
import "./page.less";

export default [
  'view',
  '/theme/header',
  '/theme/footer',
  '/theme/aside',
  function constructThemePage(View, Header, Footer, Aside) {

    return class ThemePage extends View.Component {

      render() {
        // Footer is not finnish do dont render it
        return (
          <section className="component-theme-page">
            <Header />
            <div className="component-theme-page-main">
              <div className="theme-data-container">
                <div>
                  <div className="component-theme-page-aside">
                    <hr />
                    <Aside />
                  </div>
                  <div className="component-theme-page-content">{this.props.children}</div>
                </div>
              </div>
            </div>
          </section>
        );
      }

    };
  }
];