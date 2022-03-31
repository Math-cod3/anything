if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

window.storeSkuDetails;
$(document).ready(function () {
  var getSkusRefsAndGifts = function (orderform) {
    var items = orderform.items ? orderform.items : vtexjs.checkout.orderForm.items;

    var updateItem = function (i) {
      var itemData = items[i],
          index = i,
          giftContent = '',
          activeClass = '';

      var serviceGiftId = itemData.offerings.find(f => f.name == 'Embalagem Presente');
      serviceGiftId && (serviceGiftId = serviceGiftId.id || '');

      if (serviceGiftId) {
        if (itemData.bundleItems.length > 0) {
          if (itemData.bundleItems.find(f => f.name == 'Embalagem Presente')) {
            activeClass = 'is-checked';
          }
        }
        giftContent = `<p class='otx-gift ${activeClass}' data-index='${index}' data-id='${serviceGiftId}'>
                        <span class='otx-gift__text'>Embalagem de presente</span>
                        <i class='otx-gift__icon'></i>
                      </p>`;
      }

      if(!$(this).find('.otx-gift').length) {
        $(this).find('.product-name a[id^="product-name"]').after(giftContent);
      }

      // console.log($(this));
    };

    $('.product-item').each(updateItem)
  };

  var getSkusRefsAndGiftsEvents = function () {
    $('body').on('click', '.otx-gift', function (e) {
      $(document).ajaxComplete(function () {
        console.log('Embalagem de presente incluída!');
      });

      let prodIndex = parseInt($(this).attr('data-index'));
      let offeringGiftWrappingId = parseInt($(this).attr('data-id'));

      if ($(this).hasClass('is-checked')) {
        return vtexjs.checkout.removeOffering(offeringGiftWrappingId, prodIndex);
      } else {
        return vtexjs.checkout.addOffering(offeringGiftWrappingId, prodIndex);
      }
    })
  }

  var storeSkuDetails = function (e, orderform) {
    var items = orderform.items ? orderform.items : vtexjs.checkout.orderForm.items;

    //Filter for equals id's
    items = items.filter((e, i) => {
      return items.findIndex((x) => {
        return x.id == e.id;
      }) == i;
    });

    let skuIds = items.map(a => a.id);

    if (!skuIds.length) return false;

    return $.getJSON(`/api/catalog_system/pub/products/search/?fq=skuId:${skuIds.join('&fq=skuId:')}`)
      .done(function (data) {
        window.storeSkuDetails = data;
        getSkusRefsAndGifts(orderform)
      })
      .fail(function () {
        console.log('fail')
      });
  }

  $(window).on('orderFormUpdated.vtex', storeSkuDetails);

  getSkusRefsAndGiftsEvents();
});
