import assert from 'assert';
import createSelectorFactory from './createSelectorFactory';

const { strictEqual } = assert;


describe('createSelectorFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof createSelectorFactory, 'function');
  });

  it('should return a function', function() {
    const selectorFactory = createSelectorFactory();
    strictEqual(typeof selectorFactory, 'function');
  });

  it('should return a selector creator', function() {

    const getStateFactory = () => {
      return (state) => {
        return state;
      };
    };

    const createGetTitle = createSelectorFactory(
      [ getStateFactory ],
      ( state ) => state.title
    );

    const getTitle = createGetTitle();
    const title = 'title' + Math.random();
    const state = { title: title };
    const result = getTitle(state);
    strictEqual(title, result);
  });

  it('should be able to combine selectors', function() {

    const getState = (state) => {
      return state;
    };

    const getStateFactory = () => {
      ++getStateFactory.invocationCount;
      return getState;
    };
    getStateFactory.invocationCount = 0;

    const createGetFirstName = createSelectorFactory(
      [ getStateFactory ],
      ( state ) => state.firstName
    );

    const createGetLastName = createSelectorFactory(
      [ getStateFactory ],
      ( state ) => state.lastName
    );

    const createGetFullName = createSelectorFactory(
      [ createGetFirstName, createGetLastName ],
      ( firstName, lastName ) => {
        return firstName + ' ' + lastName;
      }
    );

    const getFullName = createGetFullName();
    const state = { firstName: 'John', lastName: 'Doe' };
    const result = getFullName(state);
    strictEqual(result, 'John Doe');
  });

  it('should be able to re-use shared selectors', function() {

    const getState = (state, props) => {
      return state;
    };

    const getStateFactory = () => {
      ++getStateFactory.invocationCount;
      return getState;
    };
    getStateFactory.invocationCount = 0;

    const createGetFirstName = createSelectorFactory(
      [ getStateFactory ],
      ( state ) => state.firstName
    );

    const createGetLastName = createSelectorFactory(
      [ getStateFactory ],
      ( state ) => state.lastName
    );

    const createGetFullName = createSelectorFactory(
      [ createGetFirstName, createGetLastName ],
      ( firstName, lastName ) => {
        return firstName + ' ' + lastName;
      }
    );

    const getFullName = createGetFullName();
    const state = { firstName: 'John', lastName: 'Doe' };
    const result = getFullName(state);
    strictEqual(result, 'John Doe');
    strictEqual(getStateFactory.invocationCount, 1);
  });

});