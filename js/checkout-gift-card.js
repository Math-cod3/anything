const formatMoney = function (n, c = 2, d = ',', t = '.') {
  c = isNaN((c = Math.abs(c))) ? 2 : c;
  var s = n < 0 ? '-' : '';
  var i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '';
  var j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  );
};

(function () {
  const main = () => {
    console.log('main');
    createNewTotalField();
    console.log('after createNewTotalField');

    $(window).on('orderFormUpdated.vtex', () => {
      update();
    });
  };

  const createNewTotalField = async () => {
    console.log('createNewTotalField');
    const orderForm = await vtexjs.checkout.getOrderForm();

    const newValue = `R$ ${formatMoney(orderForm.value / 100)}`;
    const newValueDisplay = $(`
        <tr class="total-value">
          <td class="info">Total</td>
          <td class="space"></td>
          <td class="monetary">${newValue}</td>
          <td class="empty"></td>
      `);

    $('.cart-totalizers table tfoot').append(newValueDisplay);
  };

  const update = () => {
    const orderForm = vtexjs.checkout.orderForm;
    if (!orderForm) return;

    const giftCards = orderForm.paymentData.giftCards;
    const giftCardDiscount = giftCards
      .map((gc) => gc.value)
      .reduce((x, y) => x + y, 0);

    updateOrderSummary(giftCardDiscount, orderForm.value);
  };

  const updateOrderSummary = (giftCardDiscount, orderFormValue) => {
    const totalizers = $('.cart-template .totalizers-list');
    const giftCardDiscountDisplay = totalizers.find('.gift-card-discount');

    if (giftCardDiscount > 0) {
      const giftCardDiscountText = `R$ -${formatMoney(giftCardDiscount / 100)}`;

      if (giftCardDiscountDisplay.length > 0) {
        giftCardDiscountDisplay.find('.monetary').text(giftCardDiscountText);
      } else {
        const newDisplay = $(`
            <tr class="gift-card-discount">
              <td class="info">Vale troca</td>
              <td class="space"></td>
              <td class="monetary">${giftCardDiscountText}</td>
              <td class="empty"></td>
            </tr>
          `);

        totalizers.append(newDisplay);
      }
    } else {
      giftCardDiscountDisplay.detach();
    }

    const totalValueDisplay = totalizers.parent().find('tfoot .total-value');
    const newValue = `R$ ${formatMoney(
      (orderFormValue - giftCardDiscount) / 100
    )}`;

    totalValueDisplay.find('.monetary').text(newValue);
  };

  $(() => {
    main();
  });
})();
