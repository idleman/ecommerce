export default ['routerProvider', function setupRouter(routerProvider) {

  routerProvider.when('/search/:condition', { component: '/search/page' })
}];