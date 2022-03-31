function setSearchTerm(){
	let myUrl = window.location.href;
	let mySearchTerm = myUrl.split(/\=/)[1];
	$("main.x-content > h2 > span").html(mySearchTerm);
}

function research(){
	$("main.x-content form button").click(function(ev){
		ev.preventDefault();
		var newSearch = "/"+$("main.x-content form input").val();
		if(newSearch === '/'){
			alert("Preencha o campo para realizar uma nova busca.");
		}
		else{
			window.location = newSearch;
		}
	});
}

function svgSuggestion(){

	$(".searchSuggestions span a").each(function(){
		var newBtn = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.459" viewBox="0 0 11 11.459"><defs><style>.a{fill:none;stroke:#ac9c88;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M857.722,8.139,861,11.459ZM851,4.984a3.935,3.935,0,1,1,7.869,0,3.935,3.935,0,1,1-7.869,0Z" transform="translate(-850.5 -0.5)"/></svg>'+$(this).text();
		$(this).html(newBtn);
	});

}

function shelfUser(){
	$(".prateleira ul").slick({
		slidesToShow:4,
		arrows:true
	})
}

function topSix(){
	$(".shelfqs li:not('.searchShelf__item')").remove();

	$(".shelfqs .searchShelf__item").each(function(){
		var prodId = $(this).attr("product-id");

		$.ajax({
		  accept: "application/vnd.vtex.ds.v10+json",
		  contentType: "application/json; charset=utf-8",
		  crossDomain: !0,
		  type: "GET",
		  url: "/api/catalog_system/pub/products/search/?fq=productId:"+prodId,
		  success: function(p) {
		  	console.log("product",p[0]);

		  	for(var i = 0; i < p[0].items.length; i++){

		  		var availableClass = 'availableSize';

			  	if(!p[0].items[i].sellers[0].commertialOffer.AvailableQuantity > 0){
			  		availableClass = 'unavailableSize';
			  	}

			  	var aId = p[0].items[i].itemId;
			  	var aSize = p[0].items[i].Tamanho[0];
			  	var aOption = '<span class="'+availableClass+'" data-availableid="'+aId+'">'+aSize+'</span>';
			  	$(".searchShelf__item[product-id='"+prodId+"'] .searchShelf__item-quickshop--skus").append(aOption);

		  	}

		  }
		});
	});

	$("body").on("click",".searchShelf__item-quickshop--skus .availableSize",function(ev){
		ev.preventDefault();
		$(this).parents(".searchShelf__item-quickshop--skus").find("span").removeClass("checked");
		$(this).addClass("checked");
	});

	$("body").on("click",".searchShelf__item-quickshop button",function(ev){
		ev.preventDefault();
		var skuToAdd = $(this).parents(".searchShelf__item-quickshop").find(".searchShelf__item-quickshop--skus span.checked").attr("data-availableid");
		if(skuToAdd){
			var data = [{
			    id: skuToAdd,
			    quantity: 1,
			    seller: 1
			}];
			
			vtexjs.checkout.addToCart(data)
			    .fail(function () {
			        window.location.href = href;
			    })
			    .done(function () {
			        jQuery.vtex_quick_cart(options);
			
			        $(document).trigger('minicart__open');
			        setTimeout(function () {
			            if ( $('body').hasClass('is--showing__minicart') ) {
			                $(document).trigger('header__close');
			            }
			        }, 2000);
			    });
			return false;
		}
		else{
			alert("Selecione o tamanho para adicionar o produto à sacola.");
		}
	});

}


$(document).ready(function(){
	if($("body").hasClass("buscavazia")){
		setSearchTerm();
		svgSuggestion();
		shelfUser();
		topSix();
		research();
	}
});