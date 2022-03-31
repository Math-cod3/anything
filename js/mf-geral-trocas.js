if($("body").hasClass("interna")){

if(window.innerWidth <= 768){
	//Mobile
	removeHelpComplement = function () {
		$('.helperComplement').remove();
	};

	$(function () {
		var MariaFilo = {
			init: function () {
				removeHelpComplement();
				// MariaFilo.removeFlagOffPage();
				MariaFilo._headerFixed();
				MariaFilo._actionMenuFooter();
				MariaFilo._actionMenu();
				MariaFilo._openSearchAndMiniCart();
				MariaFilo._sliderProducts();
				MariaFilo._searchProduct();
				MariaFilo._placeholderInputNews();
				MariaFilo._setFlags();
				MariaFilo.loginVtex();
				MariaFilo._popLoginWelcome();
				MariaFilo.placeholderEmail();
				MariaFilo.showLoggedBar();
				MariaFilo.footerAllIn();
				// MariaFilo.tagLiqui();
			},
			placeholderEmail: function () {
				var url = location.pathname;
				if(url.indexOf("/login")>=0){
					setTimeout(function() {
						$('#inputEmail').attr('placeholder', 'Ex: luisa@mariafilo.com.br');
					}, 2500);
				}
			},
			_headerFixed: function () {
				if ($('body').hasClass('x-busca-vazia')) {
					$('#x-header .x-top').addClass('x-scroll');
				};
				if ($('body').hasClass('home')) {
					$(window).on('scroll', function () {
						var scroll = $(window).scrollTop();
						if (scroll >= 10) {
							$('#x-header .x-top').addClass('x-scroll');
						} else {
							$('#x-header .x-top').removeClass('x-scroll');
						}
					});
				} else {
					$('#x-header .x-top').addClass('x-scroll');
				}
			},
			_actionMenuFooter: function () {
				$('#x-footer .x-inst ul li h3').click(function () {
					if(!$('#x-menu-mobile').is(":visible")) {
						$('#x-footer .x-inst ul li h3').not(this).removeClass('x-active');
						$(this).toggleClass('x-active');
						$('#x-footer .x-inst ul li h3').not(this).next().slideUp();
						$(this).next().slideToggle();
					}
				});
			},
			_placeholderInputNews: function () {
				$('.newsletter-button-ok').val('Enviar');
				$('.newsletter-client-email').val('').attr('placeholder', 'Email');
				$('.newsletter-client-name').val('').attr('placeholder', 'Nome');
			},
			_actionMenu: function () {
				$('#x-header .x-top .x-menu').click(function () {
					$("body").css({
						"overflow":"hidden",
						"position":"fixed"
					});
					$('#x-header .x-cart').removeClass('x-active');
					$('#x-mini_cart').removeClass('x-active');
					$('#x-search-autocomplete').removeClass('x-active');
					$('#x-header .x-search').removeClass('x-active');

					$('#x-menu-mobile').fadeIn();
					$('#x-menu-mobile .x-search-menu .fulltext-search-box').val('').attr('placeholder', 'Busque aqui');
					$('#x-search-auto-complete').removeClass("x-active");
				});
				$('#x-menu-mobile .x-menu-top .x-close').click(function () {
					$("body").css({
						"overflow":"visible",
						"position":"relative"
					});
					$('#x-menu-mobile').fadeOut();
				});
				$(".x-content, #x-footer").click(function(e){
					if($('#x-menu-mobile').is(":visible")) {
						e.preventDefault();
						$("body").css({
							"overflow":"visible",
							"position":"relative"
						});
						$('#x-menu-mobile').fadeOut();
					}
				});

				$('#x-menu-mobile .x-menu-items .x-navigation ul li h3').click(function () {
					$('#x-menu-mobile .x-menu-items .x-navigation ul li h3').not(this).removeClass('x-active');
					$(this).toggleClass('x-active');
					$('#x-menu-mobile .x-menu-items .x-navigation ul li h3').not(this).next().slideUp();
					$(this).next().slideToggle();
				});
			},
			_openSearchAndMiniCart: function () {
				$('#x-header .x-top .x-cart').click(function () {
					$('#x-search-autocomplete').removeClass('x-active');
					$('#x-header .x-search').removeClass('x-active');

					$(this).toggleClass('x-active');
					$('#x-mini_cart').toggleClass('x-active');
					$('body').toggleClass('x-not-scroll');
					if (!$('#x-header .x-top').hasClass('x-scroll')) {
						$('#x-header .x-top').toggleClass('x-scroll');
					};
				});
			},
			_sliderProducts: function () {
				$('.x-product-list .prateleira > ul').slick({
					infinite: true,
					centerMode: false,
					slidesToShow: 1,
					focusOnSelect: false,
					adaptiveHeight: true,
					touchMove: true,
					dots: false,
					arrows: true,
					cssEase: 'linear'
				});
			},
			_searchProduct: function () {
				$('#x-autocomplete-input').attr('autocomplete', 'off');

				$('.x-help-search .x-close').click(function () {
					$('#x-header .x-top .x-search').removeClass('x-active');
					$('#x-autocomplete-input').val('');
				});

				$('#x-header .x-top .x-search, .x-help-search .x-close').click(function () {
					$('#x-header .x-cart').removeClass('x-active');
					$('#x-mini_cart').removeClass('x-active');
					$('#x-menu-mobile').fadeOut();

					// setTimeout(function(){
					//     $('#x-autocomplete-input').focus();
					// }, 100);

					$(this).toggleClass('x-active');
					$('#x-search-auto-complete').toggleClass('x-active');
					$('body').toggleClass('x-not-scroll');
					if (!$('#x-header .x-top').hasClass('x-scroll')) {
						$('#x-header .x-top').toggleClass('x-scroll');
					};

					$('#x-menu-mobile').fadeOut();
				});

				$('.x-search-input form').submit(function (event) {
					return false;
				});

				$('#x-autocomplete-input').on('focus touchstart', function () {
					$(this).attr('placeholder', 'digite sua busca');
				});

				$('#x-autocomplete-input').on('mouseleave touchend', function () {
					$(this).attr('placeholder', 'digite sua busca');
				});

				$('#x-autocomplete-input').on('keydown', function (event) {
					var $search = $(this).val();
					$('.x-search-input .x-btn-submit').addClass('x-active');
					if ($search.length < 2) {
						$('.x-search-input .x-btn-submit').removeClass('x-active');
						$('.x-search-input .x-help-search').fadeIn();
						$('.x-search-gets .x-result-category .x-all, .x-empty-result-info, .x-search-again, .x-empty-result-info').hide();
						$('.x-produt-list ul').html('');
						$('.x-clear-search').fadeOut();
					} else if ($search.length > 2) {
						$('.x-search-input .x-help-search').hide();
						$('.x-search-gets .x-result-category .x-all').fadeIn();
						$('.x-clear-search, #x-search-auto-complete .x-search-gets').fadeIn();
					};

					$('.x-all a').attr('href', $('#x-autocomplete-input').val());

					if($('.x-produt-list').find('.prateleira ').length){
						$('.x-empty-result-info').hide();
					}
				});

				$('.x-clear-search').click(function () {
					$('#x-autocomplete-input').val('');
					$('.x-help-search').fadeIn();
					$('.x-search-gets').hide();
				});

				$('.x-search-input form input[type="text"]').vtexCustomAutoComplete({
					shelfId: '4e7901b8-c45b-4d86-8be1-b6179d70afee',
					appendTo: $('.x-search-gets .x-produt-list'),
					notFound: function () {
						$('.x-search-input .x-help-search, .x-search-again, .x-empty-result-info').fadeIn();
						$('.x-search-gets .x-result-category .x-all, .x-clear-search').hide();
						console.log('Nada encontrado: ', true);
					},
					limit: 12
				});

				$('.x-search-area').on('click', function() {
					$('#x-autocomplete-input').focus();
				});
			},
			_setFlags: function () {
				var allIds = [];
				var pgProduct = false;
				$('.prateleira .x-id:not(".is--added")').each(function () {
					allIds.push($(this).val());
					$(this).addClass('is--added');
				});

				if (typeof skuJson != "undefined") {
					if (!$('body').hasClass('flag-checked')) {
						allIds.push(skuJson.productId);
						pgProduct = true;
						$('body').addClass('flag-checked');
					}
				}

				var allIdsInText = allIds.map(function (id) {
					return 'fq=productId:' + id;
				}).join('&');


				var flags = {
					// sets suite flags
					suite: function (products_array) {
						var selectedsIds = [];
						var suiteIcon = $("#suite-icon-svg");
						products_array.forEach(function (item) {
							if (Array.isArray(item['Linha'])) {
								var collection = item['Linha'];
								collection.forEach(function (col) {
									var str = col || '';
									if (col.search(/suite/gim) !== -1) {
										selectedsIds.push(item.productId);
									}
								});
							}
						});

						selectedsIds.forEach(function (id) {

							var html = $('<span class="x-flag x-flag--suite">').append(suiteIcon.clone());

							if (pgProduct) {
								if (skuJson.productId == id) {
									$('#productPage-flags')
										.append(html);
								}
							}

							$('.js--flag-shelf[data-id="' + id + '"]').prepend(html);
						});
					},

					novo: function (products_array) {
						var selectedsIds = [];

						products_array.forEach(function (item) {
							var collection = item['clusterHighlights'] || {};

							if ("137" in collection) {
								selectedsIds.push(item.productId);
							}
						});

						selectedsIds.forEach(function (id) {
							$('.js--flag-shelf[data-id="' + id + '"]').find('.x-flag--novo').addClass('is--active');
						});
					}
				};

				if (allIds.length) {
					$.ajax('/api/catalog_system/pub/products/search/?' + allIdsInText)
						.then(function (data) {
						flags.suite(data);
						flags.novo(data);
					});
				}
			},
			loginVtex: function () {
				$('.x-menu-top .x-login').on('click', function (event) {
					$('#x-menu-mobile').fadeOut();
					setTimeout(function () {
						$('.vtexIdUI-heading > span').eq(0).text('Use uma das opções para fazer login');
						vtexid.start({
							returnUrl: '/account',
							userEmail: '',
							locale: 'pt-BR',
							forceReload: false
						});
						setTimeout(function(){
							$('#inputEmail').attr('placeholder', 'Ex: luisa@mariafilo.com.br');
						},3000)
					}, 500);
					return false;
				});
			},
			showLoggedBar: function() {
				$.ajax({
					type: 'GET',
					url: '/no-cache/profileSystem/getProfile',
					success: function (data) {
						if (data.IsUserDefined) {
							$('.x-login').addClass('x-active');
							if (data.FirstName) {
								$('.x-login a').text(data.FirstName + ' ' + data.LastName);
							}
						}
					}
				});
			},

			_popLoginWelcome: function () {
				var $pop = $('.x-pop-signup');

				if (!$.cookie('popWelcome')) {
					$.cookie('popWelcome', 'true', {
						expires: 30
					});
					$pop.show();

					$pop.on('click', '.js--close-pop-signup', function () {
						$pop.hide();
					});
				}

				$('.js--open-login').on('click', function () {
					$pop.hide();
					$.cookie('popWelcome', 'true', {
						expires: 30
					});
					vtexid.start({
						returnUrl: '/account',
						userEmail: '',
						locale: 'pt-BR',
						forceReload: false
					});
				});
			},
			removeFlagOffPage: function () {
				var pageOff = window.location.pathname;
				if (pageOff.search("off") == 1) {
					$("body .x-product .x-image .x-flag-shelf .x-flag--liqui").css("display", "none");
				}
			},
			footerAllIn: function() {
				var newsForm  = document.querySelector('.x-form-newsletter');
				var newsName  = document.querySelector('.x-news-name');
				var newsEmail = document.querySelector('.x-news-email');

				var createMessage = function(arg){
					var wrapper   = document.createElement('div');
					var paragraph = document.createElement('p');
					var close = document.createElement('button');

					wrapper.setAttribute('class', 'x-sucess');
					paragraph.setAttribute('class', 'x-sucess-tx');
					close.setAttribute('class', 'x-sucess-close');
					close.setAttribute('title', 'Fechar');

					paragraph.innerHTML = arg;

					wrapper.appendChild(close);
					wrapper.appendChild(paragraph);
					newsForm.appendChild(wrapper);

					close.addEventListener('click', function(){
						wrapper.remove();
					});
				};

				newsForm.addEventListener('submit', function(e){
					e.preventDefault();

					var newsObj = {
						'fields[nome_completo]': newsName.value,
						'fields[nm_email]': newsEmail.value
					};

					$.get('//landfy.smartcampaign.com.br/landfy/api/2dd05916-d526-11e7-8ad3-0e7eae3ca056', newsObj, function (response) {
						if(response.statusCode === 1) {
							createMessage('Cadastro realizado com sucesso!');
						} else if (response.statusCode === 3) {
							createMessage('Você já possui cadastro.');
						} else if (response.statusCode === 0) {
							createMessage('Ocorreu um problema ao se cadastrar, tente novamente.');
						}
					});
				}, false);
			},
			tagLiqui: function() {
				var liquiAllItems = $(".x-flag--liqui");

				if(window.location.href.indexOf('off') < 0 ){
					liquiAllItems.removeAttr('style');
				}
			}
		};
		MariaFilo.init();

		$(document).ajaxStop(function () {
			MariaFilo._setFlags();
			MariaFilo.tagLiqui();
		});
	});

	$(document).ajaxStop(function () {
		// removeFlagOffPage();
		var valueItens = $('.cart-info .amount-items').text().trim().split(': ')[1];
		$('.x-cart .x-amount-itens').text(valueItens);
		setTimeout(function () {
			removeHelpComplement();
			$('.vtexIdUI-heading > span').eq(0).text('Use uma das opções para fazer login');
		}, 100);
	});
} else {
	//Desktop
	function removeHelpComplement() {
		$('.helperComplement').remove();
	};

	function setScroll() {
		//var lastScrollTop = $(window).scrollTop();
		$(window).scroll(function (event) {
			var st = $(this).scrollTop();
			if (st > 70) {
				$('header').addClass('x-scroll');

			} else {
				$('header').removeClass('x-scroll');
			}
			lastScrollTop = st;
		});
	};

	function setNavClass() {
		return false;
		// var $header = $('header');
		// $('#x-novidades-menu, #x-menu-btn').on('click', function(event){
		//     $header.toggleClass('x-nav-open'); //Muda cor do header de transparente para branco
		// });
	};

	function initSubmenu() {
		$('.x-menu-dropdown.active-menu .x-departments > li > a').removeClass('active');
		// $('.x-menu-dropdown.active-menu .x-departments > li:first-child()')
		// .find('> a').addClass('active').find('.x-submenu-categories').addClass('active');
	};

	function showSubmenuBind() {
		$('.x-menu-dropdown.active-menu .x-departments > li').off().on('mouseover', function (event) {
			var $this = $(this);
			$('.x-menu-dropdown.active-menu .x-departments > li > a').removeClass('active');
			$(this).children('a').addClass('active');
		}).on('mouseout', function (e) {
			$('.x-menu-dropdown.active-menu .x-departments > li > a').removeClass('active');
			$('.x-menu-dropdown.active-menu .x-departments > li > a').next('.x-submenu-categories').removeClass('active');
		});
	};

	function mainMenu() {
		$('button.x-menu-btn').parent().on('mouseenter', function (event) {
			$('.busca-overlay').remove();
			resetCart();
			$('header').removeClass('x-nav-open-busca');
			$('.x-icon-search').removeClass('open');
			$('.x-dropdown-search').removeClass('opened').hide();
			$('.x-menu-dropdown').addClass('active-menu').fadeIn();
			$('header').addClass('x-nav-open').removeClass('x-nav-open-novidades');
			$(this).addClass('close-menu');
			$('.x-content').append('<div class="busca-overlay"></div>');

			initSubmenu();
			showSubmenuBind();

			if ($('.x-novidades-dropdown').hasClass('active-menu')) {
				$('.x-novidades-dropdown').removeClass('active-menu').hide();
				$('#x-novidades-menu').removeClass('open');
			}
		});

		$('.x-header .x-item-novidades').on('mouseenter', function (event) {
			$('.busca-overlay').remove();
			resetCart();
			$('header').removeClass('x-nav-open-busca');
			$('.x-icon-search').removeClass('open');
			$('.x-dropdown-search').removeClass('opened').hide();
			$('.x-menu-dropdown').addClass('active-menu').fadeIn();
			$('header').addClass('x-nav-open').removeClass('x-nav-open-novidades');
			$(this).addClass('close-menu');
			$('.x-content').append('<div class="busca-overlay"></div>');

			initSubmenu();
			showSubmenuBind();

			if ($('.x-novidades-dropdown').hasClass('active-menu')) {
				$('.x-novidades-dropdown').removeClass('active-menu').hide();
				$('#x-novidades-menu').removeClass('open');
			}
		});

		$('button.x-menu-btn').parent().on('mouseleave', function () {
			resetBusca();
			resetCart();
			initSubmenu();
			showSubmenuBind();
			$('.x-menu-dropdown').addClass('active-menu').fadeOut(0);
		});

		$('.x-header .x-item-novidades').parent().on('mouseleave', function () {
			resetBusca();
			resetCart();
			initSubmenu();
			showSubmenuBind();
			$('.x-menu-dropdown').addClass('active-menu').fadeOut(0);
		});

		$('#x-novidades-menu').on('click', function (event) {
			$('.busca-overlay').remove();
			if ($(this).hasClass('open')) {
				$('.x-novidades-dropdown').slideUp(400, function () {
					resetBusca();
					$('.x-novidades-dropdown').removeClass('active-menu');
					$('#x-novidades-menu').removeClass('open');
				}).addClass('active-menu');
			} else {
				resetCart();
				resetMenuRight();
				$('header').removeClass('x-nav-open-busca');
				$('.x-icon-search').removeClass('open');
				$('.x-dropdown-search').removeClass('opened').hide();
				$('.x-novidades-dropdown').addClass('active-menu').slideDown();
				$(this).addClass('open');
				$('button.x-menu-btn').removeClass('close-menu');
				$('header').addClass('x-nav-open-novidades').addClass('x-nav-open');
				$('.x-content').append('<div class="busca-overlay"></div>');

				if ($('.x-menu-dropdown').hasClass('active-menu')) {
					$('.x-menu-dropdown').removeClass('active-menu').removeClass('opened').hide();
					$('button.x-menu-btn').removeClass('close-menu');
				}
			}
		});
	};

	function resetMenuRight() {
		$('header').removeClass('x-nav-open').removeClass('x-nav-open-novidades');
		$('button.x-menu-btn').removeClass('close-menu');
		$('.x-menu-dropdown').hide().removeClass('active-menu');
		$('.x-novidades-dropdown').hide().removeClass('active-menu');
		$('#x-novidades-menu').removeClass('open');
	};

	function resetCart() {
		$('.x-dropdown-cart').hide();
		$('header').removeClass('x-nav-open-cart');
		$('.x-icon-cart').removeClass('open');
		$('.x-dropdown-cart').removeClass('active-menu');
	};

	function resetMenuNovidades() {
		$('header').removeClass('x-nav-open').removeClass('x-nav-open-novidades');
		$('.x-novidades-dropdown').hide().removeClass('active-menu');
		$('#x-novidades-menu').removeClass('open');
	};

	function resetMenu() {
		$('header').removeClass('x-nav-open').removeClass('x-nav-open-novidades').removeClass('x-nav-open-cart');
		$('button.x-menu-btn').removeClass('close-menu');
		$('.x-menu-dropdown').hide().removeClass('active-menu');
		$('.busca-overlay').remove();
	};

	function resetBusca() {
		$('header').removeClass('x-nav-open').removeClass('x-nav-open-novidades').removeClass('x-nav-open-busca');
		$('.x-icon-search').removeClass('open');
		$('.x-dropdown-search').removeClass('opened').hide();
		$('.busca-overlay').remove();
	};

	function cartDropdown() {
		$('.js--cart-link').on('click', function (event) {

			if (!$(this).hasClass('is--active')) {
				return true;
			}

			$('.busca-overlay').remove();
			if ($(this).hasClass('open')) {
				$('.x-dropdown-cart').slideUp(400, function () {
					$('.js--cart-link').removeClass('open');
					$('header').removeClass('x-nav-open').removeClass('x-nav-open-cart');
					$('.x-icon-cart').removeClass('open');
					$('.x-dropdown-cart').removeClass('active-menu');
				}).addClass('active-menu');
			} else {
				resetMenuRight();
				resetBusca();
				$(this).addClass('open');
				$('.x-icon-cart').addClass('open');
				$('.x-dropdown-cart').addClass('active-menu').slideDown();
				$('header').addClass('x-nav-open x-nav-open-cart').removeClass('x-nav-open-busca');
				$('.x-content').append('<div class="busca-overlay"></div>');
			}

			return false;
		});
	};

	function searchBind() {
		$('.x-icon-search').on('click', function () {
			$('.busca-overlay').remove();

			var $this = $(this);
			var $searchBlock = $('.x-dropdown-search');
			var $header = $('header');
			var $novidades = $('#x-novidades-menu');

			// $header.removeClass('x-nav-open').removeClass('x-nav-open-novidades');

			if ($novidades.hasClass('open')) {
				$('.x-novidades-dropdown').hide().removeClass('active-menu');
				$(this).removeClass('open');
				$('header').removeClass('x-nav-open-novidades').removeClass('x-nav-open');
			}

			if ($this.hasClass('open')) {
				$this.removeClass('open');
				$searchBlock.slideUp(400, function () {
					resetMenuRight();
					$('.x-dropdown-search').removeClass('opened');
					$('header').removeClass('x-nav-open').removeClass('x-nav-open-busca');
					resetBusca();
				});
			} else {
				resetMenuRight();
				resetCart();
				$header.addClass('x-nav-open').addClass('x-nav-open-busca');
				$this.addClass('open');
				$searchBlock.addClass('opened').slideDown();
				$('.x-content').append('<div class="busca-overlay"></div>');
				$("#x-search-input").focus();

				$('.x-search-area').on('click', function(){
					$("#x-search-input").focus();
				});
			}
		});
	};

	function closeBusca() {
		$('.x-dropdown-search > .x-close').on('click', function () {
			$('.x-dropdown-search').slideUp(400, function () {
				resetMenuRight();
				$('.x-dropdown-search').removeClass('opened');
				$('header').removeClass('x-nav-open').removeClass('x-nav-open-busca');
				resetBusca();
			});
		});
	};

	function setAutocomplete() {
		$('.js--search-input').vtexCustomAutoComplete({
			shelfId: '4a258ce9-136f-46aa-9925-ed1081dfe366',
			appendTo: $('.js--search-results'),
			notFound: function () {
				var $div = "<p>Nenhum resultado encontrado</p>";
				return $div;
			},
			limit: 12
		});

		$('.js--search-input').on('keydown', function () {
			$('label[for="submit-search"]').removeClass('is--active');
		});

		$(document).ajaxStop(function () {
			var hasVal = $('.js--search-results').children().length;
			var hasResults = $('.js--search-results li').length;

			if (hasVal) {
				$('.x-search-results-wrapper').addClass('is--active');
			} else {
				$('.x-search-results-wrapper').removeClass('is--active');
			}

			if (hasResults) {
				$('label[for="submit-search"]').addClass('is--active');
			} else {
				$('label[for="submit-search"]').removeClass('is--active');
			}
		});
	};

	function controllerMinicart() {
		$('.js--cart-link').on('click', function () {
			if ($(this).hasClass('is--active')) {
				$('.x-dropdown-cart').toggleClass('x-active');
				return false;
			}
		});
	};

	function removeHelp() {
		$('.helperComplement').remove();
	};

	function closeMenu() {
		$(document).on('click', '.busca-overlay', function () {
			$('.active-menu').hide();
			resetMenuRight();
			resetBusca();
			resetCart();
		});
	};

	function showLoggedBar() {
		$.ajax({
			type: 'GET',
			url: '/no-cache/profileSystem/getProfile',
			success: function (data) {
				if (data.IsUserDefined) {
					$('.x-navigation_logged-in').addClass('x-active');
					if (data.FirstName) {
						//$('.x-navigation_logged-in .x-username').text(data.FirstName);
						$('.x-icon-user--name').text(data.FirstName + ' ' + data.LastName);
					}
				}
			}
		});
	};

	function formSearch() {
		$('form.x-search').on('submit', function () {
			var text = $('.js--search-input').val();
			var url = '/busca?ft=' + window.decodeURIComponent(text);
			window.location.href = url;

			return false;
		});
	};

	function changeSearch() {
		var searchText = document.querySelector('.main .didyoumean');
		var searchVariable = document.querySelector('.main .didyoumean a');

		// if(window.location.pathname === '/busca') {
		// 	searchText.innerHTML = 'Você buscou por <a class="x-link">' + searchVariable.textContent +'</a>. Confira os resultados abaixo:';
		// 	$('.x-link').attr('href', searchVariable.textContent);
		// }
	};

	function login() {
		var userInfo = {};

		//Detecta se está no IE
		var isInternetExplorer = /*@cc_on@*/false || !!document.documentMode;

		// Oculta 'Incluir dados de pessoa jurídica'
		var businessToggle = document.getElementById('business-toggle');

		if(businessToggle){
			businessToggle.style.display = 'none';
		}

		$.ajax('/no-cache/profileSystem/getProfile', {
			async: false
		})
			.fail(function () {
			userInfo = null;
		})
			.done(function (data) {
			userInfo = data;
		});

		var w = $('.x-icon-wishlist').parent();

		$('.x-login-action, .x-footer_grid--account ul > li a, .x-popup__link').add(w).on('click', function () {
			if (!userInfo.IsUserDefined) {
				vtexid.start({
					returnUrl: '/account',
					userEmail: '',
					locale: 'pt-BR',
					forceReload: false
				});
				setTimeout(function(){
					$('#inputEmail').attr('placeholder', 'Ex: luisa@mariafilo.com.br');
				},3000)

				if(isInternetExplorer){
					window.location.reload('/account');
				}
				return false;
			}
		});

		if(userInfo.IsUserDefined){
			$(".x-header .x-navigation_logged-in .x-menu-right ul li:last-child a").attr("href","/no-cache/user/logout");
		}
	};

	function setFlags() {
		var allIds = [];
		var pgProduct = false;
		$('.prateleira .x-id:not(".is--added")').each(function () {
			allIds.push($(this).val());
			$(this).addClass('is--added');
		});

		if (typeof skuJson != "undefined") {
			if (!$('body').hasClass('flag-checked')) {
				allIds.push(skuJson.productId);
				pgProduct = true;
				$('body').addClass('flag-checked');
			}
		}

		var allIdsInText = allIds.map(function (id) {
			return 'fq=productId:' + id;
		}).join('&');


		var flags = {
			// sets suite flags
			suite: function (products_array) {
				var selectedsIds = [];
				var suiteIcon = $("#suite-icon-svg");

				products_array.forEach(function (item) {
					if (Array.isArray(item['Linha'])) {
						var collection = item['Linha'];
						collection.forEach(function (col) {
							var str = col || '';
							if (col.search(/suite/gim) !== -1) {
								selectedsIds.push(item.productId);
							}
						});
					}
				});

				selectedsIds.forEach(function (id) {

					var html = $('<span class="x-flag x-flag--suite">').append(suiteIcon.clone());

					if (pgProduct) {
						if (skuJson.productId == id) {
							$('#productPage-flags').append(html);
						}
					}
					$('.js--flag-shelf[data-id="' + id + '"]').prepend(html);

				});
			},

			novo: function (products_array) {
				var selectedsIds = [];

				products_array.forEach(function (item) {
					var collection = item['clusterHighlights'] || {};

					if ("137" in collection) {
						selectedsIds.push(item.productId);
					}
				});

				selectedsIds.forEach(function (id) {
					$('.js--flag-shelf[data-id="' + id + '"]').find('.x-flag--novo').addClass('is--active');
				});
			}
		};

		if (allIds.length) {
			$.ajax('/api/catalog_system/pub/products/search/?' + allIdsInText)
				.then(function (data) {
				flags.suite(data);
				// flags.novo(data);
			});
		}
	};

	function goToTop() {
		var $btn = $('.js--go-to-top').on('click', function () {
			$('body,html').animate({
				scrollTop: 0
			}, 500);
		}).parent();

		$(window).on('load', function () {
			$(window).on('scroll', function () {
				if ($(this).scrollTop() > $(this).height() * 2) {
					$btn.addClass('is--visible');
				} else {
					$btn.removeClass('is--visible');
				}
			});
		});
	};

	function changeLabelNews() {
		$('.newsletter-button-ok').val('Enviar');
	};

	function popLoginWelcome() {
		var $pop = $('.x-popup');

		if (!$.cookie('popWelcome')) {
			$.cookie('popWelcome', 'true', {
				expires: 30
			});
			$pop.show();

			$pop.on('click', '.x-popup__overlay, .x-popup__close', function () {
				$pop.hide();
			});
		};
		$('.x-popup__link').on('click', function(){
			$pop.hide();
			return false;
		});
	};

	function placeholderEmail () {
		var url = location.pathname;
		if(url.indexOf("/login")>=0){
			setTimeout(function() {
				$('#inputEmail').attr('placeholder', 'Ex: luisa@mariafilo.com.br');
			}, 2500);
		}
	};

	function tempRedirectOff() {
		var currentURL = window.location.href;

		if(currentURL === 'https://www.mariafilo.com.br/off'){
			window.location.replace('https://www.mariafilo.com.br/');
		}
	};

	function footerAllIn() {
		var newsForm  = document.querySelector('.x-form-newsletter');
		var newsName  = document.querySelector('.x-news-name');
		var newsEmail = document.querySelector('.x-news-email');

		var createMessage = function(arg){
			var wrapper   = document.createElement('div');
			var paragraph = document.createElement('p');
			var close = document.createElement('button');

			wrapper.setAttribute('class', 'x-sucess');
			paragraph.setAttribute('class', 'x-sucess-tx');
			close.setAttribute('class', 'x-sucess-close');
			close.setAttribute('title', 'Fechar');

			paragraph.innerHTML = arg;

			wrapper.appendChild(close);
			wrapper.appendChild(paragraph);
			newsForm.appendChild(wrapper);

			close.addEventListener('click', function(){
				wrapper.remove();
			});
		};

		newsForm.addEventListener('submit', function(e){
			e.preventDefault();

			var newsObj = {
				'fields[nome_completo]': newsName.value,
				'fields[nm_email]': newsEmail.value
			};

			$.get('//landfy.smartcampaign.com.br/landfy/api/2dd05916-d526-11e7-8ad3-0e7eae3ca056', newsObj, function (response) {
				console.log('response', response.statusCode);

				if(response.statusCode === 1) {
					createMessage('Cadastro realizado com sucesso!');
				} else if (response.statusCode === 3) {
					createMessage('Você já possui cadastro.');
				} else if (response.statusCode === 0) {
					createMessage('Ocorreu um problema ao se cadastrar, tente novamente.');
				}
			});
		}, false);
	};

	function productVariationsCategory(){
		function shelfVariations() {
			var ids = [];
			$('.js--shelf-size-variation').not('.is--loaded').each(function () {
				ids.push($(this).data('product-id'));
				$(this).addClass('is--loaded');
			});

			if(!ids.length) return;

			var query = ids.map(function (prod_id) {
				return 'fq=productId:' + prod_id;
			}).join('&');

			$.getJSON('/api/catalog_system/pub/products/search/?' + query, function (data) {
				var infos = data.map(function (prod) {
					return {
						productId: prod.productId,
						skus: prod.items.map(function (sku) {
							return {
								skuId: sku.itemId,
								size: sku.Tamanho[0],
								avaiable: sku.sellers[0].commertialOffer.AvailableQuantity > 0
							};
						})
					};
				});

				infos.forEach(function (prod_info) {
					var $form = $('<form class="js--form-shelf">');

					var html = prod_info.skus.map(function (sku) {

						if (sku.avaiable !== false) {
							return '\
<label> \
<input type="radio" name="size" class="js--input-shelf" data-product-id="' + sku.size + '" value="' + sku.skuId + '"/> \
<span title="Tamanho: '+ sku.size +'">' + sku.size + '</span> \
</label>';
						} else {
							return '\
<label> \
<input type="radio" name="size" class="js--input-shelf" data-product-id="' + sku.size + '" value="' + sku.skuId + '"/> \
<span class="is-empty" title="Tamanho: '+ sku.size +'">' + sku.size + '</span> \
</label>';
						}
					}).join('');

					$('.js--shelf-size-variation[data-product-id="' + prod_info.productId + '"]').append($form.append(html));
				});

				selectVariations();
			});
		};

		function buyFromShelf() {
			$('body').on('click', '.x-shelf-drop__add-to-cart', function (e) {
				var $this = $(this);
				var skuId = $this.closest('li').find('.js--input-shelf:checked').val();

				if (skuId) {
					e.preventDefault();
					$this.text('aguarde...');

					var item = {
						id: +skuId,
						quantity: 1,
						seller: '1'
					};

					vtexjs.checkout.addToCart([item], null, 1)
						.fail(function () {
						console.log('Ocorreu um problema, tente novamente');
					})
						.done(function (orderForm) {
						$this.text('Produto Adicionado');
						jQuery.vtex_quick_cart(options);

						$('.x-minicart-group').addClass('x-visible');
						$('.js--cart-link').trigger('click');
						setTimeout(function () {
							$('.js--cart-link').trigger('click');
						}, 2000);
						$('.x-minicart-group').addClass('x-visible')
					});

					return false;
				}

				$('.js--cart-link').trigger('click');
				setTimeout(function () {
					$('.js--cart-link').trigger('click');
				}, 2000);
			});
		};

		function selectVariations() {
			var variations = document.querySelectorAll('.js--form-shelf label span');

			var activeVariations = function(parm){
				for(var i = 0; i < variations.length; i++){
					variations[i].classList.remove('is-active');
				}
				parm.classList.add('is-active');
			};

			for(var v = 0; v < variations.length; v++){
				variations[v].addEventListener('click', function(e){
					activeVariations(e.currentTarget);
				}, false);
			}
		};

		shelfVariations();
		buyFromShelf();
	};

	function menuOff() {
		// Menu off
		var header      = document.querySelector('.x-header');
		var menuOff     = document.querySelector('.x-item-off');
		var menuOffDrop = document.querySelector('.x-item-off-dropdown');

		menuOff.addEventListener('mouseenter', function(){
			header.classList.add('x-nav-open');
			menuOffDrop.classList.add('is-active');
		}, false);

		menuOff.addEventListener('mouseleave', function(){
			header.classList.remove('x-nav-open');
			menuOffDrop.classList.remove('is-active');
		}, false);
	};

	function removeFlagOffPage() {
		var pageOff = window.location.pathname;
		var flagLique = $(".x-flag--liqui");
		// if (pageOff.search("off") == 1) {
		//     $("body .x-product .x-image .x-flag-shelf .x-flag--liqui").css("display", "none");
		// }
		if (flagLique.length > 0) {
			$(".x-flag--liqui").css("display", "none");
		}
	};

	function tagLiqui() {
		var liquiAllItems = $(".x-flag--liqui");

		if(window.location.href.indexOf('off') < 0 ){
			liquiAllItems.removeAttr('style');
		}
	};

	$(document).ready(function () {
		// removeFlagOffPage();
		removeHelp();
		showLoggedBar();
		setNavClass();
		mainMenu();
		searchBind();
		setScroll();
		closeBusca();
		cartDropdown();
		resetCart();
		setAutocomplete();
		controllerMinicart();
		closeMenu();
		formSearch();
		login();
		setFlags();
		goToTop();
		changeLabelNews();
		popLoginWelcome();
		placeholderEmail();
		tempRedirectOff();
		changeSearch();
		footerAllIn();
		menuOff();
		productVariationsCategory();
		// tagLiqui();
	});

	$(document).ajaxStop(function () {
		// removeFlagOffPage();
		removeHelp();
		removeHelpComplement();
		setFlags();
		productVariationsCategory();
		// tagLiqui();
	});
}

}