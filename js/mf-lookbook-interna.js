if($("body").hasClass("lookbook")){

resizeImages = function() {
	$('.x-lookshelf__img img').each(function(index, el) {
		var _element = $(this);
		var _attr = _element.attr("src").replace("650-757", "1000-1500");
		_element.attr("src", _attr);
	});
};

function highlightLookNav() {
    var path = window.location.pathname;
    
    $('.x-nav-look a').get().filter(function (a) {
		return $(a).attr('href').toLowerCase() === path.toLowerCase();
	}).map(function (a) {
		$(a).addClass('is--active');
	});
}

var headers = {
    'Accept': 'application/vnd.vtex.ds.v10+json',
    'Content-Type': 'application/json'
};

function setLink(){
	if(!document.querySelector('body.lookbook-2018'))
		return;
	var listItens = document.querySelectorAll(".x-lookbook__products ul li .x-lookshelf");
	var productIdLongString = Array.from(listItens).map(function(elem) {
		return 'fq=productId:'+ elem.getAttribute("data-id");
	}).join('&');
	$.ajax({
		headers: headers,
		type: 'GET',
		url: '/api/catalog_system/pub/products/search/?' + productIdLongString,
		success : function(data){
			data.forEach(function(elem){
				if(elem['url colecao'] != undefined && elem['url colecao']){
					var linkItem = document.querySelector(".x-lookbook__products ul li .x-lookshelf[data-id='" + elem.productId + "']");
					linkItem.querySelector(".x-lookshelf__cta").setAttribute('href', elem['url colecao']);
					linkItem.querySelector(".x-lookshelf__img a").setAttribute('href', elem['url colecao']);
				}
			});
		},

		error: function(data){
			console.log("Error Search Lookbook Products : " + data);
		}
	});
	console.log(productIdLongString);	
}


$(document).ready(function () {
	resizeImages();
	highlightLookNav();
	setLink();
});

}