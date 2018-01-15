import Module from '../module'
import React from 'react';
const { Component, createElement, PureComponent } = React;

const View = { Component, PureComponent, createElement };

export default new Module('view')
  .constant('view', View);