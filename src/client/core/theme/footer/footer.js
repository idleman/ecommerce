/**
 * Construct page footer container.
 */
import "./footer.less";

export default [
  'view',
  //'router/link',
  //'/theme/navigation',
  function constructThemFooter(View, Link, navigation) {


    return class ThemeFooter extends View.Component {

      render() {

        return (
          <footer className="component-theme-footer">
            <nav className="theme-data-container">
              footer here
            </nav>
          </footer>
        );
      }

    };
  }
];