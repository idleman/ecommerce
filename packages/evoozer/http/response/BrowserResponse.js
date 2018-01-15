const { Response } = global;
if(!Response) {
  throw new Error('Your browser do not support fetch: "Headers" object');
}

export default Response;