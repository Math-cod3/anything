function mood(){

	$(".giftGuide__mood-images").slick({
		slidesToShow:3
	});

	$(".giftGuide__mood-arrows--fakeprev").click(function(){
		$(".giftGuide__mood-images .slick-prev").click();
	});

	$(".giftGuide__mood-arrows--fakenext").click(function(){
		$(".giftGuide__mood-images .slick-next").click();
	});

}

function sizes(){
	
	$(".giftGuide__sizes ul li").click(function(){
		$(this).toggleClass("checked");
		var sizeParameters = "";
		if($(".giftGuide__sizes a").attr("href") === "/Loja/Roupas/"){
			sizeParameters = $(".giftGuide__sizes a").attr("href") +`?fq=specificationFilter_29:${$(this).text()}`;
		}
		else{
			sizeParameters = $(".giftGuide__sizes a").attr("href") + `&fq=specificationFilter_29:${$(this).text()}`;
		}
		$(".giftGuide__sizes a").attr("href",sizeParameters);
	});

}

$(document).ready(function(){
	mood();
	sizes();
});