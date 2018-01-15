import Module from '../module'
import HttpProvider from './HttpProvider';

export default new Module('http')
  .provider('http', HttpProvider);


