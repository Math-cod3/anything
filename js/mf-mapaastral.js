if($("body").hasClass("mapaastral")){

	function maskHour(){
		$(".horanascimento").bind("keydown",function(e){
			if (e.keyCode != 46 && e.keyCode != 8) {
      	var length = $(".horanascimento").val().length;
      	if(length === 2){
      		$(".horanascimento").val($(".horanascimento").val() + ":");
      	}
      }
		});
	}

	function getCities(){
		var citySuggestions = "<ul class='citySuggestions'></ul>";
		$(".rxAstralForm__group:eq(1)").append(citySuggestions);

		$(".cidadenascimento").keyup(function(){
			var citytext = $(".cidadenascimento").val();
			const request = new XMLHttpRequest()
			request.open('GET', 'http://astralmapa.com.br/api/location/br?token=17838c6eb87b117c769f466e3f757f&query='+citytext);
			request.onload = function () {
				var response = JSON.parse(this.responseText);
				$(".citySuggestions").html("");
				$(".citySuggestions").show();
			  for(var i = 0; i < response.length; i++){
			  	var newSuggestion = `<li data-lat="${response[i].latitude}" data-lng="${response[i].longitude}">${response[i].cidade}</li>`;
			  	$(newSuggestion).appendTo(".citySuggestions");
			  }
			}
			request.onerror = function () {
			  console.log('Erro ao consultar API');
			}
			request.send();
		});

		$("body").on("click",".citySuggestions li",function(){
			$("input.cidadenascimento").val($(this).text());
			$(".citySuggestions").hide();
			$(".citySuggestions").attr("data-lat",$(this).attr("data-lat"));
			$(".citySuggestions").attr("data-lng",$(this).attr("data-lng"));
		});
	}

	function chart(a,b,c,d){
		new Chart(document.getElementById("elementsChart"), {
		  type: "doughnut",
		  options:{
		  	legend: {
		  	    display: false
		  	},
		    plugins: {
	        labels: {
	          render: 'percentage',
	          fontColor: 'white',
	          precision: 2
	        }
	      }
		  },
		  data: {
		  	labels: ['Fogo','Água','Ar','Terra'],
		    datasets: [
		      {
		        data: [a, b, c,d],
		        backgroundColor: [
		          "#A1010B",
		          "#84A39F",
		          "#D1836A",
		          "#38503E"
		        ]
		      }
		    ]
		  }
		});
	}

	function sendInfos(){

		$(".rxAstralForm__group .rxAstralFormSend").click(function(){

			var lead = {};
			lead.name = $(".nome").val();
			lead.email = $(".email").val();

			$.ajax({
				accept: "application/vnd.vtex.ds.v10+json",
				contentType: "application/json; charset=utf-8",
				crossDomain: !0,
				data: JSON.stringify(lead),
				type: "POST",
				url: "https://homologmariafilo.myvtex.com/api/dataentities/SG/documents",
				success: function(lead) {
					console.log("Response",lead);
			  }
			});

			var userName = $(".rxAstralForm__group input[name='nome']").val();
			var userBirthdate = $(".nascimento").val().split("-");
			var userLat = $(".citySuggestions").attr("data-lat");
			var userLng = $(".citySuggestions").attr("data-lng");
			userBirthdate = `${userBirthdate[2]}/${userBirthdate[1]}/${userBirthdate[0]}`;
			var birthHour = $(".horanascimento").val();

			if($(".semdata").is(":checked")){
				birthHour = "0";
			}

			if(userName && userBirthdate && userLat && userLng && birthHour){
				var userInfos;
				if($(".semdata").is(":checked")){
					userInfos = `date=${userBirthdate}&latitude=${userLat}&longitude=${userLng}`;
				}
				else{
					userInfos = `date=${userBirthdate}&time=${birthHour}&latitude=${userLat}&longitude=${userLng}`;
				}
				var http = new XMLHttpRequest();
				var url = 'https://astralmapa.com.br/api/elements';
				var params = 'token=17838c6eb87b117c769f466e3f757f&'+userInfos;
				http.open('POST', url, true);

				http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

				http.onreadystatechange = function() {
				    if(http.readyState == 4 && http.status == 200) {
				    	$(".rxAstral__step1").addClass("hidden");
				    	$("body,.rxAstral__step2").addClass("active");
				    	$(".rxAstralResult__text span strong").text(`Oi, ${userName}!`);
				    	$(".rxAstralResult__shelf-collection > span > .eshelf > ul").slick("refresh");
				      
				    	var response = JSON.parse(http.responseText);

				    	var starSun = response.stars[0].sign.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
				    	var starElement = response.element;
				    	
				    	setInfos(starSun,response);

				    }
				}
				http.send(params);
			}
			else{
				if(userName && userBirthdate && birthHour && !userLat){
					alert("Selecione uma cidade na lista.");
				}
				else{
					alert("Por favor, revise todos os dados e tente novamente");
				}
			}

		});

	}

	function setInfos(sun,result){

		$(`<img src="/arquivos/astral-${sun}.png" />`).insertBefore(".rxAstralResult__text span");

		$(`.rxAstralResult__product iframe[class='${sun}']`).addClass("active");
		var selectedId = $(`.id-produto-${sun}`).text();
		var settings = {
		  "url": "/api/catalog_system/pub/products/search/?fq=productId:"+selectedId,
		  "method": "GET",
		  "timeout": 0,
		  "headers": {
		    "Accept": "application/json",
		    "Content-Type": "application/json"
		  },
		};
		$.ajax(settings).done(function (response) {
			var hlProductImg = '<a href="'+response[0].link+'"><img src="'+response[0].items[0].images[0].imageUrl+'" /></a>';
			var hlProductName = response[0].productName.split(" ")[0] + " " +response[0].productName.split(" ")[1];
			$(hlProductImg).insertBefore(".rxAstralResult__product-product span:eq(1)");
			$(".rxAstralResult__product-product span p").text(hlProductName);
			$(".rxAstralResult__product-product a").attr("href",response[0].link);

			for(var i = 0; i < response[0].items.length; i++){
				if(response[0].items[i].sellers[0].commertialOffer.AvailableQuantity > 0){
					$(".rxAstralResult__product-product span strong").text("R$ "+response[0].items[i].sellers[0].commertialOffer.Price);
				}
			}
		});

		chart(result.elements.fire,result.elements.water,result.elements.air,result.elements.earth);

		for(var k = 0; k < result.interpretations.length; k++){

			var title = result.interpretations[k].title
			.replace("Fogo","<strong class='fogo'>Fogo</strong>")
			.replace("Terra","<strong class='terra'>Terra</strong>")
			.replace("Ar","<strong class='ar'>Ar</strong>")
			.replace("Água","<strong class='agua'>Água</strong>");

			var interpretation = `
			<span>
			    <h3>${title}</h3>
			    <p>${result.interpretations[k].description}</p>
			</span>
			`;
			$(".rxAstralResult__result-view--infos").append(interpretation);
			if(k === 0){
				var dominant = result.interpretations[i].title.split(" ")[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
				$(`.rxAstralResult__shelf-options li.${dominant},.rxAstralResult__shelf-collection .cl-${dominant}`).addClass("active");
			}
		}

	}

	function slickShelf(){
		$(".rxAstralResult__shelf-collection > span > .eshelf > ul").slick({
			slidesToShow:3,
			slidesToScroll:1
		});
	}

	function shelf(){
		$(".rxAstralResult__shelf-options ul li").click(function(){
			$(".rxAstralResult__shelf-options ul li").removeClass("active");
			$(this).addClass("active");
			$(".rxAstralResult__shelf-collection > span").removeClass("active");
			$(".rxAstralResult__shelf-collection > span:eq("+$(this).index()+")").addClass("active");
			$(".rxAstralResult__shelf-collection > span > .eshelf > ul").slick("refresh");
		});
	}


	$(document).ready(function(){
		maskHour();
		getCities();
		sendInfos();
		slickShelf();
		shelf();
	});

}