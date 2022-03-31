require("../scss/checkout-custom.scss");
import './checkout-gift-card';
import './checkout-product-suggestion';

function breadcrumb() {
  if($(".stepsbreadcrumb").length < 1){

    $('.container.container-main').before(
    '<div class="stepsbreadcrumb">' +
    '<ul class="stepsbreadcrumb__steps">' +
    //'<li class="stepsbreadcrumb__steps-step1"><a href="#/cart"><span>1</span>Carrinho</a></li>' +
    //'<span class="stepsbreadcrumb__steps-divisor">'
    '</span><li class="stepsbreadcrumb__steps-step2"><a href="#/profile"><span>1</span>Dados Pessoais</a></li>' +
    '<span class="stepsbreadcrumb__steps-divisor"></span><li class="stepsbreadcrumb__steps-step3"><a href="#/shipping"><span>2</span>Entrega</a></li>' +
    '<span class="stepsbreadcrumb__steps-divisor"></span><li class="stepsbreadcrumb__steps-step4"><a href="#/payment"><span>3</span>Pagamento</a></li>' +
    '</ul>' + '</div>'
    );

  }

  $('.stepsbreadcrumb__steps-step2').on('click', function(e){
    $('.client-profile-data .link-box-edit').click();
  });
}

function stepBreadcrumb(){
  $('.stepsbreadcrumb__steps li,.stepsbreadcrumb').removeClass('active');
  // if (window.location.hash.indexOf('cart') >= 0) {
  //   $('.stepsbreadcrumb__steps-step1').addClass('active');
  // }else
  if (window.location.hash.indexOf('profile') >= 0 || window.location.hash.indexOf('email') >= 0) {
    $('.stepsbreadcrumb__steps-step1').addClass('checked');
    $('.stepsbreadcrumb,.stepsbreadcrumb__steps-step2').addClass('active');
  }
  else if (window.location.hash.indexOf('shipping') >= 0) {
    $('.stepsbreadcrumb__steps-step1').addClass('checked');
    $('.stepsbreadcrumb__steps-step2').addClass('checked');
    $('.stepsbreadcrumb,.stepsbreadcrumb__steps-step3').addClass('active').addClass('visited');

  } else if (window.location.hash.indexOf('payment') >= 0) {
    $('.stepsbreadcrumb__steps-step1').addClass('checked');
    $('.stepsbreadcrumb__steps-step2').addClass('checked');
    $('.stepsbreadcrumb__steps-step3').addClass('checked');
    $('.stepsbreadcrumb,.stepsbreadcrumb__steps-step4').addClass('active');
  }
  else{
    $('.stepsbreadcrumb').removeClass('active');
  }

  // if ($('.stepsbreadcrumb__steps li.checked').length > 2) {
  //   $('.stepsbreadcrumb__steps-step4 a').remove();
  //   $('.stepsbreadcrumb__steps-step4').text('').append('<a href="/checkout/#/payment">Pagamento</a>');
  // } else {
  //   $('.stepsbreadcrumb__steps-step4 a').remove();
  //   $('.stepsbreadcrumb__steps-step4').text('');
  //   $('.stepsbreadcrumb__steps-step4').append('Pagamento');
  // }
}

$(document).ready(function () {
  breadcrumb();
  stepBreadcrumb();

  if (
    window.location.search.indexOf('utm_medium=linkvendedor') >= 0 ||
    window.location.search.indexOf('utm_medium=carrinho_compartilhado') >= 0
  ) {
    try {

      var openTextField = window.location.search.split('utm_campaign=').reverse()[0].split('&')[0];
      openTextField = decodeURIComponent(openTextField);
      const code = openTextField.split('-')[0].trim()
      $.ajax({
        url: '/api/dataentities/VD/search/?_fields=id,cod,name,ativo&cod=' + code,
        dataType: 'json',
        type: 'GET',
        headers: {
          'Accept': 'application/vnd.vtex.ds.v10+json',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).done(function (data) {
        if (data.length && data[0].ativo) {
          vtexjs.checkout.getOrderForm().then(function (orderForm) {
            var newMarketingData = orderForm.marketingData;

            if (newMarketingData == null) {
              newMarketingData = {
                'utmiCampaign': 'VendMF'
              }
            } else {
              newMarketingData.utmiCampaign = 'VendMF';
            }

            vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
              vtexjs.checkout.sendAttachment('openTextField', { 'value': 'vendedor: ' + data[0].name + ' codigo: ' + data[0].cod }).done(function () {
                localStorage.setItem('sellerInfo', JSON.stringify(data[0]))
                var sellerInfo = JSON.parse(localStorage.getItem('sellerInfo'));
                $('#seller-code .label-seller-name').text(sellerInfo.name);
                $('#seller-code').addClass('active')
              })
            });

          })
        } else {
          $('.seller-code-error').addClass('error');
        }
      });
    } catch (e) {
      console.log('Erro ao inserir códigos de carrinho compartilhado.');
    }
  }

  $("body").on("keyup", "input.seller-code", function () {
    if ($(this).val().length === 4) {
      $(".content-seller-code button").click();
    }
  });

  var botaoShipping = function () {
    let element = $('#btn-go-to-payment');

    if ($('#btn-go-to-payment-custom').length) {
      $('#btn-go-to-payment-custom').remove()
      element.show();
    }

    if (vtexjs.checkout.orderForm.clientProfileData !== null) {
      let botao = '<button class="submit btn-go-to-payment btn btn-large btn-success" id="btn-go-to-payment-custom">' + element.html() + '</button>';

      element.parent().append(botao);
      element.hide();
    }
  }

  var botaoPayment = function () {
    let element = $('.payment-confirmation-wrap').find('[data-i18n="paymentData.confirm"]').closest('#payment-data-submit');

    // console.log(element)
    // console.log(element.attr('disabled'))

    if ($('#payment-data-submit-custom').length) {
      $('#payment-data-submit-custom').remove()
      // element.removeClass('hide');
    }

    if (vtexjs.checkout.orderForm.clientProfileData !== null) {
      let botao = `<button class="${element.attr('class')}" id="payment-data-submit-custom" disabled>
                                <i class="icon-lock"></i>
                                <i class="icon-spinner icon-spin"></i>
                                <span>Finalizar compra</span>
                            </button>`;

      element.parent().append(botao);
      // element.addClass('hide');
    }

  }

  function changeScrollPosition() {
    let position = null;
    if (window.location.hash == "#/shipping") {
      position = $('#shipping-data').offset().top;
    } else if (window.location.hash == "#/payment") {
      position = $('#payment-data').offset().top;
    }

    if (position !== null) {
      $(window).scrollTop(position)
    }
  }

  $("body").on("click", "#btn-go-to-payment-custom, #payment-data-submit-custom", function () {

    if ($(this).attr('id') == 'payment-data-submit-custom' && $(this).prop('disabled')) {
      return false;
    }

    let target = $(this).attr('id').replace('-custom', '');
    let redirect = ($(this).attr('id') === 'payment-data-submit-custom') ? 'edit-shipping-data' : '';

    let endereco = vtexjs.checkout.orderForm.shippingData.selectedAddresses[0];
    let modal = `<div class="mf-overlayModal"></div>
                <div class="mf-modal">
                    <a href="javascript:void(0)" class="mf-closeModal">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 1.5L1.5 10.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M10.5 10.5L1.5 1.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </a>
                    <h4>Atenção! Confirme seu endereço</h4>
                    <div class="dados">
                        <div class="rua">${endereco.street} - n ${endereco.number}</div>
                        <div class="bairro-cidade-estado">${endereco.neighborhood} - ${endereco.city} - ${endereco.state}</div>
                        <div class="cep">${endereco.postalCode}</div>
                    </div>
                    <div class="botoes">
                        <button type="button" id="confirmar-endereco-continuar" data-target="${target}">Continuar</button>
                        <button type="button" id="confirmar-endereco-cancelar" data-redirect="${redirect}">Revisar</button>
                    </div>
                </div>
                `;

    $('body').append(modal)
  });

  $('body').on('click', '#new-address-button', function () {
    $('#btn-go-to-payment-custom').addClass('mf-hide')
  })
  $('body').on('click', '#back-to-address-list', function () {
    $('#btn-go-to-payment-custom').removeClass('mf-hide')
  })


  $('body').on('click', '#confirmar-endereco-continuar', function () {
    $('#' + $(this).attr('data-target')).click();
    changeScrollPosition()
    $('body').find('.mf-overlayModal, .mf-modal').remove()
  })

  $('body').on('click', '.mf-closeModal, #confirmar-endereco-cancelar', function () {
    if ($(this).attr('data-redirect') !== undefined && $(this).attr('data-redirect') !== '') {
      $('#' + $(this).attr('data-redirect'))[0].click();
      changeScrollPosition()
    }
    $('body').find('.mf-overlayModal, .mf-modal').remove()
  })

  $('.payment-confirmation-wrap').find('[data-i18n="paymentData.confirm"]').parent().on('click', function (e) {
    // console.log('teste paymento button')
    e.preventDefault()
    e.stopPropagation()
  })

  $(document).ajaxStart(function (e) {
    if (window.location.hash === "#/payment") {
      // console.log('ajaxStart', e)
      let element = $('.payment-confirmation-wrap').find('[data-i18n="paymentData.confirm"]').closest('#payment-data-submit');
      let elementNew = $('#payment-data-submit-custom');

      if (elementNew.length) {
        // console.log(element.prop('disabled'))
        // console.log(elementNew.prop('disabled'))
        elementNew.prop('disabled', (element.prop('disabled')))
      }
    }
  })
  $(document).ajaxStop(function (e) {
    if (window.location.hash === "#/payment") {
      // console.log('ajaxStop', e)
      let element = $('.payment-confirmation-wrap').find('[data-i18n="paymentData.confirm"]').closest('#payment-data-submit');
      let elementNew = $('#payment-data-submit-custom');

      if (elementNew.length) {
        // console.log(element.prop('disabled'))
        // console.log(elementNew.prop('disabled'))
        elementNew.prop('disabled', (element.prop('disabled')))
      }
    }
  })

  $(document).ajaxComplete(function (e, d, res) {
    if (window.location.hash === "#/payment") {
      stepBreadcrumb();
      // console.log('ajaxComplete', e, d, res)
    }
  })

  $(window).on('hashchange orderFormUpdated.vtex', function () {
    console.log(window.location.hash)

    stepBreadcrumb();

    if (window.location.hash === "#/shipping") {
      botaoShipping()
    } else if (window.location.hash === "#/payment") {
      botaoPayment()
    }
  })
})

