chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
	    return {cancel: true};
	}, {
	    urls: ["https://mariafilo.vteximg.com.br/arquivos/mariafilo-1*.min.js*","https://www.mariafilo.com.br/files/checkout6-custom.js"]
	}, ["blocking"]
);