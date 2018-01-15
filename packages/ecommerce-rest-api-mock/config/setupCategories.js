import Headers from '../../evoozer/http/headers';
import Response from '../../evoozer/http/response';


import db from '../db';

export default ['httpProvider', function setupHttpProvider(httpProvider) {
  const API_URL = '/api';

  const { categories } = db;

  const reduceLiteCategoryData = (map, id) => {
    const { name, parent } = categories[id];
    const item = { name, parent };
    return Object.assign({ [id]: item }, map);
  };

  const categoryIDs = Object.keys(categories);

  httpProvider.when(`${API_URL}/category`, function onProductListRequest() {

    const compressedCategoryMap = categoryIDs.reduce(reduceLiteCategoryData, {});
    const body = JSON.stringify(compressedCategoryMap);
    return new Response(body, {
      headers: new Headers({ 'Content-Type' : 'application/json'})
    });
  });

  httpProvider.when(`${API_URL}/category/:id`, function onProductRequest(request, params) {
    const { id } =  params;

    const category = categories[id];
    if(!category) {
      return null;
    }
    const body = JSON.stringify(category);
    return new Response(body, {
      headers: new Headers({ 'Content-Type' : 'application/json'})
    });
  });

}];