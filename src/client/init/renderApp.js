export default ['router', 'view', 'view/render', function renderApp(Router, View, render) {
  const { document = {} } = global;
  const container = document.createElement('div');
  const element = (<Router />);
  render(element, container);
  document.body.appendChild(container);
}];