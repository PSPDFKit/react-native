import { API_ERROR, HEADER_TYPE, METHOD_TYPE } from './ApiConfig';
import { callApi } from './ApiRequest';

const isUrlValid = (url: string) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // validate fragment locator
  return urlPattern.test(url);
};

export const loadDocument = async (url: string): Promise<any> => {
  if (!isUrlValid(url)) {
    throw new Error(API_ERROR.INVALID_URL);
  }

  const result = await callApi({
    apiUrl: url,
    headerType: HEADER_TYPE.DOCUMENT,
    shouldStringifyBody: true,
    method: METHOD_TYPE.get,
  });
  return Promise.resolve(result);
};
