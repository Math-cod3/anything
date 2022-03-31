import { getProductVariations } from '../services/Catalog';
import MasterData from '../services/MasterData';
import * as OrderForm from '../services/OrderForm';
import { getByProductId } from '../services/Search';
import { last } from '../js/utils/utils';
import ProductSuggestion from './components/ProductSuggestion';

const findProductInOrderForm = (productId, orderFormResponse) => {
  if (orderFormResponse.error) {
    return false;
  }

  // Normally, it would be better to do this with Array.prototype.find. However,
  // that doesn't work on IE and since this runs on the checkout, it is prudent
  // to strive for maximal compatibility here
  let productFound = false;
  orderFormResponse.data.items.forEach((product) => {
    if (product.productId === productId) {
      productFound = true;
    }
  });

  return productFound;
};

const main = async () => {
  if (sessionStorage.getItem('dismissedProductSuggestion')) {
    return;
  }
  const cartTemplateHolder = document.querySelector('.cart-template-holder');
  if (!cartTemplateHolder) {
    console.warn('[ProductSuggestion] .cart-template-holder not found');
    setTimeout(main, 500);
    return;
  }

  const [masterDataResponse, orderFormResponse] = await Promise.all([
    MasterData.get('PS', ['productId']),
    OrderForm.get(),
  ]);

  if (masterDataResponse.error) {
    console.warn(
      '[ProductSuggestion] Could not fetch productId from Master Data: ',
      masterDataResponse.error.message
    );

    return;
  }

  const productId = String(last(masterDataResponse.data).productId);
  // const productId = '21252';

  if (!productId) {
    console.warn('No productId registered in the Master Data');
    return;
  }

  const productIsInCart = findProductInOrderForm(productId, orderFormResponse);
  if (productIsInCart) {
    return;
  }

  const [productData, variationsData] = await Promise.all([
    getByProductId(productId),
    getProductVariations(productId),
  ]);

  if (productData.error || variationsData.error) {
    console.warn('[ProductSuggestion] Error when fetching product data');
    return;
  }

  const firstSku = productData.data.items[0];

  if (!firstSku) {
    console.warn(
      `[ProductSuggestion] The product with id ${productId} has no active SKUs`
    );
    return;
  }

  const containerElement = document.createElement('div');
  containerElement.classList.add('product-suggestion-container');
  cartTemplateHolder.appendChild(containerElement);

  const titleElement = document.createElement('h2');
  titleElement.innerText = 'RECOMENDAMOS PARA VOCÊ';
  titleElement.classList.add('product-suggestion-title');
  containerElement.appendChild(titleElement);

  const targetElement = document.createElement('div');
  targetElement.classList.add('product-suggestion');
  containerElement.appendChild(targetElement);

  // console.log('productData', productData);
  const title = productData.data.productName;
  const url = `/${productData.data.linkText}/p`;
  const images = firstSku.images;
  const listPrice = variationsData.data.skus[0].listPrice;
  const price = variationsData.data.skus[0].bestPrice;
  // const parcel = variationsData.data.skus[0].installmentsValue;

  new ProductSuggestion(targetElement, productData.data).init();

  window.addEventListener('closeProductSuggestion', () => {
    containerElement.remove();
    sessionStorage.setItem('dismissedProductSuggestion', true);
  });
};

main();
