import { createError, errors } from '../index';

// Unlike most other VTEX APIs, the Master Data API requires the main subdomain
const BASE_URL = 'https://www.mariafilo.com.br/api/dataentities';

async function get(form, fields) {
  const formmatedURL = `${BASE_URL}/${form}/search?_fields=${fields.join(',')}`;
  try {
    const response = await fetch(formmatedURL, {
      method: 'GET',
      headers: { 'REST-Range': 'resources=0-100' },
    });

    const body = await response.json();

    return {
      data: body,
    };
  } catch(_error) {
    return createError(errors.networkError);
  }
}

export default {
  get,
};
