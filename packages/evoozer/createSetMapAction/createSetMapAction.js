const defaultPolicy = 'mergeOneLevel';
const defaultOptions = { policy: defaultPolicy };

export default function createSetMapAction(name = '') {

  function setMapAction(payload, options = defaultOptions) {
    return {
      type: setMapAction.toID(),
      payload: payload,
      options: options
    };
  }

  const ID = name;
  setMapAction.toID = function() {
    return ID;
  };

  return setMapAction;
};
