/**
 * Construct a helper popup
 */
import "./popup.less";

export default [
  'view',
  '/theme/icon',
  function constructPopup(View, Icon) {

    return class Popup extends View.Component {

      render() {
        const { skin, ...props } = this.props;
        const componentClassName = 'component-theme-popup';
        const className = (componentClassName + ' ' + skin.split(' ').map(skinName => `${componentClassName}--${skinName}`).join(' ')).trim();

        return (
          <div className={className} { ...props}>
            <Icon type="angle-up" />
            <div>{this.props.children}</div>
          </div>
        );
      }

    };
  }
];