$(function(){
	$(document).on('click', '.vtexIdUI-close', function () {
		if($('body').hasClass('login')){
			window.location = '/';
		}
  	});
});