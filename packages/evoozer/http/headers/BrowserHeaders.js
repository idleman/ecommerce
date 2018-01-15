const { Headers } = global;
if(!Headers) {
  throw new Error('Your browser do not support fetch: "Headers" object');
}

export default Headers;