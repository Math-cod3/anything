import richSnippetsProduct from "./modules/rich-snippets-product";
if (
  $("body").hasClass("produto") ||
  $("body").hasClass("product") ||
  $("body").hasClass("produto2021")
) {
  const produto2021 = {
    int: function () {
      var imageWidth = $("#include").width();
      var imageHeight = $("#include").height();
      this.similars = [];

      this.getProductData();
      this.superZoom(imageWidth, imageHeight);
      this.productUnaviable();
      this.removeTableShipping();
      this.handleTab();
      this.getSeller();
      this.handleShipping();
      this.handleChangeSku();
      this.productReference();
      this.productGuiaMedidas();
      this.insertGuiaMedidas();
      this.insertEmptySkuMessage();
      this.showNotifyme();
      this.handleClickShow();
      this.handlebuyButton();
      this.triggerCalculateShipping();
      this.mountModalShipping();
      this.changeMessagesuccess();
      this.submitNewsLetter();
      this.getWishlist();
      this.addItemToCart();
      this.getSimilars();
    },

    handleWishlist: function (userInfoData) {
      var userEmail = userInfoData.Email;
      if (userInfoData.IsUserDefined == true) {
        $.ajax({
          headers: {
            Accept: "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json",
          },
          type: "GET",
          url:
            "/api/dataentities/CL/search?_where=email=" +
            userEmail +
            "&_fields=id",
        }).done(function (data) {
          var idUser = data[0].id;
          $.ajax({
            headers: {
              Accept: "application/vnd.vtex.ds.v10+json",
              "Content-Type": "application/json",
            },
            type: "GET",
            url:
              "/api/dataentities/WL/search?_where=userId=" +
              idUser +
              "&_fields=id,productsList",
          }).done(function (data2) {
            if (data2.length) {
              data2.forEach(function (list) {
                var productsList = list["productsList"];
                productsList = productsList.split(",");
                if (productsList.length) {
                  productsList.forEach(function (product) {
                    if (product == skuJson_0.productId) {
                      $("body").addClass("x-active");
                      $(".x-add-it-to-wishlist").add("x-active");
                    }
                  });
                }
              });
            }
          });
        });
      }
    },
    getWishlist: function () {
      var _this = this;
      $.ajax({
        type: "GET",
        url: "/no-cache/profileSystem/getProfile",
      }).done(function (data) {
        if ($(data).length) {
          _this.handleWishlist(data);
        }
      });
    },
    submitNewsLetter: function () {
      $("#notifymeButtonOK").on("submit", function () {
        var name = $("notifymeClientName").val();
        var email = $("notifymeClientEmail").val();

        var data = {
          name: name,
          email: email,
        };

        if ($(".sku-notifyme-form-span input[type=checkbox]").is(":checked")) {
          $.ajax({
            type: "PATCH",
            url: "/api/dataentities/NL/documents/",
            headers: {
              accept: "application/vnd.vtex.ds.v10+json",
              "Content-Type": " application/json",
            },
            data: JSON.stringify(data),
          }).done(function () {
            console.log("Enviado NewsLetter");
          });
        }
      });
    },
    changeMessagesuccess: function () {
      var closeNotifySuccess = $("<div/>", {
        class: "closeNotifySuccess",
        text: "x",
      });

      closeNotifySuccess.on("click", function () {
        $(".success").css("display", "none");
        $(".notifyme.sku-notifyme").css("display", "none");
        $(".buy-button-new-notifyme").css("display", "block");
      });

      $(".portal-notify-me-ref .success")
        .html(
          "<span>Pronto!</span><br /> Avisaremos você assim que a peça chegar."
        )
        .append(closeNotifySuccess);
    },
    mountModalShipping: function () {
      var wrapperModal = $("<div/>", {
        class: "wrapperModalshipping",
      });

      wrapperModal.on("click", function (e) {
        var el = $(e.target);

        if (el.hasClass("wrapperModalshipping")) {
          $(this).css("display", "none");
        }
      });

      var bodyModal = $("<div/>", {
        class: "bodyModalshipping",
      });

      var CloseModal = $("<div/>", {
        class: "closeModalshipping",
        text: "x",
      });

      CloseModal.on("click", function () {
        wrapperModal.css("display", "none");
      });

      $("body").on("click", ".td-name-span", function () {
        wrapperModal.css("display", "block");
      });

      bodyModal.append(CloseModal);
      wrapperModal.append(bodyModal);

      $("body").append(wrapperModal);
    },
    removeTextBuy: function (_this, callback) {
      var hr = $(_this).attr("href").indexOf("javascript:alert(");
      if (hr > -1) {
        if ($(".content-colors-text").length) {
          $(".content-colors-text").remove();
        }
        $(".content-colors").append(
          '<p class="content-colors-text">Selecione um tamanho</p>'
        );
      } else {
        callback();
      }
    },
    removeTableShipping: function () {
      vtexjs.checkout.getOrderForm().then(function (orderForm) {
        if ($(".freight-values").length) {
          $(".freight-values").remove();
        }
      });
    },
    handlebuyButton: function () {
      var _this = this;
      $(".buy-button-ref").on("click", function (e) {
        e.preventDefault();
        _this.removeTextBuy(this, function () {
          if ($(".content-colors-text").length) {
            $(".content-colors-texts").remove();
          }
        });
      });
    },
    handleChangeSku: function () {
      var _this = this;
      var t =
        "Deixe seu nome e-email que avisaremos quando a peça estiver disponível.";
      $(".notifyme-client-name").attr("placeholder", "Nome");
      $(".notifyme-client-email").attr("placeholder", "E-mail");
      $(".sku-notifyme-form").append(
        '<span class="sku-notifyme-form-span"><input type="checkbox" checked />Também quero receber novidades<br>e promoções em primeira mão.</span>'
      );
      $(".notifyme-form > p").text(t);
      $(".notifyme-button-ok").val("ENVIAR");

      $(window).on("skuSelected.vtex", function (a, b, c) {
        _this.handleShowNotifyme(a, b, c);
        _this.removeTextBuy(".buy-button-ref", function () {
          if ($(".content-colors-text").length) {
            $(".content-colors-text").remove();
          }
        });

        $(".buy-button").removeClass("disabled");
      });
    },
    handleClickShow: function () {
      $(document).on("click", ".buy-button-new-notifyme", function (e) {
        e.preventDefault();
        $(".notifyme.sku-notifyme").css("display", "block");
        $(this).css("display", "none");
      });
    },
    handleShowNotifyme: function (a, b, c) {
      if (c["availablequantity"] == 0) {
        $(".buy-button-new-notifyme").css("display", "block");
      } else {
        $(".buy-button-new-notifyme").css("display", "none");
      }
      $(".notifyme.sku-notifyme").css("display", "none");
    },
    showNotifyme: function () {
      var ancor = $("<a/>", {
        class: "buy-button-new-notifyme",
        text: "AVISE-ME QUANDO CHEGAR",
        style: "display:none;",
        href: "/",
      });

      $(".x-productPage__buyButton").append(ancor);
    },
    handleTab: function () {
      $("body").on(
        "click",
        ".x-productPage__tabDescription--item h2",
        function () {
          $(this).toggleClass("more less");
          $(this)
            .parent()
            .find(".x-productPage__tabDescription--content")
            .slideToggle();
        }
      );
    },
    
    getSeller: function () {
      $('.skuList > span > label').on('click', function(){
        let sizePosition = $(this).attr("for").slice(-1);
        let sellerName = skuJson.skus[sizePosition].seller;
        let sellerId = skuJson.skus[sizePosition].sellerId;
  
        if(sellerId != '1'){
          if(sellerId == 'TD1574') {
            $('.product-seller').append(`
              Este produto será entregue por BLITZ
            `); 
          }
          // else para puxar o sellerName direto da vtex futuramente 
          //  else {
          //   $('.product-seller').append(`
          //   Este produto será entregue por ${sellerName}.
          // `); 
          // }
          $('.product-seller').show();
        } else {
          $('.product-seller').hide();
        }
      })
  
      let uniqueSize = $('.skuList .group_0 .skuespec_U')
      if ($('.skuList .group_0 label').hasClass('skuespec_U')) {
        $(uniqueSize).trigger('click');
      }
    },

    handleShipping: function () {
      ShippingValue();
      var pElment = $("<p/>", {
        text: "Devolução online por nossa conta em até 30 dias.",
        class: "msn-shipping",
      });

      $(".x-productPage__tabDescription--content:last").append(pElment);

      setTimeout(function () {
        $("#txtCep").attr("placeholder", "Insira aqui seu CEP");
      }, 800);
    },
    formatName: function (txt) {
      txt = txt.split("(")[0];
      return txt;
    },
    mountModalShippingTable: function (data, _this) {
      var postalCode = $("#txtCep").val();

      var address = {
        postalCode,
        country: "BRA",
      };

      vtexjs.checkout.getAddressInformation(address).done(function (result) {
        $.ajax({
          type: "GET",
          headers: {
            Accept: "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json",
            "REST-Range": "resources=0-500",
          },
          url:
            "/api/dataentities/SL/search?estado=" +
            result.state +
            "&_fields=endereco,nome,cidade,cep,numero,bairro,cep,complemento",
          success: function (store) {
            var _table = $("<table/>");

            var _thead = $("<thead/>");
            var _thead_tr = $("<tr/>");

            var _thead_td_store = $("<td/>", { text: "LOJA" });
            var _thead_td_locate = $("<td/>", { text: "ENDEREÇO" });
            // var _thead_td_city = $('<td/>', {text: 'CIDADE'})

            _thead_tr.append(_thead_td_store);
            _thead_tr.append(_thead_td_locate);
            // _thead_tr.append(_thead_td_city)
            _thead.append(_thead_tr);

            var _tbody = $("<tbody/>");

            console.log(store);

            store.forEach(function (obj) {
              console.log(obj);

              var nome = obj.nome;
              var endereco =
                obj.endereco +
                ", " +
                obj.numero +
                ", " +
                obj.bairro +
                ", " +
                obj.cidade +
                ", " +
                obj.cep;
              // var cidade = obj.cidade;

              var _tbody_tr = $("<tr/>");

              var _tbody_td_store = $("<td/>", {
                text: nome,
                class: "td-name",
              });
              var _tbody_td_locate = $("<td/>", {
                text: endereco,
                class: "td-address",
              });

              _tbody_tr.append(_tbody_td_store);
              _tbody_tr.append(_tbody_td_locate);
              // _tbody_tr.append(_tbody_td_city)
              _tbody.append(_tbody_tr);
            });


            _table.append(_thead);
            _table.append(_tbody);

            $(".wrapperModalshipping .bodyModalshipping").append(_table);
          },

          error: function (err) {
            console.log(err);
          },
        });
      });
    },
    callBackCalculateShipping: function (data, _this) {
      var _table = $("<table/>");
      var _thead = $("<thead/>");
      var _tbody = $("<tbody/>");

      var _tbody_tr = $("<tr/>");
      var _tbody_td_price = $("<td/>", {
        text: "Grátis",
      });
      var _tbody_td_name = $("<td/>", {
        html: 'Retirar em loja <br/> <span class="td-name-span">confira as lojas<span>',
        class: "td-name free",
      });
      var _tbody_td_shippingEstimate = $("<td/>", {
        text: "1-2 dias úteis",
      });
      _tbody_tr.append(_tbody_td_price);
      _tbody_tr.append(_tbody_td_name);
      _tbody_tr.append(_tbody_td_shippingEstimate);
      _tbody.append(_tbody_tr);

      var pickupoint = [];

      data.logisticsInfo[0].slas.forEach(function (sla) {
        if (sla.price > 0) {
          var estimate = sla.shippingEstimate.replace("bd", "");
          estimate = parseInt(estimate);

          var priceFormatter = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          var _tbody_tr = $("<tr/>");
          var _tbody_td_price = $("<td/>", {
            text: priceFormatter.format(sla.price / 100),
          });
          var _tbody_td_name = $("<td/>", {
            text: sla.name,
            class: "td-name",
          });
          var _tbody_td_shippingEstimate = $("<td/>", {
            text: estimate == 1 ? "1 dia útil" : estimate + " dias úteis",
          });
          _tbody_tr.append(_tbody_td_price);
          _tbody_tr.append(_tbody_td_name);
          _tbody_tr.append(_tbody_td_shippingEstimate);
          _tbody.append(_tbody_tr);
        } else {
          pickupoint.push(sla);
        }
      });

      _this.mountModalShippingTable(pickupoint, _this);

      _table.append(_thead);
      _table.append(_tbody);

      var newTable = $("<div/>", {
        class: "freight-values-2",
      });

      $("#calculoFrete").append(newTable);
      $(".freight-values-2").append(_table);
      $("#calculoFrete .content").css("display", "none");
    },
    triggerCalculateShipping: function () {
      var _this = this;
      $("body").on("click", "#btnFreteSimulacao", function (e) {
        e.preventDefault();
        var cep = $(".fitext.freight-zip-box").val();
        if (cep != "") {
          _this.handleCalculateShipping(
            _this.callBackCalculateShipping,
            cep,
            _this
          );
        }
      });
    },
    handleCalculateShipping: function (callback, cep, _this) {
      var sku = $("#calculoFrete").attr("skucorrente");
      var seller = $("#calculoFrete").attr("seller");
      var items = [
        {
          id: sku,
          quantity: 1,
          seller: seller,
        },
      ];

      var country = "BRA";

      vtexjs.checkout
        .simulateShipping(items, cep, country)
        .done(function (result) {
          callback(result, _this);
        });
    },
    productReference: function () {
      $.ajax({
        url:
          "/api/catalog_system/pub/products/search/?fq=productId:" +
          skuJson_0.productId,
        success: function (data) {
          var productReferenceData = data[0]["Referência Base"];
          productReferenceData =
            "<p>Referência: " + productReferenceData + "</p>";
          $(".x-productDescription .productDescription").append(
            productReferenceData
          );
        },
      });
    },
    superZoom: function (width, height) {
      window.LoadZoom = function (pi) {
        if ($(".image-zoom").length <= 0) return false;
        var optionsZoom = {
          zoomWidth: width,
          zoomHeight: height,
          preloadText: "",
        };
        $(".image-zoom").jqzoom(optionsZoom);
      };
      LoadZoom(0);
    },
    insertGuiaMedidas: function () {
      setTimeout(function () {
        $("li.select.skuList.item-dimension-Tamanho").append(`
      <div class="sizeGuide">
        <p>guia de medidas</p>
      </div>
      `);
      }, 1);
    },
    productGuiaMedidas: function () {
      var medidasWrapper = $(
        ".x-tabMedidas .x-productPage__tabDescription--content"
      );
      var tableTrigger = $(
        ".x-guide__header-wrapper .x-guide__triggers-wrapper .x-guide__triggers--table"
      );
      var imgTrigger = $(
        ".x-guide__header-wrapper .x-guide__triggers-wrapper .x-guide__triggers--img"
      );
      $.ajax({
        url:
          "/api/catalog_system/pub/products/search/?fq=productId:" +
          skuJson_0.productId,
        success: function (data) {
          var productCategory = data[0].categories[0];
          var productSize = data[0].items[0].Tamanho[0];
          var stringRegex = /^[a-zA-Z]+$/;
          var intRegex = /^\d+$/;

          if (
            productCategory.search("Biju") > -1 ||
            productCategory.search("Bolsa") > -1 ||
            productCategory.search("Casa e Décor") > -1
          ) {
            return false;
          }
          if (stringRegex.test(productSize) == true) {
            $("#adulto-pecas").addClass("js--actived-guide");
            guideAppearHide();
          }
          if (intRegex.test(productSize) == true) {
            $("#numeracao-pecas").addClass("js--actived-guide");
            guideAppearHide();
          }
          if (productCategory.search("Filozinha") > -1) {
            //Remove botão duplicado
            $(".x-productPage__skusGroup .x-medidas").remove();
            //Oculta conteudo do modal incorrote para categoria
            $("#numeracao-pecas").removeClass("js--actived-guide");

            $("#infantil-pecas").addClass("js--actived-guide");
            medidasWrapper.append(
              "<span class='x-medidas'>Guia de medidas</span>"
            );
            guideAppearHide();
          }
        },
      });
      var guideAppearHide = function () {
        $(".x-tabMedidas, .sizeGuide").on("click", function () {
          $(".x-guide").toggleClass("js--actived");
          $("body").addClass("not-scroll");
        });
      };
      $(".x-guide .x-guide__overlay, .x-guide .x-guide__close").on(
        "click",
        function (e) {
          $(".x-guide").toggleClass("js--actived");
          $("body").removeClass("not-scroll");

          $(".x-tabMedidas").find("h2").removeClass("less");
          $(".x-tabMedidas").find("h2").addClass("more");
          $(".x-tabMedidas")
            .find(".x-productPage__tabDescription--content")
            .toggle();
        }
      );
      imgTrigger.on("click", function () {
        $(".x-guide__table-wrapper")
          .find(".js--actived-guide")
          .addClass("js--hide");
        $(".x-guide__content .x-guide__image-table").addClass(
          "js--active-image"
        );
        $(".x-guide__table-message").css("display", "none");
      });
      tableTrigger.on("click", function () {
        $(".x-guide__content .x-guide__image-table").removeClass(
          "js--active-image"
        );
        $(".x-guide__table-message").css("display", "block");
        $(".x-guide__table-wrapper")
          .find(".js--actived-guide")
          .removeClass("js--hide");
      });
    },

    insertEmptySkuMessage: function () {
      if ($(".empty-message").length == 0) {
        let html = $("<div>")
          .addClass("empty-message")
          .html("Primeiro, selecione um tamanho.");
        $(".x-productPage__skusGroup .skuList > span").append(html);
      }
    },
    showEmptySkuMessage: function () {
      if (
        $(".sku-selector-container .skuList span").children(".checked").length <
          1 &&
        $(".empty-message").hasClass("js-active") === false
      ) {
        $(".empty-message").addClass("js-active");
      }
    },
    hideEmptySkuMessage: function () {
      if ($(".empty-message").hasClass("js-active")) {
        $(".empty-message").removeClass("js-active");
      }
    },

    changeSku: function () {
      $(window).on("skuDimensionChanged.vtex", function () {
        var sliderHight = $("#show").height();
        $(".mainProductImage").css("height", sliderHight + "px");
        $("#show").hide();
        if ($(".thumbs").hasClass("slick-initialized")) {
          $(".thumbs").slick("unslick");
        }

        setTimeout(function () {
          this.thumbSlider();
          this.productUnaviable();
          $(".mainProductImage").attr("style", "");
        }, 1000);
        $("#show").show();
      });
    },

    thumbSlider: function () {
      var imageFormat = "-460-460";

      //troca formato da imagem
      $("ul.thumbs li img").each(function () {
        var src = $(this).attr("src");
        src = src.replace("-55-55", imageFormat);
        $(this).attr("src", src);
      });

      $("ul.thumbs").slick({
        infinite: true,
        autoplay: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 500,
        dots: false,
        arrows: true,
        draggable: false,
        vertical: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 720,
            settings: {
              draggable: true,
              slidesToShow: 1,
              arrows: true,
              dots: false,
              vertical: false,
            },
          },
        ],
      });

      $("ul.thumbs").slick("slickNext");
    },

    productUnaviable: function () {
      if ($(".productPrice .descricao-preco").text() == "") {
        $("body").addClass("productUnaviable");
        $(".sku-notifyme h3").text("Avise-me quando chegar");
      }
      $(".chooseProduct input").on("change", function () {
        if ($(".productPrice .descricao-preco").text() == "") {
          $("body").addClass("productUnaviable");
          $(".sku-notifyme h3").text("Avise-me quando chegar");
        } else {
          $("body").removeClass("productUnaviable");
        }
      });
    },

    addItemToCart: function () {
      let _this = this;

      $(".buy-button").on("mouseenter", function (e) {
        _this.showEmptySkuMessage();
      });
      $(".buy-button").on("mouseleave", function (e) {
        _this.hideEmptySkuMessage();
      });
      $(".buy-button").on("click", function (e) {
        e.preventDefault();

        var href = $(this).attr("href");
        var sku = /sku=(\d+)/.exec(href);
        var $btn = $(this);

        if (!$btn.hasClass("disabled")) {
          $(".buy-button").addClass("disabled");

          if (
            $(".sku-selector-container .skuList span").children(".checked")
              .length < 1
          ) {
            // alert("Por favor selecione o tamanho");
            // _this.showEmptySkuMessage()
          } else {
            if (Array.isArray(sku)) {
              if (sku[1]) {
                $btn.addClass("disabled");

                var pickedSeller = skuJson_0.skus.find(
                  (x) => x.sku === parseInt(sku[1])
                ).sellerId;

                vtexjs.checkout.getOrderForm().then((orderForm) => {
                  var sku_picked = sku[1];
                  var quant = 1;

                  orderForm.items.forEach(function (item) {
                    if (parseInt(item.id) === parseInt(sku_picked)) {
                      quant += item.quantity;
                    }
                  });

                  var data = [
                    {
                      id: sku_picked,
                      quantity: quant,
                      seller: pickedSeller,
                    },
                  ];

                  vtexjs.checkout
                    .addToCart(data)
                    .fail(function () {
                      window.location.href = href;
                    })
                    .done(function () {
                      console.log("added");
                      $btn.addClass("is--added");
                      $btn.removeClass("disabled");

                      $(document).trigger("minicart__open");

                      if (typeof dataLayer !== "undefined") {
                        dataLayer.push({
                          event: "GAEvent",
                          eventCategory: "HelperAddToCart",
                          eventAction: "HelperAddToCart_PDP",
                          eventNonInteraction: false,
                        });
                      }

                      setTimeout(function () {
                        if ($("body").hasClass("is--showing__minicart")) {
                          $(document).trigger("header__close");
                        }
                      }, 2000);
                    });
                });
              }
            }
          }
        }

        return false;
      });
    },

    getProductData: function () {
      try {
        const { productId } = skuJson;
        fetch(
          `/api/catalog_system/pub/products/search/?fq=productId:${productId}`
        )
          .then((res) => {
            if (res.ok) return res.json();
            throw Error;
          })
          .then((data) => {
            if (!data[0]) throw Error;
            this.data = data[0];
            richSnippetsProduct(this.data);

            const thumb = data[0].items[0].images.filter(
              (image) => image.imageLabel === "thumb"
            )[0];

            if (typeof thumb === "undefined") {
              this.thumbSrc = String(data[0].items[0].images[0].imageUrl);
            } else {
              this.thumbSrc = thumb.imageUrl;
              $("#show .thumbs li:last-child").remove();

              this.renderColorVariation();
            }

          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    },

    renderColorVariation: function (
      container = ".x-productPage__skusGroup--colors"
    ) {
      try {
        let similarId = [];

        $(container).append(`
          <a class="current-color">
            <img src="${this.thumbSrc}" title="${skuJson.name}">
          </a>
        `);

        this.similars.forEach((similar) => {
          similar.items[0].images.filter((item) => {
            if (
              item.imageLabel === "thumb" &&
              !~similarId.indexOf(similar.productId)
            ) {
              $(container).append(`
                <a class="x-thumb-color" href="${similar.link}">
                  <img src="${item.imageUrl}" alt="${skuJson.name}"/>
                </a>
              `);
              similarId.push(similar.productId);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    },

    getSimilars: function () {
      try {
        const { productId } = skuJson;

        fetch(
          `/api/catalog_system/pub/products/crossselling/similars/${productId}`
        )
          .then((res) => res.json())
          .then((data) => {
            this.similars = data;
          });
      } catch (error) {
        console.error(error);
      }
    },
  };

  $(document).ready(function () {
    produto2021.int();
  });


}
