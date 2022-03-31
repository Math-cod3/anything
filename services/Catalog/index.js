import { createError, errors } from '../index';

const getProductVariations = async (productId) => {
  try {
    const response = await fetch(
      `/api/catalog_system/pub/products/variations/${productId}`
    );

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

export { getProductVariations };
