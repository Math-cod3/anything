var bodiesInstitucional = "interna,a-marca,campanha,social,parcerias,franquias,multimarcas,politica-de-privacidade";
var institucionalPage = false;
$(bodiesInstitucional.split(",")).each(function(index,item){
	if($("body").attr("class").indexOf(item) > -1){
		institucionalPage = true;
	}
});

if(institucionalPage){
function interna() {
	var url = window.location.pathname.split('/');

	if (url[1] == 'institucional')
		$('body').addClass('interna');

	if (url[2] == 'campanha')
		$('body').addClass('campanha');

	$('.x-nav-institucional__item a[href="/institucional/' + url[2] + '"]').addClass('ativa');
};

function formulario() {
	var file = $('input[type=file]'),
	filename = $('.x-career__filename'),
	cep = $('.is--cep input');

	$('.is--jobtype input:first').prop('checked', 'checked');

	$('.x-career__fakeselect-text').off().on('click', function () {
		$(this).siblings('.x-career__fakeselect-drop').slideToggle('fast');
	});


	$('.x-career__fakeselect-container .x-career__group-input .x-career__label-text').off().on('click', function () {
		$(this).find('.x-career__input').prop('checked', 'checked');
		$(this).parents('.x-career__fakeselect-drop').slideToggle('fast');
		$(this).parents('.x-career__fakeselect-container').find('.x-career__fakeselect-text').text($(this).text());
	});

	cep.mask('99.999-999');

	cep.on('focusout', function () {
		if (cep.val().length == 10) {
			var numCep = cep.val().replace(/\D/g, '');
			$.getJSON("//viacep.com.br/ws/" + numCep + "/json/?callback=?", function (dados) {
				//Atualiza os campos com os valores da consulta.
				$(".is--address input").val(dados.logradouro);
				$(".is--neighborhood input").val(dados.bairro);
			});
		}
	});

	$('.is--tel1 input, .is--tel2 input').mask("(00) 0000-00009").blur(function (event) {
		if ($(this).val().length == 15) {
			$('#tel').mask('(00) 00000-0009');
		} else {
			$('#tel').mask('(00) 0000-00009');
		}
	});


	file.prop('accept', 'image/jpeg, application/pdf, .doc, .docx');

	file.on('change', function () {
		filename.text($(this).val().replace(/.*(\/|\\)/, ''));
	});

	$('.x-career__cancel').on('click', function () {
		filename.text('Selecione um arquivo');
	});
};

function insertHr() {
	// CAMPANHA
	$('.x-campaign__title').append('<hr>');
};

function toggleAccordion() {
	$('.x-service__pages h6').on('click', function () {
		$(this).toggleClass('active').next().slideToggle();
	});
};

function sectionHandler() {
	var currentHash = window.location.hash;

	if (currentHash) {
		goToSection(currentHash);
	}

	$('a.x-service__topic').on('click', function (e) {
		e.preventDefault();
		var id = $(this).attr('href');
		window.location.hash = id;
		goToSection(id);
	});
};

function goToSection(id) {
	$('.x-service__pages > div').hide(0);
	var $elem = $(id);

	if (!$elem.length) return;

	$elem.show(0);
	$('html,body').animate({
		scrollTop: $elem.offset().top - 100
	}, 500);
};

function checkFormStatus() {
	var hash = window.location.hash;

	if (hash === '#success') {
		$('.x-career__form-container')
		.empty().append(
			$('h3').text('Sua inscrição foi feita com sucesso. Em breve entraremos em contato.').addClass('x-success')
			)
	}

	if (hash === '#error') {
		$('.x-career__form-container')
		.empty().append(
			$('h3').text('Ops! Algo deu errado. Tente novamente mais tarde.').addClass('x-error')
			)
	}

	window.location.hash = "";
};

function removeEmptyCampaigns() {
	var $campaignTop = $('.x-campaign-intern__top');
	if (!$campaignTop.children('.x-campaign-intern__title-container h3').html()) $campaignTop.hide();

	var $campaignInternText = $('.x-campaign-intern__text');
	if (!$campaignInternText.html()) $campaignInternText.hide();

	var $campaignInternFullBanner = $('.x-campaign-intern__fullbanner');
	$campaignInternFullBanner.each(function (index) {
		if (!$(this).html()) $(this).hide();
	});

	var $campaignInternDoubleBanner = $('.x-campaign-intern__double-banner');
	if (!$campaignInternDoubleBanner.html()) $campaignInternDoubleBanner.hide();

	var $campaignBottom = $('.x-campaign-intern__bottom');
	if (!$campaignBottom.children('.x-campaign-intern__title-container h3').html()) $campaignBottom.hide();
};

function changeLinkActive() {
	var page2 = location.pathname.toString().toLowerCase();
	$(document).ready(function () {
        $('.x-nav-institucional__link').filter(function () {
            return $(this).attr('href').toLowerCase() == page2;
        }).addClass("active-nav-item");
    });
};

function removeModalMap() {
	var modalStore = document.querySelectorAll('.x-store-modal');

	if(modalStore){
		for (var i = 0; i < modalStore.length; i++) {
			modalStore[i].remove();
			console.log('Removed item index: ', i);
		}		
	}
};

$(function () {
	"use strict";
	removeModalMap();
	interna();
	toggleAccordion();
	sectionHandler();
	formulario();
	insertHr();
	checkFormStatus();
	removeEmptyCampaigns();
	changeLinkActive();
});

}