import { parseImageUrl, getProductById } from '../utils/utils';

export default function richSnippetsProduct(productData) {
  try {
    const requestData = () => {
      getProductById(productData.productId).then((data) => {
        mountJSON(data[0]);
      });
    };

    const mountJSON = (product) => {
      const jsonLD = [
        {
          '@context': 'http://schema.org/',
          '@type': 'Product',
          name: product.productName,
          image: [],
          description: product.description,
          gtin14: product.items[0].ean,
          url: product.link,
          productID: product.productId,
          brand: {
            '@type': 'Thing',
            name: product.brand,
          },
          offers: [],
          additionalProperty: {
            '@type': 'PropertyValue',
            name: 'sellers',
            value: product.items[0].sellers[0].sellerName,
          },
        },
      ];

      if (product['Composição']) jsonLD[0].material = product['Composição'][0];

      jsonLD[0].image = product.items[0].images
        .map((image) =>
          image.imageLabel !== '10'
            ? parseImageUrl(image.imageUrl, null, null, null, true)
            : null
        )
        .filter(Boolean);

      product.items.forEach((sku) => {
        if (sku.sellers[0].commertialOffer.AvailableQuantity > 0) {
          jsonLD[0].offers.push({
            '@type': 'Offer',
            sku: sku.itemId,
            name: sku.nameComplete,
            price: sku.sellers[0].commertialOffer.Price,
            priceCurrency: 'BRL',
            priceValidUntil: sku.sellers[0].commertialOffer.PriceValidUntil,
            availability: 'InStock',
            category: product.categories[0],
            seller: {
              '@type': 'Organization',
              name: sku.sellers[0].sellerName,
            },
          });
        }
      });

      const script = document.createElement('script');
      script['type'] = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLD);
      document.querySelector('head').insertBefore(script, null);
    };

    if (productData) {
      if (productData.productName) mountJSON(productData);
      else requestData();
    } else {
      requestData();
    }
  } catch (error) {
    console.error(error, 'Não foi possível criar os Rich Snippets');
  }
}