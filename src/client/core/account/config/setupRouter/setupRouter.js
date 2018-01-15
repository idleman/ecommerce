export default ['routerProvider', function setupRouter(routerProvider) {

  routerProvider.when('/account/login', { component: '/account/page/login' });
}];