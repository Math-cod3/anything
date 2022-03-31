function createFlagComercial(){
    $(".catalog #ConfiguracoesFlagComercial span").each(function(index, item){
 
        const FlagClass = item.innerText.split("\n")[1].split(": ")[1];
        const FlagName = item.innerText.split("\n")[2].split(": ")[1];
        const FlagBg = item.innerText.split("\n")[3].split(": ")[1];
        const FlagFontColor = item.innerText.split("\n")[4].split(": ")[1];
    
        const FlagElement = `<span style="color: ${FlagFontColor}">${FlagName}</span><div class="flag-bg flag-bg--${FlagClass}" style="background-color: ${FlagBg}"></div>`
        
        $(`.flag.${FlagClass}`).each(function(){
            if(!$(this).hasClass("ready")){
                $(this).addClass("comercial ready").append(FlagElement);
            }
        });
        
        // $(".x-flag-shelf").append(FlagElement)
    });
}

function createFlagComercialPDP(){
    $(".produto2021 #ConfiguracoesFlagComercial span").each(function(index, item){
 
        const FlagClass = item.innerText.split("\n")[1].split(": ")[1];
        const FlagName = item.innerText.split("\n")[2].split(": ")[1];
        const FlagBg = item.innerText.split("\n")[3].split(": ")[1];
        const FlagFontColor = item.innerText.split("\n")[4].split(": ")[1];
    
        const FlagElement = `<span style="color: ${FlagFontColor}">${FlagName}</span><div class="flag-bg flag-bg--${FlagClass}" style="background-color: ${FlagBg}"></div>`
        
        $(`.flag.${FlagClass}`).each(function(){
            if(!$(this).hasClass("ready")){
                $(this).addClass("comercial ready").append(FlagElement);
            }
        });

        if($("#productPage-flags").find(".comercial").length){
            const flag = $(".flag.comercial").html();

            const newElement = `<div class="flag ${FlagClass} comercial">${flag}</div>`


            $(".mainProductImage .apresentacao #show #include").prepend(newElement)
        }
        
    });
}

function createFlagInstitutional(){
    $(".catalog #ConfiguracoesFlag span").each(function(index,item){
 
        const FlagClass = item.innerText.split("\n")[1].split(": ")[1];
        const FlagName = item.innerText.split("\n")[2].split(": ")[1];
        const FlagFontColor= item.innerText.split("\n")[3].split(": ")[1];
        
        $("."+FlagClass).css({ 
            "color" : FlagFontColor,
        });
        $("."+FlagClass).addClass("institucional")
        $("."+FlagClass).text(FlagName);
    });
}


function createFlaginstitutionalPDP(){
    $(".produto2021 #ConfiguracoesFlag span").each(function(index, item){
 
        const FlagClass = item.innerText.split("\n")[1].split(": ")[1];
        const FlagName = item.innerText.split("\n")[2].split(": ")[1];
        const FlagFontColor= item.innerText.split("\n")[3].split(": ")[1];


        if($("#productPage-flags").find(`.${FlagClass}`).length){

            const newElement = `<p class="flag ${FlagClass} institucional">${FlagName}</p>`

            $(".x-productPage__info").prepend(newElement)

            $(".x-productPage__info h1").css(
                "margin-top", "16px"
            )
        }
    
    });
}

$(document).ready(() => {
    createFlagComercial();
    createFlagComercialPDP();
    createFlagInstitutional();
    createFlaginstitutionalPDP();
});


$(document).ajaxStop(() => {
    createFlagComercial();
    createFlagInstitutional()
});
