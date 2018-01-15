import HttpService from '../HttpService';
import Response from '../../../http/response';
import Request from '../../../http/request';
import URL from '../../../http/url';
import RouteParser from 'route-parser';


const checkIfMethodsMatch = (_first, _second) => {
  const { method: first } = _first;
  const { method: second } = _second;
  const wildcard = '*';
  return (first === second) ? true : (first === wildcard);
};


const sameOrigin = (first, second) => first.protocol === second.protocol && first.host === second.host;

const checkIfURLsMatch = (_first, _second) => {
  const first = new URL(_first.url);
  const second = new URL(_second.url);
  if(!sameOrigin(first, second)) {
    return false;
  }
  const firstMatchUrl = first.pathname + first.search + first.hash;
  const secondtMatchUrl = second.pathname + second.search + second.hash;
  const route = new RouteParser(firstMatchUrl);
  const result = route.match(secondtMatchUrl);
  return result;
};

const checkIfRequestsMatch = (first, second) => {
  return checkIfMethodsMatch(first, second) && checkIfURLsMatch(first, second);
};

function compileCondition(condition) {
  if(typeof condition === 'string') {
    return compileCondition(new Request(condition));
  }
  if(condition instanceof Request) {
    return (nativeRequest) => checkIfRequestsMatch(condition, nativeRequest);
  }
  if(typeof condition !== 'function') {
    throw new Error('condition must be a function');
  }
  return (...args) => condition(...args);
}


function compileResponseHandler(response) {
  return (response instanceof Response) ? () => response : ((typeof response === 'function') ? response : compileResponseHandler(new Response(response)));
}

export default class HttpProvider {

  static get $inject() {
    return ['$invoke', '$construct'];
  }

  constructor($invoke, $construct) {
    const when = [];
    const configure = [];
    this._HttpProvider = {
      when,
      $invoke,
      configure,
      $construct
    };
  }


  configure(...args) {
    this._HttpProvider.configure.push(...args);
    return this;
  }

  when(rule, cb) {
    const condition = compileCondition(rule);
    const handler = compileResponseHandler(cb);
    this._HttpProvider.when.push({ condition, handler });
    return this;
  }

  $get() {
    const { $construct, $invoke, configure, when } = this._HttpProvider;
    return Promise.all(configure.map((cb) => $invoke(cb)))
      .then(() => $construct(HttpService, { $$when: when }));
  }

};
