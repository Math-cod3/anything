if($("body").hasClass("lp-cadastro")){
function sendForm(){

  // $('.lpCap__form form input[name="phone"]').mask('(00) 00000-0000');
  $(".modal .closeModal").click(function(){
    $(".overlayModal,.modal").removeClass("active");
  });


  $("#newsletterLP button").click(function(){

    // $('#newsletterLP input').closest('.newsletter-input').removeClass("error");
    $(".newsletter-error").removeClass("active");

    var e = {};
    e.name = $('#newsletterLP input[name="nome"]').val();
    e.email = $('#newsletterLP input[name="email"]').val();
    e.event = $('#newsletterLP input[name="evento"]').val();

    if(e.name !== "" && e.email !== ""){
      if (e.email.match(/[^@]+@[^@]+\.[^@]+/)){
        $.ajax({
          accept: "application/vnd.vtex.ds.v10+json",
          contentType: "application/json; charset=utf-8",
          crossDomain: !0,
          data: JSON.stringify(e),
          type: "PATCH",
          url: "/api/dataentities/LD/documents",
          success: function(b) {
            $(".overlayModal,.modal").addClass("active");
          },
          error: function(b) {
            $(".newsletter-error .mensagem").html("Erro ao enviar os dados. Tente novamente mais tarde.");
            $(".newsletter-error").addClass("active");
          }
        });
      }
      else{
        $(".newsletter-error .mensagem").html("O seu e-mail parece estar incorreto. Tente novamente!");
        $(".newsletter-error").addClass("active");
        // $('#newsletterLP input[type="email"]').closest('.newsletter-input').addClass("error");
      }
    }
    else{
      $(".newsletter-error .mensagem").html("Verifique os dados digitados e tente novamente");
      $(".newsletter-error").addClass("active");
      // $('#newsletterLP input').each(function(){
      // 	if($(this).val() === ""){
      // 		$(this).closest('.newsletter-input').addClass("error");
      // 	}
      // });
    }

  });

}

function vitrineCarousel() {
  var options = {
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    autoplay: false,
    fade: false,
    dots: false,
    variableWidth: false,
    speed: 300,
    arrows: true
  }
  var $vitrineProdutos = $('.x-por-dentro-instagram');

  $vitrineProdutos.slick(options);
};

$(document).ready(function(){
	sendForm();
  vitrineCarousel();
});
}