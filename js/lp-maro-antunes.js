if($("body").hasClass("maro")){

	$(document).ready(function(){

		const pdtShelf = `
		<div class="outShelf">
		<span>
		<img src="https://mariafilo.vteximg.com.br/arquivos/maro-caneca-zebra-ot.png" />
		<p>Produto Esgotado</p>
		</span>
		<span>
		<img src="https://mariafilo.vteximg.com.br/arquivos/maro-caneca-onca-ot.png" />
		<p>Produto Esgotado</p>
		</span>
		</div>
		`;

		const pdtForm = `
		<section class="newsletter-home" style=" display: flex; justify-content: center; align-items: center; margin: 60px 0; "><div class="newsletter-left"> 
		    <img src="/arquivos/newslettermail.png">
		    <div class="newsletter-left-content">
		        <div class="newsletter-title">
					CADASTRE-SE E FIQUE POR DENTRO
				</div>
		        <div class="newsletter-subtitle">
					SEJA A 1° A SABER QUANDO AS CANECAS FICAREM DISPONÍVEIS NOVAMENTE.
				</div>
		    </div>
		</div>

		<div class="newsletter-right">
		    <input type="text" id="nomenews" name="nomenews" placeholder="Qual é o seu nome?">
		    <input type="email" id="emailnews" name="emailnews" placeholder="E o seu e-mail?">
		    <span class="send-newsletter"> 
		        <img src="/arquivos/Avançar.png" alt="avancar"> 
		    </span>
		</div>

		<div class="newsletter-success" style="display: none">

		    <img src="/arquivos/circlecheck.png?v=637592943666770000">

		    <div class="newsletter-success-left">
		        <div class="newsletter-success-title">TUDO CERTO, <span class="success-name"></span>
		        </div>
		        <div class="newsletter-success-subtitle">
		            AVISAREMOS ASSIM QUE OS NOSSOS PRODUTOS ESTIVEREM DISPONÍVEIS NOVAMENTE!
		        </div>
		        <!-- <div class="newsletter-success-asterisk">
		        Configure o conteúdo que deseja receber <a href="#">aqui</a>
		    </div> -->
		    </div>
		</div>

		</section>
		`

		if($(".maroShelf .prateleira").length < 1){
			$(pdtShelf).insertBefore(".maroShelf > span");
			$(pdtForm).insertAfter(".maroShelf");
			$(".maroShelf > span a").hide();
		}

		$("body").on("click",".send-newsletter",function(){


			var e = {};
				e.nome = $('input[name="nomenews"]').val();
				e.email = $('input[name="emailnews"]').val();

			if(e.nome != "" && e.email != ""){
				if (e.email.match(/[^@]+@[^@]+\.[^@]+/)) {
				   $.ajax({
				   	accept: "application/vnd.vtex.ds.v10+json",
				   	contentType: "application/json; charset=utf-8",
				   	crossDomain: !0,
				   	data: JSON.stringify(e),
				   	type: "PATCH",
				   	url: "/api/dataentities/LM/documents",
				   	success: function(b) {
				   		$(".success-name").text(e.nome);
				   		$(".newsletter-right,.newsletter-left").hide();
				   		$(".newsletter-success").show();
				   	},
				   	error: function(b) {
				   		alert("Erro ao enviar os dados. Tente novamente mais tarde.");
				   	}
				   });
				 } else {
					alert("Erro! Verifique os dados inseridos e tente novamente.")
				}
			}
			else{
				alert("Erro! Preencha todos os dados.");
			}

		});
		
	});
}