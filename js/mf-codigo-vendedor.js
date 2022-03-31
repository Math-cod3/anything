require("../scss/_mf-codigo-vendedor.scss");

var settings = {
    'utmiCampaign': 'VendMF',
    'entitiId': 'VD'
}

vtexjs.checkout.getOrderForm().then(function (orderForm) {
    $('#seller-code').remove()
    if (orderForm.items.length > 0) {
        $('.summary-totalizers.pull-right').find('.coupon.summary-coupon').before(
            $('<div>', { 'id': 'seller-code' }).append(
                $('<div>', { 'class': 'form-seller-code' }).append(
                    $('<p>', { 'class': 'label-seller-code', 'text': 'vendedor(a)' })
                ).append(
                    $('<div>', { 'class': 'content-seller-code' }).append(
                        $('<input>', { 'name': 'seller-code', 'class': 'seller-code' })
                    )
                    .append(
                        $('<button>', { 'class': 'btn', 'text': 'OK' })
                    )
                )
                .append(
                    $('<div>', { 'class': 'seller-code-error', 'text': 'Atenção: código inativo ou inválido. Por favor, tente outro código' })
                )
            ).append(
                $('<div>', { 'class': 'seller-code-active' }).append(
                    $('<p>', { 'class': 'label-seller-code', 'text': 'Vendedor(a)' })
                ).append(
                    $('<a>', { 'class': 'btn remove-seller-code', 'text': '' }).append(
                        $('<span>', { 'class': 'label-seller-name' })
                    ).append(
                        $('<i>', { 'class': 'icon-remove' })
                    )
                )
            )
        )

        var buscaSellerCode = function (code) {
            
            $('.seller-code-error').removeClass('error');
            
            $.ajax({
                url: '/api/dataentities/'+settings.entitiId+'/search/?_fields=id,cod,name,ativo&cod=' + code,
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

                        if(newMarketingData == null) {
                            newMarketingData = {
                                'utmiCampaign': settings.utmiCampaign
                            }
                        } else {
                            newMarketingData.utmiCampaign = settings.utmiCampaign;
                        }

                        vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
                            vtexjs.checkout.sendAttachment('openTextField', { 'value': 'vendedor: ' + data[0].name + ' codigo: ' + data[0].cod }).done(function () {
                                localStorage.setItem('sellerInfo', JSON.stringify(data[0]))
                                applySellerInfo();
                            })
                        });

                    })
                } else {
                    $('.seller-code-error').addClass('error');
                }
            })
        }

        var applySellerInfo = function() {
            var sellerInfo = JSON.parse(localStorage.getItem('sellerInfo'));
            if(sellerInfo.name === "" || sellerInfo.name === "null" || sellerInfo.name === undefined){
                $('#seller-code .label-seller-name').text(sellerInfo.cod);
            }
            else{
                $('#seller-code .label-seller-name').text(sellerInfo.name);
            }
            $('#seller-code').addClass('active')

            removeSellerInfo();
        }

        var removeSellerInfo = function() {
            $('#seller-code .remove-seller-code').on('click', function (e) {
                e.preventDefault()
                localStorage.removeItem('sellerInfo');
                $('#seller-code').removeClass('active');
                $('.seller-code-error').removeClass('error');

                vtexjs.checkout.getOrderForm().then(function (orderForm) {
                    var newMarketingData = orderForm.marketingData;

                    newMarketingData.utmiCampaign = 'SemVendedor';

                    vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
                        vtexjs.checkout.sendAttachment('openTextField', { 'value': null }).done(function () {
                            localStorage.removeItem('sellerInfo');
                        })
                    });
                });
            })
        }


        if (localStorage.getItem('sellerInfo')) {
            applySellerInfo();
        }


        $('#seller-code button').on('click', function (e) {
            e.preventDefault()
            var valueCode = $('#seller-code .seller-code').val();
            console.log(valueCode);
            if (valueCode != '') {
                buscaSellerCode(valueCode);
            }
        })
    }


    if (vtexjs.checkout.orderForm.items.length == 0) {
        $('#seller-code').hide()
    } else {
        $('#seller-code').show()
    }
    return orderForm;

}).done(function (orderForm) {})