export function openHelp() {
  $('body').addClass('help-is-open')
  $('#ajuda-flutuante-init').fadeOut(250);
  $('#ajuda-flutuante-close').fadeIn(250);
  $('.ajuda-flutuante-list').fadeIn(500);
}

$('#ajuda-flutuante-init').click(function(){
  openHelp();
});


export function closeHelp() {
  $('body').removeClass('help-is-open')
  $('.ajuda-flutuante-list').fadeOut(500);
  $('#ajuda-flutuante-close').fadeOut(250);
  $('#ajuda-flutuante-init').fadeIn(250);
}

$('#ajuda-flutuante-close, .x-header__overlay').click(function(){
  closeHelp()
});

jQuery(window).scroll(function() {
  closeHelp()
  $('.ajuda-flutuante').fadeOut(200)
});

setTimeout(function(){ 
  $(window).scroll(function() {
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
      $('.ajuda-flutuante').fadeIn(200)
    }, 250));
  });
}, 100);