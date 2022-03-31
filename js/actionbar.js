function countDownTopBar() {
    var $countdown = $('.top-bar .topbarCountdown__countdown__timer');

    var data = $countdown.attr('data-time').trim().replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/, '$2/$1/$3 $4:$5:$6')

    if (data != '') {
        data = data.replace(/-/g, '/');
        var countDownDate = new Date(data).getTime();

        var x = setInterval(function () {

            var now = new Date().getTime();

            var distance = countDownDate - now;

            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + (hours * 60);
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (minutes < 10) {
                minutes = "0" + minutes;
            } else if (minutes == 60) {
                minutes = "00";
            } else if (minutes > 60) {
                minutes = minutes % 60;
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
            }

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            $countdown.html(`
            <div class="countDown-counter"><span class="value">${hours}</span><span>Horas</span></div>
            <div class="countDown-counter divisor">:</div>
            <div class="countDown-counter"><span class="value">${minutes}</span><span>Minutos</span></div>
            <div class="countDown-counter divisor">:</div>
            <div class="countDown-counter"><span class="value">${seconds}</span><span>Segundos</span></div>
          `)

            if (distance < 0) {
                clearInterval(x);
                $countdown.html(`
                <div class="countDown-counter"><span class="value">0</span><span>Horas</span></div>
                <div class="countDown-counter divisor">:</div>
                <div class="countDown-counter"><span class="value">00</span><span>Minutos</span></div>
                <div class="countDown-counter divisor">:</div>
                <div class="countDown-counter"><span class="value">00</span><span>Segundos</span></div>
              `)
            }
        }, 1000);
    }
}

function mountCountdown(r) {
    $("body .x-general:first").prepend('<div class="top-bar"></div>');
    if (!$("body").hasClass("home")) {
        $(".top-bar").show();
    }

    var topbar = '<div id="topbarCountdown__link" class="topbarCountdown">\
  <div class="content">\
      <div class="topbarCountdown__countdown">\
          <div class="topbarCountdown__countdown__timer" data-time="' + r.finishTime + '"></div>\
          <div class="divider"></div>\
          <div class="topbarCountdown__countdown__title">' + r.title + '</div>\
      </div>\
      <div class="topbarCountdown__infos">\
              <div class="divider"></div>\
              <div class="topbarCountdown__infos__description">' + r.description + '</div>\
              <div class="topbarCountdown__infos__coupon"><p class="coupon-text">' + r.couponTexts + '</p><div class="coupon-icon">\
              <img src="/arquivos/ActionBar-iconCopy.png" />\
          </div></div>\
              <div class="topbarCountdown__infos__rules">' + r.rules + '</div>\
      </div>\
  </div>\
  </div>';
    $(".top-bar").css({
        "background": r.bg,
        "color": r.textsColor
    });
    $(topbar).appendTo(".top-bar");
    if (r.couponTexts === null) {
        $(".topbarCountdown__infos > .topbarCountdown__infos__coupon").remove();
        $(".topbarCountdown__infos > .topbarCountdown__infos__description").remove();
        $(".topbarCountdown__countdown__title").css({"font-weight": "600", "font-size": "20px"});
        
        $(".topbarCountdown__infos > .topbarCountdown__infos__rules").css({"margin-left": "8px", "font-size": "14px"});
    }
    $("body").addClass("js-cronometro");
    $(".top-bar").addClass("js-active");

    redirectTopdown(r)
}

function countDown() {
    var idMasterData = '16a4e64b-070a-11eb-8367-0e8ddb0c7385'

    if(window.location.href.indexOf("homolog") > 0){
        idMasterData = '24272689-4943-11ec-82ac-1673cab89599'
    }

    var settings = {
        "url": "/api/dataentities/CM/documents/"+ idMasterData +"?_fields=bg,couponTexts,description,rules,startTime,finishTime,textsColor,title,active,link",
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/vnd.vtex.ds.v10+json",
        },
    };
    $.ajax(settings).done(function (response) {
        var isActive = response.active;
        if (isActive || window.location.href.indexOf("testecronometro=true") > 0) {
            var startDate = response.startTime.trim().replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/, '$2/$1/$3 $4:$5:$6');
            startDate = new Date(startDate);
            var nowDate = new Date();
            if (nowDate > startDate) {
                if($(".top-bar").length == 0){
                    mountCountdown(response);
                    $(document.body).removeClass('js-preHeader')
                    if ($('.top-bar').text().trim() != '') {
                        countDownTopBar();
                    }
                }
            }
        }
    });
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function redirectTopdown(r){
    $(document).on("click", "#topbarCountdown__link", function(e){
        if($(e.target).is("topbarCountdown__infos__coupon, .coupon-text, .coupon-icon, .coupon-icon > img")){
            copyToClipboard('.coupon-text');
    
            $(".topbarCountdown__infos__coupon").fadeOut(function() {
               $(".coupon-text").text("cupom copiado");
               $(".coupon-icon").html('<img src="/arquivos/ActionBar-iconOk.png">');
               $(".topbarCountdown__infos__coupon").css({"background-color" : "white", "color" : "#C20076" });
               $(".coupon-text").css({"padding": "0px" });
         }).fadeIn();
        } else{
            window.location.href = r.link;  
        }
    })
}

$(document).ready(function () {
	countDown();
});