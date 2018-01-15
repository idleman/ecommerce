import immutable from 'immutable';

const emptyMap = immutable.Map();

function combineValue(defaultValue, currentValue, providedValue, policy = '') {
  if(immutable.Iterable.isIterable(defaultValue)) {
    switch(policy) {
      case 'merge':
        return currentValue.merge(providedValue);
      default:
        return defaultValue.merge(providedValue);
    }
  }
  return providedValue;
}


export default function createReducer(options) {

  const { setMapAction, defaultState = immutable.Map(), Record = immutable.Record({}) } = options;

  const SET_MAP = setMapAction.toID();

  const defaultInstance = Record();

  return function setMapReducer(state = defaultState, action) {
    const { type, payload, options = {} } = action;
    const { policy = 'mergeOneLevel' } = options;

    const setMapHandler = state => {
      //const startTime = (new Date()).getTime();
      Object.keys(payload).forEach(ID => {
        if(payload[ID] === null) {
          return;
        }
        const changes = payload[ID] || {};
        const currentInstance = state.get(ID, emptyMap);
        const nextInstance = currentInstance.withMutations(propertyState => {
          Object.keys(changes).forEach(propertyName => {
            if(!defaultInstance.has(propertyName)) {
              throw new Error(`Unknown property: "${propertyName}"`);
            }
            const providedValue = changes[propertyName];
            const defaultValue = defaultInstance.get(propertyName);

            if(providedValue === null || typeof providedValue === 'undefined' || providedValue === defaultValue || immutable.is(providedValue, defaultValue)) {
              propertyState.delete(propertyName);
            } else if(defaultInstance.has(propertyName)) {
              const currentValue = propertyState.get(propertyName, defaultValue);
              const value = combineValue(defaultValue, currentValue, providedValue, policy);
              propertyState.set(propertyName, value);
            }
          });
        });
        state.set(ID, nextInstance);
      });
    };

    switch(type) {
      case SET_MAP: {
        let nextState = state.withMutations(setMapHandler);
        Object.keys(payload).forEach(ID => {
          if (payload[ID] === null) {
            nextState = nextState.delete(ID);
          }
        });
        return nextState;
      }
      default:
        return state;
    }
  };
};