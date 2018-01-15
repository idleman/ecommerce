import nodeURL from 'url';
import copy from '../../../copy';
import isEqual from '../../../isEqual';

const { URL = global.URL } = nodeURL;


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

    const urlData = this._getURLData(newUrl, newState, newTitle);
    const previous = { url: dataMap.url, state: dataMap.state, title: dataMap.title };
    //
    if(!urlData) {
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

  _getURLData(currentUrl, state, title, changes = {}) {
    const { useList } = this._LocationService;
    const urlObject = new URL(currentUrl);
    Object.assign(urlObject, { state, title }, changes);
    const result = useList.some(cb => !cb(urlObject));
    return result ? false : urlObject;
  }

};