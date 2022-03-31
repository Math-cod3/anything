function mood(){

	$(".mothers-day__mood-images").slick({
		slidesToShow:3
	});

	$(".mothers-day__mood-arrows--fakeprev").click(function(){
		$(".mothers-day__mood-images .slick-prev").click();
	});

	$(".mothers-day__mood-arrows--fakenext").click(function(){
		$(".mothers-day__mood-images .slick-next").click();
	});

}

function sizes(){
	
	$(".mothers-day__sizes ul li").click(function(){
		$(this).toggleClass("checked");
		var sizeParameters = "";
		if($(".mothers-day__sizes a").attr("href") === "/Loja/Roupas/"){
			sizeParameters = $(".mothers-day__sizes a").attr("href") +`?fq=specificationFilter_29:${$(this).text()}`;
		}
		else{
			sizeParameters = $(".mothers-day__sizes a").attr("href") + `&fq=specificationFilter_29:${$(this).text()}`;
		}
		$(".mothers-day__sizes a").attr("href",sizeParameters);
	});

}

$(document).ready(function(){
	mood();
	sizes();
});