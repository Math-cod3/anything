var global = {

	newsletterRegister: function () {

        var $sectionForm = $(".lp-form"),
            $responseError =        $sectionForm.find(".lp-form__response--error"),
            $responseSuccess =      $sectionForm.find(".lp-form__response--success")
            $formFields =           $sectionForm.find(".lp-form__fields")


        $('.lp-form__submit-btn input').on('click', function(e) {
            e.preventDefault();

            var _that = $(this);
            var btnVal = _that.val();
            var parent = _that.parents($sectionForm);

            var nameUser = parent.find('#name').val();
            var emailUser = parent.find('#email').val();
            var cupon = "<p>BEMVINDO10</p>";

            function validateEmail(email) {
                var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                return re.test(email);
            }

            _that.val("Aguarde...").prop("disabled", true);

            if (nameUser.length > 0) {

                if(validateEmail(emailUser)) {
                    var jsonData = {
                        "name": nameUser,
                        "email": emailUser
                    };

                    // Requisição Ajax
                    vtexjs.checkout.getOrderForm().then(function(orderForm) {
                        $.ajax({
                            headers: {
                                "Accept": "application/vnd.vtex.ds.v10+json",
                                "Content-Type": "application/json",
                                "REST-Range": "resources=0-1"
                            },
                            type: 'GET',
                            url: "/api/dataentities/LD/search?_fields=id,email&_where=email=" + emailUser

                        }).done(function(clientInfo) {
                            if(clientInfo.length == 0) { // Não existe email
                                // var jsonData = {
                                //     "name": nameUser,
                                //     "email": emailUser
                                // };


                                $.ajax({
                                    url: '/api/dataentities/LD/documents/',
                                    dataType: 'json',
                                    type: 'PATCH',
                                    crossDomain: true,
                                    data: JSON.stringify(jsonData),
                                    headers: {
                                        'Accept': 'application/vnd.vtex.ds.v10+json',
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    success:function(emailUser) {
                                        $sectionForm.addClass('registred');
                                        $(parent).find('form').html("<div class='lp-form__response lp-form__response--success'></div>");
                                        $(parent).find('.lp-form__response--success').html("<p>E-mail cadastrado com sucesso!</p>")
                                        .hide()
                                        .fadeIn("slow", function() {
                                            $(parent).find('.lp-form__response--success');
                                        })
                                        // _that.val(btnVal).prop("disabled",false);
                                    }
                                });
                            } else {
                                $formFields.fadeOut();
								$responseError.html('E-mail já cadastrado!').fadeIn();
								_that.val(btnVal).prop("disabled", false);
								
								setTimeout(function() {
									$formFields.fadeIn();
									$responseError.html('').fadeOut();
								}, 3000)
                            }
                        })
                    });
                } else {
                    $formFields.fadeOut();
                    $responseError.html('E-mail inválido!').fadeIn();
					_that.val(btnVal).prop("disabled",false);
					
					setTimeout(function(){
						$formFields.fadeIn();
                        $responseError.html('').fadeOut();
					},3000)
                }
            } else {
                $formFields.fadeOut();
				$responseError.html('Por favor, preencha todos os campos!').fadeIn();
				_that.val(btnVal).prop("disabled", false);
				
				setTimeout(function() {
					$formFields.fadeIn();
					$responseError.html('').fadeOut();
				}, 3000)
            }
        });
        // $('.tryAgain').on('click', function(e) {
        //     e.preventDefault();
        //     var parent = $(this).parents('fieldset');
        //     $(parent).find('.erro').hide();
        //     $(parent).find('.campos').show();
        // });
    }
}

$(document).ready(function(){
    global.newsletterRegister();
})