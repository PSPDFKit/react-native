import { HEADER_TYPE, METHOD_TYPE, prepareHeaders } from './ApiConfig';

export const callApi = async ({
  apiUrl = '',
  method = METHOD_TYPE.post,
  body = null,
  headerType = HEADER_TYPE.DEFAULT,
  shouldStringifyBody = true,
}): Promise<any> => {
  try {
    const request = {
      method,
      headers: prepareHeaders(headerType),
    };
    if (body) {
      //@ts-ignore
      request.body = shouldStringifyBody ? JSON.stringify(body) : body;
    }

    return (
      fetch(apiUrl, {
        ...request,
      })
        // NOTE: Instant document is loaded with 302 redirect
        .then(res => res.json())
        .then(resultObject => {
          return Promise.resolve(resultObject);
        })
        .catch(error => {
          console.log('worked not');
          return Promise.reject(error);
        })
    );
  } catch (error) {
    return Promise.reject(error);
  }
};
