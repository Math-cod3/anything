// ! function() {
//     var t = function(t) {
//         var e = jQuery.extend({
//             container: ".js--cart-list",
//             items: ".amount-items",
//             list: ".cart-list",
//             price_label: "",
//             total_price_currency: "",
//             total_price_container: ".js--subtotal-cart",
//             total_price_label: "",
//             cart_conclude: null,
//             remove_btn: !1,
//             finish_order_btn: ".finish-order-btn",
//             finish_order_btn_link: "/Site/Carrinho.aspx",
//             finish_order_btn_text: "Finalizar compra",
//             empty_cart_message: "Carrinho vazio",
//             items_text: ["", "", ""],
//             hover: ".tpl-cart",
//             callback: null,
//             cart_empty_cb: null,
//             quantity: !0,
//             total_price_class: ".x-sub",
//             total_price_label_class: ".total-price-label",
//             dropdown: !0,
//             show_images: !0
//         }, t),
//             a = {
//                 checkoutURL: "/api/checkout/pub/orderForm/",
//                 temp: null,
//                 total_itens: 0,
//                 total: "0,00",
//                 empty_cart: null,
//                 itens: 0,
//                 data: null,
//                 init: function(t) {
//                     a.get.cart.update(t)
//                 },
//                 checkoutUpdateURL: function() {
//                     return a.checkoutURL + a.orderFormId + "/items/update/"
//                 },
//                 get: {
//                     cart: {
//                         update: function(t) {
//                             var r, n = {
//                                 expectedOrderFormSections: ["items", "paymentData", "totalizers"]
//                             };
//                             t ? ($.extend(n, t), r = a.checkoutUpdateURL()) : r = a.checkoutURL, console.log(n), $.ajax({
//                                 url: r,
//                                 data: JSON.stringify(n),
//                                 dataType: "json",
//                                 contentType: "application/json; charset=utf-8",
//                                 type: "POST",
//                                 success: function(t) {
//                                     a.total_itens = t.items.length, $(".menu-entrar .item .qty").text(t.items.length), a.total_itens > 0 ? (a.orderFormId = t.orderFormId, a.data = t.items, a.set.cart.items(), a.total = _.intAsCurrency(t.value), $(".menu-entrar .valor .vl").text(_.intAsCurrency(t.value)), a.set.cart.total(), e.dropdown && a.mount.cart.dropdown()) : a.set.cart.empty();
//                                     updateValueMinicart(a.total_itens);
//                                 }
//                             })
//                         },
//                         text: function() {
//                             var t = e.items_text.length - 1,
//                                 r = e.items_text.length - 1 == 2 ? 1 : 0,
//                                 n = "undefined" == typeof e.items_text[t] ? "" : " ",
//                                 i = "undefined" == typeof e.items_text[r] ? "" : " ",
//                                 s = parseInt(a.total_itens) > 1 ? a.total_itens + n + e.items_text[t] : 0 == a.total_itens ? e.items_text[0] : a.total_itens + i + e.items_text[r];
//                             return s
//                         }
//                     }
//                 },
//                 mount: {
//                     cart: {
//                         dropdown: function() {
//                             var t, r, n, i, s, d = 0,
//                                 l = e.list.split(".")[1] || "",
//                                 o = jQuery("<ul/>").addClass(l);
//                             for (var c in a.data) {
//                                 if ("function" == typeof a.data[c]) break;
//                                 console.log(a.data[c].imageUrl);
//
//                                 var u = a.data[c].productId,
//                                     t = jQuery("<li>").addClass("row").addClass("row-" + d).attr("sku", u);
//                                 r = jQuery("<div>").addClass("col").addClass("col-0"), _span_img = jQuery("<div>").addClass("_qc-img").addClass("_qc-img-" + d).attr("sku", u), _span_product = jQuery("<div>").addClass("_qc-product").addClass("_qc-product-" + d), jQuery(_span_product).text(a.data[c].name), jQuery(r).append(_span_img.html('<img src="' + a.data[c].imageUrl + '" />')), e.show_images && jQuery(r).append(_span_product), n = jQuery("<div>").addClass("col").addClass("col-1");
//
//
//
//                                 var _ = a.data[c].quantity,
//                                     y = jQuery('<input type="text" value="' + _ + '" maxlength="2" />').attr("ndx", d).addClass("_qty").addClass("_qty-" + d).attr("sku", u),
//                                     p = jQuery("<a>", {
//                                         ndx: d
//                                     }).addClass("_add").addClass("_add-" + d).text("+"),
//                                     v = jQuery("<a>", {
//                                         ndx: d
//                                     }).addClass("_remove").addClass("_remove-" + d).text("-");
//                                 jQuery(n).append(y).append(p).append(v);
//
//                                 var m = (a.data[c].sellingPrice / 100).toFixed(2).toString().replace(/\./, ","),
//                                     f = m;
//                                 i = jQuery("<div>").addClass("col").addClass("col-2").html('R$ ' + f);
//                                 var j = a.data[c].id;
//                                 _remove_btn = jQuery("<a>").addClass("remove-link").addClass("remove-link-" + d).attr({
//                                     sku: j,
//                                     index: d
//                                 }).html("x"), s = jQuery("<div>").addClass("col").addClass("col-3"), jQuery(s).append(_remove_btn), jQuery(t).append(r).append(i).append(n).append(s), jQuery(o).append(t), d++
//                             }
//                             jQuery(e.container).html(o), a.set.events(), a.set.cart.conclusion(), a.set.cart.active(), e.show_images
//                         }
//                     }
//                 },
//                 set: {
//                     cart: {
//                         items: function() {
//                             var t = a.get.cart.text();
//                             jQuery(e.items).html(t)
//                         },
//                         total: function() {
//                             var t = e.total_price_currency + a.total;
//                             jQuery(e.total_price_container).html(t)
//                         },
//                         empty: function() {
//                             jQuery(e.hover).unbind().removeClass("active").addClass("empty");
//                             var t = a.get.cart.text();
//                             a.set.cart.items(t), jQuery(e.container).length > 0 && jQuery(e.container).html(""), "function" == typeof e.cart_empty_cb && e.cart_empty_cb()
//                         },
//                         conclusion: function() {
//                             var t = jQuery("<div/>").addClass("cart_conclude");
//                             if (jQuery(e.cart_conclude).length > 0) var t = jQuery(e.cart_conclude);
//                             var r = e.finish_order_btn.substring(1) || "",
//                                 n = jQuery("<a/>").addClass(r).attr("href", e.finish_order_btn_link).html(e.finish_order_btn_text);
//                             jQuery(t).append(n);
//
//                             var i = e.total_price_currency + a.total;
//
//                             $('<div class="x-finish"><div class="x-total"><div class="x-valorTotal">'+ i +'</div><div class="x-actions"><div class="x-tocart"><a href="/checkout/#/cart">Finalizar compra</a></div></div></div></div>').appendTo('#quickCartDropdown');
//
//                             //jQuery(t).append(l), jQuery(e.container).append(t);
//                         },
//                         active: function() {
//                             jQuery(e.hover).removeClass("empty").addClass("available"), "function" == typeof e.callback && e.callback()
//                         }
//                     },
//                     events: function() {
//                         var t = function() {
//                             jQuery(e.hover).hover(function() {
//                                 jQuery(this).addClass("active")
//                             }, function() {
//                                 jQuery(e.hover).removeClass("active")
//                             })
//                         },
//                             r = function(t) {
//                                 a.init({
//                                     orderItems: [{
//                                         index: t,
//                                         quantity: 0
//                                     }]
//                                 })
//                             },
//                             n = function() {
//                                 jQuery(e.container).find(".remove-link").click(function() {
//                                     r($(this).attr("index"));
//                                 });
//
//                             },
//                             i = function(t, r) {
//                                 jQuery(e.container).find("._qty,._add,._remove").removeClass("active").removeClass("keydown_binding"), jQuery(e.container).find("._qty").attr("readonly", !0), a.init({
//                                     orderItems: [{
//                                         index: t,
//                                         quantity: r
//                                     }]
//                                 })
//                             },
//                             s = function() {
//                                 jQuery(e.container).find('._qty:not(".keydown_binding")').addClass("keydown_binding").keydown(function(t) {
//                                     var e = t.charCode || t.keyCode || 0;
//                                     return 8 == e || 9 == e || 46 == e || e >= 37 && 40 >= e || e >= 48 && 57 >= e || e >= 96 && 105 >= e
//                                 })
//                             },
//                             d = function() {
//                                 jQuery(e.container).find('._add:not(".active")').addClass("active").click(function() {
//                                     _ndx = jQuery(this).attr("ndx"), _val = parseInt(jQuery("._qty-" + _ndx).val()), _val = _val >= 99 ? 99 : _val + 1, jQuery("._qty-" + _ndx).val(_val).change()
//                                 }), jQuery(e.container).find('._remove:not(".active")').addClass("active").click(function() {
//                                     _ndx = jQuery(this).attr("ndx"), _val = parseInt(jQuery("._qty-" + _ndx).val()), _val = 1 >= _val ? 1 : _val - 1, jQuery("._qty-" + _ndx).val(_val).change()
//                                 }), jQuery(e.container).find('._qty:not(".active")').addClass("active").keyup(function() {
//                                     jQuery(this).val() < 1 ? jQuery(this).val(1) : jQuery(this).val() > 99 && jQuery(this).val(99)
//                                 }).change(function() {
//                                     i(jQuery(this).attr("ndx"), jQuery(this).val())
//                                 })
//                             };
//                         t(), n(), s(), d()
//                     }
//                 },
//                 refresh: function() {
//                     a.init()
//                 }
//             };
//         a.init();
//         var r = function() {
//             return {
//                 refresh: a.refresh
//             }
//         };
//         return r()
//     };
//     jQuery.vtex_quick_cart = function(e) {
//         return new t(e)
//     }
// }(jQuery);
//
// var options = {
//     items_text: ['<em class="amount-items-em">0</em>', '', ''],
//     callback: function() {
//         vtexjs.checkout.getOrderForm().done(function(orderForm) {
//             var cartQtdItems = orderForm.items.length;
//             updateValueMinicart(cartQtdItems);
//         });
//     }
// }
//
// function updateValueMinicart(cartQtdItems){
//     $('.js--cart-link').addClass('is--active');
//
//     if(cartQtdItems > 0){
//
//     } else{
//         $('.js--cart-list').empty().append('<div class="x-empty-list">\
//                                                <p>Sua sacola está vazia</p>\
//                                             </div>');
//         $('.js--subtotal-cart').text('R$ 0,00');
//         $('.x-free-shipping').remove();
//         $('.x-dropdown-cart-foot').prepend(
//             $('<span class="x-free-shipping">').append('Faltam R$ 0,00 para o frete grátis')
//         );
//     }
//
//     $('.js--qtd-int-cart').text(cartQtdItems);
// }
//
// $(document).ready(function(){
//     jQuery.vtex_quick_cart(options);
//
//     $(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
//         $('.js--minicart__toggler').attr('data-val', orderForm.items.length)
//     });
// });
