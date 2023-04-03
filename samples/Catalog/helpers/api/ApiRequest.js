import { HEADER_TYPE, METHOD_TYPE, prepareHeaders } from './ApiConfig';

export const callApi = async ({
  apiUrl = '',
  method = METHOD_TYPE.post,
  body = null,
  headerType = HEADER_TYPE.DEFAULT,
  shouldStringifyBody = true,
  onSuccess = () => {},
  onError = () => {},
}) => {
  try {
    const request = {
      method,
      headers: prepareHeaders(headerType),
    };
    if (body) {
      request.body = shouldStringifyBody ? JSON.stringify(body) : body;
    }

    fetch(apiUrl, {
      ...request,
    })
      // NOTE: Instant document is loaded with 302 redirect
      .then(res => res.json())
      .then(resultObject => {
        onSuccess(resultObject);
      })
      .catch(error => {
        onError(error);
      });
    return false;
  } catch (error) {
    onError(error.message);
  }
};
