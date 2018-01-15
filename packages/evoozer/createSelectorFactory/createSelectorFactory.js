import { createSelector } from 'reselect';
import ensureSameReferenceIfIdentical from '../ensureSameReferenceIfIdentical';


export default function createSelectorFactory(factoryDependencies, selector) {
  return function selectorFactory(factoryMap = new WeakMap()) {
    const deps = factoryDependencies.map(selectorFactoryDependency => {
      if(!factoryMap.has(selectorFactoryDependency)) {
        const dependencySelector = selectorFactoryDependency(factoryMap);
        //  We need to double-check because the selectorFactoryDependency may modify factoryMap
        if(!factoryMap.has(selectorFactoryDependency)) {
          factoryMap.set(selectorFactoryDependency, dependencySelector);
        }
      }
      return factoryMap.get(selectorFactoryDependency);
    });
    return createSelector(deps, ensureSameReferenceIfIdentical(selector));
  };
};
