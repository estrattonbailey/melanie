(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (element.matches(selector)) return element;
        element = element.parentNode;
    }
}

module.exports = closest;

},{}],2:[function(require,module,exports){
var closest = require('./closest');

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
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"./closest":1}],3:[function(require,module,exports){
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
},{"./transform-props":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cache = {};

exports.default = {
  set: function set(route, res) {
    cache = _extends({}, cache, _defineProperty({}, route, res));
  },
  get: function get(route) {
    return cache[route];
  },
  getCache: function getCache() {
    return cache;
  }
};
},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isDupe = function isDupe(script, existing) {
  var dupes = [];

  for (var i = 0; i < existing.length; i++) {
    script.isEqualNode(existing[i]) && dupes.push(i);
  }

  return dupes.length > 0;
};

exports.default = function (newDom, existingDom) {
  var existing = existingDom.getElementsByTagName('script');
  var scripts = newDom.getElementsByTagName('script');

  for (var i = 0; i < scripts.length; i++) {
    if (isDupe(scripts[i], existing)) {
      continue;
    }

    var s = document.createElement('script');
    var src = scripts[i].attributes.getNamedItem('src');

    if (src) {
      s.src = src.value;
    } else {
      s.innerHTML = scripts[i].innerHTML;
    }

    document.body.appendChild(s);
  }
};
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _delegate = require('delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _operator = require('./operator');

var _operator2 = _interopRequireDefault(_operator);

var _url = require('./url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var _ref$root = _ref.root,
      root = _ref$root === undefined ? document.body : _ref$root,
      _ref$duration = _ref.duration,
      duration = _ref$duration === undefined ? 0 : _ref$duration,
      _ref$handlers = _ref.handlers,
      handlers = _ref$handlers === undefined ? [] : _ref$handlers;

  /**
   * Instantiate
   */
  var operator = new _operator2.default({
    root: root,
    duration: duration,
    handlers: handlers
  });

  /**
   * Bootstrap
   */
  operator.setState({
    route: window.location.pathname + window.location.search,
    title: document.title
  });

  /**
   * Bind and validate all links
   */
  (0, _delegate2.default)(document, 'a', 'click', function (e) {
    var anchor = e.delegateTarget;
    var href = anchor.getAttribute('href') || '/';

    var internal = _url.link.isSameOrigin(href);
    var external = anchor.getAttribute('rel') === 'external';
    var disabled = anchor.classList.contains('no-ajax');
    var ignored = operator.validate(e, href);
    var hash = _url.link.isHash(href);

    if (!internal || external || disabled || ignored || hash) {
      return;
    }

    e.preventDefault();

    if (_url.link.isSameURL(href)) {
      return;
    }

    operator.go(href);

    return false;
  });

  /**
   * Handle popstate
   */
  window.onpopstate = function (e) {
    var href = e.target.location.href;

    if (operator.validate(e, href)) {
      if (_url.link.isHash(href)) {
        return;
      }

      return window.location.reload();
    }

    /**
     * Popstate bypasses router, so we
     * need to tell it where we went to
     * without pushing state
     */
    operator.go(href, null, true);
  };

  return operator;
};
},{"./operator":11,"./url":14,"delegate":2}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var activeLinks = [];

exports.default = function (route) {
  var regex = /^\/$/.test(route) ? RegExp(/^\/$/) : new RegExp(route);

  for (var i = 0; i < activeLinks.length; i++) {
    activeLinks[i].classList.remove('is-active');
  }

  activeLinks = Array.prototype.slice.call(document.querySelectorAll('[href$="' + route + '"]'));

  for (var _i = 0; _i < activeLinks.length; _i++) {
    if (regex.test(activeLinks[_i].href)) {
      activeLinks[_i].classList.add('is-active');
    }
  }
};
},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nanoajax = require('nanoajax');

var _nanoajax2 = _interopRequireDefault(_nanoajax);

var _navigo = require('navigo');

var _navigo2 = _interopRequireDefault(_navigo);

var _scrollRestoration = require('scroll-restoration');

var _scrollRestoration2 = _interopRequireDefault(_scrollRestoration);

var _loop = require('loop.js');

var _loop2 = _interopRequireDefault(_loop);

var _url = require('./url');

var _links = require('./links');

var _links2 = _interopRequireDefault(_links);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var router = new _navigo2.default(_url.origin);

var Operator = function () {
  function Operator(config) {
    _classCallCheck(this, Operator);

    var events = (0, _loop2.default)();

    this.config = config;

    // create curried render function
    this.render = (0, _render2.default)(document.querySelector(config.root), config, events.emit);

    Object.assign(this, events);
  }

  _createClass(Operator, [{
    key: 'stop',
    value: function stop() {
      _state2.default.paused = true;
    }
  }, {
    key: 'start',
    value: function start() {
      _state2.default.paused = false;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return _state2.default._state;
    }
  }, {
    key: 'setState',
    value: function setState(_ref) {
      var route = _ref.route,
          title = _ref.title;

      _state2.default.route = route === '' ? '/' : route;
      title ? _state2.default.title = title : null;

      (0, _links2.default)(_state2.default.route);

      document.title = title;
    }

    /**
     * @param {string} href
     * @param {function} cb
     * @param {boolean} resolve Use Navigo.resolve(), bypass Navigo.navigate()
     *
     * Popstate changes the URL for us, so if we were to
     * router.navigate() to the previous location, it would push
     * a duplicate route to history and we would create a loop.
     *
     * router.resolve() let's Navigo know we've moved, without
     * altering history.
     */

  }, {
    key: 'go',
    value: function go(href) {
      var _this = this;

      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var resolve = arguments[2];

      if (_state2.default.paused) {
        return;
      }

      var callback = function callback(title) {
        var res = {
          title: title,
          route: route
        };

        resolve ? router.resolve(route) : router.navigate(route);

        _scrollRestoration2.default.restore();

        _this.setState(res);

        _this.emit('route:after', res);

        if (cb) {
          cb(res);
        }
      };

      var route = (0, _url.sanitize)(href);

      if (!resolve) {
        _scrollRestoration2.default.save();
      }

      var cached = _cache2.default.get(route);

      this.emit('route:before', { route: route });

      if (cached) {
        return this.render(route, cached, callback);
      }

      this.get(route, callback);
    }
  }, {
    key: 'get',
    value: function get(route, cb) {
      var _this2 = this;

      return _nanoajax2.default.ajax({
        method: 'GET',
        url: _url.origin + '/' + route
      }, function (status, res, req) {
        if (req.status < 200 || req.status > 300 && req.status !== 304) {
          window.location = _url.origin + '/' + _state2.default.prev.route;
          return;
        }

        _cache2.default.set(route, req.response);

        _this2.render(route, req.response, cb);
      });
    }
  }, {
    key: 'push',
    value: function push() {
      var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _state2.default.title;

      if (!route) {
        return;
      }

      router.navigate(route);
      this.setState({ route: route, title: title });
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this3 = this;

      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var href = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _state2.default.route;

      var route = (0, _url.sanitize)(href);

      return this.config.handlers.filter(function (t) {
        if (Array.isArray(t)) {
          var res = t[1](route);
          if (res) {
            _this3.emit(t[0], {
              route: route,
              event: event
            });
          }
          return res;
        } else {
          return t(route);
        }
      }).length > 0;
    }
  }]);

  return Operator;
}();

exports.default = Operator;
},{"./cache":7,"./links":10,"./render":12,"./state":13,"./url":14,"loop.js":15,"nanoajax":5,"navigo":6,"scroll-restoration":17}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tarry = require('tarry.js');

var _eval = require('./eval.js');

var _eval2 = _interopRequireDefault(_eval);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parser = new window.DOMParser();

/**
 * @param {string} html Stringified HTML
 * @return {object} DOM node, #page
 */
var parseResponse = function parseResponse(html) {
  return parser.parseFromString(html, 'text/html');
};

/**
 * @param {object} page Root application DOM node
 * @param {object} config Duration and root node selector
 * @param {function} emit Emitter function from Operator instance
 * @return {function}
 *
 * @param {string} markup New markup from AJAX response
 * @param {function} cb Optional callback
 */

exports.default = function (page, _ref, emit) {
  var duration = _ref.duration,
      root = _ref.root;
  return function (route, markup, cb) {
    var res = parseResponse(markup);
    var title = res.title;

    var start = (0, _tarry.tarry)(function () {
      emit('transition:before', { route: route });
      document.documentElement.classList.add('is-transitioning');
      page.style.height = page.clientHeight + 'px';
    });

    var render = (0, _tarry.tarry)(function () {
      page.innerHTML = res.querySelector(root).innerHTML;
      (0, _eval2.default)(res, document);
    });

    var end = (0, _tarry.tarry)(function () {
      cb(title);
      page.style.height = '';
      document.documentElement.classList.remove('is-transitioning');
      emit('transition:after', { route: route });
    });

    (0, _tarry.queue)(start(0), render(duration), end(0))();
  };
};
},{"./eval.js":8,"tarry.js":18}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  paused: false,
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
  },
  get title() {
    return this._state.title;
  },
  set title(val) {
    this._state.prev.title = this.title;
    this._state.title = val;
  },
  get prev() {
    return this._state.prev;
  }
};
},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getOrigin = function getOrigin(location) {
  var protocol = location.protocol,
      host = location.host;

  return protocol + '//' + host;
};

var parseURL = function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a;
};

var origin = exports.origin = getOrigin(window.location);

var originRegEx = new RegExp(origin);

/**
 * @param {string} url Raw URL to parse
 * @return {string} URL sans origin and sans leading slash
 */
var sanitize = exports.sanitize = function sanitize(url) {
  var route = url.replace(originRegEx, '');
  return route.match(/^\//) ? route.replace(/\/{1}/, '') : route; // remove / and return
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
    return window.location.search === parseURL(href).search && window.location.pathname === parseURL(href).pathname;
  }
};
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var scroll=function(a){return window.scrollTo(0,a)},state=function(){return history.state?history.state.scrollPosition:0},save=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null;window.history.replaceState({scrollPosition:a||window.pageYOffset||window.scrollY},'')},restore=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null,b=state();a?a(b):scroll(b)},init=function(){'scrollRestoration'in history&&(history.scrollRestoration='manual',scroll(state()),window.onbeforeunload=function(){return save()})};exports.default='undefined'==typeof window?{}:{init:init,save:save,restore:restore,state:state};
},{}],18:[function(require,module,exports){
function next(args){
  args.length > 0 && args.shift().apply(this, args)
}

function run(cb, args){
  cb()
  next(args)
}

function tarry(cb, delay){
  return function(){
    var args = [].slice.call(arguments)
    var override = args[0]
    
    if ('number' === typeof override){
      return tarry(cb, override)
    }
    
    'number' === typeof delay ? (
      setTimeout(function(){
        run(cb, args)
      }, delay) 
    ) : (
      run(cb, args)
    )
  }
}

function queue(){
  var args = [].slice.call(arguments)
  return tarry(function(){
    next(args.slice(0))
  })
}

module.exports = exports = {
  tarry: tarry,
  queue: queue
}

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  id: 1,
  prompt: 'Hi! What brings you to this corner of the web?',
  answers: [{
    value: 'Who are you?',
    next: 2
  }, {
    value: 'I\'m hiring.',
    next: 3
  }, {
    value: 'It\'s your mother.',
    next: 4
  }, {
    value: 'Funny jokes, plz.',
    next: 5
  }]
}, {
  id: 2,
  prompt: 'I\'m Melanie \u2013 a graphic designer working in experiential marketing & proud Iowan trying to eat ALL the BLTs.',
  answers: [{
    value: 'What\'s experiential?',
    next: 6
  }, {
    value: 'What\'s a BLT?',
    next: 7
  }]
}, {
  id: 3,
  prompt: 'Rad. Can I show you some projects I\'ve worked on?',
  answers: [{
    value: 'Yes, please!',
    next: '/work'
  }, {
    value: 'Nah, tell me about you.',
    next: '/about'
  }, {
    value: 'I\'ll email you instead.',
    next: '/contact'
  }]
}, {
  id: 4,
  prompt: 'Hi Mom. I love you!',
  answers: [{
    value: 'JK, not your mom.',
    next: 9
  }, {
    value: 'What does \'JK\' mean?',
    next: 15
  }]
}, {
  id: 5,
  prompt: 'What\'s funnier than a rhetorical question?',
  answers: [{
    value: 'Yes',
    next: 10
  }, {
    value: 'No',
    next: 'https://media.giphy.com/media/10tD7GP9lHfaPC/giphy.gif'
  }]
}, {
  id: 6,
  prompt: 'Experiential marketing engages directly with consumers. Examples? Pop-up shops, stunts, or simple street teams distributing samples.',
  answers: [{
    value: 'Sounds cool. What have you done?',
    next: '/work'
  }, {
    value: 'Why do you like it?',
    next: 11
  }]
}, {
  id: 7,
  prompt: 'You tell me.',
  answers: [{
    value: 'Beef Liver Toast',
    next: 'https://media.giphy.com/media/oFOs10SJSnzos/giphy.gif'
  }, {
    value: 'Berry Lemon Tart',
    next: 'https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif'
  }, {
    value: 'Bacon Lettuce Tomato',
    next: 'https://media.giphy.com/media/fqzxcmlY7opOg/giphy.gif'
  }]
}, {
  id: 9,
  prompt: 'Clicking for fun? Good luck with this one.',
  answers: [{
    value: 'Blue Pill',
    next: 'https://media.giphy.com/media/G7GNoaUSH7sMU/giphy.gif'
  }, {
    value: 'Red Pill',
    next: 'https://media.giphy.com/media/UjujGY3mA3Jle/giphy.gif'
  }]
}, {
  id: 10,
  prompt: 'Pancakes or waffles?',
  answers: [{
    value: 'French Toast',
    next: 'https://media.giphy.com/media/Y8cdPle4eIyPu/giphy.gif'
  }]
}, {
  id: 11,
  prompt: 'There are a number of reasons, but a major hook is the challenge to consistently create ways to surprise and delight.',
  answers: [{
    value: 'What are your favorite projects?',
    next: '/work'
  }, {
    value: 'I have questions! Can I email you?',
    next: '/contact'
  }]
}, {
  id: 15,
  prompt: 'It is you, Mom!',
  answers: [{
    value: 'Yippee!',
    next: 'https://media.giphy.com/media/krewXUB6LBja/giphy.gif'
  }]
}];

},{}],21:[function(require,module,exports){
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
  var prompt = _ref.prompt,
      answers = _ref.answers;

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

},{"../lib/colors":25,"h0":3}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tarry = require('tarry.js');

exports.default = function () {
  var loaded = false;

  var modal = document.getElementById('gif');
  var img = modal.getElementsByTagName('img')[0];

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

    modal.style.display = 'block';

    lazy(url, function (url) {
      loaded = true;
      img.src = url;
      img.style.display = 'block';
      window.loader.end();
    });
  };

  var close = function close() {
    loaded = false;
    modal.style.display = 'none';
    img.style.display = 'none';
  };

  modal.onclick = function () {
    return loaded ? close() : null;
  };

  return {
    open: open,
    close: close
  };
};

},{"tarry.js":18}],23:[function(require,module,exports){
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
_router2.default.on('route:after', function (_ref) {
  var route = _ref.route;

  if (route === '' || /(^\/|\/#[0-9]|#[0-9])/.test(route)) {
    update(data.getActive());
  }
});

exports.default = function () {
  prev = render(data.getActive());
};

},{"../lib/router":27,"./data":19,"./data/index.js":20,"./elements":21,"./giffer":22}],24:[function(require,module,exports){
'use strict';

var _putz = require('putz');

var _putz2 = _interopRequireDefault(_putz);

var _router = require('./lib/router');

var _router2 = _interopRequireDefault(_router);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _colors = require('./lib/colors');

var _colors2 = _interopRequireDefault(_colors);

var _contact = require('./lib/contact');

var _contact2 = _interopRequireDefault(_contact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loader = window.loader = (0, _putz2.default)(document.body, {
  speed: 100,
  trickle: 10
});

window.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('toggle');
  var menu = document.getElementById('menu');

  var menuToggle = function menuToggle(close) {
    var open = menu.classList.contains('is-visible');
    menu.classList[open || close ? 'remove' : 'add']('is-visible');
    toggle.classList[open || close ? 'remove' : 'add']('is-active');
  };

  toggle.addEventListener('click', function (e) {
    menuToggle();
  });

  (0, _app2.default)();

  _router2.default.on('route:after', function (_ref) {
    var route = _ref.route;

    _colors2.default.update();

    if (/contact/.test(route)) {
      (0, _contact2.default)();
    }

    menuToggle(true);
  });

  if (/contact/.test(window.location.pathname)) {
    (0, _contact2.default)();
  }

  _colors2.default.update();
});

},{"./app":23,"./lib/colors":25,"./lib/contact":26,"./lib/router":27,"putz":16}],25:[function(require,module,exports){
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

  rootStyle.innerHTML = '\n    body { color: ' + color + ' }\n    ::-moz-selection {\n      background-color: ' + color + ';\n    }\n    ::selection {\n      background-color: ' + color + ';\n    }\n    .theme a {\n      color: ' + color + '\n    }\n  ';
};

exports.default = {
  update: update,
  colors: colors
};

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _subjectlines = require('./subjectlines');

var _subjectlines2 = _interopRequireDefault(_subjectlines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var min = 0;
var max = _subjectlines2.default.length - 1;
var current = 0;

var copyToClipboard = function copyToClipboard(msg) {
  try {
    var text = document.createElement('textarea');
    text.innerHTML = msg;
    text.style.cssText = 'position: absolute; left: -9999px;';
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
  } catch (err) {
    window.prompt('Press Cmd+C or Ctrl+C to copy to clipboard.', msg);
  }
};

function clamp(val) {
  var _val = void 0;

  if (val >= min && val <= max) {
    _val = val;
  } else if (val >= max) {
    _val = min;
  } else if (val <= min) {
    _val = max;
  }

  return _val;
}

exports.default = function () {
  var subject = document.getElementById('subjectLine');
  var next = document.getElementById('nextSubject');
  var prompt = document.getElementById('prompt');

  subject.innerHTML = _subjectlines2.default[current];

  next.addEventListener('click', function (e) {
    e.preventDefault();

    prompt.innerHTML = '(click to copy)';
    current = clamp(++current);
    subject.innerHTML = _subjectlines2.default[current];
    next.blur();
  });

  subject.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(subject.innerHTML);
    prompt.innerHTML = 'copied!';
    return false;
  });
};

},{"./subjectlines":28}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _operator = require('operator.js');

var _operator2 = _interopRequireDefault(_operator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var app = (0, _operator2.default)({
  root: '#root'
});

app.on('route:after', function (_ref) {
  var route = _ref.route,
      title = _ref.title;

  gaTrackPageView(route, title);
});

app.on('transition:after', function () {
  return loader && loader.end();
});

window.app = app;

exports.default = app;

},{"operator.js":9}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ["10 Reasons to Open This Email (Open To Find Out!)", "FREE JELLY BEANS!", "Re: Trademark Request for \"Neato Burrito\"", "Application Accepted \u2013 Cheesecake Club of America", "Casting Call \u2013 Seeking Actress To Play Rose in Titanic Reboot", "Amazing Product! Change Your Inner Monologue's Voice to James Earl Jones!", "[NOTIFICATION] - New Post in Forum \"Why Was E.T. So Creepy?\"", "Highly Reputable Science Magazine: French Fries are the New Superfood", "Fw: Fw: Fw: Fw: omg omg omg check this out rn!", "Never Gonna Give You Up, Never Gonna Let You Down, Never Gonna Run Around and...", "Your Weird Dreams Explained: No, You Shouldn't Get a Pet Panda", "Forward 2 10 ppl or u will drown in confetti 4 real", "President Barack Obama's Favorite Cat Videos", "The Results Are In! You are 96% Liz Lemon", "Mmmbop, Ba Duba Dop, Ba Du Bop, Ba Duba Dop", "~*~ rEmEmBeR tYpInG sHiT lIkE tHiS ~*~"];

},{}]},{},[24])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2Nsb3Nlc3QuanMiLCJub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaDAvZGlzdC90cmFuc2Zvcm0tcHJvcHMuanMiLCJub2RlX21vZHVsZXMvbmFub2FqYXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCJub2RlX21vZHVsZXMvb3BlcmF0b3IuanMvZGlzdC9jYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9vcGVyYXRvci5qcy9kaXN0L2V2YWwuanMiLCJub2RlX21vZHVsZXMvb3BlcmF0b3IuanMvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVyYXRvci5qcy9kaXN0L2xpbmtzLmpzIiwibm9kZV9tb2R1bGVzL29wZXJhdG9yLmpzL2Rpc3Qvb3BlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvb3BlcmF0b3IuanMvZGlzdC9yZW5kZXIuanMiLCJub2RlX21vZHVsZXMvb3BlcmF0b3IuanMvZGlzdC9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9vcGVyYXRvci5qcy9kaXN0L3VybC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVyYXRvci5qcy9ub2RlX21vZHVsZXMvbG9vcC5qcy9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3B1dHovaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2Nyb2xsLXJlc3RvcmF0aW9uL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGFycnkuanMvaW5kZXguanMiLCJzcmMvanMvYXBwL2RhdGEuanMiLCJzcmMvanMvYXBwL2RhdGEvaW5kZXguanMiLCJzcmMvanMvYXBwL2VsZW1lbnRzLmpzIiwic3JjL2pzL2FwcC9naWZmZXIuanMiLCJzcmMvanMvYXBwL2luZGV4LmpzIiwic3JjL2pzL2luZGV4LmpzIiwic3JjL2pzL2xpYi9jb2xvcnMuanMiLCJzcmMvanMvbGliL2NvbnRhY3QuanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyIsInNyYy9qcy9saWIvc3ViamVjdGxpbmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFzQjtBQUFBLE1BQW5CLEtBQW1CLFFBQW5CLEtBQW1CO0FBQUEsTUFBWixLQUFZLFFBQVosS0FBWTs7QUFDMUMsa0JBQWdCLEtBQWhCLEVBQXVCLEtBQXZCO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJLEVBQUosQ0FBTyxrQkFBUCxFQUEyQjtBQUFBLFNBQU0sVUFBVSxPQUFPLEdBQVAsRUFBaEI7QUFBQSxDQUEzQjs7QUFFQSxPQUFPLEdBQVAsR0FBYSxHQUFiOztrQkFFZSxHOzs7Ozs7OztrQkMzQkEsczRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBET0NVTUVOVF9OT0RFX1RZUEUgPSA5O1xuXG4vKipcbiAqIEEgcG9seWZpbGwgZm9yIEVsZW1lbnQubWF0Y2hlcygpXG4gKi9cbmlmICh0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcbiAgICB2YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuICAgIHByb3RvLm1hdGNoZXMgPSBwcm90by5tYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm9NYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBjbG9zZXN0IHBhcmVudCB0aGF0IG1hdGNoZXMgYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGNsb3Nlc3QgKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSAhPT0gRE9DVU1FTlRfTk9ERV9UWVBFKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBsaXN0ZW5lckZuID0gbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEZpbmRzIGNsb3Nlc3QgbWF0Y2ggYW5kIGludm9rZXMgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGxpc3RlbmVyKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3Rvcik7XG5cbiAgICAgICAgaWYgKGUuZGVsZWdhdGVUYXJnZXQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZWxlbWVudCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3RyYW5zZm9ybVByb3BzID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0tcHJvcHMnKTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFuc2Zvcm1Qcm9wcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBoID0gZnVuY3Rpb24gaCh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID8gYXBwbHlQcm9wcyh0YWcpKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgOiBhcHBlbmRDaGlsZHJlbih0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5cbnZhciBpc09iaiA9IGZ1bmN0aW9uIGlzT2JqKG8pIHtcbiAgcmV0dXJuIG8gIT09IG51bGwgJiYgKHR5cGVvZiBvID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvKSkgPT09ICdvYmplY3QnO1xufTtcblxudmFyIGlzUHJvcHMgPSBmdW5jdGlvbiBpc1Byb3BzKGFyZykge1xuICByZXR1cm4gaXNPYmooYXJnKSAmJiAhKGFyZyBpbnN0YW5jZW9mIEVsZW1lbnQpO1xufTtcblxudmFyIGFwcGx5UHJvcHMgPSBmdW5jdGlvbiBhcHBseVByb3BzKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIGgodGFnKShPYmplY3QuYXNzaWduKHt9LCBwcm9wcywgYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbCA9IGgodGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICB2YXIgcCA9ICgwLCBfdHJhbnNmb3JtUHJvcHMyLmRlZmF1bHQpKHByb3BzKTtcbiAgICAgIE9iamVjdC5rZXlzKHApLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKC9eb24vLnRlc3QoaykpIHtcbiAgICAgICAgICBlbFtrXSA9IHBba107XG4gICAgICAgIH0gZWxzZSBpZiAoayA9PT0gJ19faHRtbCcpIHtcbiAgICAgICAgICBlbC5pbm5lckhUTUwgPSBwW2tdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrLCBwW2tdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgfTtcbn07XG5cbnZhciBhcHBlbmRDaGlsZHJlbiA9IGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjaGlsZHJlbiA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgY2hpbGRyZW5bX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgaW5zdGFuY2VvZiBFbGVtZW50ID8gYyA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGMpO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBlbC5hcHBlbmRDaGlsZChjKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWw7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBoOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBrZWJhYiA9IGV4cG9ydHMua2ViYWIgPSBmdW5jdGlvbiBrZWJhYihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgcmV0dXJuICctJyArIGcudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59O1xuXG52YXIgcGFyc2VWYWx1ZSA9IGV4cG9ydHMucGFyc2VWYWx1ZSA9IGZ1bmN0aW9uIHBhcnNlVmFsdWUocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IGFkZFB4KHByb3ApKHZhbCkgOiB2YWw7XG4gIH07XG59O1xuXG52YXIgdW5pdGxlc3NQcm9wZXJ0aWVzID0gZXhwb3J0cy51bml0bGVzc1Byb3BlcnRpZXMgPSBbJ2xpbmVIZWlnaHQnLCAnZm9udFdlaWdodCcsICdvcGFjaXR5JywgJ3pJbmRleCdcbi8vIFByb2JhYmx5IG5lZWQgYSBmZXcgbW9yZS4uLlxuXTtcblxudmFyIGFkZFB4ID0gZXhwb3J0cy5hZGRQeCA9IGZ1bmN0aW9uIGFkZFB4KHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdW5pdGxlc3NQcm9wZXJ0aWVzLmluY2x1ZGVzKHByb3ApID8gdmFsIDogdmFsICsgJ3B4JztcbiAgfTtcbn07XG5cbnZhciBmaWx0ZXJOdWxsID0gZXhwb3J0cy5maWx0ZXJOdWxsID0gZnVuY3Rpb24gZmlsdGVyTnVsbChvYmopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV0gIT09IG51bGw7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlRGVjID0gZXhwb3J0cy5jcmVhdGVEZWMgPSBmdW5jdGlvbiBjcmVhdGVEZWMoc3R5bGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2ViYWIoa2V5KSArICc6JyArIHBhcnNlVmFsdWUoa2V5KShzdHlsZVtrZXldKTtcbiAgfTtcbn07XG5cbnZhciBzdHlsZVRvU3RyaW5nID0gZXhwb3J0cy5zdHlsZVRvU3RyaW5nID0gZnVuY3Rpb24gc3R5bGVUb1N0cmluZyhzdHlsZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGUpLmZpbHRlcihmaWx0ZXJOdWxsKHN0eWxlKSkubWFwKGNyZWF0ZURlYyhzdHlsZSkpLmpvaW4oJzsnKTtcbn07XG5cbnZhciBpc1N0eWxlT2JqZWN0ID0gZXhwb3J0cy5pc1N0eWxlT2JqZWN0ID0gZnVuY3Rpb24gaXNTdHlsZU9iamVjdChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPT09ICdzdHlsZScgJiYgcHJvcHNba2V5XSAhPT0gbnVsbCAmJiBfdHlwZW9mKHByb3BzW2tleV0pID09PSAnb2JqZWN0JztcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVTdHlsZSA9IGV4cG9ydHMuY3JlYXRlU3R5bGUgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZShwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBpc1N0eWxlT2JqZWN0KHByb3BzKShrZXkpID8gc3R5bGVUb1N0cmluZyhwcm9wc1trZXldKSA6IHByb3BzW2tleV07XG4gIH07XG59O1xuXG52YXIgcmVkdWNlUHJvcHMgPSBleHBvcnRzLnJlZHVjZVByb3BzID0gZnVuY3Rpb24gcmVkdWNlUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhLCBrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhLCBfZGVmaW5lUHJvcGVydHkoe30sIGtleSwgY3JlYXRlU3R5bGUocHJvcHMpKGtleSkpKTtcbiAgfTtcbn07XG5cbnZhciB0cmFuc2Zvcm1Qcm9wcyA9IGV4cG9ydHMudHJhbnNmb3JtUHJvcHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShyZWR1Y2VQcm9wcyhwcm9wcyksIHt9KTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zZm9ybVByb3BzOyIsIi8vIEJlc3QgcGxhY2UgdG8gZmluZCBpbmZvcm1hdGlvbiBvbiBYSFIgZmVhdHVyZXMgaXM6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3RcblxudmFyIHJlcWZpZWxkcyA9IFtcbiAgJ3Jlc3BvbnNlVHlwZScsICd3aXRoQ3JlZGVudGlhbHMnLCAndGltZW91dCcsICdvbnByb2dyZXNzJ1xuXVxuXG4vLyBTaW1wbGUgYW5kIHNtYWxsIGFqYXggZnVuY3Rpb25cbi8vIFRha2VzIGEgcGFyYW1ldGVycyBvYmplY3QgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb25cbi8vIFBhcmFtZXRlcnM6XG4vLyAgLSB1cmw6IHN0cmluZywgcmVxdWlyZWRcbi8vICAtIGhlYWRlcnM6IG9iamVjdCBvZiBge2hlYWRlcl9uYW1lOiBoZWFkZXJfdmFsdWUsIC4uLn1gXG4vLyAgLSBib2R5OlxuLy8gICAgICArIHN0cmluZyAoc2V0cyBjb250ZW50IHR5cGUgdG8gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgaWYgbm90IHNldCBpbiBoZWFkZXJzKVxuLy8gICAgICArIEZvcm1EYXRhIChkb2Vzbid0IHNldCBjb250ZW50IHR5cGUgc28gdGhhdCBicm93c2VyIHdpbGwgc2V0IGFzIGFwcHJvcHJpYXRlKVxuLy8gIC0gbWV0aG9kOiAnR0VUJywgJ1BPU1QnLCBldGMuIERlZmF1bHRzIHRvICdHRVQnIG9yICdQT1NUJyBiYXNlZCBvbiBib2R5XG4vLyAgLSBjb3JzOiBJZiB5b3VyIHVzaW5nIGNyb3NzLW9yaWdpbiwgeW91IHdpbGwgbmVlZCB0aGlzIHRydWUgZm9yIElFOC05XG4vL1xuLy8gVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgb250byB0aGUgeGhyIG9iamVjdC5cbi8vIElNUE9SVEFOVCBOT1RFOiBUaGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb21wYXRpYmlsaXR5IGNoZWNraW5nLlxuLy8gIC0gcmVzcG9uc2VUeXBlOiBzdHJpbmcsIHZhcmlvdXMgY29tcGF0YWJpbGl0eSwgc2VlIHhociBkb2NzIGZvciBlbnVtIG9wdGlvbnNcbi8vICAtIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbiwgSUUxMCssIENPUlMgb25seVxuLy8gIC0gdGltZW91dDogbG9uZywgbXMgdGltZW91dCwgSUU4K1xuLy8gIC0gb25wcm9ncmVzczogY2FsbGJhY2ssIElFMTArXG4vL1xuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gcHJvdG90eXBlOlxuLy8gIC0gc3RhdHVzQ29kZSBmcm9tIHJlcXVlc3Rcbi8vICAtIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlc3BvbnNlVHlwZSBzZXQgYW5kIHN1cHBvcnRlZCBieSBicm93c2VyLCB0aGlzIGlzIGFuIG9iamVjdCBvZiBzb21lIHR5cGUgKHNlZSBkb2NzKVxuLy8gICAgKyBvdGhlcndpc2UgaWYgcmVxdWVzdCBjb21wbGV0ZWQsIHRoaXMgaXMgdGhlIHN0cmluZyB0ZXh0IG9mIHRoZSByZXNwb25zZVxuLy8gICAgKyBpZiByZXF1ZXN0IGlzIGFib3J0ZWQsIHRoaXMgaXMgXCJBYm9ydFwiXG4vLyAgICArIGlmIHJlcXVlc3QgdGltZXMgb3V0LCB0aGlzIGlzIFwiVGltZW91dFwiXG4vLyAgICArIGlmIHJlcXVlc3QgZXJyb3JzIGJlZm9yZSBjb21wbGV0aW5nIChwcm9iYWJseSBhIENPUlMgaXNzdWUpLCB0aGlzIGlzIFwiRXJyb3JcIlxuLy8gIC0gcmVxdWVzdCBvYmplY3Rcbi8vXG4vLyBSZXR1cm5zIHRoZSByZXF1ZXN0IG9iamVjdC4gU28geW91IGNhbiBjYWxsIC5hYm9ydCgpIG9yIG90aGVyIG1ldGhvZHNcbi8vXG4vLyBERVBSRUNBVElPTlM6XG4vLyAgLSBQYXNzaW5nIGEgc3RyaW5nIGluc3RlYWQgb2YgdGhlIHBhcmFtcyBvYmplY3QgaGFzIGJlZW4gcmVtb3ZlZCFcbi8vXG5leHBvcnRzLmFqYXggPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAvLyBBbnkgdmFyaWFibGUgdXNlZCBtb3JlIHRoYW4gb25jZSBpcyB2YXInZCBoZXJlIGJlY2F1c2VcbiAgLy8gbWluaWZpY2F0aW9uIHdpbGwgbXVuZ2UgdGhlIHZhcmlhYmxlcyB3aGVyZWFzIGl0IGNhbid0IG11bmdlXG4gIC8vIHRoZSBvYmplY3QgYWNjZXNzLlxuICB2YXIgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzIHx8IHt9XG4gICAgLCBib2R5ID0gcGFyYW1zLmJvZHlcbiAgICAsIG1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgKGJvZHkgPyAnUE9TVCcgOiAnR0VUJylcbiAgICAsIGNhbGxlZCA9IGZhbHNlXG5cbiAgdmFyIHJlcSA9IGdldFJlcXVlc3QocGFyYW1zLmNvcnMpXG5cbiAgZnVuY3Rpb24gY2Ioc3RhdHVzQ29kZSwgcmVzcG9uc2VUZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IHN0YXR1c0NvZGUgOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICByZXEuc3RhdHVzID09PSAwID8gXCJFcnJvclwiIDogKHJlcS5yZXNwb25zZSB8fCByZXEucmVzcG9uc2VUZXh0IHx8IHJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgIHJlcSlcbiAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSlcblxuICB2YXIgc3VjY2VzcyA9IHJlcS5vbmxvYWQgPSBjYigyMDApXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSBzdWNjZXNzKClcbiAgfVxuICByZXEub25lcnJvciA9IGNiKG51bGwsICdFcnJvcicpXG4gIHJlcS5vbnRpbWVvdXQgPSBjYihudWxsLCAnVGltZW91dCcpXG4gIHJlcS5vbmFib3J0ID0gY2IobnVsbCwgJ0Fib3J0JylcblxuICBpZiAoYm9keSkge1xuICAgIHNldERlZmF1bHQoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKVxuXG4gICAgaWYgKCFnbG9iYWwuRm9ybURhdGEgfHwgIShib2R5IGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSkge1xuICAgICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcWZpZWxkcy5sZW5ndGgsIGZpZWxkOyBpIDwgbGVuOyBpKyspIHtcbiAgICBmaWVsZCA9IHJlcWZpZWxkc1tpXVxuICAgIGlmIChwYXJhbXNbZmllbGRdICE9PSB1bmRlZmluZWQpXG4gICAgICByZXFbZmllbGRdID0gcGFyYW1zW2ZpZWxkXVxuICB9XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gaGVhZGVycylcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgaGVhZGVyc1tmaWVsZF0pXG5cbiAgcmVxLnNlbmQoYm9keSlcblxuICByZXR1cm4gcmVxXG59XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoY29ycykge1xuICAvLyBYRG9tYWluUmVxdWVzdCBpcyBvbmx5IHdheSB0byBkbyBDT1JTIGluIElFIDggYW5kIDlcbiAgLy8gQnV0IFhEb21haW5SZXF1ZXN0IGlzbid0IHN0YW5kYXJkcy1jb21wYXRpYmxlXG4gIC8vIE5vdGFibHksIGl0IGRvZXNuJ3QgYWxsb3cgY29va2llcyB0byBiZSBzZW50IG9yIHNldCBieSBzZXJ2ZXJzXG4gIC8vIElFIDEwKyBpcyBzdGFuZGFyZHMtY29tcGF0aWJsZSBpbiBpdHMgWE1MSHR0cFJlcXVlc3RcbiAgLy8gYnV0IElFIDEwIGNhbiBzdGlsbCBoYXZlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB1c2UgaXRcbiAgaWYgKGNvcnMgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICEvTVNJRSAxLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3RcbiAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdClcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHQob2JqLCBrZXksIHZhbHVlKSB7XG4gIG9ialtrZXldID0gb2JqW2tleV0gfHwgdmFsdWVcbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiTmF2aWdvXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdHZhciBQQVJBTUVURVJfUkVHRVhQID0gLyhbOipdKShcXHcrKS9nO1xuXHR2YXIgV0lMRENBUkRfUkVHRVhQID0gL1xcKi9nO1xuXHR2YXIgUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFAgPSAnKFteXFwvXSspJztcblx0dmFyIFJFUExBQ0VfV0lMRENBUkQgPSAnKD86LiopJztcblx0dmFyIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCA9ICcoPzpcXC8kfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0VXJsRGVwdGgodXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXC8kLywgJycpLnNwbGl0KCcvJykubGVuZ3RoO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjb21wYXJlVXJsRGVwdGgodXJsQSwgdXJsQikge1xuXHQgIHJldHVybiBnZXRVcmxEZXB0aCh1cmxBKSA8IGdldFVybERlcHRoKHVybEIpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwpIHtcblx0ICB2YXIgcm91dGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHJldHVybiByb3V0ZXMubWFwKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIF9yZXBsYWNlRHluYW1pY1VSTFBhciA9IHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHZhciByZWdleHAgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucmVnZXhwO1xuXHQgICAgdmFyIHBhcmFtTmFtZXMgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucGFyYW1OYW1lcztcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXhwKTtcblx0ICAgIHZhciBwYXJhbXMgPSByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgcGFyYW1OYW1lcyk7XG5cdFxuXHQgICAgcmV0dXJuIG1hdGNoID8geyBtYXRjaDogbWF0Y2gsIHJvdXRlOiByb3V0ZSwgcGFyYW1zOiBwYXJhbXMgfSA6IGZhbHNlO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbiAobSkge1xuXHQgICAgcmV0dXJuIG07XG5cdCAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIG1hdGNoKHVybCwgcm91dGVzKSB7XG5cdCAgcmV0dXJuIGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzKVswXSB8fCBmYWxzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcm9vdCh1cmwsIHJvdXRlcykge1xuXHQgIHZhciBtYXRjaGVkID0gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIHUgPSBjbGVhbihyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgcmV0dXJuIHUgIT09ICcnICYmIHUgIT09ICcqJztcblx0ICB9KSk7XG5cdCAgdmFyIGZhbGxiYWNrVVJMID0gY2xlYW4odXJsKTtcblx0XG5cdCAgaWYgKG1hdGNoZWQubGVuZ3RoID4gMCkge1xuXHQgICAgcmV0dXJuIG1hdGNoZWQubWFwKGZ1bmN0aW9uIChtKSB7XG5cdCAgICAgIHJldHVybiBjbGVhbih1cmwuc3Vic3RyKDAsIG0ubWF0Y2guaW5kZXgpKTtcblx0ICAgIH0pLnJlZHVjZShmdW5jdGlvbiAocm9vdCwgY3VycmVudCkge1xuXHQgICAgICByZXR1cm4gY3VycmVudC5sZW5ndGggPCByb290Lmxlbmd0aCA/IGN1cnJlbnQgOiByb290O1xuXHQgICAgfSwgZmFsbGJhY2tVUkwpO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsbGJhY2tVUkw7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCkge1xuXHQgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZW1vdmVHRVRQYXJhbXModXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXD8oLiopPyQvLCAnJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIE5hdmlnbyhyLCB1c2VIYXNoKSB7XG5cdCAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgdGhpcy5yb290ID0gdXNlSGFzaCAmJiByID8gci5yZXBsYWNlKC9cXC8kLywgJy8jJykgOiByIHx8IG51bGw7XG5cdCAgdGhpcy5fdXNlSGFzaCA9IHVzZUhhc2g7XG5cdCAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG5cdCAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG5cdCAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSBudWxsO1xuXHQgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX29rID0gIXVzZUhhc2ggJiYgaXNQdXNoU3RhdGVBdmFpbGFibGUoKTtcblx0ICB0aGlzLl9saXN0ZW4oKTtcblx0ICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXHR9XG5cdFxuXHROYXZpZ28ucHJvdG90eXBlID0ge1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIG1hdGNoOiBtYXRjaCxcblx0ICAgIHJvb3Q6IHJvb3QsXG5cdCAgICBjbGVhbjogY2xlYW5cblx0ICB9LFxuXHQgIG5hdmlnYXRlOiBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoLCBhYnNvbHV0ZSkge1xuXHQgICAgdmFyIHRvO1xuXHRcblx0ICAgIHBhdGggPSBwYXRoIHx8ICcnO1xuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHRvID0gKCFhYnNvbHV0ZSA/IHRoaXMuX2dldFJvb3QoKSArICcvJyA6ICcnKSArIGNsZWFuKHBhdGgpO1xuXHQgICAgICB0byA9IHRvLnJlcGxhY2UoLyhbXjpdKShcXC97Mix9KS9nLCAnJDEvJyk7XG5cdCAgICAgIGhpc3RvcnlbdGhpcy5fcGF1c2VkID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sICcnLCB0byk7XG5cdCAgICAgIHRoaXMucmVzb2x2ZSgpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyMoLiopJC8sICcnKSArICcjJyArIHBhdGg7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG9uOiBmdW5jdGlvbiBvbigpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoYXJncy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICB9IGVsc2UgaWYgKF90eXBlb2YoYXJnc1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHZhciBvcmRlcmVkUm91dGVzID0gT2JqZWN0LmtleXMoYXJnc1swXSkuc29ydChjb21wYXJlVXJsRGVwdGgpO1xuXHRcblx0ICAgICAgb3JkZXJlZFJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgICAgIF90aGlzLl9hZGQocm91dGUsIGFyZ3NbMF1bcm91dGVdKTtcblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gYXJnc1swXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgbm90Rm91bmQ6IGZ1bmN0aW9uIG5vdEZvdW5kKGhhbmRsZXIpIHtcblx0ICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IGhhbmRsZXI7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKGN1cnJlbnQpIHtcblx0ICAgIHZhciBoYW5kbGVyLCBtO1xuXHQgICAgdmFyIHVybCA9IChjdXJyZW50IHx8IHRoaXMuX2NMb2MoKSkucmVwbGFjZSh0aGlzLl9nZXRSb290KCksICcnKTtcblx0XG5cdCAgICBpZiAodGhpcy5fcGF1c2VkIHx8IHVybCA9PT0gdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLl91c2VIYXNoKSB7XG5cdCAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvIy8sICcvJyk7XG5cdCAgICB9XG5cdCAgICB1cmwgPSByZW1vdmVHRVRQYXJhbXModXJsKTtcblx0ICAgIG0gPSBtYXRjaCh1cmwsIHRoaXMuX3JvdXRlcyk7XG5cdFxuXHQgICAgaWYgKG0pIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIGhhbmRsZXIgPSBtLnJvdXRlLmhhbmRsZXI7XG5cdCAgICAgIG0ucm91dGUucm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgPyBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KG0ubWF0Y2guc2xpY2UoMSwgbS5tYXRjaC5sZW5ndGgpKSkgOiBoYW5kbGVyKG0ucGFyYW1zKTtcblx0ICAgICAgcmV0dXJuIG07XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX2RlZmF1bHRIYW5kbGVyICYmICh1cmwgPT09ICcnIHx8IHVybCA9PT0gJy8nKSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIoKTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX25vdEZvdW5kSGFuZGxlcikge1xuXHQgICAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9LFxuXHQgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cdCAgICBjbGVhclRpbWVvdXQodGhpcy5fbGlzdGVubmluZ0ludGVydmFsKTtcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm9ucG9wc3RhdGUgPSBudWxsIDogbnVsbDtcblx0ICB9LFxuXHQgIHVwZGF0ZVBhZ2VMaW5rczogZnVuY3Rpb24gdXBkYXRlUGFnZUxpbmtzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdFxuXHQgICAgdGhpcy5fZmluZExpbmtzKCkuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHQgICAgICBpZiAoIWxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCkge1xuXHQgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XG5cdCAgICAgICAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZCkge1xuXHQgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIHNlbGYubmF2aWdhdGUoY2xlYW4obG9jYXRpb24pKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgICBsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShuYW1lKSB7XG5cdCAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHJldHVybiB0aGlzLl9yb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHJvdXRlKSB7XG5cdCAgICAgIHZhciBrZXk7XG5cdFxuXHQgICAgICBpZiAocm91dGUubmFtZSA9PT0gbmFtZSkge1xuXHQgICAgICAgIHJlc3VsdCA9IHJvdXRlLnJvdXRlO1xuXHQgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc6JyArIGtleSwgZGF0YVtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sICcnKTtcblx0ICB9LFxuXHQgIGxpbms6IGZ1bmN0aW9uIGxpbmsocGF0aCkge1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFJvb3QoKSArIHBhdGg7XG5cdCAgfSxcblx0ICBwYXVzZTogZnVuY3Rpb24gcGF1c2Uoc3RhdHVzKSB7XG5cdCAgICB0aGlzLl9wYXVzZWQgPSBzdGF0dXM7XG5cdCAgfSxcblx0ICBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGU6IGZ1bmN0aW9uIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZSgpIHtcblx0ICAgIGlmICghaXNQdXNoU3RhdGVBdmFpbGFibGUoKSkge1xuXHQgICAgICB0aGlzLmRlc3Ryb3koKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9hZGQ6IGZ1bmN0aW9uIF9hZGQocm91dGUpIHtcblx0ICAgIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBpZiAoKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihoYW5kbGVyKSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyLnVzZXMsIG5hbWU6IGhhbmRsZXIuYXMgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLl9hZGQ7XG5cdCAgfSxcblx0ICBfZ2V0Um9vdDogZnVuY3Rpb24gX2dldFJvb3QoKSB7XG5cdCAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSByZXR1cm4gdGhpcy5yb290O1xuXHQgICAgdGhpcy5yb290ID0gcm9vdCh0aGlzLl9jTG9jKCksIHRoaXMuX3JvdXRlcyk7XG5cdCAgICByZXR1cm4gdGhpcy5yb290O1xuXHQgIH0sXG5cdCAgX2xpc3RlbjogZnVuY3Rpb24gX2xpc3RlbigpIHtcblx0ICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpczIucmVzb2x2ZSgpO1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgY2FjaGVkID0gX3RoaXMyLl9jTG9jKCksXG5cdCAgICAgICAgICAgIGN1cnJlbnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgICAgIF9jaGVjayA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgICAgX2NoZWNrID0gZnVuY3Rpb24gY2hlY2soKSB7XG5cdCAgICAgICAgICBjdXJyZW50ID0gX3RoaXMyLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzMi5yZXNvbHZlKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBfdGhpczIuX2xpc3Rlbm5pbmdJbnRlcnZhbCA9IHNldFRpbWVvdXQoX2NoZWNrLCAyMDApO1xuXHQgICAgICAgIH07XG5cdCAgICAgICAgX2NoZWNrKCk7XG5cdCAgICAgIH0pKCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfY0xvYzogZnVuY3Rpb24gX2NMb2MoKSB7XG5cdCAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0sXG5cdCAgX2ZpbmRMaW5rczogZnVuY3Rpb24gX2ZpbmRMaW5rcygpIHtcblx0ICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5hdmlnb10nKSk7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTmF2aWdvO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmF2aWdvLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgY2FjaGUgPSB7fTtcblxuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBzZXQ6IGZ1bmN0aW9uIHNldChyb3V0ZSwgcmVzKSB7XG4gICAgY2FjaGUgPSBfZXh0ZW5kcyh7fSwgY2FjaGUsIF9kZWZpbmVQcm9wZXJ0eSh7fSwgcm91dGUsIHJlcykpO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIGdldChyb3V0ZSkge1xuICAgIHJldHVybiBjYWNoZVtyb3V0ZV07XG4gIH0sXG4gIGdldENhY2hlOiBmdW5jdGlvbiBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4gY2FjaGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGlzRHVwZSA9IGZ1bmN0aW9uIGlzRHVwZShzY3JpcHQsIGV4aXN0aW5nKSB7XG4gIHZhciBkdXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZXhpc3RpbmcubGVuZ3RoOyBpKyspIHtcbiAgICBzY3JpcHQuaXNFcXVhbE5vZGUoZXhpc3RpbmdbaV0pICYmIGR1cGVzLnB1c2goaSk7XG4gIH1cblxuICByZXR1cm4gZHVwZXMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChuZXdEb20sIGV4aXN0aW5nRG9tKSB7XG4gIHZhciBleGlzdGluZyA9IGV4aXN0aW5nRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgdmFyIHNjcmlwdHMgPSBuZXdEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0R1cGUoc2NyaXB0c1tpXSwgZXhpc3RpbmcpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHZhciBzcmMgPSBzY3JpcHRzW2ldLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdzcmMnKTtcblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHMuc3JjID0gc3JjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzLmlubmVySFRNTCA9IHNjcmlwdHNbaV0uaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocyk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxudmFyIF9kZWxlZ2F0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWxlZ2F0ZSk7XG5cbnZhciBfb3BlcmF0b3IgPSByZXF1aXJlKCcuL29wZXJhdG9yJyk7XG5cbnZhciBfb3BlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3BlcmF0b3IpO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciBfcmVmJHJvb3QgPSBfcmVmLnJvb3QsXG4gICAgICByb290ID0gX3JlZiRyb290ID09PSB1bmRlZmluZWQgPyBkb2N1bWVudC5ib2R5IDogX3JlZiRyb290LFxuICAgICAgX3JlZiRkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICBkdXJhdGlvbiA9IF9yZWYkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IDAgOiBfcmVmJGR1cmF0aW9uLFxuICAgICAgX3JlZiRoYW5kbGVycyA9IF9yZWYuaGFuZGxlcnMsXG4gICAgICBoYW5kbGVycyA9IF9yZWYkaGFuZGxlcnMgPT09IHVuZGVmaW5lZCA/IFtdIDogX3JlZiRoYW5kbGVycztcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVcbiAgICovXG4gIHZhciBvcGVyYXRvciA9IG5ldyBfb3BlcmF0b3IyLmRlZmF1bHQoe1xuICAgIHJvb3Q6IHJvb3QsXG4gICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgIGhhbmRsZXJzOiBoYW5kbGVyc1xuICB9KTtcblxuICAvKipcbiAgICogQm9vdHN0cmFwXG4gICAqL1xuICBvcGVyYXRvci5zZXRTdGF0ZSh7XG4gICAgcm91dGU6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gsXG4gICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBCaW5kIGFuZCB2YWxpZGF0ZSBhbGwgbGlua3NcbiAgICovXG4gICgwLCBfZGVsZWdhdGUyLmRlZmF1bHQpKGRvY3VtZW50LCAnYScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGFuY2hvciA9IGUuZGVsZWdhdGVUYXJnZXQ7XG4gICAgdmFyIGhyZWYgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nO1xuXG4gICAgdmFyIGludGVybmFsID0gX3VybC5saW5rLmlzU2FtZU9yaWdpbihocmVmKTtcbiAgICB2YXIgZXh0ZXJuYWwgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJztcbiAgICB2YXIgZGlzYWJsZWQgPSBhbmNob3IuY2xhc3NMaXN0LmNvbnRhaW5zKCduby1hamF4Jyk7XG4gICAgdmFyIGlnbm9yZWQgPSBvcGVyYXRvci52YWxpZGF0ZShlLCBocmVmKTtcbiAgICB2YXIgaGFzaCA9IF91cmwubGluay5pc0hhc2goaHJlZik7XG5cbiAgICBpZiAoIWludGVybmFsIHx8IGV4dGVybmFsIHx8IGRpc2FibGVkIHx8IGlnbm9yZWQgfHwgaGFzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChfdXJsLmxpbmsuaXNTYW1lVVJMKGhyZWYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3BlcmF0b3IuZ28oaHJlZik7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgcG9wc3RhdGVcbiAgICovXG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaHJlZiA9IGUudGFyZ2V0LmxvY2F0aW9uLmhyZWY7XG5cbiAgICBpZiAob3BlcmF0b3IudmFsaWRhdGUoZSwgaHJlZikpIHtcbiAgICAgIGlmIChfdXJsLmxpbmsuaXNIYXNoKGhyZWYpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3BzdGF0ZSBieXBhc3NlcyByb3V0ZXIsIHNvIHdlXG4gICAgICogbmVlZCB0byB0ZWxsIGl0IHdoZXJlIHdlIHdlbnQgdG9cbiAgICAgKiB3aXRob3V0IHB1c2hpbmcgc3RhdGVcbiAgICAgKi9cbiAgICBvcGVyYXRvci5nbyhocmVmLCBudWxsLCB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4gb3BlcmF0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBhY3RpdmVMaW5rcyA9IFtdO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAocm91dGUpIHtcbiAgdmFyIHJlZ2V4ID0gL15cXC8kLy50ZXN0KHJvdXRlKSA/IFJlZ0V4cCgvXlxcLyQvKSA6IG5ldyBSZWdFeHAocm91dGUpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aXZlTGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICBhY3RpdmVMaW5rc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcbiAgfVxuXG4gIGFjdGl2ZUxpbmtzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWYkPVwiJyArIHJvdXRlICsgJ1wiXScpKTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYWN0aXZlTGlua3MubGVuZ3RoOyBfaSsrKSB7XG4gICAgaWYgKHJlZ2V4LnRlc3QoYWN0aXZlTGlua3NbX2ldLmhyZWYpKSB7XG4gICAgICBhY3RpdmVMaW5rc1tfaV0uY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG4gICAgfVxuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9uYW5vYWpheCA9IHJlcXVpcmUoJ25hbm9hamF4Jyk7XG5cbnZhciBfbmFub2FqYXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmFub2FqYXgpO1xuXG52YXIgX25hdmlnbyA9IHJlcXVpcmUoJ25hdmlnbycpO1xuXG52YXIgX25hdmlnbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9uYXZpZ28pO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uID0gcmVxdWlyZSgnc2Nyb2xsLXJlc3RvcmF0aW9uJyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsUmVzdG9yYXRpb24pO1xuXG52YXIgX2xvb3AgPSByZXF1aXJlKCdsb29wLmpzJyk7XG5cbnZhciBfbG9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb29wKTtcblxudmFyIF91cmwgPSByZXF1aXJlKCcuL3VybCcpO1xuXG52YXIgX2xpbmtzID0gcmVxdWlyZSgnLi9saW5rcycpO1xuXG52YXIgX2xpbmtzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpbmtzKTtcblxudmFyIF9yZW5kZXIgPSByZXF1aXJlKCcuL3JlbmRlcicpO1xuXG52YXIgX3JlbmRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZW5kZXIpO1xuXG52YXIgX3N0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xuXG52YXIgX3N0YXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0YXRlKTtcblxudmFyIF9jYWNoZSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcblxudmFyIF9jYWNoZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWNoZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciByb3V0ZXIgPSBuZXcgX25hdmlnbzIuZGVmYXVsdChfdXJsLm9yaWdpbik7XG5cbnZhciBPcGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gT3BlcmF0b3IoY29uZmlnKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE9wZXJhdG9yKTtcblxuICAgIHZhciBldmVudHMgPSAoMCwgX2xvb3AyLmRlZmF1bHQpKCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIC8vIGNyZWF0ZSBjdXJyaWVkIHJlbmRlciBmdW5jdGlvblxuICAgIHRoaXMucmVuZGVyID0gKDAsIF9yZW5kZXIyLmRlZmF1bHQpKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpLCBjb25maWcsIGV2ZW50cy5lbWl0KTtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgZXZlbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhPcGVyYXRvciwgW3tcbiAgICBrZXk6ICdzdG9wJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0YXJ0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBfc3RhdGUyLmRlZmF1bHQucGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0U3RhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBfc3RhdGUyLmRlZmF1bHQuX3N0YXRlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NldFN0YXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3RhdGUoX3JlZikge1xuICAgICAgdmFyIHJvdXRlID0gX3JlZi5yb3V0ZSxcbiAgICAgICAgICB0aXRsZSA9IF9yZWYudGl0bGU7XG5cbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSA9IHJvdXRlID09PSAnJyA/ICcvJyA6IHJvdXRlO1xuICAgICAgdGl0bGUgPyBfc3RhdGUyLmRlZmF1bHQudGl0bGUgPSB0aXRsZSA6IG51bGw7XG5cbiAgICAgICgwLCBfbGlua3MyLmRlZmF1bHQpKF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSk7XG5cbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhyZWZcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzb2x2ZSBVc2UgTmF2aWdvLnJlc29sdmUoKSwgYnlwYXNzIE5hdmlnby5uYXZpZ2F0ZSgpXG4gICAgICpcbiAgICAgKiBQb3BzdGF0ZSBjaGFuZ2VzIHRoZSBVUkwgZm9yIHVzLCBzbyBpZiB3ZSB3ZXJlIHRvXG4gICAgICogcm91dGVyLm5hdmlnYXRlKCkgdG8gdGhlIHByZXZpb3VzIGxvY2F0aW9uLCBpdCB3b3VsZCBwdXNoXG4gICAgICogYSBkdXBsaWNhdGUgcm91dGUgdG8gaGlzdG9yeSBhbmQgd2Ugd291bGQgY3JlYXRlIGEgbG9vcC5cbiAgICAgKlxuICAgICAqIHJvdXRlci5yZXNvbHZlKCkgbGV0J3MgTmF2aWdvIGtub3cgd2UndmUgbW92ZWQsIHdpdGhvdXRcbiAgICAgKiBhbHRlcmluZyBoaXN0b3J5LlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdnbycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdvKGhyZWYpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIHZhciByZXNvbHZlID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICBpZiAoX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIGNhbGxiYWNrKHRpdGxlKSB7XG4gICAgICAgIHZhciByZXMgPSB7XG4gICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgIHJvdXRlOiByb3V0ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc29sdmUgPyByb3V0ZXIucmVzb2x2ZShyb3V0ZSkgOiByb3V0ZXIubmF2aWdhdGUocm91dGUpO1xuXG4gICAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5yZXN0b3JlKCk7XG5cbiAgICAgICAgX3RoaXMuc2V0U3RhdGUocmVzKTtcblxuICAgICAgICBfdGhpcy5lbWl0KCdyb3V0ZTphZnRlcicsIHJlcyk7XG5cbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IocmVzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHJvdXRlID0gKDAsIF91cmwuc2FuaXRpemUpKGhyZWYpO1xuXG4gICAgICBpZiAoIXJlc29sdmUpIHtcbiAgICAgICAgX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnNhdmUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhY2hlZCA9IF9jYWNoZTIuZGVmYXVsdC5nZXQocm91dGUpO1xuXG4gICAgICB0aGlzLmVtaXQoJ3JvdXRlOmJlZm9yZScsIHsgcm91dGU6IHJvdXRlIH0pO1xuXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihyb3V0ZSwgY2FjaGVkLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ2V0KHJvdXRlLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KHJvdXRlLCBjYikge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBfbmFub2FqYXgyLmRlZmF1bHQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogX3VybC5vcmlnaW4gKyAnLycgKyByb3V0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHN0YXR1cywgcmVzLCByZXEpIHtcbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPCAyMDAgfHwgcmVxLnN0YXR1cyA+IDMwMCAmJiByZXEuc3RhdHVzICE9PSAzMDQpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBfdXJsLm9yaWdpbiArICcvJyArIF9zdGF0ZTIuZGVmYXVsdC5wcmV2LnJvdXRlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jYWNoZTIuZGVmYXVsdC5zZXQocm91dGUsIHJlcS5yZXNwb25zZSk7XG5cbiAgICAgICAgX3RoaXMyLnJlbmRlcihyb3V0ZSwgcmVxLnJlc3BvbnNlLCBjYik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdwdXNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHVzaCgpIHtcbiAgICAgIHZhciByb3V0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciB0aXRsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX3N0YXRlMi5kZWZhdWx0LnRpdGxlO1xuXG4gICAgICBpZiAoIXJvdXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3V0ZTogcm91dGUsIHRpdGxlOiB0aXRsZSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd2YWxpZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHZhciBldmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciBocmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfc3RhdGUyLmRlZmF1bHQucm91dGU7XG5cbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfdXJsLnNhbml0aXplKShocmVmKTtcblxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmhhbmRsZXJzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0KSkge1xuICAgICAgICAgIHZhciByZXMgPSB0WzFdKHJvdXRlKTtcbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBfdGhpczMuZW1pdCh0WzBdLCB7XG4gICAgICAgICAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdChyb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE9wZXJhdG9yO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBPcGVyYXRvcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdGFycnkgPSByZXF1aXJlKCd0YXJyeS5qcycpO1xuXG52YXIgX2V2YWwgPSByZXF1aXJlKCcuL2V2YWwuanMnKTtcblxudmFyIF9ldmFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V2YWwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBTdHJpbmdpZmllZCBIVE1MXG4gKiBAcmV0dXJuIHtvYmplY3R9IERPTSBub2RlLCAjcGFnZVxuICovXG52YXIgcGFyc2VSZXNwb25zZSA9IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoaHRtbCkge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYWdlIFJvb3QgYXBwbGljYXRpb24gRE9NIG5vZGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgRHVyYXRpb24gYW5kIHJvb3Qgbm9kZSBzZWxlY3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZW1pdCBFbWl0dGVyIGZ1bmN0aW9uIGZyb20gT3BlcmF0b3IgaW5zdGFuY2VcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgTmV3IG1hcmt1cCBmcm9tIEFKQVggcmVzcG9uc2VcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrXG4gKi9cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHBhZ2UsIF9yZWYsIGVtaXQpIHtcbiAgdmFyIGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbixcbiAgICAgIHJvb3QgPSBfcmVmLnJvb3Q7XG4gIHJldHVybiBmdW5jdGlvbiAocm91dGUsIG1hcmt1cCwgY2IpIHtcbiAgICB2YXIgcmVzID0gcGFyc2VSZXNwb25zZShtYXJrdXApO1xuICAgIHZhciB0aXRsZSA9IHJlcy50aXRsZTtcblxuICAgIHZhciBzdGFydCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YmVmb3JlJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSBwYWdlLmNsaWVudEhlaWdodCArICdweCc7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVuZGVyID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgcGFnZS5pbm5lckhUTUwgPSByZXMucXVlcnlTZWxlY3Rvcihyb290KS5pbm5lckhUTUw7XG4gICAgICAoMCwgX2V2YWwyLmRlZmF1bHQpKHJlcywgZG9jdW1lbnQpO1xuICAgIH0pO1xuXG4gICAgdmFyIGVuZCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNiKHRpdGxlKTtcbiAgICAgIHBhZ2Uuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgICAgZW1pdCgndHJhbnNpdGlvbjphZnRlcicsIHsgcm91dGU6IHJvdXRlIH0pO1xuICAgIH0pO1xuXG4gICAgKDAsIF90YXJyeS5xdWV1ZSkoc3RhcnQoMCksIHJlbmRlcihkdXJhdGlvbiksIGVuZCgwKSkoKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBwYXVzZWQ6IGZhbHNlLFxuICBfc3RhdGU6IHtcbiAgICByb3V0ZTogJycsXG4gICAgdGl0bGU6ICcnLFxuICAgIHByZXY6IHtcbiAgICAgIHJvdXRlOiAnLycsXG4gICAgICB0aXRsZTogJydcbiAgICB9XG4gIH0sXG4gIGdldCByb3V0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucm91dGU7XG4gIH0sXG4gIHNldCByb3V0ZShsb2MpIHtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnJvdXRlID0gdGhpcy5yb3V0ZTtcbiAgICB0aGlzLl9zdGF0ZS5yb3V0ZSA9IGxvYztcbiAgfSxcbiAgZ2V0IHRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS50aXRsZTtcbiAgfSxcbiAgc2V0IHRpdGxlKHZhbCkge1xuICAgIHRoaXMuX3N0YXRlLnByZXYudGl0bGUgPSB0aGlzLnRpdGxlO1xuICAgIHRoaXMuX3N0YXRlLnRpdGxlID0gdmFsO1xuICB9LFxuICBnZXQgcHJldigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucHJldjtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZ2V0T3JpZ2luID0gZnVuY3Rpb24gZ2V0T3JpZ2luKGxvY2F0aW9uKSB7XG4gIHZhciBwcm90b2NvbCA9IGxvY2F0aW9uLnByb3RvY29sLFxuICAgICAgaG9zdCA9IGxvY2F0aW9uLmhvc3Q7XG5cbiAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArIGhvc3Q7XG59O1xuXG52YXIgcGFyc2VVUkwgPSBmdW5jdGlvbiBwYXJzZVVSTCh1cmwpIHtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGEuaHJlZiA9IHVybDtcbiAgcmV0dXJuIGE7XG59O1xuXG52YXIgb3JpZ2luID0gZXhwb3J0cy5vcmlnaW4gPSBnZXRPcmlnaW4od2luZG93LmxvY2F0aW9uKTtcblxudmFyIG9yaWdpblJlZ0V4ID0gbmV3IFJlZ0V4cChvcmlnaW4pO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgUmF3IFVSTCB0byBwYXJzZVxuICogQHJldHVybiB7c3RyaW5nfSBVUkwgc2FucyBvcmlnaW4gYW5kIHNhbnMgbGVhZGluZyBzbGFzaFxuICovXG52YXIgc2FuaXRpemUgPSBleHBvcnRzLnNhbml0aXplID0gZnVuY3Rpb24gc2FuaXRpemUodXJsKSB7XG4gIHZhciByb3V0ZSA9IHVybC5yZXBsYWNlKG9yaWdpblJlZ0V4LCAnJyk7XG4gIHJldHVybiByb3V0ZS5tYXRjaCgvXlxcLy8pID8gcm91dGUucmVwbGFjZSgvXFwvezF9LywgJycpIDogcm91dGU7IC8vIHJlbW92ZSAvIGFuZCByZXR1cm5cbn07XG5cbnZhciBsaW5rID0gZXhwb3J0cy5saW5rID0ge1xuICBpc1NhbWVPcmlnaW46IGZ1bmN0aW9uIGlzU2FtZU9yaWdpbihocmVmKSB7XG4gICAgcmV0dXJuIG9yaWdpbiA9PT0gZ2V0T3JpZ2luKHBhcnNlVVJMKGhyZWYpKTtcbiAgfSxcbiAgaXNIYXNoOiBmdW5jdGlvbiBpc0hhc2goaHJlZikge1xuICAgIHJldHVybiAoLyMvLnRlc3QoaHJlZilcbiAgICApO1xuICB9LFxuICBpc1NhbWVVUkw6IGZ1bmN0aW9uIGlzU2FtZVVSTChocmVmKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09IHBhcnNlVVJMKGhyZWYpLnNlYXJjaCAmJiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IHBhcnNlVVJMKGhyZWYpLnBhdGhuYW1lO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgbGlzdGVuZXJzID0ge307XG5cbiAgdmFyIG9uID0gZnVuY3Rpb24gb24oZSkge1xuICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIGlmICghY2IpIHJldHVybjtcbiAgICBsaXN0ZW5lcnNbZV0gPSBsaXN0ZW5lcnNbZV0gfHwgeyBxdWV1ZTogW10gfTtcbiAgICBsaXN0ZW5lcnNbZV0ucXVldWUucHVzaChjYik7XG4gIH07XG5cbiAgdmFyIGVtaXQgPSBmdW5jdGlvbiBlbWl0KGUpIHtcbiAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIHZhciBpdGVtcyA9IGxpc3RlbmVyc1tlXSA/IGxpc3RlbmVyc1tlXS5xdWV1ZSA6IGZhbHNlO1xuICAgIGl0ZW1zICYmIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiBpKGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgbywge1xuICAgIGVtaXQ6IGVtaXQsXG4gICAgb246IG9uXG4gIH0pO1xufTsiLCJjb25zdCBjcmVhdGVCYXIgPSAocm9vdCwgY2xhc3NuYW1lKSA9PiB7XG4gIGxldCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgbGV0IGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gIG8uY2xhc3NOYW1lID0gY2xhc3NuYW1lIFxuICBpLmNsYXNzTmFtZSA9IGAke2NsYXNzbmFtZX1fX2lubmVyYFxuICBvLmFwcGVuZENoaWxkKGkpXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKG8sIHJvb3QuY2hpbGRyZW5bMF0pXG5cbiAgcmV0dXJuIHtcbiAgICBvdXRlcjogbyxcbiAgICBpbm5lcjogaVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChyb290ID0gZG9jdW1lbnQuYm9keSwgb3B0cyA9IHt9KSA9PiB7XG4gIGxldCB0aW1lciA9IG51bGxcbiAgY29uc3Qgc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDIwMFxuICBjb25zdCBjbGFzc25hbWUgPSBvcHRzLmNsYXNzbmFtZSB8fCAncHV0eidcbiAgY29uc3QgdHJpY2tsZSA9IG9wdHMudHJpY2tsZSB8fCA1IFxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHByb2dyZXNzOiAwXG4gIH1cblxuICBjb25zdCBiYXIgPSBjcmVhdGVCYXIocm9vdCwgY2xhc3NuYW1lKVxuXG4gIGNvbnN0IHJlbmRlciA9ICh2YWwgPSAwKSA9PiB7XG4gICAgc3RhdGUucHJvZ3Jlc3MgPSB2YWxcbiAgICBiYXIuaW5uZXIuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgke3N0YXRlLmFjdGl2ZSA/ICcwJyA6ICctMTAwJSd9KSB0cmFuc2xhdGVYKCR7LTEwMCArIHN0YXRlLnByb2dyZXNzfSUpO2BcbiAgfVxuXG4gIGNvbnN0IGdvID0gdmFsID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgcmVuZGVyKE1hdGgubWluKHZhbCwgOTUpKVxuICB9XG5cbiAgY29uc3QgaW5jID0gKHZhbCA9IChNYXRoLnJhbmRvbSgpICogdHJpY2tsZSkpID0+IGdvKHN0YXRlLnByb2dyZXNzICsgdmFsKVxuXG4gIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSBmYWxzZVxuICAgIHJlbmRlcigxMDApXG4gICAgc2V0VGltZW91dCgoKSA9PiByZW5kZXIoKSwgc3BlZWQpXG4gICAgaWYgKHRpbWVyKXsgY2xlYXJUaW1lb3V0KHRpbWVyKSB9XG4gIH1cblxuICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSB0cnVlXG4gICAgaW5jKClcbiAgfVxuXG4gIGNvbnN0IHB1dHogPSAoaW50ZXJ2YWwgPSA1MDApID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiBpbmMoKSwgaW50ZXJ2YWwpXG4gIH1cbiAgXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKHtcbiAgICBwdXR6LFxuICAgIHN0YXJ0LFxuICAgIGluYyxcbiAgICBnbyxcbiAgICBlbmQsXG4gICAgZ2V0U3RhdGU6ICgpID0+IHN0YXRlXG4gIH0se1xuICAgIGJhcjoge1xuICAgICAgdmFsdWU6IGJhclxuICAgIH1cbiAgfSlcbn1cbiIsIid1c2Ugc3RyaWN0JztPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywnX19lc01vZHVsZScse3ZhbHVlOiEwfSk7dmFyIHNjcm9sbD1mdW5jdGlvbihhKXtyZXR1cm4gd2luZG93LnNjcm9sbFRvKDAsYSl9LHN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGhpc3Rvcnkuc3RhdGU/aGlzdG9yeS5zdGF0ZS5zY3JvbGxQb3NpdGlvbjowfSxzYXZlPWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOm51bGw7d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtzY3JvbGxQb3NpdGlvbjphfHx3aW5kb3cucGFnZVlPZmZzZXR8fHdpbmRvdy5zY3JvbGxZfSwnJyl9LHJlc3RvcmU9ZnVuY3Rpb24oKXt2YXIgYT0wPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1swXSE9PXZvaWQgMD9hcmd1bWVudHNbMF06bnVsbCxiPXN0YXRlKCk7YT9hKGIpOnNjcm9sbChiKX0saW5pdD1mdW5jdGlvbigpeydzY3JvbGxSZXN0b3JhdGlvbidpbiBoaXN0b3J5JiYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbj0nbWFudWFsJyxzY3JvbGwoc3RhdGUoKSksd2luZG93Lm9uYmVmb3JldW5sb2FkPWZ1bmN0aW9uKCl7cmV0dXJuIHNhdmUoKX0pfTtleHBvcnRzLmRlZmF1bHQ9J3VuZGVmaW5lZCc9PXR5cGVvZiB3aW5kb3c/e306e2luaXQ6aW5pdCxzYXZlOnNhdmUscmVzdG9yZTpyZXN0b3JlLHN0YXRlOnN0YXRlfTsiLCJmdW5jdGlvbiBuZXh0KGFyZ3Mpe1xuICBhcmdzLmxlbmd0aCA+IDAgJiYgYXJncy5zaGlmdCgpLmFwcGx5KHRoaXMsIGFyZ3MpXG59XG5cbmZ1bmN0aW9uIHJ1bihjYiwgYXJncyl7XG4gIGNiKClcbiAgbmV4dChhcmdzKVxufVxuXG5mdW5jdGlvbiB0YXJyeShjYiwgZGVsYXkpe1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgIHZhciBvdmVycmlkZSA9IGFyZ3NbMF1cbiAgICBcbiAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBvdmVycmlkZSl7XG4gICAgICByZXR1cm4gdGFycnkoY2IsIG92ZXJyaWRlKVxuICAgIH1cbiAgICBcbiAgICAnbnVtYmVyJyA9PT0gdHlwZW9mIGRlbGF5ID8gKFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBydW4oY2IsIGFyZ3MpXG4gICAgICB9LCBkZWxheSkgXG4gICAgKSA6IChcbiAgICAgIHJ1bihjYiwgYXJncylcbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gcXVldWUoKXtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgcmV0dXJuIHRhcnJ5KGZ1bmN0aW9uKCl7XG4gICAgbmV4dChhcmdzLnNsaWNlKDApKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB7XG4gIHRhcnJ5OiB0YXJyeSxcbiAgcXVldWU6IHF1ZXVlXG59XG4iLCJjb25zdCBmaW5kTGluayA9IChpZCwgZGF0YSkgPT4gZGF0YS5maWx0ZXIobCA9PiBsLmlkID09PSBpZClbMF1cblxuY29uc3QgY3JlYXRlTGluayA9ICh7IGFuc3dlcnMgfSwgZGF0YSkgPT4gYW5zd2Vycy5mb3JFYWNoKGEgPT4ge1xuICBsZXQgaXNQYXRoID0gL15cXC8vLnRlc3QoYS5uZXh0KSA/IHRydWUgOiBmYWxzZVxuICBsZXQgaXNHSUYgPSAvZ2lmLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgYS5uZXh0ID0gaXNQYXRoIHx8IGlzR0lGID8gYS5uZXh0IDogZmluZExpbmsoYS5uZXh0LCBkYXRhKVxufSlcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKHF1ZXN0aW9ucykgPT4ge1xuXHRxdWVzdGlvbnMubWFwKHEgPT4gY3JlYXRlTGluayhxLCBxdWVzdGlvbnMpKVxuXHRyZXR1cm4gcXVlc3Rpb25zXG59XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXN0aW9ucyA9PiB7XG4gIHJldHVybiB7XG4gICAgc3RvcmU6IGNyZWF0ZVN0b3JlKHF1ZXN0aW9ucyksXG4gICAgZ2V0QWN0aXZlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmlsdGVyKHEgPT4gcS5pZCA9PSB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgvIy8pWzFdKVswXSB8fCB0aGlzLnN0b3JlWzBdXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBpZDogMSxcbiAgICBwcm9tcHQ6IGBIaSEgV2hhdCBicmluZ3MgeW91IHRvIHRoaXMgY29ybmVyIG9mIHRoZSB3ZWI/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnV2hvIGFyZSB5b3U/JyxcbiAgICAgICAgbmV4dDogMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBJJ20gaGlyaW5nLmAsXG4gICAgICAgIG5leHQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgSXQncyB5b3VyIG1vdGhlci5gLFxuICAgICAgICBuZXh0OiA0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEZ1bm55IGpva2VzLCBwbHouYCxcbiAgICAgICAgbmV4dDogNVxuICAgICAgfVxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDIsXG4gICAgcHJvbXB0OiBgSSdtIE1lbGFuaWUg4oCTIGEgZ3JhcGhpYyBkZXNpZ25lciB3b3JraW5nIGluIGV4cGVyaWVudGlhbCBtYXJrZXRpbmcgJiBwcm91ZCBJb3dhbiB0cnlpbmcgdG8gZWF0IEFMTCB0aGUgQkxUcy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBXaGF0J3MgZXhwZXJpZW50aWFsP2AsXG4gICAgICAgIG5leHQ6IDZcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCdzIGEgQkxUP2AsXG4gICAgICAgIG5leHQ6IDdcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMyxcbiAgICBwcm9tcHQ6IGBSYWQuIENhbiBJIHNob3cgeW91IHNvbWUgcHJvamVjdHMgSSd2ZSB3b3JrZWQgb24/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgWWVzLCBwbGVhc2UhYCxcbiAgICAgICAgbmV4dDogJy93b3JrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBOYWgsIHRlbGwgbWUgYWJvdXQgeW91LmAsXG4gICAgICAgIG5leHQ6ICcvYWJvdXQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEknbGwgZW1haWwgeW91IGluc3RlYWQuYCxcbiAgICAgICAgbmV4dDogJy9jb250YWN0J1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA0LFxuICAgIHByb21wdDogYEhpIE1vbS4gSSBsb3ZlIHlvdSFgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBKSywgbm90IHlvdXIgbW9tLmAsXG4gICAgICAgIG5leHQ6IDlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCBkb2VzICdKSycgbWVhbj9gLFxuICAgICAgICBuZXh0OiAxNVxuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA1LFxuICAgIHByb21wdDogYFdoYXQncyBmdW5uaWVyIHRoYW4gYSByaGV0b3JpY2FsIHF1ZXN0aW9uP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYFllc2AsXG4gICAgICAgIG5leHQ6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYE5vYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzEwdEQ3R1A5bEhmYVBDL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNixcbiAgICBwcm9tcHQ6IGBFeHBlcmllbnRpYWwgbWFya2V0aW5nIGVuZ2FnZXMgZGlyZWN0bHkgd2l0aCBjb25zdW1lcnMuIEV4YW1wbGVzPyBQb3AtdXAgc2hvcHMsIHN0dW50cywgb3Igc2ltcGxlIHN0cmVldCB0ZWFtcyBkaXN0cmlidXRpbmcgc2FtcGxlcy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBTb3VuZHMgY29vbC4gV2hhdCBoYXZlIHlvdSBkb25lP2AsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2h5IGRvIHlvdSBsaWtlIGl0P2AsXG4gICAgICAgIG5leHQ6IDExXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDcsXG4gICAgcHJvbXB0OiBgWW91IHRlbGwgbWUuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgQmVlZiBMaXZlciBUb2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9vRk9zMTBTSlNuem9zL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgQmVycnkgTGVtb24gVGFydGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8zbzdUS3dtbkRnUWI1amVtaksvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCYWNvbiBMZXR0dWNlIFRvbWF0b2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9mcXp4Y21sWTdvcE9nL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogOSxcbiAgICBwcm9tcHQ6IGBDbGlja2luZyBmb3IgZnVuPyBHb29kIGx1Y2sgd2l0aCB0aGlzIG9uZS5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCbHVlIFBpbGxgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvRzdHTm9hVVNIN3NNVS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYFJlZCBQaWxsYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL1VqdWpHWTNtQTNKbGUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxMCxcbiAgICBwcm9tcHQ6IGBQYW5jYWtlcyBvciB3YWZmbGVzP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYEZyZW5jaCBUb2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9ZOGNkUGxlNGVJeVB1L2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTEsXG4gICAgcHJvbXB0OiBgVGhlcmUgYXJlIGEgbnVtYmVyIG9mIHJlYXNvbnMsIGJ1dCBhIG1ham9yIGhvb2sgaXMgdGhlIGNoYWxsZW5nZSB0byBjb25zaXN0ZW50bHkgY3JlYXRlIHdheXMgdG8gc3VycHJpc2UgYW5kIGRlbGlnaHQuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCBhcmUgeW91ciBmYXZvcml0ZSBwcm9qZWN0cz9gLFxuICAgICAgICBuZXh0OiAnL3dvcmsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEkgaGF2ZSBxdWVzdGlvbnMhIENhbiBJIGVtYWlsIHlvdT9gLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAxNSxcbiAgICBwcm9tcHQ6IGBJdCBpcyB5b3UsIE1vbSFgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBZaXBwZWUhYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL2tyZXdYVUI2TEJqYS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfVxuXVxuIiwiaW1wb3J0IGgwIGZyb20gJ2gwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuLi9saWIvY29sb3JzJ1xuXG5leHBvcnQgY29uc3QgZGl2ID0gaDAoJ2RpdicpXG5leHBvcnQgY29uc3QgYnV0dG9uID0gaDAoJ2J1dHRvbicpKHtjbGFzczogJ2gyIG12MCBpbmxpbmUtYmxvY2snfSlcbmV4cG9ydCBjb25zdCB0aXRsZSA9IGgwKCdwJykoe2NsYXNzOiAnaDEgbXQwIG1iMDUgY2InfSlcblxuZXhwb3J0IGNvbnN0IHRlbXBsYXRlID0gKHtwcm9tcHQsIGFuc3dlcnN9LCBjYikgPT4ge1xuICByZXR1cm4gZGl2KHtjbGFzczogJ3F1ZXN0aW9uJ30pKFxuICAgIHRpdGxlKHByb21wdCksXG4gICAgZGl2KFxuICAgICAgLi4uYW5zd2Vycy5tYXAoKGEsIGkpID0+IGJ1dHRvbih7XG4gICAgICAgIG9uY2xpY2s6IChlKSA9PiBjYihhLm5leHQpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiBjb2xvcnMuY29sb3JzW2ldXG4gICAgICAgIH1cbiAgICAgIH0pKGEudmFsdWUpKVxuICAgIClcbiAgKVxufVxuIiwiaW1wb3J0IHsgdGFycnksIHF1ZXVlIH0gZnJvbSAndGFycnkuanMnXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgbGV0IGxvYWRlZCA9IGZhbHNlXG5cbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2lmJylcbiAgY29uc3QgaW1nID0gbW9kYWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdXG5cbiAgY29uc3QgbGF6eSA9ICh1cmwsIGNiKSA9PiB7XG4gICAgbGV0IGJ1cm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cbiAgICBidXJuZXIub25sb2FkID0gKCkgPT4gY2IodXJsKVxuXG4gICAgYnVybmVyLnNyYyA9IHVybFxuICB9XG5cbiAgY29uc3Qgb3BlbiA9IHVybCA9PiB7XG4gICAgd2luZG93LmxvYWRlci5zdGFydCgpXG4gICAgd2luZG93LmxvYWRlci5wdXR6KDUwMClcblxuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG5cbiAgICBsYXp5KHVybCwgdXJsID0+IHtcbiAgICAgIGxvYWRlZCA9IHRydWVcbiAgICAgIGltZy5zcmMgPSB1cmxcbiAgICAgIGltZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgd2luZG93LmxvYWRlci5lbmQoKVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICBsb2FkZWQgPSBmYWxzZVxuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICBpbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICB9XG5cbiAgbW9kYWwub25jbGljayA9ICgpID0+IGxvYWRlZCA/IGNsb3NlKCkgOiBudWxsXG5cbiAgcmV0dXJuIHtcbiAgICBvcGVuLFxuICAgIGNsb3NlXG4gIH1cbn1cbiIsImltcG9ydCByb3V0ZXIgZnJvbSAnLi4vbGliL3JvdXRlcidcbmltcG9ydCBxdWVzdGlvbnMgZnJvbSAnLi9kYXRhL2luZGV4LmpzJ1xuaW1wb3J0IHN0b3JhZ2UgZnJvbSAnLi9kYXRhJ1xuaW1wb3J0IGdpZmZlciBmcm9tICcuL2dpZmZlcidcbmltcG9ydCB7IHRlbXBsYXRlIH0gZnJvbSAnLi9lbGVtZW50cydcblxubGV0IHByZXZcbmNvbnN0IGRhdGEgPSBzdG9yYWdlKHF1ZXN0aW9ucylcblxuLyoqXG4gKiBSZW5kZXIgdGVtcGxhdGUgYW5kIGFwcGVuZCB0byBET01cbiAqL1xuY29uc3QgcmVuZGVyID0gKG5leHQpID0+IHtcbiAgbGV0IHF1ZXN0aW9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvblJvb3QnKVxuXG4gIGxldCBlbCA9IHRlbXBsYXRlKG5leHQsIHVwZGF0ZSlcbiAgcXVlc3Rpb25Sb290ICYmIHF1ZXN0aW9uUm9vdC5hcHBlbmRDaGlsZChlbClcbiAgcmV0dXJuIGVsIFxufVxuXG4vKipcbiAqIEhhbmRsZSBET00gdXBkYXRlcywgb3RoZXIgbGluayBjbGlja3NcbiAqL1xuY29uc3QgdXBkYXRlID0gKG5leHQpID0+IHtcbiAgbGV0IHF1ZXN0aW9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvblJvb3QnKVxuXG4gIGxldCBpc0dJRiA9IC9naXBoeS8udGVzdChuZXh0KVxuICBpZiAoaXNHSUYpIHJldHVybiBnaWZmZXIoKS5vcGVuKG5leHQpXG5cbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KG5leHQpXG4gIGlmIChpc1BhdGgpIHJldHVybiByb3V0ZXIuZ28obmV4dClcblxuICBpZiAocHJldiAmJiBxdWVzdGlvblJvb3QgJiYgcXVlc3Rpb25Sb290LmNvbnRhaW5zKHByZXYpKSBxdWVzdGlvblJvb3QucmVtb3ZlQ2hpbGQocHJldilcblxuICBwcmV2ID0gcmVuZGVyKG5leHQpXG5cbiAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXh0LmlkXG59XG5cbi8qKlxuICogV2FpdCB1bnRpbCBuZXcgRE9NIGlzIHByZXNlbnQgYmVmb3JlXG4gKiB0cnlpbmcgdG8gcmVuZGVyIHRvIGl0XG4gKi9cbnJvdXRlci5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmIChyb3V0ZSA9PT0gJycgfHwgLyheXFwvfFxcLyNbMC05XXwjWzAtOV0pLy50ZXN0KHJvdXRlKSl7XG4gICAgdXBkYXRlKGRhdGEuZ2V0QWN0aXZlKCkpXG4gIH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgcHJldiA9IHJlbmRlcihkYXRhLmdldEFjdGl2ZSgpKVxufVxuIiwiaW1wb3J0IHB1dHogZnJvbSAncHV0eidcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9saWIvcm91dGVyJ1xuaW1wb3J0IGFwcCBmcm9tICcuL2FwcCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9saWIvY29sb3JzJ1xuaW1wb3J0IGNvbnRhY3QgZnJvbSAnLi9saWIvY29udGFjdCdcblxuY29uc3QgbG9hZGVyID0gd2luZG93LmxvYWRlciA9IHB1dHooZG9jdW1lbnQuYm9keSwge1xuICBzcGVlZDogMTAwLFxuICB0cmlja2xlOiAxMFxufSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUnKVxuICBjb25zdCBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKVxuXG4gIGNvbnN0IG1lbnVUb2dnbGUgPSAoY2xvc2UpID0+IHtcbiAgICBjb25zdCBvcGVuID0gbWVudS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXZpc2libGUnKVxuICAgIG1lbnUuY2xhc3NMaXN0W29wZW4gfHwgY2xvc2UgPyAncmVtb3ZlJyA6ICdhZGQnXSgnaXMtdmlzaWJsZScpXG4gICAgdG9nZ2xlLmNsYXNzTGlzdFtvcGVuIHx8IGNsb3NlID8gJ3JlbW92ZScgOiAnYWRkJ10oJ2lzLWFjdGl2ZScpXG4gIH1cblxuICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBtZW51VG9nZ2xlKClcbiAgfSlcblxuICBhcHAoKVxuXG4gIHJvdXRlci5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gICAgY29sb3JzLnVwZGF0ZSgpXG5cbiAgICBpZiAoL2NvbnRhY3QvLnRlc3Qocm91dGUpKSB7XG4gICAgICBjb250YWN0KClcbiAgICB9XG5cbiAgICBtZW51VG9nZ2xlKHRydWUpXG4gIH0pXG5cbiAgaWYgKC9jb250YWN0Ly50ZXN0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcbiAgICBjb250YWN0KClcbiAgfVxuXG4gIGNvbG9ycy51cGRhdGUoKVxufSlcbiIsImNvbnN0IHJvb3RTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQocm9vdFN0eWxlKVxuXG5jb25zdCBjb2xvcnMgPSBbXG4gICcjMzVEM0U4JyxcbiAgJyNGRjRFNDInLFxuICAnI0ZGRUE1MSdcbl1cblxuY29uc3QgcmFuZG9tQ29sb3IgPSAoKSA9PiBjb2xvcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKDIgLSAwKSArIDApXVxuXG5jb25zdCBzYXZlQ29sb3IgPSBjID0+IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtanMnLCBKU09OLnN0cmluZ2lmeSh7XG4gIGNvbG9yOiBjXG59KSlcblxuY29uc3QgcmVhZENvbG9yID0gKCkgPT4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21qcycpID8gKFxuICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtanMnKSkuY29sb3JcbikgOiAoXG4gIG51bGxcbilcblxuY29uc3QgZ2V0Q29sb3IgPSAoKSA9PiB7XG4gIGxldCBjID0gcmFuZG9tQ29sb3IoKVxuICBsZXQgcHJldiA9IHJlYWRDb2xvcigpXG5cbiAgd2hpbGUgKGMgPT09IHByZXYpe1xuICAgIGMgPSByYW5kb21Db2xvcigpXG4gIH1cblxuICBzYXZlQ29sb3IoYylcbiAgcmV0dXJuIGNcbn1cblxuY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICBsZXQgY29sb3IgPSBnZXRDb2xvcigpXG4gIFxuICByb290U3R5bGUuaW5uZXJIVE1MID0gYFxuICAgIGJvZHkgeyBjb2xvcjogJHtjb2xvcn0gfVxuICAgIDo6LW1vei1zZWxlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgfVxuICAgIDo6c2VsZWN0aW9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7Y29sb3J9O1xuICAgIH1cbiAgICAudGhlbWUgYSB7XG4gICAgICBjb2xvcjogJHtjb2xvcn1cbiAgICB9XG4gIGBcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGU6IHVwZGF0ZSxcbiAgY29sb3JzXG59XG4iLCJpbXBvcnQgbGluZXMgZnJvbSAnLi9zdWJqZWN0bGluZXMnXG5cbmNvbnN0IG1pbiA9IDBcbmNvbnN0IG1heCA9IGxpbmVzLmxlbmd0aCAtIDFcbmxldCBjdXJyZW50ID0gMFxuXG5jb25zdCBjb3B5VG9DbGlwYm9hcmQgPSBtc2cgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dC5pbm5lckhUTUwgPSBtc2dcbiAgICB0ZXh0LnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAtOTk5OXB4OydcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHQpXG4gICAgdGV4dC5zZWxlY3QoKVxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5JylcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHQpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHdpbmRvdy5wcm9tcHQoJ1ByZXNzIENtZCtDIG9yIEN0cmwrQyB0byBjb3B5IHRvIGNsaXBib2FyZC4nLCBtc2cpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2xhbXAodmFsKXtcbiAgbGV0IF92YWxcblxuICBpZiAodmFsID49IG1pbiAmJiB2YWwgPD0gbWF4KXtcbiAgICBfdmFsID0gdmFsIFxuICB9IGVsc2UgaWYgKHZhbCA+PSBtYXgpe1xuICAgIF92YWwgPSBtaW5cbiAgfSBlbHNlIGlmICh2YWwgPD0gbWluKXtcbiAgICBfdmFsID0gbWF4XG4gIH1cblxuICByZXR1cm4gX3ZhbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBjb25zdCBzdWJqZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1YmplY3RMaW5lJylcbiAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0U3ViamVjdCcpXG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKVxuXG4gIHN1YmplY3QuaW5uZXJIVE1MID0gbGluZXNbY3VycmVudF1cblxuICBuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBwcm9tcHQuaW5uZXJIVE1MID0gJyhjbGljayB0byBjb3B5KSdcbiAgICBjdXJyZW50ID0gY2xhbXAoKytjdXJyZW50KVxuICAgIHN1YmplY3QuaW5uZXJIVE1MID0gbGluZXNbY3VycmVudF1cbiAgICBuZXh0LmJsdXIoKVxuICB9KVxuXG4gIHN1YmplY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgY29weVRvQ2xpcGJvYXJkKHN1YmplY3QuaW5uZXJIVE1MKVxuICAgIHByb21wdC5pbm5lckhUTUwgPSAnY29waWVkISdcbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cbiIsImltcG9ydCBvcGVyYXRvciBmcm9tICdvcGVyYXRvci5qcydcblxuLyoqXG4gKiBTZW5kIHBhZ2Ugdmlld3MgdG8gXG4gKiBHb29nbGUgQW5hbHl0aWNzXG4gKi9cbmNvbnN0IGdhVHJhY2tQYWdlVmlldyA9IChwYXRoLCB0aXRsZSkgPT4ge1xuICBsZXQgZ2EgPSB3aW5kb3cuZ2EgPyB3aW5kb3cuZ2EgOiBmYWxzZVxuXG4gIGlmICghZ2EpIHJldHVyblxuXG4gIGdhKCdzZXQnLCB7cGFnZTogcGF0aCwgdGl0bGU6IHRpdGxlfSk7XG4gIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG59XG5cbmNvbnN0IGFwcCA9IG9wZXJhdG9yKHtcbiAgcm9vdDogJyNyb290J1xufSlcblxuYXBwLm9uKCdyb3V0ZTphZnRlcicsICh7IHJvdXRlLCB0aXRsZSB9KSA9PiB7XG4gIGdhVHJhY2tQYWdlVmlldyhyb3V0ZSwgdGl0bGUpXG59KVxuXG5hcHAub24oJ3RyYW5zaXRpb246YWZ0ZXInLCAoKSA9PiBsb2FkZXIgJiYgbG9hZGVyLmVuZCgpKVxuXG53aW5kb3cuYXBwID0gYXBwXG5cbmV4cG9ydCBkZWZhdWx0IGFwcFxuIiwiZXhwb3J0IGRlZmF1bHQgW1xuICBgMTAgUmVhc29ucyB0byBPcGVuIFRoaXMgRW1haWwgKE9wZW4gVG8gRmluZCBPdXQhKWAsXG4gIGBGUkVFIEpFTExZIEJFQU5TIWAsXG4gIGBSZTogVHJhZGVtYXJrIFJlcXVlc3QgZm9yIFwiTmVhdG8gQnVycml0b1wiYCxcbiAgYEFwcGxpY2F0aW9uIEFjY2VwdGVkIOKAkyBDaGVlc2VjYWtlIENsdWIgb2YgQW1lcmljYWAsXG4gIGBDYXN0aW5nIENhbGwg4oCTIFNlZWtpbmcgQWN0cmVzcyBUbyBQbGF5IFJvc2UgaW4gVGl0YW5pYyBSZWJvb3RgLFxuICBgQW1hemluZyBQcm9kdWN0ISBDaGFuZ2UgWW91ciBJbm5lciBNb25vbG9ndWUncyBWb2ljZSB0byBKYW1lcyBFYXJsIEpvbmVzIWAsXG4gIGBbTk9USUZJQ0FUSU9OXSAtIE5ldyBQb3N0IGluIEZvcnVtIFwiV2h5IFdhcyBFLlQuIFNvIENyZWVweT9cImAsXG4gIGBIaWdobHkgUmVwdXRhYmxlIFNjaWVuY2UgTWFnYXppbmU6IEZyZW5jaCBGcmllcyBhcmUgdGhlIE5ldyBTdXBlcmZvb2RgLFxuICBgRnc6IEZ3OiBGdzogRnc6IG9tZyBvbWcgb21nIGNoZWNrIHRoaXMgb3V0IHJuIWAsXG4gIGBOZXZlciBHb25uYSBHaXZlIFlvdSBVcCwgTmV2ZXIgR29ubmEgTGV0IFlvdSBEb3duLCBOZXZlciBHb25uYSBSdW4gQXJvdW5kIGFuZC4uLmAsXG4gIGBZb3VyIFdlaXJkIERyZWFtcyBFeHBsYWluZWQ6IE5vLCBZb3UgU2hvdWxkbid0IEdldCBhIFBldCBQYW5kYWAsXG4gIGBGb3J3YXJkIDIgMTAgcHBsIG9yIHUgd2lsbCBkcm93biBpbiBjb25mZXR0aSA0IHJlYWxgLFxuICBgUHJlc2lkZW50IEJhcmFjayBPYmFtYSdzIEZhdm9yaXRlIENhdCBWaWRlb3NgLFxuICBgVGhlIFJlc3VsdHMgQXJlIEluISBZb3UgYXJlIDk2JSBMaXogTGVtb25gLFxuICBgTW1tYm9wLCBCYSBEdWJhIERvcCwgQmEgRHUgQm9wLCBCYSBEdWJhIERvcGAsXG4gIGB+Kn4gckVtRW1CZVIgdFlwSW5HIHNIaVQgbElrRSB0SGlTIH4qfmAsXG5dXG4iXX0=
