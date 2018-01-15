/**
 * A helper component to create icons.
 */

export default ['view', function constructThemeIcon(View) {

  return class ThemeIcon extends View.Component {

    render() {
      const { type = '' } = this.props;
      const className = `fa fa-${type}`;
      return type ? (<i className={className} aria-hidden="true" />) : null;
    }

  };
}];