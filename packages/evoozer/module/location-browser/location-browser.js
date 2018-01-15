/**
 * The proposal of this module is to provide an API for the user to read/write the current url of the module.
 * It should primary be a wrapper above window.location.href, but with the ability to function server-side.
 */

import Module from '../module';
import location from '../location';
import nodeURL from 'url';

const { URL = global.URL } = nodeURL;

export default new Module('locationBrowser', [ location ])
  .config(['locationProvider', locationProvider => {
    const { document, history,location } = global;
    if(!(document && history && location)) {
      throw new Error('module/location-browser must be initialized in a browser');
    }
    const addEventListener = global.addEventListener.bind(global);

    const subscribers = [];

    //  For title
    const getCurrentTitle = () => document.title || '';

    //  For url
    const getCurrentURL = () => {
      //const { pathname, search = '', hash = '' } = location;
      return document.URL;
    };

    const constructURL = (first, base) => {
      try {
        const url = new URL(first);
        return url;
      } catch(err) {
        return new URL(first, base);
      }
    };

    const sameOrigin = (first, second) => {
      const base = getCurrentURL();
      first = constructURL(first, base);
      second = constructURL(first, base);
      return first.protocol === second.protocol && first.host === second.host;
    };

    let currentState = null;
    const getCurrentState = () => currentState;

    const handleStateChange = (ev) => {
      const url = getCurrentURL();
      const state = ev.state;
      const title = getCurrentTitle();
      currentState = state;
      subscribers.forEach(cb => cb(url, state, title));
    };


    const onLocationChange = (cb) => {
      subscribers.push(cb);
      cb(getCurrentURL(), getCurrentState(), getCurrentTitle());
    };

    const setLocation = (state, title, url) => {
      if(!sameOrigin(url, getCurrentURL())) {
        location.assign(url);
        return;
      }
      currentState = state;
      history.pushState(state, title, url);
      handleStateChange({ state });
    };

    const replaceLocation = (state, title, url) => {
      if(!sameOrigin(url, getCurrentURL())) {
        location.replace(url);
      }
      currentState = state;
      history.replaceState(state, title, url);
      handleStateChange({state: state});
    };


    locationProvider.setLocationSourceHandler({ onLocationChange, setLocation, replaceLocation });

    addEventListener('popstate', handleStateChange, false);

  }]);