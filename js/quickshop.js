export function quickShop(productData) {
    if (window.innerWidth < 640 || window.innerHeight < 480) {
        window.location.href = productData.link;
    } else {

        console.log(productData);
        let QSfunc = {
            insertEmptySkuMessage: function () {
                if ($('.empty-message').length == 0) {
                    let html = $('<div>').addClass('empty-message').html('Primeiro, selecione um tamanho.')
                    $('.productQS .productQS__infos-sizes > div').append(html)
                }
            },
            showEmptySkuMessage: function () {
                if ($(".productQS__infos-sizes--size.checked").length < 1 && $('.empty-message').hasClass('js-active') === false) {
                    $('.empty-message').addClass('js-active');
                }
            },
            hideEmptySkuMessage: function () {
                if ($('.empty-message').hasClass('js-active')) {
                    $('.empty-message').removeClass('js-active');
                }
            }

        };



        const qsdiv = `
    <div class="productQS">
        <a href="javascript:void(0)" class="productQS__close">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><path d="M-2647.213,10.135l-3.372-3.372-3.372,3.372a.954.954,0,0,1-1.349,0,.955.955,0,0,1,0-1.348l3.373-3.372-3.372-3.372a.953.953,0,0,1,0-1.348.953.953,0,0,1,1.348,0l3.372,3.372,3.372-3.372a.953.953,0,0,1,1.348,0,.953.953,0,0,1,0,1.348l-3.372,3.372,3.373,3.372a.955.955,0,0,1,0,1.348.951.951,0,0,1-.675.279A.951.951,0,0,1-2647.213,10.135Z" transform="translate(2655.586 -0.414)"/></svg>
        </a>
        <div class="productQS__images">
        <div class="productQS__images-thumbs"></div>
        <div class="productQS__images-big"></div>
        </div>
        <div class="productQS__infos">
        <span class="productQS__infos-name"></span>
        <span class="productQS__infos-price"></span>
        <span class="productQS__infos-sizes">
            <label>tamanho:</label>
            <div></div>
        </span>
        <span class="productQS__infos-colors">
        <label>cor:</label>
        <div></div>
        </span>
        <span class="productQS__infos-options">
        <a href="#" class="productQS__infos-options--buy">
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.74554 4.91683V2.5835C6.74554 2.00016 7.09554 0.833496 8.49554 0.833496" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M10.2455 4.91683V2.5835C10.2455 2.00016 9.89554 0.833496 8.49554 0.833496" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M5.40504 3.4C4.56768 3.4 3.87195 4.04564 3.8095 4.88068L3.31092 11.5473C3.24152 12.4754 3.9758 13.2667 4.90647 13.2667H12.0846C13.0153 13.2667 13.7496 12.4754 13.6802 11.5473L13.1816 4.88068C13.1192 4.04564 12.4234 3.4 11.5861 3.4H5.40504Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        ADICIONAR À SACOLA</a>
        <a href="${productData.link}" class="productQS__infos-options--more">Ver página do produto</a>
        </span>
        </div>
    </div>`;

        $(qsdiv).insertAfter(".product-suggestion");


        $("body").on("click", ".linkCTA", function (ev) {

            $(qsdiv).slideDown("slow", function () {

            });
            // $(".overlayQV").addClass("active");
            $(".product-suggestion").css('display', 'none');
            $(".productQS").addClass("loading");


            $(".productQS__images > div,.productQS__infos-price,.productQS__infos-sizes div,.productQS__infos-colors div").html("");

            let qsPrice = productData.items[0].sellers[0].commertialOffer.Price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            let qsInstallmentsNumber = productData.items[0].sellers[0].commertialOffer.Installments[9].Value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            let listprice = productData.items[0].sellers[0].commertialOffer.ListPrice.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            let qsInstallmentsValue = productData.items[0].sellers[0].commertialOffer.Installments[9].NumberOfInstallments;
            let quickViewId = $(this).parents(".x-product").find(".js--shelf-add-to-wish").attr("data-id");
            let pqvImages = [];


            for (var i = 0; i < productData.items.length; i++) {
                // Imagens
                if ($(".productQS__images-big").html() === "") {
                    $(".productQS__images-big").append(`<img src="${productData.items[i].images[0].imageUrl}" />`);
                }

                for (var j = 0; j < productData.items[i].images.length; j++) {
                    var qsImage = `<img ${(j == 0) ? 'class="active"' : ''} src="${productData.items[i].images[j].imageUrl}" />`;
                    if ($(".productQS__images-thumbs img").length < 4 && $(".productQS__images-thumbs img").length < productData.items[0].images.length) {
                        $(".productQS__images-thumbs").append(qsImage);
                    }
                }

                var product = productData;
                let productCategories = product.categories[0].split('/').filter(word => word.trim().length > 0);
                let productCategorie = productCategories[productCategories.length - 1];
                let productBrand = product.brand;

                const sellers = product.items[i].sellers;
                const productSeller = sellers.filter(function (seller) {
                    return seller.sellerDefault === true
                });

                //Infos
                $(".productQS__infos-name").html(productData.productName);
                $(".productQS__infos").attr({
                    "product-categorie": productCategorie,
                    "product-brand": productBrand
                })

                if (qsPrice === listprice) {
                    listprice = '';
                }

                var aId = productData.items[i].itemId;
                var aSize = productData.items[i].Tamanho[0];
                if (productData.items[i].sellers[0].commertialOffer.AvailableQuantity > 0) {
                    if ($(".productQS__infos-price").html() === "") {
                        $(".productQS__infos-price").append(`
      <span class="listPrice">${listprice}</span>
      <span data-price="${qsPrice}">${qsPrice}</span>
      <i>|</i>
      <span>${qsInstallmentsValue}X  DE  ${qsInstallmentsNumber}</span>
    `);
                    }

                    var aOption = '<span class="productQS__infos-sizes--size" product-seller="' + productSeller[0].sellerId + '" data-availableid="' + aId + '">' + aSize + '</span>';

                    if ($(".productQS__infos-colors div").html() === "") {
                        var productColorData = productData.Cor ? productData.Cor[0] : null;
                        var colorAsset = "/arquivos/" + productColorData + ".jpg";
                        var newimg;

                        newimg = "<a href='javascript:void(0)' class='current-color'><img src=" + colorAsset + " title=" + productColorData + " /></a>";
                        if (productColorData) {
                            $(".productQS__infos-colors div").append(newimg);
                        }
                        if (productColorData == "BRANCO") {
                            $('.current-color').addClass("white-color");
                        }
                    }

                } else {
                    aOption = '<span class="productQS__infos-sizes--size unavailable" data-availableid="' + aId + '">' + aSize + '</span>';
                }
                $(".productQS__infos-sizes div").append(aOption);
            }

            QSfunc.insertEmptySkuMessage()

            $('.productQS__infos-options--more').attr("href", productData.link);

            $(".productQS__images-thumbs img")[0].onload = function () {
                $(".productQS").removeClass("loading");
                $(".overlayQS,.productQS").addClass("active");
            }


        });

        $("body").on("click", ".productQS__images-thumbs img", function () {
            $('.productQS__images-thumbs img').removeClass('active')
            $(this).addClass('active')
            var bigUrl = $(this).attr("src");

            $(".productQS__images-big img").attr("src", bigUrl);
        });

        $("body").on("click", ".productQS__infos-sizes--size", function () {
            if (!$(this).hasClass("unavailable")) {
                $(".productQS__infos-sizes--size").removeClass('checked');
                $(this).addClass("checked");
            }
        });

        $("body").on("mouseenter", ".productQS__infos-options--buy", function (e) {
            QSfunc.showEmptySkuMessage()
        });
        $("body").on("mouseleave", ".productQS__infos-options--buy", function (e) {
            QSfunc.hideEmptySkuMessage()
        });

        $('.productQS__close').click(function () {
            if ($(".productQS").hasClass('active')) {
                $('.productQS').animate({
                    opacity: ["toggle", "linear"],

                    // height: 30
                }, 1500, "linear", function () {
                    $(".productQS").css('heigth', 0);
                    $(".productQS").css('opacity', 0);
                    $(".productQS").css('display', 'none');
                    $('.product-suggestion-container').css('height', 0);
                    $('.product-suggestion-container').css('display', 'none');
                });
            }


            // $(".productQS").css('display', 'none');
            // $('.product-suggestion-container').css('display', 'none');
        });

        $("body").on("click", ".productQS__infos-options--buy", function (e) {
            e.preventDefault();

            if ($(".productQS__infos-sizes--size.checked").length) {
                const sellerId = $('.productQS__infos-sizes--size.checked').attr('product-seller');

                var item = {
                    id: $(".productQS__infos-sizes--size.checked").attr("data-availableid"),
                    quantity: 1,
                    seller: sellerId
                };
                let quickViewProductName = $(".productQS__infos-name").text();
                let quickViewProductPrice = $(".productQS__infos-price [data-price]").attr('data-price');
                let quickViewProductCategorie = $(".productQS__infos").attr('product-categorie');
                let quickViewProductBrand = $(".productQS__infos").attr('product-brand');

                vtexjs.checkout.addToCart([item], null, 1)
                    .done(function (orderForm) {
                        console.log(orderForm);

                        // $(".overlayQV,.productQV").removeClass("active");
                        const FeedbackSucess = `<div class="addToCartFeedback">
                    Produto adicionado à sacola 
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26 7.6001L12 24.4001L5 16.0001" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    `;
                        $(".product-suggestion-container").css('display', 'none');
                        $('body').append(FeedbackSucess);
                        setTimeout(function () {
                            $('.addToCartFeedback').css('display', 'none')
                        }, 2500);

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

                    });
            } else {
                // alert("Escolha o tamanho do produto!");
                // QVfunc.showEmptySkuMessage();
            }
        });
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////