if($("body").hasClass("interna")){

$(function(){
    /*
    ********************************************
    * MODEL - Where all the data is stored
    ********************************************
    */
    var appData = {
        init: function(callback){
            this.fillStaticData();
            this.getData(callback);
            this.getCache();
        },

        fileRules: {
            size: 4e+6,
            formats: ['image', 'jpeg', 'png', 'image/jpeg', 'image/png']
        },

        _staticFields: [
            {
                "id": 1,
                "title": "E-mail",
                "raw_title_in_portal": "E-mail",
                "raw_title": "e-mail",
                "active": true,
                "required": true,
                "visible_in_portal": true,
                "required_in_portal": true,
            },
            {
                "id": 2,
                "title": "Anexo",
                "raw_title_in_portal": "Anexo",
                "raw_title": "anexo",
                "active": true,
                "required": false,
                "visible_in_portal": true,
                "required_in_portal": false,
                "type": "file"
            },
            
            {
                "title": "Assunto",
                "raw_title_in_portal": "Assunto",
                "raw_title": "subject",
                "active": true,
                "required": true,
                "visible_in_portal": true,
                "required_in_portal": true,
                "type": "text"
            }
        ],
        
        // all data came from the ajax request
        _store: [],
        
        // all data came from the DOM
        _elems: {},
        
        // set the cached DOM elements
        getCache: function(){
            this._elems._form = $('.js--talk-with-us');
        },
        
        // util: used to get any stored dom element
        getElem: function(key){
            return this._elems['_'+key];
        },

        // util: used to get any stored dom element
        setElem: function(key, value){
            this._elems['_'+key] = value;
        },
        
        // get all data the application needs to build the form
        getData: function(afterAjaxCompleted){
            var _this = this;
            $.ajax('https://mariafilo.zendesk.com/api/v2/ticket_fields.json',{
                headers: {
                    'Authorization': 'Bearer 1a640d605cac951260bd45e2d758870252260f073951d969431e02d8e663ef19'
                }
            })
            .then(function(data){
                if( data.ticket_fields ){
                    data.ticket_fields.forEach(function(obj){ _this._store.push(obj); });
                    afterAjaxCompleted.call();
                }
            })
        },

        // add custom data to the store array
        setData: function(obj_data){
            this._store.push(obj_data);
        },
        
        // util: return all model data stored
        getStore: function(){
            return this._store;
        },
        
        // util: send all data to zendesk
        submitToZendesk: function(dataToSend, afterAjaxCompleted){
            $.ajax('https://app.enext.com.br/email/maria-filo/zendesk/',{
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(dataToSend),
            }).done(function(data){
                console.log(JSON.parse(data));
                afterAjaxCompleted.call(null, data);
            });
        },

        sendAttachment: function(dataToSend, afterAjaxCompleted){
            $.ajax('https://app.enext.com.br/email/maria-filo/zendesk/upload.php',{
                type: 'POST',
                dataType: 'json',
                data: dataToSend,
                contentType: false,
                cache: false,
                processData: false,
                async: false
            }).done(function(data){
                console.log(JSON.parse(data));
                afterAjaxCompleted.call(null, data);
                console.log('DONE AJAX ENEXT');
            });
        },

        fillStaticData: function(){
            var _this = this;
            this._staticFields.forEach(function(obj){
                _this.setData(obj);
            });
        },

        getFinalData: function(){
            var $form = this.getElem('form');
            
            // final format that the Zendesk API requires to be sent
            var finalData = {
                ticket: {
                    custom_fields: [],
                    requester: { 
                        name: null,
                        email: null
                    }
                }
            };
            
            $form.find('.x-talk-with-us__input').each(function(){
                var $field = $(this);
                if( $field.data('custom-field') ){
                    finalData.ticket.custom_fields.push({ 
                        id : $field.data('field-id'),
                        value: $field.val()
                    });
                }
                else if( $field.attr('name') == 'Nome' ){
                    finalData.ticket.requester.name = $field.val();
                }
                else if( $field.attr('name') == 'Descrição' ){
                    finalData.ticket.comment = { body: $field.val() };
                }
                else if( $field.attr('name') == 'e-mail' ){
                    finalData.ticket.requester.email = $field.val();
                }
                else{
                    finalData.ticket[$field.attr('name')] = $field.val();
                }
            });
            
            console.log(finalData);

            return finalData;
        }
    };
    
    
    /*
    ********************************************
    * VIEW - Where all the data is printed on html
    ********************************************
    */
    var appView = {
        init: function(){
            this.buildForm();
            this.submitFormHandler();
            this.stepHandler();
            this.inputFileName();
        },
        inputFileName: function(){
            var fileInput  = document.querySelector( "input[type='file']" );
            fileInput.addEventListener( "change", function( event ) {  
                var nome = document.querySelector('input[type="file"]').files[0].name;
                $(".file-return").html(nome);
            });  
        },
        
        // build all inputs and append it to the form
        buildFields: function(fields){
            fields.forEach(function(field){
                if( !field.active || !field.visible_in_portal ) return true;
                console.log(field)
                var $fieldset = $('<fieldset>').addClass('x-talk-with-us__field');
                var $label = $('<label>');
                var $name = $('<span>').addClass('x-talk-with-us__label');
                var $input;
                var $fakeSelectWrapper = null;
                var $fakeSelectPicked = null;
                
                // if it is a custom field it builds an select input
                if( field.custom_field_options ){
                    $input = $('<select>').addClass('x-talk-with-us__input is--hidden');

                    field.custom_field_options.forEach(function(optField){
                        var $opt = $('<option>');
                        $opt.text(optField.name).attr('value', optField.value);

                        if( optField.default ){
                            $opt.attr('selected', 'selected');
                        }

                        $input.append($opt);
                    });

                    $fakeSelectWrapper = appView._buildSelectBySteps(field.custom_field_options);
                    $fakeSelectPicked = '<button type="button" class="x-talk-with-us__picked-text js--toggle-pick-drop"> - </button>';

                // if it is a a description it builds an textarea input
                }else if( field.type === 'description' ){
                    $input = $('<textarea>').addClass('x-talk-with-us__input');
                // else, it builds a normal input
                }else if( field.type === 'file' ){
                    $input = $('<input type="file" value="anexar arquivo" />');
                }else{
                    $input = $('<input>').addClass('x-talk-with-us__input');
                }
                
                // check if the field is a custom one
                if( !field.required_in_portal || field.custom_field_options){
                    $input.attr('data-custom-field', 'true');
                }

                var titleField = field.raw_title_in_portal;
                var nameField = field.raw_title;
                var idField = field.id;
                var requiredField = field.required_in_portal;
                
                
                // put all together
                //------------------------------
                
                $name.text(titleField).append(function(){
                    return requiredField ? '<b> *</b>' : false;
                });

                $input.attr("required", requiredField).attr("name", nameField).attr("data-field-id", idField);

                $label.append($name).append($input);
                if( field.type === 'file' ){
                    $label.append('<input type="button" value="Escolher arquivo">');
                    $label.append('<p class="file-return">Nenhum arquivo selecionado</p.');
                }
                $fieldset.append($label).append($fakeSelectWrapper).append($fakeSelectPicked);
                
                var $form = appData.getElem('form');
                
                // show
                $form.append($fieldset);
            });
        },
        
        // build the submit section of the form
        buildSendSection: function(fields){
            var $btn = $('<button>').addClass('x-talk-with-us__btn').text('Enviar');
            var $section = $('<div>').addClass('x-talk-with-us__send').append($btn);
            var $form = appData.getElem('form');
            $form.append($section);
        },
        
        // build all form HTML
        buildForm: function(){
            var fields = appController.getFormFields();
            console.log(fields);
            this.buildFields(fields);
            this.buildSendSection(fields);
        },
        
        // control the submit form event
        submitFormHandler: function(){
            var $form = appData.getElem('form');
            var _this = this;

            $form.on('submit', function(){
                var fileData = this.elements['anexo'].files;
            
                var validFile = appController.validateFileContent(fileData);
                if( validFile ){
                    appController.submitAttachment();
                }else{
                    _this.fileErrorMessage();
                }

                return false;
            })
        },


        _buildSelectBySteps: function(infos){
            var objOptions = infos.map(function(item, i){
                item.optionsArray = item.raw_name.split(/\:\:/gim);
                return item;
            });

            var $divs = [];

            var optsFiltered = {};
            console.log(objOptions);
            
            objOptions
            .forEach(function(item, index){
                
                var name = item.raw_name.split(/\:\:/);
                var mainName = name[0];
                
                item.optionsArray
                    .forEach(function(label, i){
                        if( !optsFiltered[mainName] ) optsFiltered[mainName] = [];
                    
                        if( optsFiltered[mainName].indexOf(label) !== -1 ) return true;
                        optsFiltered[mainName].push( label );

                        if( !$divs[i] ) {
                            $divs[i] = $('<div class="x-talk-with-us__stepitem js--step-select">');
                        }
                        
                        var nameFilter = i ? mainName + name[1] : mainName;
                        $divs[i].append('<button type="button" class="x-talk-with-us__stepbtn js--pick-step" data-value="'+label+'" data-filter="'+nameFilter+'">'+label+'</button>');
                    });

            });

            var $wrapper = $('<div class="x-talk-with-us__stepselect">');
            $divs.forEach(function(div, index){
                if( index === 0 ){
                    div.addClass('is--active');
                }

                $wrapper.append(div);
            });

            return $wrapper;
        },

        stepHandler: function(){
            $('body').on('click', '.js--pick-step', function(){
                $(this).addClass('is--selected');
                
                var nameField = $(this).data('filter');
                var $container = $(this).closest('.js--step-select');
                
                $container.next().find('*:not([data-filter*="'+nameField+'"])').addClass('is--not-allowed');
                var hasMoreSteps = $container.next().find('*[data-filter*="'+nameField+'"]').length;
                
                $container.removeClass('is--active').next().addClass('is--active');
                
                if( !$container.next().length || !hasMoreSteps){
                    var allOpts = '';
                    var allKeys = [];
                    
                    var $parent = $(this).closest('.x-talk-with-us__stepselect');

                    $parent.find('.is--selected')
                        .each(function(){
                            allOpts += '<span>' + $(this).data('value') + '</span>';
                            allKeys.push( $(this).data('value') );
                        });

                    $parent.next().html(allOpts);
                    $parent.removeClass('is--active').children().eq(0).addClass('is--active');
                    $parent.find('.js--pick-step').removeClass('is--selected is--not-allowed');
                    
                    var value = appController.removeSpecialChars( allKeys.join(':_') ) || '';
                    value = value.replace(/\s+/gim, '_').toLocaleLowerCase();
                    value = 'catalogo_' + value;
                    
                    console.log(value);
                    $('option[value="'+value+'"]').closest('select').val(value);
                }
            });
            
            $('body').on('click', '.js--toggle-pick-drop', function(){
                $(this).prev().toggleClass('is--active');
            });
        },
        
        // go to top
        animateTop: function(){
            $('html, body').animate({
                scrollTop: $('.x-talk-with-us__title').offset().top || 0
            }, 500);
        },
        
        // set the loading state of the form
        loading: function(){
            this.animateTop();
            var $form = appData.getElem('form');
            $form.empty();
            $form.append('\
                <div class="x-talk-with-us__loading">\
                    <p>Por favor aguarde...</a>\
                </p>\
                </div>\
            ');
        },
        
        // showed when the form was submitted successfully
        successMessage: function(){
            this.animateTop();
            var $form = appData.getElem('form');
            $form.empty();
            $form.append('\
                <div class="x-talk-with-us__success">\
                    <p>Solicitação criada com sucesso. <br/>\
                    Em breve retornaremos o contato. <br/>\
                    <a href="/">Voltar para a loja</a>\
                </p>\
                </div>\
            ');
        },
        
        //showed when the form was submitted incorrectly
        failMessage: function(alternativeMsg){
            this.animateTop();
            var $form = appData.getElem('form');
            $form.empty();

            var defaultValue = 'Sua solicitação não foi concluída. <br/> Tente novamente mais tarde.';
            
            $form.append('\
                <div class="x-talk-with-us__fail">\
                    <p>'+ (alternativeMsg || defaultValue) +' <br/>\
                    <a href="javascript:window.location.reload()">Tentar novamente</a>\
                </p>\
                </div>\
            ');
        },

        //showed when the file don't match the prequisites
        fileErrorMessage: function(){
            this.failMessage('Seu anexo não pode ser enviado. <br/> Tente inserir em um outro formato.');
        }
    };
    
    /*
    ********************************************
    * CONTROLLER - What connects the View and the Model
    ********************************************
    */
    var appController = {
        init: function(){
            // start get the data
            appData.init(function(){
                appData.getElem('form').empty();
                appView.init(); // once the data is back it starts to build the view
            });
            
            appView.loading();
        },
        
        // get the form fields from the model
        getFormFields: function(){
            return appData.getStore().map(function(item){
                return item;
            });
        },
        
        // prepare the data for submitting the form
        submitAttachment: function(data){
            var _this = this;
            var preData = appData.getFinalData();
            
            // send the attachment at first
            var formData = new FormData(document.querySelector('.js--talk-with-us'));

            // the model send the data
            //appView.loading();

            appData.sendAttachment(formData, function(data){
                // get the attachment response
                var attachmentResponse = JSON.parse(data);
                
                // if the file were rejected due to it size our type
                if( attachmentResponse.status === "rejected" ){
                    appView.fileErrorMessage();
                    return false;
                }

                // if the file were uploaded successfully
                if( attachmentResponse.upload ){
                    var uploadToken = attachmentResponse.upload.token;

                    _this.submitForm(preData, uploadToken);
                }

                if( attachmentResponse.status === false ){
                     _this.submitForm(preData);
                }
            });
        },

        // submit the form
        submitForm: function(finalData, upload_token){
            var hasToken = upload_token || false;

            // check if there is an upload
            if( hasToken ){
                finalData.ticket.comment.uploads = [upload_token];
            }

            appData.submitToZendesk(finalData, function(data){
                // get the response and it shows to the user the results
                var response = JSON.parse(data);
                
                if( response.ticket ){
                    appView.successMessage();
                }else{
                    appView.failMessage();
                }
            });
        },

        // validates file
        validateFileContent: function(fileData){
            var validation;

            if( fileData.length ){
                var file = fileData[0];
                var limit = appData.fileRules.size;
                var formats = appData.fileRules.formats;

                if( file.size > limit || formats.indexOf(file.type) === -1 ){
                    validation = false;
                }else{
                    validation = true;
                }
            }else{
                validation = true;
            }

            return validation;
        },
        
        removeSpecialChars: function (palavra){
            var palavra = new String(palavra);
            var com_acento = new Array("á", "à", "â", "ã", "ä", "é", "è", "ê", "ë", "í", "ì", "î", "ï", "ó", "ò", "ô", "õ", "ö", "ú", "ù", "û", "ü", "ç", "Á", "À", "Â", "Ã", "Ä", "É", "È", "Ê", "Ë", "Í", "Ì", "Î", "Ï", "Ó", "Ò", "Ô", "Õ", "Ö", "Ú", "Ù", "Û", "Ü", "Ç");
            var sem_acento = new Array("a", "a", "a", "a", "a", "e", "e", "e", "e", "i", "i", "i", "i", "o", "o", "o", "o", "o", "u", "u", "u", "u", "c", "A", "A", "A", "A", "A", "E", "E", "E", "E", "I", "I", "I", "I", "O", "O", "O", "O", "O", "U", "U", "U", "U", "C");
            var nova='';

            for ( var i = 0; i < palavra.length; i++ ) {
                var gravou="";
                var letra = palavra.substr(i,1);

                for ( var x = 0; x < 46; x++ ){
                    if ( letra == com_acento[x] ){
                        nova += sem_acento[x];
                        gravou = "ok";
                    }
                }
                if ( gravou != "ok" ) {
                    nova += letra;
                }
            }
            return nova;
        }
    };
    
    
    appController.init();
});

}