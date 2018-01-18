export default ['routerProvider', function setupRouter(routerProvider) {
  routerProvider.otherwise({
    component: '/error/page'
  })
}];