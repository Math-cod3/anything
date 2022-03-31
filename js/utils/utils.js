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
 * @param {Boolean} replaceSize
 * Parâmetro que informa se é necessário alterar as dimensões de uma imagem que já está com tamanho definido.
 */
export function parseImageUrl(url, width, height, replaceSize = false, resetSize = false) {
  let str = url.split('/')
  if (resetSize) {
    str[5] = str[5].split('-')[0]
  }
  else if (replaceSize) {
    let dataImgArr = str[5].split('-')
    dataImgArr[1] = width
    dataImgArr[2] = height
    str[5] = dataImgArr.join('-')
  }
  else {
    str[5] += `-${width}-${height}`
  }
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
  const endpoint = `${window.rex.endpoint}/api/catalog_system/pub/products/search/?${query}`

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
  const endpoint = `${window.rex.endpoint}/api/catalog_system/pub/products/variations/${productId}`

  return new Promise((resolve, reject) => {
    let res = getProductWithVariations.cache[productId]
    if (res) return resolve(res)
    else {
      return fetch(endpoint)
        .then(res => {
          if (res.ok) {
            getProductWithVariations.cache[productId] = res.json()
            return resolve(getProductWithVariations.cache[productId])
          }
          throw Error()
        })
        .catch(err => reject(err))
    }
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
* @returns {value}
*/
export const objectPath = (obj = '', path = '', defaultValue) => {
  let paths = path.split('.'), current = obj, len = paths.length, i;

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

/**
 * Converts strings to slug.
 * Example: não -> nao
 * @param {string} string
 */
export const slugify = (string) => {
  let from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;"
  let to = "aaaaaeeeeeiiiiooooouuuunc------"
  let i = 0
  let len = from.length

  string = string.replace(/\(/g, '-')
  string = string.replace(/\)/g, '-')
  string = string.replace(/^\s+|\s+$/g, '')
  string = string.toLowerCase()

  for (; i < len; i += 1) {
    string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  string = string.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return string
}

/**
 * Converts slug to camel case strings.
 * Example: my-slug -> mySlug
 * @param {string} slug
 * - Slug to convert.
 */
export const slugToCamelCase = (slug) => slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

/**
 * Reorder array in alphabetical order, after prioritizing the order passed by parameter.
 * @param {Array.<String>} [arr=[]]
 * @param {Array.<String>} [options=[]]
 * @returns {Array.<String>}
 */
export const beforeSort = (arr = [], options = []) => {
  let newArr = []
  options.map(item => {
    let index = $.inArray(item, arr);
    if (index > -1) {
      newArr.push(arr[index]);
      arr.splice(index, 1);
    }
  }, arr);
  newArr = newArr.concat(arr.sort());
  return newArr;
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
        console.log('cansou de esperar e desistiu')
      }
    }
  }, interval);
};

export const formatMoney = function (n, c = 2, d = ',', t = '.') {
  c = isNaN((c = Math.abs(c))) ? 2 : c;
  var s = n < 0 ? '-' : '';
  var i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '';
  var j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
      Math.abs(n - i)
        .toFixed(c)
        .slice(2)
      : '')
  );
};

export const last = (arr) => {
  const length = arr.length;
  return arr[length - 1];
};


/**
 * Retorna o melhor parcelamento do SKU usando a estruturade dados da API de
 * busca, onde esta informação não é passada de forma explícita.
 * @param {Array.<Object>} skus
 * Array de SKUs do produto
 * @param {Number} [skuIndex=0]
 * Índice do SKU que irá buscar as condições de parcelamento
 * @param {Number} [seller=0]
 * Seller do SKU que irá buscar as condições de parcelamento
 * @returns {Object}
 */
export function getInstallments(skus, skuIndex = 0, seller = 0) {
  if (!skus) {
    throw Error('Array de SKUs não passado como parâmetro.');
  }

  const { Installments: installments } = skus[skuIndex].sellers[seller].commertialOffer
  let bestInstallment = {}

  if (installments.length) {
    installments.forEach((item, i) => {
      if (i === 0) {
        bestInstallment = item
      }
      else {
        if (bestInstallment.NumberOfInstallments < item.NumberOfInstallments) {
          if (bestInstallment.InterestRate >= item.InterestRate) {
            bestInstallment = item
          }
        }
      }
    })
  }

  return bestInstallment
}
