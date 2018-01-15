//import ReactRouterComponent from './../react-router-component';
import nodeURL from 'url';
const { URL = global.URL } = nodeURL;


export default ['view', 'location', function constructLink(View, location) {
  return class Link extends View.Component {

    constructor(...args) {
      super(...args);
      this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(ev) {
      ev.preventDefault();
      const { href, onClick } = this.props;
      if(href) {
        location.set({ href });
      }
      if(onClick) {
        onClick(ev)
      }
    }

    render() {
      const onClick = this.handleOnClick;
      const props = this.props;
      return (
        <a {...props} onClick={onClick}>{this.props.children}</a>
      );
    }
  }
}];