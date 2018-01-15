export default ['routerProvider', function setupRouter(routerProvider) {

  routerProvider
    .when('/', { component: '/product/page/index' });
}];