(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module Dependencies
 */

try {
  var matches = require('matches-selector')
} catch (err) {
  var matches = require('component-matches-selector')
}

/**
 * Export `closest`
 */

module.exports = closest

/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Element} scope (optional)
 */

function closest (el, selector, scope) {
  scope = scope || document.documentElement;

  // walk up the dom
  while (el && el !== scope) {
    if (matches(el, selector)) return el;
    el = el.parentNode;
  }

  // check scope for match
  return matches(el, selector) ? el : null;
}

},{"component-matches-selector":2,"matches-selector":2}],2:[function(require,module,exports){
/**
 * Module dependencies.
 */

try {
  var query = require('query');
} catch (err) {
  var query = require('component-query');
}

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

},{"component-query":3,"query":3}],3:[function(require,module,exports){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

},{}],4:[function(require,module,exports){
var closest = require('component-closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector, true);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"component-closest":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _transformProps = require('./transform-props');

var _transformProps2 = _interopRequireDefault(_transformProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var h = function h(tag) {
  return function () {
    return isProps(arguments.length <= 0 ? undefined : arguments[0]) ? applyProps(tag)(arguments.length <= 0 ? undefined : arguments[0]) : appendChildren(tag).apply(undefined, arguments);
  };
};

var isObj = function isObj(o) {
  return o !== null && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
};

var isProps = function isProps(arg) {
  return isObj(arg) && !(arg instanceof Element);
};

var applyProps = function applyProps(tag) {
  return function (props) {
    return function () {
      if (isProps(arguments.length <= 0 ? undefined : arguments[0])) {
        return h(tag)(Object.assign({}, props, arguments.length <= 0 ? undefined : arguments[0]));
      }

      var el = h(tag).apply(undefined, arguments);
      var p = (0, _transformProps2.default)(props);
      Object.keys(p).forEach(function (k) {
        if (/^on/.test(k)) {
          el[k] = p[k];
        } else if (k === '__html') {
          el.innerHTML = p[k];
        } else {
          el.setAttribute(k, p[k]);
        }
      });
      return el;
    };
  };
};

var appendChildren = function appendChildren(tag) {
  return function () {
    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    var el = document.createElement(tag);
    children.map(function (c) {
      return c instanceof Element ? c : document.createTextNode(c);
    }).forEach(function (c) {
      return el.appendChild(c);
    });
    return el;
  };
};

exports.default = h;
},{"./transform-props":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var kebab = exports.kebab = function kebab(str) {
  return str.replace(/([A-Z])/g, function (g) {
    return '-' + g.toLowerCase();
  });
};

var parseValue = exports.parseValue = function parseValue(prop) {
  return function (val) {
    return typeof val === 'number' ? addPx(prop)(val) : val;
  };
};

var unitlessProperties = exports.unitlessProperties = ['lineHeight', 'fontWeight', 'opacity', 'zIndex'
// Probably need a few more...
];

var addPx = exports.addPx = function addPx(prop) {
  return function (val) {
    return unitlessProperties.includes(prop) ? val : val + 'px';
  };
};

var filterNull = exports.filterNull = function filterNull(obj) {
  return function (key) {
    return obj[key] !== null;
  };
};

var createDec = exports.createDec = function createDec(style) {
  return function (key) {
    return kebab(key) + ':' + parseValue(key)(style[key]);
  };
};

var styleToString = exports.styleToString = function styleToString(style) {
  return Object.keys(style).filter(filterNull(style)).map(createDec(style)).join(';');
};

var isStyleObject = exports.isStyleObject = function isStyleObject(props) {
  return function (key) {
    return key === 'style' && props[key] !== null && _typeof(props[key]) === 'object';
  };
};

var createStyle = exports.createStyle = function createStyle(props) {
  return function (key) {
    return isStyleObject(props)(key) ? styleToString(props[key]) : props[key];
  };
};

var reduceProps = exports.reduceProps = function reduceProps(props) {
  return function (a, key) {
    return Object.assign(a, _defineProperty({}, key, createStyle(props)(key)));
  };
};

var transformProps = exports.transformProps = function transformProps(props) {
  return Object.keys(props).reduce(reduceProps(props), {});
};

exports.default = transformProps;
},{}],7:[function(require,module,exports){
/*!
 * Layzr.js 2.2.1 - A small, fast, and modern library for lazy loading images.
 * Copyright (c) 2016 Michael Cavalea - http://callmecavs.github.io/layzr.js/
 * License: MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Layzr=e()}(this,function(){"use strict";var t={};t["extends"]=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t};var e=function(){function e(t,e){return c[t]=c[t]||[],c[t].push(e),this}function n(t,n){return n._once=!0,e(t,n),this}function r(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?c[t].splice(c[t].indexOf(e),1):delete c[t],this}function i(t){for(var e=this,n=arguments.length,i=Array(n>1?n-1:0),o=1;n>o;o++)i[o-1]=arguments[o];var s=c[t]&&c[t].slice();return s&&s.forEach(function(n){n._once&&r(t,n),n.apply(e,i)}),this}var o=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],c={};return t["extends"]({},o,{on:e,once:n,off:r,emit:i})},n=function(){function t(){return window.scrollY||window.pageYOffset}function n(){d=t(),r()}function r(){l||(requestAnimationFrame(function(){return u()}),l=!0)}function i(t){return t.getBoundingClientRect().top+d}function o(t){var e=d,n=e+v,r=i(t),o=r+t.offsetHeight,c=m.threshold/100*v;return o>=e-c&&n+c>=r}function c(t){if(w.emit("src:before",t),p&&t.hasAttribute(m.srcset))t.setAttribute("srcset",t.getAttribute(m.srcset));else{var e=g>1&&t.getAttribute(m.retina);t.setAttribute("src",e||t.getAttribute(m.normal))}w.emit("src:after",t),[m.normal,m.retina,m.srcset].forEach(function(e){return t.removeAttribute(e)}),a()}function s(t){var e=t?"addEventListener":"removeEventListener";return["scroll","resize"].forEach(function(t){return window[e](t,n)}),this}function u(){return v=window.innerHeight,h.forEach(function(t){return o(t)&&c(t)}),l=!1,this}function a(){return h=Array.prototype.slice.call(document.querySelectorAll("["+m.normal+"]")),this}var f=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],d=t(),l=void 0,h=void 0,v=void 0,m={normal:f.normal||"data-normal",retina:f.retina||"data-retina",srcset:f.srcset||"data-srcset",threshold:f.threshold||0},p=document.body.classList.contains("srcset")||"srcset"in document.createElement("img"),g=window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI,w=e({handlers:s,check:u,update:a});return w};return n});
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var listeners = {};

  var on = function on(e) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!cb) return;
    listeners[e] = listeners[e] || { queue: [] };
    listeners[e].queue.push(cb);
  };

  var emit = function emit(e) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var items = listeners[e] ? listeners[e].queue : false;
    items && items.forEach(function (i) {
      return i(data);
    });
  };

  return _extends({}, o, {
    emit: emit,
    on: on
  });
};

},{}],9:[function(require,module,exports){
(function (global){
// Best place to find information on XHR features is:
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

var reqfields = [
  'responseType', 'withCredentials', 'timeout', 'onprogress'
]

// Simple and small ajax function
// Takes a parameters object and a callback function
// Parameters:
//  - url: string, required
//  - headers: object of `{header_name: header_value, ...}`
//  - body:
//      + string (sets content type to 'application/x-www-form-urlencoded' if not set in headers)
//      + FormData (doesn't set content type so that browser will set as appropriate)
//  - method: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
//  - cors: If your using cross-origin, you will need this true for IE8-9
//
// The following parameters are passed onto the xhr object.
// IMPORTANT NOTE: The caller is responsible for compatibility checking.
//  - responseType: string, various compatability, see xhr docs for enum options
//  - withCredentials: boolean, IE10+, CORS only
//  - timeout: long, ms timeout, IE8+
//  - onprogress: callback, IE10+
//
// Callback function prototype:
//  - statusCode from request
//  - response
//    + if responseType set and supported by browser, this is an object of some type (see docs)
//    + otherwise if request completed, this is the string text of the response
//    + if request is aborted, this is "Abort"
//    + if request times out, this is "Timeout"
//    + if request errors before completing (probably a CORS issue), this is "Error"
//  - request object
//
// Returns the request object. So you can call .abort() or other methods
//
// DEPRECATIONS:
//  - Passing a string instead of the params object has been removed!
//
exports.ajax = function (params, callback) {
  // Any variable used more than once is var'd here because
  // minification will munge the variables whereas it can't munge
  // the object access.
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')
    , called = false

  var req = getRequest(params.cors)

  function cb(statusCode, responseText) {
    return function () {
      if (!called) {
        callback(req.status === undefined ? statusCode : req.status,
                 req.status === 0 ? "Error" : (req.response || req.responseText || responseText),
                 req)
        called = true
      }
    }
  }

  req.open(method, params.url, true)

  var success = req.onload = cb(200)
  req.onreadystatechange = function () {
    if (req.readyState === 4) success()
  }
  req.onerror = cb(null, 'Error')
  req.ontimeout = cb(null, 'Timeout')
  req.onabort = cb(null, 'Abort')

  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')

    if (!global.FormData || !(body instanceof global.FormData)) {
      setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
    }
  }

  for (var i = 0, len = reqfields.length, field; i < len; i++) {
    field = reqfields[i]
    if (params[field] !== undefined)
      req[field] = params[field]
  }

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(body)

  return req
}

function getRequest(cors) {
  // XDomainRequest is only way to do CORS in IE 8 and 9
  // But XDomainRequest isn't standards-compatible
  // Notably, it doesn't allow cookies to be sent or set by servers
  // IE 10+ is standards-compatible in its XMLHttpRequest
  // but IE 10 can still have an XDomainRequest object, so we don't want to use it
  if (cors && global.XDomainRequest && !/MSIE 1/.test(navigator.userAgent))
    return new XDomainRequest
  if (global.XMLHttpRequest)
    return new XMLHttpRequest
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Navigo", [], factory);
	else if(typeof exports === 'object')
		exports["Navigo"] = factory();
	else
		root["Navigo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var PARAMETER_REGEXP = /([:*])(\w+)/g;
	var WILDCARD_REGEXP = /\*/g;
	var REPLACE_VARIABLE_REGEXP = '([^\/]+)';
	var REPLACE_WILDCARD = '(?:.*)';
	var FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';
	
	function clean(s) {
	  if (s instanceof RegExp) return s;
	  return s.replace(/\/+$/, '').replace(/^\/+/, '/');
	}
	
	function regExpResultToParams(match, names) {
	  if (names.length === 0) return null;
	  if (!match) return null;
	  return match.slice(1, match.length).reduce(function (params, value, index) {
	    if (params === null) params = {};
	    params[names[index]] = value;
	    return params;
	  }, null);
	}
	
	function replaceDynamicURLParts(route) {
	  var paramNames = [],
	      regexp;
	
	  if (route instanceof RegExp) {
	    regexp = route;
	  } else {
	    regexp = new RegExp(clean(route).replace(PARAMETER_REGEXP, function (full, dots, name) {
	      paramNames.push(name);
	      return REPLACE_VARIABLE_REGEXP;
	    }).replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP);
	  }
	  return { regexp: regexp, paramNames: paramNames };
	}
	
	function getUrlDepth(url) {
	  return url.replace(/\/$/, '').split('/').length;
	}
	
	function compareUrlDepth(urlA, urlB) {
	  return getUrlDepth(urlA) < getUrlDepth(urlB);
	}
	
	function findMatchedRoutes(url) {
	  var routes = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  return routes.map(function (route) {
	    var _replaceDynamicURLPar = replaceDynamicURLParts(route.route);
	
	    var regexp = _replaceDynamicURLPar.regexp;
	    var paramNames = _replaceDynamicURLPar.paramNames;
	
	    var match = url.match(regexp);
	    var params = regExpResultToParams(match, paramNames);
	
	    return match ? { match: match, route: route, params: params } : false;
	  }).filter(function (m) {
	    return m;
	  });
	}
	
	function match(url, routes) {
	  return findMatchedRoutes(url, routes)[0] || false;
	}
	
	function root(url, routes) {
	  var matched = findMatchedRoutes(url, routes.filter(function (route) {
	    var u = clean(route.route);
	
	    return u !== '' && u !== '*';
	  }));
	  var fallbackURL = clean(url);
	
	  if (matched.length > 0) {
	    return matched.map(function (m) {
	      return clean(url.substr(0, m.match.index));
	    }).reduce(function (root, current) {
	      return current.length < root.length ? current : root;
	    }, fallbackURL);
	  }
	  return fallbackURL;
	}
	
	function isPushStateAvailable() {
	  return !!(typeof window !== 'undefined' && window.history && window.history.pushState);
	}
	
	function removeGETParams(url) {
	  return url.replace(/\?(.*)?$/, '');
	}
	
	function Navigo(r, useHash) {
	  this._routes = [];
	  this.root = useHash && r ? r.replace(/\/$/, '/#') : r || null;
	  this._useHash = useHash;
	  this._paused = false;
	  this._destroyed = false;
	  this._lastRouteResolved = null;
	  this._notFoundHandler = null;
	  this._defaultHandler = null;
	  this._ok = !useHash && isPushStateAvailable();
	  this._listen();
	  this.updatePageLinks();
	}
	
	Navigo.prototype = {
	  helpers: {
	    match: match,
	    root: root,
	    clean: clean
	  },
	  navigate: function navigate(path, absolute) {
	    var to;
	
	    path = path || '';
	    if (this._ok) {
	      to = (!absolute ? this._getRoot() + '/' : '') + clean(path);
	      to = to.replace(/([^:])(\/{2,})/g, '$1/');
	      history[this._paused ? 'replaceState' : 'pushState']({}, '', to);
	      this.resolve();
	    } else if (typeof window !== 'undefined') {
	      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
	    }
	    return this;
	  },
	  on: function on() {
	    var _this = this;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if (args.length >= 2) {
	      this._add(args[0], args[1]);
	    } else if (_typeof(args[0]) === 'object') {
	      var orderedRoutes = Object.keys(args[0]).sort(compareUrlDepth);
	
	      orderedRoutes.forEach(function (route) {
	        _this._add(route, args[0][route]);
	      });
	    } else if (typeof args[0] === 'function') {
	      this._defaultHandler = args[0];
	    }
	    return this;
	  },
	  notFound: function notFound(handler) {
	    this._notFoundHandler = handler;
	  },
	  resolve: function resolve(current) {
	    var handler, m;
	    var url = (current || this._cLoc()).replace(this._getRoot(), '');
	
	    if (this._paused || url === this._lastRouteResolved) return false;
	    if (this._useHash) {
	      url = url.replace(/^\/#/, '/');
	    }
	    url = removeGETParams(url);
	    m = match(url, this._routes);
	
	    if (m) {
	      this._lastRouteResolved = url;
	      handler = m.route.handler;
	      m.route.route instanceof RegExp ? handler.apply(undefined, _toConsumableArray(m.match.slice(1, m.match.length))) : handler(m.params);
	      return m;
	    } else if (this._defaultHandler && (url === '' || url === '/')) {
	      this._lastRouteResolved = url;
	      this._defaultHandler();
	      return true;
	    } else if (this._notFoundHandler) {
	      this._notFoundHandler();
	    }
	    return false;
	  },
	  destroy: function destroy() {
	    this._routes = [];
	    this._destroyed = true;
	    clearTimeout(this._listenningInterval);
	    typeof window !== 'undefined' ? window.onpopstate = null : null;
	  },
	  updatePageLinks: function updatePageLinks() {
	    var self = this;
	
	    if (typeof document === 'undefined') return;
	
	    this._findLinks().forEach(function (link) {
	      if (!link.hasListenerAttached) {
	        link.addEventListener('click', function (e) {
	          var location = link.getAttribute('href');
	
	          if (!self._destroyed) {
	            e.preventDefault();
	            self.navigate(clean(location));
	          }
	        });
	        link.hasListenerAttached = true;
	      }
	    });
	  },
	  generate: function generate(name) {
	    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    return this._routes.reduce(function (result, route) {
	      var key;
	
	      if (route.name === name) {
	        result = route.route;
	        for (key in data) {
	          result = result.replace(':' + key, data[key]);
	        }
	      }
	      return result;
	    }, '');
	  },
	  link: function link(path) {
	    return this._getRoot() + path;
	  },
	  pause: function pause(status) {
	    this._paused = status;
	  },
	  disableIfAPINotAvailable: function disableIfAPINotAvailable() {
	    if (!isPushStateAvailable()) {
	      this.destroy();
	    }
	  },
	  _add: function _add(route) {
	    var handler = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	    if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
	      this._routes.push({ route: route, handler: handler.uses, name: handler.as });
	    } else {
	      this._routes.push({ route: route, handler: handler });
	    }
	    return this._add;
	  },
	  _getRoot: function _getRoot() {
	    if (this.root !== null) return this.root;
	    this.root = root(this._cLoc(), this._routes);
	    return this.root;
	  },
	  _listen: function _listen() {
	    var _this2 = this;
	
	    if (this._ok) {
	      window.onpopstate = function () {
	        _this2.resolve();
	      };
	    } else {
	      (function () {
	        var cached = _this2._cLoc(),
	            current = undefined,
	            _check = undefined;
	
	        _check = function check() {
	          current = _this2._cLoc();
	          if (cached !== current) {
	            cached = current;
	            _this2.resolve();
	          }
	          _this2._listenningInterval = setTimeout(_check, 200);
	        };
	        _check();
	      })();
	    }
	  },
	  _cLoc: function _cLoc() {
	    if (typeof window !== 'undefined') {
	      return window.location.href;
	    }
	    return '';
	  },
	  _findLinks: function _findLinks() {
	    return [].slice.call(document.querySelectorAll('[data-navigo]'));
	  }
	};
	
	exports.default = Navigo;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _loop = require('loop.js');

var _loop2 = _interopRequireDefault(_loop);

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _nanoajax = require('nanoajax');

var _nanoajax2 = _interopRequireDefault(_nanoajax);

var _navigo = require('navigo');

var _navigo2 = _interopRequireDefault(_navigo);

var _dom = require('./lib/dom.js');

var _dom2 = _interopRequireDefault(_dom);

var _util = require('./lib/util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _navigo2.default(_util.origin);

var state = {
  _state: {
    route: '',
    title: '',
    prev: {
      route: '/',
      title: ''
    }
  },
  get route() {
    return this._state.route;
  },
  set route(loc) {
    this._state.prev.route = this.route;
    this._state.route = loc;
    (0, _util.setActiveLinks)(loc);
  },
  get title() {
    return this._state.title;
  },
  set title(val) {
    this._state.prev.title = this.title;
    this._state.title = val;
    document.title = val;
  }
};

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var root = options.root || document.body;
  var duration = options.duration || 0;
  var ignore = options.ignore || [];

  var events = (0, _loop2.default)();
  var render = (0, _dom2.default)(root, duration, events);

  var instance = Object.create(_extends({}, events, {
    stop: function stop() {
      state.paused = true;
    },
    start: function start() {
      state.paused = false;
    },

    go: go,
    push: push
  }), {
    getState: {
      value: function value() {
        return state._state;
      }
    }
  });

  state.route = window.location.pathname;
  state.title = document.title;

  (0, _delegate2.default)(document, 'a', 'click', function (e) {
    var a = e.delegateTarget;
    var href = a.getAttribute('href') || '/';
    var route = (0, _util.sanitize)(href);

    if (!_util.link.isSameOrigin(href) || a.getAttribute('rel') === 'external' || a.classList.contains('no-ajax') || matches(e, route) || _util.link.isHash(href)) {
      return;
    }

    e.preventDefault();

    if (_util.link.isSameURL(href)) {
      return;
    }

    go(_util.origin + '/' + route);
  });

  window.onpopstate = function (e) {
    var to = e.target.location.href;

    if (matches(e, to)) {
      if (_util.link.isHash(to)) {
        return;
      }
      window.location.reload();
      return;
    }

    /**
     * Popstate bypasses router, so we 
     * need to tell it where we went to
     * without pushing state
     */
    go(to, null, true);
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';

    if (history.state && history.state.scrollTop !== undefined) {
      window.scrollTo(0, history.state.scrollTop);
    }

    window.onbeforeunload = _util.saveScrollPosition;
  }

  /**
   * @param {string} route
   * @param {function} cb 
   * @param {boolean} resolve Use navigo.resolve(), bypass navigo.navigate()
   *
   * Popstate changes the URL for us, so if we were to 
   * router.navigate() to the previous location, it would push
   * a duplicate route to history and we would create a loop.
   *
   * router.resolve() let's Navigo know we've moved, without
   * altering history.
   */
  function go(route) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var resolve = arguments[2];

    var to = (0, _util.sanitize)(route);

    resolve ? null : (0, _util.saveScrollPosition)();

    events.emit('before:route', { route: to });

    if (state.paused) {
      return;
    }

    var req = get(_util.origin + '/' + to, function (title) {
      resolve ? router.resolve(to) : router.navigate(to);

      // Update state
      pushRoute(to, title);

      events.emit('after:route', { route: to, title: title });

      cb ? cb(to, title) : null;
    });
  }

  function push() {
    var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.route;
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    router.navigate(loc);
    state.route = loc;
    title ? state.title = title : null;
  }

  function get(route, cb) {
    return _nanoajax2.default.ajax({
      method: 'GET',
      url: route
    }, function (status, res, req) {
      if (req.status < 200 || req.status > 300 && req.status !== 304) {
        return window.location = _util.origin + '/' + state._state.prev.route;
      }
      render(req.response, cb);
    });
  }

  function pushRoute(loc) {
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    state.route = loc;
    title ? state.title = title : null;
  }

  function matches(event, route) {
    return ignore.filter(function (t) {
      if (Array.isArray(t)) {
        var res = t[1](route);
        if (res) {
          events.emit(t[0], { route: route, event: event });
        }
        return res;
      } else {
        return t(route);
      }
    }).length > 0 ? true : false;
  }

  return instance;
};

},{"./lib/dom.js":12,"./lib/util.js":13,"delegate":4,"loop.js":8,"nanoajax":9,"navigo":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tarry = require('tarry.js');

var _util = require('./util');

/**
 * Init new native parser
 */
var parser = new DOMParser();

/**
 * Get the target of the ajax req
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
var parseResponse = function parseResponse(html) {
  return parser.parseFromString(html, "text/html");
};

/**
 * Finds all <script> tags in the new
 * markup and evaluates their contents
 *
 * @param {object} root DOM node containing new markup via AJAX
 * @param {...object} sources Other DOM nodes to scrape script tags from 
 */
var evalScripts = function evalScripts(source) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var errors = [];
  var scripts = Array.prototype.slice.call(source.getElementsByTagName('script'));
  var existing = root ? Array.prototype.slice.call(root.getElementsByTagName('script')) : [];

  var dupe = function dupe(s) {
    return existing.filter(function (e) {
      return s.innerHTML === e.innerHTML && s.src === e.src;
    }).length > 0 ? true : false;
  };

  scripts.length > 0 && scripts.forEach(function (t) {
    var s = t.cloneNode(true);

    if (dupe(s)) return;

    s.setAttribute('data-ajaxed', 'true');

    try {
      eval(s.innerHTML);
    } catch (e) {
      errors.push(e);
    }

    try {
      root ? root.insertBefore(s, root.children[0]) : source.replaceChild(s, t);
    } catch (e) {
      errors.push(e);
      document.head.insertBefore(s, document.head.children[0]);
    }
  });

  if (errors.length > 0) {
    console.groupCollapsed('operator.js');
    errors.forEach(function (e) {
      return console.log(e);
    });
    console.groupEnd();
  }
};

/**
 * Get width/height of element or window
 *
 * @param {object} el Element or window
 * @param {string} type 'Height' or 'Width
 */
var returnSize = function returnSize(el, type) {
  var isWindow = el !== null && el.window ? true : false;

  if (isWindow) {
    return Math.max(el['outer' + type], document.documentElement['client' + type]);
  }

  return Math.max(el['offset' + type], el['client' + type]);
};

/**
 * Helper to smoothly swap old 
 * markup with new markup
 * 
 * @param {object} markup New node to append to DOM
 */

exports.default = function (root, duration, events) {
  return function (markup, cb) {
    var dom = parseResponse(markup);
    var title = dom.head.getElementsByTagName('title')[0].innerHTML;
    var main = document.querySelector(root);

    var start = (0, _tarry.tarry)(function () {
      events.emit('before:transition');
      document.documentElement.classList.add('is-transitioning');
      main.style.height = returnSize(main, 'Height') + 'px';
    }, duration);

    var render = (0, _tarry.tarry)(function () {
      main.innerHTML = dom.querySelector(root).innerHTML;
      cb(title, main);
      evalScripts(main);
      evalScripts(dom.head, document.head);
      (0, _util.restoreScrollPos)();
    }, duration);

    var removeTransitionStyles = (0, _tarry.tarry)(function () {
      document.documentElement.classList.remove('is-transitioning');
      main.style.height = '';
    }, duration);

    var signalEnd = (0, _tarry.tarry)(function () {
      return events.emit('after:transition');
    }, duration);

    (0, _tarry.queue)(start, render, removeTransitionStyles, signalEnd)();
  };
};

},{"./util":13,"tarry.js":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getOrigin = function getOrigin(url) {
  return url.origin || url.protocol + '//' + url.host;
};

var origin = exports.origin = getOrigin(window.location);

var originRegEx = exports.originRegEx = new RegExp(origin);

/**
 * Replace site origin, if present,
 * remove leading slash, if present.
 *
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin and sans leading comma
 */
var sanitize = exports.sanitize = function sanitize(url) {
  var route = url.replace(originRegEx, '');
  var clean = route.match(/^\//) ? route.replace(/\/{1}/, '') : route; // remove /
  return clean === '' ? '/' : clean;
};

var parseURL = exports.parseURL = function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a;
};

var link = exports.link = {
  isSameOrigin: function isSameOrigin(href) {
    return origin === getOrigin(parseURL(href));
  },
  isHash: function isHash(href) {
    return (/#/.test(href)
    );
  },
  isSameURL: function isSameURL(href) {
    return window.location.pathname === parseURL(href).pathname;
  }
};

var getScrollPosition = exports.getScrollPosition = function getScrollPosition() {
  return window.pageYOffset || window.scrollY;
};

var saveScrollPosition = exports.saveScrollPosition = function saveScrollPosition() {
  return window.history.replaceState({ scrollTop: getScrollPosition() }, '');
};

var restoreScrollPos = exports.restoreScrollPos = function restoreScrollPos() {
  var scrollTop = history.state ? history.state.scrollTop : undefined;
  if (history.state && scrollTop !== undefined) {
    window.scrollTo(0, scrollTop);
    return scrollTop;
  } else {
    window.scrollTo(0, 0);
  }
};

var activeLinks = [];
var setActiveLinks = exports.setActiveLinks = function setActiveLinks(route) {
  activeLinks.forEach(function (a) {
    return a.classList.remove('is-active');
  });
  activeLinks.splice(0, activeLinks.length);
  activeLinks.push.apply(activeLinks, _toConsumableArray(Array.prototype.slice.call(document.querySelectorAll('[href$="' + route + '"]'))));
  activeLinks.forEach(function (a) {
    return a.classList.add('is-active');
  });
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createBar = function createBar(root, classname) {
  var o = document.createElement('div');
  var i = document.createElement('div');

  o.className = classname;
  i.className = classname + '__inner';
  o.appendChild(i);
  root.insertBefore(o, root.children[0]);

  return {
    outer: o,
    inner: i
  };
};

exports.default = function () {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var timer = null;
  var speed = opts.speed || 200;
  var classname = opts.classname || 'putz';
  var trickle = opts.trickle || 5;
  var state = {
    active: false,
    progress: 0
  };

  var bar = createBar(root, classname);

  var render = function render() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    state.progress = val;
    bar.inner.style.cssText = '\n      transform: translateY(' + (state.active ? '0' : '-100%') + ') translateX(' + (-100 + state.progress) + '%);';
  };

  var go = function go(val) {
    if (!state.active) {
      return;
    }
    render(Math.min(val, 95));
  };

  var inc = function inc() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random() * trickle;
    return go(state.progress + val);
  };

  var end = function end() {
    state.active = false;
    render(100);
    setTimeout(function () {
      return render();
    }, speed);
    if (timer) {
      clearTimeout(timer);
    }
  };

  var start = function start() {
    state.active = true;
    inc();
  };

  var putz = function putz() {
    var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

    if (!state.active) {
      return;
    }
    timer = setInterval(function () {
      return inc();
    }, interval);
  };

  return Object.create({
    putz: putz,
    start: start,
    inc: inc,
    go: go,
    end: end,
    getState: function getState() {
      return state;
    }
  }, {
    bar: {
      value: bar
    }
  });
};

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var run = function run(cb, args) {
  cb();
  args.length > 0 && args.shift().apply(undefined, _toConsumableArray(args));
};

var tarry = exports.tarry = function tarry(cb) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var override = 'number' === typeof args[0] ? args[0] : null;
    return 'number' === typeof override && override > -1 ? tarry(cb, override) : 'number' === typeof delay && delay > -1 ? setTimeout(function () {
      return run(cb, args);
    }, delay) : run(cb, args);
  };
};

var queue = exports.queue = function queue() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function () {
    return args.shift().apply(undefined, args);
  };
};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var findLink = function findLink(id, data) {
  return data.filter(function (l) {
    return l.id === id;
  })[0];
};

var createLink = function createLink(_ref, data) {
  var answers = _ref.answers;
  return answers.forEach(function (a) {
    var isPath = /^\//.test(a.next) ? true : false;
    var isGIF = /gif/.test(a.next) ? true : false;
    a.next = isPath || isGIF ? a.next : findLink(a.next, data);
  });
};

var createStore = exports.createStore = function createStore(questions) {
  questions.map(function (q) {
    return createLink(q, questions);
  });
  return questions;
};

exports.default = function (questions) {
  return {
    store: createStore(questions),
    getActive: function getActive() {
      return this.store.filter(function (q) {
        return q.id == window.location.hash.split(/#/)[1];
      })[0] || this.store[0];
    }
  };
};

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  id: 1,
  prompt: 'hi! what brings you to this neck of the interwebs?',
  answers: [{
    value: 'who r u',
    next: 2
  }, {
    value: 'hiring',
    next: 3
  }, {
    value: 'it\'s your mom',
    next: 4
  }, {
    value: 'funny jokes',
    next: 5
  }]
}, {
  id: 2,
  prompt: 'i\'m melanie \u2013 a graphic designer working in experiential marketing & proud iowan trying to eat ALL the BLTs',
  answers: [{
    value: 'what\'s experiential?',
    next: 6
  }, {
    value: 'what\'s a BLT?',
    next: 7
  }]
}, {
  id: 3,
  prompt: 'rad! can i show you some projects i\'ve worked on?',
  answers: [{
    value: 'yes, please!',
    next: '/work'
  }, {
    value: 'nah, tell me about you',
    next: '/about'
  }, {
    value: 'i\'ll email you instead',
    next: '/contact'
  }]
}, {
  id: 4,
  prompt: 'hi mom! i love you!',
  answers: [{
    value: ':) i love you too!',
    next: 8
  }, {
    value: 'jk, not your mom',
    next: 9
  }]
}, {
  id: 5,
  prompt: 'what\'s funnier than a rhetorical question?',
  answers: [{
    value: 'yes',
    next: 10
  }, {
    value: 'no',
    next: 'https://media.giphy.com/media/P2Hy88rAjQdsQ/giphy.gif'
  }]
}, {
  id: 6,
  prompt: 'experiential is this cool niche type of marketing, ya know?',
  answers: [{
    value: 'sounds cool. what have you done?',
    next: '/work'
  }, {
    value: 'why do you like it?',
    next: 11
  }]
}, {
  id: 7,
  prompt: 'take a wild guess...',
  answers: [{
    value: 'beef liver toast',
    next: 'https://media.giphy.com/media/oFOs10SJSnzos/giphy.gif'
  }, {
    value: 'blueberry lemon tart',
    next: 'https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif'
  }, {
    value: 'bacon lettuce tomato',
    next: 'https://media.giphy.com/media/fqzxcmlY7opOg/giphy.gif'
  }]
}, {
  id: 8,
  prompt: 'so... can i ship laundry home to iowa?',
  answers: [{
    value: 'of course!',
    next: 'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif'
  }, {
    value: 'yeah, still not your mom...',
    next: 12
  }]
}, {
  id: 9,
  prompt: 'clicking for fun, huh? good luck with this one.',
  answers: [{
    value: 'blue pill',
    next: 'https://media.giphy.com/media/G7GNoaUSH7sMU/giphy.gif'
  }, {
    value: 'red pill',
    next: 'https://media.giphy.com/media/UjujGY3mA3Jle/giphy.gif'
  }]
}, {
  id: 10,
  prompt: 'pancakes or waffles?',
  answers: [{
    value: 'french toast',
    next: 'https://media.giphy.com/media/14nb6TlIRlaN1u/giphy.gif'
  }]
}, {
  id: 11,
  prompt: 'i like experiential because it\'s just super cool, okay?',
  answers: [{
    value: 'what are your favorite projects?',
    next: 14
  }, {
    value: 'i have questions! can i email you?',
    next: '/contact'
  }]
}, {
  id: 12,
  prompt: 'taking this a little far don\'t you think?',
  answers: [{
    value: 'sure am',
    next: 'https://media.giphy.com/media/qINsfDGI0z9yU/giphy.gif'
  }, {
    value: 'must click ALL buttons',
    next: 13
  }]
}, {
  id: 13,
  prompt: 'yeah?',
  answers: [{
    value: 'clicking this may harm a kitten',
    next: 'https://media.giphy.com/media/IgghkXWkdnEEo/giphy.gif'
  }]
}, {
  id: 14,
  prompt: 'of course I love my own work, but these projects deserve some serious props',
  answers: [{
    value: 'project 1',
    next: 'https://twitter.com'
  }, {
    value: 'project 2',
    next: 'https://twitter.com'
  }, {
    value: 'project 3',
    next: 'https://twitter.com'
  }]
}];

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = exports.title = exports.button = exports.div = undefined;

var _h = require('h0');

var _h2 = _interopRequireDefault(_h);

var _colors = require('../lib/colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var div = exports.div = (0, _h2.default)('div');
var button = exports.button = (0, _h2.default)('button')({ class: 'h2 mv0 inline-block' });
var title = exports.title = (0, _h2.default)('p')({ class: 'h1 mt0 mb05 cb' });

var template = exports.template = function template(_ref, cb) {
  var prompt = _ref.prompt;
  var answers = _ref.answers;

  return div({ class: 'question' })(title(prompt), div.apply(undefined, _toConsumableArray(answers.map(function (a, i) {
    return button({
      onclick: function onclick(e) {
        return cb(a.next);
      },
      style: {
        color: _colors2.default.colors[i]
      }
    })(a.value);
  }))));
};

},{"../lib/colors":22,"h0":5}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tarry = require('tarry.js');

exports.default = function () {
  var modal = document.getElementById('gif');
  var img = modal.getElementsByTagName('img')[0];

  var show = (0, _tarry.tarry)(function () {
    return modal.style.display = 'block';
  });
  var hide = (0, _tarry.tarry)(function () {
    return modal.style.display = 'none';
  });
  var toggle = (0, _tarry.tarry)(function () {
    return modal.classList.contains('is-active') ? modal.classList.remove('is-active') : modal.classList.add('is-active');
  });

  var lazy = function lazy(url, cb) {
    var burner = document.createElement('img');

    burner.onload = function () {
      return cb(url);
    };

    burner.src = url;
  };

  var open = function open(url) {
    window.loader.start();
    window.loader.putz(500);

    lazy(url, function (url) {
      img.src = url;
      (0, _tarry.queue)(show, toggle(200))();
      window.loader.end();
    });
  };

  var close = function close() {
    (0, _tarry.queue)(toggle, hide(200))();
  };

  modal.onclick = close;

  return {
    open: open,
    close: close
  };
};

},{"tarry.js":15}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = require('../lib/router');

var _router2 = _interopRequireDefault(_router);

var _index = require('./data/index.js');

var _index2 = _interopRequireDefault(_index);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _giffer = require('./giffer');

var _giffer2 = _interopRequireDefault(_giffer);

var _elements = require('./elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prev = void 0;
var data = (0, _data2.default)(_index2.default);

/**
 * Render template and append to DOM
 */
var render = function render(next) {
  var questionRoot = document.getElementById('questionRoot');

  var el = (0, _elements.template)(next, update);
  questionRoot && questionRoot.appendChild(el);
  return el;
};

/**
 * Handle DOM updates, other link clicks
 */
var update = function update(next) {
  var questionRoot = document.getElementById('questionRoot');

  var isGIF = /giphy/.test(next);
  if (isGIF) return (0, _giffer2.default)().open(next);

  var isPath = /^\//.test(next);
  if (isPath) return _router2.default.go(next);

  if (prev && questionRoot && questionRoot.contains(prev)) questionRoot.removeChild(prev);

  prev = render(next);

  window.location.hash = next.id;
};

/**
 * Wait until new DOM is present before
 * trying to render to it
 */
_router2.default.on('after:route', function (_ref) {
  var route = _ref.route;

  if (/(^\/|\/#[0-9]|#[0-9])/.test(route)) {
    update(data.getActive());
  }
});

exports.default = function () {
  prev = render(data.getActive());
};

},{"../lib/router":23,"./data":16,"./data/index.js":17,"./elements":18,"./giffer":19}],21:[function(require,module,exports){
'use strict';

var _putz = require('putz');

var _putz2 = _interopRequireDefault(_putz);

var _router = require('./lib/router');

var _router2 = _interopRequireDefault(_router);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _colors = require('./lib/colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loader = window.loader = (0, _putz2.default)(document.body, {
  speed: 100,
  trickle: 10
});

window.addEventListener('DOMContentLoaded', function () {
  (0, _app2.default)();

  _router2.default.on('after:route', function (_ref) {
    var route = _ref.route;

    _colors2.default.update();
  });

  _colors2.default.update();
});

},{"./app":20,"./lib/colors":22,"./lib/router":23,"putz":14}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var rootStyle = document.createElement('style');
document.head.appendChild(rootStyle);

var colors = ['#35D3E8', '#FF4E42', '#FFEA51'];

var randomColor = function randomColor() {
  return colors[Math.round(Math.random() * (2 - 0) + 0)];
};

var saveColor = function saveColor(c) {
  return localStorage.setItem('mjs', JSON.stringify({
    color: c
  }));
};

var readColor = function readColor() {
  return localStorage.getItem('mjs') ? JSON.parse(localStorage.getItem('mjs')).color : null;
};

var getColor = function getColor() {
  var c = randomColor();
  var prev = readColor();

  while (c === prev) {
    c = randomColor();
  }

  saveColor(c);
  return c;
};

var update = function update() {
  var color = getColor();

  rootStyle.innerHTML = '\n    body { color: ' + color + ' }\n    ::-moz-selection {\n      background-color: ' + color + ';\n    }\n    ::selection {\n      background-color: ' + color + ';\n    }\n  ';
};

exports.default = {
  update: update,
  colors: colors
};

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _layzr = require('layzr.js');

var _layzr2 = _interopRequireDefault(_layzr);

var _operator = require('operator.js');

var _operator2 = _interopRequireDefault(_operator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import operator from '../../../../../../../operator'

/**
 * Send page views to 
 * Google Analytics
 */
var gaTrackPageView = function gaTrackPageView(path, title) {
  var ga = window.ga ? window.ga : false;

  if (!ga) return;

  ga('set', { page: path, title: title });
  ga('send', 'pageview');
};

var images = (0, _layzr2.default)({});
images.update().check();
window.images = images;

var app = (0, _operator2.default)({
  root: '#root'
});

app.on('after:route', function (_ref) {
  var route = _ref.route;
  var title = _ref.title;

  gaTrackPageView(route, title);
  images.update().check();
});

app.on('after:transition', function () {
  return loader && loader.end();
});

window.app = app;

exports.default = app;

},{"layzr.js":7,"operator.js":11}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWNsb3Nlc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LW1hdGNoZXMtc2VsZWN0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LXF1ZXJ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RlbGVnYXRlL3NyYy9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9oMC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL2xheXpyLmpzL2Rpc3QvbGF5enIubWluLmpzIiwibm9kZV9tb2R1bGVzL2xvb3AuanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbmFub2FqYXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCJub2RlX21vZHVsZXMvb3BlcmF0b3IuanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb3BlcmF0b3IuanMvbGliL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy9vcGVyYXRvci5qcy9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9wdXR6L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RhcnJ5LmpzL2luZGV4LmpzIiwic3JjL2pzL2FwcC9kYXRhLmpzIiwic3JjL2pzL2FwcC9kYXRhL2luZGV4LmpzIiwic3JjL2pzL2FwcC9lbGVtZW50cy5qcyIsInNyYy9qcy9hcHAvZ2lmZmVyLmpzIiwic3JjL2pzL2FwcC9pbmRleC5qcyIsInNyYy9qcy9pbmRleC5qcyIsInNyYy9qcy9saWIvY29sb3JzLmpzIiwic3JjL2pzL2xpYi9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7a0JDTGUsWUFBWTtBQUFBLE1BQVgsQ0FBVyx1RUFBUCxFQUFPOztBQUN6QixNQUFNLFlBQVksRUFBbEI7O0FBRUEsTUFBTSxLQUFLLFNBQUwsRUFBSyxDQUFDLENBQUQsRUFBa0I7QUFBQSxRQUFkLEVBQWMsdUVBQVQsSUFBUzs7QUFDM0IsUUFBSSxDQUFDLEVBQUwsRUFBUztBQUNULGNBQVUsQ0FBVixJQUFlLFVBQVUsQ0FBVixLQUFnQixFQUFFLE9BQU8sRUFBVCxFQUEvQjtBQUNBLGNBQVUsQ0FBVixFQUFhLEtBQWIsQ0FBbUIsSUFBbkIsQ0FBd0IsRUFBeEI7QUFDRCxHQUpEOztBQU1BLE1BQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxDQUFELEVBQW9CO0FBQUEsUUFBaEIsSUFBZ0IsdUVBQVQsSUFBUzs7QUFDL0IsUUFBSSxRQUFRLFVBQVUsQ0FBVixJQUFlLFVBQVUsQ0FBVixFQUFhLEtBQTVCLEdBQW9DLEtBQWhEO0FBQ0EsYUFBUyxNQUFNLE9BQU4sQ0FBYztBQUFBLGFBQUssRUFBRSxJQUFGLENBQUw7QUFBQSxLQUFkLENBQVQ7QUFDRCxHQUhEOztBQUtBLHNCQUNLLENBREw7QUFFRSxjQUZGO0FBR0U7QUFIRjtBQUtELEM7Ozs7QUNuQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN1ZBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQVNBLElBQU0sU0FBUyxrQ0FBZjs7QUFFQSxJQUFNLFFBQVE7QUFDWixVQUFRO0FBQ04sV0FBTyxFQUREO0FBRU4sV0FBTyxFQUZEO0FBR04sVUFBTTtBQUNKLGFBQU8sR0FESDtBQUVKLGFBQU87QUFGSDtBQUhBLEdBREk7QUFTWixNQUFJLEtBQUosR0FBVztB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T0FBTyxHQUFQLEVBQWhCO0FBQUEsQ0FBM0I7O0FBRUEsT0FBTyxHQUFQLEdBQWEsR0FBYjs7a0JBRWUsRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXNcbiAqL1xuXG50cnkge1xuICB2YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKVxufSBjYXRjaCAoZXJyKSB7XG4gIHZhciBtYXRjaGVzID0gcmVxdWlyZSgnY29tcG9uZW50LW1hdGNoZXMtc2VsZWN0b3InKVxufVxuXG4vKipcbiAqIEV4cG9ydCBgY2xvc2VzdGBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb3Nlc3RcblxuLyoqXG4gKiBDbG9zZXN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHNjb3BlIChvcHRpb25hbClcbiAqL1xuXG5mdW5jdGlvbiBjbG9zZXN0IChlbCwgc2VsZWN0b3IsIHNjb3BlKSB7XG4gIHNjb3BlID0gc2NvcGUgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gIC8vIHdhbGsgdXAgdGhlIGRvbVxuICB3aGlsZSAoZWwgJiYgZWwgIT09IHNjb3BlKSB7XG4gICAgaWYgKG1hdGNoZXMoZWwsIHNlbGVjdG9yKSkgcmV0dXJuIGVsO1xuICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgfVxuXG4gIC8vIGNoZWNrIHNjb3BlIGZvciBtYXRjaFxuICByZXR1cm4gbWF0Y2hlcyhlbCwgc2VsZWN0b3IpID8gZWwgOiBudWxsO1xufVxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnRyeSB7XG4gIHZhciBxdWVyeSA9IHJlcXVpcmUoJ3F1ZXJ5Jyk7XG59IGNhdGNoIChlcnIpIHtcbiAgdmFyIHF1ZXJ5ID0gcmVxdWlyZSgnY29tcG9uZW50LXF1ZXJ5Jyk7XG59XG5cbi8qKlxuICogRWxlbWVudCBwcm90b3R5cGUuXG4gKi9cblxudmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XG5cbi8qKlxuICogVmVuZG9yIGZ1bmN0aW9uLlxuICovXG5cbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxuLyoqXG4gKiBFeHBvc2UgYG1hdGNoKClgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XG5cbi8qKlxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gIGlmICghZWwgfHwgZWwubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IHF1ZXJ5LmFsbChzZWxlY3RvciwgZWwucGFyZW50Tm9kZSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImZ1bmN0aW9uIG9uZShzZWxlY3RvciwgZWwpIHtcbiAgcmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWxlY3RvciwgZWwpe1xuICBlbCA9IGVsIHx8IGRvY3VtZW50O1xuICByZXR1cm4gb25lKHNlbGVjdG9yLCBlbCk7XG59O1xuXG5leHBvcnRzLmFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBlbCl7XG4gIGVsID0gZWwgfHwgZG9jdW1lbnQ7XG4gIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbn07XG5cbmV4cG9ydHMuZW5naW5lID0gZnVuY3Rpb24ob2JqKXtcbiAgaWYgKCFvYmoub25lKSB0aHJvdyBuZXcgRXJyb3IoJy5vbmUgY2FsbGJhY2sgcmVxdWlyZWQnKTtcbiAgaWYgKCFvYmouYWxsKSB0aHJvdyBuZXcgRXJyb3IoJy5hbGwgY2FsbGJhY2sgcmVxdWlyZWQnKTtcbiAgb25lID0gb2JqLm9uZTtcbiAgZXhwb3J0cy5hbGwgPSBvYmouYWxsO1xuICByZXR1cm4gZXhwb3J0cztcbn07XG4iLCJ2YXIgY2xvc2VzdCA9IHJlcXVpcmUoJ2NvbXBvbmVudC1jbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBsaXN0ZW5lckZuID0gbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEZpbmRzIGNsb3Nlc3QgbWF0Y2ggYW5kIGludm9rZXMgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGxpc3RlbmVyKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGUuZGVsZWdhdGVUYXJnZXQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZWxlbWVudCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3RyYW5zZm9ybVByb3BzID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0tcHJvcHMnKTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFuc2Zvcm1Qcm9wcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBoID0gZnVuY3Rpb24gaCh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID8gYXBwbHlQcm9wcyh0YWcpKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgOiBhcHBlbmRDaGlsZHJlbih0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5cbnZhciBpc09iaiA9IGZ1bmN0aW9uIGlzT2JqKG8pIHtcbiAgcmV0dXJuIG8gIT09IG51bGwgJiYgKHR5cGVvZiBvID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvKSkgPT09ICdvYmplY3QnO1xufTtcblxudmFyIGlzUHJvcHMgPSBmdW5jdGlvbiBpc1Byb3BzKGFyZykge1xuICByZXR1cm4gaXNPYmooYXJnKSAmJiAhKGFyZyBpbnN0YW5jZW9mIEVsZW1lbnQpO1xufTtcblxudmFyIGFwcGx5UHJvcHMgPSBmdW5jdGlvbiBhcHBseVByb3BzKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIGgodGFnKShPYmplY3QuYXNzaWduKHt9LCBwcm9wcywgYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbCA9IGgodGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICB2YXIgcCA9ICgwLCBfdHJhbnNmb3JtUHJvcHMyLmRlZmF1bHQpKHByb3BzKTtcbiAgICAgIE9iamVjdC5rZXlzKHApLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKC9eb24vLnRlc3QoaykpIHtcbiAgICAgICAgICBlbFtrXSA9IHBba107XG4gICAgICAgIH0gZWxzZSBpZiAoayA9PT0gJ19faHRtbCcpIHtcbiAgICAgICAgICBlbC5pbm5lckhUTUwgPSBwW2tdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrLCBwW2tdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgfTtcbn07XG5cbnZhciBhcHBlbmRDaGlsZHJlbiA9IGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjaGlsZHJlbiA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgY2hpbGRyZW5bX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgaW5zdGFuY2VvZiBFbGVtZW50ID8gYyA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGMpO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBlbC5hcHBlbmRDaGlsZChjKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWw7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBoOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBrZWJhYiA9IGV4cG9ydHMua2ViYWIgPSBmdW5jdGlvbiBrZWJhYihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgcmV0dXJuICctJyArIGcudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59O1xuXG52YXIgcGFyc2VWYWx1ZSA9IGV4cG9ydHMucGFyc2VWYWx1ZSA9IGZ1bmN0aW9uIHBhcnNlVmFsdWUocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IGFkZFB4KHByb3ApKHZhbCkgOiB2YWw7XG4gIH07XG59O1xuXG52YXIgdW5pdGxlc3NQcm9wZXJ0aWVzID0gZXhwb3J0cy51bml0bGVzc1Byb3BlcnRpZXMgPSBbJ2xpbmVIZWlnaHQnLCAnZm9udFdlaWdodCcsICdvcGFjaXR5JywgJ3pJbmRleCdcbi8vIFByb2JhYmx5IG5lZWQgYSBmZXcgbW9yZS4uLlxuXTtcblxudmFyIGFkZFB4ID0gZXhwb3J0cy5hZGRQeCA9IGZ1bmN0aW9uIGFkZFB4KHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdW5pdGxlc3NQcm9wZXJ0aWVzLmluY2x1ZGVzKHByb3ApID8gdmFsIDogdmFsICsgJ3B4JztcbiAgfTtcbn07XG5cbnZhciBmaWx0ZXJOdWxsID0gZXhwb3J0cy5maWx0ZXJOdWxsID0gZnVuY3Rpb24gZmlsdGVyTnVsbChvYmopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV0gIT09IG51bGw7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlRGVjID0gZXhwb3J0cy5jcmVhdGVEZWMgPSBmdW5jdGlvbiBjcmVhdGVEZWMoc3R5bGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2ViYWIoa2V5KSArICc6JyArIHBhcnNlVmFsdWUoa2V5KShzdHlsZVtrZXldKTtcbiAgfTtcbn07XG5cbnZhciBzdHlsZVRvU3RyaW5nID0gZXhwb3J0cy5zdHlsZVRvU3RyaW5nID0gZnVuY3Rpb24gc3R5bGVUb1N0cmluZyhzdHlsZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGUpLmZpbHRlcihmaWx0ZXJOdWxsKHN0eWxlKSkubWFwKGNyZWF0ZURlYyhzdHlsZSkpLmpvaW4oJzsnKTtcbn07XG5cbnZhciBpc1N0eWxlT2JqZWN0ID0gZXhwb3J0cy5pc1N0eWxlT2JqZWN0ID0gZnVuY3Rpb24gaXNTdHlsZU9iamVjdChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPT09ICdzdHlsZScgJiYgcHJvcHNba2V5XSAhPT0gbnVsbCAmJiBfdHlwZW9mKHByb3BzW2tleV0pID09PSAnb2JqZWN0JztcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVTdHlsZSA9IGV4cG9ydHMuY3JlYXRlU3R5bGUgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZShwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBpc1N0eWxlT2JqZWN0KHByb3BzKShrZXkpID8gc3R5bGVUb1N0cmluZyhwcm9wc1trZXldKSA6IHByb3BzW2tleV07XG4gIH07XG59O1xuXG52YXIgcmVkdWNlUHJvcHMgPSBleHBvcnRzLnJlZHVjZVByb3BzID0gZnVuY3Rpb24gcmVkdWNlUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhLCBrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhLCBfZGVmaW5lUHJvcGVydHkoe30sIGtleSwgY3JlYXRlU3R5bGUocHJvcHMpKGtleSkpKTtcbiAgfTtcbn07XG5cbnZhciB0cmFuc2Zvcm1Qcm9wcyA9IGV4cG9ydHMudHJhbnNmb3JtUHJvcHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShyZWR1Y2VQcm9wcyhwcm9wcyksIHt9KTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zZm9ybVByb3BzOyIsIi8qIVxuICogTGF5enIuanMgMi4yLjEgLSBBIHNtYWxsLCBmYXN0LCBhbmQgbW9kZXJuIGxpYnJhcnkgZm9yIGxhenkgbG9hZGluZyBpbWFnZXMuXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgTWljaGFlbCBDYXZhbGVhIC0gaHR0cDovL2NhbGxtZWNhdnMuZ2l0aHViLmlvL2xheXpyLmpzL1xuICogTGljZW5zZTogTUlUXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGUpOnQuTGF5enI9ZSgpfSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9e307dFtcImV4dGVuZHNcIl09T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24odCl7Zm9yKHZhciBlPTE7ZTxhcmd1bWVudHMubGVuZ3RoO2UrKyl7dmFyIG49YXJndW1lbnRzW2VdO2Zvcih2YXIgciBpbiBuKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuLHIpJiYodFtyXT1uW3JdKX1yZXR1cm4gdH07dmFyIGU9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsZSl7cmV0dXJuIGNbdF09Y1t0XXx8W10sY1t0XS5wdXNoKGUpLHRoaXN9ZnVuY3Rpb24gbih0LG4pe3JldHVybiBuLl9vbmNlPSEwLGUodCxuKSx0aGlzfWZ1bmN0aW9uIHIodCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPyExOmFyZ3VtZW50c1sxXTtyZXR1cm4gZT9jW3RdLnNwbGljZShjW3RdLmluZGV4T2YoZSksMSk6ZGVsZXRlIGNbdF0sdGhpc31mdW5jdGlvbiBpKHQpe2Zvcih2YXIgZT10aGlzLG49YXJndW1lbnRzLmxlbmd0aCxpPUFycmF5KG4+MT9uLTE6MCksbz0xO24+bztvKyspaVtvLTFdPWFyZ3VtZW50c1tvXTt2YXIgcz1jW3RdJiZjW3RdLnNsaWNlKCk7cmV0dXJuIHMmJnMuZm9yRWFjaChmdW5jdGlvbihuKXtuLl9vbmNlJiZyKHQsbiksbi5hcHBseShlLGkpfSksdGhpc312YXIgbz1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/e306YXJndW1lbnRzWzBdLGM9e307cmV0dXJuIHRbXCJleHRlbmRzXCJdKHt9LG8se29uOmUsb25jZTpuLG9mZjpyLGVtaXQ6aX0pfSxuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3JldHVybiB3aW5kb3cuc2Nyb2xsWXx8d2luZG93LnBhZ2VZT2Zmc2V0fWZ1bmN0aW9uIG4oKXtkPXQoKSxyKCl9ZnVuY3Rpb24gcigpe2x8fChyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtyZXR1cm4gdSgpfSksbD0hMCl9ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ArZH1mdW5jdGlvbiBvKHQpe3ZhciBlPWQsbj1lK3Yscj1pKHQpLG89cit0Lm9mZnNldEhlaWdodCxjPW0udGhyZXNob2xkLzEwMCp2O3JldHVybiBvPj1lLWMmJm4rYz49cn1mdW5jdGlvbiBjKHQpe2lmKHcuZW1pdChcInNyYzpiZWZvcmVcIix0KSxwJiZ0Lmhhc0F0dHJpYnV0ZShtLnNyY3NldCkpdC5zZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIix0LmdldEF0dHJpYnV0ZShtLnNyY3NldCkpO2Vsc2V7dmFyIGU9Zz4xJiZ0LmdldEF0dHJpYnV0ZShtLnJldGluYSk7dC5zZXRBdHRyaWJ1dGUoXCJzcmNcIixlfHx0LmdldEF0dHJpYnV0ZShtLm5vcm1hbCkpfXcuZW1pdChcInNyYzphZnRlclwiLHQpLFttLm5vcm1hbCxtLnJldGluYSxtLnNyY3NldF0uZm9yRWFjaChmdW5jdGlvbihlKXtyZXR1cm4gdC5yZW1vdmVBdHRyaWJ1dGUoZSl9KSxhKCl9ZnVuY3Rpb24gcyh0KXt2YXIgZT10P1wiYWRkRXZlbnRMaXN0ZW5lclwiOlwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiO3JldHVybltcInNjcm9sbFwiLFwicmVzaXplXCJdLmZvckVhY2goZnVuY3Rpb24odCl7cmV0dXJuIHdpbmRvd1tlXSh0LG4pfSksdGhpc31mdW5jdGlvbiB1KCl7cmV0dXJuIHY9d2luZG93LmlubmVySGVpZ2h0LGguZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gbyh0KSYmYyh0KX0pLGw9ITEsdGhpc31mdW5jdGlvbiBhKCl7cmV0dXJuIGg9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltcIittLm5vcm1hbCtcIl1cIikpLHRoaXN9dmFyIGY9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdP3t9OmFyZ3VtZW50c1swXSxkPXQoKSxsPXZvaWQgMCxoPXZvaWQgMCx2PXZvaWQgMCxtPXtub3JtYWw6Zi5ub3JtYWx8fFwiZGF0YS1ub3JtYWxcIixyZXRpbmE6Zi5yZXRpbmF8fFwiZGF0YS1yZXRpbmFcIixzcmNzZXQ6Zi5zcmNzZXR8fFwiZGF0YS1zcmNzZXRcIix0aHJlc2hvbGQ6Zi50aHJlc2hvbGR8fDB9LHA9ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJzcmNzZXRcIil8fFwic3Jjc2V0XCJpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpLGc9d2luZG93LmRldmljZVBpeGVsUmF0aW98fHdpbmRvdy5zY3JlZW4uZGV2aWNlWERQSS93aW5kb3cuc2NyZWVuLmxvZ2ljYWxYRFBJLHc9ZSh7aGFuZGxlcnM6cyxjaGVjazp1LHVwZGF0ZTphfSk7cmV0dXJuIHd9O3JldHVybiBufSk7IiwiZXhwb3J0IGRlZmF1bHQgKG8gPSB7fSkgPT4ge1xuICBjb25zdCBsaXN0ZW5lcnMgPSB7fVxuXG4gIGNvbnN0IG9uID0gKGUsIGNiID0gbnVsbCkgPT4ge1xuICAgIGlmICghY2IpIHJldHVyblxuICAgIGxpc3RlbmVyc1tlXSA9IGxpc3RlbmVyc1tlXSB8fCB7IHF1ZXVlOiBbXSB9XG4gICAgbGlzdGVuZXJzW2VdLnF1ZXVlLnB1c2goY2IpXG4gIH1cblxuICBjb25zdCBlbWl0ID0gKGUsIGRhdGEgPSBudWxsKSA9PiB7XG4gICAgbGV0IGl0ZW1zID0gbGlzdGVuZXJzW2VdID8gbGlzdGVuZXJzW2VdLnF1ZXVlIDogZmFsc2VcbiAgICBpdGVtcyAmJiBpdGVtcy5mb3JFYWNoKGkgPT4gaShkYXRhKSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ubyxcbiAgICBlbWl0LFxuICAgIG9uXG4gIH1cbn1cbiIsIi8vIEJlc3QgcGxhY2UgdG8gZmluZCBpbmZvcm1hdGlvbiBvbiBYSFIgZmVhdHVyZXMgaXM6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3RcblxudmFyIHJlcWZpZWxkcyA9IFtcbiAgJ3Jlc3BvbnNlVHlwZScsICd3aXRoQ3JlZGVudGlhbHMnLCAndGltZW91dCcsICdvbnByb2dyZXNzJ1xuXVxuXG4vLyBTaW1wbGUgYW5kIHNtYWxsIGFqYXggZnVuY3Rpb25cbi8vIFRha2VzIGEgcGFyYW1ldGVycyBvYmplY3QgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb25cbi8vIFBhcmFtZXRlcnM6XG4vLyAgLSB1cmw6IHN0cmluZywgcmVxdWlyZWRcbi8vICAtIGhlYWRlcnM6IG9iamVjdCBvZiBge2hlYWRlcl9uYW1lOiBoZWFkZXJfdmFsdWUsIC4uLn1gXG4vLyAgLSBib2R5OlxuLy8gICAgICArIHN0cmluZyAoc2V0cyBjb250ZW50IHR5cGUgdG8gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgaWYgbm90IHNldCBpbiBoZWFkZXJzKVxuLy8gICAgICArIEZvcm1EYXRhIChkb2Vzbid0IHNldCBjb250ZW50IHR5cGUgc28gdGhhdCBicm93c2VyIHdpbGwgc2V0IGFzIGFwcHJvcHJpYXRlKVxuLy8gIC0gbWV0aG9kOiAnR0VUJywgJ1BPU1QnLCBldGMuIERlZmF1bHRzIHRvICdHRVQnIG9yICdQT1NUJyBiYXNlZCBvbiBib2R5XG4vLyAgLSBjb3JzOiBJZiB5b3VyIHVzaW5nIGNyb3NzLW9yaWdpbiwgeW91IHdpbGwgbmVlZCB0aGlzIHRydWUgZm9yIElFOC05XG4vL1xuLy8gVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgb250byB0aGUgeGhyIG9iamVjdC5cbi8vIElNUE9SVEFOVCBOT1RFOiBUaGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb21wYXRpYmlsaXR5IGNoZWNraW5nLlxuLy8gIC0gcmVzcG9uc2VUeXBlOiBzdHJpbmcsIHZhcmlvdXMgY29tcGF0YWJpbGl0eSwgc2VlIHhociBkb2NzIGZvciBlbnVtIG9wdGlvbnNcbi8vICAtIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbiwgSUUxMCssIENPUlMgb25seVxuLy8gIC0gdGltZW91dDogbG9uZywgbXMgdGltZW91dCwgSUU4K1xuLy8gIC0gb25wcm9ncmVzczogY2FsbGJhY2ssIElFMTArXG4vL1xuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gcHJvdG90eXBlOlxuLy8gIC0gc3RhdHVzQ29kZSBmcm9tIHJlcXVlc3Rcbi8vICAtIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlc3BvbnNlVHlwZSBzZXQgYW5kIHN1cHBvcnRlZCBieSBicm93c2VyLCB0aGlzIGlzIGFuIG9iamVjdCBvZiBzb21lIHR5cGUgKHNlZSBkb2NzKVxuLy8gICAgKyBvdGhlcndpc2UgaWYgcmVxdWVzdCBjb21wbGV0ZWQsIHRoaXMgaXMgdGhlIHN0cmluZyB0ZXh0IG9mIHRoZSByZXNwb25zZVxuLy8gICAgKyBpZiByZXF1ZXN0IGlzIGFib3J0ZWQsIHRoaXMgaXMgXCJBYm9ydFwiXG4vLyAgICArIGlmIHJlcXVlc3QgdGltZXMgb3V0LCB0aGlzIGlzIFwiVGltZW91dFwiXG4vLyAgICArIGlmIHJlcXVlc3QgZXJyb3JzIGJlZm9yZSBjb21wbGV0aW5nIChwcm9iYWJseSBhIENPUlMgaXNzdWUpLCB0aGlzIGlzIFwiRXJyb3JcIlxuLy8gIC0gcmVxdWVzdCBvYmplY3Rcbi8vXG4vLyBSZXR1cm5zIHRoZSByZXF1ZXN0IG9iamVjdC4gU28geW91IGNhbiBjYWxsIC5hYm9ydCgpIG9yIG90aGVyIG1ldGhvZHNcbi8vXG4vLyBERVBSRUNBVElPTlM6XG4vLyAgLSBQYXNzaW5nIGEgc3RyaW5nIGluc3RlYWQgb2YgdGhlIHBhcmFtcyBvYmplY3QgaGFzIGJlZW4gcmVtb3ZlZCFcbi8vXG5leHBvcnRzLmFqYXggPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAvLyBBbnkgdmFyaWFibGUgdXNlZCBtb3JlIHRoYW4gb25jZSBpcyB2YXInZCBoZXJlIGJlY2F1c2VcbiAgLy8gbWluaWZpY2F0aW9uIHdpbGwgbXVuZ2UgdGhlIHZhcmlhYmxlcyB3aGVyZWFzIGl0IGNhbid0IG11bmdlXG4gIC8vIHRoZSBvYmplY3QgYWNjZXNzLlxuICB2YXIgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzIHx8IHt9XG4gICAgLCBib2R5ID0gcGFyYW1zLmJvZHlcbiAgICAsIG1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgKGJvZHkgPyAnUE9TVCcgOiAnR0VUJylcbiAgICAsIGNhbGxlZCA9IGZhbHNlXG5cbiAgdmFyIHJlcSA9IGdldFJlcXVlc3QocGFyYW1zLmNvcnMpXG5cbiAgZnVuY3Rpb24gY2Ioc3RhdHVzQ29kZSwgcmVzcG9uc2VUZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IHN0YXR1c0NvZGUgOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICByZXEuc3RhdHVzID09PSAwID8gXCJFcnJvclwiIDogKHJlcS5yZXNwb25zZSB8fCByZXEucmVzcG9uc2VUZXh0IHx8IHJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgIHJlcSlcbiAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSlcblxuICB2YXIgc3VjY2VzcyA9IHJlcS5vbmxvYWQgPSBjYigyMDApXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSBzdWNjZXNzKClcbiAgfVxuICByZXEub25lcnJvciA9IGNiKG51bGwsICdFcnJvcicpXG4gIHJlcS5vbnRpbWVvdXQgPSBjYihudWxsLCAnVGltZW91dCcpXG4gIHJlcS5vbmFib3J0ID0gY2IobnVsbCwgJ0Fib3J0JylcblxuICBpZiAoYm9keSkge1xuICAgIHNldERlZmF1bHQoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKVxuXG4gICAgaWYgKCFnbG9iYWwuRm9ybURhdGEgfHwgIShib2R5IGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSkge1xuICAgICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcWZpZWxkcy5sZW5ndGgsIGZpZWxkOyBpIDwgbGVuOyBpKyspIHtcbiAgICBmaWVsZCA9IHJlcWZpZWxkc1tpXVxuICAgIGlmIChwYXJhbXNbZmllbGRdICE9PSB1bmRlZmluZWQpXG4gICAgICByZXFbZmllbGRdID0gcGFyYW1zW2ZpZWxkXVxuICB9XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gaGVhZGVycylcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgaGVhZGVyc1tmaWVsZF0pXG5cbiAgcmVxLnNlbmQoYm9keSlcblxuICByZXR1cm4gcmVxXG59XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoY29ycykge1xuICAvLyBYRG9tYWluUmVxdWVzdCBpcyBvbmx5IHdheSB0byBkbyBDT1JTIGluIElFIDggYW5kIDlcbiAgLy8gQnV0IFhEb21haW5SZXF1ZXN0IGlzbid0IHN0YW5kYXJkcy1jb21wYXRpYmxlXG4gIC8vIE5vdGFibHksIGl0IGRvZXNuJ3QgYWxsb3cgY29va2llcyB0byBiZSBzZW50IG9yIHNldCBieSBzZXJ2ZXJzXG4gIC8vIElFIDEwKyBpcyBzdGFuZGFyZHMtY29tcGF0aWJsZSBpbiBpdHMgWE1MSHR0cFJlcXVlc3RcbiAgLy8gYnV0IElFIDEwIGNhbiBzdGlsbCBoYXZlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB1c2UgaXRcbiAgaWYgKGNvcnMgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICEvTVNJRSAxLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3RcbiAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdClcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHQob2JqLCBrZXksIHZhbHVlKSB7XG4gIG9ialtrZXldID0gb2JqW2tleV0gfHwgdmFsdWVcbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiTmF2aWdvXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdHZhciBQQVJBTUVURVJfUkVHRVhQID0gLyhbOipdKShcXHcrKS9nO1xuXHR2YXIgV0lMRENBUkRfUkVHRVhQID0gL1xcKi9nO1xuXHR2YXIgUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFAgPSAnKFteXFwvXSspJztcblx0dmFyIFJFUExBQ0VfV0lMRENBUkQgPSAnKD86LiopJztcblx0dmFyIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCA9ICcoPzpcXC8kfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0VXJsRGVwdGgodXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXC8kLywgJycpLnNwbGl0KCcvJykubGVuZ3RoO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjb21wYXJlVXJsRGVwdGgodXJsQSwgdXJsQikge1xuXHQgIHJldHVybiBnZXRVcmxEZXB0aCh1cmxBKSA8IGdldFVybERlcHRoKHVybEIpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwpIHtcblx0ICB2YXIgcm91dGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHJldHVybiByb3V0ZXMubWFwKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIF9yZXBsYWNlRHluYW1pY1VSTFBhciA9IHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHZhciByZWdleHAgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucmVnZXhwO1xuXHQgICAgdmFyIHBhcmFtTmFtZXMgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucGFyYW1OYW1lcztcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXhwKTtcblx0ICAgIHZhciBwYXJhbXMgPSByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgcGFyYW1OYW1lcyk7XG5cdFxuXHQgICAgcmV0dXJuIG1hdGNoID8geyBtYXRjaDogbWF0Y2gsIHJvdXRlOiByb3V0ZSwgcGFyYW1zOiBwYXJhbXMgfSA6IGZhbHNlO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbiAobSkge1xuXHQgICAgcmV0dXJuIG07XG5cdCAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIG1hdGNoKHVybCwgcm91dGVzKSB7XG5cdCAgcmV0dXJuIGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzKVswXSB8fCBmYWxzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcm9vdCh1cmwsIHJvdXRlcykge1xuXHQgIHZhciBtYXRjaGVkID0gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIHUgPSBjbGVhbihyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgcmV0dXJuIHUgIT09ICcnICYmIHUgIT09ICcqJztcblx0ICB9KSk7XG5cdCAgdmFyIGZhbGxiYWNrVVJMID0gY2xlYW4odXJsKTtcblx0XG5cdCAgaWYgKG1hdGNoZWQubGVuZ3RoID4gMCkge1xuXHQgICAgcmV0dXJuIG1hdGNoZWQubWFwKGZ1bmN0aW9uIChtKSB7XG5cdCAgICAgIHJldHVybiBjbGVhbih1cmwuc3Vic3RyKDAsIG0ubWF0Y2guaW5kZXgpKTtcblx0ICAgIH0pLnJlZHVjZShmdW5jdGlvbiAocm9vdCwgY3VycmVudCkge1xuXHQgICAgICByZXR1cm4gY3VycmVudC5sZW5ndGggPCByb290Lmxlbmd0aCA/IGN1cnJlbnQgOiByb290O1xuXHQgICAgfSwgZmFsbGJhY2tVUkwpO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsbGJhY2tVUkw7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCkge1xuXHQgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZW1vdmVHRVRQYXJhbXModXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXD8oLiopPyQvLCAnJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIE5hdmlnbyhyLCB1c2VIYXNoKSB7XG5cdCAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgdGhpcy5yb290ID0gdXNlSGFzaCAmJiByID8gci5yZXBsYWNlKC9cXC8kLywgJy8jJykgOiByIHx8IG51bGw7XG5cdCAgdGhpcy5fdXNlSGFzaCA9IHVzZUhhc2g7XG5cdCAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG5cdCAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG5cdCAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSBudWxsO1xuXHQgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX29rID0gIXVzZUhhc2ggJiYgaXNQdXNoU3RhdGVBdmFpbGFibGUoKTtcblx0ICB0aGlzLl9saXN0ZW4oKTtcblx0ICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXHR9XG5cdFxuXHROYXZpZ28ucHJvdG90eXBlID0ge1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIG1hdGNoOiBtYXRjaCxcblx0ICAgIHJvb3Q6IHJvb3QsXG5cdCAgICBjbGVhbjogY2xlYW5cblx0ICB9LFxuXHQgIG5hdmlnYXRlOiBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoLCBhYnNvbHV0ZSkge1xuXHQgICAgdmFyIHRvO1xuXHRcblx0ICAgIHBhdGggPSBwYXRoIHx8ICcnO1xuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHRvID0gKCFhYnNvbHV0ZSA/IHRoaXMuX2dldFJvb3QoKSArICcvJyA6ICcnKSArIGNsZWFuKHBhdGgpO1xuXHQgICAgICB0byA9IHRvLnJlcGxhY2UoLyhbXjpdKShcXC97Mix9KS9nLCAnJDEvJyk7XG5cdCAgICAgIGhpc3RvcnlbdGhpcy5fcGF1c2VkID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sICcnLCB0byk7XG5cdCAgICAgIHRoaXMucmVzb2x2ZSgpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyMoLiopJC8sICcnKSArICcjJyArIHBhdGg7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG9uOiBmdW5jdGlvbiBvbigpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoYXJncy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICB9IGVsc2UgaWYgKF90eXBlb2YoYXJnc1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHZhciBvcmRlcmVkUm91dGVzID0gT2JqZWN0LmtleXMoYXJnc1swXSkuc29ydChjb21wYXJlVXJsRGVwdGgpO1xuXHRcblx0ICAgICAgb3JkZXJlZFJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgICAgIF90aGlzLl9hZGQocm91dGUsIGFyZ3NbMF1bcm91dGVdKTtcblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gYXJnc1swXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgbm90Rm91bmQ6IGZ1bmN0aW9uIG5vdEZvdW5kKGhhbmRsZXIpIHtcblx0ICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IGhhbmRsZXI7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKGN1cnJlbnQpIHtcblx0ICAgIHZhciBoYW5kbGVyLCBtO1xuXHQgICAgdmFyIHVybCA9IChjdXJyZW50IHx8IHRoaXMuX2NMb2MoKSkucmVwbGFjZSh0aGlzLl9nZXRSb290KCksICcnKTtcblx0XG5cdCAgICBpZiAodGhpcy5fcGF1c2VkIHx8IHVybCA9PT0gdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLl91c2VIYXNoKSB7XG5cdCAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvIy8sICcvJyk7XG5cdCAgICB9XG5cdCAgICB1cmwgPSByZW1vdmVHRVRQYXJhbXModXJsKTtcblx0ICAgIG0gPSBtYXRjaCh1cmwsIHRoaXMuX3JvdXRlcyk7XG5cdFxuXHQgICAgaWYgKG0pIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIGhhbmRsZXIgPSBtLnJvdXRlLmhhbmRsZXI7XG5cdCAgICAgIG0ucm91dGUucm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgPyBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KG0ubWF0Y2guc2xpY2UoMSwgbS5tYXRjaC5sZW5ndGgpKSkgOiBoYW5kbGVyKG0ucGFyYW1zKTtcblx0ICAgICAgcmV0dXJuIG07XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX2RlZmF1bHRIYW5kbGVyICYmICh1cmwgPT09ICcnIHx8IHVybCA9PT0gJy8nKSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIoKTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX25vdEZvdW5kSGFuZGxlcikge1xuXHQgICAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9LFxuXHQgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cdCAgICBjbGVhclRpbWVvdXQodGhpcy5fbGlzdGVubmluZ0ludGVydmFsKTtcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm9ucG9wc3RhdGUgPSBudWxsIDogbnVsbDtcblx0ICB9LFxuXHQgIHVwZGF0ZVBhZ2VMaW5rczogZnVuY3Rpb24gdXBkYXRlUGFnZUxpbmtzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdFxuXHQgICAgdGhpcy5fZmluZExpbmtzKCkuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHQgICAgICBpZiAoIWxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCkge1xuXHQgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XG5cdCAgICAgICAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZCkge1xuXHQgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIHNlbGYubmF2aWdhdGUoY2xlYW4obG9jYXRpb24pKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgICBsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShuYW1lKSB7XG5cdCAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHJldHVybiB0aGlzLl9yb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHJvdXRlKSB7XG5cdCAgICAgIHZhciBrZXk7XG5cdFxuXHQgICAgICBpZiAocm91dGUubmFtZSA9PT0gbmFtZSkge1xuXHQgICAgICAgIHJlc3VsdCA9IHJvdXRlLnJvdXRlO1xuXHQgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc6JyArIGtleSwgZGF0YVtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sICcnKTtcblx0ICB9LFxuXHQgIGxpbms6IGZ1bmN0aW9uIGxpbmsocGF0aCkge1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFJvb3QoKSArIHBhdGg7XG5cdCAgfSxcblx0ICBwYXVzZTogZnVuY3Rpb24gcGF1c2Uoc3RhdHVzKSB7XG5cdCAgICB0aGlzLl9wYXVzZWQgPSBzdGF0dXM7XG5cdCAgfSxcblx0ICBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGU6IGZ1bmN0aW9uIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZSgpIHtcblx0ICAgIGlmICghaXNQdXNoU3RhdGVBdmFpbGFibGUoKSkge1xuXHQgICAgICB0aGlzLmRlc3Ryb3koKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9hZGQ6IGZ1bmN0aW9uIF9hZGQocm91dGUpIHtcblx0ICAgIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBpZiAoKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihoYW5kbGVyKSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyLnVzZXMsIG5hbWU6IGhhbmRsZXIuYXMgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLl9hZGQ7XG5cdCAgfSxcblx0ICBfZ2V0Um9vdDogZnVuY3Rpb24gX2dldFJvb3QoKSB7XG5cdCAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSByZXR1cm4gdGhpcy5yb290O1xuXHQgICAgdGhpcy5yb290ID0gcm9vdCh0aGlzLl9jTG9jKCksIHRoaXMuX3JvdXRlcyk7XG5cdCAgICByZXR1cm4gdGhpcy5yb290O1xuXHQgIH0sXG5cdCAgX2xpc3RlbjogZnVuY3Rpb24gX2xpc3RlbigpIHtcblx0ICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpczIucmVzb2x2ZSgpO1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgY2FjaGVkID0gX3RoaXMyLl9jTG9jKCksXG5cdCAgICAgICAgICAgIGN1cnJlbnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgICAgIF9jaGVjayA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgICAgX2NoZWNrID0gZnVuY3Rpb24gY2hlY2soKSB7XG5cdCAgICAgICAgICBjdXJyZW50ID0gX3RoaXMyLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzMi5yZXNvbHZlKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBfdGhpczIuX2xpc3Rlbm5pbmdJbnRlcnZhbCA9IHNldFRpbWVvdXQoX2NoZWNrLCAyMDApO1xuXHQgICAgICAgIH07XG5cdCAgICAgICAgX2NoZWNrKCk7XG5cdCAgICAgIH0pKCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfY0xvYzogZnVuY3Rpb24gX2NMb2MoKSB7XG5cdCAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0sXG5cdCAgX2ZpbmRMaW5rczogZnVuY3Rpb24gX2ZpbmRMaW5rcygpIHtcblx0ICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5hdmlnb10nKSk7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTmF2aWdvO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmF2aWdvLmpzLm1hcCIsImltcG9ydCBsb29wIGZyb20gJ2xvb3AuanMnXG5pbXBvcnQgZGVsZWdhdGUgZnJvbSAnZGVsZWdhdGUnXG5pbXBvcnQgbmFub2FqYXggZnJvbSAnbmFub2FqYXgnXG5pbXBvcnQgbmF2aWdvIGZyb20gJ25hdmlnbydcbmltcG9ydCBkb20gZnJvbSAnLi9saWIvZG9tLmpzJ1xuaW1wb3J0IHsgXG4gIG9yaWdpbiwgXG4gIHNhbml0aXplLFxuICBzYXZlU2Nyb2xsUG9zaXRpb24sXG4gIHNjcm9sbFRvTG9jYXRpb24sXG4gIGxpbmssXG4gIHNldEFjdGl2ZUxpbmtzXG59IGZyb20gJy4vbGliL3V0aWwuanMnXG5cbmNvbnN0IHJvdXRlciA9IG5ldyBuYXZpZ28ob3JpZ2luKVxuXG5jb25zdCBzdGF0ZSA9IHtcbiAgX3N0YXRlOiB7XG4gICAgcm91dGU6ICcnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBwcmV2OiB7XG4gICAgICByb3V0ZTogJy8nLFxuICAgICAgdGl0bGU6ICcnLFxuICAgIH1cbiAgfSxcbiAgZ2V0IHJvdXRlKCl7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnJvdXRlXG4gIH0sXG4gIHNldCByb3V0ZShsb2Mpe1xuICAgIHRoaXMuX3N0YXRlLnByZXYucm91dGUgPSB0aGlzLnJvdXRlXG4gICAgdGhpcy5fc3RhdGUucm91dGUgPSBsb2NcbiAgICBzZXRBY3RpdmVMaW5rcyhsb2MpXG4gIH0sXG4gIGdldCB0aXRsZSgpe1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS50aXRsZVxuICB9LFxuICBzZXQgdGl0bGUodmFsKXtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnRpdGxlID0gdGhpcy50aXRsZVxuICAgIHRoaXMuX3N0YXRlLnRpdGxlID0gdmFsXG4gICAgZG9jdW1lbnQudGl0bGUgPSB2YWxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAob3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQuYm9keVxuICBjb25zdCBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gfHwgMFxuICBjb25zdCBpZ25vcmUgPSBvcHRpb25zLmlnbm9yZSB8fCBbXVxuXG4gIGNvbnN0IGV2ZW50cyA9IGxvb3AoKVxuICBjb25zdCByZW5kZXIgPSBkb20ocm9vdCwgZHVyYXRpb24sIGV2ZW50cylcblxuICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoe1xuICAgIC4uLmV2ZW50cyxcbiAgICBzdG9wKCl7IHN0YXRlLnBhdXNlZCA9IHRydWUgfSxcbiAgICBzdGFydCgpeyBzdGF0ZS5wYXVzZWQgPSBmYWxzZSB9LFxuICAgIGdvLFxuICAgIHB1c2hcbiAgfSwge1xuICAgIGdldFN0YXRlOiB7XG4gICAgICB2YWx1ZTogKCkgPT4gc3RhdGUuX3N0YXRlXG4gICAgfVxuICB9KVxuXG4gIHN0YXRlLnJvdXRlID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG4gIHN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGUgXG5cbiAgZGVsZWdhdGUoZG9jdW1lbnQsICdhJywgJ2NsaWNrJywgKGUpID0+IHtcbiAgICBsZXQgYSA9IGUuZGVsZWdhdGVUYXJnZXRcbiAgICBsZXQgaHJlZiA9IGEuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nXG4gICAgbGV0IHJvdXRlID0gc2FuaXRpemUoaHJlZilcblxuICAgIGlmIChcbiAgICAgICFsaW5rLmlzU2FtZU9yaWdpbihocmVmKVxuICAgICAgfHwgYS5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnXG4gICAgICB8fCBhLmNsYXNzTGlzdC5jb250YWlucygnbm8tYWpheCcpXG4gICAgICB8fCBtYXRjaGVzKGUsIHJvdXRlKVxuICAgICAgfHwgbGluay5pc0hhc2goaHJlZilcbiAgICApeyByZXR1cm4gfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAoXG4gICAgICBsaW5rLmlzU2FtZVVSTChocmVmKVxuICAgICl7IHJldHVybiB9XG5cbiAgICBnbyhgJHtvcmlnaW59LyR7cm91dGV9YClcbiAgfSlcblxuICB3aW5kb3cub25wb3BzdGF0ZSA9IGUgPT4ge1xuICAgIGxldCB0byA9IGUudGFyZ2V0LmxvY2F0aW9uLmhyZWZcblxuICAgIGlmIChtYXRjaGVzKGUsIHRvKSl7IFxuICAgICAgaWYgKGxpbmsuaXNIYXNoKHRvKSl7IHJldHVybiB9XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIHJldHVybiBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3BzdGF0ZSBieXBhc3NlcyByb3V0ZXIsIHNvIHdlIFxuICAgICAqIG5lZWQgdG8gdGVsbCBpdCB3aGVyZSB3ZSB3ZW50IHRvXG4gICAgICogd2l0aG91dCBwdXNoaW5nIHN0YXRlXG4gICAgICovXG4gICAgZ28odG8sIG51bGwsIHRydWUpXG4gIH1cblxuICBpZiAoJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5KXtcbiAgICBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCdcblxuICAgIGlmIChoaXN0b3J5LnN0YXRlICYmIGhpc3Rvcnkuc3RhdGUuc2Nyb2xsVG9wICE9PSB1bmRlZmluZWQpe1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGhpc3Rvcnkuc3RhdGUuc2Nyb2xsVG9wKVxuICAgIH1cblxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IHNhdmVTY3JvbGxQb3NpdGlvbiBcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzb2x2ZSBVc2UgbmF2aWdvLnJlc29sdmUoKSwgYnlwYXNzIG5hdmlnby5uYXZpZ2F0ZSgpXG4gICAqXG4gICAqIFBvcHN0YXRlIGNoYW5nZXMgdGhlIFVSTCBmb3IgdXMsIHNvIGlmIHdlIHdlcmUgdG8gXG4gICAqIHJvdXRlci5uYXZpZ2F0ZSgpIHRvIHRoZSBwcmV2aW91cyBsb2NhdGlvbiwgaXQgd291bGQgcHVzaFxuICAgKiBhIGR1cGxpY2F0ZSByb3V0ZSB0byBoaXN0b3J5IGFuZCB3ZSB3b3VsZCBjcmVhdGUgYSBsb29wLlxuICAgKlxuICAgKiByb3V0ZXIucmVzb2x2ZSgpIGxldCdzIE5hdmlnbyBrbm93IHdlJ3ZlIG1vdmVkLCB3aXRob3V0XG4gICAqIGFsdGVyaW5nIGhpc3RvcnkuXG4gICAqL1xuICBmdW5jdGlvbiBnbyhyb3V0ZSwgY2IgPSBudWxsLCByZXNvbHZlKXtcbiAgICBsZXQgdG8gPSBzYW5pdGl6ZShyb3V0ZSlcblxuICAgIHJlc29sdmUgPyBudWxsIDogc2F2ZVNjcm9sbFBvc2l0aW9uKClcblxuICAgIGV2ZW50cy5lbWl0KCdiZWZvcmU6cm91dGUnLCB7cm91dGU6IHRvfSlcblxuICAgIGlmIChzdGF0ZS5wYXVzZWQpeyByZXR1cm4gfVxuXG4gICAgbGV0IHJlcSA9IGdldChgJHtvcmlnaW59LyR7dG99YCwgdGl0bGUgPT4ge1xuICAgICAgcmVzb2x2ZSA/IHJvdXRlci5yZXNvbHZlKHRvKSA6IHJvdXRlci5uYXZpZ2F0ZSh0bylcbiAgICAgIFxuICAgICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgICBwdXNoUm91dGUodG8sIHRpdGxlKVxuXG4gICAgICBldmVudHMuZW1pdCgnYWZ0ZXI6cm91dGUnLCB7cm91dGU6IHRvLCB0aXRsZX0pXG5cbiAgICAgIGNiID8gY2IodG8sIHRpdGxlKSA6IG51bGxcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaChsb2MgPSBzdGF0ZS5yb3V0ZSwgdGl0bGUgPSBudWxsKXtcbiAgICByb3V0ZXIubmF2aWdhdGUobG9jKVxuICAgIHN0YXRlLnJvdXRlID0gbG9jXG4gICAgdGl0bGUgPyBzdGF0ZS50aXRsZSA9IHRpdGxlIDogbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KHJvdXRlLCBjYil7XG4gICAgcmV0dXJuIG5hbm9hamF4LmFqYXgoeyBcbiAgICAgIG1ldGhvZDogJ0dFVCcsIFxuICAgICAgdXJsOiByb3V0ZSBcbiAgICB9LCAoc3RhdHVzLCByZXMsIHJlcSkgPT4ge1xuICAgICAgaWYgKHJlcS5zdGF0dXMgPCAyMDAgfHwgcmVxLnN0YXR1cyA+IDMwMCAmJiByZXEuc3RhdHVzICE9PSAzMDQpe1xuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gYCR7b3JpZ2lufS8ke3N0YXRlLl9zdGF0ZS5wcmV2LnJvdXRlfWBcbiAgICAgIH1cbiAgICAgIHJlbmRlcihyZXEucmVzcG9uc2UsIGNiKSBcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaFJvdXRlKGxvYywgdGl0bGUgPSBudWxsKXtcbiAgICBzdGF0ZS5yb3V0ZSA9IGxvY1xuICAgIHRpdGxlID8gc3RhdGUudGl0bGUgPSB0aXRsZSA6IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hdGNoZXMoZXZlbnQsIHJvdXRlKXtcbiAgICByZXR1cm4gaWdub3JlLmZpbHRlcih0ID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHQpKXtcbiAgICAgICAgbGV0IHJlcyA9IHRbMV0ocm91dGUpXG4gICAgICAgIGlmIChyZXMpeyBldmVudHMuZW1pdCh0WzBdLCB7cm91dGUsIGV2ZW50fSkgfVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdChyb3V0ZSkgXG4gICAgICB9XG4gICAgfSkubGVuZ3RoID4gMCA/IHRydWUgOiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlXG59XG4iLCJpbXBvcnQgeyB0YXJyeSwgcXVldWUgfSBmcm9tICd0YXJyeS5qcydcbmltcG9ydCB7IHJlc3RvcmVTY3JvbGxQb3MgfSBmcm9tICcuL3V0aWwnXG5cbi8qKlxuICogSW5pdCBuZXcgbmF0aXZlIHBhcnNlclxuICovXG5jb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcblxuLyoqXG4gKiBHZXQgdGhlIHRhcmdldCBvZiB0aGUgYWpheCByZXFcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIFN0cmluZ2lmaWVkIEhUTUxcbiAqIEByZXR1cm4ge29iamVjdH0gRE9NIG5vZGUsICNwYWdlXG4gKi9cbmNvbnN0IHBhcnNlUmVzcG9uc2UgPSBodG1sID0+IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIilcblxuLyoqXG4gKiBGaW5kcyBhbGwgPHNjcmlwdD4gdGFncyBpbiB0aGUgbmV3XG4gKiBtYXJrdXAgYW5kIGV2YWx1YXRlcyB0aGVpciBjb250ZW50c1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSByb290IERPTSBub2RlIGNvbnRhaW5pbmcgbmV3IG1hcmt1cCB2aWEgQUpBWFxuICogQHBhcmFtIHsuLi5vYmplY3R9IHNvdXJjZXMgT3RoZXIgRE9NIG5vZGVzIHRvIHNjcmFwZSBzY3JpcHQgdGFncyBmcm9tIFxuICovXG5jb25zdCBldmFsU2NyaXB0cyA9IChzb3VyY2UsIHJvb3QgPSBudWxsKSA9PiB7XG4gIGxldCBlcnJvcnMgPSBbXVxuICBjb25zdCBzY3JpcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc291cmNlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSlcbiAgY29uc3QgZXhpc3RpbmcgPSByb290ID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JykpIDogW11cblxuICBjb25zdCBkdXBlID0gcyA9PiBleGlzdGluZy5maWx0ZXIoZSA9PiBzLmlubmVySFRNTCA9PT0gZS5pbm5lckhUTUwgJiYgcy5zcmMgPT09IGUuc3JjKS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlIFxuXG4gIHNjcmlwdHMubGVuZ3RoID4gMCAmJiBzY3JpcHRzLmZvckVhY2godCA9PiB7XG4gICAgbGV0IHMgPSB0LmNsb25lTm9kZSh0cnVlKVxuXG4gICAgaWYgKGR1cGUocykpIHJldHVyblxuXG4gICAgcy5zZXRBdHRyaWJ1dGUoJ2RhdGEtYWpheGVkJywgJ3RydWUnKVxuXG4gICAgdHJ5IHtcbiAgICAgIGV2YWwocy5pbm5lckhUTUwpXG4gICAgfSBjYXRjaChlKXtcbiAgICAgIGVycm9ycy5wdXNoKGUpXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJvb3QgPyByb290Lmluc2VydEJlZm9yZShzLCByb290LmNoaWxkcmVuWzBdKSA6IHNvdXJjZS5yZXBsYWNlQ2hpbGQocywgdClcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgZXJyb3JzLnB1c2goZSlcbiAgICAgIGRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKHMsIGRvY3VtZW50LmhlYWQuY2hpbGRyZW5bMF0pXG4gICAgfVxuICB9KSBcblxuICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApe1xuICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoJ29wZXJhdG9yLmpzJylcbiAgICBlcnJvcnMuZm9yRWFjaChlID0+IGNvbnNvbGUubG9nKGUpKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG59XG5cbi8qKlxuICogR2V0IHdpZHRoL2hlaWdodCBvZiBlbGVtZW50IG9yIHdpbmRvd1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBlbCBFbGVtZW50IG9yIHdpbmRvd1xuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgJ0hlaWdodCcgb3IgJ1dpZHRoXG4gKi9cbmNvbnN0IHJldHVyblNpemUgPSAoZWwsIHR5cGUpID0+IHtcbiAgY29uc3QgaXNXaW5kb3cgPSBlbCAhPT0gbnVsbCAmJiBlbC53aW5kb3cgPyB0cnVlIDogZmFsc2VcblxuICBpZiAoaXNXaW5kb3cpe1xuICAgIHJldHVybiBNYXRoLm1heChlbFtgb3V0ZXIke3R5cGV9YF0sIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtgY2xpZW50JHt0eXBlfWBdKVxuICB9XG5cbiAgcmV0dXJuIE1hdGgubWF4KGVsW2BvZmZzZXQke3R5cGV9YF0sIGVsW2BjbGllbnQke3R5cGV9YF0pXG59XG5cbi8qKlxuICogSGVscGVyIHRvIHNtb290aGx5IHN3YXAgb2xkIFxuICogbWFya3VwIHdpdGggbmV3IG1hcmt1cFxuICogXG4gKiBAcGFyYW0ge29iamVjdH0gbWFya3VwIE5ldyBub2RlIHRvIGFwcGVuZCB0byBET01cbiAqL1xuZXhwb3J0IGRlZmF1bHQgKHJvb3QsIGR1cmF0aW9uLCBldmVudHMpID0+IChtYXJrdXAsIGNiKSA9PiB7XG4gIGNvbnN0IGRvbSA9IHBhcnNlUmVzcG9uc2UobWFya3VwKVxuICBjb25zdCB0aXRsZSA9IGRvbS5oZWFkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aXRsZScpWzBdLmlubmVySFRNTFxuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihyb290KVxuXG4gIGNvbnN0IHN0YXJ0ID0gdGFycnkoXG4gICAgKCkgPT4ge1xuICAgICAgZXZlbnRzLmVtaXQoJ2JlZm9yZTp0cmFuc2l0aW9uJylcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy10cmFuc2l0aW9uaW5nJykgXG4gICAgICBtYWluLnN0eWxlLmhlaWdodCA9IHJldHVyblNpemUobWFpbiwgJ0hlaWdodCcpKydweCdcbiAgICB9XG4gICwgZHVyYXRpb24pXG5cbiAgY29uc3QgcmVuZGVyID0gdGFycnkoXG4gICAgKCkgPT4ge1xuICAgICAgbWFpbi5pbm5lckhUTUwgPSBkb20ucXVlcnlTZWxlY3Rvcihyb290KS5pbm5lckhUTUxcbiAgICAgIGNiKHRpdGxlLCBtYWluKVxuICAgICAgZXZhbFNjcmlwdHMobWFpbilcbiAgICAgIGV2YWxTY3JpcHRzKGRvbS5oZWFkLCBkb2N1bWVudC5oZWFkKVxuICAgICAgcmVzdG9yZVNjcm9sbFBvcygpXG4gICAgfVxuICAsIGR1cmF0aW9uKVxuXG4gIGNvbnN0IHJlbW92ZVRyYW5zaXRpb25TdHlsZXMgPSB0YXJyeShcbiAgICAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdHJhbnNpdGlvbmluZycpIFxuICAgICAgbWFpbi5zdHlsZS5oZWlnaHQgPSAnJ1xuICAgIH1cbiAgLCBkdXJhdGlvbilcblxuICBjb25zdCBzaWduYWxFbmQgPSB0YXJyeShcbiAgICAoKSA9PiBldmVudHMuZW1pdCgnYWZ0ZXI6dHJhbnNpdGlvbicpXG4gICwgZHVyYXRpb24pXG5cbiAgcXVldWUoc3RhcnQsIHJlbmRlciwgcmVtb3ZlVHJhbnNpdGlvblN0eWxlcywgc2lnbmFsRW5kKSgpXG59XG4iLCJjb25zdCBnZXRPcmlnaW4gPSB1cmwgPT4gdXJsLm9yaWdpbiB8fCB1cmwucHJvdG9jb2wrJy8vJyt1cmwuaG9zdFxuXG5leHBvcnQgY29uc3Qgb3JpZ2luID0gZ2V0T3JpZ2luKHdpbmRvdy5sb2NhdGlvbikgXG5cbmV4cG9ydCBjb25zdCBvcmlnaW5SZWdFeCA9IG5ldyBSZWdFeHAob3JpZ2luKVxuXG4vKipcbiAqIFJlcGxhY2Ugc2l0ZSBvcmlnaW4sIGlmIHByZXNlbnQsXG4gKiByZW1vdmUgbGVhZGluZyBzbGFzaCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFJhdyBVUkwgdG8gcGFyc2VcbiAqIEByZXR1cm4ge3N0cmluZ30gVVJMIHNhbnMgb3JpZ2luIGFuZCBzYW5zIGxlYWRpbmcgY29tbWFcbiAqL1xuZXhwb3J0IGNvbnN0IHNhbml0aXplID0gdXJsID0+IHtcbiAgbGV0IHJvdXRlID0gdXJsLnJlcGxhY2Uob3JpZ2luUmVnRXgsICcnKVxuICBsZXQgY2xlYW4gPSByb3V0ZS5tYXRjaCgvXlxcLy8pID8gcm91dGUucmVwbGFjZSgvXFwvezF9LywnJykgOiByb3V0ZSAvLyByZW1vdmUgL1xuICByZXR1cm4gY2xlYW4gPT09ICcnID8gJy8nIDogY2xlYW5cbn1cblxuZXhwb3J0IGNvbnN0IHBhcnNlVVJMID0gdXJsID0+IHtcbiAgbGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgYS5ocmVmID0gdXJsXG4gIHJldHVybiBhXG59XG5cbmV4cG9ydCBjb25zdCBsaW5rID0ge1xuICBpc1NhbWVPcmlnaW46IGhyZWYgPT4gb3JpZ2luID09PSBnZXRPcmlnaW4ocGFyc2VVUkwoaHJlZikpLFxuICBpc0hhc2g6IGhyZWYgPT4gLyMvLnRlc3QoaHJlZiksXG4gIGlzU2FtZVVSTDogaHJlZiA9PiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IHBhcnNlVVJMKGhyZWYpLnBhdGhuYW1lXG59XG5cbmV4cG9ydCBjb25zdCBnZXRTY3JvbGxQb3NpdGlvbiA9ICgpID0+IHdpbmRvdy5wYWdlWU9mZnNldCB8fCB3aW5kb3cuc2Nyb2xsWVxuXG5leHBvcnQgY29uc3Qgc2F2ZVNjcm9sbFBvc2l0aW9uID0gKCkgPT4gd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHsgc2Nyb2xsVG9wOiBnZXRTY3JvbGxQb3NpdGlvbigpIH0sICcnKVxuXG5leHBvcnQgY29uc3QgcmVzdG9yZVNjcm9sbFBvcyA9ICgpID0+IHtcbiAgbGV0IHNjcm9sbFRvcCA9IGhpc3Rvcnkuc3RhdGUgPyBoaXN0b3J5LnN0YXRlLnNjcm9sbFRvcCA6IHVuZGVmaW5lZCBcbiAgaWYgKGhpc3Rvcnkuc3RhdGUgJiYgc2Nyb2xsVG9wICE9PSB1bmRlZmluZWQgKSB7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFRvcClcbiAgICByZXR1cm4gc2Nyb2xsVG9wXG4gIH0gZWxzZSB7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApXG4gIH1cbn1cblxuY29uc3QgYWN0aXZlTGlua3MgPSBbXVxuZXhwb3J0IGNvbnN0IHNldEFjdGl2ZUxpbmtzID0gcm91dGUgPT4ge1xuICBhY3RpdmVMaW5rcy5mb3JFYWNoKGEgPT4gYS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKSlcbiAgYWN0aXZlTGlua3Muc3BsaWNlKDAsIGFjdGl2ZUxpbmtzLmxlbmd0aClcbiAgYWN0aXZlTGlua3MucHVzaCguLi5BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbaHJlZiQ9XCIke3JvdXRlfVwiXWApKSlcbiAgYWN0aXZlTGlua3MuZm9yRWFjaChhID0+IGEuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJykpXG59XG4iLCJjb25zdCBjcmVhdGVCYXIgPSAocm9vdCwgY2xhc3NuYW1lKSA9PiB7XG4gIGxldCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgbGV0IGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gIG8uY2xhc3NOYW1lID0gY2xhc3NuYW1lIFxuICBpLmNsYXNzTmFtZSA9IGAke2NsYXNzbmFtZX1fX2lubmVyYFxuICBvLmFwcGVuZENoaWxkKGkpXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKG8sIHJvb3QuY2hpbGRyZW5bMF0pXG5cbiAgcmV0dXJuIHtcbiAgICBvdXRlcjogbyxcbiAgICBpbm5lcjogaVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChyb290ID0gZG9jdW1lbnQuYm9keSwgb3B0cyA9IHt9KSA9PiB7XG4gIGxldCB0aW1lciA9IG51bGxcbiAgY29uc3Qgc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDIwMFxuICBjb25zdCBjbGFzc25hbWUgPSBvcHRzLmNsYXNzbmFtZSB8fCAncHV0eidcbiAgY29uc3QgdHJpY2tsZSA9IG9wdHMudHJpY2tsZSB8fCA1IFxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHByb2dyZXNzOiAwXG4gIH1cblxuICBjb25zdCBiYXIgPSBjcmVhdGVCYXIocm9vdCwgY2xhc3NuYW1lKVxuXG4gIGNvbnN0IHJlbmRlciA9ICh2YWwgPSAwKSA9PiB7XG4gICAgc3RhdGUucHJvZ3Jlc3MgPSB2YWxcbiAgICBiYXIuaW5uZXIuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgke3N0YXRlLmFjdGl2ZSA/ICcwJyA6ICctMTAwJSd9KSB0cmFuc2xhdGVYKCR7LTEwMCArIHN0YXRlLnByb2dyZXNzfSUpO2BcbiAgfVxuXG4gIGNvbnN0IGdvID0gdmFsID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgcmVuZGVyKE1hdGgubWluKHZhbCwgOTUpKVxuICB9XG5cbiAgY29uc3QgaW5jID0gKHZhbCA9IChNYXRoLnJhbmRvbSgpICogdHJpY2tsZSkpID0+IGdvKHN0YXRlLnByb2dyZXNzICsgdmFsKVxuXG4gIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSBmYWxzZVxuICAgIHJlbmRlcigxMDApXG4gICAgc2V0VGltZW91dCgoKSA9PiByZW5kZXIoKSwgc3BlZWQpXG4gICAgaWYgKHRpbWVyKXsgY2xlYXJUaW1lb3V0KHRpbWVyKSB9XG4gIH1cblxuICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSB0cnVlXG4gICAgaW5jKClcbiAgfVxuXG4gIGNvbnN0IHB1dHogPSAoaW50ZXJ2YWwgPSA1MDApID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiBpbmMoKSwgaW50ZXJ2YWwpXG4gIH1cbiAgXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKHtcbiAgICBwdXR6LFxuICAgIHN0YXJ0LFxuICAgIGluYyxcbiAgICBnbyxcbiAgICBlbmQsXG4gICAgZ2V0U3RhdGU6ICgpID0+IHN0YXRlXG4gIH0se1xuICAgIGJhcjoge1xuICAgICAgdmFsdWU6IGJhclxuICAgIH1cbiAgfSlcbn1cbiIsImNvbnN0IHJ1biA9IChjYiwgYXJncykgPT4ge1xuICBjYigpXG4gIGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzLnNoaWZ0KCkoLi4uYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHRhcnJ5ID0gKGNiLCBkZWxheSA9IG51bGwpID0+ICguLi5hcmdzKSA9PiB7XG4gIGxldCBvdmVycmlkZSA9ICdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSA/IGFyZ3NbMF0gOiBudWxsIFxuICByZXR1cm4gJ251bWJlcicgPT09IHR5cGVvZiBvdmVycmlkZSAmJiBvdmVycmlkZSA+IC0xIFxuICAgID8gdGFycnkoY2IsIG92ZXJyaWRlKSBcbiAgICA6ICdudW1iZXInID09PSB0eXBlb2YgZGVsYXkgJiYgZGVsYXkgPiAtMSBcbiAgICAgID8gc2V0VGltZW91dCgoKSA9PiBydW4oY2IsIGFyZ3MpLCBkZWxheSkgXG4gICAgICA6IHJ1bihjYiwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHF1ZXVlID0gKC4uLmFyZ3MpID0+ICgpID0+IGFyZ3Muc2hpZnQoKSguLi5hcmdzKVxuIiwiY29uc3QgZmluZExpbmsgPSAoaWQsIGRhdGEpID0+IGRhdGEuZmlsdGVyKGwgPT4gbC5pZCA9PT0gaWQpWzBdXG5cbmNvbnN0IGNyZWF0ZUxpbmsgPSAoeyBhbnN3ZXJzIH0sIGRhdGEpID0+IGFuc3dlcnMuZm9yRWFjaChhID0+IHtcbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgbGV0IGlzR0lGID0gL2dpZi8udGVzdChhLm5leHQpID8gdHJ1ZSA6IGZhbHNlXG4gIGEubmV4dCA9IGlzUGF0aCB8fCBpc0dJRiA/IGEubmV4dCA6IGZpbmRMaW5rKGEubmV4dCwgZGF0YSlcbn0pXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTdG9yZSA9IChxdWVzdGlvbnMpID0+IHtcblx0cXVlc3Rpb25zLm1hcChxID0+IGNyZWF0ZUxpbmsocSwgcXVlc3Rpb25zKSlcblx0cmV0dXJuIHF1ZXN0aW9uc1xufVxuXG5leHBvcnQgZGVmYXVsdCBxdWVzdGlvbnMgPT4ge1xuICByZXR1cm4ge1xuICAgIHN0b3JlOiBjcmVhdGVTdG9yZShxdWVzdGlvbnMpLFxuICAgIGdldEFjdGl2ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmZpbHRlcihxID0+IHEuaWQgPT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoLyMvKVsxXSlbMF0gfHwgdGhpcy5zdG9yZVswXVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgW1xuICB7XG4gICAgaWQ6IDEsXG4gICAgcHJvbXB0OiBgaGkhIHdoYXQgYnJpbmdzIHlvdSB0byB0aGlzIG5lY2sgb2YgdGhlIGludGVyd2Vicz9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICd3aG8gciB1JyxcbiAgICAgICAgbmV4dDogMiBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnaGlyaW5nJyxcbiAgICAgICAgbmV4dDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBpdCdzIHlvdXIgbW9tYCxcbiAgICAgICAgbmV4dDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBmdW5ueSBqb2tlc2AsXG4gICAgICAgIG5leHQ6IDVcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAyLFxuICAgIHByb21wdDogYGknbSBtZWxhbmllIOKAkyBhIGdyYXBoaWMgZGVzaWduZXIgd29ya2luZyBpbiBleHBlcmllbnRpYWwgbWFya2V0aW5nICYgcHJvdWQgaW93YW4gdHJ5aW5nIHRvIGVhdCBBTEwgdGhlIEJMVHNgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aGF0J3MgZXhwZXJpZW50aWFsP2AsXG4gICAgICAgIG5leHQ6IDYgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHdoYXQncyBhIEJMVD9gLFxuICAgICAgICBuZXh0OiA3XG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDMsXG4gICAgcHJvbXB0OiBgcmFkISBjYW4gaSBzaG93IHlvdSBzb21lIHByb2plY3RzIGkndmUgd29ya2VkIG9uP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYHllcywgcGxlYXNlIWAsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgbmFoLCB0ZWxsIG1lIGFib3V0IHlvdWAsXG4gICAgICAgIG5leHQ6ICcvYWJvdXQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGknbGwgZW1haWwgeW91IGluc3RlYWRgLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDQsXG4gICAgcHJvbXB0OiBgaGkgbW9tISBpIGxvdmUgeW91IWAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYDopIGkgbG92ZSB5b3UgdG9vIWAsXG4gICAgICAgIG5leHQ6IDhcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgamssIG5vdCB5b3VyIG1vbWAsXG4gICAgICAgIG5leHQ6IDlcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNSxcbiAgICBwcm9tcHQ6IGB3aGF0J3MgZnVubmllciB0aGFuIGEgcmhldG9yaWNhbCBxdWVzdGlvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB5ZXNgLFxuICAgICAgICBuZXh0OiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBub2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9QMkh5ODhyQWpRZHNRL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNixcbiAgICBwcm9tcHQ6IGBleHBlcmllbnRpYWwgaXMgdGhpcyBjb29sIG5pY2hlIHR5cGUgb2YgbWFya2V0aW5nLCB5YSBrbm93P2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYHNvdW5kcyBjb29sLiB3aGF0IGhhdmUgeW91IGRvbmU/YCxcbiAgICAgICAgbmV4dDogJy93b3JrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aHkgZG8geW91IGxpa2UgaXQ/YCxcbiAgICAgICAgbmV4dDogMTFcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNyxcbiAgICBwcm9tcHQ6IGB0YWtlIGEgd2lsZCBndWVzcy4uLmAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYGJlZWYgbGl2ZXIgdG9hc3RgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvb0ZPczEwU0pTbnpvcy9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGJsdWViZXJyeSBsZW1vbiB0YXJ0YCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzNvN1RLd21uRGdRYjVqZW1qSy9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGJhY29uIGxldHR1Y2UgdG9tYXRvYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL2ZxenhjbWxZN29wT2cvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA4LFxuICAgIHByb21wdDogYHNvLi4uIGNhbiBpIHNoaXAgbGF1bmRyeSBob21lIHRvIGlvd2E/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgb2YgY291cnNlIWAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8xMXNCTFZ4TnM3djZXQS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHllYWgsIHN0aWxsIG5vdCB5b3VyIG1vbS4uLmAsXG4gICAgICAgIG5leHQ6IDEyXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDksXG4gICAgcHJvbXB0OiBgY2xpY2tpbmcgZm9yIGZ1biwgaHVoPyBnb29kIGx1Y2sgd2l0aCB0aGlzIG9uZS5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBibHVlIHBpbGxgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvRzdHTm9hVVNIN3NNVS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHJlZCBwaWxsYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL1VqdWpHWTNtQTNKbGUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxMCxcbiAgICBwcm9tcHQ6IGBwYW5jYWtlcyBvciB3YWZmbGVzP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYGZyZW5jaCB0b2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8xNG5iNlRsSVJsYU4xdS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDExLFxuICAgIHByb21wdDogYGkgbGlrZSBleHBlcmllbnRpYWwgYmVjYXVzZSBpdCdzIGp1c3Qgc3VwZXIgY29vbCwgb2theT9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aGF0IGFyZSB5b3VyIGZhdm9yaXRlIHByb2plY3RzP2AsXG4gICAgICAgIG5leHQ6IDE0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGkgaGF2ZSBxdWVzdGlvbnMhIGNhbiBpIGVtYWlsIHlvdT9gLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSwgIFxuXG4gIHtcbiAgICBpZDogMTIsXG4gICAgcHJvbXB0OiBgdGFraW5nIHRoaXMgYSBsaXR0bGUgZmFyIGRvbid0IHlvdSB0aGluaz9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBzdXJlIGFtYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL3FJTnNmREdJMHo5eVUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBtdXN0IGNsaWNrIEFMTCBidXR0b25zYCxcbiAgICAgICAgbmV4dDogMTNcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTMsXG4gICAgcHJvbXB0OiBgeWVhaD9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBjbGlja2luZyB0aGlzIG1heSBoYXJtIGEga2l0dGVuYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL0lnZ2hrWFdrZG5FRW8vZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxNCxcbiAgICBwcm9tcHQ6IGBvZiBjb3Vyc2UgSSBsb3ZlIG15IG93biB3b3JrLCBidXQgdGhlc2UgcHJvamVjdHMgZGVzZXJ2ZSBzb21lIHNlcmlvdXMgcHJvcHNgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBwcm9qZWN0IDFgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly90d2l0dGVyLmNvbSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgcHJvamVjdCAyYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgcHJvamVjdCAzYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbl1cbiIsImltcG9ydCBoMCBmcm9tICdoMCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi4vbGliL2NvbG9ycydcblxuZXhwb3J0IGNvbnN0IGRpdiA9IGgwKCdkaXYnKVxuZXhwb3J0IGNvbnN0IGJ1dHRvbiA9IGgwKCdidXR0b24nKSh7Y2xhc3M6ICdoMiBtdjAgaW5saW5lLWJsb2NrJ30pXG5leHBvcnQgY29uc3QgdGl0bGUgPSBoMCgncCcpKHtjbGFzczogJ2gxIG10MCBtYjA1IGNiJ30pXG5cbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZSA9ICh7cHJvbXB0LCBhbnN3ZXJzfSwgY2IpID0+IHtcbiAgcmV0dXJuIGRpdih7Y2xhc3M6ICdxdWVzdGlvbid9KShcbiAgICB0aXRsZShwcm9tcHQpLFxuICAgIGRpdihcbiAgICAgIC4uLmFuc3dlcnMubWFwKChhLCBpKSA9PiBidXR0b24oe1xuICAgICAgICBvbmNsaWNrOiAoZSkgPT4gY2IoYS5uZXh0KSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBjb2xvcjogY29sb3JzLmNvbG9yc1tpXVxuICAgICAgICB9XG4gICAgICB9KShhLnZhbHVlKSlcbiAgICApXG4gIClcbn1cbiIsImltcG9ydCB7IHRhcnJ5LCBxdWV1ZSB9IGZyb20gJ3RhcnJ5LmpzJ1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dpZicpXG4gIGNvbnN0IGltZyA9IG1vZGFsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKVswXVxuXG4gIGNvbnN0IHNob3cgPSB0YXJyeSgoKSA9PiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJykgXG4gIGNvbnN0IGhpZGUgPSB0YXJyeSgoKSA9PiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKSBcbiAgY29uc3QgdG9nZ2xlID0gdGFycnkoXG4gICAgKCkgPT4gbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSBcbiAgICAgID8gbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgIDogbW9kYWwuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJylcbiAgKVxuXG4gIGNvbnN0IGxhenkgPSAodXJsLCBjYikgPT4ge1xuICAgIGxldCBidXJuZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgYnVybmVyLm9ubG9hZCA9ICgpID0+IGNiKHVybClcblxuICAgIGJ1cm5lci5zcmMgPSB1cmxcbiAgfVxuXG4gIGNvbnN0IG9wZW4gPSB1cmwgPT4ge1xuICAgIHdpbmRvdy5sb2FkZXIuc3RhcnQoKVxuICAgIHdpbmRvdy5sb2FkZXIucHV0eig1MDApXG5cbiAgICBsYXp5KHVybCwgdXJsID0+IHtcbiAgICAgIGltZy5zcmMgPSB1cmxcbiAgICAgIHF1ZXVlKHNob3csIHRvZ2dsZSgyMDApKSgpXG4gICAgICB3aW5kb3cubG9hZGVyLmVuZCgpXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIHF1ZXVlKHRvZ2dsZSwgaGlkZSgyMDApKSgpXG4gIH1cblxuICBtb2RhbC5vbmNsaWNrID0gY2xvc2VcblxuICByZXR1cm4ge1xuICAgIG9wZW4sXG4gICAgY2xvc2VcbiAgfVxufVxuIiwiaW1wb3J0IHJvdXRlciBmcm9tICcuLi9saWIvcm91dGVyJ1xuaW1wb3J0IHF1ZXN0aW9ucyBmcm9tICcuL2RhdGEvaW5kZXguanMnXG5pbXBvcnQgc3RvcmFnZSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgZ2lmZmVyIGZyb20gJy4vZ2lmZmVyJ1xuaW1wb3J0IHsgdGVtcGxhdGUgfSBmcm9tICcuL2VsZW1lbnRzJ1xuXG5sZXQgcHJldlxuY29uc3QgZGF0YSA9IHN0b3JhZ2UocXVlc3Rpb25zKVxuXG4vKipcbiAqIFJlbmRlciB0ZW1wbGF0ZSBhbmQgYXBwZW5kIHRvIERPTVxuICovXG5jb25zdCByZW5kZXIgPSAobmV4dCkgPT4ge1xuICBsZXQgcXVlc3Rpb25Sb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0aW9uUm9vdCcpXG5cbiAgbGV0IGVsID0gdGVtcGxhdGUobmV4dCwgdXBkYXRlKVxuICBxdWVzdGlvblJvb3QgJiYgcXVlc3Rpb25Sb290LmFwcGVuZENoaWxkKGVsKVxuICByZXR1cm4gZWwgXG59XG5cbi8qKlxuICogSGFuZGxlIERPTSB1cGRhdGVzLCBvdGhlciBsaW5rIGNsaWNrc1xuICovXG5jb25zdCB1cGRhdGUgPSAobmV4dCkgPT4ge1xuICBsZXQgcXVlc3Rpb25Sb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0aW9uUm9vdCcpXG5cbiAgbGV0IGlzR0lGID0gL2dpcGh5Ly50ZXN0KG5leHQpXG4gIGlmIChpc0dJRikgcmV0dXJuIGdpZmZlcigpLm9wZW4obmV4dClcblxuICBsZXQgaXNQYXRoID0gL15cXC8vLnRlc3QobmV4dClcbiAgaWYgKGlzUGF0aCkgcmV0dXJuIHJvdXRlci5nbyhuZXh0KVxuXG4gIGlmIChwcmV2ICYmIHF1ZXN0aW9uUm9vdCAmJiBxdWVzdGlvblJvb3QuY29udGFpbnMocHJldikpIHF1ZXN0aW9uUm9vdC5yZW1vdmVDaGlsZChwcmV2KVxuXG4gIHByZXYgPSByZW5kZXIobmV4dClcblxuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5leHQuaWRcbn1cblxuLyoqXG4gKiBXYWl0IHVudGlsIG5ldyBET00gaXMgcHJlc2VudCBiZWZvcmVcbiAqIHRyeWluZyB0byByZW5kZXIgdG8gaXRcbiAqL1xucm91dGVyLm9uKCdhZnRlcjpyb3V0ZScsICh7cm91dGV9KSA9PiB7XG4gIGlmICgvKF5cXC98XFwvI1swLTldfCNbMC05XSkvLnRlc3Qocm91dGUpKXtcbiAgICB1cGRhdGUoZGF0YS5nZXRBY3RpdmUoKSlcbiAgfVxufSlcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBwcmV2ID0gcmVuZGVyKGRhdGEuZ2V0QWN0aXZlKCkpXG59XG4iLCJpbXBvcnQgcHV0eiBmcm9tICdwdXR6J1xuaW1wb3J0IHJvdXRlciBmcm9tICcuL2xpYi9yb3V0ZXInXG5pbXBvcnQgYXBwIGZyb20gJy4vYXBwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2xpYi9jb2xvcnMnXG5cbmNvbnN0IGxvYWRlciA9IHdpbmRvdy5sb2FkZXIgPSBwdXR6KGRvY3VtZW50LmJvZHksIHtcbiAgc3BlZWQ6IDEwMCxcbiAgdHJpY2tsZTogMTBcbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBhcHAoKVxuXG4gIHJvdXRlci5vbignYWZ0ZXI6cm91dGUnLCAoeyByb3V0ZSB9KSA9PiB7XG4gICAgY29sb3JzLnVwZGF0ZSgpXG4gIH0pXG5cbiAgY29sb3JzLnVwZGF0ZSgpXG59KVxuIiwiY29uc3Qgcm9vdFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChyb290U3R5bGUpXG5cbmNvbnN0IGNvbG9ycyA9IFtcbiAgJyMzNUQzRTgnLFxuICAnI0ZGNEU0MicsXG4gICcjRkZFQTUxJ1xuXVxuXG5jb25zdCByYW5kb21Db2xvciA9ICgpID0+IGNvbG9yc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAoMiAtIDApICsgMCldXG5cbmNvbnN0IHNhdmVDb2xvciA9IGMgPT4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21qcycsIEpTT04uc3RyaW5naWZ5KHtcbiAgY29sb3I6IGNcbn0pKVxuXG5jb25zdCByZWFkQ29sb3IgPSAoKSA9PiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWpzJykgPyAoXG4gIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21qcycpKS5jb2xvclxuKSA6IChcbiAgbnVsbFxuKVxuXG5jb25zdCBnZXRDb2xvciA9ICgpID0+IHtcbiAgbGV0IGMgPSByYW5kb21Db2xvcigpXG4gIGxldCBwcmV2ID0gcmVhZENvbG9yKClcblxuICB3aGlsZSAoYyA9PT0gcHJldil7XG4gICAgYyA9IHJhbmRvbUNvbG9yKClcbiAgfVxuXG4gIHNhdmVDb2xvcihjKVxuICByZXR1cm4gY1xufVxuXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGxldCBjb2xvciA9IGdldENvbG9yKClcbiAgXG4gIHJvb3RTdHlsZS5pbm5lckhUTUwgPSBgXG4gICAgYm9keSB7IGNvbG9yOiAke2NvbG9yfSB9XG4gICAgOjotbW96LXNlbGVjdGlvbiB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfTtcbiAgICB9XG4gICAgOjpzZWxlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgfVxuICBgXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlOiB1cGRhdGUsXG4gIGNvbG9yc1xufVxuIiwiaW1wb3J0IGxheXpyIGZyb20gJ2xheXpyLmpzJ1xuaW1wb3J0IG9wZXJhdG9yIGZyb20gJ29wZXJhdG9yLmpzJ1xuLy8gaW1wb3J0IG9wZXJhdG9yIGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uLy4uL29wZXJhdG9yJ1xuXG4vKipcbiAqIFNlbmQgcGFnZSB2aWV3cyB0byBcbiAqIEdvb2dsZSBBbmFseXRpY3NcbiAqL1xuY29uc3QgZ2FUcmFja1BhZ2VWaWV3ID0gKHBhdGgsIHRpdGxlKSA9PiB7XG4gIGxldCBnYSA9IHdpbmRvdy5nYSA/IHdpbmRvdy5nYSA6IGZhbHNlXG5cbiAgaWYgKCFnYSkgcmV0dXJuXG5cbiAgZ2EoJ3NldCcsIHtwYWdlOiBwYXRoLCB0aXRsZTogdGl0bGV9KTtcbiAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbn1cblxuY29uc3QgaW1hZ2VzID0gbGF5enIoe30pXG5pbWFnZXMudXBkYXRlKCkuY2hlY2soKVxud2luZG93LmltYWdlcyA9IGltYWdlc1xuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCdcbn0pXG5cbmFwcC5vbignYWZ0ZXI6cm91dGUnLCAoeyByb3V0ZSwgdGl0bGUgfSkgPT4ge1xuICBnYVRyYWNrUGFnZVZpZXcocm91dGUsIHRpdGxlKVxuICBpbWFnZXMudXBkYXRlKCkuY2hlY2soKVxufSlcblxuYXBwLm9uKCdhZnRlcjp0cmFuc2l0aW9uJywgKCkgPT4gbG9hZGVyICYmIGxvYWRlci5lbmQoKSlcblxud2luZG93LmFwcCA9IGFwcFxuXG5leHBvcnQgZGVmYXVsdCBhcHBcbiJdfQ==
