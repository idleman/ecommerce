import assert from 'assert';
import createSetMapAction from './createSetMapAction';

const { strictEqual, notStrictEqual } = assert;

describe('createSetMapAction', function() {

  it('should be a function', function() {
    strictEqual(typeof createSetMapAction, 'function');
  });

  it('should return a function', function() {
    const setMapAction = createSetMapAction();
    strictEqual(typeof setMapAction, 'function');
  });

  it('should return an function that on invocation returns an object', function() {
    const setMapAction = createSetMapAction();
    const action = setMapAction();
    strictEqual(typeof action, 'object');
    notStrictEqual(action, null);
  });

  it('should return an function that on invocation returns an object with property "type" set', function() {
    const setMapAction = createSetMapAction();
    const action = setMapAction();
    strictEqual(typeof action.type, 'string');
  });

  it('should return an function that on invocation returns an object with property "payload" set', function() {
    const setMapAction = createSetMapAction();
    const payload = { ID: { } };
    const action = setMapAction(payload);
    strictEqual(action.payload, payload);
  });

  it('should return an function that on invocation returns an object with property type equals .toID()', function() {
    const name = 'mysecret';
    const setMapAction = createSetMapAction(name);
    const action = setMapAction();
    strictEqual(action.type, setMapAction.toID());
  });

  it('should append last "options" object as a property "options"', function() {
    const name = 'mysecret';
    const options = { test: Math.random() };
    const setMapAction = createSetMapAction(name);
    const action = setMapAction(null, options);
    strictEqual(action.options.test, options.test);
  });

});