export const HOST_URL = (typeof vtxctx == 'undefined' ? { url: 'mariafilo.com.br' } : vtxctx).url
export const winWidth = $(window).width()
export const isLocalhost = window.location.port ? true : false
export const isHomolog = window.location.hostname.indexOf('homolog') > -1

/**
 * Manipula URL da imagem, redimensionando para o tamanho desejado.
 *
 * @param {String} url
 * URL da imagem a ser manipulada.
 * @param {Integer} width
 * Largura para redimensionamento da imagem.
 * @param {Integer} height
 * Altura para redimensionamento da imagem.
 */
export function parseImageUrl(url, width = 100, height, resetToDefaultSize = false) {
  if (!url) {
    throw Error('>>> URL da imagem não definido')
    return
  }

  if (resetToDefaultSize) {
    return url.replace(/(?:ids\/)(\d+)((\-\d+){2})?/g, 'ids/$1')
  }

  height = height || width

  return url.replace(/(?:ids\/)(\d+)((\-\d+){2})?/g, `ids/$1-${ width }-${ height }`)
}

/**
 * Remove redimensionamento da imagem, retornando a mesma em tamanho original.
 *
 * @param {String} url
 * URL da imagem a ser manipulada.
 */
export function setOriginalImageSize(url) {
  let str = url.split('/')
  str[5] = str[5].split('-')[0]
  str = str.join('/')
  return str
}

/**
 * Cria um objeto de acordo com a string passada. Ex.: `rex.minicart.handle`.
 *
 * @param {String} nsString
 * URL da propriedade aninhada a ser criada. Ex.: `rex.minicart.handle`.
 * @returns {Object}
 */
export function namespace(nsString) {
  const parts = nsString.split('.')
  let parent, i

  if (!window.hasOwnProperty(parts[0])) window[parts[0]] = {}

  parent = window[parts[0]]
  for (i = 1; i < parts.length; i += 1) {
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {}
    }
    parent = parent[parts[i]]
  }

  return parent
}

/**
 * Faz a requisição no endpoint da API de busca da VTEX, trazendo o produto referente à query passada como parâmetro.
 *
 * @param {String} query
 * Query a ser aplicada no endpoint de search.
 */
export function getProduct(query) {
  getProduct.cache = getProduct.cache || {}
  const endpoint = `//${HOST_URL}/api/catalog_system/pub/products/search/?${query}`
  //const endpoint = `//lojaanimale.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?${query}` //so pra testar localmente

  return new Promise((resolve, reject) => {
    let res = getProduct.cache[query]
    if (res) return resolve(res)
    else {
      return fetch(endpoint)
        .then(data => {
          getProduct.cache[query] = data.json()
          return resolve(getProduct.cache[query])
        })
        .catch(err => reject(err))
    }
    return reject("Couldn't get product.")
  })
}

/**
 * Faz a requisição no endpoint da API de busca da VTEX, trazendo o produto referente ao ID passado como parâmetro.
 *
 * @param {(Number|String|Array.<Number|String>)} ids
 * IDs dos produtos a serem buscados.
 */
export function getProductById(ids) {
  ids = Array.isArray(ids) ? ids : [ids]
  let str = `fq=`
  ids.forEach(id => str += `productId:${id},`)
  return getProduct(str)
}

/**
 * Faz a requisição no endpoint da API da VTEX, retornando uma estrutura semelhante ao `skuJson`.
 *
 * @param {(Number|String)} productId
 * ID dos produto a ser buscado.
 */
export function getProductWithVariations(productId) {
  getProductWithVariations.cache = getProductWithVariations.cache || {}
  const endpoint = `//${HOST_URL}/api/catalog_system/pub/products/variations/${productId}`

  return new Promise((resolve, reject) => {
    let res = getProductWithVariations.cache[productId]
    if (res) return resolve(res)
    else {
      return fetch(endpoint)
        .then(data => {
          getProductWithVariations.cache[productId] = data.json()
          return resolve(getProductWithVariations.cache[productId])
        })
        .catch(err => reject(err))
    }
    return reject("Couldn't get product with variations.")
  })
}

/**
 * Informa o tipo de dispositivo, de acordo com a largura da tela do usuário.
 *
 * @returns {String}
 */
export function screenType() {
  if (winWidth < 768) return 'mobile'
  else if (winWidth < 1025) return 'tablet'
  return 'desktop'
}

/**
 * Busca, nos SKUs, o SKU referente às variações selecionadas.
 *
 * @param {Array.<Object>} skus
 * Array de SKUs do produto.
 * @param {Object} variations
 * Objeto com a propriedade e o valor a ser comparado em cada SKU iterado em `skus`.
 * @param {Boolean} [skuJsonDataStruct=true]
 * [AINDA NÃO SUPORTADO] Se falso, este método buscará de acordo com a estrutura de SKUs vindos da API de busca.
 * @returns {Object}
 */
export const getSkuByVariations = (skus, variations, skuJsonDataStruct = true) => {
  if (!skuJsonDataStruct) return console.error('O método getSkuByVariations ainda não suporta estrutura da dados de search.')

  return skus.find(item => {
    let cond = true
    for (let prop in variations) {
      cond = cond && ( variations[prop] === item.dimensions[prop] )
    }
    return cond
  })
}

/**
* Finds nested properties within an object
* @param {Object} obj
* @param {String} dot separated path as in 'prop1.prop2.prop3'
* @param {Any} default value in case of undefined return
* @returns {value}
*/
export const objectPath = (obj, path = '', defaultValue) => {
  let paths = path.split('.'), current = obj || '', len = paths.length, i;

  if(current.constructor !== Object){
    return defaultValue
  }

  for (i = 0; i < len; ++i) {
    if (current[paths[i]] == undefined) {
      return defaultValue;
    } else {
      current = current[paths[i]];
    }
  }
  return typeof current == 'undefined' ?  defaultValue : current;
}

/**
*/
export const getUrlParameter = (name, url) => {
  if (!name) { return undefined; }
  if (!url){
    if(typeof window !== 'undefined') {
      url = window.location.href;
    }
    else{
      return undefined
    }
  }
  name = name.replace(/[\[\]]/g, '\\$&');

  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) { return null; }
  if (!results[2]) { return ''; }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
* Finds nested properties within an object
* @param {Function} callback
* @param {Integer} wait time between callback calls
* @param {Boolean} imediate callback execution or delayed to the last call
* @returns {value} debounced callback as an executable function
*/
export const debounce = (func, wait = 100, immediate = false) => {
  let timeout;
  return function() {
      let context = this, args = arguments;
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
      }, wait);
  };
}


const b = {
  "\u00e7": "c","\u00e6": "ae","\u0153": "oe","\u00e1": "a","\u00e9": "e","\u00ed": "i","\u00f3": "o","\u00fa": "u","\u00e0": "a","\u00e8": "e","\u00ec": "i","\u00f2": "o","\u00f9": "u","\u00e4": "a","\u00eb": "e","\u00ef": "i","\u00f6": "o","\u00fc": "u","\u00ff": "y","\u00e2": "a","\u00ea": "e","\u00ee": "i","\u00f4": "o","\u00fb": "u","\u00e5": "a","\u00e3": "a","\u00f8": "o","\u00f5": "o","\u00c1": "A","\u00c9": "E","\u00cd": "I","\u00d3": "O","\u00da": "U","\u00ca": "E","\u00d4": "O","\u00dc": "U","\u00c3": "A","\u00d5": "O","\u00c0": "A","\u00c7": "C"
};
export const replaceSpecialChars = s => {
  return (s || '').toLowerCase().replace(/[\u00e0-\u00fa]/g, function(a) {
    return "undefined" != typeof b[a] ? b[a] : a;
  }).replace(/\s|\/|\$|\&|\/|\\|\.|\!|\?/g, '-').replace(/\#/g, '');
}


/**
 * Faz a requisição nas Entidades da API da VTEX, trazendo o produto referente à query passada como parâmetro.
 *
 * @param {Object} objParams
 * Objecto com os parametros da busca
 * @param {Object} objParams.entidade
 * Entidade a ser buscada
 * @param {Object} objParams.fields
 * Campos a serem buscados
 * @param {Object} objParams.where
 * Condição da busca
 * @param {Object} objParams.sort
 * Ordem do resultado
 * @param {Object} objParams.range
 * Quantidade de itens trazidos na requisição
 */
export function getEntity(objParams = {entidade: null, fields: null, where: null, sort: null, range: null}) {
  let loja = 'lojaanimale';

  //Validando
  if ( objParams.entidade && objParams.fields && objParams.where ) {
    //Passou entidade, campos e where...
    let entidade = objParams.entidade,
      condicao = '_where=('+objParams.where+')',
      order = (objParams.sort ? '&_sort='+objParams.sort : '' ),
      range = (objParams.range ? objParams.range : '0-10'),
      campos   = '&_fields='+objParams.fields;

    const url = '//api.vtex.com/'+loja+'/dataentities/'+entidade+'/search?an=lojaanimale&'+condicao+order+campos;

    return fetch(url, {
      method : 'get',
      headers: {
        'REST-Range': 'resources=' + range,
        'Accept': 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).catch(error => {
      return Promise.reject('Não foi possível resolver esta solicitação. Erro: ' + error.status + ' - ' + error.statusText);
    });
  } else {
    return Promise.reject('Parametros incorretos.');
  }
}

/**
* Finds nested properties within an object
* @param {String} target element selector (jquery style)
* @param {Function} callback function to be executed when target is found
* @param {Number} interval to wait in milliseconds
*/
export const waitForElement = (target, callback, interval = 500) => {
  var tries = 0;
  var checkExist = setInterval(function () {
    if ($(target).length) {
      clearInterval(checkExist);
      callback && callback()
    }
    else {
      tries++
      if (tries > 50) {
        clearInterval(checkExist);
        console.log(`waitForElement :: element "${target}" not found [this is not an error]`)
      }
    }
  }, interval);
}
