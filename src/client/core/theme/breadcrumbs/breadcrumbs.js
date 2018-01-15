/**
 * Construct a page container.
 */
import "./breadcrumbs.less";

export default [
  'view',
  'router/link',
  function constructThemeBreadcrumbs(View, Link) {

  const productMenu = [
    { name: 'home', }
  ];

  class BreadcrumbsItem extends View.Component {

    render() {

    }

  }

  return class Breadcrumbs extends View.Component {

    render() {
      return (
        <ul className="component-theme-breadcrumbs">
          <Link className="component-theme-logo"></Link>
        </ul>
      );
    }

  };
}];