export default ['/theme/navigationProvider', function setupThemeNavigationProvider(navigationProvider) {
  navigationProvider.configure(['/checkout/menuLink', menuLink => {
    navigationProvider.setCheckoutElement(menuLink);
  }]);
}];