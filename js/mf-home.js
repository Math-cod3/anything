function loadBanner () {
	$(".x-banner-main").show();	
}

function bannerCarousel() {
	var options = {
		slidesToShow: 1,
		autoplay: true,
		infinite: true,
		fade: true,
		dots: true,
		arrows: true,
		autoplaySpeed: 12000
	}
	var $mainBanner = $('.x-banner-main_carousel');

	$mainBanner.slick(options);
};

function vitrineCarousel() {
	var options = {
		slidesToShow: 3,
		slidesToScroll: 3,
		infinite: true,
		autoplay: false,
		fade: false,
		dots: false,
		variableWidth: false,
		speed: 300,
		arrows: true
	}
	var $vitrineProdutos = $('.x-vitrine-products .vitrine ul');

	$vitrineProdutos.slick(options);
};

function scrollMore() {
	$('.x-scroll-more').off().on('click', function (e) {
		$('html, body').animate({
			scrollTop:$(window).height() - $('.x-header').height() 
		}, 1000, "swing");
	});
}

function bannerCarouselCustomizacao() {

	var $slickElement1 = $('.x-banner-main_carousel').eq(0);

	$slickElement1.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
		// CHANGE HEADER COLOR
		let dataHeader = $slickElement1.find('.slick-slide[data-slick-index="'+(currentSlide ? currentSlide : 0)+'"]').attr('data-header')
		$('body').removeClass('js-header--black js-header--white')
		if(dataHeader === undefined || dataHeader.trim() === '') {
			$('body').addClass('js-header--black')
		} else {
			$('body').addClass('js-header--'+dataHeader.trim())
		}
	});
}

function setHomeHeader() {
	$('.x-header').addClass('header-home');
}

function bannersGridVerifier() {
	var bannerLeft = $(".x-banners_grid--left .x-banners-left_text");
	var bannerRight = $(".x-banners_grid--right .x-banners-right_text");

	if (bannerRight.children().length >= 1 || bannerRight.text() != "")
		bannerRight.css("display", "block");
	else
		bannerRight.css("display", "none");


	if (bannerLeft.children().length >= 1 || bannerLeft.text() != "")
		bannerLeft.css("display", "block");
	else
		bannerLeft.css("display", "none");
}

function hideVitrine() {
	var $vitrines = $(".x-vitrine");
	$vitrines.each(function (index) {
		var $vitrineHeader = $(this).children('.x-vitrine-header');
		var $vitrineProducts = $(this).children('.x-vitrine-products');

		if (!$vitrineProducts.html()) {
			$vitrineHeader.hide();
			$vitrineProducts.hide();
		}
	});
}

function newNewsletter() {

	function copyToClipboard(element) {
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($(element).text()).select();
		document.execCommand("copy");
		$temp.remove();
	}

	$(".copy-icon").on("click", function() {
		copyToClipboard('.newsletter-cupom');
		$(".copy-icon").attr("src","/arquivos/couponcopy.png");
		$(".newsletter-cupom").fadeOut(function() {
			$(this).text("O CUPOM FOI COPIADO ;)")
		}).fadeIn();
	});

	$(".send-newsletter").on("click", function(e) {
		e.preventDefault();

		var nameUser = $('#nomenews').val();
		var emailUser = $('#emailnews').val();

		if ((nameUser.length > 0) && (emailUser.length > 0)) {    // se usuario e email estiverem preenchidos

				var jsonData = {
					"email": emailUser,
					"name": nameUser
				};

				// Requisição Ajax
				vtexjs.checkout.getOrderForm().then(function(orderForm) {
				$.ajax({
					headers: {
						"Accept": "application/vnd.vtex.ds.v10 json",
						"Content-Type": "application/json",
						"REST-Range": "resources=0-1"
					},
					type: 'GET',
					url: "/api/dataentities/NL/search?_fields=id,email&_where=email=" + emailUser

					}).done(function(clientInfo) {
						if(clientInfo.length == 0) {     // Não existe email

							$.ajax({
								url: '/api/dataentities/NL/documents/',
								dataType: 'json',
								type: 'PATCH',
								crossDomain: true,
								data: JSON.stringify(jsonData),
								headers: {
									'Accept': 'application/vnd.vtex.ds.v10 json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								success:function() {
									sessionStorage.setItem("newsVisualized","true");
									console.log("dados enviados pro Master Data");
									$(".newsletter-success").show();
									$(".newsletter-left").hide();
									$(".newsletter-right").hide();
									setTimeout(function() {
										var nomesucesso = $('#nomenews').val();
										$(".success-name").text("");
										let myStr = nomesucesso;
										let firstName = myStr.split(" ")[0];
										$(".success-name").append(firstName);
										$(".success-name").append("!");
									}, 500);
									
								}
							});
							
						} else {    // Existe email
							alert("E-mail já cadastrado!");
						}
					})
				});    // fim do ajax



		} else {
			//alert('Por favor, preencha todos os campos!');
			$("#nomenews").after("<div class='newsalert'>Campo obrigatório</div>");
			$("#emailnews").after("<div class='newsalert'>Campo obrigatório</div>");
			$("#nomenews").after("<img src='/arquivos/error.png' class='newsalert-img' />");
			$("#emailnews").after("<img src='/arquivos/error.png' class='newsalert-img' />");
		}
	});	
}

function handleIntersection(entries, observer) {
	try {
		entries.forEach((entry) => {
			const video = $(entry.target).find('video').get(0);
			let timeout;

			if (entry.isIntersecting || entry.isVisible) {
				timeout = setTimeout(() => video.play(), 100);
			} else {
				clearTimeout(timeout);
				video.pause();
			}
		});
	} catch (error) {
		console.error(error);
	}
}

function startObservation() {
	try {
		const elements = Array.from(document.querySelectorAll('.x-product.has-video'));
		const observer = new IntersectionObserver(handleIntersection, {
			rootMargin: '0px',
		});
		elements.forEach((element) => observer.observe(element));
	} catch (error) {
		console.error(error);
	}
}

function shelfVideo() {
	try {
		var countVideo = 0;
		var initCount = false;

		$('.x-product:not(.js-product-video-iterated)').each((_, xProduct) => {
		var $xProduct = $(xProduct);
		var videoUrl = $xProduct.find('.js-shelf-product-video').find('li').text();

		if (videoUrl && videoUrl.match('https') && countVideo === 0 && videoUrl.indexOf("blockgrid=true") < 0) {
			console.log("xproduct",$xProduct);
			$xProduct.addClass('has-video');
			var poster = Array.from($xProduct.find('.x-image-default').children('img').first().get(0).attributes).filter((attribute) => attribute.name === 'src')[0].value;
			$xProduct.find('.x-image-default').html(`
				<div class="js-shelf-video">
					<video class="x-product__video" poster="${poster}" src="${videoUrl.split('?').shift()}" muted loop playsinline></video>
				</div>
			`);
			initCount = true;
		}

		if(initCount === true){
			countVideo++;
			if(countVideo > 8){
				countVideo = 0;
				initCount = false;
			}
		}

		$xProduct.addClass('js-product-video-iterated');

		});

		startObservation();
	}
	catch(error){
		console.error(error);
	}
}

function fundoPrateleire() {
	if ($('.x-vitrine-banner .box-banner').size() > 0) {
		var src = $('.x-vitrine-banner .box-banner img').attr('src');
		$('.x-vitrine-banner').css('background-image', 'url(' + src + ')');
	}
}

//Habilita modal para a campanha Bolsa Premiada
function modalBolsaPremiada(){
	if(window.rex){
		if(window.rex.awardedBackpack){
			if(window.rex.awardedBackpack.participationCookie === null){
				$(".modalBolsa,.overlayModalBolsa").addClass('active');
			}

			$("body").on("click",".closeModalBolsa,.overlayModalBolsa",function(){
			  $(".modalBolsa,.overlayModalBolsa").remove();
			});
		}
	}
}

var global = {
	newsletter: function () {
		var $newsLightbox = $(".newsLightbox");

		function closeNews() {
			$newsLightbox.fadeOut(500, function () {
				// $(this).remove();
			});

			$.cookie("newsletter", "ok", { path: '/', expires: 1 });
		}

		if ($.cookie("newsletter") == "ok") {
			$newsLightbox.hide();
		} else if (!$.cookie("newsletter")) {
			setTimeout(function () {
				$newsLightbox.show();
			}, 3000);


			$('.overlayLightbox, .closeModal').click(function (e) {
				e.preventDefault();
				closeNews();
			});
		}
	},

	newsletterRegister: function () {
		$('#news-submit').on('click', function (e) {
			e.preventDefault();


			var _that = $(this);
			var btnVal = _that.val();
			var parent = _that.parents('fieldset');

			var nameUser = parent.find('#name').val();
			var emailUser = parent.find('#email').val();
			var telefoneUser = parent.find('#telefone').val();
			var cupon = "<p>Use o cupom <strong>BEMVINDA15</strong> ao finalizar sua compra</p>";
			var buttonDesc = "APROVEITE";

			function validateEmail(email) {
				var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
				return re.test(email);
			}

			_that.val("Aguarde...").prop("disabled", true);

			if (nameUser.length > 0) {

				if (validateEmail(emailUser)) {
					var jsonData = {
						"name": nameUser,
						"email": emailUser,
						"telefone": telefoneUser
					};

					// Requisição Ajax
					vtexjs.checkout.getOrderForm().then(function (orderForm) {
						$.ajax({
							headers: {
								"Accept": "application/vnd.vtex.ds.v10+json",
								"Content-Type": "application/json",
								"REST-Range": "resources=0-1"
							},
							type: 'GET',
							url: /* "//api.vtexcrm.com.br/mariafilo/ */ "/api/dataentities/NL/search?_fields=id,email&_where=email=" + emailUser

						}).done(function (clientInfo) {
							if (clientInfo.length == 0) { // Não existe email
								// var jsonData = {
								//     "name": nameUser,
								//     "email": emailUser
								// };


								$.ajax({
									url: /* 'https://api.vtexcrm.com.br/mariafilo/ */ 'https://api.vtexcrm.com.br/mariafilo/dataentities/NL/documents',
									dataType: 'json',
									type: 'PATCH',
									crossDomain: true,
									data: JSON.stringify(jsonData),
									headers: {
										'Accept': 'application/vnd.vtex.ds.v10+json',
										'Content-Type': 'application/json; charset=utf-8'
									},
									success: function (emailUser) {
										$('.newsLightbox').addClass('registred');
										$(parent).find('.fields').hide();
										$(parent).find('.success').append(cupon).show();
										$(parent).find('.button-success').append(buttonDesc).show();
										// _that.val(btnVal).prop("disabled",false);
									}
								});
							} else {
								$(parent).find('.fields').hide();
								$(parent).find('.error').html('E-mail já cadastrado!').show();
								_that.val(btnVal).prop("disabled", false);

								setTimeout(function () {
									$(parent).find('.fields').show();
									$(parent).find('.error').html('').hide();
								}, 3000)
							}
						})
					});
				} else {
					$(parent).find('.fields').hide();
					$(parent).find('.error').html('E-mail inválido!').show();
					_that.val(btnVal).prop("disabled", false);

					setTimeout(function () {
						$(parent).find('.fields').show();
						$(parent).find('.error').html('').hide();
					}, 3000)
				}
			} else {
				$(parent).find('.fields').hide();
				$(parent).find('.error').html('Por favor, preencha todos os campos!').show();
				_that.val(btnVal).prop("disabled", false);

				setTimeout(function () {
					$(parent).find('.fields').show();
					$(parent).find('.error').html('').hide();
				}, 3000)
			}
		});

	},
}
$(document).ready(function () {
	shelfVideo();
	bannerCarouselCustomizacao();
	bannerCarousel();
	vitrineCarousel();
	scrollMore();
	bannersGridVerifier();
	setHomeHeader();
	hideVitrine();
	fundoPrateleire();
	newNewsletter();

	global.newsletter();
	global.newsletterRegister();
});


$(window).load(function () {
	loadBanner();
});
