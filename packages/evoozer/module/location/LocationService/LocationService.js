import URL from '../../../http/url';
import copy from '../../../copy';
import isEqual from '../../../isEqual';

const hasOwn = Object.prototype.hasOwnProperty;

const constructURLDataObject = (newUrl = '', nextState = null, nextTitle = '', changes = {}) => {
  // the URL object has setters on all properties except href
  const { href, ...urlChanges } = changes;

  let current =  href ? new URL(href, newUrl) : new URL(newUrl);

  current.state = nextState;
  current.title = nextTitle;

  if(!href) {
    for(const propertyName in urlChanges) {
      if (hasOwn.call(urlChanges, propertyName)) {
        current[propertyName] = urlChanges[propertyName];
      }
    }
  }

  return current;
};

export default class LocationService {

  static get $inject() {
    return ['$$locationSourceHandler', '$$locationUseList'];
  }

  constructor($$locationSourceHandler, $$locationUseList = []) {
    const url = '';
    const state = {};
    const title = {};
    const useList = $$locationUseList;
    const historyData = { index: -1, history: [] };
    this._LocationService = {
      url,
      state,
      title,
      useList,
      historyData,
      subscribers: [],
      $$locationSourceHandler
    };
    this._handleLocationChange = this._handleLocationChange.bind(this);
    if($$locationSourceHandler) {
      $$locationSourceHandler.onLocationChange(this._handleLocationChange);
      //this.set();
    }
  }

  use(...callbacks) {
    this._LocationService.useList.push(...callbacks);
    return this;
  }

  url() {
    return new URL(this._LocationService.url);
  }

  state() {
    return copy(this._LocationService.state);
  }

  title() {
    return this._LocationService.title;
  }

  set(changes = {}) {
    const { $$locationSourceHandler, url, state, title } = this._LocationService;
    const data = this._getURLData(url, state, title, changes);
    if(data) {
      $$locationSourceHandler.setLocation(data.state, data.title, data.href);
    }
    return this;
  }

  replace(changes = {}) {
    const { $$locationSourceHandler, url, state, title } = this._LocationService;
    const data = this._getURLData(url, state, title, changes);
    if(data) {
      $$locationSourceHandler.replaceLocation(data.state, data.title, data.href);
    }
    return this;
  }

  subscribe(cb) {
    const { subscribers, url, state, title } = this._LocationService;

    if (subscribers.indexOf(cb) === -1) {
      subscribers.push(cb);
      cb(url, state, title);
    }

    return function unsubscribe() {
      const pos = subscribers.indexOf(cb);
      if (-1 < pos) {
        subscribers.splice(pos, 1);
      }
    };
  }

  _handleLocationChange(newUrl = '', newState = {}, newTitle = '') {
    const dataMap = this._LocationService;
    const { subscribers, $$locationSourceHandler } = dataMap;
    const previous = { url: dataMap.url, state: dataMap.state, title: dataMap.title };

    const initial = !dataMap.url;
    if(initial) {
      dataMap.url = newUrl;
      dataMap.state = newState;
      dataMap.title = newTitle;
    }

    const urlData = this._getURLData(newUrl, newState, newTitle);

    if(!initial && !urlData) {
      //  Url was not accepted, reset to the old one.
      $$locationSourceHandler.setLocation(copy(previous.state), previous.title, previous.url);
      return;
    }

    const compiled =  { url: urlData.href, state: urlData.state, title: urlData.title };
    const current = { url: newUrl, state: copy(newState), title: newTitle };

    if(isEqual(current, compiled) === false) {
      // External changed was not accepted
      $$locationSourceHandler.setLocation(compiled.state, compiled.title, compiled.url);
      return;
    }

    if(isEqual(previous, current) === false) {
      //  New state, lets save it
      Object.assign(dataMap, current);
      const { historyData } = dataMap;
      historyData.history[++historyData.index] = current;
      const nextHistory = historyData.history[historyData.index + 1];
      if(nextHistory && current.url !== nextHistory.url) {
        //  New track (the user have clicked back and change direction forward)
        historyData.history.length = historyData.index + 1;
      }
      subscribers.forEach(cb => cb(current.url, copy(current.state), current.title, copy(previous)));
    }
  }

  _getURLData(newUrl, nextState, nextTitle, changes = {}) {
    const { useList } = this._LocationService;
    const urlObject = constructURLDataObject(newUrl, nextState, nextTitle, changes);
    const result = useList.every(cb => cb(urlObject) !== false);
    return result ? urlObject : false;
  }

};