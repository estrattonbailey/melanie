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

        _this.setState(res);

        _this.emit('route:after', res);

        if (cb) {
          cb(res);
        }
      };

      var route = (0, _url.sanitize)(href);

      if (resolve) {
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

var _scrollRestoration = require('scroll-restoration');

var _scrollRestoration2 = _interopRequireDefault(_scrollRestoration);

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
      _scrollRestoration2.default.restore();
    });

    var end = (0, _tarry.tarry)(function () {
      emit('transition:after', { route: route });
      cb(title);
      page.style.height = '';
      document.documentElement.classList.remove('is-transitioning');
    });

    (0, _tarry.queue)(start(0), render(duration), end(0))();
  };
};
},{"./eval.js":2,"scroll-restoration":14,"tarry.js":15}],7:[function(require,module,exports){
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
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var scroll=function(a){return window.scrollTo(0,a)},state=function(){return history.state?history.state.scrollPosition:0},save=function(){window.history.replaceState({scrollPosition:window.pageYOffset||window.scrollY},'')},restore=function(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null,b=state();b?a?a(b):scroll(b):scroll(0)},instance={get export(){return'undefined'==typeof window?{}:('scrollRestoration'in history&&(history.scrollRestoration='manual',scroll(state()),window.onbeforeunload=save),{save:save,restore:restore,state:state})}};exports.default=instance.export;
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

},{"../lib/router":27,"./data":20,"./data/index.js":21,"./elements":22,"./giffer":23}],25:[function(require,module,exports){
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

  _router2.default.on('route:after', function (_ref) {
    var route = _ref.route;

    _colors2.default.update();
  });

  _colors2.default.update();
});

},{"./app":24,"./lib/colors":26,"./lib/router":27,"putz":18}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"operator.js":3}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L2NhY2hlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL2Rpc3QvbGlua3MuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9yZW5kZXIuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L3N0YXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2Nsb3Nlc3QuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL2xvb3AuanMvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy90YXJyeS5qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oMC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL3B1dHovaW5kZXguanMiLCJzcmMvanMvYXBwL2RhdGEuanMiLCJzcmMvanMvYXBwL2RhdGEvaW5kZXguanMiLCJzcmMvanMvYXBwL2VsZW1lbnRzLmpzIiwic3JjL2pzL2FwcC9naWZmZXIuanMiLCJzcmMvanMvYXBwL2luZGV4LmpzIiwic3JjL2pzL2luZGV4LmpzIiwic3JjL2pzL2xpYi9jb2xvcnMuanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0RUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLElBQUQsRUFBTyxTQUFQLEVBQXFCO0FBQ3JDLE1BQUksSUFBSSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjtBQUNBLE1BQUksSUFBSSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjs7QUFFQSxJQUFFLFNBQUYsR0FBYyxTQUFkO0FBQ0EsSUFBRSxTQUFGLEdBQWlCLFNBQWpCO0FBQ0EsSUFBRSxXQUFGLENBQWMsQ0FBZDtBQUNBLE9BQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXJCOztBQUVBLFNBQU87QUFDTCxXQUFPLENBREY7QUFFTCxXQUFPO0FBRkYsR0FBUDtBQUlELENBYkQ7O2tCQWVlLFlBQXFDO0FBQUEsTUFBcEMsSUFBb0MsdUVBQTdCLFNBQVMsSUFBb0I7QUFBQSxNQUFkLElBQWMsdUVBQVAsRUFBTzs7QUFDbEQsTUFBSSxRQUFRLElBQVo7QUFDQSxNQUFNLFFBQVEsS0FBSyxLQUFMLElBQWMsR0FBNUI7QUFDQSxNQUFNLFlBQVksS0FBSyxTQUFMLElBQWtCLE1BQXBDO0FBQ0EsTUFBTSxVQUFVLEtBQUssT0FBTCxJQUFnQixDQUFoQztBQUNBLE1BQU0sUUFBUTtBQUNaLFlBQVEsS0FESTtBQUVaLGNBQVU7QUFGRSxHQUFkOztBQUtBLE1BQU0sTUFBTSxVQUFVLElBQVYsRUFBZ0IsU0FBaEIsQ0FBWjs7QUFFQSxNQUFNLFNBQVMsU0FBVCxNQUFTLEdBQWE7QUFBQSxRQUFaLEdBQVksdUVBQU4sQ0FBTTs7QUFDMUIsVUFBTSxRQUFOLEdBQWlCLEdBQWpCO0FBQ0EsUUFBSSxLQUFKLENBQVUsS0FBVixDQUFnQixPQUFoQix1Q0FDMEIsTUFBTSxNQUFOLEdBQWUsR0FBZixHQUFxQixPQUQvQyx1QkFDc0UsQ0FBQyxHQUFELEdBQU8sTUFBTSxRQURuRjtBQUVELEdBSkQ7O0FBTUEsTUFBTSxLQUFLLFNBQUwsRUFBSyxNQUFPO0FBQ2hCLFFBQUksQ0FBQyxNQUFNLE1BQVgsRUFBa0I7QUFBRTtBQUFRO0FBQzVCLFdBQU8sS0FBSyxHQUFMLENBQVMsR0FBVCxFQUFjLEVBQWQsQ0FBUDtBQUNELEdBSEQ7O0FBS0EsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFFBQUMsR0FBRCx1RUFBUSxLQUFLLE1BQUwsS0FBZ0IsT0FBeEI7QUFBQSxXQUFxQyxHQUFHLE1BQU0sUUFBTixHQUFpQixHQUFwQixDQUFyQztBQUFBLEdBQVo7O0FBRUEsTUFBTSxNQUFNLFNBQU4sR0FBTSxHQUFNO0FBQ2hCLFVBQU0sTUFBTixHQUFlLEtBQWY7QUFDQSxXQUFPLEdBQVA7QUFDQSxlQUFXO0FBQUEsYUFBTSxRQUFOO0FBQUEsS0FBWCxFQUEyQixLQUEzQjtBQUNBLFFBQUksS0FBSixFQUFVO0FBQUUsbUJBQWEsS0FBYjtBQUFxQjtBQUNsQyxHQUxEOztBQU9BLE1BQU0sUUFBUSxTQUFSLEtBQVEsR0FBTTtBQUNsQixVQUFNLE1BQU4sR0FBZSxJQUFmO0FBQ0E7QUFDRCxHQUhEOztBQUtBLE1BQU0sT0FBTyxTQUFQLElBQU8sR0FBb0I7QUFBQSxRQUFuQixRQUFtQix1RUFBUixHQUFROztBQUMvQixRQUFJLENBQUMsTUFBTSxNQUFYLEVBQWtCO0FBQUU7QUFBUTtBQUM1QixZQUFRLFlBQVk7QUFBQSxhQUFNLEtBQU47QUFBQSxLQUFaLEVBQXlCLFFBQXpCLENBQVI7QUFDRCxHQUhEOztBQUtBLFNBQU8sT0FBTyxNQUFQLENBQWM7QUFDbkIsY0FEbUI7QUFFbkIsZ0JBRm1CO0FBR25CLFlBSG1CO0FBSW5CLFVBSm1CO0FBS25CLFlBTG1CO0FBTW5CLGNBQVU7QUFBQSxhQUFNLEtBQU47QUFBQTtBQU5TLEdBQWQsRUFPTDtBQUNBLFNBQUs7QUFDSCxhQUFPO0FBREo7QUFETCxHQVBLLENBQVA7QUFZRCxDOzs7Ozs7Ozs7O0FDckVELElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQUssSUFBTDtBQUFBLFNBQWMsS0FBSyxNQUFMLENBQVk7QUFBQSxXQUFLLEVBQUUsRUFBRixLQUFTLEVBQWQ7QUFBQSxHQUFaLEVBQThCLENBQTlCLENBQWQ7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLE9BQWMsSUFBZDtBQUFBLE1BQUcsT0FBSCxRQUFHLE9BQUg7QUFBQSxTQUF1QixRQUFRLE9BQVIsQ0FBZ0IsYUFBSztBQUM3RCxRQUFJLFNBQVMsTUFBTSxJQUFOLENBQVcsRUFBRSxJQUFiLElBQXFCLElBQXJCLEdBQTRCLEtBQXpDO0FBQ0EsUUFBSSxRQUFRLE1BQU0sSUFBTixDQUFXLEVBQUUsSUFBYixJQUFxQixJQUFyQixHQUE0QixLQUF4QztBQUNBLE1BQUUsSUFBRixHQUFTLFVBQVUsS0FBVixHQUFrQixFQUFFLElBQXBCLEdBQTJCLFNBQVMsRUFBRSxJQUFYLEVBQWlCLElBQWpCLENBQXBDO0FBQ0QsR0FKeUMsQ0FBdkI7QUFBQSxDQUFuQjs7QUFNTyxJQUFNLG9DQUFjLFNBQWQsV0FBYyxDQUFDLFNBQUQsRUFBZTtBQUN6QyxZQUFVLEdBQVYsQ0FBYztBQUFBLFdBQUssV0FBVyxDQUFYLEVBQWMsU0FBZCxDQUFMO0FBQUEsR0FBZDtBQUNBLFNBQU8sU0FBUDtBQUNBLENBSE07O2tCQUtRLHFCQUFhO0FBQzFCLFNBQU87QUFDTCxXQUFPLFlBQVksU0FBWixDQURGO0FBRUwsZUFBVyxxQkFBVTtBQUNuQixhQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0I7QUFBQSxlQUFLLEVBQUUsRUFBRixJQUFRLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixHQUEzQixFQUFnQyxDQUFoQyxDQUFiO0FBQUEsT0FBbEIsRUFBbUUsQ0FBbkUsS0FBeUUsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFoRjtBQUNEO0FBSkksR0FBUDtBQU1ELEM7Ozs7Ozs7O2tCQ3BCYyxDQUNiO0FBQ0UsTUFBSSxDQUROO0FBRUUsOERBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSxXQUFPLFNBRFQ7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UsV0FBTyxRQURUO0FBRUUsVUFBTTtBQUZSLEdBTE8sRUFTUDtBQUNFLDJCQURGO0FBRUUsVUFBTTtBQUZSLEdBVE8sRUFhUDtBQUNFLHdCQURGO0FBRUUsVUFBTTtBQUZSLEdBYk87QUFIWCxDQURhLEVBd0JiO0FBQ0UsTUFBSSxDQUROO0FBRUUsNkhBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSxrQ0FERjtBQUVFLFVBQU07QUFGUixHQURPLEVBS1A7QUFDRSwyQkFERjtBQUVFLFVBQU07QUFGUixHQUxPO0FBSFgsQ0F4QmEsRUF1Q2I7QUFDRSxNQUFJLENBRE47QUFFRSw4REFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLHlCQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLG1DQURGO0FBRUUsVUFBTTtBQUZSLEdBTE8sRUFTUDtBQUNFLG9DQURGO0FBRUUsVUFBTTtBQUZSLEdBVE87QUFIWCxDQXZDYSxFQTBEYjtBQUNFLE1BQUksQ0FETjtBQUVFLCtCQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0UsK0JBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UsNkJBREY7QUFFRSxVQUFNO0FBRlIsR0FMTztBQUhYLENBMURhLEVBeUViO0FBQ0UsTUFBSSxDQUROO0FBRUUsdURBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSxnQkFERjtBQUVFLFVBQU07QUFGUixHQURPLEVBS1A7QUFDRSxlQURGO0FBRUUsVUFBTTtBQUZSLEdBTE87QUFIWCxDQXpFYSxFQXdGYjtBQUNFLE1BQUksQ0FETjtBQUVFLHVFQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0UsNkNBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UsZ0NBREY7QUFFRSxVQUFNO0FBRlIsR0FMTztBQUhYLENBeEZhLEVBdUdiO0FBQ0UsTUFBSSxDQUROO0FBRUUsZ0NBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSw2QkFERjtBQUVFLFVBQU07QUFGUixHQURPLEVBS1A7QUFDRSxpQ0FERjtBQUVFLFVBQU07QUFGUixHQUxPLEVBU1A7QUFDRSxpQ0FERjtBQUVFLFVBQU07QUFGUixHQVRPO0FBSFgsQ0F2R2EsRUEwSGI7QUFDRSxNQUFJLENBRE47QUFFRSxrREFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLHVCQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLHdDQURGO0FBRUUsVUFBTTtBQUZSLEdBTE87QUFIWCxDQTFIYSxFQXlJYjtBQUNFLE1BQUksQ0FETjtBQUVFLDJEQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0Usc0JBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UscUJBREY7QUFFRSxVQUFNO0FBRlIsR0FMTztBQUhYLENBeklhLEVBd0piO0FBQ0UsTUFBSSxFQUROO0FBRUUsZ0NBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSx5QkFERjtBQUVFLFVBQU07QUFGUixHQURPO0FBSFgsQ0F4SmEsRUFtS2I7QUFDRSxNQUFJLEVBRE47QUFFRSxvRUFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLDZDQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLCtDQURGO0FBRUUsVUFBTTtBQUZSLEdBTE87QUFIWCxDQW5LYSxFQWtMYjtBQUNFLE1BQUksRUFETjtBQUVFLHNEQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0Usb0JBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UsbUNBREY7QUFFRSxVQUFNO0FBRlIsR0FMTztBQUhYLENBbExhLEVBaU1iO0FBQ0UsTUFBSSxFQUROO0FBRUUsaUJBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSw0Q0FERjtBQUVFLFVBQU07QUFGUixHQURPO0FBSFgsQ0FqTWEsRUE0TWI7QUFDRSxNQUFJLEVBRE47QUFFRSx1RkFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLHNCQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLHNCQURGO0FBRUUsVUFBTTtBQUZSLEdBTE8sRUFVUDtBQUNFLHNCQURGO0FBRUUsVUFBTTtBQUZSLEdBVk87QUFIWCxDQTVNYSxDOzs7Ozs7Ozs7O0FDQWY7Ozs7QUFDQTs7Ozs7Ozs7QUFFTyxJQUFNLG9CQUFNLGlCQUFHLEtBQUgsQ0FBWjtBQUNBLElBQU0sMEJBQVMsaUJBQUcsUUFBSCxFQUFhLEVBQUMsT0FBTyxxQkFBUixFQUFiLENBQWY7QUFDQSxJQUFNLHdCQUFRLGlCQUFHLEdBQUgsRUFBUSxFQUFDLE9BQU8sZ0JBQVIsRUFBUixDQUFkOztBQUVBLElBQU0sOEJBQVcsU0FBWCxRQUFXLE9BQW9CLEVBQXBCLEVBQTJCO0FBQUEsTUFBekIsTUFBeUIsUUFBekIsTUFBeUI7QUFBQSxNQUFqQixPQUFpQixRQUFqQixPQUFpQjs7QUFDakQsU0FBTyxJQUFJLEVBQUMsT0FBTyxVQUFSLEVBQUosRUFDTCxNQUFNLE1BQU4sQ0FESyxFQUVMLHdDQUNLLFFBQVEsR0FBUixDQUFZLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLE9BQU87QUFDOUIsZUFBUyxpQkFBQyxDQUFEO0FBQUEsZUFBTyxHQUFHLEVBQUUsSUFBTCxDQUFQO0FBQUEsT0FEcUI7QUFFOUIsYUFBTztBQUNMLGVBQU8saUJBQU8sTUFBUCxDQUFjLENBQWQ7QUFERjtBQUZ1QixLQUFQLEVBS3RCLEVBQUUsS0FMb0IsQ0FBVjtBQUFBLEdBQVosQ0FETCxFQUZLLENBQVA7QUFXRCxDQVpNOzs7Ozs7Ozs7QUNQUDs7a0JBRWUsWUFBTTtBQUNuQixNQUFNLFFBQVEsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQWQ7QUFDQSxNQUFNLE1BQU0sTUFBTSxvQkFBTixDQUEyQixLQUEzQixFQUFrQyxDQUFsQyxDQUFaOztBQUVBLE1BQU0sT0FBTyxrQkFBTTtBQUFBLFdBQU0sTUFBTSxLQUFOLENBQVksT0FBWixHQUFzQixPQUE1QjtBQUFBLEdBQU4sQ0FBYjtBQUNBLE1BQU0sT0FBTyxrQkFBTTtBQUFBLFdBQU0sTUFBTSxLQUFOLENBQVksT0FBWixHQUFzQixNQUE1QjtBQUFBLEdBQU4sQ0FBYjtBQUNBLE1BQU0sU0FBUyxrQkFDYjtBQUFBLFdBQU0sTUFBTSxTQUFOLENBQWdCLFFBQWhCLENBQXlCLFdBQXpCLElBQ0YsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFdBQXZCLENBREUsR0FFRixNQUFNLFNBQU4sQ0FBZ0IsR0FBaEIsQ0FBb0IsV0FBcEIsQ0FGSjtBQUFBLEdBRGEsQ0FBZjs7QUFNQSxNQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsR0FBRCxFQUFNLEVBQU4sRUFBYTtBQUN4QixRQUFJLFNBQVMsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWI7O0FBRUEsV0FBTyxNQUFQLEdBQWdCO0FBQUEsYUFBTSxHQUFHLEdBQUgsQ0FBTjtBQUFBLEtBQWhCOztBQUVBLFdBQU8sR0FBUCxHQUFhLEdBQWI7QUFDRCxHQU5EOztBQVFBLE1BQU0sT0FBTyxTQUFQLElBQU8sTUFBTztBQUNsQixXQUFPLE1BQVAsQ0FBYyxLQUFkO0FBQ0EsV0FBTyxNQUFQLENBQWMsSUFBZCxDQUFtQixHQUFuQjs7QUFFQSxTQUFLLEdBQUwsRUFBVSxlQUFPO0FBQ2YsVUFBSSxHQUFKLEdBQVUsR0FBVjtBQUNBLHdCQUFNLElBQU4sRUFBWSxPQUFPLEdBQVAsQ0FBWjtBQUNBLGFBQU8sTUFBUCxDQUFjLEdBQWQ7QUFDRCxLQUpEO0FBS0QsR0FURDs7QUFXQSxNQUFNLFFBQVEsU0FBUixLQUFRLEdBQU07QUFDbEIsc0JBQU0sTUFBTixFQUFjLEtBQUssR0FBTCxDQUFkO0FBQ0QsR0FGRDs7QUFJQSxRQUFNLE9BQU4sR0FBZ0IsS0FBaEI7O0FBRUEsU0FBTztBQUNMLGNBREs7QUFFTDtBQUZLLEdBQVA7QUFJRCxDOzs7Ozs7Ozs7QUMzQ0Q7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQUksYUFBSjtBQUNBLElBQU0sT0FBTyxvQ0FBYjs7QUFFQTs7O0FBR0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFDLElBQUQsRUFBVTtBQUN2QixNQUFJLGVBQWUsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQW5COztBQUVBLE1BQUksS0FBSyx3QkFBUyxJQUFULEVBQWUsTUFBZixDQUFUO0FBQ0Esa0JBQWdCLGFBQWEsV0FBYixDQUF5QixFQUF6QixDQUFoQjtBQUNBLFNBQU8sRUFBUDtBQUNELENBTkQ7O0FBUUE7OztBQUdBLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBQyxJQUFELEVBQVU7QUFDdkIsTUFBSSxlQUFlLFNBQVMsY0FBVCxDQUF3QixjQUF4QixDQUFuQjs7QUFFQSxNQUFJLFFBQVEsUUFBUSxJQUFSLENBQWEsSUFBYixDQUFaO0FBQ0EsTUFBSSxLQUFKLEVBQVcsT0FBTyx3QkFBUyxJQUFULENBQWMsSUFBZCxDQUFQOztBQUVYLE1BQUksU0FBUyxNQUFNLElBQU4sQ0FBVyxJQUFYLENBQWI7QUFDQSxNQUFJLE1BQUosRUFBWSxPQUFPLGlCQUFPLEVBQVAsQ0FBVSxJQUFWLENBQVA7O0FBRVosTUFBSSxRQUFRLFlBQVIsSUFBd0IsYUFBYSxRQUFiLENBQXNCLElBQXRCLENBQTVCLEVBQXlELGFBQWEsV0FBYixDQUF5QixJQUF6Qjs7QUFFekQsU0FBTyxPQUFPLElBQVAsQ0FBUDs7QUFFQSxTQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsS0FBSyxFQUE1QjtBQUNELENBZEQ7O0FBZ0JBOzs7O0FBSUEsaUJBQU8sRUFBUCxDQUFVLGFBQVYsRUFBeUIsZ0JBQWU7QUFBQSxNQUFaLEtBQVksUUFBWixLQUFZOztBQUN0QyxNQUFJLFVBQVUsRUFBVixJQUFnQix3QkFBd0IsSUFBeEIsQ0FBNkIsS0FBN0IsQ0FBcEIsRUFBd0Q7QUFDdEQsV0FBTyxLQUFLLFNBQUwsRUFBUDtBQUNEO0FBQ0YsQ0FKRDs7a0JBTWUsWUFBTTtBQUNuQixTQUFPLE9BQU8sS0FBSyxTQUFMLEVBQVAsQ0FBUDtBQUNELEM7Ozs7O0FDbkREOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsT0FBTyxNQUFQLEdBQWdCLG9CQUFLLFNBQVMsSUFBZCxFQUFvQjtBQUNqRCxTQUFPLEdBRDBDO0FBRWpELFdBQVM7QUFGd0MsQ0FBcEIsQ0FBL0I7O0FBS0EsT0FBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBTTtBQUNoRDs7QUFFQSxtQkFBTyxFQUFQLENBQVUsYUFBVixFQUF5QixnQkFBZTtBQUFBLFFBQVosS0FBWSxRQUFaLEtBQVk7O0FBQ3RDLHFCQUFPLE1BQVA7QUFDRCxHQUZEOztBQUlBLG1CQUFPLE1BQVA7QUFDRCxDQVJEOzs7Ozs7OztBQ1ZBLElBQU0sWUFBWSxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBbEI7QUFDQSxTQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLFNBQTFCOztBQUVBLElBQU0sU0FBUyxDQUNiLFNBRGEsRUFFYixTQUZhLEVBR2IsU0FIYSxDQUFmOztBQU1BLElBQU0sY0FBYyxTQUFkLFdBQWM7QUFBQSxTQUFNLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLE1BQWlCLElBQUksQ0FBckIsSUFBMEIsQ0FBckMsQ0FBUCxDQUFOO0FBQUEsQ0FBcEI7O0FBRUEsSUFBTSxZQUFZLFNBQVosU0FBWTtBQUFBLFNBQUssYUFBYSxPQUFiLENBQXFCLEtBQXJCLEVBQTRCLEtBQUssU0FBTCxDQUFlO0FBQ2hFLFdBQU87QUFEeUQsR0FBZixDQUE1QixDQUFMO0FBQUEsQ0FBbEI7O0FBSUEsSUFBTSxZQUFZLFNBQVosU0FBWTtBQUFBLFNBQU0sYUFBYSxPQUFiLENBQXFCLEtBQXJCLElBQ3RCLEtBQUssS0FBTCxDQUFXLGFBQWEsT0FBYixDQUFxQixLQUFyQixDQUFYLEVBQXdDLEtBRGxCLEdBR3RCLElBSGdCO0FBQUEsQ0FBbEI7O0FBTUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxHQUFNO0FBQ3JCLE1BQUksSUFBSSxhQUFSO0FBQ0EsTUFBSSxPQUFPLFdBQVg7O0FBRUEsU0FBTyxNQUFNLElBQWIsRUFBa0I7QUFDaEIsUUFBSSxhQUFKO0FBQ0Q7O0FBRUQsWUFBVSxDQUFWO0FBQ0EsU0FBTyxDQUFQO0FBQ0QsQ0FWRDs7QUFZQSxJQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsTUFBSSxRQUFRLFVBQVo7O0FBRUEsWUFBVSxTQUFWLDRCQUNrQixLQURsQiw0REFHd0IsS0FIeEIsNkRBTXdCLEtBTnhCO0FBU0QsQ0FaRDs7a0JBY2U7QUFDYixVQUFRLE1BREs7QUFFYjtBQUZhLEM7Ozs7Ozs7OztBQy9DZjs7Ozs7O0FBRUE7Ozs7QUFJQSxJQUFNLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWlCO0FBQ3ZDLE1BQUksS0FBSyxPQUFPLEVBQVAsR0FBWSxPQUFPLEVBQW5CLEdBQXdCLEtBQWpDOztBQUVBLE1BQUksQ0FBQyxFQUFMLEVBQVM7O0FBRVQsS0FBRyxLQUFILEVBQVUsRUFBQyxNQUFNLElBQVAsRUFBYSxPQUFPLEtBQXBCLEVBQVY7QUFDQSxLQUFHLE1BQUgsRUFBVyxVQUFYO0FBQ0QsQ0FQRDs7QUFTQSxJQUFNLE1BQU0sd0JBQVM7QUFDbkIsUUFBTTtBQURhLENBQVQsQ0FBWjs7QUFJQSxJQUFJLEVBQUosQ0FBTyxhQUFQLEVBQXNCLGdCQUFzQjtBQUFBLE1BQW5CLEtBQW1CLFFBQW5CLEtBQW1CO0FBQUEsTUFBWixLQUFZLFFBQVosS0FBWTs7QUFDMUMsa0JBQWdCLEtBQWhCLEVBQXVCLEtBQXZCO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJLEVBQUosQ0FBTyxrQkFBUCxFQUEyQjtBQUFBLFNBQU0sVUFBVSxPQUFPLEdBQVAsRUFBaEI7QUFBQSxDQUEzQjs7QUFFQSxPQUFPLEdBQVAsR0FBYSxHQUFiOztrQkFFZSxHIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgY2FjaGUgPSB7fTtcblxuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBzZXQ6IGZ1bmN0aW9uIHNldChyb3V0ZSwgcmVzKSB7XG4gICAgY2FjaGUgPSBfZXh0ZW5kcyh7fSwgY2FjaGUsIF9kZWZpbmVQcm9wZXJ0eSh7fSwgcm91dGUsIHJlcykpO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIGdldChyb3V0ZSkge1xuICAgIHJldHVybiBjYWNoZVtyb3V0ZV07XG4gIH0sXG4gIGdldENhY2hlOiBmdW5jdGlvbiBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4gY2FjaGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGlzRHVwZSA9IGZ1bmN0aW9uIGlzRHVwZShzY3JpcHQsIGV4aXN0aW5nKSB7XG4gIHZhciBkdXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZXhpc3RpbmcubGVuZ3RoOyBpKyspIHtcbiAgICBzY3JpcHQuaXNFcXVhbE5vZGUoZXhpc3RpbmdbaV0pICYmIGR1cGVzLnB1c2goaSk7XG4gIH1cblxuICByZXR1cm4gZHVwZXMubGVuZ3RoID4gMDtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChuZXdEb20sIGV4aXN0aW5nRG9tKSB7XG4gIHZhciBleGlzdGluZyA9IGV4aXN0aW5nRG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgdmFyIHNjcmlwdHMgPSBuZXdEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0R1cGUoc2NyaXB0c1tpXSwgZXhpc3RpbmcpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHZhciBzcmMgPSBzY3JpcHRzW2ldLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdzcmMnKTtcblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHMuc3JjID0gc3JjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzLmlubmVySFRNTCA9IHNjcmlwdHNbaV0uaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocyk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxudmFyIF9kZWxlZ2F0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWxlZ2F0ZSk7XG5cbnZhciBfb3BlcmF0b3IgPSByZXF1aXJlKCcuL29wZXJhdG9yJyk7XG5cbnZhciBfb3BlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3BlcmF0b3IpO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciBfcmVmJHJvb3QgPSBfcmVmLnJvb3QsXG4gICAgICByb290ID0gX3JlZiRyb290ID09PSB1bmRlZmluZWQgPyBkb2N1bWVudC5ib2R5IDogX3JlZiRyb290LFxuICAgICAgX3JlZiRkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICBkdXJhdGlvbiA9IF9yZWYkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IDAgOiBfcmVmJGR1cmF0aW9uLFxuICAgICAgX3JlZiRoYW5kbGVycyA9IF9yZWYuaGFuZGxlcnMsXG4gICAgICBoYW5kbGVycyA9IF9yZWYkaGFuZGxlcnMgPT09IHVuZGVmaW5lZCA/IFtdIDogX3JlZiRoYW5kbGVycztcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVcbiAgICovXG4gIHZhciBvcGVyYXRvciA9IG5ldyBfb3BlcmF0b3IyLmRlZmF1bHQoe1xuICAgIHJvb3Q6IHJvb3QsXG4gICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgIGhhbmRsZXJzOiBoYW5kbGVyc1xuICB9KTtcblxuICAvKipcbiAgICogQm9vdHN0cmFwXG4gICAqL1xuICBvcGVyYXRvci5zZXRTdGF0ZSh7XG4gICAgcm91dGU6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gsXG4gICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBCaW5kIGFuZCB2YWxpZGF0ZSBhbGwgbGlua3NcbiAgICovXG4gICgwLCBfZGVsZWdhdGUyLmRlZmF1bHQpKGRvY3VtZW50LCAnYScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGFuY2hvciA9IGUuZGVsZWdhdGVUYXJnZXQ7XG4gICAgdmFyIGhyZWYgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nO1xuXG4gICAgdmFyIGludGVybmFsID0gX3VybC5saW5rLmlzU2FtZU9yaWdpbihocmVmKTtcbiAgICB2YXIgZXh0ZXJuYWwgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJztcbiAgICB2YXIgZGlzYWJsZWQgPSBhbmNob3IuY2xhc3NMaXN0LmNvbnRhaW5zKCduby1hamF4Jyk7XG4gICAgdmFyIGlnbm9yZWQgPSBvcGVyYXRvci52YWxpZGF0ZShlLCBocmVmKTtcbiAgICB2YXIgaGFzaCA9IF91cmwubGluay5pc0hhc2goaHJlZik7XG5cbiAgICBpZiAoIWludGVybmFsIHx8IGV4dGVybmFsIHx8IGRpc2FibGVkIHx8IGlnbm9yZWQgfHwgaGFzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChfdXJsLmxpbmsuaXNTYW1lVVJMKGhyZWYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3BlcmF0b3IuZ28oaHJlZik7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgcG9wc3RhdGVcbiAgICovXG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaHJlZiA9IGUudGFyZ2V0LmxvY2F0aW9uLmhyZWY7XG5cbiAgICBpZiAob3BlcmF0b3IudmFsaWRhdGUoZSwgaHJlZikpIHtcbiAgICAgIGlmIChfdXJsLmxpbmsuaXNIYXNoKGhyZWYpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3BzdGF0ZSBieXBhc3NlcyByb3V0ZXIsIHNvIHdlXG4gICAgICogbmVlZCB0byB0ZWxsIGl0IHdoZXJlIHdlIHdlbnQgdG9cbiAgICAgKiB3aXRob3V0IHB1c2hpbmcgc3RhdGVcbiAgICAgKi9cbiAgICBvcGVyYXRvci5nbyhocmVmLCBudWxsLCB0cnVlKTtcbiAgfTtcblxuICByZXR1cm4gb3BlcmF0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbnZhciBhY3RpdmVMaW5rcyA9IFtdO1xuXG52YXIgdG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlKGJvb2wpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3RpdmVMaW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGFjdGl2ZUxpbmtzW2ldLmNsYXNzTGlzdFtib29sID8gJ2FkZCcgOiAncmVtb3ZlJ10oJ2lzLWFjdGl2ZScpO1xuICB9XG59O1xuXG4vLyBUT0RPIGRvIEkgbmVlZCB0byBlbXB0eSB0aGUgYXJyYXlcbi8vIG9yIGNhbiBJIGp1c3QgcmVzZXQgdG8gW11cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHJvdXRlKSB7XG4gIHRvZ2dsZShmYWxzZSk7XG5cbiAgYWN0aXZlTGlua3Muc3BsaWNlKDAsIGFjdGl2ZUxpbmtzLmxlbmd0aCk7XG4gIGFjdGl2ZUxpbmtzLnB1c2guYXBwbHkoYWN0aXZlTGlua3MsIF90b0NvbnN1bWFibGVBcnJheShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZiQ9XCInICsgcm91dGUgKyAnXCJdJykpKSk7XG5cbiAgdG9nZ2xlKHRydWUpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfbmFub2FqYXggPSByZXF1aXJlKCduYW5vYWpheCcpO1xuXG52YXIgX25hbm9hamF4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hbm9hamF4KTtcblxudmFyIF9uYXZpZ28gPSByZXF1aXJlKCduYXZpZ28nKTtcblxudmFyIF9uYXZpZ28yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmF2aWdvKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbiA9IHJlcXVpcmUoJ3Njcm9sbC1yZXN0b3JhdGlvbicpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Njcm9sbFJlc3RvcmF0aW9uKTtcblxudmFyIF9sb29wID0gcmVxdWlyZSgnbG9vcC5qcycpO1xuXG52YXIgX2xvb3AyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9vcCk7XG5cbnZhciBfdXJsID0gcmVxdWlyZSgnLi91cmwnKTtcblxudmFyIF9saW5rcyA9IHJlcXVpcmUoJy4vbGlua3MnKTtcblxudmFyIF9saW5rczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saW5rcyk7XG5cbnZhciBfcmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcblxudmFyIF9yZW5kZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVuZGVyKTtcblxudmFyIF9zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcblxudmFyIF9zdGF0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGF0ZSk7XG5cbnZhciBfY2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5cbnZhciBfY2FjaGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FjaGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgcm91dGVyID0gbmV3IF9uYXZpZ28yLmRlZmF1bHQoX3VybC5vcmlnaW4pO1xuXG52YXIgT3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE9wZXJhdG9yKGNvbmZpZykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPcGVyYXRvcik7XG5cbiAgICB2YXIgZXZlbnRzID0gKDAsIF9sb29wMi5kZWZhdWx0KSgpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAvLyBjcmVhdGUgY3VycmllZCByZW5kZXIgZnVuY3Rpb25cbiAgICB0aGlzLnJlbmRlciA9ICgwLCBfcmVuZGVyMi5kZWZhdWx0KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KSwgY29uZmlnLCBldmVudHMuZW1pdCk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGV2ZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoT3BlcmF0b3IsIFt7XG4gICAga2V5OiAnc3RvcCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICBfc3RhdGUyLmRlZmF1bHQucGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzdGFydCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldFN0YXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgICByZXR1cm4gX3N0YXRlMi5kZWZhdWx0Ll9zdGF0ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRTdGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFN0YXRlKF9yZWYpIHtcbiAgICAgIHZhciByb3V0ZSA9IF9yZWYucm91dGUsXG4gICAgICAgICAgdGl0bGUgPSBfcmVmLnRpdGxlO1xuXG4gICAgICBfc3RhdGUyLmRlZmF1bHQucm91dGUgPSByb3V0ZSA9PT0gJycgPyAnLycgOiByb3V0ZTtcbiAgICAgIHRpdGxlID8gX3N0YXRlMi5kZWZhdWx0LnRpdGxlID0gdGl0bGUgOiBudWxsO1xuXG4gICAgICAoMCwgX2xpbmtzMi5kZWZhdWx0KShfc3RhdGUyLmRlZmF1bHQucm91dGUpO1xuXG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBocmVmXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlc29sdmUgVXNlIE5hdmlnby5yZXNvbHZlKCksIGJ5cGFzcyBOYXZpZ28ubmF2aWdhdGUoKVxuICAgICAqXG4gICAgICogUG9wc3RhdGUgY2hhbmdlcyB0aGUgVVJMIGZvciB1cywgc28gaWYgd2Ugd2VyZSB0b1xuICAgICAqIHJvdXRlci5uYXZpZ2F0ZSgpIHRvIHRoZSBwcmV2aW91cyBsb2NhdGlvbiwgaXQgd291bGQgcHVzaFxuICAgICAqIGEgZHVwbGljYXRlIHJvdXRlIHRvIGhpc3RvcnkgYW5kIHdlIHdvdWxkIGNyZWF0ZSBhIGxvb3AuXG4gICAgICpcbiAgICAgKiByb3V0ZXIucmVzb2x2ZSgpIGxldCdzIE5hdmlnbyBrbm93IHdlJ3ZlIG1vdmVkLCB3aXRob3V0XG4gICAgICogYWx0ZXJpbmcgaGlzdG9yeS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ28nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnbyhocmVmKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICB2YXIgcmVzb2x2ZSA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgaWYgKF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjayh0aXRsZSkge1xuICAgICAgICB2YXIgcmVzID0ge1xuICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgfTtcblxuICAgICAgICByZXNvbHZlID8gcm91dGVyLnJlc29sdmUocm91dGUpIDogcm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcblxuICAgICAgICBfdGhpcy5zZXRTdGF0ZShyZXMpO1xuXG4gICAgICAgIF90aGlzLmVtaXQoJ3JvdXRlOmFmdGVyJywgcmVzKTtcblxuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjYihyZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgcm91dGUgPSAoMCwgX3VybC5zYW5pdGl6ZSkoaHJlZik7XG5cbiAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5zYXZlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWNoZWQgPSBfY2FjaGUyLmRlZmF1bHQuZ2V0KHJvdXRlKTtcblxuICAgICAgdGhpcy5lbWl0KCdyb3V0ZTpiZWZvcmUnLCB7IHJvdXRlOiByb3V0ZSB9KTtcblxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIocm91dGUsIGNhY2hlZCwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdldChyb3V0ZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldChyb3V0ZSwgY2IpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gX25hbm9hamF4Mi5kZWZhdWx0LmFqYXgoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6IF91cmwub3JpZ2luICsgJy8nICsgcm91dGVcbiAgICAgIH0sIGZ1bmN0aW9uIChzdGF0dXMsIHJlcywgcmVxKSB7XG4gICAgICAgIGlmIChyZXEuc3RhdHVzIDwgMjAwIHx8IHJlcS5zdGF0dXMgPiAzMDAgJiYgcmVxLnN0YXR1cyAhPT0gMzA0KSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gX3VybC5vcmlnaW4gKyAnLycgKyBfc3RhdGUyLmRlZmF1bHQucHJldi5yb3V0ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfY2FjaGUyLmRlZmF1bHQuc2V0KHJvdXRlLCByZXEucmVzcG9uc2UpO1xuXG4gICAgICAgIF90aGlzMi5yZW5kZXIocm91dGUsIHJlcS5yZXNwb25zZSwgY2IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncHVzaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1c2goKSB7XG4gICAgICB2YXIgcm91dGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICB2YXIgdGl0bGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9zdGF0ZTIuZGVmYXVsdC50aXRsZTtcblxuICAgICAgaWYgKCFyb3V0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKHJvdXRlKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3V0ZTogcm91dGUsIHRpdGxlOiB0aXRsZSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd2YWxpZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHZhciBldmVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciBocmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfc3RhdGUyLmRlZmF1bHQucm91dGU7XG5cbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfdXJsLnNhbml0aXplKShocmVmKTtcblxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmhhbmRsZXJzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0KSkge1xuICAgICAgICAgIHZhciByZXMgPSB0WzFdKHJvdXRlKTtcbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBfdGhpczMuZW1pdCh0WzBdLCB7XG4gICAgICAgICAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdChyb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE9wZXJhdG9yO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBPcGVyYXRvcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdGFycnkgPSByZXF1aXJlKCd0YXJyeS5qcycpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uID0gcmVxdWlyZSgnc2Nyb2xsLXJlc3RvcmF0aW9uJyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsUmVzdG9yYXRpb24pO1xuXG52YXIgX2V2YWwgPSByZXF1aXJlKCcuL2V2YWwuanMnKTtcblxudmFyIF9ldmFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V2YWwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBTdHJpbmdpZmllZCBIVE1MXG4gKiBAcmV0dXJuIHtvYmplY3R9IERPTSBub2RlLCAjcGFnZVxuICovXG52YXIgcGFyc2VSZXNwb25zZSA9IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UoaHRtbCkge1xuICByZXR1cm4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCAndGV4dC9odG1sJyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYWdlIFJvb3QgYXBwbGljYXRpb24gRE9NIG5vZGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgRHVyYXRpb24gYW5kIHJvb3Qgbm9kZSBzZWxlY3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZW1pdCBFbWl0dGVyIGZ1bmN0aW9uIGZyb20gT3BlcmF0b3IgaW5zdGFuY2VcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgTmV3IG1hcmt1cCBmcm9tIEFKQVggcmVzcG9uc2VcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrXG4gKi9cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHBhZ2UsIF9yZWYsIGVtaXQpIHtcbiAgdmFyIGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbixcbiAgICAgIHJvb3QgPSBfcmVmLnJvb3Q7XG4gIHJldHVybiBmdW5jdGlvbiAocm91dGUsIG1hcmt1cCwgY2IpIHtcbiAgICB2YXIgcmVzID0gcGFyc2VSZXNwb25zZShtYXJrdXApO1xuICAgIHZhciB0aXRsZSA9IHJlcy50aXRsZTtcblxuICAgIHZhciBzdGFydCA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YmVmb3JlJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtdHJhbnNpdGlvbmluZycpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSBwYWdlLmNsaWVudEhlaWdodCArICdweCc7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVuZGVyID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgcGFnZS5pbm5lckhUTUwgPSByZXMucXVlcnlTZWxlY3Rvcihyb290KS5pbm5lckhUTUw7XG4gICAgICAoMCwgX2V2YWwyLmRlZmF1bHQpKHJlcywgZG9jdW1lbnQpO1xuICAgICAgX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIHZhciBlbmQgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBlbWl0KCd0cmFuc2l0aW9uOmFmdGVyJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgICBjYih0aXRsZSk7XG4gICAgICBwYWdlLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXRyYW5zaXRpb25pbmcnKTtcbiAgICB9KTtcblxuICAgICgwLCBfdGFycnkucXVldWUpKHN0YXJ0KDApLCByZW5kZXIoZHVyYXRpb24pLCBlbmQoMCkpKCk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgcGF1c2VkOiBmYWxzZSxcbiAgX3N0YXRlOiB7XG4gICAgcm91dGU6ICcnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBwcmV2OiB7XG4gICAgICByb3V0ZTogJy8nLFxuICAgICAgdGl0bGU6ICcnXG4gICAgfVxuICB9LFxuICBnZXQgcm91dGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnJvdXRlO1xuICB9LFxuICBzZXQgcm91dGUobG9jKSB7XG4gICAgdGhpcy5fc3RhdGUucHJldi5yb3V0ZSA9IHRoaXMucm91dGU7XG4gICAgdGhpcy5fc3RhdGUucm91dGUgPSBsb2M7XG4gIH0sXG4gIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUudGl0bGU7XG4gIH0sXG4gIHNldCB0aXRsZSh2YWwpIHtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB0aGlzLl9zdGF0ZS50aXRsZSA9IHZhbDtcbiAgfSxcbiAgZ2V0IHByZXYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnByZXY7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGdldE9yaWdpbiA9IGZ1bmN0aW9uIGdldE9yaWdpbihsb2NhdGlvbikge1xuICB2YXIgcHJvdG9jb2wgPSBsb2NhdGlvbi5wcm90b2NvbCxcbiAgICAgIGhvc3QgPSBsb2NhdGlvbi5ob3N0O1xuXG4gIHJldHVybiBwcm90b2NvbCArICcvLycgKyBob3N0O1xufTtcblxudmFyIHBhcnNlVVJMID0gZnVuY3Rpb24gcGFyc2VVUkwodXJsKSB7XG4gIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBhLmhyZWYgPSB1cmw7XG4gIHJldHVybiBhO1xufTtcblxudmFyIG9yaWdpbiA9IGV4cG9ydHMub3JpZ2luID0gZ2V0T3JpZ2luKHdpbmRvdy5sb2NhdGlvbik7XG5cbnZhciBvcmlnaW5SZWdFeCA9IG5ldyBSZWdFeHAob3JpZ2luKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFJhdyBVUkwgdG8gcGFyc2VcbiAqIEByZXR1cm4ge3N0cmluZ30gVVJMIHNhbnMgb3JpZ2luIGFuZCBzYW5zIGxlYWRpbmcgc2xhc2hcbiAqL1xudmFyIHNhbml0aXplID0gZXhwb3J0cy5zYW5pdGl6ZSA9IGZ1bmN0aW9uIHNhbml0aXplKHVybCkge1xuICB2YXIgcm91dGUgPSB1cmwucmVwbGFjZShvcmlnaW5SZWdFeCwgJycpO1xuICByZXR1cm4gcm91dGUubWF0Y2goL15cXC8vKSA/IHJvdXRlLnJlcGxhY2UoL1xcL3sxfS8sICcnKSA6IHJvdXRlOyAvLyByZW1vdmUgLyBhbmQgcmV0dXJuXG59O1xuXG52YXIgbGluayA9IGV4cG9ydHMubGluayA9IHtcbiAgaXNTYW1lT3JpZ2luOiBmdW5jdGlvbiBpc1NhbWVPcmlnaW4oaHJlZikge1xuICAgIHJldHVybiBvcmlnaW4gPT09IGdldE9yaWdpbihwYXJzZVVSTChocmVmKSk7XG4gIH0sXG4gIGlzSGFzaDogZnVuY3Rpb24gaXNIYXNoKGhyZWYpIHtcbiAgICByZXR1cm4gKC8jLy50ZXN0KGhyZWYpXG4gICAgKTtcbiAgfSxcbiAgaXNTYW1lVVJMOiBmdW5jdGlvbiBpc1NhbWVVUkwoaHJlZikge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uc2VhcmNoID09PSBwYXJzZVVSTChocmVmKS5zZWFyY2ggJiYgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBwYXJzZVVSTChocmVmKS5wYXRobmFtZTtcbiAgfVxufTsiLCJ2YXIgRE9DVU1FTlRfTk9ERV9UWVBFID0gOTtcblxuLyoqXG4gKiBBIHBvbHlmaWxsIGZvciBFbGVtZW50Lm1hdGNoZXMoKVxuICovXG5pZiAodHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgdmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XG5cbiAgICBwcm90by5tYXRjaGVzID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5vTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgY2xvc2VzdCBwYXJlbnQgdGhhdCBtYXRjaGVzIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IERPQ1VNRU5UX05PREVfVFlQRSkge1xuICAgICAgICBpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb3Nlc3Q7XG4iLCJ2YXIgY2xvc2VzdCA9IHJlcXVpcmUoJy4vY2xvc2VzdCcpO1xuXG4vKipcbiAqIERlbGVnYXRlcyBldmVudCB0byBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBkZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBjbG9zZXN0IG1hdGNoIGFuZCBpbnZva2VzIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBsaXN0ZW5lcihlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IpO1xuXG4gICAgICAgIGlmIChlLmRlbGVnYXRlVGFyZ2V0KSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsZW1lbnQsIGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG8gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB7fTtcblxuICB2YXIgb24gPSBmdW5jdGlvbiBvbihlKSB7XG4gICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgaWYgKCFjYikgcmV0dXJuO1xuICAgIGxpc3RlbmVyc1tlXSA9IGxpc3RlbmVyc1tlXSB8fCB7IHF1ZXVlOiBbXSB9O1xuICAgIGxpc3RlbmVyc1tlXS5xdWV1ZS5wdXNoKGNiKTtcbiAgfTtcblxuICB2YXIgZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZSkge1xuICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgdmFyIGl0ZW1zID0gbGlzdGVuZXJzW2VdID8gbGlzdGVuZXJzW2VdLnF1ZXVlIDogZmFsc2U7XG4gICAgaXRlbXMgJiYgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIGkoZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBvLCB7XG4gICAgZW1pdDogZW1pdCxcbiAgICBvbjogb25cbiAgfSk7XG59OyIsIi8vIEJlc3QgcGxhY2UgdG8gZmluZCBpbmZvcm1hdGlvbiBvbiBYSFIgZmVhdHVyZXMgaXM6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3RcblxudmFyIHJlcWZpZWxkcyA9IFtcbiAgJ3Jlc3BvbnNlVHlwZScsICd3aXRoQ3JlZGVudGlhbHMnLCAndGltZW91dCcsICdvbnByb2dyZXNzJ1xuXVxuXG4vLyBTaW1wbGUgYW5kIHNtYWxsIGFqYXggZnVuY3Rpb25cbi8vIFRha2VzIGEgcGFyYW1ldGVycyBvYmplY3QgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb25cbi8vIFBhcmFtZXRlcnM6XG4vLyAgLSB1cmw6IHN0cmluZywgcmVxdWlyZWRcbi8vICAtIGhlYWRlcnM6IG9iamVjdCBvZiBge2hlYWRlcl9uYW1lOiBoZWFkZXJfdmFsdWUsIC4uLn1gXG4vLyAgLSBib2R5OlxuLy8gICAgICArIHN0cmluZyAoc2V0cyBjb250ZW50IHR5cGUgdG8gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgaWYgbm90IHNldCBpbiBoZWFkZXJzKVxuLy8gICAgICArIEZvcm1EYXRhIChkb2Vzbid0IHNldCBjb250ZW50IHR5cGUgc28gdGhhdCBicm93c2VyIHdpbGwgc2V0IGFzIGFwcHJvcHJpYXRlKVxuLy8gIC0gbWV0aG9kOiAnR0VUJywgJ1BPU1QnLCBldGMuIERlZmF1bHRzIHRvICdHRVQnIG9yICdQT1NUJyBiYXNlZCBvbiBib2R5XG4vLyAgLSBjb3JzOiBJZiB5b3VyIHVzaW5nIGNyb3NzLW9yaWdpbiwgeW91IHdpbGwgbmVlZCB0aGlzIHRydWUgZm9yIElFOC05XG4vL1xuLy8gVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgb250byB0aGUgeGhyIG9iamVjdC5cbi8vIElNUE9SVEFOVCBOT1RFOiBUaGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb21wYXRpYmlsaXR5IGNoZWNraW5nLlxuLy8gIC0gcmVzcG9uc2VUeXBlOiBzdHJpbmcsIHZhcmlvdXMgY29tcGF0YWJpbGl0eSwgc2VlIHhociBkb2NzIGZvciBlbnVtIG9wdGlvbnNcbi8vICAtIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbiwgSUUxMCssIENPUlMgb25seVxuLy8gIC0gdGltZW91dDogbG9uZywgbXMgdGltZW91dCwgSUU4K1xuLy8gIC0gb25wcm9ncmVzczogY2FsbGJhY2ssIElFMTArXG4vL1xuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gcHJvdG90eXBlOlxuLy8gIC0gc3RhdHVzQ29kZSBmcm9tIHJlcXVlc3Rcbi8vICAtIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlc3BvbnNlVHlwZSBzZXQgYW5kIHN1cHBvcnRlZCBieSBicm93c2VyLCB0aGlzIGlzIGFuIG9iamVjdCBvZiBzb21lIHR5cGUgKHNlZSBkb2NzKVxuLy8gICAgKyBvdGhlcndpc2UgaWYgcmVxdWVzdCBjb21wbGV0ZWQsIHRoaXMgaXMgdGhlIHN0cmluZyB0ZXh0IG9mIHRoZSByZXNwb25zZVxuLy8gICAgKyBpZiByZXF1ZXN0IGlzIGFib3J0ZWQsIHRoaXMgaXMgXCJBYm9ydFwiXG4vLyAgICArIGlmIHJlcXVlc3QgdGltZXMgb3V0LCB0aGlzIGlzIFwiVGltZW91dFwiXG4vLyAgICArIGlmIHJlcXVlc3QgZXJyb3JzIGJlZm9yZSBjb21wbGV0aW5nIChwcm9iYWJseSBhIENPUlMgaXNzdWUpLCB0aGlzIGlzIFwiRXJyb3JcIlxuLy8gIC0gcmVxdWVzdCBvYmplY3Rcbi8vXG4vLyBSZXR1cm5zIHRoZSByZXF1ZXN0IG9iamVjdC4gU28geW91IGNhbiBjYWxsIC5hYm9ydCgpIG9yIG90aGVyIG1ldGhvZHNcbi8vXG4vLyBERVBSRUNBVElPTlM6XG4vLyAgLSBQYXNzaW5nIGEgc3RyaW5nIGluc3RlYWQgb2YgdGhlIHBhcmFtcyBvYmplY3QgaGFzIGJlZW4gcmVtb3ZlZCFcbi8vXG5leHBvcnRzLmFqYXggPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAvLyBBbnkgdmFyaWFibGUgdXNlZCBtb3JlIHRoYW4gb25jZSBpcyB2YXInZCBoZXJlIGJlY2F1c2VcbiAgLy8gbWluaWZpY2F0aW9uIHdpbGwgbXVuZ2UgdGhlIHZhcmlhYmxlcyB3aGVyZWFzIGl0IGNhbid0IG11bmdlXG4gIC8vIHRoZSBvYmplY3QgYWNjZXNzLlxuICB2YXIgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzIHx8IHt9XG4gICAgLCBib2R5ID0gcGFyYW1zLmJvZHlcbiAgICAsIG1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgKGJvZHkgPyAnUE9TVCcgOiAnR0VUJylcbiAgICAsIGNhbGxlZCA9IGZhbHNlXG5cbiAgdmFyIHJlcSA9IGdldFJlcXVlc3QocGFyYW1zLmNvcnMpXG5cbiAgZnVuY3Rpb24gY2Ioc3RhdHVzQ29kZSwgcmVzcG9uc2VUZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IHN0YXR1c0NvZGUgOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICByZXEuc3RhdHVzID09PSAwID8gXCJFcnJvclwiIDogKHJlcS5yZXNwb25zZSB8fCByZXEucmVzcG9uc2VUZXh0IHx8IHJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgIHJlcSlcbiAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSlcblxuICB2YXIgc3VjY2VzcyA9IHJlcS5vbmxvYWQgPSBjYigyMDApXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSBzdWNjZXNzKClcbiAgfVxuICByZXEub25lcnJvciA9IGNiKG51bGwsICdFcnJvcicpXG4gIHJlcS5vbnRpbWVvdXQgPSBjYihudWxsLCAnVGltZW91dCcpXG4gIHJlcS5vbmFib3J0ID0gY2IobnVsbCwgJ0Fib3J0JylcblxuICBpZiAoYm9keSkge1xuICAgIHNldERlZmF1bHQoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKVxuXG4gICAgaWYgKCFnbG9iYWwuRm9ybURhdGEgfHwgIShib2R5IGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSkge1xuICAgICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcWZpZWxkcy5sZW5ndGgsIGZpZWxkOyBpIDwgbGVuOyBpKyspIHtcbiAgICBmaWVsZCA9IHJlcWZpZWxkc1tpXVxuICAgIGlmIChwYXJhbXNbZmllbGRdICE9PSB1bmRlZmluZWQpXG4gICAgICByZXFbZmllbGRdID0gcGFyYW1zW2ZpZWxkXVxuICB9XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gaGVhZGVycylcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgaGVhZGVyc1tmaWVsZF0pXG5cbiAgcmVxLnNlbmQoYm9keSlcblxuICByZXR1cm4gcmVxXG59XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoY29ycykge1xuICAvLyBYRG9tYWluUmVxdWVzdCBpcyBvbmx5IHdheSB0byBkbyBDT1JTIGluIElFIDggYW5kIDlcbiAgLy8gQnV0IFhEb21haW5SZXF1ZXN0IGlzbid0IHN0YW5kYXJkcy1jb21wYXRpYmxlXG4gIC8vIE5vdGFibHksIGl0IGRvZXNuJ3QgYWxsb3cgY29va2llcyB0byBiZSBzZW50IG9yIHNldCBieSBzZXJ2ZXJzXG4gIC8vIElFIDEwKyBpcyBzdGFuZGFyZHMtY29tcGF0aWJsZSBpbiBpdHMgWE1MSHR0cFJlcXVlc3RcbiAgLy8gYnV0IElFIDEwIGNhbiBzdGlsbCBoYXZlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB1c2UgaXRcbiAgaWYgKGNvcnMgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICEvTVNJRSAxLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3RcbiAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdClcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHQob2JqLCBrZXksIHZhbHVlKSB7XG4gIG9ialtrZXldID0gb2JqW2tleV0gfHwgdmFsdWVcbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiTmF2aWdvXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdHZhciBQQVJBTUVURVJfUkVHRVhQID0gLyhbOipdKShcXHcrKS9nO1xuXHR2YXIgV0lMRENBUkRfUkVHRVhQID0gL1xcKi9nO1xuXHR2YXIgUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFAgPSAnKFteXFwvXSspJztcblx0dmFyIFJFUExBQ0VfV0lMRENBUkQgPSAnKD86LiopJztcblx0dmFyIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCA9ICcoPzpcXC8kfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0VXJsRGVwdGgodXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXC8kLywgJycpLnNwbGl0KCcvJykubGVuZ3RoO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjb21wYXJlVXJsRGVwdGgodXJsQSwgdXJsQikge1xuXHQgIHJldHVybiBnZXRVcmxEZXB0aCh1cmxBKSA8IGdldFVybERlcHRoKHVybEIpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwpIHtcblx0ICB2YXIgcm91dGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHJldHVybiByb3V0ZXMubWFwKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIF9yZXBsYWNlRHluYW1pY1VSTFBhciA9IHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHZhciByZWdleHAgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucmVnZXhwO1xuXHQgICAgdmFyIHBhcmFtTmFtZXMgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucGFyYW1OYW1lcztcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXhwKTtcblx0ICAgIHZhciBwYXJhbXMgPSByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgcGFyYW1OYW1lcyk7XG5cdFxuXHQgICAgcmV0dXJuIG1hdGNoID8geyBtYXRjaDogbWF0Y2gsIHJvdXRlOiByb3V0ZSwgcGFyYW1zOiBwYXJhbXMgfSA6IGZhbHNlO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbiAobSkge1xuXHQgICAgcmV0dXJuIG07XG5cdCAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIG1hdGNoKHVybCwgcm91dGVzKSB7XG5cdCAgcmV0dXJuIGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzKVswXSB8fCBmYWxzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcm9vdCh1cmwsIHJvdXRlcykge1xuXHQgIHZhciBtYXRjaGVkID0gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIHUgPSBjbGVhbihyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgcmV0dXJuIHUgIT09ICcnICYmIHUgIT09ICcqJztcblx0ICB9KSk7XG5cdCAgdmFyIGZhbGxiYWNrVVJMID0gY2xlYW4odXJsKTtcblx0XG5cdCAgaWYgKG1hdGNoZWQubGVuZ3RoID4gMCkge1xuXHQgICAgcmV0dXJuIG1hdGNoZWQubWFwKGZ1bmN0aW9uIChtKSB7XG5cdCAgICAgIHJldHVybiBjbGVhbih1cmwuc3Vic3RyKDAsIG0ubWF0Y2guaW5kZXgpKTtcblx0ICAgIH0pLnJlZHVjZShmdW5jdGlvbiAocm9vdCwgY3VycmVudCkge1xuXHQgICAgICByZXR1cm4gY3VycmVudC5sZW5ndGggPCByb290Lmxlbmd0aCA/IGN1cnJlbnQgOiByb290O1xuXHQgICAgfSwgZmFsbGJhY2tVUkwpO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsbGJhY2tVUkw7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCkge1xuXHQgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZW1vdmVHRVRQYXJhbXModXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXD8oLiopPyQvLCAnJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIE5hdmlnbyhyLCB1c2VIYXNoKSB7XG5cdCAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgdGhpcy5yb290ID0gdXNlSGFzaCAmJiByID8gci5yZXBsYWNlKC9cXC8kLywgJy8jJykgOiByIHx8IG51bGw7XG5cdCAgdGhpcy5fdXNlSGFzaCA9IHVzZUhhc2g7XG5cdCAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG5cdCAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG5cdCAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSBudWxsO1xuXHQgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX29rID0gIXVzZUhhc2ggJiYgaXNQdXNoU3RhdGVBdmFpbGFibGUoKTtcblx0ICB0aGlzLl9saXN0ZW4oKTtcblx0ICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXHR9XG5cdFxuXHROYXZpZ28ucHJvdG90eXBlID0ge1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIG1hdGNoOiBtYXRjaCxcblx0ICAgIHJvb3Q6IHJvb3QsXG5cdCAgICBjbGVhbjogY2xlYW5cblx0ICB9LFxuXHQgIG5hdmlnYXRlOiBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoLCBhYnNvbHV0ZSkge1xuXHQgICAgdmFyIHRvO1xuXHRcblx0ICAgIHBhdGggPSBwYXRoIHx8ICcnO1xuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHRvID0gKCFhYnNvbHV0ZSA/IHRoaXMuX2dldFJvb3QoKSArICcvJyA6ICcnKSArIGNsZWFuKHBhdGgpO1xuXHQgICAgICB0byA9IHRvLnJlcGxhY2UoLyhbXjpdKShcXC97Mix9KS9nLCAnJDEvJyk7XG5cdCAgICAgIGhpc3RvcnlbdGhpcy5fcGF1c2VkID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sICcnLCB0byk7XG5cdCAgICAgIHRoaXMucmVzb2x2ZSgpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyMoLiopJC8sICcnKSArICcjJyArIHBhdGg7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG9uOiBmdW5jdGlvbiBvbigpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoYXJncy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICB9IGVsc2UgaWYgKF90eXBlb2YoYXJnc1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHZhciBvcmRlcmVkUm91dGVzID0gT2JqZWN0LmtleXMoYXJnc1swXSkuc29ydChjb21wYXJlVXJsRGVwdGgpO1xuXHRcblx0ICAgICAgb3JkZXJlZFJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgICAgIF90aGlzLl9hZGQocm91dGUsIGFyZ3NbMF1bcm91dGVdKTtcblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gYXJnc1swXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgbm90Rm91bmQ6IGZ1bmN0aW9uIG5vdEZvdW5kKGhhbmRsZXIpIHtcblx0ICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IGhhbmRsZXI7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKGN1cnJlbnQpIHtcblx0ICAgIHZhciBoYW5kbGVyLCBtO1xuXHQgICAgdmFyIHVybCA9IChjdXJyZW50IHx8IHRoaXMuX2NMb2MoKSkucmVwbGFjZSh0aGlzLl9nZXRSb290KCksICcnKTtcblx0XG5cdCAgICBpZiAodGhpcy5fcGF1c2VkIHx8IHVybCA9PT0gdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLl91c2VIYXNoKSB7XG5cdCAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvIy8sICcvJyk7XG5cdCAgICB9XG5cdCAgICB1cmwgPSByZW1vdmVHRVRQYXJhbXModXJsKTtcblx0ICAgIG0gPSBtYXRjaCh1cmwsIHRoaXMuX3JvdXRlcyk7XG5cdFxuXHQgICAgaWYgKG0pIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIGhhbmRsZXIgPSBtLnJvdXRlLmhhbmRsZXI7XG5cdCAgICAgIG0ucm91dGUucm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgPyBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KG0ubWF0Y2guc2xpY2UoMSwgbS5tYXRjaC5sZW5ndGgpKSkgOiBoYW5kbGVyKG0ucGFyYW1zKTtcblx0ICAgICAgcmV0dXJuIG07XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX2RlZmF1bHRIYW5kbGVyICYmICh1cmwgPT09ICcnIHx8IHVybCA9PT0gJy8nKSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIoKTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX25vdEZvdW5kSGFuZGxlcikge1xuXHQgICAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9LFxuXHQgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cdCAgICBjbGVhclRpbWVvdXQodGhpcy5fbGlzdGVubmluZ0ludGVydmFsKTtcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm9ucG9wc3RhdGUgPSBudWxsIDogbnVsbDtcblx0ICB9LFxuXHQgIHVwZGF0ZVBhZ2VMaW5rczogZnVuY3Rpb24gdXBkYXRlUGFnZUxpbmtzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdFxuXHQgICAgdGhpcy5fZmluZExpbmtzKCkuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHQgICAgICBpZiAoIWxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCkge1xuXHQgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XG5cdCAgICAgICAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZCkge1xuXHQgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIHNlbGYubmF2aWdhdGUoY2xlYW4obG9jYXRpb24pKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgICBsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShuYW1lKSB7XG5cdCAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHJldHVybiB0aGlzLl9yb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHJvdXRlKSB7XG5cdCAgICAgIHZhciBrZXk7XG5cdFxuXHQgICAgICBpZiAocm91dGUubmFtZSA9PT0gbmFtZSkge1xuXHQgICAgICAgIHJlc3VsdCA9IHJvdXRlLnJvdXRlO1xuXHQgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc6JyArIGtleSwgZGF0YVtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sICcnKTtcblx0ICB9LFxuXHQgIGxpbms6IGZ1bmN0aW9uIGxpbmsocGF0aCkge1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFJvb3QoKSArIHBhdGg7XG5cdCAgfSxcblx0ICBwYXVzZTogZnVuY3Rpb24gcGF1c2Uoc3RhdHVzKSB7XG5cdCAgICB0aGlzLl9wYXVzZWQgPSBzdGF0dXM7XG5cdCAgfSxcblx0ICBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGU6IGZ1bmN0aW9uIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZSgpIHtcblx0ICAgIGlmICghaXNQdXNoU3RhdGVBdmFpbGFibGUoKSkge1xuXHQgICAgICB0aGlzLmRlc3Ryb3koKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9hZGQ6IGZ1bmN0aW9uIF9hZGQocm91dGUpIHtcblx0ICAgIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBpZiAoKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihoYW5kbGVyKSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyLnVzZXMsIG5hbWU6IGhhbmRsZXIuYXMgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLl9hZGQ7XG5cdCAgfSxcblx0ICBfZ2V0Um9vdDogZnVuY3Rpb24gX2dldFJvb3QoKSB7XG5cdCAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSByZXR1cm4gdGhpcy5yb290O1xuXHQgICAgdGhpcy5yb290ID0gcm9vdCh0aGlzLl9jTG9jKCksIHRoaXMuX3JvdXRlcyk7XG5cdCAgICByZXR1cm4gdGhpcy5yb290O1xuXHQgIH0sXG5cdCAgX2xpc3RlbjogZnVuY3Rpb24gX2xpc3RlbigpIHtcblx0ICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpczIucmVzb2x2ZSgpO1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgY2FjaGVkID0gX3RoaXMyLl9jTG9jKCksXG5cdCAgICAgICAgICAgIGN1cnJlbnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgICAgIF9jaGVjayA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgICAgX2NoZWNrID0gZnVuY3Rpb24gY2hlY2soKSB7XG5cdCAgICAgICAgICBjdXJyZW50ID0gX3RoaXMyLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzMi5yZXNvbHZlKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBfdGhpczIuX2xpc3Rlbm5pbmdJbnRlcnZhbCA9IHNldFRpbWVvdXQoX2NoZWNrLCAyMDApO1xuXHQgICAgICAgIH07XG5cdCAgICAgICAgX2NoZWNrKCk7XG5cdCAgICAgIH0pKCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfY0xvYzogZnVuY3Rpb24gX2NMb2MoKSB7XG5cdCAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0sXG5cdCAgX2ZpbmRMaW5rczogZnVuY3Rpb24gX2ZpbmRMaW5rcygpIHtcblx0ICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5hdmlnb10nKSk7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTmF2aWdvO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmF2aWdvLmpzLm1hcCIsIid1c2Ugc3RyaWN0JztPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywnX19lc01vZHVsZScse3ZhbHVlOiEwfSk7dmFyIHNjcm9sbD1mdW5jdGlvbihhKXtyZXR1cm4gd2luZG93LnNjcm9sbFRvKDAsYSl9LHN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGhpc3Rvcnkuc3RhdGU/aGlzdG9yeS5zdGF0ZS5zY3JvbGxQb3NpdGlvbjowfSxzYXZlPWZ1bmN0aW9uKCl7d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtzY3JvbGxQb3NpdGlvbjp3aW5kb3cucGFnZVlPZmZzZXR8fHdpbmRvdy5zY3JvbGxZfSwnJyl9LHJlc3RvcmU9ZnVuY3Rpb24oKXt2YXIgYT0wPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1swXSE9PXZvaWQgMD9hcmd1bWVudHNbMF06bnVsbCxiPXN0YXRlKCk7Yj9hP2EoYik6c2Nyb2xsKGIpOnNjcm9sbCgwKX0saW5zdGFuY2U9e2dldCBleHBvcnQoKXtyZXR1cm4ndW5kZWZpbmVkJz09dHlwZW9mIHdpbmRvdz97fTooJ3Njcm9sbFJlc3RvcmF0aW9uJ2luIGhpc3RvcnkmJihoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uPSdtYW51YWwnLHNjcm9sbChzdGF0ZSgpKSx3aW5kb3cub25iZWZvcmV1bmxvYWQ9c2F2ZSkse3NhdmU6c2F2ZSxyZXN0b3JlOnJlc3RvcmUsc3RhdGU6c3RhdGV9KX19O2V4cG9ydHMuZGVmYXVsdD1pbnN0YW5jZS5leHBvcnQ7IiwiZnVuY3Rpb24gbmV4dChhcmdzKXtcbiAgYXJncy5sZW5ndGggPiAwICYmIGFyZ3Muc2hpZnQoKS5hcHBseSh0aGlzLCBhcmdzKVxufVxuXG5mdW5jdGlvbiBydW4oY2IsIGFyZ3Mpe1xuICBjYigpXG4gIG5leHQoYXJncylcbn1cblxuZnVuY3Rpb24gdGFycnkoY2IsIGRlbGF5KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICB2YXIgb3ZlcnJpZGUgPSBhcmdzWzBdXG4gICAgXG4gICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygb3ZlcnJpZGUpe1xuICAgICAgcmV0dXJuIHRhcnJ5KGNiLCBvdmVycmlkZSlcbiAgICB9XG4gICAgXG4gICAgJ251bWJlcicgPT09IHR5cGVvZiBkZWxheSA/IChcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgcnVuKGNiLCBhcmdzKVxuICAgICAgfSwgZGVsYXkpIFxuICAgICkgOiAoXG4gICAgICBydW4oY2IsIGFyZ3MpXG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXVlKCl7XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gIHJldHVybiB0YXJyeShmdW5jdGlvbigpe1xuICAgIG5leHQoYXJncy5zbGljZSgwKSlcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0ge1xuICB0YXJyeTogdGFycnksXG4gIHF1ZXVlOiBxdWV1ZVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wcyA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtLXByb3BzJyk7XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHJhbnNmb3JtUHJvcHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaCA9IGZ1bmN0aW9uIGgodGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA/IGFwcGx5UHJvcHModGFnKShhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIDogYXBwZW5kQ2hpbGRyZW4odGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG52YXIgaXNPYmogPSBmdW5jdGlvbiBpc09iaihvKSB7XG4gIHJldHVybiBvICE9PSBudWxsICYmICh0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobykpID09PSAnb2JqZWN0Jztcbn07XG5cbnZhciBpc1Byb3BzID0gZnVuY3Rpb24gaXNQcm9wcyhhcmcpIHtcbiAgcmV0dXJuIGlzT2JqKGFyZykgJiYgIShhcmcgaW5zdGFuY2VvZiBFbGVtZW50KTtcbn07XG5cbnZhciBhcHBseVByb3BzID0gZnVuY3Rpb24gYXBwbHlQcm9wcyh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHJldHVybiBoKHRhZykoT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWwgPSBoKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgdmFyIHAgPSAoMCwgX3RyYW5zZm9ybVByb3BzMi5kZWZhdWx0KShwcm9wcyk7XG4gICAgICBPYmplY3Qua2V5cyhwKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmICgvXm9uLy50ZXN0KGspKSB7XG4gICAgICAgICAgZWxba10gPSBwW2tdO1xuICAgICAgICB9IGVsc2UgaWYgKGsgPT09ICdfX2h0bWwnKSB7XG4gICAgICAgICAgZWwuaW5uZXJIVE1MID0gcFtrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoaywgcFtrXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gIH07XG59O1xuXG52YXIgYXBwZW5kQ2hpbGRyZW4gPSBmdW5jdGlvbiBhcHBlbmRDaGlsZHJlbih0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgY2hpbGRyZW4gPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGNoaWxkcmVuW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICBjaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjIGluc3RhbmNlb2YgRWxlbWVudCA/IGMgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gZWwuYXBwZW5kQ2hpbGQoYyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsO1xuICB9O1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gaDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIga2ViYWIgPSBleHBvcnRzLmtlYmFiID0gZnVuY3Rpb24ga2ViYWIoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoZykge1xuICAgIHJldHVybiAnLScgKyBnLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufTtcblxudmFyIHBhcnNlVmFsdWUgPSBleHBvcnRzLnBhcnNlVmFsdWUgPSBmdW5jdGlvbiBwYXJzZVZhbHVlKHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyBhZGRQeChwcm9wKSh2YWwpIDogdmFsO1xuICB9O1xufTtcblxudmFyIHVuaXRsZXNzUHJvcGVydGllcyA9IGV4cG9ydHMudW5pdGxlc3NQcm9wZXJ0aWVzID0gWydsaW5lSGVpZ2h0JywgJ2ZvbnRXZWlnaHQnLCAnb3BhY2l0eScsICd6SW5kZXgnXG4vLyBQcm9iYWJseSBuZWVkIGEgZmV3IG1vcmUuLi5cbl07XG5cbnZhciBhZGRQeCA9IGV4cG9ydHMuYWRkUHggPSBmdW5jdGlvbiBhZGRQeChwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHVuaXRsZXNzUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wKSA/IHZhbCA6IHZhbCArICdweCc7XG4gIH07XG59O1xuXG52YXIgZmlsdGVyTnVsbCA9IGV4cG9ydHMuZmlsdGVyTnVsbCA9IGZ1bmN0aW9uIGZpbHRlck51bGwob2JqKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG9ialtrZXldICE9PSBudWxsO1xuICB9O1xufTtcblxudmFyIGNyZWF0ZURlYyA9IGV4cG9ydHMuY3JlYXRlRGVjID0gZnVuY3Rpb24gY3JlYXRlRGVjKHN0eWxlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtlYmFiKGtleSkgKyAnOicgKyBwYXJzZVZhbHVlKGtleSkoc3R5bGVba2V5XSk7XG4gIH07XG59O1xuXG52YXIgc3R5bGVUb1N0cmluZyA9IGV4cG9ydHMuc3R5bGVUb1N0cmluZyA9IGZ1bmN0aW9uIHN0eWxlVG9TdHJpbmcoc3R5bGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlKS5maWx0ZXIoZmlsdGVyTnVsbChzdHlsZSkpLm1hcChjcmVhdGVEZWMoc3R5bGUpKS5qb2luKCc7Jyk7XG59O1xuXG52YXIgaXNTdHlsZU9iamVjdCA9IGV4cG9ydHMuaXNTdHlsZU9iamVjdCA9IGZ1bmN0aW9uIGlzU3R5bGVPYmplY3QocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2V5ID09PSAnc3R5bGUnICYmIHByb3BzW2tleV0gIT09IG51bGwgJiYgX3R5cGVvZihwcm9wc1trZXldKSA9PT0gJ29iamVjdCc7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlU3R5bGUgPSBleHBvcnRzLmNyZWF0ZVN0eWxlID0gZnVuY3Rpb24gY3JlYXRlU3R5bGUocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaXNTdHlsZU9iamVjdChwcm9wcykoa2V5KSA/IHN0eWxlVG9TdHJpbmcocHJvcHNba2V5XSkgOiBwcm9wc1trZXldO1xuICB9O1xufTtcblxudmFyIHJlZHVjZVByb3BzID0gZXhwb3J0cy5yZWR1Y2VQcm9wcyA9IGZ1bmN0aW9uIHJlZHVjZVByb3BzKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYSwga2V5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYSwgX2RlZmluZVByb3BlcnR5KHt9LCBrZXksIGNyZWF0ZVN0eWxlKHByb3BzKShrZXkpKSk7XG4gIH07XG59O1xuXG52YXIgdHJhbnNmb3JtUHJvcHMgPSBleHBvcnRzLnRyYW5zZm9ybVByb3BzID0gZnVuY3Rpb24gdHJhbnNmb3JtUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKS5yZWR1Y2UocmVkdWNlUHJvcHMocHJvcHMpLCB7fSk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB0cmFuc2Zvcm1Qcm9wczsiLCJjb25zdCBjcmVhdGVCYXIgPSAocm9vdCwgY2xhc3NuYW1lKSA9PiB7XG4gIGxldCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgbGV0IGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gIG8uY2xhc3NOYW1lID0gY2xhc3NuYW1lIFxuICBpLmNsYXNzTmFtZSA9IGAke2NsYXNzbmFtZX1fX2lubmVyYFxuICBvLmFwcGVuZENoaWxkKGkpXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKG8sIHJvb3QuY2hpbGRyZW5bMF0pXG5cbiAgcmV0dXJuIHtcbiAgICBvdXRlcjogbyxcbiAgICBpbm5lcjogaVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChyb290ID0gZG9jdW1lbnQuYm9keSwgb3B0cyA9IHt9KSA9PiB7XG4gIGxldCB0aW1lciA9IG51bGxcbiAgY29uc3Qgc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDIwMFxuICBjb25zdCBjbGFzc25hbWUgPSBvcHRzLmNsYXNzbmFtZSB8fCAncHV0eidcbiAgY29uc3QgdHJpY2tsZSA9IG9wdHMudHJpY2tsZSB8fCA1IFxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHByb2dyZXNzOiAwXG4gIH1cblxuICBjb25zdCBiYXIgPSBjcmVhdGVCYXIocm9vdCwgY2xhc3NuYW1lKVxuXG4gIGNvbnN0IHJlbmRlciA9ICh2YWwgPSAwKSA9PiB7XG4gICAgc3RhdGUucHJvZ3Jlc3MgPSB2YWxcbiAgICBiYXIuaW5uZXIuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgke3N0YXRlLmFjdGl2ZSA/ICcwJyA6ICctMTAwJSd9KSB0cmFuc2xhdGVYKCR7LTEwMCArIHN0YXRlLnByb2dyZXNzfSUpO2BcbiAgfVxuXG4gIGNvbnN0IGdvID0gdmFsID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgcmVuZGVyKE1hdGgubWluKHZhbCwgOTUpKVxuICB9XG5cbiAgY29uc3QgaW5jID0gKHZhbCA9IChNYXRoLnJhbmRvbSgpICogdHJpY2tsZSkpID0+IGdvKHN0YXRlLnByb2dyZXNzICsgdmFsKVxuXG4gIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSBmYWxzZVxuICAgIHJlbmRlcigxMDApXG4gICAgc2V0VGltZW91dCgoKSA9PiByZW5kZXIoKSwgc3BlZWQpXG4gICAgaWYgKHRpbWVyKXsgY2xlYXJUaW1lb3V0KHRpbWVyKSB9XG4gIH1cblxuICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSB0cnVlXG4gICAgaW5jKClcbiAgfVxuXG4gIGNvbnN0IHB1dHogPSAoaW50ZXJ2YWwgPSA1MDApID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiBpbmMoKSwgaW50ZXJ2YWwpXG4gIH1cbiAgXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKHtcbiAgICBwdXR6LFxuICAgIHN0YXJ0LFxuICAgIGluYyxcbiAgICBnbyxcbiAgICBlbmQsXG4gICAgZ2V0U3RhdGU6ICgpID0+IHN0YXRlXG4gIH0se1xuICAgIGJhcjoge1xuICAgICAgdmFsdWU6IGJhclxuICAgIH1cbiAgfSlcbn1cbiIsImNvbnN0IGZpbmRMaW5rID0gKGlkLCBkYXRhKSA9PiBkYXRhLmZpbHRlcihsID0+IGwuaWQgPT09IGlkKVswXVxuXG5jb25zdCBjcmVhdGVMaW5rID0gKHsgYW5zd2VycyB9LCBkYXRhKSA9PiBhbnN3ZXJzLmZvckVhY2goYSA9PiB7XG4gIGxldCBpc1BhdGggPSAvXlxcLy8udGVzdChhLm5leHQpID8gdHJ1ZSA6IGZhbHNlXG4gIGxldCBpc0dJRiA9IC9naWYvLnRlc3QoYS5uZXh0KSA/IHRydWUgOiBmYWxzZVxuICBhLm5leHQgPSBpc1BhdGggfHwgaXNHSUYgPyBhLm5leHQgOiBmaW5kTGluayhhLm5leHQsIGRhdGEpXG59KVxuXG5leHBvcnQgY29uc3QgY3JlYXRlU3RvcmUgPSAocXVlc3Rpb25zKSA9PiB7XG5cdHF1ZXN0aW9ucy5tYXAocSA9PiBjcmVhdGVMaW5rKHEsIHF1ZXN0aW9ucykpXG5cdHJldHVybiBxdWVzdGlvbnNcbn1cblxuZXhwb3J0IGRlZmF1bHQgcXVlc3Rpb25zID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzdG9yZTogY3JlYXRlU3RvcmUocXVlc3Rpb25zKSxcbiAgICBnZXRBY3RpdmU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZS5maWx0ZXIocSA9PiBxLmlkID09IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KC8jLylbMV0pWzBdIHx8IHRoaXMuc3RvcmVbMF1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IFtcbiAge1xuICAgIGlkOiAxLFxuICAgIHByb21wdDogYGhpISB3aGF0IGJyaW5ncyB5b3UgdG8gdGhpcyBuZWNrIG9mIHRoZSBpbnRlcndlYnM/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnd2hvIHIgdScsXG4gICAgICAgIG5leHQ6IDIgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ2hpcmluZycsXG4gICAgICAgIG5leHQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgaXQncyB5b3VyIG1vbWAsXG4gICAgICAgIG5leHQ6IDRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgZnVubnkgam9rZXNgLFxuICAgICAgICBuZXh0OiA1XG4gICAgICB9XG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMixcbiAgICBwcm9tcHQ6IGBpJ20gbWVsYW5pZSDigJMgYSBncmFwaGljIGRlc2lnbmVyIHdvcmtpbmcgaW4gZXhwZXJpZW50aWFsIG1hcmtldGluZyAmIHByb3VkIGlvd2FuIHRyeWluZyB0byBlYXQgQUxMIHRoZSBCTFRzYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgd2hhdCdzIGV4cGVyaWVudGlhbD9gLFxuICAgICAgICBuZXh0OiA2IFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aGF0J3MgYSBCTFQ/YCxcbiAgICAgICAgbmV4dDogN1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAzLFxuICAgIHByb21wdDogYHJhZCEgY2FuIGkgc2hvdyB5b3Ugc29tZSBwcm9qZWN0cyBpJ3ZlIHdvcmtlZCBvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB5ZXMsIHBsZWFzZSFgLFxuICAgICAgICBuZXh0OiAnL3dvcmsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYG5haCwgdGVsbCBtZSBhYm91dCB5b3VgLFxuICAgICAgICBuZXh0OiAnL2Fib3V0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBpJ2xsIGVtYWlsIHlvdSBpbnN0ZWFkYCxcbiAgICAgICAgbmV4dDogJy9jb250YWN0J1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA0LFxuICAgIHByb21wdDogYGhpIG1vbSEgaSBsb3ZlIHlvdSFgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGA6KSBpIGxvdmUgeW91IHRvbyFgLFxuICAgICAgICBuZXh0OiA4XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGprLCBub3QgeW91ciBtb21gLFxuICAgICAgICBuZXh0OiA5XG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDUsXG4gICAgcHJvbXB0OiBgd2hhdCdzIGZ1bm5pZXIgdGhhbiBhIHJoZXRvcmljYWwgcXVlc3Rpb24/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgeWVzYCxcbiAgICAgICAgbmV4dDogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgbm9gLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvUDJIeTg4ckFqUWRzUS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDYsXG4gICAgcHJvbXB0OiBgZXhwZXJpZW50aWFsIGlzIHRoaXMgY29vbCBuaWNoZSB0eXBlIG9mIG1hcmtldGluZywgeWEga25vdz9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBzb3VuZHMgY29vbC4gd2hhdCBoYXZlIHlvdSBkb25lP2AsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgd2h5IGRvIHlvdSBsaWtlIGl0P2AsXG4gICAgICAgIG5leHQ6IDExXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDcsXG4gICAgcHJvbXB0OiBgdGFrZSBhIHdpbGQgZ3Vlc3MuLi5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBiZWVmIGxpdmVyIHRvYXN0YCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL29GT3MxMFNKU256b3MvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBibHVlYmVycnkgbGVtb24gdGFydGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8zbzdUS3dtbkRnUWI1amVtaksvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBiYWNvbiBsZXR0dWNlIHRvbWF0b2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9mcXp4Y21sWTdvcE9nL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogOCxcbiAgICBwcm9tcHQ6IGBzby4uLiBjYW4gaSBzaGlwIGxhdW5kcnkgaG9tZSB0byBpb3dhP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYG9mIGNvdXJzZSFgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvMTFzQkxWeE5zN3Y2V0EvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB5ZWFoLCBzdGlsbCBub3QgeW91ciBtb20uLi5gLFxuICAgICAgICBuZXh0OiAxMlxuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA5LFxuICAgIHByb21wdDogYGNsaWNraW5nIGZvciBmdW4sIGh1aD8gZ29vZCBsdWNrIHdpdGggdGhpcyBvbmUuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgYmx1ZSBwaWxsYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL0c3R05vYVVTSDdzTVUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGByZWQgcGlsbGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9VanVqR1kzbUEzSmxlL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTAsXG4gICAgcHJvbXB0OiBgcGFuY2FrZXMgb3Igd2FmZmxlcz9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBmcmVuY2ggdG9hc3RgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvMTRuYjZUbElSbGFOMXUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxMSxcbiAgICBwcm9tcHQ6IGBpIGxpa2UgZXhwZXJpZW50aWFsIGJlY2F1c2UgaXQncyBqdXN0IHN1cGVyIGNvb2wsIG9rYXk/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgd2hhdCBhcmUgeW91ciBmYXZvcml0ZSBwcm9qZWN0cz9gLFxuICAgICAgICBuZXh0OiAxNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBpIGhhdmUgcXVlc3Rpb25zISBjYW4gaSBlbWFpbCB5b3U/YCxcbiAgICAgICAgbmV4dDogJy9jb250YWN0J1xuICAgICAgfSxcbiAgICBdXG4gIH0sICBcblxuICB7XG4gICAgaWQ6IDEyLFxuICAgIHByb21wdDogYHRha2luZyB0aGlzIGEgbGl0dGxlIGZhciBkb24ndCB5b3UgdGhpbms/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgc3VyZSBhbWAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9xSU5zZkRHSTB6OXlVL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgbXVzdCBjbGljayBBTEwgYnV0dG9uc2AsXG4gICAgICAgIG5leHQ6IDEzXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDEzLFxuICAgIHByb21wdDogYHllYWg/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgY2xpY2tpbmcgdGhpcyBtYXkgaGFybSBhIGtpdHRlbmAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9JZ2doa1hXa2RuRUVvL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTQsXG4gICAgcHJvbXB0OiBgb2YgY291cnNlIEkgbG92ZSBteSBvd24gd29yaywgYnV0IHRoZXNlIHByb2plY3RzIGRlc2VydmUgc29tZSBzZXJpb3VzIHByb3BzYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgcHJvamVjdCAxYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHByb2plY3QgMmAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL3R3aXR0ZXIuY29tJ1xuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHByb2plY3QgM2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL3R3aXR0ZXIuY29tJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5dXG4iLCJpbXBvcnQgaDAgZnJvbSAnaDAnXG5pbXBvcnQgY29sb3JzIGZyb20gJy4uL2xpYi9jb2xvcnMnXG5cbmV4cG9ydCBjb25zdCBkaXYgPSBoMCgnZGl2JylcbmV4cG9ydCBjb25zdCBidXR0b24gPSBoMCgnYnV0dG9uJykoe2NsYXNzOiAnaDIgbXYwIGlubGluZS1ibG9jayd9KVxuZXhwb3J0IGNvbnN0IHRpdGxlID0gaDAoJ3AnKSh7Y2xhc3M6ICdoMSBtdDAgbWIwNSBjYid9KVxuXG5leHBvcnQgY29uc3QgdGVtcGxhdGUgPSAoe3Byb21wdCwgYW5zd2Vyc30sIGNiKSA9PiB7XG4gIHJldHVybiBkaXYoe2NsYXNzOiAncXVlc3Rpb24nfSkoXG4gICAgdGl0bGUocHJvbXB0KSxcbiAgICBkaXYoXG4gICAgICAuLi5hbnN3ZXJzLm1hcCgoYSwgaSkgPT4gYnV0dG9uKHtcbiAgICAgICAgb25jbGljazogKGUpID0+IGNiKGEubmV4dCksXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6IGNvbG9ycy5jb2xvcnNbaV1cbiAgICAgICAgfVxuICAgICAgfSkoYS52YWx1ZSkpXG4gICAgKVxuICApXG59XG4iLCJpbXBvcnQgeyB0YXJyeSwgcXVldWUgfSBmcm9tICd0YXJyeS5qcydcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnaWYnKVxuICBjb25zdCBpbWcgPSBtb2RhbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF1cblxuICBjb25zdCBzaG93ID0gdGFycnkoKCkgPT4gbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaycpIFxuICBjb25zdCBoaWRlID0gdGFycnkoKCkgPT4gbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJykgXG4gIGNvbnN0IHRvZ2dsZSA9IHRhcnJ5KFxuICAgICgpID0+IG1vZGFsLmNsYXNzTGlzdC5jb250YWlucygnaXMtYWN0aXZlJykgXG4gICAgICA/IG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpXG4gICAgICA6IG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpXG4gIClcblxuICBjb25zdCBsYXp5ID0gKHVybCwgY2IpID0+IHtcbiAgICBsZXQgYnVybmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcblxuICAgIGJ1cm5lci5vbmxvYWQgPSAoKSA9PiBjYih1cmwpXG5cbiAgICBidXJuZXIuc3JjID0gdXJsXG4gIH1cblxuICBjb25zdCBvcGVuID0gdXJsID0+IHtcbiAgICB3aW5kb3cubG9hZGVyLnN0YXJ0KClcbiAgICB3aW5kb3cubG9hZGVyLnB1dHooNTAwKVxuXG4gICAgbGF6eSh1cmwsIHVybCA9PiB7XG4gICAgICBpbWcuc3JjID0gdXJsXG4gICAgICBxdWV1ZShzaG93LCB0b2dnbGUoMjAwKSkoKVxuICAgICAgd2luZG93LmxvYWRlci5lbmQoKVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICBxdWV1ZSh0b2dnbGUsIGhpZGUoMjAwKSkoKVxuICB9XG5cbiAgbW9kYWwub25jbGljayA9IGNsb3NlXG5cbiAgcmV0dXJuIHtcbiAgICBvcGVuLFxuICAgIGNsb3NlXG4gIH1cbn1cbiIsImltcG9ydCByb3V0ZXIgZnJvbSAnLi4vbGliL3JvdXRlcidcbmltcG9ydCBxdWVzdGlvbnMgZnJvbSAnLi9kYXRhL2luZGV4LmpzJ1xuaW1wb3J0IHN0b3JhZ2UgZnJvbSAnLi9kYXRhJ1xuaW1wb3J0IGdpZmZlciBmcm9tICcuL2dpZmZlcidcbmltcG9ydCB7IHRlbXBsYXRlIH0gZnJvbSAnLi9lbGVtZW50cydcblxubGV0IHByZXZcbmNvbnN0IGRhdGEgPSBzdG9yYWdlKHF1ZXN0aW9ucylcblxuLyoqXG4gKiBSZW5kZXIgdGVtcGxhdGUgYW5kIGFwcGVuZCB0byBET01cbiAqL1xuY29uc3QgcmVuZGVyID0gKG5leHQpID0+IHtcbiAgbGV0IHF1ZXN0aW9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvblJvb3QnKVxuXG4gIGxldCBlbCA9IHRlbXBsYXRlKG5leHQsIHVwZGF0ZSlcbiAgcXVlc3Rpb25Sb290ICYmIHF1ZXN0aW9uUm9vdC5hcHBlbmRDaGlsZChlbClcbiAgcmV0dXJuIGVsIFxufVxuXG4vKipcbiAqIEhhbmRsZSBET00gdXBkYXRlcywgb3RoZXIgbGluayBjbGlja3NcbiAqL1xuY29uc3QgdXBkYXRlID0gKG5leHQpID0+IHtcbiAgbGV0IHF1ZXN0aW9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvblJvb3QnKVxuXG4gIGxldCBpc0dJRiA9IC9naXBoeS8udGVzdChuZXh0KVxuICBpZiAoaXNHSUYpIHJldHVybiBnaWZmZXIoKS5vcGVuKG5leHQpXG5cbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KG5leHQpXG4gIGlmIChpc1BhdGgpIHJldHVybiByb3V0ZXIuZ28obmV4dClcblxuICBpZiAocHJldiAmJiBxdWVzdGlvblJvb3QgJiYgcXVlc3Rpb25Sb290LmNvbnRhaW5zKHByZXYpKSBxdWVzdGlvblJvb3QucmVtb3ZlQ2hpbGQocHJldilcblxuICBwcmV2ID0gcmVuZGVyKG5leHQpXG5cbiAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXh0LmlkXG59XG5cbi8qKlxuICogV2FpdCB1bnRpbCBuZXcgRE9NIGlzIHByZXNlbnQgYmVmb3JlXG4gKiB0cnlpbmcgdG8gcmVuZGVyIHRvIGl0XG4gKi9cbnJvdXRlci5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gIGlmIChyb3V0ZSA9PT0gJycgfHwgLyheXFwvfFxcLyNbMC05XXwjWzAtOV0pLy50ZXN0KHJvdXRlKSl7XG4gICAgdXBkYXRlKGRhdGEuZ2V0QWN0aXZlKCkpXG4gIH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgcHJldiA9IHJlbmRlcihkYXRhLmdldEFjdGl2ZSgpKVxufVxuIiwiaW1wb3J0IHB1dHogZnJvbSAncHV0eidcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9saWIvcm91dGVyJ1xuaW1wb3J0IGFwcCBmcm9tICcuL2FwcCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9saWIvY29sb3JzJ1xuXG5jb25zdCBsb2FkZXIgPSB3aW5kb3cubG9hZGVyID0gcHV0eihkb2N1bWVudC5ib2R5LCB7XG4gIHNwZWVkOiAxMDAsXG4gIHRyaWNrbGU6IDEwXG59KVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgYXBwKClcblxuICByb3V0ZXIub24oJ3JvdXRlOmFmdGVyJywgKHsgcm91dGUgfSkgPT4ge1xuICAgIGNvbG9ycy51cGRhdGUoKVxuICB9KVxuXG4gIGNvbG9ycy51cGRhdGUoKVxufSlcbiIsImNvbnN0IHJvb3RTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQocm9vdFN0eWxlKVxuXG5jb25zdCBjb2xvcnMgPSBbXG4gICcjMzVEM0U4JyxcbiAgJyNGRjRFNDInLFxuICAnI0ZGRUE1MSdcbl1cblxuY29uc3QgcmFuZG9tQ29sb3IgPSAoKSA9PiBjb2xvcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKDIgLSAwKSArIDApXVxuXG5jb25zdCBzYXZlQ29sb3IgPSBjID0+IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtanMnLCBKU09OLnN0cmluZ2lmeSh7XG4gIGNvbG9yOiBjXG59KSlcblxuY29uc3QgcmVhZENvbG9yID0gKCkgPT4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21qcycpID8gKFxuICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtanMnKSkuY29sb3JcbikgOiAoXG4gIG51bGxcbilcblxuY29uc3QgZ2V0Q29sb3IgPSAoKSA9PiB7XG4gIGxldCBjID0gcmFuZG9tQ29sb3IoKVxuICBsZXQgcHJldiA9IHJlYWRDb2xvcigpXG5cbiAgd2hpbGUgKGMgPT09IHByZXYpe1xuICAgIGMgPSByYW5kb21Db2xvcigpXG4gIH1cblxuICBzYXZlQ29sb3IoYylcbiAgcmV0dXJuIGNcbn1cblxuY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICBsZXQgY29sb3IgPSBnZXRDb2xvcigpXG4gIFxuICByb290U3R5bGUuaW5uZXJIVE1MID0gYFxuICAgIGJvZHkgeyBjb2xvcjogJHtjb2xvcn0gfVxuICAgIDo6LW1vei1zZWxlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgfVxuICAgIDo6c2VsZWN0aW9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7Y29sb3J9O1xuICAgIH1cbiAgYFxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZTogdXBkYXRlLFxuICBjb2xvcnNcbn1cbiIsImltcG9ydCBvcGVyYXRvciBmcm9tICdvcGVyYXRvci5qcydcblxuLyoqXG4gKiBTZW5kIHBhZ2Ugdmlld3MgdG8gXG4gKiBHb29nbGUgQW5hbHl0aWNzXG4gKi9cbmNvbnN0IGdhVHJhY2tQYWdlVmlldyA9IChwYXRoLCB0aXRsZSkgPT4ge1xuICBsZXQgZ2EgPSB3aW5kb3cuZ2EgPyB3aW5kb3cuZ2EgOiBmYWxzZVxuXG4gIGlmICghZ2EpIHJldHVyblxuXG4gIGdhKCdzZXQnLCB7cGFnZTogcGF0aCwgdGl0bGU6IHRpdGxlfSk7XG4gIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG59XG5cbmNvbnN0IGFwcCA9IG9wZXJhdG9yKHtcbiAgcm9vdDogJyNyb290J1xufSlcblxuYXBwLm9uKCdyb3V0ZTphZnRlcicsICh7IHJvdXRlLCB0aXRsZSB9KSA9PiB7XG4gIGdhVHJhY2tQYWdlVmlldyhyb3V0ZSwgdGl0bGUpXG59KVxuXG5hcHAub24oJ3RyYW5zaXRpb246YWZ0ZXInLCAoKSA9PiBsb2FkZXIgJiYgbG9hZGVyLmVuZCgpKVxuXG53aW5kb3cuYXBwID0gYXBwXG5cbmV4cG9ydCBkZWZhdWx0IGFwcFxuIl19
