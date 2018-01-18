import LocationService from '../LocationService';

export default class LocationProvider {

  static get $inject() {
    return ['$invoke', '$construct'];
  }

  constructor($invoke, $construct) {
    const useList = [];
    const configureHandlers = [];
    const locationSourceHandler = null;

    this._LocationProvider = {
      useList,
      $invoke,
      $construct,
      configureHandlers,
      locationSourceHandler
    };
  }

  use(...callbacks) {
    this._LocationProvider.useList.push(...callbacks);
    return this;
  }

  /**
   * The point of this method is to make it easy to outsource the internal location state, so it can be read and set everywhere.
   * @param locationSourceHandler
   * @returns {LocationProvider}
   */
  setLocationSourceHandler(locationSourceHandler) {
    this._LocationProvider.locationSourceHandler = locationSourceHandler;
    return this;
  }

  configure(...args) {
    this._LocationProvider.configureHandlers.push(...args);
    return this;
  }

  $get() {
    const dataMap = this._LocationProvider;
    const { $construct, $invoke, useList, configureHandlers } = dataMap;

    const onConfigured = () => {
      const $$locationSourceHandler = dataMap.locationSourceHandler;
      const $$locationUseList = useList;
      const locals = { $$locationSourceHandler, $$locationUseList };
      return $construct(LocationService, locals);
    };

    return Promise.all(configureHandlers.map(cb => $invoke(cb)))
      .then(onConfigured);
  }

};