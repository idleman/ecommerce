import Headers from '../../evoozer/http/headers';
import Response from '../../evoozer/http/response';


import db from '../db';

export default ['httpProvider', function setupHttpProvider(httpProvider) {
  const API_URL = '/api';

  const { products } = db;

  httpProvider.when(`${API_URL}/product`, function onProductListRequest() {
    const body = JSON.stringify(Object.keys(products).map(id => {
      const { category, name } = products[id];
      return {
        id,
        name,
        category
      };
    }));

    return new Response(body, {
      headers: new Headers({ 'Content-Type' : 'application/json'})
    });
  });

  httpProvider.when(`${API_URL}/product/:id`, function onProductRequest(request, params) {
    const { id } =  params;
    const product = products[id];
    if(!product) {
      return null;
    }
    const body = JSON.stringify(Object.assign({ id }, product));
    return new Response(body, {
      headers: new Headers({ 'Content-Type' : 'application/json'})
    });
  });

}];