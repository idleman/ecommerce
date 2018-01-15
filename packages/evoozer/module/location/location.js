/**
 * The proposal of this module is to provide an API for the user to read/write the current url of the module.
 * It should primary be a wrapper above window.location.href, but with the ability to function server-side.
 */

import Module from '../module';
import LocationProvider from './LocationProvider';

export default new Module('location')
  .provider('location', LocationProvider);