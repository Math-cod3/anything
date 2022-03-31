if($("body").hasClass("lookbook")){
$(function(){
    var page  = {
        init: function(){
            for(var i in this.features){
                if( this.features.hasOwnProperty(i) ){
                    if( this.features[i].call ){
                        this.features[i].call(this.features);
                    }
                }
            }
        },
        
        features: {

            resizeImage: function() {
                $('.x-lookbook__main-img .thumbs img').each(function(index, el) {
                    var _element = $(this);
                    var _attr = _element.attr("src").replace("800-950", "1000-1500");
                    _element.attr("src", _attr);
                });
            },
            
            slide: function(){
                $('.thumbs').slick({arrows:false});
            },
            
            slideShelfs: function(){
                $('.x-lookbook__suggestions-shelfs ul').slick({
                    slidesToShow: 3
                });
            },
            
            initLook: function(){
                /*
                    adds a property into the lookbookApp
                    if it's a function it's going to be called automatically when page is ready
                    @params
                        keyName = string
                        property value = function, object, string, number
                */
                LookbookApp.addProperty('getShelfById', function(){
                    var _this = this;
                    var ids = [];

                    $('.js--get-look-ids .js--look-item-id').each(function(){
                        ids.push( $(this).val() );
                    });

                    LookbookApp.addProperty('relatedIds', ids);

                    /*
                        request all HTML data for the products ids passed by arguments into a array
                        @params
                            arrayIds = array - Array with products ids
                        @return
                            jQuery Promise
                    */
                    _this.helper.getHMTLShelf(ids)
                        .then(function(html){
                            $('.js--lookbook-related-warpper').html(html);

                            var relateds = LookbookApp.getProperty('relatedIds') || [];

                            _this.helper.getProductsById(relateds)
                                .then(function(data){
                                    if( !Array.isArray(data) ) return;

                                    // building sku buttons
                                    var productInfos = data.map(function(item){
                                        var newInfo = {};
                                        newInfo[item.productId] = {};

                                        item.items.forEach(function(sku){
                                            var store = newInfo[item.productId];
                                            store[sku.itemId] = {};
                                            store[sku.itemId]['variations'] = {};
                                            store[sku.itemId]['variations']["avaiable"] = sku.sellers[0].commertialOffer.AvailableQuantity > 0;
                                            store[sku.itemId]['variations']["price"] = sku.sellers[0].commertialOffer.Price;

                                            if( sku["variations"] ){
                                                sku["variations"].forEach(function(variation){
                                                    store[sku.itemId]['variations'][variation] = sku[variation][0];
                                                });
                                            }
                                        });

                                        return newInfo;
                                    }).forEach(function(skuInfo){
                                        var $div = $('<div>').addClass('x-look-picklist__skus');
                                        
                                        $div.append('<span>Tamanho</span>');

                                        for( var productId in skuInfo ){
                                            if( !skuInfo.hasOwnProperty(productId) ) continue;

                                            for( var skuId in skuInfo[productId] ){
                                                var allSkus = skuInfo[productId];
                                                
                                                if( !allSkus.hasOwnProperty(skuId) ) continue;

                                                $div.append(
                                                    $('<label class="item-avaiable-' + allSkus[skuId].variations.avaiable + '">')
                                                        .append( $('<input class="js--input-size-look" type="radio" name="prod'+productId+'" data-product-id="'+productId+'" data-price="'+allSkus[skuId].variations.price+'"/>').val(skuId))
                                                        .append(
                                                            $('<span>').append( $('<span>').text( allSkus[skuId].variations.Tamanho || '' ) )
                                                        )
                                                );
                                            }
                                        }

                                        $('.js--look-id[value="'+ productId +'"]')
                                            .closest('li')
                                            .find('.js--look-picklist-variations')
                                            .append($div);
                                    });

                                    LookbookApp.complete();
                                });
                        });

                    });
                
                LookbookApp.init();
            }
        }
    };
    
    page.init();
});
}