import { createError, errors } from '../index';

const get = async () => {
  try {
    const response = await fetch('/api/checkout/pub/orderForm');

    if (!response.ok) {
      return createError(errors.badResponse(response.status));
    }

    const body = await response.json();

    return {
      data: body,
    };
  } catch(_error) {
    return createError(errors.networkError);
  }
};

export { get };
