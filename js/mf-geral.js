// Polyfill
// - includes
// - forEach
// --------------------------------------
// - https://tc39.github.io/ecma262/#sec-array.prototype.includes

let classesBlockPreHeader = ["js-cronometro"];

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function (searchElement, fromIndex) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        // NOTE: === provides the correct "SameValueZero" comparison needed here.
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    },
  });
}
if (!String.prototype.includes) {
  String.prototype.includes = function () {
    "use strict";
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach(callback, thisArg) {
    var T, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) !== "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (Object.prototype.hasOwnProperty.call(O, k)) {
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// =======================================

function preHeader_v2() {
  var slickOptions = {
    adaptiveHeight: true,
    arrows: false,
    fade: true,
    autoplay: true,
    cssEase: "ease-in-out",
  };

  $.ajax({
    url: "/api/dataentities/PH/search?_fields=active,Texto,url&active=true&_sort=updatedIn DESC",
    headers: {
      "rest-range": "resources=0-999",
    },
  }).done(function (data) {
    // console.log(data);
    var lis = "";
    if (data.length) {
      $.each(data, function (i, item) {
        lis +=
          '<li class="x-preHeader__item x-preHeader__item--link"><a href="' +
          item.url +
          '"><span>' +
          item.Texto +
          "</span></a></li>";
      });

      $("#preHeader__content").append(
        $("<ul>", { class: "x-preHeader" }).append(lis)
      );
      let hasBlock = classesBlockPreHeader.filter(function (e, i) {
        return $(document.body).hasClass(e);
      });

      if (hasBlock.length === 0) {
        $(document.body).addClass("js-preHeader");
      }

      $("#preHeader__content .x-preHeader").slick(slickOptions);
    }
  });
}

function removeHelp() {
  $(".helperComplement").remove();
  const event = new CustomEvent("mf-helperComplement");
  document.dispatchEvent(event);
}

function formSearch() {
  $("form.x-search").on("submit", function () {
    var text = $(".js--search-input").val();
    var url = "/busca?ft=" + window.decodeURIComponent(text);
    window.location.href = url;

    return false;
  });

  $(".js--search__start").on("click", function (e) {
    var form = $("form.x-search");
    if (!form.hasClass("js--search-input--open")) {
      form.addClass("js--search-input--open");
      setTimeout(function () {
        $("#serach-field").focus();
      }, 30);
      e.preventDefault();
    } else {
      if ($("#serach-field").val().trim() != "") {
        form.submit();
      } else {
        $(document).trigger("search__close");
      }
    }
  });

  $(document).on("search__close", function () {
    $("form.x-search").removeClass("js--search-input--open");
    $("#serach-field").val("");
  });
}

function login() {
  var userInfo = {};
  var $body = $("body");

  //Detecta se está no IE
  var isInternetExplorer = /*@cc_on@*/ false || !!document.documentMode;

  // Oculta 'Incluir dados de pessoa jurídica'
  var businessToggle = document.getElementById("business-toggle");

  if (businessToggle) {
    businessToggle.style.display = "none";
  }

  $.ajax("/no-cache/profileSystem/getProfile", {
    async: false,
  })
    .fail(function () {
      userInfo = null;
    })
    .done(function (data) {
      userInfo = data;
    });

  $(".user")
    .not(".js-active")
    .on("click", function () {
      if (!userInfo.IsUserDefined) {
        vtexid.start({
          returnUrl: "/",
          userEmail: "",
          locale: "pt-BR",
          forceReload: false,
        });
        setTimeout(function () {
          $("#inputEmail").attr("placeholder", "Ex: luisa@mariafilo.com.br");
        }, 3000);

        if (isInternetExplorer) {
          window.location.reload("/");
        }
        return false;
      }
    });

  if (userInfo.IsUserDefined) {
    $(".x-header__icon.header__user").addClass("js-logged");
    $(".user").addClass("js-active");
    let name = userInfo.FirstName || userInfo.Email;
    name = (name || "").split("@").shift().split(".").shift();
    name &&
      $(".user__name").html(name).before("") &&
      ($(".x-header__icon.header__user")[0].style.width =
        $(".x-header__icon.header__user").width() + "px");
  } else {
    $(".user").removeClass("js-active");
  }

  $body.on("hover", ".user", (event) => {
    event.preventDefault();
    $(".user").addClass("js-open").find(".user__handle").addClass("js-active");
  });

  $body.on("mouseleave", ".user", (event) => {
    event.preventDefault();
    $(".user")
      .removeClass("js-open")
      .find(".user__handle")
      .removeClass("js-active");
  });
}

function setFlags() {
  var allIds = [];
  var pgProduct = false;
  $('.prateleira .x-id:not(".is--added")').each(function () {
    allIds.push($(this).val());
    $(this).addClass("is--added");
  });

  if (typeof skuJson != "undefined") {
    if (!$("body").hasClass("flag-checked")) {
      allIds.push(skuJson.productId);
      pgProduct = true;
      $("body").addClass("flag-checked");
    }
  }

  var allIdsInText = allIds
    .map(function (id) {
      return "fq=productId:" + id;
    })
    .join("&");

  var flags = {
    // sets suite flags
    suite: function (products_array) {
      var selectedsIds = [];
      var suiteIcon = $("#suite-icon-svg");

      products_array.forEach(function (item) {
        if (Array.isArray(item["Linha"])) {
          var collection = item["Linha"];
          collection.forEach(function (col) {
            var str = col || "";
            if (col.search(/suite/gim) !== -1) {
              selectedsIds.push(item.productId);
            }
          });
        }
      });

      selectedsIds.forEach(function (id) {
        var html = $('<span class="x-flag x-flag--suite">').append(
          suiteIcon.clone()
        );

        if (pgProduct) {
          if (skuJson.productId == id) {
            $("#productPage-flags").append(html);
          }
        }
        $('.js--flag-shelf[data-id="' + id + '"]').prepend(html);
      });
    },

    novo: function (products_array) {
      var selectedsIds = [];

      products_array.forEach(function (item) {
        var collection = item["clusterHighlights"] || {};

        if ("137" in collection) {
          selectedsIds.push(item.productId);
        }
      });

      selectedsIds.forEach(function (id) {
        $('.js--flag-shelf[data-id="' + id + '"]')
          .find(".x-flag--novo")
          .addClass("is--active");
      });
    },
  };

  if (allIds.length) {
    $.ajax("/api/catalog_system/pub/products/search/?" + allIdsInText).then(
      function (data) {
        flags.suite(data);
      }
    );
  }

  if (document.querySelector(".catalogResults .x-flag-shelf .flag.suite-783")) {
    $("p.flag.suite-783").before('<span class="x-flag x-flag--suite"></span>');
  }
}

function goToTop() {
  $(document).on("click", ".js--back-to-top", function (e) {
    e.preventDefault();
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });
}

function placeholderEmail() {
  var url = location.pathname;
  if (url.indexOf("/login") >= 0) {
    var checkProviders = setInterval(placeholderTimer, 1000);

    function placeholderTimer() {
      if ($(document).find(".vtexIdUI-providers-list").length) {
        $(document)
          .find("#inputEmail")
          .attr("placeholder", "Ex: luisa@mariafilo.com.br");
        $(document)
          .find("#appendedInputButton")
          .attr("placeholder", "Ex: luisa@mariafilo.com.br");

        clearPlacehlderTimer();
      }
    }

    function clearPlacehlderTimer() {
      clearInterval(checkProviders);
    }
  }
}

function footerAllIn() {
  var cleanInputsFields = function ($nome, $email, $button) {
    $button.prop("disabled", false).text("OK");
    $nome.val("");
    $email.val("");
  };

  $(document).on(
    "submit",
    ".js--newsletter, .news-retratil__form",
    function (event) {
      event.preventDefault();
      var form = this;

      var $nome = $(form).find("input[type=text]"),
        $email = $(form).find("input[type=email]"),
        $button = $(form).find("button");

      // $button.prop("disabled", true).text("AGUARDE");

      var nome = $nome.val(),
        email = $email.val();

      var jsonData = {
        name: nome,
        email: email,
      };

      $.get(
        "/api/dataentities/CL/search?_fields=email&_where=email=" + email
      ).done(function (clientInfo) {
        if (clientInfo.length) {
          alert("Você já possui cadastro.");
          let error = $("<div>")
            .addClass("error-message")
            .html("Verifique os dados e tente novamente.");
          $(".x-footer__news-form.js--newsletter").append(error);
          cleanInputsFields($nome, $email, $button);
        } else {
          $.ajax({
            url: "/api/dataentities/NL/documents/",
            dataType: "json",
            type: "PATCH",
            crossDomain: true,
            data: JSON.stringify(jsonData),
            headers: {
              Accept: "application/vnd.vtex.ds.v10+json",
              "Content-Type": "application/json; charset=utf-8",
            },

            success: function () {
              let success = $("<div>")
                .addClass("success-message")
                .html("Tudo certo! Seu cadastro foi realizado.");
              $(".x-footer__news-form.js--newsletter").append(success);
              cleanInputsFields($nome, $email, $button);
            },
            error: function (err) {
              console.log(err);
            },
          });
        }
      });
    }
  );
}

function shelfQV() {
  let QVfunc = {
    insertEmptySkuMessage: function () {
      if ($('.empty-message').length == 0) {
        let html = $('<div>').addClass('empty-message').html('Primeiro, selecione um tamanho.')
        $('.productQV .productQV__infos-sizes > div').append(html)
      }
    },
    showEmptySkuMessage: function () {
      if ($(".productQV__infos-sizes--size.checked").length < 1 && $('.empty-message').hasClass('js-active') === false) {
        $('.empty-message').addClass('js-active');
      }
    },
    hideEmptySkuMessage: function () {
      if ($('.empty-message').hasClass('js-active')) {
        $('.empty-message').removeClass('js-active');
      }
    }
  };

  const qvdiv = `
  <div class="overlayQV"></div>
  <div class="productQV">
    <a href="javascript:void(0)" class="productQV__close">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M-2647.213,10.135l-3.372-3.372-3.372,3.372a.954.954,0,0,1-1.349,0,.955.955,0,0,1,0-1.348l3.373-3.372-3.372-3.372a.953.953,0,0,1,0-1.348.953.953,0,0,1,1.348,0l3.372,3.372,3.372-3.372a.953.953,0,0,1,1.348,0,.953.953,0,0,1,0,1.348l-3.372,3.372,3.373,3.372a.955.955,0,0,1,0,1.348.951.951,0,0,1-.675.279A.951.951,0,0,1-2647.213,10.135Z" transform="translate(2655.586 -0.414)"/></svg>
    </a>
    <div class="productQV__images">
      <div class="productQV__images-thumbs"></div>
      <div class="productQV__images-big"></div>
    </div>
    <div class="productQV__infos">
      <span class="productQV__infos-name"></span>
      <span class="productQV__infos-price"></span>
      <span class="productQV__infos-sizes">
        <label>tamanho:</label>
        <div></div>
      </span>
    <span class="productQV__infos-colors">
      <label>cores:</label>
      <div></div>
    </span>
    <span class="productQV__infos-options">
      <a href="javascript:void(0)" class="productQV__infos-options--buy">COMPRAR</a>
      <a href="javascript:void(0)" class="productQV__infos-options--more">MAIS DETALHES DO PRODUTO</a>
    </span>
    </div>
  </div>`;

  $(qvdiv).appendTo("body");

  $("body").on("click", ".x-shelf-drop__show-quickshop", function (ev) {
    ev.preventDefault();

    $(".overlayQV").addClass("active");
    $(".productQV").addClass("loading");

    $(".productQV__images > div,.productQV__infos-price,.productQV__infos-sizes div,.productQV__infos-colors div").html("");

    let qvPrice = $(this).parents(".x-product").find(".x-bestPrice").text();
    let qvInstallmentsNumber = $(this).parents(".x-product").find(".x-installment .x-number").text();
    let qvInstallmentsValue = $(this).parents(".x-product").find(".x-installment .x-value").text();
    let quickViewId = $(this).parents(".x-product").find(".js--shelf-add-to-wish").attr("data-id");
    let pqvImages = [];

    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'quickViewProductId': quickViewId
      })
    }

    $.ajax({
      accept: "application/vnd.vtex.ds.v10+json",
      contentType: "application/json; charset=utf-8",
      crossDomain: !0,
      type: "GET",
      url: "/api/catalog_system/pub/products/search/?fq=productId:" + quickViewId,
      success: function (p) {
        for (var i = 0; i < p[0].items.length; i++) {
          // Imagens
          if ($(".productQV__images-big").html() === "") {
            $(".productQV__images-big").append(`<img src="${p[0].items[i].images[0].imageUrl}" />`);
          }

          for (var j = 0; j < p[0].items[i].images.length; j++) {
            var qvImage = `<img ${(j == 0) ? 'class="active"' : ''} src="${p[0].items[i].images[j].imageUrl}" />`;
            if ($(".productQV__images-thumbs img").length < 4 && $(".productQV__images-thumbs img").length < p[0].items[0].images.length) {
              $(".productQV__images-thumbs").append(qvImage);
            }
          }

          var product = p[0];
          let productCategories = product.categories[0].split('/').filter(word => word.trim().length > 0);
          let productCategorie = productCategories[productCategories.length - 1];
          let productBrand = product.brand;

          const sellers = product.items[i].sellers;
          const productSeller = sellers.filter(function(seller) { return seller.sellerDefault === true });

          //Infos
          $(".productQV__infos-name").html(p[0].productName);
          $(".productQV__infos").attr({
            "product-categorie": productCategorie,
            "product-brand": productBrand
          })
          

          var aId = p[0].items[i].itemId;
          var aSize = p[0].items[i].Tamanho[0];
          if (p[0].items[i].sellers[0].commertialOffer.AvailableQuantity > 0) {
            if ($(".productQV__infos-price").html() === "") {
              $(".productQV__infos-price").append(`
                <span data-price="${qvPrice.trim()}">Por: ${qvPrice}</span>
                <i>|</i>
                <span>${qvInstallmentsNumber} de ${qvInstallmentsValue}</span>
              `);
            }

            aOption = '<span class="productQV__infos-sizes--size" product-seller="'+ productSeller[0].sellerId +'" data-availableid="' + aId + '">' + aSize + '</span>';

            if ($(".productQV__infos-colors div").html() === "") {
              var productColorData = p[0].Cor ? p[0].Cor[0] : null;
              var colorAsset = "/arquivos/" + productColorData + ".jpg";
              var newimg;

              newimg = "<a href='javascript:void(0)' class='current-color'><img src=" + colorAsset + " title=" + productColorData + " /></a>";
              if (productColorData) {
                $(".productQV__infos-colors div").append(newimg);
              }
              if (productColorData == "BRANCO") {
                $('.current-color').addClass("white-color");
              }
            }

          } else {
            aOption = '<span class="productQV__infos-sizes--size unavailable" data-availableid="' + aId + '">' + aSize + '</span>';
          }
          $(".productQV__infos-sizes div").append(aOption);
        }

        QVfunc.insertEmptySkuMessage()

        $('.productQV__infos-options--more').attr("href", p[0].link);

        $(".productQV__images-thumbs img")[0].onload = function () {
          $(".productQV").removeClass("loading");
          $(".overlayQV,.productQV").addClass("active");
        }
      }
    });
  });

  $("body").on("click", ".productQV__images-thumbs img", function () {
    $('.productQV__images-thumbs img').removeClass('active')
    $(this).addClass('active')
    var bigUrl = $(this).attr("src");

    $(".productQV__images-big img").attr("src", bigUrl);
  });

  $("body").on("click", ".productQV__infos-sizes--size", function () {
    if (!$(this).hasClass("unavailable")) {
      $(".productQV__infos-sizes--size").removeClass('checked');
      $(this).addClass("checked");
    }
  });

  $("body").on("mouseenter", ".productQV__infos-options--buy", function (e) {
    QVfunc.showEmptySkuMessage()
  });
  $("body").on("mouseleave", ".productQV__infos-options--buy", function (e) {
    QVfunc.hideEmptySkuMessage()
  });

  $("body").on("click", ".productQV__infos-options--buy", function (e) {
    e.preventDefault();

    if ($(".productQV__infos-sizes--size.checked").length) {
      const sellerId = $('.productQV__infos-sizes--size.checked').attr('product-seller');

      var item = {
        id: $(".productQV__infos-sizes--size.checked").attr("data-availableid"),
        quantity: 1,
        seller: sellerId
      };
      let quickViewProductName = $(".productQV__infos-name").text();
      let quickViewProductPrice = $(".productQV__infos-price [data-price]").attr('data-price');
      let quickViewProductCategorie = $(".productQV__infos").attr('product-categorie');
      let quickViewProductBrand = $(".productQV__infos").attr('product-brand');

      vtexjs.checkout.addToCart([item], null, 1)
        .done(function (orderForm) {
          console.log(orderForm);

          $(".overlayQV,.productQV").removeClass("active");
          $(document).trigger('minicart__open');

          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              'event': 'GAEvent',
              'eventCategory': 'HelperAddToCart',
              'eventAction': 'HelperAddToCart_quickview',
              'eventNonInteraction': false,
              'quickViewProductId': item.id,
              'quickViewProductPrice': quickViewProductPrice,
              'quickViewProductName': quickViewProductName,
              'quickViewProductCategorie': quickViewProductCategorie,
              'quickViewProductBrand': quickViewProductBrand
            })
          }

          setTimeout(function () {
            if ($('body').hasClass('is--showing__minicart')) {
              $(document).trigger('header__close');
            }
          }, 2000);
        });
    } else {
      // alert("Escolha o tamanho do produto!");
      // QVfunc.showEmptySkuMessage();
    }
  });

  $("body").on("click", ".overlayQV,.productQV__close", function () {
    $(".overlayQV,.productQV").removeClass("active");
  });
}

function hideLookbookElements() {
  var userURL = window.location;
  var inputFind = document.querySelector("#x-search-input");

  var searchPage = function (nodeItems) {
    var allElements = document.querySelectorAll(nodeItems);

    Object.prototype.removeParent = function (index) {
      var parent = this;

      for (var i = 0; i < index; i++) {
        if (parent.parentNode) {
          parent = parent.parentNode;
        }
      }
      parent.remove();
    };

    allElements.forEach(function (element) {
      console.log(element);
      if (element.textContent.includes("Look")) {
        element.removeParent(5);
      }
    });
  };

  if (userURL.href.includes("busca") && userURL.href.includes("look")) {
    window.location.href = "/Sistema/buscavazia?ft=vazio";
  }

  if (inputFind)
    inputFind.addEventListener(
      "keyup",
      function (e) {
        if (this.value.length > 3) {
          searchPage(
            ".x-search-results-wrapper .x-product-info .x-product-info_name a"
          );
        }
      },
      false
    );
}

function checkURL(e) {
  var breadcrumb = document.querySelectorAll(".bread-crumb ul li a");

  breadcrumb.forEach(function (element, index) {
    element.addEventListener(
      "click",
      function (e) {
        if (element.textContent === "Loja" || element.textContent === "loja") {
          e.preventDefault();
          window.location.href = "/loja?O=OrderByReleaseDateDESC";
        }
      },
      false
    );
  });
}

function floatHeader() {
  $(window).bind("scroll", function () {
    if ($(this).scrollTop() > 1) {
      $(".x-header").addClass("x-header__float");
      $(".mf-category__top").addClass("in--sticky");
      $(document).trigger("menu__close");
    } else {
      $(".x-header").removeClass("x-header__float");
    }
  });
}

var resetMenuImg = function (menuLinks) {

  menuLinks.find('.x-menu__link a').each(function (iLink, link) {
      if ($(link).attr('data-image-item') !== undefined && $(link).attr('data-image-item') !== '') {
          var imageBlocks = menuLinks.find('.x-menu__images');

          imageBlocks.find('.x-menu__image').removeClass('active')
          imageBlocks.find('.x-menu__image[data-image-item=' + $(link).attr('data-image-item') + ']').addClass('active')

          return false;
      }
  })
}

$(".x-header .x-menu .x-menu__links").each(function (i, menuLinks) {
  $(menuLinks)
    .find(".x-menu__link a")
    .each(function (iLink, link) {
      if (
        $(link).attr("data-image-item") !== undefined &&
        $(link).attr("data-image-item") !== ""
      ) {
        var imageBlocks = $(menuLinks).find(".x-menu__images");

        imageBlocks.find(".x-menu__image").removeClass("active");
        imageBlocks
          .find(
            ".x-menu__image[data-image-item=" +
              $(link).attr("data-image-item") +
              "]"
          )
          .addClass("active");

        return false;
      }
    });
});

$(document).on("menu__close", function () {
  $("body").removeClass("is--showing__menu-drop-image");
  $(".js--menu-item").removeClass("is--showing__menu-links");
});

$(document).on("header__close", function () {
  var body = document.querySelector("body");
  body.className = [].filter
    .call(body.classList, function (classe) {
      return /is--showing/.test(classe) === false;
    })
    .join(" ");

  ["search"].forEach(function (selector) {
    $(".js--" + selector + "__toggler").removeClass(
      "js--" + selector + "__closer"
    );
    $(".js--" + selector + "__toggler").addClass(
      "js--" + selector + "__oppener"
    );
  });

});

$(document).on("mouseenter", ".x-banner-main_carousel", function () {
  $(document).trigger("menu__close");
});

$(document).on("mouseenter", ".x-menu__item", function () {
  $(".x-menu__item").not($(this)).removeClass("is--showing__menu-links");
  if (!$(this).hasClass("is--showing__menu-links")) {
    $("body").removeClass("is--showing__menu-drop-image");
  }
});

$(document).on("mouseleave", ".x-header", function () {
  $(document).trigger("header__close");
});

$(".x-header__overlay").hover(function () {
  $(".is--showing__menu-links").removeClass("is--showing__menu-links");
});

$(document).on("menu__open", ".js--menu-item", function () {
  $(document).trigger("header__close");
  $("body").addClass("is--showing__menu-drop-image");
  $(this).addClass("is--showing__menu-links");
  resetMenuImg($(this).find(".x-menu__links"));
});

["search", "header"].forEach(function (selector) {
  $(document).on(selector + "__open", function () {
    $(document).trigger("header__close");
    $("body").addClass("is--showing__" + selector);
    $(".js--" + selector + "__toggler").addClass(
      "js--" + selector + "__closer"
    );
    $(".js--" + selector + "__toggler").removeClass(
      "js--" + selector + "__oppener"
    );
  });

  $(document).on("click", ".js--" + selector + "__oppener", function () {
    $(document).trigger(selector + "__open");
  });

  $(document).on("click", ".js--" + selector + "__closer", function () {
    $(document).trigger("header__close");
  });
});

$(document).on("minicart__open", function () {
  $(document).trigger("header__close");
  $("body").addClass("js--minicart-open");
  $(".js--minicart__toggler").addClass("js--minicart__closer");
  $(".js--minicart__toggler").removeClass("js--minicart__oppener");
});
$(document).on("minicart__close", function () {
  $("body").removeClass("js--minicart-open");
  $(".js--minicart__toggler").removeClass("js--minicart__closer");
  $(".js--minicart__toggler").addClass("js--minicart__oppener");
});

$(document).on("click", ".js--minicart__oppener", function () {
  $(document).trigger("minicart__open");
});

$(document).on("click", ".js--minicart__closer", function () {
  $(document).trigger("minicart__close");
});
$(document).on("click", ".js--header__closer", function () {
  $(document).trigger("minicart__close");
});

$("nav.x-menu").hover(function () {
  if ($(".is--showing__menu-links").length > 0) {
    $("body").addClass("is--showing__menu-drop-image");
  }
});

$(document).one("mouseenter", ".js--menu-item__oppener", function open() {
  $(this).trigger("menu__open");
  $(document).trigger("minicart__close");

  $(document).one("mouseenter", ".js--menu-item__oppener", open);
  $(document).one("mouseleave", ".js--menu-item__closer", function close() {
    $(document).trigger("header__close");

    $(document).one("mouseenter", ".js--menu-item__oppener", open);
  });
});

$(document).on(
  "mouseenter",
  ".x-header .x-menu .x-menu__links .x-menu__link a",
  function () {
    var link = $(this);
    var imageBlocks = link.closest(".x-menu__links").find(".x-menu__images");

    if (
      link.attr("data-image-item") !== undefined &&
      link.attr("data-image-item") !== ""
    ) {
      imageBlocks.find(".x-menu__image").removeClass("active");
      imageBlocks
        .find(
          ".x-menu__image[data-image-item=" + link.attr("data-image-item") + "]"
        )
        .addClass("active");
    } else {
      resetMenuImg(link.closest(".x-menu__links"));
    }
  }
);

let fab = function () {
  let toggleState = null;

  $(".footer-fab--modal-content").attr("style", "opacity: 0; right: -120%;");
  let toggle = function (callback) {
    let time = 400;

    if ($(".footer-fab").hasClass("js--open")) {
      $(".footer-fab--modal-content").animate(
        {
          opacity: 0,
        },
        {
          duration: time,
          easing: "linear",
          done: function () {
            try {
              $(".footer-fab").removeClass("js--open");
              $(".footer-fab--modal-content")[0].style.right = "-120%";

              callback && callback();
            } catch (e) {
              console.error(e);
            }
          },
        }
      );
    } else {
      $(".footer-fab").addClass("js--open");
      $(".footer-fab--modal-content")[0].style.right = 0;
      $(".footer-fab--modal-content").animate(
        {
          right: 60,
          opacity: 1,
        },
        {
          duration: time,
          easing: "linear",
          done: function () {
            try {
              callback && callback();
            } catch (e) {
              console.error(e);
            }
          },
        }
      );
    }
  };

  $(document).on("click", ".footer-fab--button button", function () {
    toggle();
  });
  $(document).on("click", ".footer-fab--modal-close button", function () {
    toggle();
  });

  $(document).on("click", function (event) {
    let content =
      !$(event.target).closest(".footer-fab--modal-content").length &&
      !$(event.target).is(".footer-fab--modal-content");
    let button =
      !$(event.target).closest(".footer-fab--button").length &&
      !$(event.target).is(".footer-fab--button");

    if ($(".footer-fab").hasClass("js--open") && content && button) {
      event.stopPropagation();
      event.preventDefault();
      toggle();
    }
  });

  let fadeTime = 250;
  $(window).scroll(function () {
    if ($(".footer-fab").hasClass("js--open")) {
      if (toggleState === null) {
        toggleState = !toggleState ? 1 : toggleState++;
        toggle(function () {
          $(".footer-fab").fadeOut(fadeTime);
          toggleState = toggleState == 1 ? null : toggleState--;
        });
      }
    } else {
      $(".footer-fab").fadeOut(fadeTime);
    }
    // $(".footer-fab").fadeOut(fadeTime)

    clearTimeout($.data(this, "scrollTimer"));
    $.data(
      this,
      "scrollTimer",
      setTimeout(function () {
        $(".footer-fab").fadeIn(fadeTime);
      }, 450)
    );
  });
};

$(document).ready(function () {
  preHeader_v2();
  checkURL();
  removeHelp();
  formSearch();
  //setFlags();
  goToTop();
  placeholderEmail();
  footerAllIn();
  //   hideLookbookElements();
  floatHeader();
  fab();
  shelfQV();
});

$(window).on("session.done", () => {
  login();
});

$(document).ajaxStop(function () {
  removeHelp();
  //setFlags();
});
