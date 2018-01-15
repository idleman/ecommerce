import assert from 'assert';
import immutable from 'immutable';
import createReducer from './createReducer';

const { strictEqual, throws } = assert;


function createAction(name = '') {

  function Action(payload, options) {
    return {
      type: Action.toID(),
      payload: payload,
      options: options
    };
  }

  Action.toID = (function() {
    let actionID = null;
    return function() {
      if(actionID === null) {
        actionID = name + Math.random();
      }
      return actionID;
    }
  })();
  return Action;
}

describe('createReducer', function() {

  it('should be a function', function() {
    strictEqual(typeof createReducer, 'function');
  });

  it('should return a function', function() {
    const reducer = createReducer({ setMapAction: createAction() });
    strictEqual(typeof reducer, 'function');
  });

  it('should return a reducer which returns the provided state as default', function() {
    const reducer = createReducer({ setMapAction: createAction() });
    const state = {};
    const action = { type: 'random' + Math.random() };
    const nextState = reducer(state, action);
    strictEqual(state, nextState);
  });

  it('should return a reducer which set the provided map', function() {
    const setMapAction = createAction('setMap');
    const Person = immutable.Record({
      name: ''
    });
    const reducer = createReducer({ setMapAction: setMapAction, Record: Person });
    const ID = 'mapID' + Math.random();
    const name = 'name' + Math.random();
    const action = setMapAction({
      [ID]: { name: name }
    });
    const state = immutable.Map();
    const nextState = reducer(state, action);
    strictEqual(nextState.getIn([ID, 'name']), name);
  });

  it('should NOT set value if it is the default', function() {
    const setMapAction = createAction('setMap');
    const Person = immutable.Record({
      name: ''
    });
    const reducer = createReducer({ setMapAction: setMapAction, Record: Person });
    const ID = 'mapID' + Math.random();
    const action = setMapAction({
      [ID]: { name: '' }
    });
    const state = immutable.Map();
    const nextState = reducer(state, action);
    strictEqual(nextState.hasIn([ID, 'name']), false);
  });

  it('should merge immutableJS data-structures if the policy say "merge"', function() {
    const setMapAction = createAction('setMap');
    const Person = immutable.Record({
      items: immutable.Set()
    });

    const reducer = createReducer({ setMapAction: setMapAction, Record: Person });
    const personID = 'mapID' + Math.random();

    const action = setMapAction({ [personID]: { items: immutable.Set(['item2']) } }, { policy: 'merge' });
    const state = immutable.Map({
      [personID]: Person({ items: immutable.Set(['item1']) })
    });
    const nextState = reducer(state, action);
    const nextPerson = nextState.get(personID);
    const expectedPerson = Person({
      items: immutable.Set(['item1', 'item2'])
    });
    strictEqual(immutable.is(nextPerson, expectedPerson), true);
  });

  it('should throw error for unknown properties', function() {
    const setMapAction = createAction('setMap');
    const Person = immutable.Record({
      name: ''
    });

    const reducer = createReducer({ setMapAction: setMapAction, Record: Person });
    const personID = 'mapID' + Math.random();
    const state = immutable.Map({
      [personID]: Person()
    });
    const action = setMapAction({ [personID]: { firstName: 'John' } });
    throws(reducer.bind(null, state, action));
  });

  it('should support deleting keys by setting them as null', function() {
    const setMapAction = createAction('setMap');
    const Person = immutable.Record({
      name: ''
    });
    const reducer = createReducer({ setMapAction: setMapAction, Record: Person });
    const ID = 'mapID' + Math.random();
    const state = immutable.Map({
      [ID]: { name: 'hello' }
    });
    const nextState = reducer(state, setMapAction({ [ID]: null }));
    strictEqual(nextState.has(ID), false);
  });

});