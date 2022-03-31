if($("body").hasClass("lookbook")){
$(function(){
    var looks  = {
        init: function(){
            for(var i in this.features){
                if( this.features.hasOwnProperty(i) ){
                    if( this.features[i].call ){
                        this.features[i].call(this.features);
                    }
                }
            }
        },
        
        addProperty: function(name, func){
            this.features[name] = func;
        },
        
        getProperty: function(name){
            return this.features[name];
        },
        
        complete: function(){
            $('.x-lookbook__loading').addClass('is--loaded');
        },
        
        features: {
            helper:{
                getProductsById: function(arrayProdsIds){
                    var productIdLongString = this.getURLProductData(arrayProdsIds);
                    return $.ajax('/api/catalog_system/pub/products/search/?' + productIdLongString);
                },
                
                getHMTLShelf: function(arrayProdsIds){
                    var productIdLongString = this.getURLProductData(arrayProdsIds);
                    var numProducts = arrayProdsIds.length;
                    var shelfID = 'eb10aad8-fb37-4946-b41f-1a47f75b2044';
                    
                    return $.ajax('/buscapagina?'+productIdLongString+'&PS='+numProducts+'&sl='+shelfID+'&cc=100&sm=0&PageNumber=1');
                },
                
                getURLProductData: function(arrayProdsIds){
                    var arrIds = arrayProdsIds;
                    return arrIds.map(function(content){ 
                        return $.trim(content)
                    }).map(function(content){
                        return "fq=productId:"+content
                    }).join('&');
                },
                
                toCurrency: function (_float) {
                    var s = _float.toString().replace(',', '').split('.'),
                        decimals = s[1] || '',
                        integer_array = s[0].split(''),
                        formatted_array = [];

                    for (var i = integer_array.length, c = 0; i != 0; i--, c++) {
                        if (c % 3 == 0 && c != 0) {
                            formatted_array[formatted_array.length] = '.';
                        }
                        formatted_array[formatted_array.length] = integer_array[i - 1];
                    }

                    if (decimals.length == 1) {
                        decimals = decimals + '0';
                    } else if (decimals.length == 0) {
                        decimals = '00';
                    } else if (decimals.length > 2) {
                        decimals = Math.floor(parseInt(decimals, 10) / Math.pow(10, decimals.length - 2)).toString();
                    }

                    return 'R$ ' + formatted_array.reverse().join('') + ',' + decimals;
                }
            },
            
            pickingSku: function(){
                var _this = this;
                
                $('body').on('change', '.js--input-size-look, .js--look-picklist-checkbox',function(){
                    if (Array.from(this.closest('.x-look-picklist__info').querySelectorAll('.js--input-size-look')).filter(function (input) {
                        return input.checked === true;
                    }).length === 0) {
                        $(this).prop('checked', false);
                        return alert('selecione um tamanho');
                    } else {
                        $('.js--look-picklist-checkbox[value="'+ $(this).data('product-id') +'"]').prop('checked', true);

                        var total = 0;
                    
                        $('.js--input-size-look:checked').each(function(){
                            var price = $(this).data('price');
                            price = window.parseFloat(price, 10);
                            var checked = $(this).closest('.x-look-picklist__info').find('.js--look-picklist-checkbox').is(':checked');
                            if(checked){
                                total += price;
                            }
                        });
                        
                        var finalPrice = _this.helper.toCurrency(total);
                        $('.js--look-picklist-total').text(finalPrice);
                    }
                });
            },
            
            buying: function(){
                $('body').on('submit', '.js--look-picklist-form', function(e){
                    e.preventDefault();
                    var $form = $(this);
                    $form.find('.js--look-picklist-add').text('adicionando...');
                    
                    var values = $form.serializeArray();
                    values = values.map(function(current, i, original){
                        if( current.name === "picked" ){
                            var filtered = original.filter(function(item){
                                return item.name === "prod"+current.value
                            });
                            
                            if( Array.isArray(filtered) ){
                                return filtered[0];
                            }
                        }
                    }).map(function(item){
                        if( item ){
                            return item.value;
                        }
                    }).filter(function(item){
                        return item;
                    });
                    
                    if( values.length ){
                        var productsToAdd = [];
                        
                        values.forEach(function(item){
                            var skuAPIobj = {}
                            skuAPIobj.id= item;
                            skuAPIobj.quantity= 1;
                            skuAPIobj.seller= 1;
                            
                            productsToAdd.push(skuAPIobj);
                        });
                        
                        vtexjs.checkout.addToCart(productsToAdd)
                            .fail(function(){
                                $form.find('.js--look-picklist-add').addClass('is--error').text('Tente novamente');
                            })
                            .done(function(){
                                jQuery.vtex_quick_cart(options);
                                $form.find('.js--look-picklist-add').addClass('is--added').html('Produtos adicionados.<br/>Ir para o carrinho >>');
                            });
                    }
                    else{
                        alert('Por favor: Selecione um ou mais modelos');
                        $form.find('.js--look-picklist-add').addClass('is--error').text('Selecione o tamanho');
                    }
                    return false;
                });
            },
            
            goToCart: function(){
                $('body').on('click', '.js--look-picklist-add', function(){
                    if( $(this).hasClass('is--added') ){
                        $(this).text('Aguarde...');
                        window.location.href = "/checkout";
                        
                        return false;
                    }
                });
            }
        }
    };
    
    window.LookbookApp = looks;
});
}