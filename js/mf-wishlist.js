var headers = {
    'Accept': 'application/vnd.vtex.ds.v10+json',
    'Content-Type': 'application/json'
};

var isWishListPage = $('body').hasClass('wishlist');
var documentClientId = '';
var wishlistStoreName = 'mariafilo';

function onWishListEmpty(){
    $('body').addClass('x-active');
    $('.x-wishlist-list, .js--wishlist-shelfs').empty();
    $('.x-wrap-center-content__message').show();
    $('.x-wishlist-page__not-found').show();
}

// eventos nos botoes wishlist
function wishlist() {
    $('body').on('click', '.js--shelf-add-to-wish', function() {
        var id = $(this).data('id');
        if( !id ) return false;
        
        $(this).addClass('x-loading');
        var elemento = $(this);
        saveOnWishlist(elemento, id);
        
        return false;
    });
    
    $('.x-productPage__callToAction .x-add-it-to-wishlist, .x-look-picklist__wishlist').on('click', function() {
        if( !skuJson ) return false;
        
        $(this).addClass('x-loading');
        var elemento = $(this);
        var id= skuJson.productId;
        saveOnWishlist(elemento, id);
        
        return false;
    });
};


function saveOnWishlist(elemento, idProduto){
    var $this = elemento;
    var wishlistID = idProduto;

    $.ajax({
        type: 'GET',
        url: '/no-cache/profileSystem/getProfile',

        success: function(data) {
            var userEmail = data.Email;

            if (data.IsUserDefined == false) {
                vtexid.start({
                    returnUrl: '',
                    userEmail: '',
                    locale: 'pt-BR',
                    forceReload: false
                });

            } else {

                if (data.IsUserDefined == true && data.FirstName == null) {
                    $('#x-userEmail').val(userEmail);
                    $('#x-cadastro-user').show();
                } else {

                    addProductWishlist.apply($this, [wishlistID, userEmail]);

                    if ( $.cookie("wishlist") == undefined || $.cookie("wishlist") == 'undefined') {
                        $.cookie("wishlist", wishlistID, {
                            path: "/",
                            expires: 1
                        });
                    } else {
                        var oldCookie = $.cookie("wishlist").split(/,/);
                        
                        if( oldCookie.indexOf( wishlistID ) != -1){
                            var wishlistIDs = $.cookie("wishlist") + "," + wishlistID;
                        }else{
                            var wishlistIDs = oldCookie.remove(wishlistID);
                            wishlistIDs = ''.concat(wishlistIDs);
                        }

                        $.cookie("wishlist", wishlistIDs, {
                            path: "/",
                            expires: 1
                        });
                    };

                    wishlistSelectedsCookie();

                };

            };

        },

        error: function(data) {
            console.log(data);
            console.log("Ops, ocorreu um erro.");
        }
    });
}


function addProductWishlist(id_produto, userEmail) {
    $(this).each(function() {
        var $elem = $(this);
        var elemAdded = true;
        var jsonWishlist = {
            "userId": userEmail,
            "productsList": ''
        };
        var getUserId = '';
        var idWishList = '';

        $.ajax({
            headers: headers,
            type: 'GET',
            url: /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+'/ */ '/api/dataentities/CL/search?_where=email=' + userEmail +'&_fields=id',

            success: function(data) {
                if( $(data).length ){
                    getUserId = data[0].id;

                    $.ajax({
                        headers: headers,
                        type: 'GET',
                        url: /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+ */ '/api/dataentities/WL/search?_where=userId=' + getUserId + '&_fields=id,productsList',

                        success: function(response) {
                            if( response[0] ){
                                var oldList = response[0].productsList;
                                if( oldList ){
                                    if( oldList.indexOf(',') != -1 ){
                                        oldList = oldList.split(/,/);
                                    }
                                }
                                idWishList = response[0].id;
                            }

                            // verificando se o produto ja esta na wishlist
                            if( oldList ){
                                var indexElem = oldList.indexOf(id_produto.toString());
                                if( indexElem == -1 ){
                                    jsonWishlist.productsList = oldList + ',' + id_produto;
                                }
                                else{
                                    if( Array.isArray(oldList) ){
                                        oldList.remove(id_produto.toString());
                                        jsonWishlist.productsList = ''.concat(oldList);
                                    } else{
                                        jsonWishlist.productsList = '';
                                    }

                                    elemAdded = false;
                                }
                            } else{
                                jsonWishlist.productsList = id_produto;
                            }

                            saveNewProductIdList();
                        }
                    });
                }
            },

            error: function(data) {
                console.log(data);
            }
        });

        function saveNewProductIdList(){
            var urlWishlist = /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+ */ '/api/dataentities/WL/documents/'+idWishList;
            $.ajax({
                headers: headers,
                data: JSON.stringify(jsonWishlist),
                type: 'PATCH',
                url: urlWishlist,
                success: function(data) {
                    console.log("Produto adicionado a wishlist!");
                    console.log("ID WishList: ", idWishList);
                    console.log("Element: ", $elem);
                    $elem.removeClass('x-loading');

                    if( elemAdded ){
                        $elem.addClass('x-active');
                    }else{
                        $elem.removeClass('x-active');
                    }
                    wishlistSelecteds();
                },

                error: function(data) {
                    console.log(data);
                    console.log("Ops, ocorreu um erro.");
                }

            });
        }

    });

};

function wishlistSelecteds() {
    $.ajax({
        type: 'GET',
        url: '/no-cache/profileSystem/getProfile',

        success: function(userInfoData) {
            var userEmail = userInfoData.Email;
            if (userInfoData.IsUserDefined == true) {
                if (userInfoData.IsUserDefined == true && userInfoData.FirstName != null) {
                    $.ajax({
                        headers: headers,
                        type: 'GET',
                        url: /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+ */ '/api/dataentities/CL/search?_where=email=' + userEmail +'&_fields=id',

                        success: function(data) {
                            if ($(data).length) {
                                var idUser = data[0].id;
                                documentClientId = data[0].id;

                                $.ajax({
                                    headers: headers,
                                    type: 'GET',
                                    url: /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+' */ '/api/dataentities/WL/search?_where=userId=' + idUser + '&_fields=id,productsList',

                                    success: function(lisData) {                                        
                                        if ( $(lisData).length && lisData[0].productsList ) {
                                            var product_id = lisData[0].productsList.split(/,/g);
                                            console.log('Products ID: ', product_id);

                                            if( product_id[0] ){
                                                var numWish = product_id.length;
                                                var productIdLongString = product_id.filter(function(id){
                                                    return $.trim(id);
                                                }).map(function(id){
                                                     return 'fq=productId:'+id
                                                }).join('&');

                                                if ( isWishListPage ) {
                                                    var shelfID = $(window).width() > 760 ? '4a258ce9-136f-46aa-9925-ed1081dfe366' : '4a258ce9-136f-46aa-9925-ed1081dfe366';
                                                    $.ajax('/buscapagina?'+productIdLongString+'&PS='+numWish+'&sl='+shelfID+'&cc=100&sm=0&PageNumber=1', {async:false})
                                                    .done(function(data){
                                                        $('.js--wishlist-shelfs').html(data);
                                                        $('body').addClass('x-active');
                                                    }).fail(function(){
                                                        onWishListEmpty();
                                                    })
                                                }                                                
                                                setTimeout(function(){
                                                    for (var i = 0; i < product_id.length; i++) {
                                                        setWishedProducts(product_id[i]);
                                                    };
                                                }, 100);

                                            } else{
                                                onWishListEmpty();
                                            }
                                        }
                                        else{
                                            onWishListEmpty();
                                        }

                                        
                                    },

                                    error: function(data) {
                                        console.log(data);
                                    }
                                });

                            };

                        },

                        error: function(data) {
                            console.log(data);
                        }

                    });
                };
            };
        },

        error: function(data) {
            console.log("Ops, ocorreu um erro.");
            console.log("Error: ", data);
        }
    });
};

function wishlistSelectedsCookie() {
    if ($.cookie("wishlist") != undefined) {
        var wishlistCookie = $.cookie("wishlist").split(",");

        for (var i = 0; i < wishlistCookie.length; i++) {
            var product = wishlistCookie[i];
            setWishedProducts(product);
        };
    };
};

function setWishedProducts(productID){
    $('.js--shelf-add-to-wish').each(function() {
        var id = $(this).data('id');

        if (id == productID) {
            $(this).addClass("x-active");
        }
    });
    
    $('.x-productPage__callToAction .x-add-it-to-wishlist').each(function() {
        var id = skuJson_0.productId;

        if (id == productID) {
            $(this).addClass("x-active");
        }
    });
}

function deleteItemWishlist() {
    $('body').on('click', '.x-wishlist-delete', function(event) {
        var element = $(this).closest('li');
        var id_document = element.data("document");
        var id = element.data('id').toString();

        $.ajax({
            headers: headers,
            type: 'GET',
            url: /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+' */ '/api/dataentities/WL/search?_where=id=' + id_document + '&_fields=userId,productsList',

            success: function(data) {
                var list = data[0].productsList.split(/,/g);
                var index = list.indexOf(id);
                list.splice(index, 1);
                
                if( list.length ){
                    if( list[0] ){
                        list = list.join(',');
                    }else{
                        list = ',';
                    }
                }else{
                    list = ',';
                }

                var newList = {
                    "productsList": list
                };

                var urlWishlist = /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+ */ '/api/dataentities/WL/documents/'+id_document;

                $.ajax({
                    headers: headers,
                    data: JSON.stringify(newList),
                    type: 'PATCH',
                    url: urlWishlist,
                    success: function(data) {
                        $(element).slideUp(300, function(){
                            element.remove();
                        });
                        $.cookie("wishlist", "");
                    },

                    error: function(data) {
                        console.log(data);
                        console.log("Ops, ocorreu um erro.");
                    }

                });
            },

            error: function(data) {
                console.log(data);
            }
        });

        return false;

    });
};

function formSaveUserActions() {
    $('div.x-cadastro-user').on('click', '.x-close, .x-not',function() {
        $('#x-cadastro-user').hide();
    });
};

function saveUserWishlist() {
    $('div.x-cadastro-user div.x-form form').on('submit', function() {
        var _this = $(this);
        $(this).find('input.x-next').val('adicionando...');

        var jsonSaveUser = {
            "email": $('#x-userEmail').val(),
            "firstName": $('#x-userName').val(),
            "lastName": $('#x-userLastName').val(),
            "document": $('#x-userDocument').val(),
            "homePhone": "+55" + $('#x-ddd-cel').val() + $('#x-number-cel').val()
        };

        var urlSaveUser = /* 'https://api.vtexcrm.com.br/'+wishlistStoreName+ */ '/api/dataentities/CL/documents/';

        $.ajax({
            headers: headers,
            data: JSON.stringify(jsonSaveUser),
            type: 'PATCH',
            url: urlSaveUser,
            success: function(data) {
                $('#x-cadastro-user .x-form').html('<div class="x-sucesso">Cadastro feito com sucesso, escolha seus produtos.</div>');

                setTimeout(function() {
                    $('#x-cadastro-user').hide();
                }, 3000);

            },

            error: function(data) {
                _this.find('input.x-next').val('Ops! tente novamente');
            }
        });

        return false;
    });
};

$(document).ready(function(){
    wishlist();
    wishlistSelecteds();
    wishlistSelectedsCookie();
    formSaveUserActions();
    saveUserWishlist();
    deleteItemWishlist();
});