export const METHOD_TYPE = {
  post: 'POST',
  get: 'GET',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
};

export const API_ERROR = {
  INVALID_URL: 'Provided URL is not valid',
  CANCELLED: 'cancelled',
  INVALID_CODE: 'invalid_code',
  INTERNAL_ERROR: 'internal_error',
  UN_AUTHENTICATED: 'un_authenticated',
};

export const DOCUMENT_HEADER = {
  Accept: 'application/vnd.instant-example+json',
};

export const DEFAULT_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const HEADER_TYPE = {
  DEFAULT: 'DEFAULT',
  DOCUMENT: 'DOCUMENT',
};

export const prepareHeaders = (headerKey: string) => {
  switch (headerKey) {
    case HEADER_TYPE.DOCUMENT:
      return DOCUMENT_HEADER;
    default:
      return DEFAULT_HEADER;
  }
};
