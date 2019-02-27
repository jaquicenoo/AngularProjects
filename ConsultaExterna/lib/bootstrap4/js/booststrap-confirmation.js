/*!
 * Bootstrap Confirmation (v4.0.3)
 * @copyright 2013 Nimit Suwannagate <ethaizone@hotmail.com>
 * @copyright 2014-2018 Damien "Mistic" Sorel <contact@git.strangeplanet.fr>
 * @licence Apache License, Version 2.0
 */
! function(t, e) { "object" == typeof exports && "undefined" != typeof module ? e(require("jquery"), require("bootstrap")) : "function" == typeof define && define.amd ? define(["jquery", "bootstrap"], e) : e((t = t || self).jQuery) }(this, function(a) {
    "use strict";

    function l(t, e) {
        for (var n = 0; n < e.length; n++) {
            var o = e[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o)
        }
    }

    function t(i) {
        for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {},
                e = Object.keys(r);
            "function" == typeof Object.getOwnPropertySymbols && (e = e.concat(Object.getOwnPropertySymbols(r).filter(function(t) { return Object.getOwnPropertyDescriptor(r, t).enumerable }))), e.forEach(function(t) {
                var e, n, o;
                e = i, o = r[n = t], n in e ? Object.defineProperty(e, n, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : e[n] = o
            })
        }
        return i
    }
    if ("undefined" == typeof(a = a && a.hasOwnProperty("default") ? a.default : a).fn.popover || "4" !== a.fn.popover.Constructor.VERSION.split(".").shift()) throw new Error("Bootstrap Confirmation 4 requires Bootstrap Popover 4");
    var e = a.fn.popover.Constructor,
        f = "confirmation",
        u = "bs." + f,
        p = "." + u,
        n = a.fn[f],
        h = "btn btn-sm h-100 d-flex align-items-center",
        d = t({}, e.DefaultType, { singleton: "boolean", popout: "boolean", copyAttributes: "(string|array)", onConfirm: "function", onCancel: "function", btnOkClass: "string", btnOkLabel: "string", btnOkIconClass: "string", btnOkIconContent: "string", btnCancelClass: "string", btnCancelLabel: "string", btnCancelIconClass: "string", btnCancelIconContent: "string", buttons: "array" }),
        g = t({}, e.Default, { _attributes: {}, _selector: null, placement: "top", title: "Are you sure?", trigger: "click", confirmationEvent: void 0, content: "", singleton: !1, popout: !1, copyAttributes: "href target", onConfirm: a.noop, onCancel: a.noop, btnOkClass: "btn-primary", btnOkLabel: "Yes", btnOkIconClass: "", btnOkIconContent: "", btnCancelClass: "btn-secondary", btnCancelLabel: "No", btnCancelIconClass: "", btnCancelIconContent: "", buttons: [], template: '\n<div class="popover confirmation">\n  <div class="arrow"></div>\n  <h3 class="popover-header"></h3>\n  <div class="popover-body">\n    <p class="confirmation-content"></p>\n    <div class="confirmation-buttons text-center">\n      <div class="btn-group">\n        <a href="#" class="' + h + '" data-apply="confirmation"></a>\n        <a href="#" class="' + h + '" data-dismiss="confirmation"></a>\n      </div>\n    </div>\n  </div>\n</div>' });
    g.whiteList && g.whiteList["*"].push("data-apply", "data-dismiss");
    var C, b = "fade",
        y = "show",
        m = ".popover-header",
        v = ".confirmation-content",
        E = ".confirmation-buttons .btn-group",
        _ = "[data-apply=confirmation]",
        O = "[data-dismiss=confirmation]",
        k = { 13: "Enter", 27: "Escape", 39: "ArrowRight", 40: "ArrowDown" },
        I = { HIDE: "hide" + p, HIDDEN: "hidden" + p, SHOW: "show" + p, SHOWN: "shown" + p, INSERTED: "inserted" + p, CLICK: "click" + p, FOCUSIN: "focusin" + p, FOCUSOUT: "focusout" + p, MOUSEENTER: "mouseenter" + p, MOUSELEAVE: "mouseleave" + p, CONFIRMED: "confirmed" + p, CANCELED: "canceled" + p, KEYUP: "keyup" + p },
        o = function(o) {
            var t, e, n, i, r;

            function s(t, e) { var n; if (((n = o.call(this, t, e) || this).config.popout || n.config.singleton) && !n.config.rootSelector) throw new Error("The rootSelector option is required to use popout and singleton features since jQuery 3."); return n._isDelegate = !1, e.selector ? (e._selector = e.rootSelector + " " + e.selector, n.config._selector = e._selector) : e._selector ? (n.config._selector = e._selector, n._isDelegate = !0) : n.config._selector = e.rootSelector, void 0 === n.config.confirmationEvent && (n.config.confirmationEvent = n.config.trigger), n.config.selector || n._copyAttributes(), n._setConfirmationListeners(), n }
            e = o, (t = s).prototype = Object.create(e.prototype), (t.prototype.constructor = t).__proto__ = e, n = s, r = [{ key: "VERSION", get: function() { return "4.0.3" } }, { key: "Default", get: function() { return g } }, { key: "NAME", get: function() { return f } }, { key: "DATA_KEY", get: function() { return u } }, { key: "Event", get: function() { return I } }, { key: "EVENT_KEY", get: function() { return p } }, { key: "DefaultType", get: function() { return d } }], (i = null) && l(n.prototype, i), r && l(n, r);
            var c = s.prototype;
            return c.isWithContent = function() { return !0 }, c.setContent = function() {
                var t = a(this.getTipElement()),
                    e = this._getContent();
                "function" == typeof e && (e = e.call(this.element)), this.setElementContent(t.find(m), this.getTitle()), t.find(v).toggle(!!e), e && this.setElementContent(t.find(v), e), 0 < this.config.buttons.length ? this._setCustomButtons(t) : this._setStandardButtons(t), t.removeClass(b + " " + y), this._setupKeyupEvent()
            }, c.dispose = function() { this._cleanKeyupEvent(), o.prototype.dispose.call(this) }, c.hide = function(t) { this._cleanKeyupEvent(), o.prototype.hide.call(this, t) }, c._copyAttributes = function() {
                var e = this;
                this.config._attributes = {}, this.config.copyAttributes ? "string" == typeof this.config.copyAttributes && (this.config.copyAttributes = this.config.copyAttributes.split(" ")) : this.config.copyAttributes = [], this.config.copyAttributes.forEach(function(t) { e.config._attributes[t] = a(e.element).attr(t) })
            }, c._setConfirmationListeners = function() {
                var e = this;
                this.config.selector ? a(this.element).on(this.config.trigger, this.config.selector, function(t, e) { e || (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation()) }) : (a(this.element).on(this.config.trigger, function(t, e) { e || (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation()) }), a(this.element).on(I.SHOWN, function() { e.config.singleton && a(e.config._selector).not(a(this)).filter(function() { return void 0 !== a(this).data(u) }).confirmation("hide") })), this._isDelegate || (this.eventBody = !1, this.uid = this.element.id || s.getUID(f + "_group"), a(this.element).on(I.SHOWN, function() { e.config.popout && !e.eventBody && (e.eventBody = a("body").on(I.CLICK + "." + e.uid, function(t) { a(e.config._selector).is(t.target) || (a(e.config._selector).filter(function() { return void 0 !== a(this).data(u) }).confirmation("hide"), a("body").off(I.CLICK + "." + e.uid), e.eventBody = !1) })) }))
            }, c._setStandardButtons = function(t) {
                var e = this,
                    n = t.find(_).addClass(this.config.btnOkClass).html(this.config.btnOkLabel).attr(this.config._attributes);
                (this.config.btnOkIconClass || this.config.btnOkIconContent) && n.prepend(a("<i></i>").addClass(this.config.btnOkIconClass || "").text(this.config.btnOkIconContent || "")), n.off("click").one("click", function(t) { "#" === a(this).attr("href") && t.preventDefault(), e.config.onConfirm.call(e.element), a(e.element).trigger(I.CONFIRMED), a(e.element).trigger(e.config.confirmationEvent, [!0]), e.hide() });
                var o = t.find(O).addClass(this.config.btnCancelClass).html(this.config.btnCancelLabel);
                (this.config.btnCancelIconClass || this.config.btnCancelIconContent) && o.prepend(a("<i></i>").addClass(this.config.btnCancelIconClass || "").text(this.config.btnCancelIconContent || "")), o.off("click").one("click", function(t) { t.preventDefault(), e.config.onCancel.call(e.element), a(e.element).trigger(I.CANCELED), e.hide() })
            }, c._setCustomButtons = function(t) {
                var n = this,
                    o = t.find(E).empty();
                this.config.buttons.forEach(function(e) {
                    var t = a('<a href="#"></a>').addClass(h).addClass(e.class || "btn btn-secondary").html(e.label || "").attr(e.attr || {});
                    (e.iconClass || e.iconContent) && t.prepend(a("<i></i>").addClass(e.iconClass || "").text(e.iconContent || "")), t.one("click", function(t) { "#" === a(this).attr("href") && t.preventDefault(), e.onClick && e.onClick.call(a(n.element)), e.cancel ? (n.config.onCancel.call(n.element, e.value), a(n.element).trigger(I.CANCELED, [e.value])) : (n.config.onConfirm.call(n.element, e.value), a(n.element).trigger(I.CONFIRMED, [e.value])), n.hide() }), o.append(t)
                })
            }, c._setupKeyupEvent = function() { C = this, a(window).off(I.KEYUP).on(I.KEYUP, this._onKeyup.bind(this)) }, c._cleanKeyupEvent = function() { C === this && (C = void 0, a(window).off(I.KEYUP)) }, c._onKeyup = function(t) {
                if (this.tip) {
                    var e, n = a(this.getTipElement()),
                        o = t.key || k[t.keyCode || t.which],
                        i = n.find(E),
                        r = i.find(".active");
                    switch (o) {
                        case "Escape":
                            this.hide();
                            break;
                        case "ArrowRight":
                            e = r.length && r.next().length ? r.next() : i.children().first(), r.removeClass("active"), e.addClass("active").focus();
                            break;
                        case "ArrowLeft":
                            e = r.length && r.prev().length ? r.prev() : i.children().last(), r.removeClass("active"), e.addClass("active").focus()
                    }
                } else this._cleanKeyupEvent()
            }, s.getUID = function(t) { for (var e = t; e += ~~(1e6 * Math.random()), document.getElementById(e);); return e }, s._jQueryInterface = function(n) {
                return this.each(function() {
                    var t = a(this).data(u),
                        e = "object" == typeof n ? n : {};
                    if (e.rootSelector = a(this).selector || e.rootSelector, (t || !/destroy|hide/.test(n)) && (t || (t = new s(this, e), a(this).data(u, t)), "string" == typeof n)) {
                        if ("undefined" == typeof t[n]) throw new TypeError('No method named "' + n + '"');
                        t[n]()
                    }
                })
            }, s
        }(e);
    a.fn[f] = o._jQueryInterface, a.fn[f].Constructor = o, a.fn[f].noConflict = function() { return a.fn[f] = n, o._jQueryInterface }
});
//# sourceMappingURL=bootstrap-confirmation.min.js.map