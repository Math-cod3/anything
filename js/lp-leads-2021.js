const Methods = {
	init() {
		if($('body.bem-vindo').length > 0){
			Methods.backgroundNews();
			Methods.sendFormCaps();
			Methods.copyToClipboard();
			Methods.youtubeLinks();
			Methods.sliderInstaBox();
			Methods.scrollToArea();
			Methods.lpNewsletter();
		}
	},
	
	backgroundNews(){
		const myNewsBg = $('.newsletter-box--bg img').attr('src');
		$('.newsletter-box').attr('style', 'background: url("'+myNewsBg+'") no-repeat scroll 0 0 transparent;');
	},

	scrollToArea() {

		$(".newsletter-box--bottom__btn").click(function() {
			$('html, body').animate({
				scrollTop: $("#video-area").offset().top - 10
			}, 1000);
		});

		$(".newsletter-box--bottom--success--lnkvantagens").click(function() {
			$('html, body').animate({
				scrollTop: $("#vantagens").offset().top
			}, 2000);
		});
	},

	sendFormCaps() {
		try {
			const formNewsCaps = document.querySelector('.newsletter-box--bottom form');
			
			const userData = {
				name: document.querySelector(".newsletter-input--name"),
				email: document.querySelector(".newsletter-input--email"),
				phone: document.querySelector(".newsletter-input--phone"),
				event: document.querySelector(".newsletter-input--evento")
			};

			formNewsCaps.addEventListener('submit', ev => {
				ev.preventDefault();

				var personName = $(".newsletter-input--name").val();
				$('#name-cad').text(personName);
				
				const headers = new Headers({
					"Content-Type": "application/json",
					"Accept": "application/vnd.vtex.ds.v10+json",
				});

				const data = {
					'name': userData.name.value,
					'email': userData.email.value,
					'phone': userData.phone.value,
					'event': userData.event.value
				};
				
				fetch('/api/dataentities/LD/documents?an=mariafilo', {
					method: "PATCH",
					headers: headers,
					body: JSON.stringify(data)
				}).then(res => {
					console.log(res);
					$('.newsletter-box--top').fadeOut();
					$('.newsletter-box--bottom').fadeOut();
					$('.newsletter-box--bottom--success').fadeIn();
				}).catch(err => {
					console.log(err);
				});
			});
		} catch(e) {
			console.warn("Não existe newsletter nessa página.");
		}
	},

	youtubeLinks(){
		$('.youtube-area--list a').each(function(){
			$(this).attr('target', '_blank');
		});
	},

	copyToClipboard() {
		$('.newsletter-box--bottom--success__cupom').on('click', function(){
			var copyText = document.getElementById("cupom");
			var textArea = document.createElement("textarea");
			textArea.value = copyText.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("Copy");
			textArea.remove();

			$('.newsletter-box--bottom--success__excerpt').fadeOut();
			$(this).next().fadeIn();
			$(this).prev().fadeIn();
			$(this).fadeOut();
		});
	},

	sliderInstaBox() {
		$('.insta-box--use__list').slick({
			infinite: true,
			arrows: true,
			dots: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			focusOnSelect: true,
			variableWidth: true,
		});
	},

	lpNewsletter() {
		$(".submit-newsletter").on("click", function(e) {
			e.preventDefault();
	
			var nameUser = $('#nomenews').val();
			var emailUser = $('#emailnews').val();
			var phoneUser = $('#phonenews').val();
	
			if ((nameUser.length > 0) && (emailUser.length > 0)) {    // se usuario e email estiverem preenchidos
				var jsonData = {
					"email": emailUser,
					"name": nameUser,
					"phone": phoneUser
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
									setTimeout(function() {
										var nomesucesso = $('#nomenews').val();
										$("#name-cad").text("");
										let myStr = nomesucesso;
										let firstName = myStr.split(" ")[0];
										$("#name-cad").append(firstName);
									}, 500);
									$('.newsletter-box--top').fadeOut();
									$('.newsletter-box--bottom').fadeOut();
									$('.newsletter-box--bottom--success').fadeIn();
									
								}
							});
							
						} else {    // Existe email
							alert("E-mail já cadastrado!");
						}
					})
				});    // fim do ajax
	
			} else {
				$("#nomenews").after("<div class='newsalert'>Campo obrigatório</div>");
				$("#emailnews").after("<div class='newsalert'>Campo obrigatório</div>");
				$("#nomenews").after("<img src='/arquivos/error.png' class='newsalert-img' />");
				$("#emailnews").after("<img src='/arquivos/error.png' class='newsalert-img' />");
			}
		});	
	}
};

document.addEventListener('DOMContentLoaded', () => {
	Methods.init();
});