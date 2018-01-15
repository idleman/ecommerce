const { fetch } = global;
if(!fetch) {
  throw new Error('Your browser do not support fetch: "Fetch" object');
}

export default fetch;