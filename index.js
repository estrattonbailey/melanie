(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./operator":5,"./url":8,"delegate":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var activeLinks = [];

var toggle = function toggle(bool) {
  for (var i = 0; i < activeLinks.length; i++) {
    activeLinks[i].classList[bool ? 'add' : 'remove']('is-active');
  }
};

// TODO do I need to empty the array
// or can I just reset to []

exports.default = function (route) {
  toggle(false);

  activeLinks.splice(0, activeLinks.length);
  activeLinks.push.apply(activeLinks, _toConsumableArray(Array.prototype.slice.call(document.querySelectorAll('[href$="' + route + '"]'))));

  toggle(true);
};
},{}],5:[function(require,module,exports){
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

      this.router.navigate(route);
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
},{"./cache":1,"./links":4,"./render":6,"./state":7,"./url":8,"loop.js":11,"nanoajax":12,"navigo":13,"scroll-restoration":14}],6:[function(require,module,exports){
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
},{"./eval.js":2,"tarry.js":15}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./closest":9}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var scroll=function(a){return window.scrollTo(0,a)},state=function(){return history.state?history.state.scrollPosition:0},save=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null;window.history.replaceState({scrollPosition:a||window.pageYOffset||window.scrollY},'')},restore=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null,b=state();a?a(b):scroll(b)},init=function(){'scrollRestoration'in history&&(history.scrollRestoration='manual',scroll(state()),window.onbeforeunload=function(){return save()})};exports.default='undefined'==typeof window?{}:{init:init,save:save,restore:restore,state:state};
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
},{"./transform-props":17}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../lib/colors":26,"h0":16}],23:[function(require,module,exports){
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

},{"tarry.js":19}],24:[function(require,module,exports){
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

},{"../lib/router":28,"./data":20,"./data/index.js":21,"./elements":22,"./giffer":23}],25:[function(require,module,exports){
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

},{"./app":24,"./lib/colors":26,"./lib/contact":27,"./lib/router":28,"putz":18}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
    copyToClipboard(subject.innerHTML);
    prompt.innerHTML = 'copied!';
  });
};

},{"./subjectlines":29}],28:[function(require,module,exports){
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

},{"operator.js":3}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ["10 Reasons to Open This Email (Open To Find Out!)", "FREE JELLY BEANS!", "Re: Trademark Request for \"Neato Burrito\"", "Application Accepted \u2013 Cheesecake Club of America", "Casting Call \u2013 Seeking Actress To Play Rose in Titanic Reboot", "Amazing Product! Change Your Inner Monologue's Voice to James Earl Jones!", "[NOTIFICATION] - New Post in Forum \"Why Was E.T. So Creepy?\"", "Highly Reputable Science Magazine: French Fries are the New Superfood", "Fw: Fw: Fw: Fw: omg omg omg check this out rn!", "Never Gonna Give You Up, Never Gonna Let You Down, Never Gonna Run Around and...", "Your Weird Dreams Explained: No, You Shouldn't Get a Pet Panda", "Forward 2 10 ppl or u will drown in confetti 4 real", "President Barack Obama's Favorite Cat Videos", "The Results Are In! You are 96% Liz Lemon", "Mmmbop, Ba Duba Dop, Ba Du Bop, Ba Duba Dop", "~*~ rEmEmBeR tYpInG sHiT lIkE tHiS ~*~"];

},{}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L2NhY2hlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL2Rpc3QvbGlua3MuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9yZW5kZXIuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L3N0YXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2Nsb3Nlc3QuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL2xvb3AuanMvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy90YXJyeS5qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oMC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL3B1dHovaW5kZXguanMiLCJzcmMvanMvYXBwL2RhdGEuanMiLCJzcmMvanMvYXBwL2RhdGEvaW5kZXguanMiLCJzcmMvanMvYXBwL2VsZW1lbnRzLmpzIiwic3JjL2pzL2FwcC9naWZmZXIuanMiLCJzcmMvanMvYXBwL2luZGV4LmpzIiwic3JjL2pzL2luZGV4LmpzIiwic3JjL2pzL2xpYi9jb2xvcnMuanMiLCJzcmMvanMvbGliL2NvbnRhY3QuanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyIsInNyYy9qcy9saWIvc3ViamVjdGxpbmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LEtBQWpDOztBQUVBLE1BQUksQ0FBQyxFQUFMLEVBQVM7O0FBRVQsS0FBRyxLQUFILEVBQVUsRUFBQyxNQUFNLElBQVAsRUFBYSxPQUFPLEtBQXBCLEVBQVY7QUFDQSxLQUFHLE1BQUgsRUFBVyxVQUFYO0FBQ0QsQ0FQRDs7QUFTQSxJQUFNLE1BQU0sd0JBQVM7QUFDbkIsUUFBTTtBQURhLENBQVQsQ0FBWjs7QUFJQSxJQUFJLEVBQUosQ0FBTyxhQUFQLEVBQXNCLGdCQUFzQjtBQUFBLE1BQW5CLEtBQW1CLFFBQW5CLEtBQW1CO0FBQUEsTUFBWixLQUFZLFFBQVosS0FBWTs7QUFDMUMsa0JBQWdCLEtBQWhCLEVBQXVCLEtBQXZCO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJLEVBQUosQ0FBTyxrQkFBUCxFQUEyQjtBQUFBLFNBQU0sVUFBVSxPQUFPLEdBQVAsRUFBaEI7QUFBQSxDQUEzQjs7QUFFQSxPQUFPLEdBQVAsR0FBYSxHQUFiOztrQkFFZSxHOzs7Ozs7OztrQkMzQkEsczRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgY2FjaGUgPSB7fTtcblxuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBzZXQ6IGZ1bmN0aW9uIHNldChyb3V0ZSwgcmVzKSB7XG4gICAgY2FjaGUgPSBfZXh0ZW5kcyh7fSwgY2FjaGUsIF9kZWZpbmVQcm9wZXJ0eSh7fSwgcm91dGUsIHJlcykpO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIGdldChyb3V0ZSkge1xuICAgIHJldHVybiBjYWNoZVtyb3V0ZV07XG4gIH0sXG4gIGdldENhY2hlOiBmdW5jdGlvbiBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4gY2FjaGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGlzRHVwZSA9IGZ1bmN0aW9uIGlzRHVwZShzY3JpcHQsIGV4aXN0aW5nKSB7XG4gIHZhciBkdXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZXhpc3RpbmcubGVuZ3RoOyBpKyspIHtcbiAgICBzY3JpcHQuaXNFcXVhbE5vZGUoZXhpc3RpbmdbaV0pICYmIGR1cGVzLnB1c2goaSk7XG4gIH1cblxuICByZXR1cm4gZHVwZXMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChuZXdEb20sIGV4aXN0aW5nRG9tKSB7XG4gIHZhciBleGlzdGluZyA9IGV4aXN0aW5nRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgdmFyIHNjcmlwdHMgPSBuZXdEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0R1cGUoc2NyaXB0c1tpXSwgZXhpc3RpbmcpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHZhciBzcmMgPSBzY3JpcHRzW2ldLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdzcmMnKTtcblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHMuc3JjID0gc3JjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzLmlubmVySFRNTCA9IHNjcmlwdHNbaV0uaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocyk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxudmFyIF9kZWxlZ2F0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWxlZ2F0ZSk7XG5cbnZhciBfb3BlcmF0b3IgPSByZXF1aXJlKCcuL29wZXJhdG9yJyk7XG5cbnZhciBfb3BlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3BlcmF0b3IpO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciBfcmVmJHJvb3QgPSBfcmVmLnJvb3QsXG4gICAgICByb290ID0gX3JlZiRyb290ID09PSB1bmRlZmluZWQgPyBkb2N1bWVudC5ib2R5IDogX3JlZiRyb290LFxuICAgICAgX3JlZiRkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICBkdXJhdGlvbiA9IF9yZWYkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IDAgOiBfcmVmJGR1cmF0aW9uLFxuICAgICAgX3JlZiRoYW5kbGVycyA9IF9yZWYuaGFuZGxlcnMsXG4gICAgICBoYW5kbGVycyA9IF9yZWYkaGFuZGxlcnMgPT09IHVuZGVmaW5lZCA/IFtdIDogX3JlZiRoYW5kbGVycztcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVcbiAgICovXG4gIHZhciBvcGVyYXRvciA9IG5ldyBfb3BlcmF0b3IyLmRlZmF1bHQoe1xuICAgIHJvb3Q6IHJvb3QsXG4gICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgIGhhbmRsZXJzOiBoYW5kbGVyc1xuICB9KTtcblxuICAvKipcbiAgICogQm9vdHN0cmFwXG4gICAqL1xuICBvcGVyYXRvci5zZXRTdGF0ZSh7XG4gICAgcm91dGU6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gsXG4gICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBCaW5kIGFuZCB2YWxpZGF0ZSBhbGwgbGlua3NcbiAgICovXG4gICgwLCBfZGVsZWdhdGUyLmRlZmF1bHQpKGRvY3VtZW50LCAnYScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGFuY2hvciA9IGUuZGVsZWdhdGVUYXJnZXQ7XG4gICAgdmFyIGhyZWYgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nO1xuXG4gICAgdmFyIGludGVybmFsID0gX3VybC5saW5rLmlzU2FtZU9yaWdpbihocmVmKTtcbiAgICB2YXIgZXh0ZXJuYWwgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJztcbiAgICB2YXIgZGlzYWJsZWQgPSBhbmNob3IuY2xhc3NMaXN0LmNvbnRhaW5zKCduby1hamF4Jyk7XG4gICAgdmFyIGlnbm9yZWQgPSBvcGVyYXRvci52YWxpZGF0ZShlLCBocmVmKTtcbiAgICB2YXIgaGFzaCA9IF91cmwubGluay5pc0hhc2goaHJlZik7XG5cbiAgICBpZiAoIWludGVybmFsIHx8IGV4dGVybmFsIHx8IGRpc2FibGVkIHx8IGlnbm9yZWQgfHwgaGFzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChfdXJsLmxpbmsuaXNTYW1lVVJMKGhyZWYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3BlcmF0b3IuZ28oaHJlZik7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgcG9wc3RhdGVcbiAgICovXG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaHJlZiA9IGUudGFyZ2V0LmxvY2F0aW9uLmhyZWY7XG5cbiAgICBpZiAob3BlcmF0b3IudmFsaWRhdGUoZSwgaHJlZikpIHtcbiAgICAgIGlmIChfdXJsLmxpbmsuaXNIYXNoKGhyZWYpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3BzdGF0ZSBieXBhc3NlcyByb3V0ZXIsIHNvIHdlXG4gICAgICogbmVlZCB0byB0ZWxsIGl0IHdoZXJlIHdlIHdlbnQgdG9cbiAgICAgKiB3aXRob3V0IHB1c2hpbmcgc3RhdGVcbiAgICAgKi9cbiAgICBvcGVyYXRvci5nbyhocmVmLCBudWxsLCB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4gb3BlcmF0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbnZhciBhY3RpdmVMaW5rcyA9IFtdO1xuXG52YXIgdG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlKGJvb2wpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3RpdmVMaW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGFjdGl2ZUxpbmtzW2ldLmNsYXNzTGlzdFtib29sID8gJ2FkZCcgOiAncmVtb3ZlJ10oJ2lzLWFjdGl2ZScpO1xuICB9XG59O1xuXG4vLyBUT0RPIGRvIEkgbmVlZCB0byBlbXB0eSB0aGUgYXJyYXlcbi8vIG9yIGNhbiBJIGp1c3QgcmVzZXQgdG8gW11cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHJvdXRlKSB7XG4gIHRvZ2dsZShmYWxzZSk7XG5cbiAgYWN0aXZlTGlua3Muc3BsaWNlKDAsIGFjdGl2ZUxpbmtzLmxlbmd0aCk7XG4gIGFjdGl2ZUxpbmtzLnB1c2guYXBwbHkoYWN0aXZlTGlua3MsIF90b0NvbnN1bWFibGVBcnJheShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZiQ9XCInICsgcm91dGUgKyAnXCJdJykpKSk7XG5cbiAgdG9nZ2xlKHRydWUpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfbmFub2FqYXggPSByZXF1aXJlKCduYW5vYWpheCcpO1xuXG52YXIgX25hbm9hamF4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hbm9hamF4KTtcblxudmFyIF9uYXZpZ28gPSByZXF1aXJlKCduYXZpZ28nKTtcblxudmFyIF9uYXZpZ28yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmF2aWdvKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbiA9IHJlcXVpcmUoJ3Njcm9sbC1yZXN0b3JhdGlvbicpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Njcm9sbFJlc3RvcmF0aW9uKTtcblxudmFyIF9sb29wID0gcmVxdWlyZSgnbG9vcC5qcycpO1xuXG52YXIgX2xvb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9vcCk7XG5cbnZhciBfdXJsID0gcmVxdWlyZSgnLi91cmwnKTtcblxudmFyIF9saW5rcyA9IHJlcXVpcmUoJy4vbGlua3MnKTtcblxudmFyIF9saW5rczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saW5rcyk7XG5cbnZhciBfcmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcblxudmFyIF9yZW5kZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVuZGVyKTtcblxudmFyIF9zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcblxudmFyIF9zdGF0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGF0ZSk7XG5cbnZhciBfY2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5cbnZhciBfY2FjaGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FjaGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgcm91dGVyID0gbmV3IF9uYXZpZ28yLmRlZmF1bHQoX3VybC5vcmlnaW4pO1xuXG52YXIgT3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE9wZXJhdG9yKGNvbmZpZykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPcGVyYXRvcik7XG5cbiAgICB2YXIgZXZlbnRzID0gKDAsIF9sb29wMi5kZWZhdWx0KSgpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAvLyBjcmVhdGUgY3VycmllZCByZW5kZXIgZnVuY3Rpb25cbiAgICB0aGlzLnJlbmRlciA9ICgwLCBfcmVuZGVyMi5kZWZhdWx0KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KSwgY29uZmlnLCBldmVudHMuZW1pdCk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGV2ZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoT3BlcmF0b3IsIFt7XG4gICAga2V5OiAnc3RvcCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICBfc3RhdGUyLmRlZmF1bHQucGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzdGFydCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldFN0YXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgICByZXR1cm4gX3N0YXRlMi5kZWZhdWx0Ll9zdGF0ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRTdGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFN0YXRlKF9yZWYpIHtcbiAgICAgIHZhciByb3V0ZSA9IF9yZWYucm91dGUsXG4gICAgICAgICAgdGl0bGUgPSBfcmVmLnRpdGxlO1xuXG4gICAgICBfc3RhdGUyLmRlZmF1bHQucm91dGUgPSByb3V0ZSA9PT0gJycgPyAnLycgOiByb3V0ZTtcbiAgICAgIHRpdGxlID8gX3N0YXRlMi5kZWZhdWx0LnRpdGxlID0gdGl0bGUgOiBudWxsO1xuXG4gICAgICAoMCwgX2xpbmtzMi5kZWZhdWx0KShfc3RhdGUyLmRlZmF1bHQucm91dGUpO1xuXG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBocmVmXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlc29sdmUgVXNlIE5hdmlnby5yZXNvbHZlKCksIGJ5cGFzcyBOYXZpZ28ubmF2aWdhdGUoKVxuICAgICAqXG4gICAgICogUG9wc3RhdGUgY2hhbmdlcyB0aGUgVVJMIGZvciB1cywgc28gaWYgd2Ugd2VyZSB0b1xuICAgICAqIHJvdXRlci5uYXZpZ2F0ZSgpIHRvIHRoZSBwcmV2aW91cyBsb2NhdGlvbiwgaXQgd291bGQgcHVzaFxuICAgICAqIGEgZHVwbGljYXRlIHJvdXRlIHRvIGhpc3RvcnkgYW5kIHdlIHdvdWxkIGNyZWF0ZSBhIGxvb3AuXG4gICAgICpcbiAgICAgKiByb3V0ZXIucmVzb2x2ZSgpIGxldCdzIE5hdmlnbyBrbm93IHdlJ3ZlIG1vdmVkLCB3aXRob3V0XG4gICAgICogYWx0ZXJpbmcgaGlzdG9yeS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ28nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnbyhocmVmKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICB2YXIgcmVzb2x2ZSA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgaWYgKF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjayh0aXRsZSkge1xuICAgICAgICB2YXIgcmVzID0ge1xuICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfTtcblxuICAgICAgICByZXNvbHZlID8gcm91dGVyLnJlc29sdmUocm91dGUpIDogcm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcblxuICAgICAgICBfc2Nyb2xsUmVzdG9yYXRpb24yLmRlZmF1bHQucmVzdG9yZSgpO1xuXG4gICAgICAgIF90aGlzLnNldFN0YXRlKHJlcyk7XG5cbiAgICAgICAgX3RoaXMuZW1pdCgncm91dGU6YWZ0ZXInLCByZXMpO1xuXG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfdXJsLnNhbml0aXplKShocmVmKTtcblxuICAgICAgaWYgKCFyZXNvbHZlKSB7XG4gICAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5zYXZlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWNoZWQgPSBfY2FjaGUyLmRlZmF1bHQuZ2V0KHJvdXRlKTtcblxuICAgICAgdGhpcy5lbWl0KCdyb3V0ZTpiZWZvcmUnLCB7IHJvdXRlOiByb3V0ZSB9KTtcblxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIocm91dGUsIGNhY2hlZCwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdldChyb3V0ZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldChyb3V0ZSwgY2IpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gX25hbm9hamF4Mi5kZWZhdWx0LmFqYXgoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6IF91cmwub3JpZ2luICsgJy8nICsgcm91dGVcbiAgICAgIH0sIGZ1bmN0aW9uIChzdGF0dXMsIHJlcywgcmVxKSB7XG4gICAgICAgIGlmIChyZXEuc3RhdHVzIDwgMjAwIHx8IHJlcS5zdGF0dXMgPiAzMDAgJiYgcmVxLnN0YXR1cyAhPT0gMzA0KSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gX3VybC5vcmlnaW4gKyAnLycgKyBfc3RhdGUyLmRlZmF1bHQucHJldi5yb3V0ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfY2FjaGUyLmRlZmF1bHQuc2V0KHJvdXRlLCByZXEucmVzcG9uc2UpO1xuXG4gICAgICAgIF90aGlzMi5yZW5kZXIocm91dGUsIHJlcS5yZXNwb25zZSwgY2IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncHVzaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1c2goKSB7XG4gICAgICB2YXIgcm91dGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9zdGF0ZTIuZGVmYXVsdC50aXRsZTtcblxuICAgICAgaWYgKCFyb3V0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3V0ZTogcm91dGUsIHRpdGxlOiB0aXRsZSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd2YWxpZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHZhciBldmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciBocmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfc3RhdGUyLmRlZmF1bHQucm91dGU7XG5cbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfdXJsLnNhbml0aXplKShocmVmKTtcblxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmhhbmRsZXJzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0KSkge1xuICAgICAgICAgIHZhciByZXMgPSB0WzFdKHJvdXRlKTtcbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBfdGhpczMuZW1pdCh0WzBdLCB7XG4gICAgICAgICAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdChyb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE9wZXJhdG9yO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBPcGVyYXRvcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdGFycnkgPSByZXF1aXJlKCd0YXJyeS5qcycpO1xuXG52YXIgX2V2YWwgPSByZXF1aXJlKCcuL2V2YWwuanMnKTtcblxudmFyIF9ldmFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V2YWwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBTdHJpbmdpZmllZCBIVE1MXG4gKiBAcmV0dXJuIHtvYmplY3R9IERPTSBub2RlLCAjcGFnZVxuICovXG52YXIgcGFyc2VSZXNwb25zZSA9IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoaHRtbCkge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYWdlIFJvb3QgYXBwbGljYXRpb24gRE9NIG5vZGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgRHVyYXRpb24gYW5kIHJvb3Qgbm9kZSBzZWxlY3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZW1pdCBFbWl0dGVyIGZ1bmN0aW9uIGZyb20gT3BlcmF0b3IgaW5zdGFuY2VcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgTmV3IG1hcmt1cCBmcm9tIEFKQVggcmVzcG9uc2VcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrXG4gKi9cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHBhZ2UsIF9yZWYsIGVtaXQpIHtcbiAgdmFyIGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbixcbiAgICAgIHJvb3QgPSBfcmVmLnJvb3Q7XG4gIHJldHVybiBmdW5jdGlvbiAocm91dGUsIG1hcmt1cCwgY2IpIHtcbiAgICB2YXIgcmVzID0gcGFyc2VSZXNwb25zZShtYXJrdXApO1xuICAgIHZhciB0aXRsZSA9IHJlcy50aXRsZTtcblxuICAgIHZhciBzdGFydCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YmVmb3JlJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSBwYWdlLmNsaWVudEhlaWdodCArICdweCc7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVuZGVyID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgcGFnZS5pbm5lckhUTUwgPSByZXMucXVlcnlTZWxlY3Rvcihyb290KS5pbm5lckhUTUw7XG4gICAgICAoMCwgX2V2YWwyLmRlZmF1bHQpKHJlcywgZG9jdW1lbnQpO1xuICAgIH0pO1xuXG4gICAgdmFyIGVuZCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNiKHRpdGxlKTtcbiAgICAgIHBhZ2Uuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgICAgZW1pdCgndHJhbnNpdGlvbjphZnRlcicsIHsgcm91dGU6IHJvdXRlIH0pO1xuICAgIH0pO1xuXG4gICAgKDAsIF90YXJyeS5xdWV1ZSkoc3RhcnQoMCksIHJlbmRlcihkdXJhdGlvbiksIGVuZCgwKSkoKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBwYXVzZWQ6IGZhbHNlLFxuICBfc3RhdGU6IHtcbiAgICByb3V0ZTogJycsXG4gICAgdGl0bGU6ICcnLFxuICAgIHByZXY6IHtcbiAgICAgIHJvdXRlOiAnLycsXG4gICAgICB0aXRsZTogJydcbiAgICB9XG4gIH0sXG4gIGdldCByb3V0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucm91dGU7XG4gIH0sXG4gIHNldCByb3V0ZShsb2MpIHtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnJvdXRlID0gdGhpcy5yb3V0ZTtcbiAgICB0aGlzLl9zdGF0ZS5yb3V0ZSA9IGxvYztcbiAgfSxcbiAgZ2V0IHRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS50aXRsZTtcbiAgfSxcbiAgc2V0IHRpdGxlKHZhbCkge1xuICAgIHRoaXMuX3N0YXRlLnByZXYudGl0bGUgPSB0aGlzLnRpdGxlO1xuICAgIHRoaXMuX3N0YXRlLnRpdGxlID0gdmFsO1xuICB9LFxuICBnZXQgcHJldigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucHJldjtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgZ2V0T3JpZ2luID0gZnVuY3Rpb24gZ2V0T3JpZ2luKGxvY2F0aW9uKSB7XG4gIHZhciBwcm90b2NvbCA9IGxvY2F0aW9uLnByb3RvY29sLFxuICAgICAgaG9zdCA9IGxvY2F0aW9uLmhvc3Q7XG5cbiAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArIGhvc3Q7XG59O1xuXG52YXIgcGFyc2VVUkwgPSBmdW5jdGlvbiBwYXJzZVVSTCh1cmwpIHtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGEuaHJlZiA9IHVybDtcbiAgcmV0dXJuIGE7XG59O1xuXG52YXIgb3JpZ2luID0gZXhwb3J0cy5vcmlnaW4gPSBnZXRPcmlnaW4od2luZG93LmxvY2F0aW9uKTtcblxudmFyIG9yaWdpblJlZ0V4ID0gbmV3IFJlZ0V4cChvcmlnaW4pO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgUmF3IFVSTCB0byBwYXJzZVxuICogQHJldHVybiB7c3RyaW5nfSBVUkwgc2FucyBvcmlnaW4gYW5kIHNhbnMgbGVhZGluZyBzbGFzaFxuICovXG52YXIgc2FuaXRpemUgPSBleHBvcnRzLnNhbml0aXplID0gZnVuY3Rpb24gc2FuaXRpemUodXJsKSB7XG4gIHZhciByb3V0ZSA9IHVybC5yZXBsYWNlKG9yaWdpblJlZ0V4LCAnJyk7XG4gIHJldHVybiByb3V0ZS5tYXRjaCgvXlxcLy8pID8gcm91dGUucmVwbGFjZSgvXFwvezF9LywgJycpIDogcm91dGU7IC8vIHJlbW92ZSAvIGFuZCByZXR1cm5cbn07XG5cbnZhciBsaW5rID0gZXhwb3J0cy5saW5rID0ge1xuICBpc1NhbWVPcmlnaW46IGZ1bmN0aW9uIGlzU2FtZU9yaWdpbihocmVmKSB7XG4gICAgcmV0dXJuIG9yaWdpbiA9PT0gZ2V0T3JpZ2luKHBhcnNlVVJMKGhyZWYpKTtcbiAgfSxcbiAgaXNIYXNoOiBmdW5jdGlvbiBpc0hhc2goaHJlZikge1xuICAgIHJldHVybiAoLyMvLnRlc3QoaHJlZilcbiAgICApO1xuICB9LFxuICBpc1NhbWVVUkw6IGZ1bmN0aW9uIGlzU2FtZVVSTChocmVmKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPT09IHBhcnNlVVJMKGhyZWYpLnNlYXJjaCAmJiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IHBhcnNlVVJMKGhyZWYpLnBhdGhuYW1lO1xuICB9XG59OyIsInZhciBET0NVTUVOVF9OT0RFX1RZUEUgPSA5O1xuXG4vKipcbiAqIEEgcG9seWZpbGwgZm9yIEVsZW1lbnQubWF0Y2hlcygpXG4gKi9cbmlmICh0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcbiAgICB2YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuICAgIHByb3RvLm1hdGNoZXMgPSBwcm90by5tYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm9NYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBjbG9zZXN0IHBhcmVudCB0aGF0IG1hdGNoZXMgYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGNsb3Nlc3QgKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSAhPT0gRE9DVU1FTlRfTk9ERV9UWVBFKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvc2VzdDtcbiIsInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBsaXN0ZW5lckZuID0gbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEZpbmRzIGNsb3Nlc3QgbWF0Y2ggYW5kIGludm9rZXMgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGxpc3RlbmVyKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3Rvcik7XG5cbiAgICAgICAgaWYgKGUuZGVsZWdhdGVUYXJnZXQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZWxlbWVudCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIGxpc3RlbmVycyA9IHt9O1xuXG4gIHZhciBvbiA9IGZ1bmN0aW9uIG9uKGUpIHtcbiAgICB2YXIgY2IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cbiAgICBpZiAoIWNiKSByZXR1cm47XG4gICAgbGlzdGVuZXJzW2VdID0gbGlzdGVuZXJzW2VdIHx8IHsgcXVldWU6IFtdIH07XG4gICAgbGlzdGVuZXJzW2VdLnF1ZXVlLnB1c2goY2IpO1xuICB9O1xuXG4gIHZhciBlbWl0ID0gZnVuY3Rpb24gZW1pdChlKSB7XG4gICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cbiAgICB2YXIgaXRlbXMgPSBsaXN0ZW5lcnNbZV0gPyBsaXN0ZW5lcnNbZV0ucXVldWUgOiBmYWxzZTtcbiAgICBpdGVtcyAmJiBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICByZXR1cm4gaShkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMoe30sIG8sIHtcbiAgICBlbWl0OiBlbWl0LFxuICAgIG9uOiBvblxuICB9KTtcbn07IiwiLy8gQmVzdCBwbGFjZSB0byBmaW5kIGluZm9ybWF0aW9uIG9uIFhIUiBmZWF0dXJlcyBpczpcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9YTUxIdHRwUmVxdWVzdFxuXG52YXIgcmVxZmllbGRzID0gW1xuICAncmVzcG9uc2VUeXBlJywgJ3dpdGhDcmVkZW50aWFscycsICd0aW1lb3V0JywgJ29ucHJvZ3Jlc3MnXG5dXG5cbi8vIFNpbXBsZSBhbmQgc21hbGwgYWpheCBmdW5jdGlvblxuLy8gVGFrZXMgYSBwYXJhbWV0ZXJzIG9iamVjdCBhbmQgYSBjYWxsYmFjayBmdW5jdGlvblxuLy8gUGFyYW1ldGVyczpcbi8vICAtIHVybDogc3RyaW5nLCByZXF1aXJlZFxuLy8gIC0gaGVhZGVyczogb2JqZWN0IG9mIGB7aGVhZGVyX25hbWU6IGhlYWRlcl92YWx1ZSwgLi4ufWBcbi8vICAtIGJvZHk6XG4vLyAgICAgICsgc3RyaW5nIChzZXRzIGNvbnRlbnQgdHlwZSB0byAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyBpZiBub3Qgc2V0IGluIGhlYWRlcnMpXG4vLyAgICAgICsgRm9ybURhdGEgKGRvZXNuJ3Qgc2V0IGNvbnRlbnQgdHlwZSBzbyB0aGF0IGJyb3dzZXIgd2lsbCBzZXQgYXMgYXBwcm9wcmlhdGUpXG4vLyAgLSBtZXRob2Q6ICdHRVQnLCAnUE9TVCcsIGV0Yy4gRGVmYXVsdHMgdG8gJ0dFVCcgb3IgJ1BPU1QnIGJhc2VkIG9uIGJvZHlcbi8vICAtIGNvcnM6IElmIHlvdXIgdXNpbmcgY3Jvc3Mtb3JpZ2luLCB5b3Ugd2lsbCBuZWVkIHRoaXMgdHJ1ZSBmb3IgSUU4LTlcbi8vXG4vLyBUaGUgZm9sbG93aW5nIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCBvbnRvIHRoZSB4aHIgb2JqZWN0LlxuLy8gSU1QT1JUQU5UIE5PVEU6IFRoZSBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGNvbXBhdGliaWxpdHkgY2hlY2tpbmcuXG4vLyAgLSByZXNwb25zZVR5cGU6IHN0cmluZywgdmFyaW91cyBjb21wYXRhYmlsaXR5LCBzZWUgeGhyIGRvY3MgZm9yIGVudW0gb3B0aW9uc1xuLy8gIC0gd2l0aENyZWRlbnRpYWxzOiBib29sZWFuLCBJRTEwKywgQ09SUyBvbmx5XG4vLyAgLSB0aW1lb3V0OiBsb25nLCBtcyB0aW1lb3V0LCBJRTgrXG4vLyAgLSBvbnByb2dyZXNzOiBjYWxsYmFjaywgSUUxMCtcbi8vXG4vLyBDYWxsYmFjayBmdW5jdGlvbiBwcm90b3R5cGU6XG4vLyAgLSBzdGF0dXNDb2RlIGZyb20gcmVxdWVzdFxuLy8gIC0gcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVzcG9uc2VUeXBlIHNldCBhbmQgc3VwcG9ydGVkIGJ5IGJyb3dzZXIsIHRoaXMgaXMgYW4gb2JqZWN0IG9mIHNvbWUgdHlwZSAoc2VlIGRvY3MpXG4vLyAgICArIG90aGVyd2lzZSBpZiByZXF1ZXN0IGNvbXBsZXRlZCwgdGhpcyBpcyB0aGUgc3RyaW5nIHRleHQgb2YgdGhlIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlcXVlc3QgaXMgYWJvcnRlZCwgdGhpcyBpcyBcIkFib3J0XCJcbi8vICAgICsgaWYgcmVxdWVzdCB0aW1lcyBvdXQsIHRoaXMgaXMgXCJUaW1lb3V0XCJcbi8vICAgICsgaWYgcmVxdWVzdCBlcnJvcnMgYmVmb3JlIGNvbXBsZXRpbmcgKHByb2JhYmx5IGEgQ09SUyBpc3N1ZSksIHRoaXMgaXMgXCJFcnJvclwiXG4vLyAgLSByZXF1ZXN0IG9iamVjdFxuLy9cbi8vIFJldHVybnMgdGhlIHJlcXVlc3Qgb2JqZWN0LiBTbyB5b3UgY2FuIGNhbGwgLmFib3J0KCkgb3Igb3RoZXIgbWV0aG9kc1xuLy9cbi8vIERFUFJFQ0FUSU9OUzpcbi8vICAtIFBhc3NpbmcgYSBzdHJpbmcgaW5zdGVhZCBvZiB0aGUgcGFyYW1zIG9iamVjdCBoYXMgYmVlbiByZW1vdmVkIVxuLy9cbmV4cG9ydHMuYWpheCA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIC8vIEFueSB2YXJpYWJsZSB1c2VkIG1vcmUgdGhhbiBvbmNlIGlzIHZhcidkIGhlcmUgYmVjYXVzZVxuICAvLyBtaW5pZmljYXRpb24gd2lsbCBtdW5nZSB0aGUgdmFyaWFibGVzIHdoZXJlYXMgaXQgY2FuJ3QgbXVuZ2VcbiAgLy8gdGhlIG9iamVjdCBhY2Nlc3MuXG4gIHZhciBoZWFkZXJzID0gcGFyYW1zLmhlYWRlcnMgfHwge31cbiAgICAsIGJvZHkgPSBwYXJhbXMuYm9keVxuICAgICwgbWV0aG9kID0gcGFyYW1zLm1ldGhvZCB8fCAoYm9keSA/ICdQT1NUJyA6ICdHRVQnKVxuICAgICwgY2FsbGVkID0gZmFsc2VcblxuICB2YXIgcmVxID0gZ2V0UmVxdWVzdChwYXJhbXMuY29ycylcblxuICBmdW5jdGlvbiBjYihzdGF0dXNDb2RlLCByZXNwb25zZVRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgY2FsbGJhY2socmVxLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gc3RhdHVzQ29kZSA6IHJlcS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgIHJlcS5zdGF0dXMgPT09IDAgPyBcIkVycm9yXCIgOiAocmVxLnJlc3BvbnNlIHx8IHJlcS5yZXNwb25zZVRleHQgfHwgcmVzcG9uc2VUZXh0KSxcbiAgICAgICAgICAgICAgICAgcmVxKVxuICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVxLm9wZW4obWV0aG9kLCBwYXJhbXMudXJsLCB0cnVlKVxuXG4gIHZhciBzdWNjZXNzID0gcmVxLm9ubG9hZCA9IGNiKDIwMClcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHN1Y2Nlc3MoKVxuICB9XG4gIHJlcS5vbmVycm9yID0gY2IobnVsbCwgJ0Vycm9yJylcbiAgcmVxLm9udGltZW91dCA9IGNiKG51bGwsICdUaW1lb3V0JylcbiAgcmVxLm9uYWJvcnQgPSBjYihudWxsLCAnQWJvcnQnKVxuXG4gIGlmIChib2R5KSB7XG4gICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpXG5cbiAgICBpZiAoIWdsb2JhbC5Gb3JtRGF0YSB8fCAhKGJvZHkgaW5zdGFuY2VvZiBnbG9iYWwuRm9ybURhdGEpKSB7XG4gICAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVxZmllbGRzLmxlbmd0aCwgZmllbGQ7IGkgPCBsZW47IGkrKykge1xuICAgIGZpZWxkID0gcmVxZmllbGRzW2ldXG4gICAgaWYgKHBhcmFtc1tmaWVsZF0gIT09IHVuZGVmaW5lZClcbiAgICAgIHJlcVtmaWVsZF0gPSBwYXJhbXNbZmllbGRdXG4gIH1cblxuICBmb3IgKHZhciBmaWVsZCBpbiBoZWFkZXJzKVxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCBoZWFkZXJzW2ZpZWxkXSlcblxuICByZXEuc2VuZChib2R5KVxuXG4gIHJldHVybiByZXFcbn1cblxuZnVuY3Rpb24gZ2V0UmVxdWVzdChjb3JzKSB7XG4gIC8vIFhEb21haW5SZXF1ZXN0IGlzIG9ubHkgd2F5IHRvIGRvIENPUlMgaW4gSUUgOCBhbmQgOVxuICAvLyBCdXQgWERvbWFpblJlcXVlc3QgaXNuJ3Qgc3RhbmRhcmRzLWNvbXBhdGlibGVcbiAgLy8gTm90YWJseSwgaXQgZG9lc24ndCBhbGxvdyBjb29raWVzIHRvIGJlIHNlbnQgb3Igc2V0IGJ5IHNlcnZlcnNcbiAgLy8gSUUgMTArIGlzIHN0YW5kYXJkcy1jb21wYXRpYmxlIGluIGl0cyBYTUxIdHRwUmVxdWVzdFxuICAvLyBidXQgSUUgMTAgY2FuIHN0aWxsIGhhdmUgYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0LCBzbyB3ZSBkb24ndCB3YW50IHRvIHVzZSBpdFxuICBpZiAoY29ycyAmJiBnbG9iYWwuWERvbWFpblJlcXVlc3QgJiYgIS9NU0lFIDEvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpXG4gICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdFxuICBpZiAoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KVxuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Rcbn1cblxuZnVuY3Rpb24gc2V0RGVmYXVsdChvYmosIGtleSwgdmFsdWUpIHtcbiAgb2JqW2tleV0gPSBvYmpba2V5XSB8fCB2YWx1ZVxufVxuIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJOYXZpZ29cIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXHRcblx0dmFyIFBBUkFNRVRFUl9SRUdFWFAgPSAvKFs6Kl0pKFxcdyspL2c7XG5cdHZhciBXSUxEQ0FSRF9SRUdFWFAgPSAvXFwqL2c7XG5cdHZhciBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUCA9ICcoW15cXC9dKyknO1xuXHR2YXIgUkVQTEFDRV9XSUxEQ0FSRCA9ICcoPzouKiknO1xuXHR2YXIgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQID0gJyg/OlxcLyR8JCknO1xuXHRcblx0ZnVuY3Rpb24gY2xlYW4ocykge1xuXHQgIGlmIChzIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gcztcblx0ICByZXR1cm4gcy5yZXBsYWNlKC9cXC8rJC8sICcnKS5yZXBsYWNlKC9eXFwvKy8sICcvJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlZ0V4cFJlc3VsdFRvUGFyYW1zKG1hdGNoLCBuYW1lcykge1xuXHQgIGlmIChuYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHQgIGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuXHQgIHJldHVybiBtYXRjaC5zbGljZSgxLCBtYXRjaC5sZW5ndGgpLnJlZHVjZShmdW5jdGlvbiAocGFyYW1zLCB2YWx1ZSwgaW5kZXgpIHtcblx0ICAgIGlmIChwYXJhbXMgPT09IG51bGwpIHBhcmFtcyA9IHt9O1xuXHQgICAgcGFyYW1zW25hbWVzW2luZGV4XV0gPSB2YWx1ZTtcblx0ICAgIHJldHVybiBwYXJhbXM7XG5cdCAgfSwgbnVsbCk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUpIHtcblx0ICB2YXIgcGFyYW1OYW1lcyA9IFtdLFxuXHQgICAgICByZWdleHA7XG5cdFxuXHQgIGlmIChyb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHQgICAgcmVnZXhwID0gcm91dGU7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoY2xlYW4ocm91dGUpLnJlcGxhY2UoUEFSQU1FVEVSX1JFR0VYUCwgZnVuY3Rpb24gKGZ1bGwsIGRvdHMsIG5hbWUpIHtcblx0ICAgICAgcGFyYW1OYW1lcy5wdXNoKG5hbWUpO1xuXHQgICAgICByZXR1cm4gUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFA7XG5cdCAgICB9KS5yZXBsYWNlKFdJTERDQVJEX1JFR0VYUCwgUkVQTEFDRV9XSUxEQ0FSRCkgKyBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFApO1xuXHQgIH1cblx0ICByZXR1cm4geyByZWdleHA6IHJlZ2V4cCwgcGFyYW1OYW1lczogcGFyYW1OYW1lcyB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBnZXRVcmxEZXB0aCh1cmwpIHtcblx0ICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyQvLCAnJykuc3BsaXQoJy8nKS5sZW5ndGg7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGNvbXBhcmVVcmxEZXB0aCh1cmxBLCB1cmxCKSB7XG5cdCAgcmV0dXJuIGdldFVybERlcHRoKHVybEEpIDwgZ2V0VXJsRGVwdGgodXJsQik7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZpbmRNYXRjaGVkUm91dGVzKHVybCkge1xuXHQgIHZhciByb3V0ZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgcmV0dXJuIHJvdXRlcy5tYXAoZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICB2YXIgX3JlcGxhY2VEeW5hbWljVVJMUGFyID0gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgdmFyIHJlZ2V4cCA9IF9yZXBsYWNlRHluYW1pY1VSTFBhci5yZWdleHA7XG5cdCAgICB2YXIgcGFyYW1OYW1lcyA9IF9yZXBsYWNlRHluYW1pY1VSTFBhci5wYXJhbU5hbWVzO1xuXHRcblx0ICAgIHZhciBtYXRjaCA9IHVybC5tYXRjaChyZWdleHApO1xuXHQgICAgdmFyIHBhcmFtcyA9IHJlZ0V4cFJlc3VsdFRvUGFyYW1zKG1hdGNoLCBwYXJhbU5hbWVzKTtcblx0XG5cdCAgICByZXR1cm4gbWF0Y2ggPyB7IG1hdGNoOiBtYXRjaCwgcm91dGU6IHJvdXRlLCBwYXJhbXM6IHBhcmFtcyB9IDogZmFsc2U7XG5cdCAgfSkuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG5cdCAgICByZXR1cm4gbTtcblx0ICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gbWF0Y2godXJsLCByb3V0ZXMpIHtcblx0ICByZXR1cm4gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMpWzBdIHx8IGZhbHNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByb290KHVybCwgcm91dGVzKSB7XG5cdCAgdmFyIG1hdGNoZWQgPSBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICB2YXIgdSA9IGNsZWFuKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICByZXR1cm4gdSAhPT0gJycgJiYgdSAhPT0gJyonO1xuXHQgIH0pKTtcblx0ICB2YXIgZmFsbGJhY2tVUkwgPSBjbGVhbih1cmwpO1xuXHRcblx0ICBpZiAobWF0Y2hlZC5sZW5ndGggPiAwKSB7XG5cdCAgICByZXR1cm4gbWF0Y2hlZC5tYXAoZnVuY3Rpb24gKG0pIHtcblx0ICAgICAgcmV0dXJuIGNsZWFuKHVybC5zdWJzdHIoMCwgbS5tYXRjaC5pbmRleCkpO1xuXHQgICAgfSkucmVkdWNlKGZ1bmN0aW9uIChyb290LCBjdXJyZW50KSB7XG5cdCAgICAgIHJldHVybiBjdXJyZW50Lmxlbmd0aCA8IHJvb3QubGVuZ3RoID8gY3VycmVudCA6IHJvb3Q7XG5cdCAgICB9LCBmYWxsYmFja1VSTCk7XG5cdCAgfVxuXHQgIHJldHVybiBmYWxsYmFja1VSTDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gaXNQdXNoU3RhdGVBdmFpbGFibGUoKSB7XG5cdCAgcmV0dXJuICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlbW92ZUdFVFBhcmFtcyh1cmwpIHtcblx0ICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcPyguKik/JC8sICcnKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gTmF2aWdvKHIsIHVzZUhhc2gpIHtcblx0ICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICB0aGlzLnJvb3QgPSB1c2VIYXNoICYmIHIgPyByLnJlcGxhY2UoL1xcLyQvLCAnLyMnKSA6IHIgfHwgbnVsbDtcblx0ICB0aGlzLl91c2VIYXNoID0gdXNlSGFzaDtcblx0ICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IG51bGw7XG5cdCAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fb2sgPSAhdXNlSGFzaCAmJiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpO1xuXHQgIHRoaXMuX2xpc3RlbigpO1xuXHQgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG5cdH1cblx0XG5cdE5hdmlnby5wcm90b3R5cGUgPSB7XG5cdCAgaGVscGVyczoge1xuXHQgICAgbWF0Y2g6IG1hdGNoLFxuXHQgICAgcm9vdDogcm9vdCxcblx0ICAgIGNsZWFuOiBjbGVhblxuXHQgIH0sXG5cdCAgbmF2aWdhdGU6IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGgsIGFic29sdXRlKSB7XG5cdCAgICB2YXIgdG87XG5cdFxuXHQgICAgcGF0aCA9IHBhdGggfHwgJyc7XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgdG8gPSAoIWFic29sdXRlID8gdGhpcy5fZ2V0Um9vdCgpICsgJy8nIDogJycpICsgY2xlYW4ocGF0aCk7XG5cdCAgICAgIHRvID0gdG8ucmVwbGFjZSgvKFteOl0pKFxcL3syLH0pL2csICckMS8nKTtcblx0ICAgICAgaGlzdG9yeVt0aGlzLl9wYXVzZWQgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7fSwgJycsIHRvKTtcblx0ICAgICAgdGhpcy5yZXNvbHZlKCk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvIyguKikkLywgJycpICsgJyMnICsgcGF0aDtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgb246IGZ1bmN0aW9uIG9uKCkge1xuXHQgICAgdmFyIF90aGlzID0gdGhpcztcblx0XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIGlmIChhcmdzLmxlbmd0aCA+PSAyKSB7XG5cdCAgICAgIHRoaXMuX2FkZChhcmdzWzBdLCBhcmdzWzFdKTtcblx0ICAgIH0gZWxzZSBpZiAoX3R5cGVvZihhcmdzWzBdKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgdmFyIG9yZGVyZWRSb3V0ZXMgPSBPYmplY3Qua2V5cyhhcmdzWzBdKS5zb3J0KGNvbXBhcmVVcmxEZXB0aCk7XG5cdFxuXHQgICAgICBvcmRlcmVkUm91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICAgICAgX3RoaXMuX2FkZChyb3V0ZSwgYXJnc1swXVtyb3V0ZV0pO1xuXHQgICAgICB9KTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBhcmdzWzBdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBub3RGb3VuZDogZnVuY3Rpb24gbm90Rm91bmQoaGFuZGxlcikge1xuXHQgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gaGFuZGxlcjtcblx0ICB9LFxuXHQgIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoY3VycmVudCkge1xuXHQgICAgdmFyIGhhbmRsZXIsIG07XG5cdCAgICB2YXIgdXJsID0gKGN1cnJlbnQgfHwgdGhpcy5fY0xvYygpKS5yZXBsYWNlKHRoaXMuX2dldFJvb3QoKSwgJycpO1xuXHRcblx0ICAgIGlmICh0aGlzLl9wYXVzZWQgfHwgdXJsID09PSB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCkgcmV0dXJuIGZhbHNlO1xuXHQgICAgaWYgKHRoaXMuX3VzZUhhc2gpIHtcblx0ICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8jLywgJy8nKTtcblx0ICAgIH1cblx0ICAgIHVybCA9IHJlbW92ZUdFVFBhcmFtcyh1cmwpO1xuXHQgICAgbSA9IG1hdGNoKHVybCwgdGhpcy5fcm91dGVzKTtcblx0XG5cdCAgICBpZiAobSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgaGFuZGxlciA9IG0ucm91dGUuaGFuZGxlcjtcblx0ICAgICAgbS5yb3V0ZS5yb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IGhhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBfdG9Db25zdW1hYmxlQXJyYXkobS5tYXRjaC5zbGljZSgxLCBtLm1hdGNoLmxlbmd0aCkpKSA6IGhhbmRsZXIobS5wYXJhbXMpO1xuXHQgICAgICByZXR1cm4gbTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmYXVsdEhhbmRsZXIgJiYgKHVybCA9PT0gJycgfHwgdXJsID09PSAnLycpKSB7XG5cdCAgICAgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gdXJsO1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlcigpO1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fbm90Rm91bmRIYW5kbGVyKSB7XG5cdCAgICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlcigpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH0sXG5cdCAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0ICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcblx0ICAgIGNsZWFyVGltZW91dCh0aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwpO1xuXHQgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cub25wb3BzdGF0ZSA9IG51bGwgOiBudWxsO1xuXHQgIH0sXG5cdCAgdXBkYXRlUGFnZUxpbmtzOiBmdW5jdGlvbiB1cGRhdGVQYWdlTGlua3MoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHQgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcblx0XG5cdCAgICB0aGlzLl9maW5kTGlua3MoKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdCAgICAgIGlmICghbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkKSB7XG5cdCAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdCAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXHRcblx0ICAgICAgICAgIGlmICghc2VsZi5fZGVzdHJveWVkKSB7XG5cdCAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgc2VsZi5uYXZpZ2F0ZShjbGVhbihsb2NhdGlvbikpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIGxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH0sXG5cdCAgZ2VuZXJhdGU6IGZ1bmN0aW9uIGdlbmVyYXRlKG5hbWUpIHtcblx0ICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgcmV0dXJuIHRoaXMuX3JvdXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcm91dGUpIHtcblx0ICAgICAgdmFyIGtleTtcblx0XG5cdCAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBuYW1lKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gcm91dGUucm91dGU7XG5cdCAgICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJzonICsga2V5LCBkYXRhW2tleV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSwgJycpO1xuXHQgIH0sXG5cdCAgbGluazogZnVuY3Rpb24gbGluayhwYXRoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0Um9vdCgpICsgcGF0aDtcblx0ICB9LFxuXHQgIHBhdXNlOiBmdW5jdGlvbiBwYXVzZShzdGF0dXMpIHtcblx0ICAgIHRoaXMuX3BhdXNlZCA9IHN0YXR1cztcblx0ICB9LFxuXHQgIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZTogZnVuY3Rpb24gZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlKCkge1xuXHQgICAgaWYgKCFpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpKSB7XG5cdCAgICAgIHRoaXMuZGVzdHJveSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2FkZDogZnVuY3Rpb24gX2FkZChyb3V0ZSkge1xuXHQgICAgdmFyIGhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIGlmICgodHlwZW9mIGhhbmRsZXIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGhhbmRsZXIpKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIudXNlcywgbmFtZTogaGFuZGxlci5hcyB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyIH0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXMuX2FkZDtcblx0ICB9LFxuXHQgIF9nZXRSb290OiBmdW5jdGlvbiBfZ2V0Um9vdCgpIHtcblx0ICAgIGlmICh0aGlzLnJvb3QgIT09IG51bGwpIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgICB0aGlzLnJvb3QgPSByb290KHRoaXMuX2NMb2MoKSwgdGhpcy5fcm91dGVzKTtcblx0ICAgIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgfSxcblx0ICBfbGlzdGVuOiBmdW5jdGlvbiBfbGlzdGVuKCkge1xuXHQgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cdFxuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIF90aGlzMi5yZXNvbHZlKCk7XG5cdCAgICAgIH07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciBjYWNoZWQgPSBfdGhpczIuX2NMb2MoKSxcblx0ICAgICAgICAgICAgY3VycmVudCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICAgICAgX2NoZWNrID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgICBfY2hlY2sgPSBmdW5jdGlvbiBjaGVjaygpIHtcblx0ICAgICAgICAgIGN1cnJlbnQgPSBfdGhpczIuX2NMb2MoKTtcblx0ICAgICAgICAgIGlmIChjYWNoZWQgIT09IGN1cnJlbnQpIHtcblx0ICAgICAgICAgICAgY2FjaGVkID0gY3VycmVudDtcblx0ICAgICAgICAgICAgX3RoaXMyLnJlc29sdmUoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIF90aGlzMi5fbGlzdGVubmluZ0ludGVydmFsID0gc2V0VGltZW91dChfY2hlY2ssIDIwMCk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgICBfY2hlY2soKTtcblx0ICAgICAgfSkoKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9jTG9jOiBmdW5jdGlvbiBfY0xvYygpIHtcblx0ICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gJyc7XG5cdCAgfSxcblx0ICBfZmluZExpbmtzOiBmdW5jdGlvbiBfZmluZExpbmtzKCkge1xuXHQgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmF2aWdvXScpKTtcblx0ICB9XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBOYXZpZ287XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uYXZpZ28uanMubWFwIiwiJ3VzZSBzdHJpY3QnO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCdfX2VzTW9kdWxlJyx7dmFsdWU6ITB9KTt2YXIgc2Nyb2xsPWZ1bmN0aW9uKGEpe3JldHVybiB3aW5kb3cuc2Nyb2xsVG8oMCxhKX0sc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gaGlzdG9yeS5zdGF0ZT9oaXN0b3J5LnN0YXRlLnNjcm9sbFBvc2l0aW9uOjB9LHNhdmU9ZnVuY3Rpb24oKXt2YXIgYT0wPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1swXSE9PXZvaWQgMD9hcmd1bWVudHNbMF06bnVsbDt3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe3Njcm9sbFBvc2l0aW9uOmF8fHdpbmRvdy5wYWdlWU9mZnNldHx8d2luZG93LnNjcm9sbFl9LCcnKX0scmVzdG9yZT1mdW5jdGlvbigpe3ZhciBhPTA8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzBdIT09dm9pZCAwP2FyZ3VtZW50c1swXTpudWxsLGI9c3RhdGUoKTthP2EoYik6c2Nyb2xsKGIpfSxpbml0PWZ1bmN0aW9uKCl7J3Njcm9sbFJlc3RvcmF0aW9uJ2luIGhpc3RvcnkmJihoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uPSdtYW51YWwnLHNjcm9sbChzdGF0ZSgpKSx3aW5kb3cub25iZWZvcmV1bmxvYWQ9ZnVuY3Rpb24oKXtyZXR1cm4gc2F2ZSgpfSl9O2V4cG9ydHMuZGVmYXVsdD0ndW5kZWZpbmVkJz09dHlwZW9mIHdpbmRvdz97fTp7aW5pdDppbml0LHNhdmU6c2F2ZSxyZXN0b3JlOnJlc3RvcmUsc3RhdGU6c3RhdGV9OyIsImZ1bmN0aW9uIG5leHQoYXJncyl7XG4gIGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzLnNoaWZ0KCkuYXBwbHkodGhpcywgYXJncylcbn1cblxuZnVuY3Rpb24gcnVuKGNiLCBhcmdzKXtcbiAgY2IoKVxuICBuZXh0KGFyZ3MpXG59XG5cbmZ1bmN0aW9uIHRhcnJ5KGNiLCBkZWxheSl7XG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgdmFyIG92ZXJyaWRlID0gYXJnc1swXVxuICAgIFxuICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIG92ZXJyaWRlKXtcbiAgICAgIHJldHVybiB0YXJyeShjYiwgb3ZlcnJpZGUpXG4gICAgfVxuICAgIFxuICAgICdudW1iZXInID09PSB0eXBlb2YgZGVsYXkgPyAoXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHJ1bihjYiwgYXJncylcbiAgICAgIH0sIGRlbGF5KSBcbiAgICApIDogKFxuICAgICAgcnVuKGNiLCBhcmdzKVxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBxdWV1ZSgpe1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICByZXR1cm4gdGFycnkoZnVuY3Rpb24oKXtcbiAgICBuZXh0KGFyZ3Muc2xpY2UoMCkpXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHtcbiAgdGFycnk6IHRhcnJ5LFxuICBxdWV1ZTogcXVldWVcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMgPSByZXF1aXJlKCcuL3RyYW5zZm9ybS1wcm9wcycpO1xuXG52YXIgX3RyYW5zZm9ybVByb3BzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RyYW5zZm9ybVByb3BzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGggPSBmdW5jdGlvbiBoKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPyBhcHBseVByb3BzKHRhZykoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA6IGFwcGVuZENoaWxkcmVuKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufTtcblxudmFyIGlzT2JqID0gZnVuY3Rpb24gaXNPYmoobykge1xuICByZXR1cm4gbyAhPT0gbnVsbCAmJiAodHlwZW9mIG8gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG8pKSA9PT0gJ29iamVjdCc7XG59O1xuXG52YXIgaXNQcm9wcyA9IGZ1bmN0aW9uIGlzUHJvcHMoYXJnKSB7XG4gIHJldHVybiBpc09iaihhcmcpICYmICEoYXJnIGluc3RhbmNlb2YgRWxlbWVudCk7XG59O1xuXG52YXIgYXBwbHlQcm9wcyA9IGZ1bmN0aW9uIGFwcGx5UHJvcHModGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSkge1xuICAgICAgICByZXR1cm4gaCh0YWcpKE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVsID0gaCh0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICAgIHZhciBwID0gKDAsIF90cmFuc2Zvcm1Qcm9wczIuZGVmYXVsdCkocHJvcHMpO1xuICAgICAgT2JqZWN0LmtleXMocCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoL15vbi8udGVzdChrKSkge1xuICAgICAgICAgIGVsW2tdID0gcFtrXTtcbiAgICAgICAgfSBlbHNlIGlmIChrID09PSAnX19odG1sJykge1xuICAgICAgICAgIGVsLmlubmVySFRNTCA9IHBba107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGssIHBba10pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuICB9O1xufTtcblxudmFyIGFwcGVuZENoaWxkcmVuID0gZnVuY3Rpb24gYXBwZW5kQ2hpbGRyZW4odGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNoaWxkcmVuID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBjaGlsZHJlbltfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYyBpbnN0YW5jZW9mIEVsZW1lbnQgPyBjIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYyk7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGVsLmFwcGVuZENoaWxkKGMpO1xuICAgIH0pO1xuICAgIHJldHVybiBlbDtcbiAgfTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGg7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGtlYmFiID0gZXhwb3J0cy5rZWJhYiA9IGZ1bmN0aW9uIGtlYmFiKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKGcpIHtcbiAgICByZXR1cm4gJy0nICsgZy50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn07XG5cbnZhciBwYXJzZVZhbHVlID0gZXhwb3J0cy5wYXJzZVZhbHVlID0gZnVuY3Rpb24gcGFyc2VWYWx1ZShwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInID8gYWRkUHgocHJvcCkodmFsKSA6IHZhbDtcbiAgfTtcbn07XG5cbnZhciB1bml0bGVzc1Byb3BlcnRpZXMgPSBleHBvcnRzLnVuaXRsZXNzUHJvcGVydGllcyA9IFsnbGluZUhlaWdodCcsICdmb250V2VpZ2h0JywgJ29wYWNpdHknLCAnekluZGV4J1xuLy8gUHJvYmFibHkgbmVlZCBhIGZldyBtb3JlLi4uXG5dO1xuXG52YXIgYWRkUHggPSBleHBvcnRzLmFkZFB4ID0gZnVuY3Rpb24gYWRkUHgocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB1bml0bGVzc1Byb3BlcnRpZXMuaW5jbHVkZXMocHJvcCkgPyB2YWwgOiB2YWwgKyAncHgnO1xuICB9O1xufTtcblxudmFyIGZpbHRlck51bGwgPSBleHBvcnRzLmZpbHRlck51bGwgPSBmdW5jdGlvbiBmaWx0ZXJOdWxsKG9iaikge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBvYmpba2V5XSAhPT0gbnVsbDtcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVEZWMgPSBleHBvcnRzLmNyZWF0ZURlYyA9IGZ1bmN0aW9uIGNyZWF0ZURlYyhzdHlsZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZWJhYihrZXkpICsgJzonICsgcGFyc2VWYWx1ZShrZXkpKHN0eWxlW2tleV0pO1xuICB9O1xufTtcblxudmFyIHN0eWxlVG9TdHJpbmcgPSBleHBvcnRzLnN0eWxlVG9TdHJpbmcgPSBmdW5jdGlvbiBzdHlsZVRvU3RyaW5nKHN0eWxlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdHlsZSkuZmlsdGVyKGZpbHRlck51bGwoc3R5bGUpKS5tYXAoY3JlYXRlRGVjKHN0eWxlKSkuam9pbignOycpO1xufTtcblxudmFyIGlzU3R5bGVPYmplY3QgPSBleHBvcnRzLmlzU3R5bGVPYmplY3QgPSBmdW5jdGlvbiBpc1N0eWxlT2JqZWN0KHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleSA9PT0gJ3N0eWxlJyAmJiBwcm9wc1trZXldICE9PSBudWxsICYmIF90eXBlb2YocHJvcHNba2V5XSkgPT09ICdvYmplY3QnO1xuICB9O1xufTtcblxudmFyIGNyZWF0ZVN0eWxlID0gZXhwb3J0cy5jcmVhdGVTdHlsZSA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGlzU3R5bGVPYmplY3QocHJvcHMpKGtleSkgPyBzdHlsZVRvU3RyaW5nKHByb3BzW2tleV0pIDogcHJvcHNba2V5XTtcbiAgfTtcbn07XG5cbnZhciByZWR1Y2VQcm9wcyA9IGV4cG9ydHMucmVkdWNlUHJvcHMgPSBmdW5jdGlvbiByZWR1Y2VQcm9wcyhwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGEsIGtleSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGEsIF9kZWZpbmVQcm9wZXJ0eSh7fSwga2V5LCBjcmVhdGVTdHlsZShwcm9wcykoa2V5KSkpO1xuICB9O1xufTtcblxudmFyIHRyYW5zZm9ybVByb3BzID0gZXhwb3J0cy50cmFuc2Zvcm1Qcm9wcyA9IGZ1bmN0aW9uIHRyYW5zZm9ybVByb3BzKHByb3BzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykucmVkdWNlKHJlZHVjZVByb3BzKHByb3BzKSwge30pO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gdHJhbnNmb3JtUHJvcHM7IiwiY29uc3QgY3JlYXRlQmFyID0gKHJvb3QsIGNsYXNzbmFtZSkgPT4ge1xuICBsZXQgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGxldCBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICBvLmNsYXNzTmFtZSA9IGNsYXNzbmFtZSBcbiAgaS5jbGFzc05hbWUgPSBgJHtjbGFzc25hbWV9X19pbm5lcmBcbiAgby5hcHBlbmRDaGlsZChpKVxuICByb290Lmluc2VydEJlZm9yZShvLCByb290LmNoaWxkcmVuWzBdKVxuXG4gIHJldHVybiB7XG4gICAgb3V0ZXI6IG8sXG4gICAgaW5uZXI6IGlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAocm9vdCA9IGRvY3VtZW50LmJvZHksIG9wdHMgPSB7fSkgPT4ge1xuICBsZXQgdGltZXIgPSBudWxsXG4gIGNvbnN0IHNwZWVkID0gb3B0cy5zcGVlZCB8fCAyMDBcbiAgY29uc3QgY2xhc3NuYW1lID0gb3B0cy5jbGFzc25hbWUgfHwgJ3B1dHonXG4gIGNvbnN0IHRyaWNrbGUgPSBvcHRzLnRyaWNrbGUgfHwgNSBcbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgYWN0aXZlOiBmYWxzZSxcbiAgICBwcm9ncmVzczogMFxuICB9XG5cbiAgY29uc3QgYmFyID0gY3JlYXRlQmFyKHJvb3QsIGNsYXNzbmFtZSlcblxuICBjb25zdCByZW5kZXIgPSAodmFsID0gMCkgPT4ge1xuICAgIHN0YXRlLnByb2dyZXNzID0gdmFsXG4gICAgYmFyLmlubmVyLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoJHtzdGF0ZS5hY3RpdmUgPyAnMCcgOiAnLTEwMCUnfSkgdHJhbnNsYXRlWCgkey0xMDAgKyBzdGF0ZS5wcm9ncmVzc30lKTtgXG4gIH1cblxuICBjb25zdCBnbyA9IHZhbCA9PiB7XG4gICAgaWYgKCFzdGF0ZS5hY3RpdmUpeyByZXR1cm4gfVxuICAgIHJlbmRlcihNYXRoLm1pbih2YWwsIDk1KSlcbiAgfVxuXG4gIGNvbnN0IGluYyA9ICh2YWwgPSAoTWF0aC5yYW5kb20oKSAqIHRyaWNrbGUpKSA9PiBnbyhzdGF0ZS5wcm9ncmVzcyArIHZhbClcblxuICBjb25zdCBlbmQgPSAoKSA9PiB7XG4gICAgc3RhdGUuYWN0aXZlID0gZmFsc2VcbiAgICByZW5kZXIoMTAwKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gcmVuZGVyKCksIHNwZWVkKVxuICAgIGlmICh0aW1lcil7IGNsZWFyVGltZW91dCh0aW1lcikgfVxuICB9XG5cbiAgY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gICAgc3RhdGUuYWN0aXZlID0gdHJ1ZVxuICAgIGluYygpXG4gIH1cblxuICBjb25zdCBwdXR6ID0gKGludGVydmFsID0gNTAwKSA9PiB7XG4gICAgaWYgKCFzdGF0ZS5hY3RpdmUpeyByZXR1cm4gfVxuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gaW5jKCksIGludGVydmFsKVxuICB9XG4gIFxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh7XG4gICAgcHV0eixcbiAgICBzdGFydCxcbiAgICBpbmMsXG4gICAgZ28sXG4gICAgZW5kLFxuICAgIGdldFN0YXRlOiAoKSA9PiBzdGF0ZVxuICB9LHtcbiAgICBiYXI6IHtcbiAgICAgIHZhbHVlOiBiYXJcbiAgICB9XG4gIH0pXG59XG4iLCJjb25zdCBmaW5kTGluayA9IChpZCwgZGF0YSkgPT4gZGF0YS5maWx0ZXIobCA9PiBsLmlkID09PSBpZClbMF1cblxuY29uc3QgY3JlYXRlTGluayA9ICh7IGFuc3dlcnMgfSwgZGF0YSkgPT4gYW5zd2Vycy5mb3JFYWNoKGEgPT4ge1xuICBsZXQgaXNQYXRoID0gL15cXC8vLnRlc3QoYS5uZXh0KSA/IHRydWUgOiBmYWxzZVxuICBsZXQgaXNHSUYgPSAvZ2lmLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgYS5uZXh0ID0gaXNQYXRoIHx8IGlzR0lGID8gYS5uZXh0IDogZmluZExpbmsoYS5uZXh0LCBkYXRhKVxufSlcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKHF1ZXN0aW9ucykgPT4ge1xuXHRxdWVzdGlvbnMubWFwKHEgPT4gY3JlYXRlTGluayhxLCBxdWVzdGlvbnMpKVxuXHRyZXR1cm4gcXVlc3Rpb25zXG59XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXN0aW9ucyA9PiB7XG4gIHJldHVybiB7XG4gICAgc3RvcmU6IGNyZWF0ZVN0b3JlKHF1ZXN0aW9ucyksXG4gICAgZ2V0QWN0aXZlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmlsdGVyKHEgPT4gcS5pZCA9PSB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgvIy8pWzFdKVswXSB8fCB0aGlzLnN0b3JlWzBdXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBpZDogMSxcbiAgICBwcm9tcHQ6IGBIaSEgV2hhdCBicmluZ3MgeW91IHRvIHRoaXMgY29ybmVyIG9mIHRoZSB3ZWI/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnV2hvIGFyZSB5b3U/JyxcbiAgICAgICAgbmV4dDogMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBJJ20gaGlyaW5nLmAsXG4gICAgICAgIG5leHQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgSXQncyB5b3VyIG1vdGhlci5gLFxuICAgICAgICBuZXh0OiA0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEZ1bm55IGpva2VzLCBwbHouYCxcbiAgICAgICAgbmV4dDogNVxuICAgICAgfVxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDIsXG4gICAgcHJvbXB0OiBgSSdtIE1lbGFuaWUg4oCTIGEgZ3JhcGhpYyBkZXNpZ25lciB3b3JraW5nIGluIGV4cGVyaWVudGlhbCBtYXJrZXRpbmcgJiBwcm91ZCBJb3dhbiB0cnlpbmcgdG8gZWF0IEFMTCB0aGUgQkxUcy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBXaGF0J3MgZXhwZXJpZW50aWFsP2AsXG4gICAgICAgIG5leHQ6IDZcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCdzIGEgQkxUP2AsXG4gICAgICAgIG5leHQ6IDdcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMyxcbiAgICBwcm9tcHQ6IGBSYWQuIENhbiBJIHNob3cgeW91IHNvbWUgcHJvamVjdHMgSSd2ZSB3b3JrZWQgb24/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgWWVzLCBwbGVhc2UhYCxcbiAgICAgICAgbmV4dDogJy93b3JrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBOYWgsIHRlbGwgbWUgYWJvdXQgeW91LmAsXG4gICAgICAgIG5leHQ6ICcvYWJvdXQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEknbGwgZW1haWwgeW91IGluc3RlYWQuYCxcbiAgICAgICAgbmV4dDogJy9jb250YWN0J1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA0LFxuICAgIHByb21wdDogYEhpIE1vbS4gSSBsb3ZlIHlvdSFgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBKSywgbm90IHlvdXIgbW9tLmAsXG4gICAgICAgIG5leHQ6IDlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCBkb2VzICdKSycgbWVhbj9gLFxuICAgICAgICBuZXh0OiAxNVxuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA1LFxuICAgIHByb21wdDogYFdoYXQncyBmdW5uaWVyIHRoYW4gYSByaGV0b3JpY2FsIHF1ZXN0aW9uP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYFllc2AsXG4gICAgICAgIG5leHQ6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYE5vYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzEwdEQ3R1A5bEhmYVBDL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNixcbiAgICBwcm9tcHQ6IGBFeHBlcmllbnRpYWwgbWFya2V0aW5nIGVuZ2FnZXMgZGlyZWN0bHkgd2l0aCBjb25zdW1lcnMuIEV4YW1wbGVzPyBQb3AtdXAgc2hvcHMsIHN0dW50cywgb3Igc2ltcGxlIHN0cmVldCB0ZWFtcyBkaXN0cmlidXRpbmcgc2FtcGxlcy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBTb3VuZHMgY29vbC4gV2hhdCBoYXZlIHlvdSBkb25lP2AsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2h5IGRvIHlvdSBsaWtlIGl0P2AsXG4gICAgICAgIG5leHQ6IDExXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDcsXG4gICAgcHJvbXB0OiBgWW91IHRlbGwgbWUuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgQmVlZiBMaXZlciBUb2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9vRk9zMTBTSlNuem9zL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgQmVycnkgTGVtb24gVGFydGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8zbzdUS3dtbkRnUWI1amVtaksvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCYWNvbiBMZXR0dWNlIFRvbWF0b2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9mcXp4Y21sWTdvcE9nL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogOSxcbiAgICBwcm9tcHQ6IGBDbGlja2luZyBmb3IgZnVuPyBHb29kIGx1Y2sgd2l0aCB0aGlzIG9uZS5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCbHVlIFBpbGxgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvRzdHTm9hVVNIN3NNVS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYFJlZCBQaWxsYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL1VqdWpHWTNtQTNKbGUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxMCxcbiAgICBwcm9tcHQ6IGBQYW5jYWtlcyBvciB3YWZmbGVzP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYEZyZW5jaCBUb2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9ZOGNkUGxlNGVJeVB1L2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTEsXG4gICAgcHJvbXB0OiBgVGhlcmUgYXJlIGEgbnVtYmVyIG9mIHJlYXNvbnMsIGJ1dCBhIG1ham9yIGhvb2sgaXMgdGhlIGNoYWxsZW5nZSB0byBjb25zaXN0ZW50bHkgY3JlYXRlIHdheXMgdG8gc3VycHJpc2UgYW5kIGRlbGlnaHQuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCBhcmUgeW91ciBmYXZvcml0ZSBwcm9qZWN0cz9gLFxuICAgICAgICBuZXh0OiAnL3dvcmsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEkgaGF2ZSBxdWVzdGlvbnMhIENhbiBJIGVtYWlsIHlvdT9gLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAxNSxcbiAgICBwcm9tcHQ6IGBJdCBpcyB5b3UsIE1vbSFgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBZaXBwZWUhYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL2tyZXdYVUI2TEJqYS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfVxuXVxuIiwiaW1wb3J0IGgwIGZyb20gJ2gwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuLi9saWIvY29sb3JzJ1xuXG5leHBvcnQgY29uc3QgZGl2ID0gaDAoJ2RpdicpXG5leHBvcnQgY29uc3QgYnV0dG9uID0gaDAoJ2J1dHRvbicpKHtjbGFzczogJ2gyIG12MCBpbmxpbmUtYmxvY2snfSlcbmV4cG9ydCBjb25zdCB0aXRsZSA9IGgwKCdwJykoe2NsYXNzOiAnaDEgbXQwIG1iMDUgY2InfSlcblxuZXhwb3J0IGNvbnN0IHRlbXBsYXRlID0gKHtwcm9tcHQsIGFuc3dlcnN9LCBjYikgPT4ge1xuICByZXR1cm4gZGl2KHtjbGFzczogJ3F1ZXN0aW9uJ30pKFxuICAgIHRpdGxlKHByb21wdCksXG4gICAgZGl2KFxuICAgICAgLi4uYW5zd2Vycy5tYXAoKGEsIGkpID0+IGJ1dHRvbih7XG4gICAgICAgIG9uY2xpY2s6IChlKSA9PiBjYihhLm5leHQpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiBjb2xvcnMuY29sb3JzW2ldXG4gICAgICAgIH1cbiAgICAgIH0pKGEudmFsdWUpKVxuICAgIClcbiAgKVxufVxuIiwiaW1wb3J0IHsgdGFycnksIHF1ZXVlIH0gZnJvbSAndGFycnkuanMnXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgbGV0IGxvYWRlZCA9IGZhbHNlXG5cbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2lmJylcbiAgY29uc3QgaW1nID0gbW9kYWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdXG5cbiAgY29uc3QgbGF6eSA9ICh1cmwsIGNiKSA9PiB7XG4gICAgbGV0IGJ1cm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cbiAgICBidXJuZXIub25sb2FkID0gKCkgPT4gY2IodXJsKVxuXG4gICAgYnVybmVyLnNyYyA9IHVybFxuICB9XG5cbiAgY29uc3Qgb3BlbiA9IHVybCA9PiB7XG4gICAgd2luZG93LmxvYWRlci5zdGFydCgpXG4gICAgd2luZG93LmxvYWRlci5wdXR6KDUwMClcblxuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG5cbiAgICBsYXp5KHVybCwgdXJsID0+IHtcbiAgICAgIGxvYWRlZCA9IHRydWVcbiAgICAgIGltZy5zcmMgPSB1cmxcbiAgICAgIGltZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgd2luZG93LmxvYWRlci5lbmQoKVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICBsb2FkZWQgPSBmYWxzZVxuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICBpbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICB9XG5cbiAgbW9kYWwub25jbGljayA9ICgpID0+IGxvYWRlZCA/IGNsb3NlKCkgOiBudWxsXG5cbiAgcmV0dXJuIHtcbiAgICBvcGVuLFxuICAgIGNsb3NlXG4gIH1cbn1cbiIsImltcG9ydCByb3V0ZXIgZnJvbSAnLi4vbGliL3JvdXRlcidcbmltcG9ydCBxdWVzdGlvbnMgZnJvbSAnLi9kYXRhL2luZGV4LmpzJ1xuaW1wb3J0IHN0b3JhZ2UgZnJvbSAnLi9kYXRhJ1xuaW1wb3J0IGdpZmZlciBmcm9tICcuL2dpZmZlcidcbmltcG9ydCB7IHRlbXBsYXRlIH0gZnJvbSAnLi9lbGVtZW50cydcblxubGV0IHByZXZcbmNvbnN0IGRhdGEgPSBzdG9yYWdlKHF1ZXN0aW9ucylcblxuLyoqXG4gKiBSZW5kZXIgdGVtcGxhdGUgYW5kIGFwcGVuZCB0byBET01cbiAqL1xuY29uc3QgcmVuZGVyID0gKG5leHQpID0+IHtcbiAgbGV0IHF1ZXN0aW9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvblJvb3QnKVxuXG4gIGxldCBlbCA9IHRlbXBsYXRlKG5leHQsIHVwZGF0ZSlcbiAgcXVlc3Rpb25Sb290ICYmIHF1ZXN0aW9uUm9vdC5hcHBlbmRDaGlsZChlbClcbiAgcmV0dXJuIGVsIFxufVxuXG4vKipcbiAqIEhhbmRsZSBET00gdXBkYXRlcywgb3RoZXIgbGluayBjbGlja3NcbiAqL1xuY29uc3QgdXBkYXRlID0gKG5leHQpID0+IHtcbiAgbGV0IHF1ZXN0aW9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvblJvb3QnKVxuXG4gIGxldCBpc0dJRiA9IC9naXBoeS8udGVzdChuZXh0KVxuICBpZiAoaXNHSUYpIHJldHVybiBnaWZmZXIoKS5vcGVuKG5leHQpXG5cbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KG5leHQpXG4gIGlmIChpc1BhdGgpIHJldHVybiByb3V0ZXIuZ28obmV4dClcblxuICBpZiAocHJldiAmJiBxdWVzdGlvblJvb3QgJiYgcXVlc3Rpb25Sb290LmNvbnRhaW5zKHByZXYpKSBxdWVzdGlvblJvb3QucmVtb3ZlQ2hpbGQocHJldilcblxuICBwcmV2ID0gcmVuZGVyKG5leHQpXG5cbiAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXh0LmlkXG59XG5cbi8qKlxuICogV2FpdCB1bnRpbCBuZXcgRE9NIGlzIHByZXNlbnQgYmVmb3JlXG4gKiB0cnlpbmcgdG8gcmVuZGVyIHRvIGl0XG4gKi9cbnJvdXRlci5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmIChyb3V0ZSA9PT0gJycgfHwgLyheXFwvfFxcLyNbMC05XXwjWzAtOV0pLy50ZXN0KHJvdXRlKSl7XG4gICAgdXBkYXRlKGRhdGEuZ2V0QWN0aXZlKCkpXG4gIH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgcHJldiA9IHJlbmRlcihkYXRhLmdldEFjdGl2ZSgpKVxufVxuIiwiaW1wb3J0IHB1dHogZnJvbSAncHV0eidcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9saWIvcm91dGVyJ1xuaW1wb3J0IGFwcCBmcm9tICcuL2FwcCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9saWIvY29sb3JzJ1xuaW1wb3J0IGNvbnRhY3QgZnJvbSAnLi9saWIvY29udGFjdCdcblxuY29uc3QgbG9hZGVyID0gd2luZG93LmxvYWRlciA9IHB1dHooZG9jdW1lbnQuYm9keSwge1xuICBzcGVlZDogMTAwLFxuICB0cmlja2xlOiAxMFxufSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUnKVxuICBjb25zdCBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKVxuXG4gIGNvbnN0IG1lbnVUb2dnbGUgPSAoY2xvc2UpID0+IHtcbiAgICBjb25zdCBvcGVuID0gbWVudS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXZpc2libGUnKVxuICAgIG1lbnUuY2xhc3NMaXN0W29wZW4gfHwgY2xvc2UgPyAncmVtb3ZlJyA6ICdhZGQnXSgnaXMtdmlzaWJsZScpXG4gICAgdG9nZ2xlLmNsYXNzTGlzdFtvcGVuIHx8IGNsb3NlID8gJ3JlbW92ZScgOiAnYWRkJ10oJ2lzLWFjdGl2ZScpXG4gIH1cblxuICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBtZW51VG9nZ2xlKClcbiAgfSlcblxuICBhcHAoKVxuXG4gIHJvdXRlci5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gICAgY29sb3JzLnVwZGF0ZSgpXG5cbiAgICBpZiAoL2NvbnRhY3QvLnRlc3Qocm91dGUpKSB7XG4gICAgICBjb250YWN0KClcbiAgICB9XG5cbiAgICBtZW51VG9nZ2xlKHRydWUpXG4gIH0pXG5cbiAgaWYgKC9jb250YWN0Ly50ZXN0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcbiAgICBjb250YWN0KClcbiAgfVxuXG4gIGNvbG9ycy51cGRhdGUoKVxufSlcbiIsImNvbnN0IHJvb3RTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQocm9vdFN0eWxlKVxuXG5jb25zdCBjb2xvcnMgPSBbXG4gICcjMzVEM0U4JyxcbiAgJyNGRjRFNDInLFxuICAnI0ZGRUE1MSdcbl1cblxuY29uc3QgcmFuZG9tQ29sb3IgPSAoKSA9PiBjb2xvcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKDIgLSAwKSArIDApXVxuXG5jb25zdCBzYXZlQ29sb3IgPSBjID0+IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtanMnLCBKU09OLnN0cmluZ2lmeSh7XG4gIGNvbG9yOiBjXG59KSlcblxuY29uc3QgcmVhZENvbG9yID0gKCkgPT4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21qcycpID8gKFxuICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtanMnKSkuY29sb3JcbikgOiAoXG4gIG51bGxcbilcblxuY29uc3QgZ2V0Q29sb3IgPSAoKSA9PiB7XG4gIGxldCBjID0gcmFuZG9tQ29sb3IoKVxuICBsZXQgcHJldiA9IHJlYWRDb2xvcigpXG5cbiAgd2hpbGUgKGMgPT09IHByZXYpe1xuICAgIGMgPSByYW5kb21Db2xvcigpXG4gIH1cblxuICBzYXZlQ29sb3IoYylcbiAgcmV0dXJuIGNcbn1cblxuY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICBsZXQgY29sb3IgPSBnZXRDb2xvcigpXG4gIFxuICByb290U3R5bGUuaW5uZXJIVE1MID0gYFxuICAgIGJvZHkgeyBjb2xvcjogJHtjb2xvcn0gfVxuICAgIDo6LW1vei1zZWxlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgfVxuICAgIDo6c2VsZWN0aW9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7Y29sb3J9O1xuICAgIH1cbiAgICAudGhlbWUgYSB7XG4gICAgICBjb2xvcjogJHtjb2xvcn1cbiAgICB9XG4gIGBcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB1cGRhdGU6IHVwZGF0ZSxcbiAgY29sb3JzXG59XG4iLCJpbXBvcnQgbGluZXMgZnJvbSAnLi9zdWJqZWN0bGluZXMnXG5cbmNvbnN0IG1pbiA9IDBcbmNvbnN0IG1heCA9IGxpbmVzLmxlbmd0aCAtIDFcbmxldCBjdXJyZW50ID0gMFxuXG5jb25zdCBjb3B5VG9DbGlwYm9hcmQgPSBtc2cgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dC5pbm5lckhUTUwgPSBtc2dcbiAgICB0ZXh0LnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAtOTk5OXB4OydcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHQpXG4gICAgdGV4dC5zZWxlY3QoKVxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5JylcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHQpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHdpbmRvdy5wcm9tcHQoJ1ByZXNzIENtZCtDIG9yIEN0cmwrQyB0byBjb3B5IHRvIGNsaXBib2FyZC4nLCBtc2cpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2xhbXAodmFsKXtcbiAgbGV0IF92YWxcblxuICBpZiAodmFsID49IG1pbiAmJiB2YWwgPD0gbWF4KXtcbiAgICBfdmFsID0gdmFsIFxuICB9IGVsc2UgaWYgKHZhbCA+PSBtYXgpe1xuICAgIF92YWwgPSBtaW5cbiAgfSBlbHNlIGlmICh2YWwgPD0gbWluKXtcbiAgICBfdmFsID0gbWF4XG4gIH1cblxuICByZXR1cm4gX3ZhbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBjb25zdCBzdWJqZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1YmplY3RMaW5lJylcbiAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0U3ViamVjdCcpXG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQnKVxuXG4gIHN1YmplY3QuaW5uZXJIVE1MID0gbGluZXNbY3VycmVudF1cblxuICBuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBwcm9tcHQuaW5uZXJIVE1MID0gJyhjbGljayB0byBjb3B5KSdcbiAgICBjdXJyZW50ID0gY2xhbXAoKytjdXJyZW50KVxuICAgIHN1YmplY3QuaW5uZXJIVE1MID0gbGluZXNbY3VycmVudF1cbiAgICBuZXh0LmJsdXIoKVxuICB9KVxuXG4gIHN1YmplY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBjb3B5VG9DbGlwYm9hcmQoc3ViamVjdC5pbm5lckhUTUwpXG4gICAgcHJvbXB0LmlubmVySFRNTCA9ICdjb3BpZWQhJ1xuICB9KVxufVxuIiwiaW1wb3J0IG9wZXJhdG9yIGZyb20gJ29wZXJhdG9yLmpzJ1xuXG4vKipcbiAqIFNlbmQgcGFnZSB2aWV3cyB0byBcbiAqIEdvb2dsZSBBbmFseXRpY3NcbiAqL1xuY29uc3QgZ2FUcmFja1BhZ2VWaWV3ID0gKHBhdGgsIHRpdGxlKSA9PiB7XG4gIGxldCBnYSA9IHdpbmRvdy5nYSA/IHdpbmRvdy5nYSA6IGZhbHNlXG5cbiAgaWYgKCFnYSkgcmV0dXJuXG5cbiAgZ2EoJ3NldCcsIHtwYWdlOiBwYXRoLCB0aXRsZTogdGl0bGV9KTtcbiAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbn1cblxuY29uc3QgYXBwID0gb3BlcmF0b3Ioe1xuICByb290OiAnI3Jvb3QnXG59KVxuXG5hcHAub24oJ3JvdXRlOmFmdGVyJywgKHsgcm91dGUsIHRpdGxlIH0pID0+IHtcbiAgZ2FUcmFja1BhZ2VWaWV3KHJvdXRlLCB0aXRsZSlcbn0pXG5cbmFwcC5vbigndHJhbnNpdGlvbjphZnRlcicsICgpID0+IGxvYWRlciAmJiBsb2FkZXIuZW5kKCkpXG5cbndpbmRvdy5hcHAgPSBhcHBcblxuZXhwb3J0IGRlZmF1bHQgYXBwXG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gIGAxMCBSZWFzb25zIHRvIE9wZW4gVGhpcyBFbWFpbCAoT3BlbiBUbyBGaW5kIE91dCEpYCxcbiAgYEZSRUUgSkVMTFkgQkVBTlMhYCxcbiAgYFJlOiBUcmFkZW1hcmsgUmVxdWVzdCBmb3IgXCJOZWF0byBCdXJyaXRvXCJgLFxuICBgQXBwbGljYXRpb24gQWNjZXB0ZWQg4oCTIENoZWVzZWNha2UgQ2x1YiBvZiBBbWVyaWNhYCxcbiAgYENhc3RpbmcgQ2FsbCDigJMgU2Vla2luZyBBY3RyZXNzIFRvIFBsYXkgUm9zZSBpbiBUaXRhbmljIFJlYm9vdGAsXG4gIGBBbWF6aW5nIFByb2R1Y3QhIENoYW5nZSBZb3VyIElubmVyIE1vbm9sb2d1ZSdzIFZvaWNlIHRvIEphbWVzIEVhcmwgSm9uZXMhYCxcbiAgYFtOT1RJRklDQVRJT05dIC0gTmV3IFBvc3QgaW4gRm9ydW0gXCJXaHkgV2FzIEUuVC4gU28gQ3JlZXB5P1wiYCxcbiAgYEhpZ2hseSBSZXB1dGFibGUgU2NpZW5jZSBNYWdhemluZTogRnJlbmNoIEZyaWVzIGFyZSB0aGUgTmV3IFN1cGVyZm9vZGAsXG4gIGBGdzogRnc6IEZ3OiBGdzogb21nIG9tZyBvbWcgY2hlY2sgdGhpcyBvdXQgcm4hYCxcbiAgYE5ldmVyIEdvbm5hIEdpdmUgWW91IFVwLCBOZXZlciBHb25uYSBMZXQgWW91IERvd24sIE5ldmVyIEdvbm5hIFJ1biBBcm91bmQgYW5kLi4uYCxcbiAgYFlvdXIgV2VpcmQgRHJlYW1zIEV4cGxhaW5lZDogTm8sIFlvdSBTaG91bGRuJ3QgR2V0IGEgUGV0IFBhbmRhYCxcbiAgYEZvcndhcmQgMiAxMCBwcGwgb3IgdSB3aWxsIGRyb3duIGluIGNvbmZldHRpIDQgcmVhbGAsXG4gIGBQcmVzaWRlbnQgQmFyYWNrIE9iYW1hJ3MgRmF2b3JpdGUgQ2F0IFZpZGVvc2AsXG4gIGBUaGUgUmVzdWx0cyBBcmUgSW4hIFlvdSBhcmUgOTYlIExpeiBMZW1vbmAsXG4gIGBNbW1ib3AsIEJhIER1YmEgRG9wLCBCYSBEdSBCb3AsIEJhIER1YmEgRG9wYCxcbiAgYH4qfiByRW1FbUJlUiB0WXBJbkcgc0hpVCBsSWtFIHRIaVMgfip+YCxcbl1cbiJdfQ==
