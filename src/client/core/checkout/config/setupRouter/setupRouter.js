export default ['routerProvider', function setupRouter(routerProvider) {

  routerProvider.when('/checkout', { component: '/checkout/page' });
}];