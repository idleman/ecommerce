export default ['routerProvider', function setupRouter(routerProvider) {
  routerProvider.otherwise({
    onEnter() {
      alert('This page do not yet exist, sorry');
    }
  })
}];