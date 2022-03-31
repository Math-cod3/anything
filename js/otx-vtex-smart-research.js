/**
 * jQuery.query - Query String Modification and Creation for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/8/13
 *
 * @author Blair Mitchelmore
 * @version 2.2.3
 *
 **/

new (function (e) {
  var t = e.separator || "&",
    n = !1 !== e.spaces,
    r = (e.suffix, !1 !== e.prefix ? (!0 === e.hash ? "#" : "?") : ""),
    i = !1 !== e.numbers;
  jQuery.query = new (function () {
    var e = function (e, t) {
        return void 0 != e && null !== e && (!t || e.constructor == t);
      },
      u = function (e) {
        for (
          var t,
            n = /\[([^[]*)\]/g,
            r = /^([^[]+)(\[.*\])?$/.exec(e),
            i = r[1],
            u = [];
          (t = n.exec(r[2]));

        )
          u.push(t[1]);
        return [i, u];
      },
      s = function (t, n, r) {
        var i = n.shift();
        if (("object" != typeof t && (t = null), "" === i))
          if ((t || (t = []), e(t, Array)))
            t.push(0 == n.length ? r : s(null, n.slice(0), r));
          else if (e(t, Object)) {
            for (var u = 0; null != t[u++]; );
            t[--u] = 0 == n.length ? r : s(t[u], n.slice(0), r);
          } else (t = []).push(0 == n.length ? r : s(null, n.slice(0), r));
        else if (i && i.match(/^\s*[0-9]+\s*$/)) {
          var o = parseInt(i, 10);
          t || (t = []), (t[o] = 0 == n.length ? r : s(t[o], n.slice(0), r));
        } else {
          if (!i) return r;
          o = i.replace(/^\s*|\s*$/g, "");
          if ((t || (t = {}), e(t, Array))) {
            var c = {};
            for (u = 0; u < t.length; ++u) c[u] = t[u];
            t = c;
          }
          t[o] = 0 == n.length ? r : s(t[o], n.slice(0), r);
        }
        return t;
      },
      o = function (e) {
        var t = this;
        return (
          (t.keys = {}),
          e.queryObject
            ? jQuery.each(e.get(), function (e, n) {
                t.SET(e, n);
              })
            : t.parseNew.apply(t, arguments),
          t
        );
      };
    return (
      (o.prototype = {
        queryObject: !0,
        parseNew: function () {
          var e = this;
          return (
            (e.keys = {}),
            jQuery.each(arguments, function () {
              var t = "" + this;
              (t = (t = t.replace(/^[?#]/, "")).replace(/[;&]$/, "")),
                n && (t = t.replace(/[+]/g, " ")),
                jQuery.each(t.split(/[&;]/), function () {
                  var t = decodeURIComponent(this.split("=")[0] || ""),
                    n = decodeURIComponent(this.split("=")[1] || "");
                  t &&
                    (i &&
                      (/^[+-]?[0-9]+\.[0-9]*$/.test(n)
                        ? (n = parseFloat(n))
                        : /^[+-]?[1-9][0-9]*$/.test(n) &&
                          (n = parseInt(n, 10))),
                    (n = (!n && 0 !== n) || n),
                    e.SET(t, n));
                });
            }),
            e
          );
        },
        has: function (t, n) {
          var r = this.get(t);
          return e(r, n);
        },
        GET: function (t) {
          if (!e(t)) return this.keys;
          for (
            var n = u(t), r = n[0], i = n[1], s = this.keys[r];
            null != s && 0 != i.length;

          )
            s = s[i.shift()];
          return "number" == typeof s ? s : s || "";
        },
        get: function (t) {
          var n = this.GET(t);
          return e(n, Object)
            ? jQuery.extend(!0, {}, n)
            : e(n, Array)
            ? n.slice(0)
            : n;
        },
        SET: function (t, n) {
          var r = e(n) ? n : null,
            i = u(t),
            o = i[0],
            c = i[1],
            a = this.keys[o];
          return (this.keys[o] = s(a, c.slice(0), r)), this;
        },
        set: function (e, t) {
          return this.copy().SET(e, t);
        },
        REMOVE: function (t, n) {
          if (n) {
            var r = this.GET(t);
            if (e(r, Array)) {
              for (tval in r) r[tval] = r[tval].toString();
              var i = $.inArray(n, r);
              if (!(i >= 0)) return;
              t = (t = r.splice(i, 1))[i];
            } else if (n != r) return;
          }
          return this.SET(t, null).COMPACT();
        },
        remove: function (e, t) {
          return this.copy().REMOVE(e, t);
        },
        EMPTY: function () {
          var e = this;
          return (
            jQuery.each(e.keys, function (t, n) {
              delete e.keys[t];
            }),
            e
          );
        },
        load: function (e) {
          var t = e.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1"),
            n = e.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
          return new o(
            e.length == n.length ? "" : n,
            e.length == t.length ? "" : t
          );
        },
        empty: function () {
          return this.copy().EMPTY();
        },
        copy: function () {
          return new o(this);
        },
        COMPACT: function () {
          return (
            (this.keys = (function t(n) {
              var r = "object" == typeof n ? (e(n, Array) ? [] : {}) : n;
              "object" == typeof n &&
                jQuery.each(n, function (n, i) {
                  if (!e(i)) return !0;
                  var u, s, o;
                  (u = r),
                    (s = n),
                    (o = t(i)),
                    e(u, Array) ? u.push(o) : (u[s] = o);
                });
              return r;
            })(this.keys)),
            this
          );
        },
        compact: function () {
          return this.copy().COMPACT();
        },
        toString: function () {
          var i = [],
            u = [],
            s = function (e) {
              return (
                (e += ""),
                (e = encodeURIComponent(e)),
                n && (e = e.replace(/%20/g, "+")),
                e
              );
            },
            o = function (t, n) {
              var r = function (e) {
                return n && "" != n ? [n, "[", e, "]"].join("") : [e].join("");
              };
              jQuery.each(t, function (t, n) {
                "object" == typeof n
                  ? o(n, r(t))
                  : (function (t, n, r) {
                      if (e(r) && !1 !== r) {
                        var i = [s(n)];
                        !0 !== r && (i.push("="), i.push(s(r))),
                          t.push(i.join(""));
                      }
                    })(u, r(t), n);
              });
            };
          return (
            o(this.keys),
            u.length > 0 && i.push(r),
            i.push(u.join(t)),
            i.join("")
          );
        },
      }),
      new o(location.search, location.hash)
    );
  })();
})(jQuery.query || {});

/**
 * Pesquisa Inteligente
 * @description Execurar buscas sem recarregar a página
 * @author Carlos Vinicius / Lucas Vyskubenko
 * @version 4.0.6
 * @date 2017-12-12
 */

$.urlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results) {
    return results[1] || 0;
  } else {
    return false;
  }
};

$.removeA = function (arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) != -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
};

Array.prototype.clean = function (deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var scrollDownToline = function () {
  //to scroll down the page: should be better!!!

  if (
    !$("body").hasClass("js-shelfloading") &&
    !$("body").hasClass("js-pages-loaded")
  ) {
    $("body").addClass("js-pages-loaded");
    var heightToScroll = 0;

    var n = $.query.get("line");
    var p = $.query.get("pg");

    try {
      if (n) {
        heightToScroll =
          $(".prateleira[id^=ResultItems]")
            .find(".prateleira > ul > li:eq(" + n + ")")
            .offset().top - 100;
      } else if (p) {
        heightToScroll = $(".prateleira[id^=ResultItems]")
          .find(".prateleira > ul > li:last-child")
          .offset().top;
      }
      if (heightToScroll > 0) {
        heightToScroll = heightToScroll - 100;
        var speed = Math.max(200 * (heightToScroll / 1000), 200);
        $("html, body").animate({ scrollTop: heightToScroll }, speed);
        //end
      }
      window.firstPaginatorLoader = false;
    } catch (e) {
      console.log("An error ocurred while trying to get line");
    }
  }
};

var loadedPages = function () {
  if (!$("body").hasClass("js-shelfloading")) {
    scrollDownToline();
  }
  $("body").removeClass("js-shelfloading").removeClass("loading-pages");
  $(".department__sidebar__content").trigger("sticky_kit:recalc");
  window.triggeredFilters = true;
};

$(function () {
  if ($.urlParam("pg")) {
    $("body").addClass("loading-pages");
  }
});

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

"function" !== typeof String.prototype.replaceSpecialChars &&
  (String.prototype.replaceSpecialChars = function () {
    var b = {
      "\u00e7": "c",
      "\u00e6": "ae",
      "\u0153": "oe",
      "\u00e1": "a",
      "\u00e9": "e",
      "\u00ed": "i",
      "\u00f3": "o",
      "\u00fa": "u",
      "\u00e0": "a",
      "\u00e8": "e",
      "\u00ec": "i",
      "\u00f2": "o",
      "\u00f9": "u",
      "\u00e4": "a",
      "\u00eb": "e",
      "\u00ef": "i",
      "\u00f6": "o",
      "\u00fc": "u",
      "\u00ff": "y",
      "\u00e2": "a",
      "\u00ea": "e",
      "\u00ee": "i",
      "\u00f4": "o",
      "\u00fb": "u",
      "\u00e5": "a",
      "\u00e3": "a",
      "\u00f8": "o",
      "\u00f5": "o",
      u: "u",
      "\u00c1": "A",
      "\u00c9": "E",
      "\u00cd": "I",
      "\u00d3": "O",
      "\u00da": "U",
      "\u00ca": "E",
      "\u00d4": "O",
      "\u00dc": "U",
      "\u00c3": "A",
      "\u00d5": "O",
      "\u00c0": "A",
      "\u00c7": "C",
    };
    return this.replace(/[\u00e0-\u00fa]/g, function (a) {
      return "undefined" != typeof b[a] ? b[a] : a;
    });
  });
"function" !== typeof String.prototype.trim &&
  (String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
  });

window.currentPage = 2;
window.firstPaginatorLoader = true;
window.pgloaded = 0;
window.triggeredFilters = false;
window.triggeredFiltersCount = 0;

jQuery.fn.vtexSmartResearch = function (opts) {
  var $this = jQuery(this);

  var log = function (msg, type) {
    if (typeof console == "object")
      console.log("[Smart Research - " + (type || "Erro") + "] " + msg);
  };

  var defaults = {
    pageLimit: null, // Número máximo de páginas que o script irá retornar. Exemplo "pageLimit=3" só será retornado resultados até a terceira página
    loadContent: ".prateleira[id^=ResultItems]", // Elemento que esta em volta da(s) prateleira(s) de produtos.
    shelfClass: ".prateleira", // Pratelira de produtos (filha do elemento definido de um "loadContent")
    filtersMenu: ".search-multiple-navigator", // Menu com os filtros
    linksMenu: ".search-single-navigator", // Menu de links
    menuDepartament: ".navigation .menu-departamento", // seletor do menu da página de departamentos
    mergeMenu: true, // Define se o menu de links será mesclado com o de filtros será mesclado na página de departamento
    insertMenuAfter: ".search-multiple-navigator h3:first", // O menu de links será inserido após este elemento
    emptySearchElem: jQuery('<div class="vtexsr-emptySearch"></div>'), // Elemento Html (em Objeto jQuery) no qual será adicionado a mensagem de busca vazia
    elemLoading: '<div id="scrollLoading">Carregando ... </div>', // Elemento com mensagem de carregando ao iniciar a requisição da página seguinte
    returnTopText:
      '<span class="text">voltar ao</span><span class="text2">TOPO</span>', // Mensagem de "retornar ao topo"
    emptySearchMsg:
      "<h3>Esta combinação de filtros não retornou nenhum resultado!</h3>", // Html com a mensagem para ser apresentada quando não existirem resultados para os filtros selecionados
    filterErrorMsg: "Houve um erro ao tentar filtrar a página!", // Mensagem de erro exibida quando existe algum erro de servidor ao aplicar os filtros
    searchUrl: null, // Url da página de busca (opicional)
    usePopup: false, // opção p/ definir se deseja que a mensagem de não localizado seja exibida em um popup
    showLinks: true, // Exibe o menu de links caso o de filtro não seja encontrado
    popupAutoCloseSeconds: 3, // Caso esteja utilizando popup, defina aqui o tempo para que ele feche automaticamente
    // Função que retorna o valor p/ onde a página deve rolar quando o usuário marca ou desmarca um filtro
    showSelectedFilters: false,
    filtersWrapper: ".otx-selectedfilters",
    clearAllTxt: "Limpar",
    infinityScroll: false,
    //para aplicar somente com clique em botão
    applyAllInOnce: false,
    //range price
    rangePrice: true,
    filterScrollTop: function (shelfOffset) {
      return shelfOffset.top - 230;
    },
    callback: function () {},
    filterCategorie: function () {
      var $filterDiv = $(defaults.filtersWrapper),
        $filterList = $filterDiv;
      $filterList.empty(),
        $filterList.append("<h5>Filtros selecionados</h5>"),
        $filterDiv.removeClass("is--collapsed");

      if ($(".bread-crumb li").length > 2) {
        $(".bread-crumb li").each(function (i) {
          if (i > 0 && $(this).text().toLowerCase().indexOf("busca") < 0) {
            let linkPrevioslyText = $(".bread-crumb li:eq(" + i + ")").text();
            var tIndex = window.rexFilters.name.findIndex(
              (n) => n == linkPrevioslyText
            );
            var filters = window.rexFilters;
            var fields = filters.fields.slice();
            var map = filters.map.slice();

            fields = filters.fields.slice();
            map = filters.map.slice();
            fields.splice(tIndex, 1);
            map.splice(tIndex, 1);

            let linkPrevioslyHref = fn.replaceSpecialChars(linkPrevioslyText);
            linkPrevioslyHref = `/${fields.join("/")}?map=${map.join(",")}`;
            let linkPrevioslyElem = `<a class="c-category__remove-filter-item remove-category" href="${linkPrevioslyHref}"><span class="is--icon c-category__remove-filter-icon"><i class="icon icon-close"></i></span><span class="c-category__remove-filter-span">${linkPrevioslyText}</span></a>`;
            $filterList.append(linkPrevioslyElem);
          }
        });
        $filterList.append(
          '<button class="filters__clearAll js-filters__clearAll">' +
            defaults.clearAllTxt +
            "</button>"
        );
        $(".otx-selectedfilters").addClass("is-active");
        /*
         let bFather = window.location.pathname.split("/")[1];
         let linkPrevioslyText = $(".bread-crumb li:eq("+($(".bread-crumb li").length-1)+")").text();
         let linkPrevioslyHref = $(".bread-crumb li:eq("+($(".bread-crumb li").length-2)+") a").attr("href")||$(".bread-crumb li:eq("+($(".bread-crumb li").length-3)+") a").attr("href")||"/";
         let linkPrevioslyElem = `<a class="c-category__remove-filter-item remove-category" href="${linkPrevioslyHref}"><span class="is--icon c-category__remove-filter-icon"><i class="icon icon-close"></i></span><span class="c-category__remove-filter-span">${linkPrevioslyText}</span></a>`;
 
         if(vtxctx.searchTerm && window.location.pathname.split("/").length >= 3) {
           let linkPrevioslyCatText = $(".bread-crumb li:eq(1)").text();
           let linkPrevioslyCatHref = "/"+vtxctx.searchTerm;
           let linkPrevioslyCat = `<a class="c-category__remove-filter-item remove-category" href="${linkPrevioslyCatHref}"><span class="is--icon c-category__remove-filter-icon"><i class="icon icon-close"></i></span><span class="c-category__remove-filter-span">${linkPrevioslyCatText}</span></a>`;
         $filterList.append(linkPrevioslyCat)
         }
         $filterList.append(linkPrevioslyElem)
         $filterList.append('<button class="filters__clearAll js-filters__clearAll">'+defaults.clearAllTxt+'</button>');
         $(".otx-selectedfilters").show();
       */
      }
    },
    // Cálculo do tamanho do conteúdo/vitrine para que uma nova página seja chamada antes do usuário chegar ao "final" do site
    getShelfHeight: function (container) {
      return container.scrollTop() + container.height();
    },
    // Callback após inserir a prateleira na página
    shelfCallback: function () {
      loadedPages();
    },
    filtersShelfCallback: function () {
      if ($(".otx-selectedfilters").find("li").length) {
        $(".sidebar__sfilters").show();
      } else {
        $(".sidebar__sfilters").hide();
      }
    },
    // Callback em cada requisição Ajax (Para requisiÃ§Ãµes feitas com sucesso)
    // Recebe como parâmetro um objeto contendo a quantidade total de requisiÃ§Ãµes feitas e a quantidade de filtros selecionados
    oioajaxCallback: function () {},
    ajaxCallback: function () {
      if (defaults.showSelectedFilters) {
        var filters = window.rexFilters;
        var fields = filters.fields.slice();
        var map = filters.map.slice();
        var price = filters.price;

        var $box = $(".search-multiple-navigator").eq(0),
          $filterDiv = $(defaults.filtersWrapper),
          $filterList = $filterDiv,
          $selected = $box.find("label.sr_selected"),
          $li = "";

        //var filters = window.rexFilters;
        //var fields = filters.fields.slice();
        //var map = filters.map.slice();
        //$.each(filters.fields, function(i) {
        //	fields = filters.fields.slice();
        //	map = filters.map.slice();
        //	fields.splice(i,1)
        //	map.splice(i,1)
        //	console.log(filters.name[i])
        //	console.log(`/${fields.join("/")}?map=${map.join(",")}`)
        //	$li = `<li class="c-category__remove-filter-item js-remove-filter data-filter="sr_verde sr_selected">
        //					<span class="is--icon c-category__remove-filter-icon">
        //					<i class="icon icon-close"></i>
        //					</span><span class="c-category__remove-filter-span">Verde </span>
        //				</li>`;
        //	$filterList.append($li)
        //})

        if (!$selected.length && $(".bread-crumb li").length < 2) {
          $filterDiv.addClass("is--collapsed"), $filterList.empty();
        } else {
          options.filterCategorie();

          $selected.each(function () {
            var fieldset = $(this).attr("fieldset");
            var text = $(this).text(),
              $li = $("<li>")
                .addClass(
                  "c-category__remove-filter-item js-remove-filter " + fieldset
                )
                .attr("data-filter", $(this).attr("class"));
            $li
              .append(
                $(
                  '<span class="is--icon c-category__remove-filter-icon"><i class="icon icon-close"></i></span> '
                )
              )
              .append(
                $('<span class="c-category__remove-filter-span">').text(text)
              ),
              $filterList.append($li);
          });

          //if(price.name!="" && price.max.toFixed(2)!=price.maxselected) {
          //	var $li = $("<li>").addClass("c-category__remove-filter-item is--price js-remove-price").attr("data-filter", "sr-price").attr("title", price.name);
          //  $li.append($('<span class="is--icon c-category__remove-filter-icon"><i class="icon icon-close"></i></span> ')).append($('<span class="c-category__remove-filter-span">').text(price.name)),
          //  $filterList.append($li)
          //}
          if ($selected.length || $("a.remove-category").length) {
            $(".otx-selectedfilters").addClass("is-active");
            $(".filters__clearAll").remove();
            $filterList.append(
              '<button class="filters__clearAll js-filters__clearAll">' +
                defaults.clearAllTxt +
                "</button>"
            );
          } else {
            $(".otx-selectedfilters").removeClass("is-active");
          }
        }
      }
      $("#ajaxBusy").hide();
      $(".helperComplement").remove();
    },
    lineSaver: function (line) {
      if (history.pushState) {
        var t = window.location.href;
        if (t.indexOf("line=") > 0) {
          var newurl = t.replace(/line=(\w+)/, "line=" + line);
        } else {
          var prefix = "?";
          if (t.indexOf("?") > 0) {
            prefix = "&";
          }
          var newurl = t + prefix + "line=" + line;
        }
        window.history.pushState({ path: newurl }, "", newurl);
      }
    },
    paginator: function (page) {
      if (
        history.pushState &&
        typeof page != "undefined" &&
        !window.firstPaginatorLoader
      ) {
        var t = window.location.href;
        if (t.indexOf("pg=") > 0) {
          var newurl = t.replace(/pg=(\w+)/, "pg=" + page);
        } else {
          var prefix = "?";
          if (t.indexOf("?") > 0) {
            prefix = "&";
          }
          var newurl = t + prefix + "pg=" + page;
        }
        window.history.pushState({ path: newurl }, "", newurl);
      }
    },
    paginatorLoader: function () {
      var t = window.location.search;

      if (t.indexOf("pg=") > 0) {
        var previouslyPage = parseInt(t.split("pg=")[1]);
      }

      if (!previouslyPage || !window.firstPaginatorLoader) {
        window.firstPaginatorLoader = false;
        return false;
      }

      if (previouslyPage >= window.currentPage) {
        var currentItems = loadContentE
          .find(options.shelfClass)
          .children("ul")
          .filter(":last");
        currentItems.after(elemLoading);
        currentStatus = false;
        pageJqxhr = jQuery.ajax({
          url: fn.getUrl(true),
          async: false,
          success: function (data) {
            if (data.trim().length < 1) {
              moreResults = false;
              log(
                "não existem mais resultados a partir da página: " +
                  (window.currentPage - 1),
                "Aviso"
              );
            } else {
              currentItems.append(jQuery(data).find("ul").html());
              options.shelfCallback();
            }
            currentStatus = true;
            elemLoading.remove();
            ajaxCallbackObj.requests++;
            options.ajaxCallback(ajaxCallbackObj);
            window.currentPage++;
            options.paginatorLoader();
            $(window).trigger("pagesBeforeLoadead");
          },
          error: function () {
            elemLoading.remove();
          },
        });
      } else {
        //to scroll down the page: should be better!!!
        $(window).load(function () {
          var heightToScroll = 0;
          if ($.urlParam("line")) {
            var n = parseInt($.urlParam("line"));
            heightToScroll = $(".prateleira[id^=ResultItems]")
              .find(".prateleira:last-child")
              .find("ul li:eq(" + n + ")")
              .offset().top;
          } else {
            heightToScroll = $(".prateleira[id^=ResultItems]")
              .find(".prateleira:last-child")
              .offset().top;
          }
          heightToScroll = heightToScroll - 180;
          var speed = Math.max(200 * (heightToScroll / 1000), 200);
          $("body").removeClass("loading-pages");
          $("html, body").animate({ scrollTop: heightToScroll }, speed);
        });
        //end
        window.firstPaginatorLoader = false;
      }
    },
    // Função que é executada quando a seleção de filtros não retorna nenhum resultado
    // Recebe como parâmetro um objeto contendo a quantidade total de requisiÃ§Ãµes feitas e a quantidade de filtros selecionados
    emptySearchCallback: function () {
      //$(defaults.filtersWrapper).empty()
      options.ajaxCallback(ajaxCallbackObj);
      options.oioajaxCallback(ajaxCallbackObj);

      loadedPages();
    },
    // Função para permitir ou não que a rolagem infinita execute na página esta deve retornar "true" ou "false"
    // Recebe como parâmetro um objeto contendo a quantidade total de requisiÃ§Ãµes feitas e a quantidade de filtros selecionados
    authorizeScroll: function () {
      return true;
    },
    // Função para permitir ou não que o conteúdo de "loadContent" seja atualizado. Esta deve retornar "true" ou "false"
    // Recebe como parâmetro um objeto contendo a quantidade total de requisiÃ§Ãµes feitas e a quantidade de filtros selecionados
    authorizeUpdate: function () {
      return true;
    },
    // Callback de cada laÃ§o percorrendo os fildsets e os labels. Retorna um objeto com algumas informaÃ§Ãµes
    labelCallback: function (data) {},
  };

  var options = jQuery.extend(defaults, opts),
    _console = "object" === typeof console,
    $empty = jQuery(""),
    elemLoading = jQuery(options.elemLoading),
    currentPage = 2,
    moreResults = true,
    _window = jQuery(window),
    _document = jQuery(document),
    _html = jQuery("html,body"),
    body = jQuery("body"),
    currentSearchUrl = "",
    otxCurrentSearchUrl = "",
    urlFilters = "",
    priceParam = "",
    searchUrl = "",
    animatingFilter = false,
    itemsPerPage = jQuery("#PS option:selected").val(),
    loadContentE = jQuery(options.loadContent),
    filtersWrapperE = jQuery(options.filtersWrapper),
    filtersMenuE = jQuery(options.filtersMenu),
    ajaxCallbackObj = { requests: 0, filters: 0, isEmpty: false },
    labelCallbackData = {},
    applyAllInOnce = jQuery(defaults.applyAllInOnce),
    rangePrice = jQuery(defaults.rangePrice),
    loadMoreButton = [
      '<div class="sr_wrapperMore">\n',
      '  <button class="sr_loadMore">\n',
      "    <span>Carregar mais produtos</span>\n",
      '    <i class="icon icon-down">\n',
      '     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13" height="7" viewBox="0 0 13 7">\n',
      "       <defs>\n",
      '         <path id="icon-down" d="M623.86 14l5.64 5.4 5.65-5.4.85.81-6.5 6.2-.84-.8-5.65-5.4z" />\n',
      "       </defs>\n",
      '       <use xlink:href="#icon-down" transform="translate(-623 -14)" />\n',
      "      </svg>\n",
      "    </i>\n",
      "  </button>\n",
      "</div>",
    ].join("");

  var fn = {
    getUrl: function (scroll) {
      var s = scroll || false;
      if (s)
        return currentSearchUrl.replace(
          /PageNumber=[0-9]*/,
          "PageNumber=" + window.currentPage
        );
      else
        return (searchUrl + urlFilters).replace(
          /PageNumber=[0-9]*/,
          "PageNumber=" + pageNumber
        );
    },
    getSearchUrl: function () {
      //var minPrice = if($('.pointer-label.low')[0]) parseFloat($('.pointer-label.low').text());
      //var maxPrice = if($('.pointer-label.high')[0]) parseFloat($('.pointer-label.high').text());
      //console.log(_curl1);
      //console.log(_curl1 + `&P:[${minPrice}+TO+${maxPrice}]`);//WARNING: no string-template allowed in non-transpiled scripts! IE hates it!
      //console.log(maxPrice, minPrice);

      var url, content, preg;
      jQuery("script:not([src])").each(function () {
        content = jQuery(this)[0].innerHTML;
        preg = /\/buscapagina\?.+&PageNumber=/i;
        if (content.search(/\/buscapagina\?/i) > -1) {
          url = preg.exec(content);
          return false;
        }
      });

      if (typeof url !== "undefined" && typeof url[0] !== "undefined")
        return url[0];
      else {
        log(
          "não foi possÃ­vel localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]"
        );
        return "";
      }
    },
    replaceSpecialChars: function (s, c) {
      var b = {
        "\u00e7": "c",
        "\u00e6": "ae",
        "\u0153": "oe",
        "\u00e1": "a",
        "\u00e9": "e",
        "\u00ed": "i",
        "\u00f3": "o",
        "\u00fa": "u",
        "\u00e0": "a",
        "\u00e8": "e",
        "\u00ec": "i",
        "\u00f2": "o",
        "\u00f9": "u",
        "\u00e4": "a",
        "\u00eb": "e",
        "\u00ef": "i",
        "\u00f6": "o",
        "\u00fc": "u",
        "\u00ff": "y",
        "\u00e2": "a",
        "\u00ea": "e",
        "\u00ee": "i",
        "\u00f4": "o",
        "\u00fb": "u",
        "\u00e5": "a",
        "\u00e3": "a",
        "\u00f8": "o",
        "\u00f5": "o",
        "\u00c1": "A",
        "\u00c9": "E",
        "\u00cd": "I",
        "\u00d3": "O",
        "\u00da": "U",
        "\u00ca": "E",
        "\u00d4": "O",
        "\u00dc": "U",
        "\u00c3": "A",
        "\u00d5": "O",
        "\u00c0": "A",
        "\u00c7": "C",
      };

      if (c) {
        return (s || "")
          .replace(/[\u00e0-\u00fa]/g, function (a) {
            return "undefined" != typeof b[a] ? b[a] : a;
          })
          .replace(/\/|\$|\&|\/|\\|\.|\!|\?/g, "-")
          .replace(/\#/g, "");
      } else {
        return (s || "")
          .toLowerCase()
          .replace(/[\u00e0-\u00fa]/g, function (a) {
            return "undefined" != typeof b[a] ? b[a] : a;
          })
          .replace(/\s|\/|\$|\&|\/|\\|\.|\!|\?/g, "-")
          .replace(/\#/g, "");
      }
    },
    scrollToTop: function () {
      var elem = body.find("#returnToTop");

      if (elem.length < 1) {
        elem = jQuery(
          '<div id="returnToTop"><a href="#">' +
            options.returnTopText +
            '<span class="arrowToTop"></span></a></div>'
        );
        body.append(elem);
      }

      var windowH = _window.height();
      _window.bind("resize", function () {
        windowH = _window.height();
      });
      _window.bind("scroll", function () {
        if (_window.scrollTop() > windowH)
          elem.stop(true).fadeTo(300, 1, function () {
            elem.show();
          });
        else
          elem.stop(true).fadeTo(300, 0, function () {
            elem.hide();
          });
      });
      elem.bind("click", function () {
        _html.animate({ scrollTop: 0 }, "slow");
        return false;
      });
    },
    insertLoadMore: function () {
      _curlNextPage = fn.getUrl(true);

      var totalsItems = parseInt(
          $(".resultado-busca-numero:eq(0) span.value").text()
        ),
        currentLenghtsItems = loadContentE
          .find(options.shelfClass)
          .find("> ul > li").length,
        totalLeft = 0;

      if (totalsItems - currentLenghtsItems > 0) {
        totalLeft = totalsItems - currentLenghtsItems;

        if (!defaults.infinityScroll) {
          $(".sr_wrapperMore").remove();
          $.ajax(_curlNextPage).done(function (data) {
            if (data != "" && $(".sr_wrapperMore").length <= 0) {
              $(loadMoreButton).insertAfter(loadContentE);
              $(".sr_loadMore")
                .find("span")
                .append(
                  `  <span class="qty__wrap">(<span class="qty">${totalLeft}</span>)</span>`
                );
            }
          });
        }
      } else {
        $(".sr_wrapperMore").remove();
      }
    },
    infinitScroll: function () {
      var elementPages, pages, currentStatus, tmp;

      elementPages = body.find(".pager:first").attr("id");
      tmp = (elementPages || "").split("_").pop();
      pages =
        null !== options.pageLimit
          ? options.pageLimit
          : window["pagecount_" + tmp];
      currentStatus = true;

      // Reportando erros
      // if("undefined"===typeof pages) log("não foi possÃ­vel localizar quantidade de páginas.\n Tente adicionar o .js ao final da página. \n[Método: infinitScroll]");

      if ("undefined" === typeof pages) pages = 99999999;

      if (defaults.infinityScroll) {
        _window.bind("scroll", function () {
          var _this = jQuery(this);
          if (
            !animatingFilter &&
            window.currentPage <= pages &&
            moreResults &&
            options.authorizeScroll(ajaxCallbackObj)
          ) {
            if (
              _this.scrollTop() + _this.height() >=
                options.getShelfHeight(loadContentE) &&
              currentStatus
            ) {
              var currentItems = loadContentE
                .find(options.shelfClass)
                .filter(":last");
              currentItems.after(elemLoading);
              currentStatus = false;
              pageJqxhr = jQuery.ajax({
                url: fn.getUrl(true),
                dataType: "html",
                success: function (data) {
                  if (data.trim().length < 1) {
                    moreResults = false;
                    log(
                      "não existem mais resultados a partir da página: " +
                        (window.currentPage - 1),
                      "Aviso"
                    );
                  } else {
                    currentItems
                      .find("> ul")
                      .filter(":last")
                      .append(jQuery(data).find("ul").html());
                    options.shelfCallback();
                  }
                  currentStatus = true;
                  elemLoading.remove();
                  ajaxCallbackObj.requests++;
                  options.ajaxCallback(ajaxCallbackObj);
                  options.oioajaxCallback(ajaxCallbackObj);

                  if (moreResults) {
                    options.paginator(window.currentPage);
                  }
                },
                error: function () {
                  elemLoading.remove();
                },
              });

              options.paginator(window.currentPage);
              window.currentPage++;
              options.lineSaver(0);
            }
          } else return false;
        });
      } else {
        fn.insertLoadMore();
      }
    },
    loadMore: function () {
      var elementPages, pages, currentStatus, tmp;

      elementPages = body.find(".pager:first").attr("id");
      tmp = (elementPages || "").split("_").pop();
      pages = Math.min(
        options.pageLimit || 99999999,
        window["pagecount_" + tmp]
      );
      currentStatus = true;

      // Reportando erros
      // if("undefined"===typeof pages) log("não foi possÃ­vel localizar quantidade de páginas.\n Tente adicionar o .js ao final da página. \n[Método: infinitScroll]");

      if (pages > 1) {
        fn.insertLoadMore();
      }

      $(document).on("click", ".sr_loadMore", function (ev) {
        var currentItems = loadContentE
          .find(options.shelfClass)
          .filter(":last");

        if (currentStatus) {
          loadContentE.append(elemLoading);
          currentStatus = false;
          otxCurrentSearchUrl = fn.getUrl(true);
          pageJqxhr = jQuery.ajax({
            url: fn.getUrl(true),
            success: function (data) {
              if (data.trim().length < 1) {
                moreResults = false;
                $(".sr_wrapperMore").remove();
                log(
                  "não existem mais resultados a partir da página: " +
                    (window.currentPage - 1),
                  "Aviso"
                );
              } else {
                //loadContentE.append(data);

                currentItems
                  .find("> ul")
                  .append(jQuery(data).find("ul").html());
                options.ajaxCallback(ajaxCallbackObj);
                options.oioajaxCallback(ajaxCallbackObj);
                options.paginator(window.currentPage);

                fn.insertLoadMore();
                window.currentPage++;
              }
              currentStatus = true;
              elemLoading.remove();
              ajaxCallbackObj.requests++;
            },
          });
        }
      });
    },
  };

  if (null !== options.searchUrl)
    currentSearchUrl = searchUrl = options.searchUrl;
  else currentSearchUrl = searchUrl = fn.getSearchUrl();

  // Reporting Errors
  if ($this.length < 1) {
    $(".js-apply-filters").remove();
    log("Nenhuma opção de filtro encontrada", "Aviso");
    if (options.showLinks)
      jQuery(options.linksMenu).css("visibility", "visible").show();
    fn.infinitScroll();
    fn.loadMore();
    fn.scrollToTop();
    return $this;
  }

  // Reporting Errors
  if (loadContentE.length < 1) {
    log(
      "Elemento para destino da requisição não foi encontrado \n (" +
        loadContentE.selector +
        ")"
    );
    return false;
  }
  if (filtersMenuE.length < 1) {
    log(
      "O menu de filtros não foi encontrado \n (" + filtersMenuE.selector + ")"
    );
  }

  var currentUrl = document.location.href,
    linksMenuE = jQuery(options.linksMenu),
    prodOverlay = jQuery('<div class="vtexSr-overlay"></div>'),
    departamentE = jQuery(options.menuDepartament),
    loadContentOffset = loadContentE.offset(),
    pageNumber = 1,
    shelfJqxhr = null,
    pageJqxhr = null;

  options.emptySearchElem.append(options.emptySearchMsg);
  loadContentE.before(prodOverlay);

  var fns = {
    exec: function () {
      fns.setFilterMenu();
      fns.fieldsetFormat();
      $this.each(function () {
        var _this = jQuery(this),
          label = _this.parent();

        if (_this.is(":checked")) {
          urlFilters += "&" + (_this.attr("rel") || "");
          // Adicionando classe ao label
          label.addClass("sr_selected");
        }

        fns.adjustText(_this);
        // Add span vazio (depois de executar de "adjustText")
        label.append(
          '<span class="sr_box"></span><span class="sr_box2"></span>'
        );

        _this.bind("change", function () {
          console.log("Filtro");
          fns.inputAction();
          if (_this.is(":checked")) {
            fns.addFilter(_this);
          } else {
            fns.removeFilter(_this);
          }
          ajaxCallbackObj.filters = $this.filter(":checked").length;
        });
      });

      if ("" !== urlFilters) fns.addFilter($empty);
    },
    mergeMenu: function () {
      if (!options.mergeMenu) return false;

      var elem = departamentE;
      elem.insertAfter(options.insertMenuAfter);
      fns.departamentMenuFormat(elem);
    },
    mergeMenuList: function () {
      var i = 0;
      var catName =
        vtxctx.categoryName || $(".bread-crumb li:last-child").text();
      var catList =
        '<fieldset class="refino categories">\
               <h5 class="  CaracterÃ­sticas">' +
        catName +
        '</h5>\
               <div class="">\
               </div>\
                </fieldset>';
      //  filtersMenuE.find("> h3").after(catList).show();

      var elem = "h4";
      if (
        linksMenuE.find("h3 + ul:not(.productClusterSearchableIds)").length > 0
      ) {
        elem = "h3";
      }

      linksMenuE.find(elem).each(function () {
        var _telem = $(this).clone();
        var _tcname = fns.removeCounter(_telem.text()).trim();
        //var _tcname = _telem.text().trim();
        _telem.find("a").text(_tcname);

        //if(_tcname!=catName)
        //  $("fieldset.categories").find("div").append(_telem);
        var ul = $(this).next("ul:not(.productClusterSearchableIds)").clone();
        //  $("fieldset.categories").find("div").append(ul);
        fns.departamentMenuFormat(ul);
      });

      linksMenuE.find("h4, h5").each(function () {
        $(this).next("ul").andSelf().wrapAll('<fieldset class="refino"/>');
      });

      if ($(".bread-crumb li").length <= 2 && $("body").hasClass("busca")) {
        linksMenuE.find("h3").each(function (i) {
          var ul = linksMenuE
            .find("h3,h4")
            .eq(i)
            .next("ul:not(.productClusterSearchableIds)")
            .clone();
          var _telem = $(this).clone();
          $("fieldset.categories").find("div").append(_telem);
          fns.departamentMenuFormat(ul);
          i++;
        });
      }

      $("fieldset.refino").each(function () {
        var _this = $(this);
        _this.find("h4, h5").wrapInner("<span></span>");
        if ($(this).find("div").length > 0) {
          if ($(this).find("div").html().trim() == "") {
            _this.remove();
          }
        }
      });

      //if($(".bread-crumb li").length>2) {
      //	let bFather = window.location.pathname.split("/")[1];
      //    $.ajax({
      //        url:"/api/catalog_system/pub/facets/search/"+bFather+"?map=c"
      //    })
      //    .done(function(data) {
      //        if(data.CategoriesTrees[0].Children.length>1) {
      //        	console.log(data.CategoriesTrees[0].Name)
      //        	console.log(data.CategoriesTrees)
      //        	bFather=bFather.toUpperCase();
      //  				var arr = data.CategoriesTrees.find(cat => cat.Link === "/"+bFather);
      //  				if(arr) {
      //	        	var catFatherList = '<fieldset class="refino categoriesFather">\
      //					<h5 class="catsFather">'+arr.Name+'</h5>\
      //					<div class="">\
      //					</div>\
      //				   </fieldset>';
      //				filtersMenuE.find("> h3").after(catFatherList).show();
      //				$.each(arr.Children, function(i) {
      //					if(this.Name != $(".bread-crumb li:last-child").text())
      //						$("fieldset.categoriesFather").find("div").append(`<h4><a href="${this.Link}">${this.Name}</a></h4>`);
      //				})
      //  				}
      //        }
      //    });
      //}
    },

    departamentMenuFormat: function (elem) {
      elem.find("a").each(function () {
        var a = jQuery(this);
        a.text(fns.removeCounter(a.text()));
      });

      elem.find("li").each(function () {
        var li = jQuery(this);
        if (li.find("a").length < 1) {
          li.remove();
        }
      });
    },
    fieldsetFormat: function () {
      labelCallbackData.fieldsetCount = 0;
      labelCallbackData.tmpCurrentLabel = {};

      filtersMenuE.find("fieldset").each(function () {
        var $t = jQuery(this),
          label = $t.find("label"),
          fieldsetClass =
            "filtro_" +
            ($t.find("h5:first").text() || "")
              .toLowerCase()
              .replaceSpecialChars()
              .replace(/\s/g, "-");

        labelCallbackData[fieldsetClass] = {};

        // Ocultar fieldset quando não existe filtro e sair desste método
        if (label.length < 1 && !$t.hasClass("categories")) {
          $t.hide();
          return;
        }

        // Adicionar classe ao fieldset
        $t.addClass(fieldsetClass);

        // Adicionando classe e tÃ­tulo ao label
        label.each(function (ndx) {
          var t = jQuery(this),
            v = t.find("input").val() || "",
            labelClass =
              "sr_" + v.toLowerCase().replaceSpecialChars().replace(/\s/g, "-");

          labelCallbackData.tmpCurrentLabel = {
            fieldsetParent: [$t, fieldsetClass],
            elem: t,
          };

          labelCallbackData[fieldsetClass][ndx.toString()] = {
            className: labelClass,
            title: v,
          };

          t.addClass(labelClass).attr({
            title: v,
            index: ndx,
            fieldset: fieldsetClass,
          });

          options.labelCallback(labelCallbackData);
          

          var rex= /^fq=P:%[0-9A-Fa-f][0-9A-Fa-f][0-9]+\+TO\+[0-9]+%[0-9A-Fa-f][0-9A-Fa-f]$/; 
          
          
          const rel = t.find('input').attr("rel");

          if(rel.match(rex)) { 
            console.log('Deu Match');  
            t.find('input').attr("rel", decodeURIComponent(rel).replace('[','').replace(']',''));
          }
          


        });

        labelCallbackData.fieldsetCount++;
      });
    },
    inputAction: function () {
      if (null !== pageJqxhr) pageJqxhr.abort();
      if (null !== shelfJqxhr) shelfJqxhr.abort();
      window.currentPage = 2;
      moreResults = true;
    },

    getMaxrangePrice: function (trigger) {
      $.ajax({
        url: `/api/catalog_system/pub/products/search/${window.rexFilters.fields.join(
          "/"
        )}?map=${window.rexFilters.map.join(
          ","
        )}&O=OrderByPriceDESC&_from=1&_to=1`,
      }).done(function (data) {
        try {
          var firstAvailable = data[0].items.find((item) => {
            return item.sellers[0].commertialOffer.AvailableQuantity > 0;
          });
          var priceMax = firstAvailable.sellers[0].commertialOffer.ListPrice;
          window.rexFilters.price.max = priceMax;
          //  $('.slideRange').jRange('updateRange', '0,'+priceMax+'');

          if (
            trigger == "facets" ||
            parseInt($(".pointer-label.high").text()) > priceMax
          ) {
            //  $('.slideRange').jRange('setValue', '0,'+priceMax+'');
          }
        } catch (e) {}
      });
    },

    rangePrice: function () {
      if (options.rangePrice) {
        var rangePriceHtml = `<fieldset class="refino even filtro_faixa-de-preco">
                                 <h5 class="  even">preço</h5>
                                 <div>
                                   <div class="slideRange"></div>
                                 </div
                               </fieldset>`;

        $(".navigation-tabs .search-multiple-navigator").append(rangePriceHtml);

        var update = debounce(function () {
          urlFilters = urlFilters.replace(priceParam, "");
          var priceMin = parseFloat($(".pointer-label.low").text()).toFixed(2);
          var priceMax = parseFloat($(".pointer-label.high").text()).toFixed(2);
          priceParam = "&fq=P:" + priceMin + "+TO+" + priceMax + "";
          var facetPriceParam = "fq=P:[" + priceMin + "+TO+" + priceMax + "]";

          urlFilters = urlFilters + (priceParam || "");
          currentSearchUrl = fn.getUrl();

          // console.log(
          //   "urlFilters: " + urlFilters,
          //   "priceParam: " + priceParam,
          //   "currentSearchUrl: " + currentSearchUrl
          // );

          window.rexFilters.price.param = facetPriceParam
            ? facetPriceParam
            : "";
          window.rexFilters.price.name = `de R$${$(
            ".pointer-label.low"
          ).text()} até R$${$(".pointer-label.high").text()}`;
          window.rexFilters.price.minselected = priceMin;
          window.rexFilters.price.maxselected = priceMax;

          fns.updateShelf(currentSearchUrl);
          fns.updateFacets("");
        }, 900);

        // criacao do range pela lib
        //  $('.slideRange').jRange({
        //    from: 0,
        //    to: 2000,
        //    width: '100%',
        //    format: '%s',
        //    isRange : true,
        //    ondragend: function(){
        //      //evento apos mudança no filtro
        //      if(!options.applyAllInOnce) {
        //        update();
        //      }

        //    },
        //  });

        //  $(".department__sidebar").one("click",".filtro_faixa-de-preco", function(e) {
        //    $('.slideRange').jRange('setValue', '0,'+window.rexFilters.price.max+'');
        //  })

        //  fns.getMaxrangePrice();
      }
    },

    buildMapCategories: function () {
      var searchFields = [];
      var searchName = [];
      var map = [];

      $(".bread-crumb li").each(function (i) {
        if (i > 0 && $(this).text().toLowerCase().indexOf("busca") < 0) {
          let url = window.location.href;
          let linkPrevioslyText = $(".bread-crumb li:eq(" + i + ")").text();
          let linkPrevioslyHref;

          var l = $(".bread-crumb li:eq(" + i + ")").find("a");

          if (l.length > 0) {
            searchName.push(linkPrevioslyText);

            if (l.attr("href").indexOf("specificationFilter") > 0) {
              linkPrevioslyHref = fn.replaceSpecialChars(
                linkPrevioslyText,
                true
              );
            } else {
              linkPrevioslyHref = fn.replaceSpecialChars(
                linkPrevioslyText,
                false
              );
            }

            searchFields.push(linkPrevioslyHref);

            if (
              ~$(".bread-crumb li:eq(" + i + ")")
                .find("a")
                .attr("href")
                .indexOf("map=")
            ) {
              var m = $(".bread-crumb li:eq(" + i + ")")
                .find("a")
                .attr("href");
              m = m.split("map=")[1].split(",");
              m = m[m.length - 1];
              map.push(m);
            } else {
              map.push("c");
            }
          }

          if (vtxctx.searchTerm) {
            searchName.push(vtxctx.searchTerm);
            searchFields.push(vtxctx.searchTerm);
            map.push("ft");
          } else if (~window.partialSearchUrl.indexOf("productCluster")) {
            var pcm = $.urlParam("map")
              .split(",")
              .findIndex(
                (e) => e == "productCluster" || e == "productClusterIds"
              );

            var p = window.location.pathname;
            p = p.split("/");
            p.shift();

            searchName.push(p[pcm]);
            searchFields.push(p[pcm]);
            map.push("productCluster");
          }
        }
      });

      var filters = $.urlParam("filters");
      if (filters) {
        var filtersArr = decodeURIComponent(filters)
          .replace(/[\[\]']+/g, "")
          .split(",")
          .clean("");

        $.each(filtersArr, function (i) {
          searchName.push(filtersArr[i].split(":")[1]);
          searchFields.push(filtersArr[i].split(":")[1]);
          map.push(filtersArr[i].split(":")[0]);
        });
      }

      window.rexFilters = {
        price: {
          name: "",
          param: "",
          max: 2000,
          maxselected: "",
          minselected: "",
        },
        name: searchName,
        fields: searchFields,
        map: map,
      };
    },

    updateSearchLength: function (facets) {
      var searchlength = 0;
      $.each(facets.Departments, function (i) {
        searchlength += this.Quantity;
      });
      $(".custom-select__products-num").text(`${searchlength} produtos: `);
    },

    updateFacetsFilters: function (facets) {
      $.each(Object.keys(facets.SpecificationFilters), function (i) {
        var nameFilter = this.toString()
          .toLowerCase()
          .replaceSpecialChars()
          .replace(/\s/g, "-");

        if (nameFilter == "filtros-de-produto") {
          $("fieldset.filtro_" + nameFilter)
            .find("label")
            .addClass("is-inactive");
          $.each(facets.SpecificationFilters[this], function () {
            var specName = this.Name.toLowerCase()
              .replaceSpecialChars()
              .replace(/\s/g, "-");
            $("fieldset.filtro_" + nameFilter)
              .find(".sr_" + specName)
              .removeClass("is-inactive");
          });
        }
      });
    },
    updateFacets: function (input) {
      $.ajax({
        url: `/api/catalog_system/pub/facets/search/${window.rexFilters.fields.join(
          "/"
        )}?map=${window.rexFilters.map.join(",")}${
          window.rexFilters.price.param
            ? "&" + window.rexFilters.price.param
            : ""
        }`,
      }).done(function (data) {
        fns.updateSearchLength(data);
        fns.updateFacetsFilters(data);
        fns.checkIfAllSelected(input);
        window.rexFilters.facets = data;
      });

      fns.getMaxrangePrice("facet");
    },

    updateUrl: function (input, url) {
      if (window.triggeredFilters) {
        var spec = input.attr("rel").replace("fq=", "") || "";
        var curl = window.location.href;
        var regEx = /([?&]filters)=([^#&]*)/g;
        var newurl, filters;
        filters = $.urlParam("filters");
        var prefix = "";

        if (filters) {
          var filtersArr = decodeURIComponent(filters)
            .replace(/[\[\]']+/g, "")
            .split(",")
            .clean("");

          if (filtersArr.indexOf(spec) < 0) {
            filtersArr.push(spec);
          } else {
            filtersArr = $.removeA(filtersArr, spec);
          }
          var spec = filtersArr.join(",");
        }

        var params = $.query
          .set("filters", "[" + spec + "]")
          .set("pg", "1")
          .toString();

        newurl = curl.split("?")[0] + params;
        newurl = decodeURIComponent(newurl);

        window.history.pushState({ path: newurl }, "", newurl);
      }

      fns.buildMapCategories();
      //  fns.updateFacets(input);
    },
    checkIfAllSelected: function (input) {
      try {
        var parentFieldset = input.closest("fieldset");

        if (
          parentFieldset.find("label").length ==
            parentFieldset.find("label.sr_selected").length ||
          parentFieldset.find("label").length ==
            parentFieldset.find("label.is-inactive").length +
              parentFieldset.find("label.sr_selected").length
        ) {
          parentFieldset.addClass("all-selected");
        } else {
          parentFieldset.removeClass("all-selected");
        }
      } catch (e) {
        console.log(
          "Wasn't possible to check the param 'input'. Check if you are filtering by price."
        );
      }
    },

    updateQuantityCategories: function (facets) {
      var c = facets.CategoriesTrees;

      var tc = c.find((cat) => cat.Name == vtxctx.departmentName);

      var _updateQuantityCategoriesElem = function (name, qty) {
        $("body")
          .find(".navigation-tabs a[title='" + name + "']")
          .append(` <span class="qty">(${qty})</span>`);
      };
      if (tc) {
        $.each(tc.Children, function (i) {
          _updateQuantityCategoriesElem(this.Name, this.Quantity);
        });
        _updateQuantityCategoriesElem(tc.Name, tc.Quantity);
      } else {
        $.each(c, function (i) {
          _updateQuantityCategoriesElem(this.Name, this.Quantity);
        });
      }
    },

    firstFacets: function () {
      try {
        $.ajax({
          url: `/api/catalog_system/pub/facets/search/${window.rexFilters.fields.join(
            "/"
          )}?map=${window.rexFilters.map.join(
            ","
          )}&fq=isAvailablePerSalesChannel_1:1`,
        }).done(function (data) {
          window.rexFilters.facets = data;
          fns.updateQuantityCategories(data);
        });
      } catch (e) {
        console.log("You have to insert the vtex breadcrumb controller!");
      }
    },

    addFilter: function (input) {
      urlFilters += "&" + (input.attr("rel") || "");
      prodOverlay.fadeTo(300, 0.6);
      currentSearchUrl = fn.getUrl();

      //console.log(filterPrice.getParm());

      if (!options.applyAllInOnce) {
        shelfJqxhr = jQuery.ajax({
          url: currentSearchUrl,
          success: fns.filterAjaxSuccess,
          error: fns.filterAjaxError,
        });
      }
      // Adicionando classe ao label
      input.parent().addClass("sr_selected");

      fns.updateUrl(input, currentSearchUrl);
    },
    removeFilter: function (input) {
      var url = input.attr("rel") || "";
      prodOverlay.fadeTo(300, 0.6);

      if (url !== "") urlFilters = urlFilters.replace("&" + url, "");

      currentSearchUrl = fn.getUrl();

      if (!options.applyAllInOnce) {
        shelfJqxhr = jQuery.ajax({
          url: currentSearchUrl,
          success: fns.filterAjaxSuccess,
          error: fns.filterAjaxError,
        });
      }
      // Removendo classe do label
      input.parent().removeClass("sr_selected");

      fns.updateUrl(input, currentSearchUrl);
    },
    filterAjaxSuccess: function (data) {
      var $data = jQuery(data);
      prodOverlay.fadeTo(300, 0, function () {
        jQuery(this).hide();
      });
      fns.updateContent($data);
      ajaxCallbackObj.requests++;
      _html.animate(
        {
          scrollTop: options.filterScrollTop(
            loadContentOffset || { top: 0, left: 0 }
          ),
        },
        600
      );
    },
    filterAjaxError: function () {
      prodOverlay.fadeTo(300, 0, function () {
        jQuery(this).hide();
      });
      //alert(options.filterErrorMsg);
      log("Houve um erro ao tentar fazer a requisição da página com filtros.");
    },
    updateContent: function ($data) {
      animatingFilter = true;
      if (!options.authorizeUpdate(ajaxCallbackObj)) return false;

      var shelf = $data.filter(options.shelfClass);
      var shelfPage = loadContentE.find(options.shelfClass);

      $(".sr_wrapperMore").remove();

      (shelfPage.length > 0 ? shelfPage : options.emptySearchElem).slideUp(
        600,
        function () {
          jQuery(this).remove();

          // Removendo a mensagem de busca vazia, esta remoção "forÃ§ada" foi feita para
          // corrigir um bug encontrado ao clicar em vários filtros
          if (options.usePopup) body.find(".boxPopUp2").vtexPopUp2();
          else options.emptySearchElem.remove();

          if (shelf.length > 0) {
            options.emptySearchElem.remove();
            shelf.hide();
            loadContentE.append(shelf);

            options.filtersShelfCallback();
            shelf.slideDown(600, function () {
              animatingFilter = false;
              loadedPages();

              options.shelfCallback();
              fn.insertLoadMore();
            });
            options.ajaxCallback(ajaxCallbackObj);
            options.oioajaxCallback(ajaxCallbackObj);
            ajaxCallbackObj.isEmpty = false;

            if ($.query.get("filters")) {
              options.paginatorLoader();
            }
          } else {
            ajaxCallbackObj.isEmpty = true;

            if (options.usePopup)
              options.emptySearchElem
                .addClass(
                  "freeContent autoClose ac_" + options.popupAutoCloseSeconds
                )
                .vtexPopUp2()
                .stop(true)
                .show();
            else {
              loadContentE.append(options.emptySearchElem);
              options.emptySearchElem
                .show()
                .css("height", "auto")
                .fadeTo(300, 0.2, function () {
                  options.emptySearchElem.fadeTo(300, 1);
                });
            }

            options.emptySearchCallback(ajaxCallbackObj);
          }
        }
      );
    },
    adjustText: function (input) {
      var label = input.parent(),
        text = label.text(),
        qtt = "";

      text = fns.removeCounter(text);

      label.text(text).prepend(input);
    },
    removeCounter: function (text) {
      return text.replace(/\([0-9]+\)/gi, function (a) {
        var qtt = a.replace(/\(|\)/, "");
        return "";
      });
    },
    setFilterMenu: function () {
      if (filtersMenuE.length > 0) {
        linksMenuE.hide();
        filtersMenuE.show();
      }
    },
    updateShelf: function (url) {
      shelfJqxhr = jQuery.ajax({
        url: url || currentSearchUrl,
        success: fns.filterAjaxSuccess,
        error: fns.filterAjaxError,
      });
    },
    fnsBts: function () {
      if (options.showSelectedFilters) {
        $("body").on("click", ".js-remove-filter", function () {
          var name = $(this).data("filter");
          (name = "label.".concat(name.split(/\s+/).join("."))),
            $(name).trigger("click");

          if (options.applyAllInOnce) {
            fns.updateShelf(currentSearchUrl);
          }
        });

        $("body").on("click", ".js-remove-price", function () {
          //  $('.slideRange').jRange('updateRange', '0,'+window.rexFilters.price.max);

          var paramtoremove = "&" + priceParam;
          priceParam = "";
          urlFilters += "&" + (priceParam || "");
          currentSearchUrl = fn.getUrl();
          currentSearchUrl = currentSearchUrl.split(paramtoremove).join("");
          fns.updateFacets("");
          fns.updateShelf(currentSearchUrl);
        });

        $("body").on("click", ".js-filters__clearAll", function () {
          var name = $(this).data("filter");

          var $filterDiv = $(defaults.filtersWrapper);

          if ($filterDiv.find(".remove-category").length < 1) {
            (name = "label.sr_selected"), $(name).trigger("click");
            if (options.applyAllInOnce) {
              fns.updateShelf(currentSearchUrl);
            }
          } else {
            window.location = "/";
          }
        });
      }

      if (options.applyAllInOnce) {
        var _otxUrlFilter;
        $("body").on("click", ".js-apply-filters", function (event) {
          fns.updateShelf(currentSearchUrl);
        });
      }

      $(window).load(function () {
        $(document).on("click", ".prateleira > ul > li a", function (i) {
          options.lineSaver($(this).closest("li").index());
          //options.paginator(1)
        });
      });
    },
  };

  fns.mergeMenuList();
  /*if(body.hasClass("departamento"))
     fns.mergeMenu();
   else if(body.hasClass("categoria") || body.hasClass("resultado-busca"))
     fns.mergeMenuList();*/

  fns.exec();
  fn.infinitScroll();
  fn.loadMore();
  fn.scrollToTop();
  fns.fnsBts();
  fns.buildMapCategories();
  options.callback();
  options.filterCategorie();
  fns.firstFacets();

  //  fns.rangePrice();
  if (!$.query.get("filters")) {
    options.paginatorLoader();
  }

  // Exibindo o menu
  filtersMenuE.css("visibility", "visible");
};

//callback for selected filters
$(document).ready(function () {

  filters = $.urlParam("filters");

  if (filters && filters != "[]") {
    filters = filters.replace(/[\[\]']+/g, "");
    filters = filters.split(",");
    var elemToTrigger = [];
    $.each(filters, function (i) {
      elemToTrigger.push("input[rel='fq=" + filters[i] + "']");
    });

    $(elemToTrigger.join(",")).trigger("click");

    console.log('filters',filters)
  } else {
    loadedPages();
    window.triggeredFilters = true;
  }

  //  if(window.rexFilters)
  //  $('.slideRange').jRange('setValue', '0,'+window.rexFilters.price.max+'');
  
  setTimeout(function () {
    $("body").removeClass("js-shelfloading").removeClass("loading-pages");
  }, 8000);
});
