import { createError, errors } from '../index';

const getByProductId = async (productId) => {
  try {
    const response = await fetch(
      `/api/catalog_system/pub/products/search?fq=productId:${productId}`
    );

    if (!response.ok) {
      return createError(errors.badResponse(response.status));
    }

    const body = await response.json();

    const productData = body[0];
    if (!productData) {
      return createError(errors.emptyResult);
    }

    return {
      data: productData,
    };
  } catch(_error) {
    return createError(errors.networkError);
  }
};

export { getByProductId };
