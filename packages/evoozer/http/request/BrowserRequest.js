const { Request } = global;
if(!Request) {
  throw new Error('Your browser do not support fetch: "Request" object');
}

export default Request;