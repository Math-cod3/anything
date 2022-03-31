import { waitForElement } from "./components/utils";

if($("body").hasClass("account")){

function interna() {
	//remove bootstrap css
	$('link[href="//io.vtex.com.br/front-libs/bootstrap/2.3.2/css/bootstrap.min.css"]').remove();

	var url = window.location.pathname.split('/');

	if (url[1] == 'account') {
		$('body').addClass('interna');
	}

	if (url[2] == 'orders') {
		$('.x-nav-account__list > li:nth-child(2) > a').addClass('active-nav-item');
	} else if (url[2] == 'wishlist') {
		$('.x-nav-account__list > li:nth-child(3) > a').addClass('active-nav-item');
	} else {
		$('.x-nav-account__list > li:nth-child(1) > a').addClass('active-nav-item');
	}

	$('a[data-toggle]').off().on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		var modal = $(this).attr('href');

		$(modal).addClass('open');

		var modalHeight = $(modal).find('form').outerHeight();
		if (modalHeight < 900) {
			modalHeight = 900;
		}

		$(modal).css('min-height', modalHeight);
		$(modal).css('height', modalHeight);

		$('.x-account__container').css('height', modalHeight);

		$('.x-account__container').css('margin-bottom', 150);
	});

	$('button[data-dismiss="modal"]').off().on('click', function () {
		$(this).closest('div.modal').removeClass('open');
		$('.x-account__container').css('height', 'auto');
		$('.x-account__container').css('margin-bottom', 0);

	});
};

function resizeModal() {
	var modal = $('.open');
	var modalHeight = $(modal).find('form').outerHeight();
	if (modalHeight < 900) {
		modalHeight = 900;
	}

	$(modal).css('min-height', modalHeight);
	$(modal).css('height', modalHeight);

	$('.x-account__container').css('height', modalHeight);
	$('.x-account__container').css('margin-bottom', 150);
};

var isTimelineGenerated = false;

function timeline() {
	isTimelineGenerated = true;
	var elemTimeline = '<div class="x-timeline">' +
			'<ul>' +
			'<li class="x-timeline-realizado">' +
			'<span class="x-timeline-icon"></span>' +
			'<span class="x-timeline-label">Realizado</span>' +
			'</li>' +
			'<li class="x-timeline-seta"></li>' +
			'<li class="x-timeline-aprovado">' +
			'<span class="x-timeline-icon"></span>' +
			'<span class="x-timeline-label">Aprovado</span>' +
			'</li>' +
			'<li class="x-timeline-seta"></li>' +
			'<li class="x-timeline-faturado">' +
			'<span class="x-timeline-icon"></span>' +
			'<span class="x-timeline-label">Faturado</span>' +
			'</li>' +
			'<li class="x-timeline-seta"></li>' +
			'<li class="x-timeline-enviado">' +
			'<span class="x-timeline-icon"></span>' +
			'<span class="x-timeline-label">Preparando entrega</span>' +
			'</li>' +
			'<li class="x-timeline-seta"></li>' +
			'<li class="x-timeline-entregue">' +
			'<span class="x-timeline-icon"></span>' +
			'<span class="x-timeline-label">Enviado</span>' +
			'</li>' +
			'</ul>' +
			'</div>';

	var $allOrders = $(".myorders-list .ordergroup");
	$allOrders.each(function (key, val) {
		$(this).find('.order-header').after(elemTimeline);

		var status = $(this).find(".order-status").text();
		var steps = {
			"0": /processando/gi,
			"1": /aprovado/gi,
			"2": /preparando/gi,
			"3": /enviado/gi,
			"4": /entregue/gi,
			"5": /cancelado/gi
		};

		for (var i in steps) {
			if (steps.hasOwnProperty(i)) {
				if (status.search(steps[i]) != -1) {
					$(this).find(".x-timeline li").eq(i)
						.addClass("x-timeline-done")
						.prevAll()
						.addClass("x-timeline-done");
				}
			}
		}
	});
	console.log('hello');
};

function addEditSvg() {
	$('.edit-address-link .address-update').prepend('<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" x="0px" y="0px"><title>2Artboard 67</title><path fill="#cfcfcf" d="M68,2a6,6,0,0,0-4.24,1.76l-51,51a6,6,0,0,0-1.55,2.66l-9,33a6,6,0,0,0,7.37,7.37l33-9a6,6,0,0,0,2.66-1.55l51-51A6,6,0,0,0,98,32,30,30,0,0,0,68,2ZM25,81.15A12.06,12.06,0,0,0,18.85,75l3.51-12.86A18,18,0,0,1,37.83,77.65Z"/></svg>');
};

function changeLinkActive() {
	var accountLinks = document.querySelectorAll('.x-nav-account__link');
	var savedIndex = sessionStorage.getItem('currentLink');
	var url = window.location.pathname;

	// Remove classe 'active-nav-item' de todos elementos
	// e adiciona somente no item clicado
	var changelink = function(index){
		for(var i = 0; i < accountLinks.length; i++){
			accountLinks[i].classList.remove('active-nav-item');
		}
		accountLinks[index].classList.add('active-nav-item');
	};

	// Armazena o 'data-index' do item clicado
	var saveIndex = function(index) {
		sessionStorage.setItem('currentLink', index);
	};

	// Chama o evento de click nos links
	// e seta atributos 'data-index'
	for(var l = 0; l < accountLinks.length; l++){
		accountLinks[l].setAttribute('data-index', l);
		accountLinks[l].addEventListener('click', function(e){
			// Pega o index do elemento clicado
			saveIndex(e.currentTarget.dataset.index);
		}, false);
	}

	// Verifica se o index armazenado é existente
	// - Caso o index seja igual a nulo executa o código incluso dentro do escopo
	// - Se não utiliza o index armazenado
	if (savedIndex === null) {
		if(url === '_secure/account/'){
			changelink(0);
		} else if (url === '/_secure/account/orders'){
			changelink(1);
		} else if (url === '/_secure/account/wishlist'){
			changelink(2);
		}
	} else {
		changelink(savedIndex);
	}
};

function limitCaracters() {
	var shipNumber = $('#number');
	var shipInfos  = $('#complement');

	setInterval(function(){
		shipNumber.attr('maxlength', '10');
		shipInfos.attr('maxlength', '20');
	}, 100);
};

const removeCancelBtn = () => {
  let currentDate = new Date();
  let minutesToHide = 30;

  let allRequests = [];

  $('.myo-cancel-btn').addClass('x-hide');
  $('.myo-cancel-btn').each((i, element) => {
    let button = $(element)
    let orderBlock = button.closest('.myo-order-card')
    let id = orderBlock.find('.myo-order-id').text().replace('#','').trim()
    let url = '/api/checkout/pub/orders/'+id;
    allRequests.push(fetch(url))
  })

  Promise.all(allRequests)
    .then(async (r) => {
      return await Promise.all(r.map((e) => {
        return e.json();
      }));
    })
    .then((data) => {
      data.forEach((order) => {
        let button = $('.vtex-account__page-body.vtex-account__orders-list')
          .find('.myo-order-card.tedOrder' + order.orderId).find('.myo-cancel-btn');

        var creationDate = new Date(order.timeZoneCreationDate);
        if(currentDate-creationDate < minutesToHide*60*1000){
          button.removeClass('x-hide')
        }
      })
    })
};

$(document).ready(function () {
	$(".x-account__profile .profile-detail-display .profile-detail-display-email").after("<a href='/no-cache/user/logout' class='x-myaccount-logout'>sair</a>");
	interna();
	addEditSvg();
	changeLinkActive();
	limitCaracters();
	waitForElement('.myo-cancel-btn', function () {
		removeCancelBtn()
	  })
});
$(document).ajaxStop(function () {
	if (!isTimelineGenerated) {
		timeline();
	}
});

var rtime;
var timeout = false;
var delta = 200;

$(window).resize(function () {
	rtime = new Date();
	if (timeout === false) {
		timeout = true;
		setTimeout(resizeend, delta);
	}
});

function resizeend() {
	if (new Date() - rtime < delta) {
		setTimeout(resizeend, delta);
	} else {
		timeout = false;
		resizeModal();
	}
}

}