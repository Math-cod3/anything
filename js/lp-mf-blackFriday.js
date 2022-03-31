if($("body").hasClass("mf-blackFriday")){
	function sendForm(){
	
		$('.lpCap__form form input[name="phone"]').mask('(00) 00000-0000');
	
		$(".lpCap__form form a").click(function(){
	
			var e = {};
			e.name = $('.lpCap__form form input[name="name"]').val();
			e.mail = $('.lpCap__form form input[name="mail"]').val();
			e.tel = $('.lpCap__form form input[name="phone"]').val();
	
			if(e.name !== "" && e.mail !== "" && e.tel !== ""){
				if (e.mail.match(/[^@]+@[^@]+\.[^@]+/)){
					$.ajax({
					 accept: "application/vnd.vtex.ds.v10+json",
					 contentType: "application/json; charset=utf-8",
					 crossDomain: !0,
					 data: JSON.stringify(e),
					 type: "PATCH",
					 url: "https://www.mariafilo.com.br/api/dataentities/HF/documents",
					 success: function(b) {
						 $(".overlayBf,.modalBf").addClass("active");
						 $(".modalBf .closeModal").click(function(){
							 $(".overlayBf,.modalBf").removeClass("active");
						 });
					 },
					 error: function(b) {
						 alert("Erro ao enviar os dados. Tente novamente mais tarde.");
					 }
					});
				}
				else{
					alert("O seu e-mail parece estar incorreto. Tente novamente!");
					$('.lpCap__form form input[type="email"]').addClass("error");
				}
			}
			else{
				alert("Um ou mais campos não foram preenchidos.");
				$('.lpCap__form form input').each(function(){
					if($(this).val() === ""){
						$(this).addClass("error");
					}
				});
			}
		});
	}
	
	function countDownTopBar(){
		var $countdown = $('.top-bar .countdown');
	
		// Set the date we're counting down to
		var data = $countdown.attr('data-time').trim().replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/, '$2/$1/$3 $4:$5:$6');
		// var countDownDate = new Date(`11-24-2020 00:00:00`).getTime();
	
		//if($(".top-bar").attr('data-countdown') != 'time'){
			if (data != '') {
				data = data.replace(/-/g, '/');
				var countDownDate = new Date(data).getTime();
	
				// Update the count down every 1 second
				var x = setInterval(function () {
	
					// Get todays date and time
					var now = new Date().getTime();
	
					// Find the distance between now and the count down date
					var distance = countDownDate - now;
					//console.log(distance)
	
					// Time calculations for days, hours, minutes and seconds
					var days = Math.floor(distance / (1000 * 60 * 60 * 24));
					var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + (hours * 60);
					var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
					if (minutes < 10) {
						minutes = "0" + minutes;
					}
					else if(minutes == 60){
						minutes = "00";
					}
					else if(minutes > 60){
						minutes = minutes % 60;
						if (minutes < 10) {
							minutes = "0" + minutes;
						}
					}
	
					if (seconds < 10) {
						seconds = "0" + seconds;
					}
	
					// Output the result in an element with id="demo"
					// document.querySelector("#countDown").innerHTML = days + "d " + hours + "h "
					// + minutes + "m " + seconds + "s ";
					$countdown.html(`
							<div class="countDown-counter"><span class="value">${days}</span><span>Dias</span></div>
							<div class="countDown-counter"><span class="value">${hours}</span><span>Horas</span></div>
							<div class="countDown-counter"><span class="value">${minutes}</span><span>Minutos</span></div>
							<div class="countDown-counter"><span class="value">${seconds}</span><span>Segundos</span></div>
						`)
	
					// If the count down is over, write some text
					if (distance < 0) {
						clearInterval(x);
						$countdown.html(`
									<div class="countDown-counter"><span class="value">00</span><span>Dias</span></div>
									<div class="countDown-counter"><span class="value">00</span><span>Horas</span></div>
									<div class="countDown-counter"><span class="value">00</span><span>Minutos</span></div>
									<div class="countDown-counter"><span class="value">00</span><span>Segundos</span></div>
								`)
					}
				}, 1000);
			}
	
	}
	
	function mountCountdown(){
		$('<div class="top-bar"></div>').insertBefore(".lpCap__form");
		var topbar = '<div class="topbarCountdown">\
			<div class="content">\
				<div class="topbarCountdown__infos">\
						<div class="info">\
							<div class="titulo">Falta pouco para você ficar sorrindo à toa. <strong>Saiba em primeira mão!</strong></div>\
						</div>\
				</div>\
				<div class="topbarCountdown__countdown">\
					<div class="countdown" data-time="11-23-2021 00:01:00"></div>\
				</div>\
		</div>\
		</div>';
		$(topbar).appendTo(".top-bar");
		$(".top-bar").addClass("js-active");
	}
		$(document).ready(function(){
			sendForm();
			mountCountdown();
			countDownTopBar();
		});
	}
