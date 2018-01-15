import Request from '../../../http/request';
import Response from '../../../http/response';
import fetch from '../../../http/fetch';

const toRequest = (req, init) => (typeof req === 'string')? new Request(req, init) : req;
const toResponse = (res) => (res instanceof Response)? res : new Response(res);


const tryToRunWhen = (whenList, httpRequest) => {
  return new Promise((resolve, reject) => {
    whenList = [].concat(whenList);

    const tickOneWhen = () => {
      const when = whenList.shift();

      const onHandlerResult = (result) => {
        // if the handler did not return a response object, have it aborted the operation
        return result ? toResponse(result) : tickOneWhen();
      };

      const onConditionResult = (result) => {
        return result? Promise.resolve(when.handler(httpRequest, result)).then(onHandlerResult) : tickOneWhen();
      };

      if(!when) {
        return Promise.resolve(null);
      }


      const { condition } = when;
      return Promise.resolve(condition(httpRequest))
        .then(onConditionResult);

    };

    tickOneWhen()
      .then(resolve, reject);
  });
};


export default class HttpService {

  static get $inject() {
    return ['$$when'];
  }

  constructor($$when) {
    this._HttpService = {
      $$when
    };
  }

  _getWhen(nativeRequest) {
    const { $$when } = this._HttpService;
    return tryToRunWhen($$when, nativeRequest);
  }

  fetch(...requestParams) {
    const request = toRequest(...requestParams);
    return this._getWhen(request)
      .then(response => response ? response : fetch(request));
  }

};
