export default ['/theme/navigationProvider', function setupThemeNavigationProvider(navigationProvider) {
  navigationProvider.configure(['/search/menuLink', menuLink => {
    navigationProvider.setSearchElement(menuLink);
  }]);
}];