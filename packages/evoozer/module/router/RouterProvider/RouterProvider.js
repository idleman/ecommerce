import RouteParser from 'route-parser';
import immutable from 'immutable';
import nodeURL from 'url';

const { URL = global.URL } = nodeURL;

const ROUTER_ASSIGN_URL = 'ROUTER_ASSIGN_URL';
const ROUTER_ASSIGN_PRIMARY = 'ROUTER_ASSIGN_PRIMARY';


const routerReducerInitialState = immutable.Map({
  history: immutable.List()
});

const routerReducer = (state = routerReducerInitialState, action) => {
  const { type, value } = action;
  switch (type) {
    case ROUTER_ASSIGN_PRIMARY:
      const history = state.get('history');
      return state.set('history', history.push(value));
    default:
      return state
  }
};


// must return none-false if the process is about to continue
const fireOnEventIfNotInOtherItems = (eventName, otherItems, baseEventParams = {}) => item => {
  const { when } = item;
  const cb = when[eventName];
  if(!cb) {
    return true;
  }

  const otherItemIndex = otherItems.findIndex(otherItem => otherItem.when === when);
  if(otherItemIndex === -1) {
    const eventParams = Object.assign({}, item, baseEventParams);
    return cb(eventParams) !== false;
  }
};


// Reference: https://jsperf.com/levenshtein-perf
function sift4(s1, s2, maxOffset, maxDistance) {
  if (!s1||!s1.length) {
    if (!s2) {
      return 0;
    }
    return s2.length;
  }

  if (!s2||!s2.length) {
    return s1.length;
  }

  var l1=s1.length;
  var l2=s2.length;

  var c1 = 0;  //cursor for string 1
  var c2 = 0;  //cursor for string 2
  var lcss = 0;  //largest common subsequence
  var local_cs = 0; //local common substring
  var trans = 0;  //number of transpositions ('ab' vs 'ba')
  var offset_arr=[];  //offset pair array, for computing the transpositions

  while ((c1 < l1) && (c2 < l2)) {
    if (s1.charAt(c1) == s2.charAt(c2)) {
      local_cs++;
      while (offset_arr.length) {  //see if current match is a transposition
        if (c1<=offset_arr[0][0] || c2 <= offset_arr[0][1]) {
          trans++;
          break;
        } else {
          offset_arr.splice(0,1);
        }
      }
      offset_arr.push([c1,c2]);
    } else {
      lcss+=local_cs;
      local_cs=0;
      if (c1!=c2) {
        c1=c2=Math.min(c1,c2);  //using min allows the computation of transpositions
      }
      //if matching characters are found, remove 1 from both cursors (they get incremented at the end of the loop)
      //so that we can have only one code block handling matches
      for (var i = 0; i < maxOffset; i++) {
        if ((c1 + i < l1) && (s1.charAt(c1 + i) == s2.charAt(c2))) {
          c1+= i-1;
          c2--;
          break;
        }
        if ((c2 + i < l2) && (s1.charAt(c1) == s2.charAt(c2 + i))) {
          c1--;
          c2+= i-1;
          break;
        }
      }
    }
    c1++;
    c2++;
    if (maxDistance)
    {
      var temporaryDistance=Math.max(c1,c2)-lcss+trans/2;
      if (temporaryDistance>=maxDistance) return Math.round(temporaryDistance);
    }
  }
  lcss+=local_cs;
  return Math.round(Math.max(l1,l2)- lcss +trans/2); //remove half the number of transpositions from the lcss
};


export default class RouterProvider {

  static get $inject() {
    return ['$invoke', 'locationProvider', 'storeProvider'];
  }

  constructor($invoke, locationProvider, storeProvider) {
    const configureHandlers = [];
    const whenList = [];
    const routeList = [];
    const otherwiseList = [];
    const currentItems = [];
    const currentWhenIndex = null;

    this._RouterProvider = {
      $invoke,
      whenList,
      routeList,
      currentItems,
      otherwiseList,
      storeProvider,
      locationProvider,
      currentWhenIndex, // used to fire onLeave/onEnter
      configureHandlers
    };
    
    locationProvider.configure(this._configureLocationProvider.bind(this));

    // setupStore
    storeProvider.reducer('router', routerReducer, routerReducerInitialState)
  }

  configure(...args) {
    this._RouterProvider.configureHandlers.push(...args);
    return this;
  }

  when(condition, rules) {
    const { whenList } = this._RouterProvider;
    const whenRule = this._compileWhenRules(condition, rules);
    whenList.push(whenRule);
    return this;
  }

  otherwise(rules) {
    const { otherwiseList } = this._RouterProvider;
    const whenRule = this._compileWhenRules(null, rules);
    otherwiseList.push(whenRule);
    return this;
  }



  bindLocationToStore() {
    const dataMap = this._RouterProvider;
    const { location } = dataMap;
    location.subscribe(url => {
      // calculate primary here...
      const { currentItems } = dataMap;
      // primary item is the most specified condition that meet the current url and which have a component
      let primaryItemIndex = -1;
      let primaryDistance = Infinity;
      const $url = location.url();
      const matchUrl = $url.pathname + $url.search + $url.hash;
      currentItems.forEach((item, index) => {
        const { when } = item;
        const { condition, hasComponent } = when;
        if(!hasComponent) {
          return;
        }
        if(primaryItemIndex === -1) {
          primaryItemIndex = index;
          return;
        }

        const distance = sift4(condition, matchUrl, 256);

        if(distance < primaryDistance) {
          primaryItemIndex = index;
          primaryDistance = distance;
        }
      });

      // We want to send the current URL, and we want to send all props to the state,
      if(primaryItemIndex === -1) {
        // notify store no match was found?
        return true;
      }
      const primaryItem = currentItems[primaryItemIndex];
      const props = immutable.Map(primaryItem.props);
      const { whenIndex } = primaryItem;

      const value = immutable.Map({
        url,
        props,
        whenIndex
      });
      const type = ROUTER_ASSIGN_PRIMARY;
      const { store } = dataMap;
      store.dispatch({ type, value });
    });
  }

  getRouterComponent() {
    const dataMap = this._RouterProvider;
    const { View, whenList, otherwiseList } = dataMap;

    const componentMap = new WeakMap();

    class RouterComponent extends View.Component {

      constructor(...args) {
        super(...args);
        const version = 0; // methods will only update state if the current version is lower and the previusly ended operation
        this.state = { version };
        this._setState = false;
      }

      componentWillMount() {
        this._setState = true; //  OK to call setState
        this.tryLoadComponent(this.props);
      }

      componentWillUnmount() {
        this._setState = false; //  NOT OK to call setState anymore
      }

      componentWillReceiveProps(nextProps) {
        this.tryLoadComponent(nextProps);
      }

      transaction(operation, extraChanges = null) {
        const { version } = this.state;
        const onResolve = (changes) => {
          if(!changes || !this._setState || this.state.version !== version) { // operation may have been updated between it has loaded
            return false;
          }
          const changeState = (currentState) => ((version < currentState.version)? {} : Object.assign({ version: version + 1 }, extraChanges, changes)); // can only change state if he version is correct
          this.setState(changeState);
          return changes;
        };

        return operation()
          .then(onResolve);
      }


      getOperation(props, name, extraChanges = null) {
        const { when } = props;
        let valueMap = componentMap.get(when);
        if(!valueMap) {
          valueMap =  {};
          componentMap.set(when, valueMap);
        }
        // name is oneOf: [Component, ErrorComponent, LoadingComponent];
        if(!valueMap[name]) {
          valueMap[name] = when[`get${name}`];
        }

        const getComponent = valueMap[name];
        const onComponent = (Component) => this.state[name] === Component ? null : (Object.assign({ [name]: Component }, extraChanges));
        return Promise.resolve(getComponent())
          .then(onComponent);
      }

      getComponentOperation(props) {
        return this.getOperation(props, 'Component', { error: null });
      }

      getErrorComponentOperation(props) {
        return this.getOperation(props, 'ErrorComponent');
      }

      getLoadingComponentOperation(props) {
        return this.getOperation(props, 'LoadingComponent');
      }

      tryLoadComponent(props) {
        if(!props.when) {
          return;
        }

        const loadLoadingComponent = this.getLoadingComponentOperation.bind(this, props);
        const loadComponent = this.getComponentOperation.bind(this, props);

        const onError = (error) => {
          const loadErrorComponent = this.getErrorComponentOperation.bind(this, props);
          this.transaction(loadErrorComponent, { error })
            .then(null, console.log.bind(console)) // critical error if this console line get invoked
        };

        this.transaction(loadLoadingComponent)
          .then(this.transaction.bind(this, loadComponent))
          .then(null, onError)
      }

      render() {
        const { Component, LoadingComponent, ErrorComponent, error } = this.state;
        const { props } = this.props;

        if(error) {
          return ErrorComponent ? (<ErrorComponent { ...props } error={error} />) : null;
        }

        if(Component) {
          return (
            <Component { ...props }>{this.props.children}</Component>
          );
        }

        if(LoadingComponent) {
          return (
            <LoadingComponent />
          );
        }

        return null;
      }

    }

    const mapStateToProps = () => (state) => {
      const historyItems = state.getIn(['router', 'history']);
      const currentItem = historyItems.last() || immutable.Map();
      const whenIndex = currentItem.get('whenIndex', -1);
      const when = whenList[whenIndex] || otherwiseList[whenIndex];
      const props = Object.assign({}, when.props, currentItem.get('props', immutable.Map()).toJS());

      return {
        when,
        props
      };
    };

    const { connect } = this._RouterProvider;
    return connect(mapStateToProps, null, null, { pure: false })(RouterComponent);
  }

  $get() {
    const dataMap = this._RouterProvider;
    const { $invoke, configureHandlers } = dataMap;

    const onConfigured = () => {
      this.bindLocationToStore();
      return this.getRouterComponent();
    };

    const setInternalDependencies = $invoke(['location', 'view', 'store', 'store/view/connect', (location, View, store, connect) => {
      dataMap.location = location;
      dataMap.View = View;
      dataMap.store = store;
      dataMap.connect = connect;
    }]);

    return Promise.all(configureHandlers.map((handler) => $invoke(handler)).concat(setInternalDependencies))
      .then(onConfigured);
  }


  _compileWhenRules(condition = '', rules = {}) {
    const { $invoke } = this._RouterProvider;

    const defaultMatch = (...args) => (condition ? new RouteParser(condition).match(...args) : {});
    const { component, Component = null, redirectTo, props = {} } = rules;
    const defaultOnEnter = () => null;
    const defaultOnLeave = () => null;
    const defaultGetComponent = () => component ? $invoke([component, F => F]) : Component;
    const defaultGetLoadingComponent = () => () => null;
    const defaultGetErrorComponent = () => () => null;

    let {
      onEnter = defaultOnEnter,
      onLeave = defaultOnLeave,
      getComponent = defaultGetComponent,
      getLoadingComponent = defaultGetLoadingComponent,
      getErrorComponent = defaultGetErrorComponent,
      match = defaultMatch
    } = rules;

    if(redirectTo) {
      const tmp = onEnter;
      onEnter = (options) => {
        const { next } = options;
        const result =  tmp(options);
        if(result === false) {
          return result;
        }
        next.href = redirectTo;
        return false;
      };
    }

    const hasComponent = !!(component || Component);

    return {
      props, // extra props
      match,
      onEnter,
      onLeave,
      condition,
      hasComponent,
      getComponent,
      getErrorComponent,
      getLoadingComponent
    };
  }

  _configureLocationProvider() {
    const dataMap = this._RouterProvider;
    const { whenList, otherwiseList, locationProvider } = dataMap;


    // the user may set onEnter on several "when" rules and if so, should all onEnter/onLeave be triggered on those, but only the most specfified rules "component" should be used.
    let currentPrimaryItemIndex = -1;
    let lastUrl = null;
    const redirectMiddleware = (url) => {
      const _matchUrl = url.pathname + url.search + url.hash;
      const matchUrl = _matchUrl || '/';

      let anyComponent = false;
      const nextItems = [];
      const addNextItem = (when, whenIndex) => {
        const props = when.match(matchUrl);
        if(props) {
          const nextItem = { props, when, whenIndex };
          nextItems.push(nextItem);

          if(when.hasComponent) {
            anyComponent = true;
          }
        }
      };

      whenList.forEach(addNextItem);

      if(nextItems.length === 0 || !anyComponent) {
        otherwiseList.forEach(addNextItem);
      }

      // All items in nextItems do match the current url
      // Now do we need to fire onLeave on all those current Items that do not exist in the nextItems and fire all onEnter
      // in the
      const prev = lastUrl;
      const next = url;
      const fireOnLeaveIfNotInNextItems = fireOnEventIfNotInOtherItems('onLeave', nextItems, { next, prev });
      const { currentItems } = dataMap;
      if(currentItems.some(item => fireOnLeaveIfNotInNextItems(item) === false)) {
        // operation aborted.
        return true;
      }

      const fireOnEnterIfNotInCurrentItems = fireOnEventIfNotInOtherItems('onEnter', currentItems, { next, prev });
      if(nextItems.some(item => fireOnEnterIfNotInCurrentItems(item) === false)) {
        // operation aborted.
        return true;
      }

      dataMap.currentItems = nextItems;
      lastUrl = url;
      return true;
    };
    locationProvider.use(redirectMiddleware);
  }

};