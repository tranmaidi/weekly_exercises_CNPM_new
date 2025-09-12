import ne, { createContext as ae, useState as oe, useContext as se } from "react";
var j = { exports: {} }, R = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var M;
function ce() {
  if (M) return R;
  M = 1;
  var t = Symbol.for("react.transitional.element"), a = Symbol.for("react.fragment");
  function o(b, i, d) {
    var c = null;
    if (d !== void 0 && (c = "" + d), i.key !== void 0 && (c = "" + i.key), "key" in i) {
      d = {};
      for (var f in i)
        f !== "key" && (d[f] = i[f]);
    } else d = i;
    return i = d.ref, {
      $$typeof: t,
      type: b,
      key: c,
      ref: i !== void 0 ? i : null,
      props: d
    };
  }
  return R.Fragment = a, R.jsx = o, R.jsxs = o, R;
}
var _ = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var q;
function ue() {
  return q || (q = 1, process.env.NODE_ENV !== "production" && (function() {
    function t(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === ee ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case h:
          return "Fragment";
        case V:
          return "Profiler";
        case z:
          return "StrictMode";
        case H:
          return "Suspense";
        case Z:
          return "SuspenseList";
        case K:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case J:
            return "Portal";
          case X:
            return (e.displayName || "Context") + ".Provider";
          case G:
            return (e._context.displayName || "Context") + ".Consumer";
          case B:
            var r = e.render;
            return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case Q:
            return r = e.displayName || null, r !== null ? r : t(e.type) || "Memo";
          case S:
            r = e._payload, e = e._init;
            try {
              return t(e(r));
            } catch {
            }
        }
      return null;
    }
    function a(e) {
      return "" + e;
    }
    function o(e) {
      try {
        a(e);
        var r = !1;
      } catch {
        r = !0;
      }
      if (r) {
        r = console;
        var n = r.error, u = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return n.call(
          r,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          u
        ), a(e);
      }
    }
    function b(e) {
      if (e === h) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === S)
        return "<...>";
      try {
        var r = t(e);
        return r ? "<" + r + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var e = k.A;
      return e === null ? null : e.getOwner();
    }
    function d() {
      return Error("react-stack-top-frame");
    }
    function c(e) {
      if (N.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function f(e, r) {
      function n() {
        I || (I = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          r
        ));
      }
      n.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: n,
        configurable: !0
      });
    }
    function m() {
      var e = t(this.type);
      return Y[e] || (Y[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function x(e, r, n, u, v, p, g, w) {
      return n = p.ref, e = {
        $$typeof: C,
        type: e,
        key: r,
        props: p,
        _owner: v
      }, (n !== void 0 ? n : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: m
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: g
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: w
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function P(e, r, n, u, v, p, g, w) {
      var l = r.children;
      if (l !== void 0)
        if (u)
          if (re(l)) {
            for (u = 0; u < l.length; u++)
              A(l[u]);
            Object.freeze && Object.freeze(l);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else A(l);
      if (N.call(r, "key")) {
        l = t(e);
        var E = Object.keys(r).filter(function(te) {
          return te !== "key";
        });
        u = 0 < E.length ? "{key: someKey, " + E.join(": ..., ") + ": ...}" : "{key: someKey}", D[l + u] || (E = 0 < E.length ? "{" + E.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          u,
          l,
          E,
          l
        ), D[l + u] = !0);
      }
      if (l = null, n !== void 0 && (o(n), l = "" + n), c(r) && (o(r.key), l = "" + r.key), "key" in r) {
        n = {};
        for (var O in r)
          O !== "key" && (n[O] = r[O]);
      } else n = r;
      return l && f(
        n,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), x(
        e,
        l,
        p,
        v,
        i(),
        n,
        g,
        w
      );
    }
    function A(e) {
      typeof e == "object" && e !== null && e.$$typeof === C && e._store && (e._store.validated = 1);
    }
    var T = ne, C = Symbol.for("react.transitional.element"), J = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), z = Symbol.for("react.strict_mode"), V = Symbol.for("react.profiler"), G = Symbol.for("react.consumer"), X = Symbol.for("react.context"), B = Symbol.for("react.forward_ref"), H = Symbol.for("react.suspense"), Z = Symbol.for("react.suspense_list"), Q = Symbol.for("react.memo"), S = Symbol.for("react.lazy"), K = Symbol.for("react.activity"), ee = Symbol.for("react.client.reference"), k = T.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, N = Object.prototype.hasOwnProperty, re = Array.isArray, y = console.createTask ? console.createTask : function() {
      return null;
    };
    T = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var I, Y = {}, $ = T.react_stack_bottom_frame.bind(
      T,
      d
    )(), F = y(b(d)), D = {};
    _.Fragment = h, _.jsx = function(e, r, n, u, v) {
      var p = 1e4 > k.recentlyCreatedOwnerStacks++;
      return P(
        e,
        r,
        n,
        !1,
        u,
        v,
        p ? Error("react-stack-top-frame") : $,
        p ? y(b(e)) : F
      );
    }, _.jsxs = function(e, r, n, u, v) {
      var p = 1e4 > k.recentlyCreatedOwnerStacks++;
      return P(
        e,
        r,
        n,
        !0,
        u,
        v,
        p ? Error("react-stack-top-frame") : $,
        p ? y(b(e)) : F
      );
    };
  })()), _;
}
var L;
function le() {
  return L || (L = 1, process.env.NODE_ENV === "production" ? j.exports = ce() : j.exports = ue()), j.exports;
}
var s = le();
const ie = ({ children: t, onClick: a, variant: o = "primary" }) => {
  const b = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-300 text-black",
    danger: "bg-red-500 text-white"
  };
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      onClick: a,
      className: `px-4 py-2 rounded ${b[o]} hover:opacity-80`,
      children: t
    }
  );
}, pe = ({ value: t, onChange: a, placeholder: o }) => /* @__PURE__ */ s.jsx(
  "input",
  {
    value: t,
    onChange: a,
    placeholder: o,
    className: "border px-3 py-2 rounded w-full"
  }
), ve = ({ open: t, onClose: a, children: o }) => t ? /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 flex justify-center items-center", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-white p-6 rounded shadow-lg", children: [
  o,
  /* @__PURE__ */ s.jsx("button", { onClick: a, className: "mt-4 bg-gray-200 px-3 py-1 rounded", children: "Close" })
] }) }) : null, Ee = ({ title: t, children: a }) => /* @__PURE__ */ s.jsxs("div", { className: "border rounded shadow p-4", children: [
  /* @__PURE__ */ s.jsx("h3", { className: "font-bold mb-2", children: t }),
  a
] }), W = ae(void 0), de = ({ children: t }) => {
  const [a, o] = oe([]), b = (c) => {
    o(
      (f) => f.find((m) => m.id === c.id) ? f.map((m) => m.id === c.id ? { ...m, quantity: m.quantity + c.quantity } : m) : [...f, c]
    );
  }, i = (c, f) => {
    o((m) => m.map((x) => x.id === c ? { ...x, quantity: f } : x));
  }, d = (c) => {
    o((f) => f.filter((m) => m.id !== c));
  };
  return /* @__PURE__ */ s.jsx(W.Provider, { value: { items: a, addItem: b, updateItem: i, removeItem: d }, children: t });
}, U = () => {
  const t = se(W);
  if (!t) throw new Error("useCart must be used inside CartProvider");
  return t;
}, fe = ({ id: t, name: a, price: o, quantity: b }) => {
  const { updateItem: i, removeItem: d } = U();
  return /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-center border-b py-2", children: [
    /* @__PURE__ */ s.jsxs("span", { children: [
      a,
      " ($",
      o,
      ")"
    ] }),
    /* @__PURE__ */ s.jsxs("div", { children: [
      /* @__PURE__ */ s.jsx(
        "input",
        {
          type: "number",
          value: b,
          onChange: (c) => i(t, parseInt(c.target.value)),
          className: "w-16 text-center border rounded"
        }
      ),
      /* @__PURE__ */ s.jsx(ie, { variant: "danger", onClick: () => d(t), children: "Remove" })
    ] })
  ] });
}, me = () => {
  const { items: t } = U();
  return /* @__PURE__ */ s.jsxs("div", { children: [
    t.map((a) => /* @__PURE__ */ s.jsx(fe, { ...a }, a.id)),
    /* @__PURE__ */ s.jsxs("div", { className: "mt-4 font-bold", children: [
      "Total: $",
      t.reduce((a, o) => a + o.price * o.quantity, 0)
    ] })
  ] });
}, xe = () => /* @__PURE__ */ s.jsx(de, { children: /* @__PURE__ */ s.jsxs("div", { style: { border: "1px solid black", padding: "16px" }, children: [
  /* @__PURE__ */ s.jsx("h2", { children: "🛒 My Cart" }),
  /* @__PURE__ */ s.jsx(me, {})
] }) });
export {
  ie as Button,
  Ee as Card,
  xe as Cart,
  fe as CartItem,
  me as CartList,
  de as CartProvider,
  pe as Input,
  ve as Modal,
  U as useCart
};
