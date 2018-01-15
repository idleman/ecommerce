// import { strictEqual } from 'assert';
// import Module from './../../module';
// import LocationBrowserModule from './location-browser';
// import LocationBrowserProvider from './provider';
//
// describe('WoodFire LocationBrowser Module', function() {
//
//   function createModule() {
//     const moduleName = 'locationBrowserTest' + Math.random();
//     return new Module(moduleName, [ LocationBrowserModule ]);
//   }
//
//   it('should export an WoodFire module instance', function() {
//     strictEqual(LocationBrowserModule instanceof Module, true);
//   });
//
//   it('should be able to bootstrap', function(next) {
//     let module = createModule();
//     const instance = module.createInstance();
//     instance.initiate()
//       .then(next.bind(null, null), next);
//   });
//
//   it('should define "locationBrowser"', function(next) {
//     let module = createModule();
//
//     module.config(['locationBrowserProvider', function(locationBrowserProvider) {
//       strictEqual(locationBrowserProvider instanceof LocationBrowserProvider, true);
//     }]);
//
//     const instance = module.createInstance();
//     instance.initiate()
//       .then(next.bind(null, null), next);
//   });
//
// });