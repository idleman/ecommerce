export default ['/theme/navigationProvider', function setupThemeNavigationProvider(navigationProvider) {
  navigationProvider.configure(['/account/menuLink', menuLink => {
    navigationProvider.setAccountElement(menuLink);
  }]);
}];