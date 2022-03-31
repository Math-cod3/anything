$(function (){
    if($(document.body).hasClass('lp-tricot')) {
        const init = () => {
            bind();
        }

        const bind = () => {
            $('.lp-tricot').on('click', 'a', function (e) {
                if($(this).attr('href') == '#') {
                    e.preventDefault();
                }
            })

            $('.lp-tricot').on('click', '.lp-tricot__timeline-small .lp-tricot__ano', function (e) {
                let ref = [...$(this)[0].classList].filter((classe) => {
                    return (/time_\d/.test(classe))
                }).join('');

                if(ref !== '' && ref !== null) {
                    let scroll = $('.lp-tricot__timeline .lp-tricot__ano.' + ref).offset().top - 200;

                    let body = $("html, body");
                    body.stop().animate({scrollTop: scroll}, 500, 'swing');
                }

            })
        }


        init()
    }
})