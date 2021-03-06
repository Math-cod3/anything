!function(e) {
    function n(o) {
        if (t[o])
            return t[o].exports;
        var i = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(i.exports, i, i.exports, n),
        i.l = !0,
        i.exports
    }
    var t = {};
    n.m = e,
    n.c = t,
    n.i = function(e) {
        return e
    }
    ,
    n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: o
        })
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n)
    }
    ,
    n.p = "",
    n(n.s = 4)
}([function(e, n, t) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var o = {
        shelfId: null,
        appendTo: null,
        notFound: null,
        limit: 10
    };
    n.defaultSettings = o
}
, function(e, n, t) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    }),
    n.inputEvents = void 0;
    var o = t(3)
      , i = t(2)
      , u = {
        init: function(e, n) {
            this.watchInputEvent.apply(e, [n])
        },
        watchInputEvent: function(e) {
            var n = this
              , t = new o.SearchHelper
              , u = new i.SearchHTTP;
            t.setConfig(e),
            this.on("keyup focus", function() {
                t.setTyping(!0),
                setTimeout(function() {
                    t.setTyping(!1)
                }, t.getDelay()),
                setTimeout(function() {
                    if (!t.getTyping()) {
                        var o = n.val() || "";
                        if (o.search(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/) > -1) {
                            o = o.replace(/\./g, '');
                        };
                        if (o = o.trim()) {
                            if (t.getCache(o))
                                return t.appendResults(t.getCache(o));
                            var i = u.get({
                                typedText: o,
                                qtd: e.limit,
                                shelfId: e.shelfId
                            });
                            i.fail(function(e) {
                                console.log(e),
                                t.notFound()
                            }),
                            i.success(function(e) {
                                if (!e)
                                    return t.notFound();
                                t.appendResults(e),
                                t.setCache(o, e)
                            })
                        } else
                            t.cleanResults()
                    }
                }, t.getDelay() + 50)
            })
        },
        watchOutputEvent: function() {
            this.on("blur", function() {
                setTimeout(function() {
                    sHelp.cleanResults()
                }, 500)
            })
        }
    };
    n.inputEvents = u
}
, function(e, n, t) {
    "use strict";
    function o(e, n) {
        if (!(e instanceof n))
            throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var i = function() {
        function e(e, n) {
            for (var t = 0; t < n.length; t++) {
                var o = n[t];
                o.enumerable = o.enumerable || !1,
                o.configurable = !0,
                "value"in o && (o.writable = !0),
                Object.defineProperty(e, o.key, o)
            }
        }
        return function(n, t, o) {
            return t && e(n.prototype, t),
            o && e(n, o),
            n
        }
    }()
      , u = function() {
        function e() {
            o(this, e)
        }
        return i(e, [{
            key: "get",
            value: function(e) {
                if (e.typedText && e.qtd && e.shelfId)
                    return $.ajax(this.getPreparedUrl(e))
            }
        }, {
            key: "getPreparedUrl",
            value: function(e) {
                return "/buscapagina?&ft=" + window.encodeURI(e.typedText) + "&PS=" + window.encodeURI(e.qtd) + "&sl=" + window.encodeURI(e.shelfId) + "&cc=50&sm=0&PageNumber=1"
            }
        }]),
        e
    }();
    n.SearchHTTP = u
}
, function(e, n, t) {
    "use strict";
    function o(e, n) {
        if (!(e instanceof n))
            throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var i = function() {
        function e(e, n) {
            for (var t = 0; t < n.length; t++) {
                var o = n[t];
                o.enumerable = o.enumerable || !1,
                o.configurable = !0,
                "value"in o && (o.writable = !0),
                Object.defineProperty(e, o.key, o)
            }
        }
        return function(n, t, o) {
            return t && e(n.prototype, t),
            o && e(n, o),
            n
        }
    }()
      , u = function() {
        function e() {
            o(this, e),
            this.typing = !1,
            this.delay = 400,
            this.cache = {},
            this.config = null
        }
        return i(e, [{
            key: "setConfig",
            value: function(e) {
                this.config = e
            }
        }, {
            key: "getTyping",
            value: function() {
                return this.typing
            }
        }, {
            key: "getDelay",
            value: function() {
                return this.delay
            }
        }, {
            key: "getCache",
            value: function(e) {
                return this.cache[e]
            }
        }, {
            key: "setTyping",
            value: function(e) {
                this.typing = e
            }
        }, {
            key: "setDelay",
            value: function(e) {
                this.delay = e
            }
        }, {
            key: "setCache",
            value: function(e, n) {
                this.cache[e] = n
            }
        }, {
            key: "appendResults",
            value: function(e) {
                this.config.appendTo.html(e)
            }
        }, {
            key: "notFound",
            value: function() {
                this.config.notFound ? this.config.notFound.call && this.config.appendTo.html(this.config.notFound()) : this.config.appendTo.html("<p><strong>Desculpe,</strong>Nenhum produto foi encontrado para esta busca.</p>")
            }
        }, {
            key: "cleanResults",
            value: function() {
                this.config.appendTo.empty()
            }
        }]),
        e
    }();
    n.SearchHelper = u
}
, function(e, n, t) {
    "use strict";
    var o = t(0)
      , i = t(1);
    !function(e) {
        e.fn.vtexCustomAutoComplete = function(n) {
            var t = e.extend(o.defaultSettings, n);
            if (!t.shelfId)
                throw new Error("options.shelfId is required");
            if (!t.appendTo)
                throw new Error("options.appendTo is required");
            if (!(t.appendTo instanceof jQuery))
                throw new Error('options.appendTo should be an instance of jQuery. Example "$("#myContainer")"');
            i.inputEvents.init(this, t)
        }
    }(jQuery)
}
]);
