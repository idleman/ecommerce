const { URL } = global;
if(!URL) {
  throw new Error('Your browser do not support: "URL" object');
}

export default URL;