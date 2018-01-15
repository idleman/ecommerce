
import Module from 'evoozer/module';
import router from 'evoozer/module/router';
import viewBrowser from 'evoozer/module/view-browser';
import locationBrowser from 'evoozer/module/location-browser';
import core from './core';
import renderApp from './init/renderApp';
import mockRestAPI from '../../packages/ecommerce-rest-api-mock';

import "./client.less";

// if you want to do real HTTP request, remove mochRestAPI
const client = new Module('client', [ router, core, viewBrowser, locationBrowser, mockRestAPI ])
  .run(renderApp);


const instance = client.createInstance();

instance.initiate()
  .then(null, console.error.bind(console));
