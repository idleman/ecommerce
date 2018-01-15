import Module from '../module'
import view from '../view';
import ReactDOM from 'react-dom';

const render = ReactDOM.render.bind(ReactDOM);

export default new Module('view-browser', [ view ])
  .constant('view/render', render);