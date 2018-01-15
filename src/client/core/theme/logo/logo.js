/**
 * Construct a page container.
 */
import "./logo.less";

export default ['view', 'router/link', function constructThemeLogo(View, Link) {

  return class ThemeLogo extends View.Component {

    render() {
      return (
        <Link href="/" className="component-theme-logo">
          <h3>E-COMMERCE</h3>
        </Link>
      );
    }

  };
}];