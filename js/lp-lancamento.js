const Methods = {
	init() {
		if($('body.realidades-inventadas').length > 0){
			Methods.backgroundNews();
			Methods.sendFormCaps();
			Methods.copyToClipboard();
			Methods.youtubeLinks();
			Methods.sliderInstaBox();
			Methods.sliderCategoryBox();
			Methods.sliderLookBox();
		}
	},
	
	backgroundNews(){
		const myNewsBg = $('.newsletter-box--bg img').attr('src');
		$('.newsletter-box').attr('style', 'background: url("'+myNewsBg+'") no-repeat scroll 0 0 transparent;');
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
				
				console.log(data)
				
				fetch('/api/dataentities/LD/documents?an=mariafilo', {
					method: "PATCH",
					headers: headers,
					body: JSON.stringify(data)
				}).then(res => {
					console.log(res);
					$('.newsletter-box--top').addClass('hide');
					$('.newsletter-box--bottom').addClass('hide');
					$('.newsletter-box--bottom--success').removeClass('hide');
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
	
			$('.newsletter-box--bottom--success__excerpt').addClass('hide');
			$('.newsletter-box--bottom--success__cupom').addClass('hide');
	
			$('.newsletter-box--bottom--success__excerpt-done').removeClass('hide');
			$('.newsletter-box--bottom--success__cupom-done').removeClass('hide');
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

	sliderCategoryBox() {
		$('.category-box--use__list').slick({
			infinite: true,
			arrows: true,
			dots: false,
			slidesToShow: 5,
			slidesToScroll: 3,
			variableWidth: true,
		});
	},

	sliderLookBox() {
		$('.look-box--use__list').slick({
			infinite: true,
			arrows: true,
			dots: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			variableWidth: true,
		});
	}
};

document.addEventListener('DOMContentLoaded', () => {
	Methods.init();
});