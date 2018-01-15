import shallowEqual from '../../../shallowEqual';

export default class CreateConnectProvider {

  static get $inject() {
    return ['$invoke'];
  }

  constructor($invoke) {
    this._StoreProvider = {
      $invoke
    };
  }

  $get() {
    const { $invoke } = this._StoreProvider;

    return $invoke(['view', 'store', function createProvider(View, store) {

      // store
      const defaultMapStateToProps = (state, ownProps) => {};
      const defaultMapDispatchToProps = (dispatch, ownProps) => {};
      const defaultMergeProps = (stateProps, dispatchProps, ownProps) => Object.assign({}, ownProps, stateProps, dispatchProps);

      return function connect(mapStateToProps = null, mapDispatchToProps = null, mergeProps = null, options = {}) {
        mapStateToProps = mapStateToProps || defaultMapStateToProps;
        mapDispatchToProps = mapDispatchToProps || defaultMapDispatchToProps;
        mergeProps = mergeProps || defaultMergeProps;
        const { pure = true } = options;


        return (WrappedComponent) => {
          return class Connect extends View.Component {

            constructor(...args) {
              super(...args);
              this.state = {};
              this._unsubcribe = null;
              this.handleStoreOrPropsChange = this.handleStoreOrPropsChange.bind(this);
            }

            subscribe() {
              if (this._unsubcribe) {
                return;
              }
              this._unsubcribe = store.subscribe(this.handleStoreOrPropsChange);
            }

            unsubscribe() {
              if (this._unsubcribe) {
                this._unsubcribe();
              }
              this._unsubcribe = null;
            }

            getStateProps(...args) {
              if (this.mapStateToProps) {
                return this.mapStateToProps(...args);
              }
              const stateProps = mapStateToProps(...args);
              if (typeof stateProps === 'function') { // per instance
                this.mapStateToProps = stateProps;
                return this.mapStateToProps(...args);
              }
              return stateProps;
            }

            getDispatchProps(...args) {
              if (this.mapDispatchToProps) {
                return this.mapDispatchToProps(...args);
              }
              const dispatchProps = mapDispatchToProps(...args);
              if (typeof dispatchProps === 'function') { // per instance
                this.mapDispatchToProps = dispatchProps;
                return this.mapDispatchToProps(...args);
              }
              return dispatchProps;
            }

            getProps(ownProps) {
              const state = store.getState();
              const stateProps = this.getStateProps(state, ownProps);
              const dispatch = store.dispatch.bind(store);
              const dispatchProps = this.getDispatchProps(dispatch, ownProps);
              return mergeProps(stateProps, dispatchProps, ownProps);
            }

            handleStoreOrPropsChange(nextProps = null) {
              const ownProps = nextProps ? nextProps : this.props;
              const props = this.getProps(ownProps);
              this.setState(props);
            }

            componentWillMount() {
              this.subscribe();
              this.handleStoreOrPropsChange();
            }

            componentWillUnmount() {
              this.unsubscribe();
            }

            componentWillReceiveProps(nextProps) {
              this.handleStoreOrPropsChange(nextProps);
            }

            shouldComponentUpdate(nextProps, nextState) {
              if (!pure) {
                return true;
              }
              return !(shallowEqual(this.props, nextProps) && shallowEqual(this.state, nextState));
            }

            render() {
              const props = this.state;
              return (
                <WrappedComponent { ...props } />
              );
            }
          }
        }
      }
    }]);
  }

};