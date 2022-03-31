$(function () {
  var minicart = {

    console: function () {
      // console.log('[minicart] ', ...minicart.console.arguments)
    },
    settings: {
      container: "#x-mini_cart .x-minicart_itens--wrapper .x-content-minicart .x-list--wrapper",
      footerSelector: "#x-mini_cart footer",
      cartListClass: 'cart-list',
      cartEmptyClass: 'x-cart-empty',
      cartEmptyMessage: "Sua sacola está vazia",
      currencySymbol: "",
      priceLabel: function (value) {
        return minicart.settings.currencySymbol.trim() + ' ' + (value / 100).toFixed(2).replace('.', ',');
      },
      slaLabel: function (sla) {
        let slaLabelDisponivel = {
          'bd': {
            'singular': 'dia útil',
            'plural': 'dias úteis'
          },
          'd': {
            'singular': 'dia',
            'plural': 'dias'
          },
          'h': {
            'singular': 'hora',
            'plural': 'horas'
          },
          'm': {
            'singular': 'minuto',
            'plural': 'minutos'
          }
        }

        let match = sla.match(/[a-z]+/g)

        if (match !== null) {
          let slaNumber = parseInt(sla.replace(match[0], ''))
          return slaNumber + ' ' + slaLabelDisponivel[match[0]][((slaNumber == 1) ? 'singular' : 'plural')]
        } else {
          return '';
        }

      },
      vendor: {
        'utmiCampaign': 'VendMF',
        'entitiId': 'VD',
        apply: function (code) {
          $('.x-dados-adicionais-vendor').addClass('js--loading')

          $.ajax({
            url: 'https://www.mariafilo.com.br/api/dataentities/' + minicart.settings.vendor.entitiId + '/search/?_fields=id,cod,name,ativo&cod=' + code,
            dataType: 'json',
            type: 'GET',
            headers: {
              'Accept': 'application/vnd.vtex.ds.v10+json',
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).done(function (data) {
            if (data.length && data[0].ativo) {
              minicart.console('applyCode', data)
              vtexjs.checkout.getOrderForm().then(function (orderForm) {
                var newMarketingData = orderForm.marketingData;

                if (newMarketingData == null) {
                  newMarketingData = {
                    'utmiCampaign': minicart.settings.vendor.utmiCampaign
                  }
                } else {
                  newMarketingData.utmiCampaign = minicart.settings.vendor.utmiCampaign;
                }

                vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
                  vtexjs.checkout.sendAttachment('openTextField', {'value': 'vendedor: ' + data[0].name + ' codigo: ' + data[0].cod}).done(function () {
                    localStorage.setItem('sellerInfo', JSON.stringify(data[0]))
                    minicart.settings.vendor.handle();
                  })
                });

              })
            } else {
              minicart.settings.vendor.handle();
            }
          })
        },
        remove: function () {
          vtexjs.checkout.getOrderForm().then(function (orderForm) {
            var newMarketingData = orderForm.marketingData;

            newMarketingData.utmiCampaign = 'SemVendedor';

            vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
              vtexjs.checkout.sendAttachment('openTextField', {'value': null}).done(function () {
                localStorage.removeItem('sellerInfo');
                minicart.settings.vendor.handle();
              })
            });
          });
        },
        handle: function () {
          let orderForm = vtexjs.checkout.orderForm
          let openTextField = orderForm.openTextField

          $('.x-dados-adicionais-vendor').find('.x-dados-adicionais-aplicados').remove();

          if (openTextField !== null && openTextField.value !== null) {
            let data = openTextField.value.replace('vendedor: ', '').split(' codigo: ');
            
            if(data[0] === "" || data[0] === "null" || data[0] === undefined){
              $('.x-dados-adicionais-vendor .x-dados-adicionais--input').append(minicart.settings.dadosAdicionais(`[ ${data[1]} ]`))
            } else{
              $('.x-dados-adicionais-vendor .x-dados-adicionais--input').append(minicart.settings.dadosAdicionais(`[ ${data[1]} ] - ${data[0]}`))
            }

            $('.x-dados-adicionais-vendor').removeClass('js--loading')
            $('.x-dados-adicionais-vendor').addClass('js-applied')
          } else {
            $('.x-dados-adicionais-vendor').removeClass('js-applied')
          }
        }
      },
      frete: {
        mascaraCep: function (t, mask) {
          var i = t.value.length;
          var saida = mask.substring(1, 0);
          var texto = mask.substring(i)
          if (texto.substring(0, 1) != saida && i <= mask.length) {
            t.value += texto.substring(0, 1);
          } else {
            t.value = t.value.substring(0, mask.length);
          }
        },
        calcularFrete: function (cep) {
          $('.x-dados-adicionais-shipment').addClass('js--loading')
          vtexjs.checkout.getOrderForm()
            .then(function (orderForm) {
              var postalCode = cep;  // também pode ser sem o hífen
              var country = 'BRA';
              var address = {
                "postalCode": postalCode,
                "country": country
              };
              let ret = vtexjs.checkout.calculateShipping(address)
              minicart.console(ret)
              return ret
            })
            .done(function (orderForm) {
              minicart.console('Frete calculado')
              minicart.settings.frete.handle()
            })
            .fail(function (e) {
              minicart.console(e)
              minicart.console(JSON.parse(e.responseText))
            });
        },
        handle: function () {
          let orderForm = vtexjs.checkout.orderForm
          let totalizers = orderForm.totalizers

          $('.x-dados-adicionais-shipment').find('.x-dados-adicionais-aplicados').remove();

          if (orderForm.shippingData.selectedAddresses.length) {
            let frete = 0;
            let slaNum = 0;
            let slaDes = '';
            let sla = '';

            let logisticsInfo = orderForm.shippingData.logisticsInfo

            let slaOrder = ['bd', 'd', 'h', 'm'];

            logisticsInfo.forEach((li) => {
              let selectedDeliveryChannel = li.selectedDeliveryChannel;
              let selectedSla = li.selectedSla;

              li.slas.forEach((item) => {
                if (item.deliveryChannel == selectedDeliveryChannel && item.id == selectedSla) {
                  let slaMatch = item.shippingEstimate.match(/[a-z]+/g);
                  let tempSlaNumber = parseInt(item.shippingEstimate.replace(slaMatch[0], ''))
                  if (
                    (slaNum <= tempSlaNumber && slaDes == '') ||
                    (slaNum <= tempSlaNumber && slaOrder.indexOf(slaMatch[0]) <= slaOrder.indexOf(slaDes))
                  ) {
                    slaNum = tempSlaNumber
                    slaDes = slaMatch[0]
                    sla = minicart.settings.slaLabel(item.shippingEstimate);
                  }
                }
              })
            })

            totalizers.forEach((item) => {
              if (item.id == "Shipping") {
                frete = item.value;
              }
            })

            let conteudo = '';

            if (frete === 0) {
              conteudo = `FRETE GRÁTIS`;
            } else {
              conteudo = `FRETE: ${minicart.settings.priceLabel(frete)} em até ${sla}`
            }

            $('.x-dados-adicionais-shipment .x-dados-adicionais--input').append(minicart.settings.dadosAdicionais(conteudo))
            $('.x-dados-adicionais-shipment input').val(orderForm.shippingData.selectedAddresses[0].postalCode)

            $('.x-dados-adicionais-shipment').removeClass('js--loading')
            $('.x-dados-adicionais-shipment').addClass('js-applied')
          } else {
            $('.x-dados-adicionais-shipment').removeClass('js-applied')
          }
        }
      },
      cupom: {
        apply: function (code) {
          vtexjs.checkout.getOrderForm()
            .then(function (orderForm) {
              return vtexjs.checkout.addDiscountCoupon(code);
            }).then(function (orderForm) {
            minicart.settings.cupom.handle()
          }).fail(function (e) {
            minicart.console(e)
          });
        },
        remove: function () {
          vtexjs.checkout.getOrderForm()
            .then(function (orderForm) {
              return vtexjs.checkout.removeDiscountCoupon();
            }).then(function (orderForm) {
            minicart.settings.cupom.handle()
          });
        },
        handle: function () {
          let orderForm = vtexjs.checkout.orderForm
          let marketingData = orderForm.marketingData

          $('.x-dados-adicionais-coupon').find('.x-dados-adicionais-aplicados').remove();

          if (marketingData !== null && marketingData.coupon !== null) {

            let cupom = marketingData.coupon;

            $('.x-dados-adicionais-coupon .x-dados-adicionais--input').append(minicart.settings.dadosAdicionais(cupom))
            $('.x-dados-adicionais-coupon input').val(cupom)

            $('.x-dados-adicionais-coupon').removeClass('js--loading')
            $('.x-dados-adicionais-coupon').addClass('js-applied')
          } else {
            $('.x-dados-adicionais-coupon').removeClass('js-applied')
          }
        }
      },
      dadosAdicionais: function (conteudo) {
        return `
              <div class="x-dados-adicionais-aplicados">
                <div class="ckeckmark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><defs><style>.a{fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.4px;}</style></defs><circle cx="8" cy="8" r="8"/><path class="a" d="M9.335,4.385,5,9.2,2.933,7.074" transform="translate(2 1.7)"/></svg>
                </div>
                <div class="info">
                  <div class="cicle">
                    ${conteudo}
                  </div>
                </div>
                <div class="remove">
                  <button type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 9.5 9.5">
                      <path id="icon-close" d="M4,4,0,8,4,4,0,0,4,4,8,0,4,4,8,8Z" transform="translate(0.75 0.75)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            `
      }
    },
    of_items: [],

    init: function () {
      minicart.console('init')
      vtexjs.checkout.getOrderForm().done(function (orderForm) {
        minicart.bind();

        minicart.mount(orderForm);
      });
    },
    bind: function () {

      $(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
        minicart.console('atualizado');
        minicart.mount(orderForm, []);
      });

      $(document).on('click', '.remove-link', function () {
        let index = parseInt($(this).attr('index'));
        vtexjs.checkout.getOrderForm()
          .then(function (orderForm) {
            let itemsToRemove = [
              {
                "index": index,
                "quantity": 1,
              }
            ]
            return vtexjs.checkout.removeItems(itemsToRemove);
          })
          .done(function (orderForm) {
            minicart.console('Item removido!', minicart.of_items[index]);
            // console.log(orderForm);
          });
      });

      $('#x-mini_cart').on('click', '.x-dados-adicionais-header button', function () {
        $("#x-mini_cart .x-minicart_itens--wrapper").toggleClass('js-dados-adicionais--opened');
      });

      $(document).on("header__close", function () {
        $("#x-mini_cart .x-minicart_itens--wrapper").removeClass('js-dados-adicionais--opened');
      });

      $(document).on('click', ".x-dados-adicionais-vendor .x-dados-adicionais--botao button", function () {
        let codigo = $(".x-dados-adicionais-vendor input").val();
        if (codigo == '') {
          minicart.settings.vendor.remove();
        } else {
          minicart.settings.vendor.apply(codigo);
        }
      });
      $(document).on('click', ".x-dados-adicionais-vendor .remove button", function () {
        minicart.settings.vendor.remove();
      });

      $(document).on('click', ".x-dados-adicionais-coupon .x-dados-adicionais--botao button", function (event) {
        let cupom = $(".x-dados-adicionais-coupon input").val();

        //if ((vtexjs.checkout.orderForm.marketingData.coupon !== undefined && cupom !== vtexjs.checkout.orderForm.marketingData.coupon)) {
          if (cupom == '') {
            minicart.settings.cupom.remove();
          } else {
            minicart.settings.cupom.apply(cupom);
          }
        // } else {
        //   $('.x-dados-adicionais-coupon').removeClass('js--loading')
        //   if (cupom == '') {
        //     $('.x-dados-adicionais-coupon').removeClass('js-applied')
        //   } else {
        //     $('.x-dados-adicionais-coupon').addClass('js-applied')
        //   }
        // }
      });
      $(document).on('click', ".x-dados-adicionais-coupon .remove button", function () {
        $('.x-dados-adicionais-coupon').removeClass('js--loading')
        $('.x-dados-adicionais-coupon').removeClass('js-applied')
        $('.x-dados-adicionais-coupon input:first').focus()
      });

      $(document).on('keyup', ".x-dados-adicionais-shipment input", function (event) {

        if (event.type == 'keyup') {
          if (event.keyCode < 48 || event.keyCode > 57) {
            event.returnValue = false;
            return false;
          }
        }
        minicart.settings.frete.mascaraCep(this, '#####-###');
      });

      $(document).on('click', ".x-dados-adicionais-shipment .x-dados-adicionais--botao button", function (event) {
        let appliedPostalCode = '';

        if(vtexjs.checkout.orderForm.shippingData.selectedAddresses.length > 0) {
          appliedPostalCode = vtexjs.checkout.orderForm.shippingData.selectedAddresses[0].postalCode;
        }

        if ($(".x-dados-adicionais-shipment input").val() !== appliedPostalCode) {

          let regex = /^\d{5}-\d{3}$/g

          let cep = $(".x-dados-adicionais-shipment input").val();
          if (regex.test(cep)) {
            minicart.settings.frete.calcularFrete(cep)
          } else {
            $('.x-dados-adicionais-shipment').removeClass('js--loading')
            $('.x-dados-adicionais-shipment').removeClass('js-applied')
          }
        } else if ($(".x-dados-adicionais-shipment input").val() === vtexjs.checkout.orderForm.shippingData.selectedAddresses[0].postalCode) {
          $('.x-dados-adicionais-shipment').addClass('js-applied')
        }
      });

      $(document).on('click', ".x-dados-adicionais-shipment .remove button", function () {
        $('.x-dados-adicionais-shipment').removeClass('js--loading')
        $('.x-dados-adicionais-shipment').removeClass('js-applied')
        $('.x-dados-adicionais-shipment input:first').focus()
      });

      $("body").on("click",".cart-list .quantity > span > a",function(){
        var indexProduct = $(this).parents(".quantity").attr("data-index");
        var option = $(this).text();
        var atualValue = parseInt($(".quantity[data-index="+indexProduct+"] input").val());
        var newQty;
        if(option === "+"){
          newQty = atualValue+1;
        }
        else{
          newQty = atualValue-1;
        }
        if(newQty > 0 && newQty != ""){
          $(this).parents(".quantity").addClass("waiting");
          vtexjs.checkout.getOrderForm()
              .then(function(orderForm) {
                var itemIndex = indexProduct;
                var item = orderForm.items[itemIndex];
                var updateItem = {
                  index: itemIndex,
                  quantity: newQty
                };
                return vtexjs.checkout.updateItems([updateItem], null, false);
              })
              .done(function(orderForm) {
                $(".quantity[data-index="+indexProduct+"] input").val(newQty);
                if(newQty > orderForm.items[indexProduct].quantity){
                  alert("A quantidade escolhida é maior do que temos em estoque.");
                  $(".quantity[data-index='"+indexProduct+"'] input").val(orderForm.items[indexProduct].quantity);
                }
                $(".quantity").removeClass("waiting");
              });
        }
      });
    },
    mount: function (orderForm, runSettings = ['vendor', 'frete', 'cupom']) {
      minicart.console('mount');
      // minicart.console(orderForm);
      minicart.settings.currencySymbol = orderForm.storePreferencesData.currencySymbol;

      minicart.hide(orderForm.items.length == 0)
      if (orderForm.items.length > 0) {
        minicart.items(orderForm)

        runSettings.forEach((run) => {
          minicart.settings[run].handle();
        })

        minicart.brinde(orderForm);
        minicart.valores(orderForm)
      } else {
        minicart.empty()
      }

      $('.x-header .js--minicart__toggler').attr('data-val', orderForm.items.length)
    },
    empty: function () {
      $(minicart.settings.container).html($('<div>').addClass(minicart.settings.cartEmptyClass).text(minicart.settings.cartEmptyMessage))
    },
    items: function (orderForm) {
      let listElement = $('<ul>').addClass(minicart.settings.cartListClass)

      minicart.of_items = JSON.parse(JSON.stringify(orderForm.items));

      minicart.additionalInfo(function () {
        let items = minicart.of_items.map(function (item, index) {

          $(minicart.settings.container).html(listElement)

          let category = item.productCategories;
          for (var categoryList in category) {
            var nameCategory = category[categoryList].replace("ç", "c").toLowerCase();
            break;
          }

          return `
            <li class="row row-${index} ${nameCategory}" sku="${item.id}">
              <a href="${item.detailUrl}">
                <div class="col col-0">
                  <div class="_qc-img _qc-img-${index}" sku="${item.id}">
                    <img src="${item.imageUrl}">
                  </div>
                  <div class="_qc-product _qc-product-${index}">
                    ${item.name}
                  </div>
                </div>
              </a>
              <div class="col col-1">
                <input type="text" value="${item.quantity}" maxlength="2" ndx="${index}" class="_qty _qty-${index} keydown_binding active" sku="${item.id}">
                <a ndx="${index}" class="_add _add-${index} active">+</a>
                <a ndx="${index}" class="_remove _remove-${index} active">-</a>
              </div>
              <div class="col col-2">
                <div class="extra-info">
                  <div class="size"><label>Tam.</label>${item.size}</div>
                  <div class="color"><label>Cor</label><img src="/arquivos/${item.color}.jpg" /></div>
                  <div class="quantity" data-index="${index}">
                    <label>Qtd.</label>
                    <span>
                        <a href="javascript:void(0)">-</a>
                        <input type="text" value="${item.quantity}" class="minicartQtd" disabled />
                        <a href="javascript:void(0)">+</a>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col col-3">${minicart.settings.priceLabel(item.sellingPrice)}</div>
              <div class="col col-4">
                <a class="remove-link remove-link-${index}" sku="${item.id}" index="${index}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 9.5 9.5">
                    <path id="icon-close" d="M4,4,0,8,4,4,0,0,4,4,8,0,4,4,8,8Z" transform="translate(0.75 0.75)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                  </svg>
                </a>
              </div>
            </li>
        `;
        })

        listElement.append(items.join(''))
      })
    },
    hide: function (boolean) {
      $(minicart.settings.footerSelector).toggleClass('x-hide', boolean)
      $('#x-mini_cart .x-dados-adicionais').toggleClass('x-hide', boolean)
      $('#x-mini_cart .x-brinde--wrapper').toggleClass('x-hide', boolean)
    },
    brinde: function (orderForm) {
      if ($('#x-mini_cart .x-brinde--wrapper').find('.minicart-brinde').length) {
        let valor = $('#x-mini_cart .x-brinde--wrapper').find('.minicart-brinde').find('.valor').attr('data-valor').match(/(\d+(?:,)\d+)/g)

        $('#x-mini_cart .x-brinde--wrapper').toggleClass('x-hide', (valor === null))
        if (valor !== null) {
          let newValue = parseInt(valor[0].replace(',', ''))
          if(orderForm.value >= newValue) {
            $('#x-mini_cart .x-brinde--wrapper').find('.mensagem--falta-ganhar').toggleClass('x-hide', true)
            $('#x-mini_cart .x-brinde--wrapper').find('.mensagem--ganhou').toggleClass('x-hide', false)
          } else{
            $('#x-mini_cart .x-brinde--wrapper').find('.minicart-brinde').find('.valor').html(minicart.settings.priceLabel(newValue - orderForm.value))
            $('#x-mini_cart .x-brinde--wrapper').find('.mensagem--falta-ganhar').toggleClass('x-hide', false)
            $('#x-mini_cart .x-brinde--wrapper').find('.mensagem--ganhou').toggleClass('x-hide', true)
          }
        }
        minicart.console(valor)
      }
    },
    valores: function (orderForm) {
      let subtotal = 0;
      let total = orderForm.value;

      if (orderForm.totalizers.length > 0) {
        orderForm.totalizers.forEach((e) => {
          if (e.id == 'Items') {
            subtotal = e.value;
            return false;
          }
        })
      }

      $(minicart.settings.footerSelector).find('.x-subtotal .x-value').html(minicart.settings.priceLabel(subtotal))
      $(minicart.settings.footerSelector).find('.x-total .x-value').html(minicart.settings.priceLabel(total))
    },
    additionalInfo: function (callback) {
      let skuIds = minicart.of_items.map(function (item) {
        return item.id
      });

      $.ajax({
        url: '/api/catalog_system/pub/products/search?fq=skuId:' + skuIds.join('&fq=skuId:'),
        dataType: "json",
        type: "GET",
      }).then(function (t) {
        // minicart.console(t);

        minicart.of_items.forEach((minicartItem, index) => {
          t.forEach(function (produto) {
            // minicart.colors[item.productId] = item.Cor[0] || null
            if (parseInt(minicartItem.productId) === parseInt(produto.productId)) {
              minicart.of_items[index]['color'] = produto.Cor ? produto.Cor[0] : null;
              
              produto.items.forEach((item) => {
                if (parseInt(minicartItem.id) === parseInt(item.itemId)) {
                  minicart.of_items[index]['size'] = item.Tamanho[0] || null;
                  item.Tamanho[0] || "U";
                }
              })
            }
          })
        })

        callback()

      })
    }
  }

  minicart.init();

})
