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

      if (cached) {
        return this.render(route, cached, callback);
      }

      this.emit('route:before', { route: route });

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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Layzr = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var knot = function knot() {
  var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var events = Object.create(null);

  function on(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
    return this;
  }

  function once(name, handler) {
    handler._once = true;
    on(name, handler);
    return this;
  }

  function off(name) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    handler ? events[name].splice(events[name].indexOf(handler), 1) : delete events[name];

    return this;
  }

  function emit(name) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // cache the events, to avoid consequences of mutation
    var cache = events[name] && events[name].slice();

    // only fire handlers if they exist
    cache && cache.forEach(function (handler) {
      // remove handlers added with 'once'
      handler._once && off(name, handler);

      // set 'this' context, pass args to handlers
      handler.apply(_this, args);
    });

    return this;
  }

  return _extends({}, extended, {

    on: on,
    once: once,
    off: off,
    emit: emit
  });
};

var layzr = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // private

  var prevLoc = getLoc();
  var ticking = void 0;

  var nodes = void 0;
  var windowHeight = void 0;

  // options

  var settings = {
    normal: options.normal || 'data-normal',
    retina: options.retina || 'data-retina',
    srcset: options.srcset || 'data-srcset',
    threshold: options.threshold || 0
  };

  // feature detection
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/srcset.js

  var srcset = document.body.classList.contains('srcset') || 'srcset' in document.createElement('img');

  // device pixel ratio
  // not supported in IE10 - https://msdn.microsoft.com/en-us/library/dn265030(v=vs.85).aspx

  var dpr = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;

  // instance

  var instance = knot({
    handlers: handlers,
    check: check,
    update: update
  });

  return instance;

  // location helper

  function getLoc() {
    return window.scrollY || window.pageYOffset;
  }

  // debounce helpers

  function requestScroll() {
    prevLoc = getLoc();
    requestFrame();
  }

  function requestFrame() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        return check();
      });
      ticking = true;
    }
  }

  // offset helper

  function getOffset(node) {
    return node.getBoundingClientRect().top + prevLoc;
  }

  // in viewport helper

  function inViewport(node) {
    var viewTop = prevLoc;
    var viewBot = viewTop + windowHeight;

    var nodeTop = getOffset(node);
    var nodeBot = nodeTop + node.offsetHeight;

    var offset = settings.threshold / 100 * windowHeight;

    return nodeBot >= viewTop - offset && nodeTop <= viewBot + offset;
  }

  // source helper

  function setSource(node) {
    instance.emit('src:before', node);

    // prefer srcset, fallback to pixel density
    if (srcset && node.hasAttribute(settings.srcset)) {
      node.setAttribute('srcset', node.getAttribute(settings.srcset));
    } else {
      var retina = dpr > 1 && node.getAttribute(settings.retina);
      node.setAttribute('src', retina || node.getAttribute(settings.normal));
    }

    instance.emit('src:after', node);[settings.normal, settings.retina, settings.srcset].forEach(function (attr) {
      return node.removeAttribute(attr);
    });

    update();
  }

  // API

  function handlers(flag) {
    var action = flag ? 'addEventListener' : 'removeEventListener';['scroll', 'resize'].forEach(function (event) {
      return window[action](event, requestScroll);
    });
    return this;
  }

  function check() {
    windowHeight = window.innerHeight;

    nodes.forEach(function (node) {
      return inViewport(node) && setSource(node);
    });

    ticking = false;
    return this;
  }

  function update() {
    nodes = Array.prototype.slice.call(document.querySelectorAll('[' + settings.normal + ']'));
    return this;
  }
});

return layzr;

})));

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{"../lib/colors":27,"h0":16}],24:[function(require,module,exports){
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

},{"tarry.js":20}],25:[function(require,module,exports){
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

},{"../lib/router":28,"./data":21,"./data/index.js":22,"./elements":23,"./giffer":24}],26:[function(require,module,exports){
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

},{"./app":25,"./lib/colors":27,"./lib/router":28,"putz":19}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _layzr = require('layzr.js');

var _layzr2 = _interopRequireDefault(_layzr);

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

var images = (0, _layzr2.default)({});
images.update().check();
window.images = images;

var app = (0, _operator2.default)({
  root: '#root'
});

app.on('route:after', function (_ref) {
  var route = _ref.route,
      title = _ref.title;

  gaTrackPageView(route, title);
  images.update().check();
});

app.on('transition:after', function () {
  return loader && loader.end();
});

window.app = app;

exports.default = app;

},{"layzr.js":18,"operator.js":3}]},{},[26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L2NhY2hlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL2Rpc3QvbGlua3MuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9yZW5kZXIuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L3N0YXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2Nsb3Nlc3QuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL2xvb3AuanMvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy90YXJyeS5qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oMC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL2xheXpyLmpzL2Rpc3QvbGF5enIuanMiLCJub2RlX21vZHVsZXMvcHV0ei9pbmRleC5qcyIsInNyYy9qcy9hcHAvZGF0YS5qcyIsInNyYy9qcy9hcHAvZGF0YS9pbmRleC5qcyIsInNyYy9qcy9hcHAvZWxlbWVudHMuanMiLCJzcmMvanMvYXBwL2dpZmZlci5qcyIsInNyYy9qcy9hcHAvaW5kZXguanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbGliL2NvbG9ycy5qcyIsInNyYy9qcy9saWIvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMvTUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLElBQUQsRUFBTyxTQUFQLEVBQXFCO0FBQ3JDLE1BQUksSUFBSSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjtBQUNBLE1BQUksSUFBSSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjs7QUFFQSxJQUFFLFNBQUYsR0FBYyxTQUFkO0FBQ0EsSUFBRSxTQUFGLEdBQWlCLFNBQWpCO0FBQ0EsSUFBRSxXQUFGLENBQWMsQ0FBZDtBQUNBLE9B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QU0sSUFBUCxFQUFhLE9BQU8sS0FBcEIsRUFBVjtBQUNBLEtBQUcsTUFBSCxFQUFXLFVBQVg7QUFDRCxDQVBEOztBQVNBLElBQU0sU0FBUyxxQkFBTSxFQUFOLENBQWY7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsS0FBaEI7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsTUFBaEI7O0FBRUEsSUFBTSxNQUFNLHdCQUFTO0FBQ25CLFFBQU07QUFEYSxDQUFULENBQVo7O0FBSUEsSUFBSSxFQUFKLENBQU8sYUFBUCxFQUFzQixnQkFBc0I7QUFBQSxNQUFuQixLQUFtQixRQUFuQixLQUFtQjtBQUFBLE1BQVosS0FBWSxRQUFaLEtBQVk7O0FBQzFDLGtCQUFnQixLQUFoQixFQUF1QixLQUF2QjtBQUNBLFNBQU8sTUFBUCxHQUFnQixLQUFoQjtBQUNELENBSEQ7O0FBS0EsSUFBSSxFQUFKLENBQU8sa0JBQVAsRUFBMkI7QUFBQSxTQUFNLFVBQVUsT0FBTyxHQUFQLEVBQWhCO0FBQUEsQ0FBM0I7O0FBRUEsT0FBTyxHQUFQLEdBQWEsR0FBYjs7a0JBRWUsRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGNhY2hlID0ge307XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgc2V0OiBmdW5jdGlvbiBzZXQocm91dGUsIHJlcykge1xuICAgIGNhY2hlID0gX2V4dGVuZHMoe30sIGNhY2hlLCBfZGVmaW5lUHJvcGVydHkoe30sIHJvdXRlLCByZXMpKTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQocm91dGUpIHtcbiAgICByZXR1cm4gY2FjaGVbcm91dGVdO1xuICB9LFxuICBnZXRDYWNoZTogZnVuY3Rpb24gZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIGNhY2hlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBpc0R1cGUgPSBmdW5jdGlvbiBpc0R1cGUoc2NyaXB0LCBleGlzdGluZykge1xuICB2YXIgZHVwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGV4aXN0aW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgc2NyaXB0LmlzRXF1YWxOb2RlKGV4aXN0aW5nW2ldKSAmJiBkdXBlcy5wdXNoKGkpO1xuICB9XG5cbiAgcmV0dXJuIGR1cGVzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAobmV3RG9tLCBleGlzdGluZ0RvbSkge1xuICB2YXIgZXhpc3RpbmcgPSBleGlzdGluZ0RvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG4gIHZhciBzY3JpcHRzID0gbmV3RG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaXNEdXBlKHNjcmlwdHNbaV0sIGV4aXN0aW5nKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB2YXIgc3JjID0gc2NyaXB0c1tpXS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnc3JjJyk7XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICBzLnNyYyA9IHNyYy52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcy5pbm5lckhUTUwgPSBzY3JpcHRzW2ldLmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kZWxlZ2F0ZSA9IHJlcXVpcmUoJ2RlbGVnYXRlJyk7XG5cbnZhciBfZGVsZWdhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVsZWdhdGUpO1xuXG52YXIgX29wZXJhdG9yID0gcmVxdWlyZSgnLi9vcGVyYXRvcicpO1xuXG52YXIgX29wZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29wZXJhdG9yKTtcblxudmFyIF91cmwgPSByZXF1aXJlKCcuL3VybCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoX3JlZikge1xuICB2YXIgX3JlZiRyb290ID0gX3JlZi5yb290LFxuICAgICAgcm9vdCA9IF9yZWYkcm9vdCA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQuYm9keSA6IF9yZWYkcm9vdCxcbiAgICAgIF9yZWYkZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uLFxuICAgICAgZHVyYXRpb24gPSBfcmVmJGR1cmF0aW9uID09PSB1bmRlZmluZWQgPyAwIDogX3JlZiRkdXJhdGlvbixcbiAgICAgIF9yZWYkaGFuZGxlcnMgPSBfcmVmLmhhbmRsZXJzLFxuICAgICAgaGFuZGxlcnMgPSBfcmVmJGhhbmRsZXJzID09PSB1bmRlZmluZWQgPyBbXSA6IF9yZWYkaGFuZGxlcnM7XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlXG4gICAqL1xuICB2YXIgb3BlcmF0b3IgPSBuZXcgX29wZXJhdG9yMi5kZWZhdWx0KHtcbiAgICByb290OiByb290LFxuICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICBoYW5kbGVyczogaGFuZGxlcnNcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEJvb3RzdHJhcFxuICAgKi9cbiAgb3BlcmF0b3Iuc2V0U3RhdGUoe1xuICAgIHJvdXRlOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoLFxuICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZVxuICB9KTtcblxuICAvKipcbiAgICogQmluZCBhbmQgdmFsaWRhdGUgYWxsIGxpbmtzXG4gICAqL1xuICAoMCwgX2RlbGVnYXRlMi5kZWZhdWx0KShkb2N1bWVudCwgJ2EnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBhbmNob3IgPSBlLmRlbGVnYXRlVGFyZ2V0O1xuICAgIHZhciBocmVmID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcvJztcblxuICAgIHZhciBpbnRlcm5hbCA9IF91cmwubGluay5pc1NhbWVPcmlnaW4oaHJlZik7XG4gICAgdmFyIGV4dGVybmFsID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCc7XG4gICAgdmFyIGRpc2FibGVkID0gYW5jaG9yLmNsYXNzTGlzdC5jb250YWlucygnbm8tYWpheCcpO1xuICAgIHZhciBpZ25vcmVkID0gb3BlcmF0b3IudmFsaWRhdGUoZSwgaHJlZik7XG4gICAgdmFyIGhhc2ggPSBfdXJsLmxpbmsuaXNIYXNoKGhyZWYpO1xuXG4gICAgaWYgKCFpbnRlcm5hbCB8fCBleHRlcm5hbCB8fCBkaXNhYmxlZCB8fCBpZ25vcmVkIHx8IGhhc2gpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoX3VybC5saW5rLmlzU2FtZVVSTChocmVmKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wZXJhdG9yLmdvKGhyZWYpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAvKipcbiAgICogSGFuZGxlIHBvcHN0YXRlXG4gICAqL1xuICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGhyZWYgPSBlLnRhcmdldC5sb2NhdGlvbi5ocmVmO1xuXG4gICAgaWYgKG9wZXJhdG9yLnZhbGlkYXRlKGUsIGhyZWYpKSB7XG4gICAgICBpZiAoX3VybC5saW5rLmlzSGFzaChocmVmKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9wc3RhdGUgYnlwYXNzZXMgcm91dGVyLCBzbyB3ZVxuICAgICAqIG5lZWQgdG8gdGVsbCBpdCB3aGVyZSB3ZSB3ZW50IHRvXG4gICAgICogd2l0aG91dCBwdXNoaW5nIHN0YXRlXG4gICAgICovXG4gICAgb3BlcmF0b3IuZ28oaHJlZiwgbnVsbCwgdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIG9wZXJhdG9yO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgYWN0aXZlTGlua3MgPSBbXTtcblxudmFyIHRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZShib29sKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aXZlTGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICBhY3RpdmVMaW5rc1tpXS5jbGFzc0xpc3RbYm9vbCA/ICdhZGQnIDogJ3JlbW92ZSddKCdpcy1hY3RpdmUnKTtcbiAgfVxufTtcblxuLy8gVE9ETyBkbyBJIG5lZWQgdG8gZW1wdHkgdGhlIGFycmF5XG4vLyBvciBjYW4gSSBqdXN0IHJlc2V0IHRvIFtdXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICB0b2dnbGUoZmFsc2UpO1xuXG4gIGFjdGl2ZUxpbmtzLnNwbGljZSgwLCBhY3RpdmVMaW5rcy5sZW5ndGgpO1xuICBhY3RpdmVMaW5rcy5wdXNoLmFwcGx5KGFjdGl2ZUxpbmtzLCBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWYkPVwiJyArIHJvdXRlICsgJ1wiXScpKSkpO1xuXG4gIHRvZ2dsZSh0cnVlKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX25hbm9hamF4ID0gcmVxdWlyZSgnbmFub2FqYXgnKTtcblxudmFyIF9uYW5vYWpheDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9uYW5vYWpheCk7XG5cbnZhciBfbmF2aWdvID0gcmVxdWlyZSgnbmF2aWdvJyk7XG5cbnZhciBfbmF2aWdvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hdmlnbyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24gPSByZXF1aXJlKCdzY3JvbGwtcmVzdG9yYXRpb24nKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxSZXN0b3JhdGlvbik7XG5cbnZhciBfbG9vcCA9IHJlcXVpcmUoJ2xvb3AuanMnKTtcblxudmFyIF9sb29wMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvb3ApO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbnZhciBfbGlua3MgPSByZXF1aXJlKCcuL2xpbmtzJyk7XG5cbnZhciBfbGlua3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGlua3MpO1xuXG52YXIgX3JlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyJyk7XG5cbnZhciBfcmVuZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlbmRlcik7XG5cbnZhciBfc3RhdGUgPSByZXF1aXJlKCcuL3N0YXRlJyk7XG5cbnZhciBfc3RhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RhdGUpO1xuXG52YXIgX2NhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuXG52YXIgX2NhY2hlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhY2hlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIHJvdXRlciA9IG5ldyBfbmF2aWdvMi5kZWZhdWx0KF91cmwub3JpZ2luKTtcblxudmFyIE9wZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBPcGVyYXRvcihjb25maWcpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3BlcmF0b3IpO1xuXG4gICAgdmFyIGV2ZW50cyA9ICgwLCBfbG9vcDIuZGVmYXVsdCkoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgLy8gY3JlYXRlIGN1cnJpZWQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgdGhpcy5yZW5kZXIgPSAoMCwgX3JlbmRlcjIuZGVmYXVsdCkoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdCksIGNvbmZpZywgZXZlbnRzLmVtaXQpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBldmVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE9wZXJhdG9yLCBbe1xuICAgIGtleTogJ3N0b3AnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RhcnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRTdGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgICAgcmV0dXJuIF9zdGF0ZTIuZGVmYXVsdC5fc3RhdGU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0U3RhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRTdGF0ZShfcmVmKSB7XG4gICAgICB2YXIgcm91dGUgPSBfcmVmLnJvdXRlLFxuICAgICAgICAgIHRpdGxlID0gX3JlZi50aXRsZTtcblxuICAgICAgX3N0YXRlMi5kZWZhdWx0LnJvdXRlID0gcm91dGUgPT09ICcnID8gJy8nIDogcm91dGU7XG4gICAgICB0aXRsZSA/IF9zdGF0ZTIuZGVmYXVsdC50aXRsZSA9IHRpdGxlIDogbnVsbDtcblxuICAgICAgKDAsIF9saW5rczIuZGVmYXVsdCkoX3N0YXRlMi5kZWZhdWx0LnJvdXRlKTtcblxuICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHJlZlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXNvbHZlIFVzZSBOYXZpZ28ucmVzb2x2ZSgpLCBieXBhc3MgTmF2aWdvLm5hdmlnYXRlKClcbiAgICAgKlxuICAgICAqIFBvcHN0YXRlIGNoYW5nZXMgdGhlIFVSTCBmb3IgdXMsIHNvIGlmIHdlIHdlcmUgdG9cbiAgICAgKiByb3V0ZXIubmF2aWdhdGUoKSB0byB0aGUgcHJldmlvdXMgbG9jYXRpb24sIGl0IHdvdWxkIHB1c2hcbiAgICAgKiBhIGR1cGxpY2F0ZSByb3V0ZSB0byBoaXN0b3J5IGFuZCB3ZSB3b3VsZCBjcmVhdGUgYSBsb29wLlxuICAgICAqXG4gICAgICogcm91dGVyLnJlc29sdmUoKSBsZXQncyBOYXZpZ28ga25vdyB3ZSd2ZSBtb3ZlZCwgd2l0aG91dFxuICAgICAqIGFsdGVyaW5nIGhpc3RvcnkuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2dvJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ28oaHJlZikge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICAgICAgdmFyIHJlc29sdmUgPSBhcmd1bWVudHNbMl07XG5cbiAgICAgIGlmIChfc3RhdGUyLmRlZmF1bHQucGF1c2VkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2sodGl0bGUpIHtcbiAgICAgICAgdmFyIHJlcyA9IHtcbiAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzb2x2ZSA/IHJvdXRlci5yZXNvbHZlKHJvdXRlKSA6IHJvdXRlci5uYXZpZ2F0ZShyb3V0ZSk7XG5cbiAgICAgICAgX3RoaXMuc2V0U3RhdGUocmVzKTtcblxuICAgICAgICBfdGhpcy5lbWl0KCdyb3V0ZTphZnRlcicsIHJlcyk7XG5cbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IocmVzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHJvdXRlID0gKDAsIF91cmwuc2FuaXRpemUpKGhyZWYpO1xuXG4gICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICBfc2Nyb2xsUmVzdG9yYXRpb24yLmRlZmF1bHQuc2F2ZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FjaGVkID0gX2NhY2hlMi5kZWZhdWx0LmdldChyb3V0ZSk7XG5cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKHJvdXRlLCBjYWNoZWQsIGNhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KCdyb3V0ZTpiZWZvcmUnLCB7IHJvdXRlOiByb3V0ZSB9KTtcblxuICAgICAgdGhpcy5nZXQocm91dGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQocm91dGUsIGNiKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgcmV0dXJuIF9uYW5vYWpheDIuZGVmYXVsdC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiBfdXJsLm9yaWdpbiArICcvJyArIHJvdXRlXG4gICAgICB9LCBmdW5jdGlvbiAoc3RhdHVzLCByZXMsIHJlcSkge1xuICAgICAgICBpZiAocmVxLnN0YXR1cyA8IDIwMCB8fCByZXEuc3RhdHVzID4gMzAwICYmIHJlcS5zdGF0dXMgIT09IDMwNCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IF91cmwub3JpZ2luICsgJy8nICsgX3N0YXRlMi5kZWZhdWx0LnByZXYucm91dGU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NhY2hlMi5kZWZhdWx0LnNldChyb3V0ZSwgcmVxLnJlc3BvbnNlKTtcblxuICAgICAgICBfdGhpczIucmVuZGVyKHJvdXRlLCByZXEucmVzcG9uc2UsIGNiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3B1c2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXNoKCkge1xuICAgICAgdmFyIHJvdXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgICAgdmFyIHRpdGxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfc3RhdGUyLmRlZmF1bHQudGl0bGU7XG5cbiAgICAgIGlmICghcm91dGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcm91dGU6IHJvdXRlLCB0aXRsZTogdGl0bGUgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndmFsaWRhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICB2YXIgZXZlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICB2YXIgaHJlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX3N0YXRlMi5kZWZhdWx0LnJvdXRlO1xuXG4gICAgICB2YXIgcm91dGUgPSAoMCwgX3VybC5zYW5pdGl6ZSkoaHJlZik7XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5oYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodCkpIHtcbiAgICAgICAgICB2YXIgcmVzID0gdFsxXShyb3V0ZSk7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgX3RoaXMzLmVtaXQodFswXSwge1xuICAgICAgICAgICAgICByb3V0ZTogcm91dGUsXG4gICAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHQocm91dGUpO1xuICAgICAgICB9XG4gICAgICB9KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBPcGVyYXRvcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gT3BlcmF0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3RhcnJ5ID0gcmVxdWlyZSgndGFycnkuanMnKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbiA9IHJlcXVpcmUoJ3Njcm9sbC1yZXN0b3JhdGlvbicpO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Njcm9sbFJlc3RvcmF0aW9uKTtcblxudmFyIF9ldmFsID0gcmVxdWlyZSgnLi9ldmFsLmpzJyk7XG5cbnZhciBfZXZhbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ldmFsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHBhcnNlciA9IG5ldyB3aW5kb3cuRE9NUGFyc2VyKCk7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgU3RyaW5naWZpZWQgSFRNTFxuICogQHJldHVybiB7b2JqZWN0fSBET00gbm9kZSwgI3BhZ2VcbiAqL1xudmFyIHBhcnNlUmVzcG9uc2UgPSBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKGh0bWwpIHtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ3RleHQvaHRtbCcpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge29iamVjdH0gcGFnZSBSb290IGFwcGxpY2F0aW9uIERPTSBub2RlXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIER1cmF0aW9uIGFuZCByb290IG5vZGUgc2VsZWN0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGVtaXQgRW1pdHRlciBmdW5jdGlvbiBmcm9tIE9wZXJhdG9yIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWFya3VwIE5ldyBtYXJrdXAgZnJvbSBBSkFYIHJlc3BvbnNlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYiBPcHRpb25hbCBjYWxsYmFja1xuICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChwYWdlLCBfcmVmLCBlbWl0KSB7XG4gIHZhciBkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICByb290ID0gX3JlZi5yb290O1xuICByZXR1cm4gZnVuY3Rpb24gKHJvdXRlLCBtYXJrdXAsIGNiKSB7XG4gICAgdmFyIHJlcyA9IHBhcnNlUmVzcG9uc2UobWFya3VwKTtcbiAgICB2YXIgdGl0bGUgPSByZXMudGl0bGU7XG5cbiAgICB2YXIgc3RhcnQgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBlbWl0KCd0cmFuc2l0aW9uOmJlZm9yZScsIHsgcm91dGU6IHJvdXRlIH0pO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgIHBhZ2Uuc3R5bGUuaGVpZ2h0ID0gcGFnZS5jbGllbnRIZWlnaHQgKyAncHgnO1xuICAgIH0pO1xuXG4gICAgdmFyIHJlbmRlciA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2UuaW5uZXJIVE1MID0gcmVzLnF1ZXJ5U2VsZWN0b3Iocm9vdCkuaW5uZXJIVE1MO1xuICAgICAgKDAsIF9ldmFsMi5kZWZhdWx0KShyZXMsIGRvY3VtZW50KTtcbiAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZW5kID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgZW1pdCgndHJhbnNpdGlvbjphZnRlcicsIHsgcm91dGU6IHJvdXRlIH0pO1xuICAgICAgY2IodGl0bGUpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy10cmFuc2l0aW9uaW5nJyk7XG4gICAgfSk7XG5cbiAgICAoMCwgX3RhcnJ5LnF1ZXVlKShzdGFydCgwKSwgcmVuZGVyKGR1cmF0aW9uKSwgZW5kKDApKSgpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHBhdXNlZDogZmFsc2UsXG4gIF9zdGF0ZToge1xuICAgIHJvdXRlOiAnJyxcbiAgICB0aXRsZTogJycsXG4gICAgcHJldjoge1xuICAgICAgcm91dGU6ICcvJyxcbiAgICAgIHRpdGxlOiAnJ1xuICAgIH1cbiAgfSxcbiAgZ2V0IHJvdXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5yb3V0ZTtcbiAgfSxcbiAgc2V0IHJvdXRlKGxvYykge1xuICAgIHRoaXMuX3N0YXRlLnByZXYucm91dGUgPSB0aGlzLnJvdXRlO1xuICAgIHRoaXMuX3N0YXRlLnJvdXRlID0gbG9jO1xuICB9LFxuICBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnRpdGxlO1xuICB9LFxuICBzZXQgdGl0bGUodmFsKSB7XG4gICAgdGhpcy5fc3RhdGUucHJldi50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgdGhpcy5fc3RhdGUudGl0bGUgPSB2YWw7XG4gIH0sXG4gIGdldCBwcmV2KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5wcmV2O1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBnZXRPcmlnaW4gPSBmdW5jdGlvbiBnZXRPcmlnaW4obG9jYXRpb24pIHtcbiAgdmFyIHByb3RvY29sID0gbG9jYXRpb24ucHJvdG9jb2wsXG4gICAgICBob3N0ID0gbG9jYXRpb24uaG9zdDtcblxuICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgaG9zdDtcbn07XG5cbnZhciBwYXJzZVVSTCA9IGZ1bmN0aW9uIHBhcnNlVVJMKHVybCkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgYS5ocmVmID0gdXJsO1xuICByZXR1cm4gYTtcbn07XG5cbnZhciBvcmlnaW4gPSBleHBvcnRzLm9yaWdpbiA9IGdldE9yaWdpbih3aW5kb3cubG9jYXRpb24pO1xuXG52YXIgb3JpZ2luUmVnRXggPSBuZXcgUmVnRXhwKG9yaWdpbik7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBSYXcgVVJMIHRvIHBhcnNlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFVSTCBzYW5zIG9yaWdpbiBhbmQgc2FucyBsZWFkaW5nIHNsYXNoXG4gKi9cbnZhciBzYW5pdGl6ZSA9IGV4cG9ydHMuc2FuaXRpemUgPSBmdW5jdGlvbiBzYW5pdGl6ZSh1cmwpIHtcbiAgdmFyIHJvdXRlID0gdXJsLnJlcGxhY2Uob3JpZ2luUmVnRXgsICcnKTtcbiAgcmV0dXJuIHJvdXRlLm1hdGNoKC9eXFwvLykgPyByb3V0ZS5yZXBsYWNlKC9cXC97MX0vLCAnJykgOiByb3V0ZTsgLy8gcmVtb3ZlIC8gYW5kIHJldHVyblxufTtcblxudmFyIGxpbmsgPSBleHBvcnRzLmxpbmsgPSB7XG4gIGlzU2FtZU9yaWdpbjogZnVuY3Rpb24gaXNTYW1lT3JpZ2luKGhyZWYpIHtcbiAgICByZXR1cm4gb3JpZ2luID09PSBnZXRPcmlnaW4ocGFyc2VVUkwoaHJlZikpO1xuICB9LFxuICBpc0hhc2g6IGZ1bmN0aW9uIGlzSGFzaChocmVmKSB7XG4gICAgcmV0dXJuICgvIy8udGVzdChocmVmKVxuICAgICk7XG4gIH0sXG4gIGlzU2FtZVVSTDogZnVuY3Rpb24gaXNTYW1lVVJMKGhyZWYpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gcGFyc2VVUkwoaHJlZikuc2VhcmNoICYmIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gcGFyc2VVUkwoaHJlZikucGF0aG5hbWU7XG4gIH1cbn07IiwidmFyIERPQ1VNRU5UX05PREVfVFlQRSA9IDk7XG5cbi8qKlxuICogQSBwb2x5ZmlsbCBmb3IgRWxlbWVudC5tYXRjaGVzKClcbiAqL1xuaWYgKHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIHZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG4gICAgcHJvdG8ubWF0Y2hlcyA9IHByb3RvLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgcGFyZW50IHRoYXQgbWF0Y2hlcyBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY2xvc2VzdCAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSBET0NVTUVOVF9OT0RFX1RZUEUpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHJldHVybiBlbGVtZW50O1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIiwidmFyIGNsb3Nlc3QgPSByZXF1aXJlKCcuL2Nsb3Nlc3QnKTtcblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gZGVsZWdhdGUoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gICAgdmFyIGxpc3RlbmVyRm4gPSBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgbGlzdGVuZXJzID0ge307XG5cbiAgdmFyIG9uID0gZnVuY3Rpb24gb24oZSkge1xuICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIGlmICghY2IpIHJldHVybjtcbiAgICBsaXN0ZW5lcnNbZV0gPSBsaXN0ZW5lcnNbZV0gfHwgeyBxdWV1ZTogW10gfTtcbiAgICBsaXN0ZW5lcnNbZV0ucXVldWUucHVzaChjYik7XG4gIH07XG5cbiAgdmFyIGVtaXQgPSBmdW5jdGlvbiBlbWl0KGUpIHtcbiAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIHZhciBpdGVtcyA9IGxpc3RlbmVyc1tlXSA/IGxpc3RlbmVyc1tlXS5xdWV1ZSA6IGZhbHNlO1xuICAgIGl0ZW1zICYmIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiBpKGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgbywge1xuICAgIGVtaXQ6IGVtaXQsXG4gICAgb246IG9uXG4gIH0pO1xufTsiLCIvLyBCZXN0IHBsYWNlIHRvIGZpbmQgaW5mb3JtYXRpb24gb24gWEhSIGZlYXR1cmVzIGlzOlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XG5cbnZhciByZXFmaWVsZHMgPSBbXG4gICdyZXNwb25zZVR5cGUnLCAnd2l0aENyZWRlbnRpYWxzJywgJ3RpbWVvdXQnLCAnb25wcm9ncmVzcydcbl1cblxuLy8gU2ltcGxlIGFuZCBzbWFsbCBhamF4IGZ1bmN0aW9uXG4vLyBUYWtlcyBhIHBhcmFtZXRlcnMgb2JqZWN0IGFuZCBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4vLyBQYXJhbWV0ZXJzOlxuLy8gIC0gdXJsOiBzdHJpbmcsIHJlcXVpcmVkXG4vLyAgLSBoZWFkZXJzOiBvYmplY3Qgb2YgYHtoZWFkZXJfbmFtZTogaGVhZGVyX3ZhbHVlLCAuLi59YFxuLy8gIC0gYm9keTpcbi8vICAgICAgKyBzdHJpbmcgKHNldHMgY29udGVudCB0eXBlIHRvICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIGlmIG5vdCBzZXQgaW4gaGVhZGVycylcbi8vICAgICAgKyBGb3JtRGF0YSAoZG9lc24ndCBzZXQgY29udGVudCB0eXBlIHNvIHRoYXQgYnJvd3NlciB3aWxsIHNldCBhcyBhcHByb3ByaWF0ZSlcbi8vICAtIG1ldGhvZDogJ0dFVCcsICdQT1NUJywgZXRjLiBEZWZhdWx0cyB0byAnR0VUJyBvciAnUE9TVCcgYmFzZWQgb24gYm9keVxuLy8gIC0gY29yczogSWYgeW91ciB1c2luZyBjcm9zcy1vcmlnaW4sIHlvdSB3aWxsIG5lZWQgdGhpcyB0cnVlIGZvciBJRTgtOVxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgcGFyYW1ldGVycyBhcmUgcGFzc2VkIG9udG8gdGhlIHhociBvYmplY3QuXG4vLyBJTVBPUlRBTlQgTk9URTogVGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgY29tcGF0aWJpbGl0eSBjaGVja2luZy5cbi8vICAtIHJlc3BvbnNlVHlwZTogc3RyaW5nLCB2YXJpb3VzIGNvbXBhdGFiaWxpdHksIHNlZSB4aHIgZG9jcyBmb3IgZW51bSBvcHRpb25zXG4vLyAgLSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4sIElFMTArLCBDT1JTIG9ubHlcbi8vICAtIHRpbWVvdXQ6IGxvbmcsIG1zIHRpbWVvdXQsIElFOCtcbi8vICAtIG9ucHJvZ3Jlc3M6IGNhbGxiYWNrLCBJRTEwK1xuLy9cbi8vIENhbGxiYWNrIGZ1bmN0aW9uIHByb3RvdHlwZTpcbi8vICAtIHN0YXR1c0NvZGUgZnJvbSByZXF1ZXN0XG4vLyAgLSByZXNwb25zZVxuLy8gICAgKyBpZiByZXNwb25zZVR5cGUgc2V0IGFuZCBzdXBwb3J0ZWQgYnkgYnJvd3NlciwgdGhpcyBpcyBhbiBvYmplY3Qgb2Ygc29tZSB0eXBlIChzZWUgZG9jcylcbi8vICAgICsgb3RoZXJ3aXNlIGlmIHJlcXVlc3QgY29tcGxldGVkLCB0aGlzIGlzIHRoZSBzdHJpbmcgdGV4dCBvZiB0aGUgcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVxdWVzdCBpcyBhYm9ydGVkLCB0aGlzIGlzIFwiQWJvcnRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IHRpbWVzIG91dCwgdGhpcyBpcyBcIlRpbWVvdXRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IGVycm9ycyBiZWZvcmUgY29tcGxldGluZyAocHJvYmFibHkgYSBDT1JTIGlzc3VlKSwgdGhpcyBpcyBcIkVycm9yXCJcbi8vICAtIHJlcXVlc3Qgb2JqZWN0XG4vL1xuLy8gUmV0dXJucyB0aGUgcmVxdWVzdCBvYmplY3QuIFNvIHlvdSBjYW4gY2FsbCAuYWJvcnQoKSBvciBvdGhlciBtZXRob2RzXG4vL1xuLy8gREVQUkVDQVRJT05TOlxuLy8gIC0gUGFzc2luZyBhIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBwYXJhbXMgb2JqZWN0IGhhcyBiZWVuIHJlbW92ZWQhXG4vL1xuZXhwb3J0cy5hamF4ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgLy8gQW55IHZhcmlhYmxlIHVzZWQgbW9yZSB0aGFuIG9uY2UgaXMgdmFyJ2QgaGVyZSBiZWNhdXNlXG4gIC8vIG1pbmlmaWNhdGlvbiB3aWxsIG11bmdlIHRoZSB2YXJpYWJsZXMgd2hlcmVhcyBpdCBjYW4ndCBtdW5nZVxuICAvLyB0aGUgb2JqZWN0IGFjY2Vzcy5cbiAgdmFyIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyB8fCB7fVxuICAgICwgYm9keSA9IHBhcmFtcy5ib2R5XG4gICAgLCBtZXRob2QgPSBwYXJhbXMubWV0aG9kIHx8IChib2R5ID8gJ1BPU1QnIDogJ0dFVCcpXG4gICAgLCBjYWxsZWQgPSBmYWxzZVxuXG4gIHZhciByZXEgPSBnZXRSZXF1ZXN0KHBhcmFtcy5jb3JzKVxuXG4gIGZ1bmN0aW9uIGNiKHN0YXR1c0NvZGUsIHJlc3BvbnNlVGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzID09PSB1bmRlZmluZWQgPyBzdGF0dXNDb2RlIDogcmVxLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgcmVxLnN0YXR1cyA9PT0gMCA/IFwiRXJyb3JcIiA6IChyZXEucmVzcG9uc2UgfHwgcmVxLnJlc3BvbnNlVGV4dCB8fCByZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgICAgICByZXEpXG4gICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXEub3BlbihtZXRob2QsIHBhcmFtcy51cmwsIHRydWUpXG5cbiAgdmFyIHN1Y2Nlc3MgPSByZXEub25sb2FkID0gY2IoMjAwKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkgc3VjY2VzcygpXG4gIH1cbiAgcmVxLm9uZXJyb3IgPSBjYihudWxsLCAnRXJyb3InKVxuICByZXEub250aW1lb3V0ID0gY2IobnVsbCwgJ1RpbWVvdXQnKVxuICByZXEub25hYm9ydCA9IGNiKG51bGwsICdBYm9ydCcpXG5cbiAgaWYgKGJvZHkpIHtcbiAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0JylcblxuICAgIGlmICghZ2xvYmFsLkZvcm1EYXRhIHx8ICEoYm9keSBpbnN0YW5jZW9mIGdsb2JhbC5Gb3JtRGF0YSkpIHtcbiAgICAgIHNldERlZmF1bHQoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXFmaWVsZHMubGVuZ3RoLCBmaWVsZDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZmllbGQgPSByZXFmaWVsZHNbaV1cbiAgICBpZiAocGFyYW1zW2ZpZWxkXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmVxW2ZpZWxkXSA9IHBhcmFtc1tmaWVsZF1cbiAgfVxuXG4gIGZvciAodmFyIGZpZWxkIGluIGhlYWRlcnMpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIGhlYWRlcnNbZmllbGRdKVxuXG4gIHJlcS5zZW5kKGJvZHkpXG5cbiAgcmV0dXJuIHJlcVxufVxuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KGNvcnMpIHtcbiAgLy8gWERvbWFpblJlcXVlc3QgaXMgb25seSB3YXkgdG8gZG8gQ09SUyBpbiBJRSA4IGFuZCA5XG4gIC8vIEJ1dCBYRG9tYWluUmVxdWVzdCBpc24ndCBzdGFuZGFyZHMtY29tcGF0aWJsZVxuICAvLyBOb3RhYmx5LCBpdCBkb2Vzbid0IGFsbG93IGNvb2tpZXMgdG8gYmUgc2VudCBvciBzZXQgYnkgc2VydmVyc1xuICAvLyBJRSAxMCsgaXMgc3RhbmRhcmRzLWNvbXBhdGlibGUgaW4gaXRzIFhNTEh0dHBSZXF1ZXN0XG4gIC8vIGJ1dCBJRSAxMCBjYW4gc3RpbGwgaGF2ZSBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3QsIHNvIHdlIGRvbid0IHdhbnQgdG8gdXNlIGl0XG4gIGlmIChjb3JzICYmIGdsb2JhbC5YRG9tYWluUmVxdWVzdCAmJiAhL01TSUUgMS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0XG4gIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpXG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdFxufVxuXG5mdW5jdGlvbiBzZXREZWZhdWx0KG9iaiwga2V5LCB2YWx1ZSkge1xuICBvYmpba2V5XSA9IG9ialtrZXldIHx8IHZhbHVlXG59XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIk5hdmlnb1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHR2YXIgUEFSQU1FVEVSX1JFR0VYUCA9IC8oWzoqXSkoXFx3KykvZztcblx0dmFyIFdJTERDQVJEX1JFR0VYUCA9IC9cXCovZztcblx0dmFyIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQID0gJyhbXlxcL10rKSc7XG5cdHZhciBSRVBMQUNFX1dJTERDQVJEID0gJyg/Oi4qKSc7XG5cdHZhciBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFAgPSAnKD86XFwvJHwkKSc7XG5cdFxuXHRmdW5jdGlvbiBjbGVhbihzKSB7XG5cdCAgaWYgKHMgaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiBzO1xuXHQgIHJldHVybiBzLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL15cXC8rLywgJy8nKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIG5hbWVzKSB7XG5cdCAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdCAgaWYgKCFtYXRjaCkgcmV0dXJuIG51bGw7XG5cdCAgcmV0dXJuIG1hdGNoLnNsaWNlKDEsIG1hdGNoLmxlbmd0aCkucmVkdWNlKGZ1bmN0aW9uIChwYXJhbXMsIHZhbHVlLCBpbmRleCkge1xuXHQgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgcGFyYW1zID0ge307XG5cdCAgICBwYXJhbXNbbmFtZXNbaW5kZXhdXSA9IHZhbHVlO1xuXHQgICAgcmV0dXJuIHBhcmFtcztcblx0ICB9LCBudWxsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZSkge1xuXHQgIHZhciBwYXJhbU5hbWVzID0gW10sXG5cdCAgICAgIHJlZ2V4cDtcblx0XG5cdCAgaWYgKHJvdXRlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICByZWdleHAgPSByb3V0ZTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChjbGVhbihyb3V0ZSkucmVwbGFjZShQQVJBTUVURVJfUkVHRVhQLCBmdW5jdGlvbiAoZnVsbCwgZG90cywgbmFtZSkge1xuXHQgICAgICBwYXJhbU5hbWVzLnB1c2gobmFtZSk7XG5cdCAgICAgIHJldHVybiBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUDtcblx0ICAgIH0pLnJlcGxhY2UoV0lMRENBUkRfUkVHRVhQLCBSRVBMQUNFX1dJTERDQVJEKSArIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCk7XG5cdCAgfVxuXHQgIHJldHVybiB7IHJlZ2V4cDogcmVnZXhwLCBwYXJhbU5hbWVzOiBwYXJhbU5hbWVzIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFVybERlcHRoKHVybCkge1xuXHQgIHJldHVybiB1cmwucmVwbGFjZSgvXFwvJC8sICcnKS5zcGxpdCgnLycpLmxlbmd0aDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY29tcGFyZVVybERlcHRoKHVybEEsIHVybEIpIHtcblx0ICByZXR1cm4gZ2V0VXJsRGVwdGgodXJsQSkgPCBnZXRVcmxEZXB0aCh1cmxCKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmluZE1hdGNoZWRSb3V0ZXModXJsKSB7XG5cdCAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICByZXR1cm4gcm91dGVzLm1hcChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciBfcmVwbGFjZUR5bmFtaWNVUkxQYXIgPSByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICB2YXIgcmVnZXhwID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnJlZ2V4cDtcblx0ICAgIHZhciBwYXJhbU5hbWVzID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnBhcmFtTmFtZXM7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gdXJsLm1hdGNoKHJlZ2V4cCk7XG5cdCAgICB2YXIgcGFyYW1zID0gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIHBhcmFtTmFtZXMpO1xuXHRcblx0ICAgIHJldHVybiBtYXRjaCA/IHsgbWF0Y2g6IG1hdGNoLCByb3V0ZTogcm91dGUsIHBhcmFtczogcGFyYW1zIH0gOiBmYWxzZTtcblx0ICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcblx0ICAgIHJldHVybiBtO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBtYXRjaCh1cmwsIHJvdXRlcykge1xuXHQgIHJldHVybiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcylbMF0gfHwgZmFsc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJvb3QodXJsLCByb3V0ZXMpIHtcblx0ICB2YXIgbWF0Y2hlZCA9IGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciB1ID0gY2xlYW4ocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHJldHVybiB1ICE9PSAnJyAmJiB1ICE9PSAnKic7XG5cdCAgfSkpO1xuXHQgIHZhciBmYWxsYmFja1VSTCA9IGNsZWFuKHVybCk7XG5cdFxuXHQgIGlmIChtYXRjaGVkLmxlbmd0aCA+IDApIHtcblx0ICAgIHJldHVybiBtYXRjaGVkLm1hcChmdW5jdGlvbiAobSkge1xuXHQgICAgICByZXR1cm4gY2xlYW4odXJsLnN1YnN0cigwLCBtLm1hdGNoLmluZGV4KSk7XG5cdCAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJvb3QsIGN1cnJlbnQpIHtcblx0ICAgICAgcmV0dXJuIGN1cnJlbnQubGVuZ3RoIDwgcm9vdC5sZW5ndGggPyBjdXJyZW50IDogcm9vdDtcblx0ICAgIH0sIGZhbGxiYWNrVVJMKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZhbGxiYWNrVVJMO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpIHtcblx0ICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlR0VUUGFyYW1zKHVybCkge1xuXHQgIHJldHVybiB1cmwucmVwbGFjZSgvXFw/KC4qKT8kLywgJycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBOYXZpZ28ociwgdXNlSGFzaCkge1xuXHQgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgIHRoaXMucm9vdCA9IHVzZUhhc2ggJiYgciA/IHIucmVwbGFjZSgvXFwvJC8sICcvIycpIDogciB8fCBudWxsO1xuXHQgIHRoaXMuX3VzZUhhc2ggPSB1c2VIYXNoO1xuXHQgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gbnVsbDtcblx0ICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9vayA9ICF1c2VIYXNoICYmIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCk7XG5cdCAgdGhpcy5fbGlzdGVuKCk7XG5cdCAgdGhpcy51cGRhdGVQYWdlTGlua3MoKTtcblx0fVxuXHRcblx0TmF2aWdvLnByb3RvdHlwZSA9IHtcblx0ICBoZWxwZXJzOiB7XG5cdCAgICBtYXRjaDogbWF0Y2gsXG5cdCAgICByb290OiByb290LFxuXHQgICAgY2xlYW46IGNsZWFuXG5cdCAgfSxcblx0ICBuYXZpZ2F0ZTogZnVuY3Rpb24gbmF2aWdhdGUocGF0aCwgYWJzb2x1dGUpIHtcblx0ICAgIHZhciB0bztcblx0XG5cdCAgICBwYXRoID0gcGF0aCB8fCAnJztcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB0byA9ICghYWJzb2x1dGUgPyB0aGlzLl9nZXRSb290KCkgKyAnLycgOiAnJykgKyBjbGVhbihwYXRoKTtcblx0ICAgICAgdG8gPSB0by5yZXBsYWNlKC8oW146XSkoXFwvezIsfSkvZywgJyQxLycpO1xuXHQgICAgICBoaXN0b3J5W3RoaXMuX3BhdXNlZCA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHt9LCAnJywgdG8pO1xuXHQgICAgICB0aGlzLnJlc29sdmUoKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC8jKC4qKSQvLCAnJykgKyAnIycgKyBwYXRoO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBvbjogZnVuY3Rpb24gb24oKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGFyZ3MubGVuZ3RoID49IDIpIHtcblx0ICAgICAgdGhpcy5fYWRkKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuXHQgICAgfSBlbHNlIGlmIChfdHlwZW9mKGFyZ3NbMF0pID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB2YXIgb3JkZXJlZFJvdXRlcyA9IE9iamVjdC5rZXlzKGFyZ3NbMF0pLnNvcnQoY29tcGFyZVVybERlcHRoKTtcblx0XG5cdCAgICAgIG9yZGVyZWRSb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgICAgICBfdGhpcy5fYWRkKHJvdXRlLCBhcmdzWzBdW3JvdXRlXSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IGFyZ3NbMF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG5vdEZvdW5kOiBmdW5jdGlvbiBub3RGb3VuZChoYW5kbGVyKSB7XG5cdCAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBoYW5kbGVyO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZShjdXJyZW50KSB7XG5cdCAgICB2YXIgaGFuZGxlciwgbTtcblx0ICAgIHZhciB1cmwgPSAoY3VycmVudCB8fCB0aGlzLl9jTG9jKCkpLnJlcGxhY2UodGhpcy5fZ2V0Um9vdCgpLCAnJyk7XG5cdFxuXHQgICAgaWYgKHRoaXMuX3BhdXNlZCB8fCB1cmwgPT09IHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5fdXNlSGFzaCkge1xuXHQgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLyMvLCAnLycpO1xuXHQgICAgfVxuXHQgICAgdXJsID0gcmVtb3ZlR0VUUGFyYW1zKHVybCk7XG5cdCAgICBtID0gbWF0Y2godXJsLCB0aGlzLl9yb3V0ZXMpO1xuXHRcblx0ICAgIGlmIChtKSB7XG5cdCAgICAgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gdXJsO1xuXHQgICAgICBoYW5kbGVyID0gbS5yb3V0ZS5oYW5kbGVyO1xuXHQgICAgICBtLnJvdXRlLnJvdXRlIGluc3RhbmNlb2YgUmVnRXhwID8gaGFuZGxlci5hcHBseSh1bmRlZmluZWQsIF90b0NvbnN1bWFibGVBcnJheShtLm1hdGNoLnNsaWNlKDEsIG0ubWF0Y2gubGVuZ3RoKSkpIDogaGFuZGxlcihtLnBhcmFtcyk7XG5cdCAgICAgIHJldHVybiBtO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9kZWZhdWx0SGFuZGxlciAmJiAodXJsID09PSAnJyB8fCB1cmwgPT09ICcvJykpIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyKCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZEhhbmRsZXIpIHtcblx0ICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSxcblx0ICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXHQgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCk7XG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbCA6IG51bGw7XG5cdCAgfSxcblx0ICB1cGRhdGVQYWdlTGlua3M6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VMaW5rcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0XG5cdCAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXHRcblx0ICAgIHRoaXMuX2ZpbmRMaW5rcygpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0ICAgICAgaWYgKCFsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQpIHtcblx0ICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0ICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFxuXHQgICAgICAgICAgaWYgKCFzZWxmLl9kZXN0cm95ZWQpIHtcblx0ICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBzZWxmLm5hdmlnYXRlKGNsZWFuKGxvY2F0aW9uKSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSkge1xuXHQgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICByZXR1cm4gdGhpcy5fcm91dGVzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3V0ZSkge1xuXHQgICAgICB2YXIga2V5O1xuXHRcblx0ICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IG5hbWUpIHtcblx0ICAgICAgICByZXN1bHQgPSByb3V0ZS5yb3V0ZTtcblx0ICAgICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnOicgKyBrZXksIGRhdGFba2V5XSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LCAnJyk7XG5cdCAgfSxcblx0ICBsaW5rOiBmdW5jdGlvbiBsaW5rKHBhdGgpIHtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRSb290KCkgKyBwYXRoO1xuXHQgIH0sXG5cdCAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHN0YXR1cykge1xuXHQgICAgdGhpcy5fcGF1c2VkID0gc3RhdHVzO1xuXHQgIH0sXG5cdCAgZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlOiBmdW5jdGlvbiBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGUoKSB7XG5cdCAgICBpZiAoIWlzUHVzaFN0YXRlQXZhaWxhYmxlKCkpIHtcblx0ICAgICAgdGhpcy5kZXN0cm95KCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfYWRkOiBmdW5jdGlvbiBfYWRkKHJvdXRlKSB7XG5cdCAgICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgaWYgKCh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaGFuZGxlcikpID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlci51c2VzLCBuYW1lOiBoYW5kbGVyLmFzIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fYWRkO1xuXHQgIH0sXG5cdCAgX2dldFJvb3Q6IGZ1bmN0aW9uIF9nZXRSb290KCkge1xuXHQgICAgaWYgKHRoaXMucm9vdCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMucm9vdDtcblx0ICAgIHRoaXMucm9vdCA9IHJvb3QodGhpcy5fY0xvYygpLCB0aGlzLl9yb3V0ZXMpO1xuXHQgICAgcmV0dXJuIHRoaXMucm9vdDtcblx0ICB9LFxuXHQgIF9saXN0ZW46IGZ1bmN0aW9uIF9saXN0ZW4oKSB7XG5cdCAgICB2YXIgX3RoaXMyID0gdGhpcztcblx0XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgX3RoaXMyLnJlc29sdmUoKTtcblx0ICAgICAgfTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIGNhY2hlZCA9IF90aGlzMi5fY0xvYygpLFxuXHQgICAgICAgICAgICBjdXJyZW50ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgICAgICBfY2hlY2sgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICAgIF9jaGVjayA9IGZ1bmN0aW9uIGNoZWNrKCkge1xuXHQgICAgICAgICAgY3VycmVudCA9IF90aGlzMi5fY0xvYygpO1xuXHQgICAgICAgICAgaWYgKGNhY2hlZCAhPT0gY3VycmVudCkge1xuXHQgICAgICAgICAgICBjYWNoZWQgPSBjdXJyZW50O1xuXHQgICAgICAgICAgICBfdGhpczIucmVzb2x2ZSgpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgX3RoaXMyLl9saXN0ZW5uaW5nSW50ZXJ2YWwgPSBzZXRUaW1lb3V0KF9jaGVjaywgMjAwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICAgIF9jaGVjaygpO1xuXHQgICAgICB9KSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2NMb2M6IGZ1bmN0aW9uIF9jTG9jKCkge1xuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0ICB9LFxuXHQgIF9maW5kTGlua3M6IGZ1bmN0aW9uIF9maW5kTGlua3MoKSB7XG5cdCAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uYXZpZ29dJykpO1xuXHQgIH1cblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE5hdmlnbztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdmlnby5qcy5tYXAiLCIndXNlIHN0cmljdCc7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO3ZhciBzY3JvbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIHdpbmRvdy5zY3JvbGxUbygwLGEpfSxzdGF0ZT1mdW5jdGlvbigpe3JldHVybiBoaXN0b3J5LnN0YXRlP2hpc3Rvcnkuc3RhdGUuc2Nyb2xsUG9zaXRpb246MH0sc2F2ZT1mdW5jdGlvbigpe3dpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7c2Nyb2xsUG9zaXRpb246d2luZG93LnBhZ2VZT2Zmc2V0fHx3aW5kb3cuc2Nyb2xsWX0sJycpfSxyZXN0b3JlPWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOm51bGwsYj1zdGF0ZSgpO2I/YT9hKGIpOnNjcm9sbChiKTpzY3JvbGwoMCl9LGluc3RhbmNlPXtnZXQgZXhwb3J0KCl7cmV0dXJuJ3VuZGVmaW5lZCc9PXR5cGVvZiB3aW5kb3c/e306KCdzY3JvbGxSZXN0b3JhdGlvbidpbiBoaXN0b3J5JiYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbj0nbWFudWFsJyxzY3JvbGwoc3RhdGUoKSksd2luZG93Lm9uYmVmb3JldW5sb2FkPXNhdmUpLHtzYXZlOnNhdmUscmVzdG9yZTpyZXN0b3JlLHN0YXRlOnN0YXRlfSl9fTtleHBvcnRzLmRlZmF1bHQ9aW5zdGFuY2UuZXhwb3J0OyIsImZ1bmN0aW9uIG5leHQoYXJncyl7XG4gIGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzLnNoaWZ0KCkuYXBwbHkodGhpcywgYXJncylcbn1cblxuZnVuY3Rpb24gcnVuKGNiLCBhcmdzKXtcbiAgY2IoKVxuICBuZXh0KGFyZ3MpXG59XG5cbmZ1bmN0aW9uIHRhcnJ5KGNiLCBkZWxheSl7XG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgdmFyIG92ZXJyaWRlID0gYXJnc1swXVxuICAgIFxuICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIG92ZXJyaWRlKXtcbiAgICAgIHJldHVybiB0YXJyeShjYiwgb3ZlcnJpZGUpXG4gICAgfVxuICAgIFxuICAgICdudW1iZXInID09PSB0eXBlb2YgZGVsYXkgPyAoXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHJ1bihjYiwgYXJncylcbiAgICAgIH0sIGRlbGF5KSBcbiAgICApIDogKFxuICAgICAgcnVuKGNiLCBhcmdzKVxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBxdWV1ZSgpe1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICByZXR1cm4gdGFycnkoZnVuY3Rpb24oKXtcbiAgICBuZXh0KGFyZ3Muc2xpY2UoMCkpXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHtcbiAgdGFycnk6IHRhcnJ5LFxuICBxdWV1ZTogcXVldWVcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMgPSByZXF1aXJlKCcuL3RyYW5zZm9ybS1wcm9wcycpO1xuXG52YXIgX3RyYW5zZm9ybVByb3BzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RyYW5zZm9ybVByb3BzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGggPSBmdW5jdGlvbiBoKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPyBhcHBseVByb3BzKHRhZykoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA6IGFwcGVuZENoaWxkcmVuKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufTtcblxudmFyIGlzT2JqID0gZnVuY3Rpb24gaXNPYmoobykge1xuICByZXR1cm4gbyAhPT0gbnVsbCAmJiAodHlwZW9mIG8gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG8pKSA9PT0gJ29iamVjdCc7XG59O1xuXG52YXIgaXNQcm9wcyA9IGZ1bmN0aW9uIGlzUHJvcHMoYXJnKSB7XG4gIHJldHVybiBpc09iaihhcmcpICYmICEoYXJnIGluc3RhbmNlb2YgRWxlbWVudCk7XG59O1xuXG52YXIgYXBwbHlQcm9wcyA9IGZ1bmN0aW9uIGFwcGx5UHJvcHModGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSkge1xuICAgICAgICByZXR1cm4gaCh0YWcpKE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVsID0gaCh0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICAgIHZhciBwID0gKDAsIF90cmFuc2Zvcm1Qcm9wczIuZGVmYXVsdCkocHJvcHMpO1xuICAgICAgT2JqZWN0LmtleXMocCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoL15vbi8udGVzdChrKSkge1xuICAgICAgICAgIGVsW2tdID0gcFtrXTtcbiAgICAgICAgfSBlbHNlIGlmIChrID09PSAnX19odG1sJykge1xuICAgICAgICAgIGVsLmlubmVySFRNTCA9IHBba107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGssIHBba10pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuICB9O1xufTtcblxudmFyIGFwcGVuZENoaWxkcmVuID0gZnVuY3Rpb24gYXBwZW5kQ2hpbGRyZW4odGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNoaWxkcmVuID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBjaGlsZHJlbltfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYyBpbnN0YW5jZW9mIEVsZW1lbnQgPyBjIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYyk7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGVsLmFwcGVuZENoaWxkKGMpO1xuICAgIH0pO1xuICAgIHJldHVybiBlbDtcbiAgfTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGg7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGtlYmFiID0gZXhwb3J0cy5rZWJhYiA9IGZ1bmN0aW9uIGtlYmFiKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKGcpIHtcbiAgICByZXR1cm4gJy0nICsgZy50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn07XG5cbnZhciBwYXJzZVZhbHVlID0gZXhwb3J0cy5wYXJzZVZhbHVlID0gZnVuY3Rpb24gcGFyc2VWYWx1ZShwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInID8gYWRkUHgocHJvcCkodmFsKSA6IHZhbDtcbiAgfTtcbn07XG5cbnZhciB1bml0bGVzc1Byb3BlcnRpZXMgPSBleHBvcnRzLnVuaXRsZXNzUHJvcGVydGllcyA9IFsnbGluZUhlaWdodCcsICdmb250V2VpZ2h0JywgJ29wYWNpdHknLCAnekluZGV4J1xuLy8gUHJvYmFibHkgbmVlZCBhIGZldyBtb3JlLi4uXG5dO1xuXG52YXIgYWRkUHggPSBleHBvcnRzLmFkZFB4ID0gZnVuY3Rpb24gYWRkUHgocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB1bml0bGVzc1Byb3BlcnRpZXMuaW5jbHVkZXMocHJvcCkgPyB2YWwgOiB2YWwgKyAncHgnO1xuICB9O1xufTtcblxudmFyIGZpbHRlck51bGwgPSBleHBvcnRzLmZpbHRlck51bGwgPSBmdW5jdGlvbiBmaWx0ZXJOdWxsKG9iaikge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBvYmpba2V5XSAhPT0gbnVsbDtcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVEZWMgPSBleHBvcnRzLmNyZWF0ZURlYyA9IGZ1bmN0aW9uIGNyZWF0ZURlYyhzdHlsZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZWJhYihrZXkpICsgJzonICsgcGFyc2VWYWx1ZShrZXkpKHN0eWxlW2tleV0pO1xuICB9O1xufTtcblxudmFyIHN0eWxlVG9TdHJpbmcgPSBleHBvcnRzLnN0eWxlVG9TdHJpbmcgPSBmdW5jdGlvbiBzdHlsZVRvU3RyaW5nKHN0eWxlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdHlsZSkuZmlsdGVyKGZpbHRlck51bGwoc3R5bGUpKS5tYXAoY3JlYXRlRGVjKHN0eWxlKSkuam9pbignOycpO1xufTtcblxudmFyIGlzU3R5bGVPYmplY3QgPSBleHBvcnRzLmlzU3R5bGVPYmplY3QgPSBmdW5jdGlvbiBpc1N0eWxlT2JqZWN0KHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleSA9PT0gJ3N0eWxlJyAmJiBwcm9wc1trZXldICE9PSBudWxsICYmIF90eXBlb2YocHJvcHNba2V5XSkgPT09ICdvYmplY3QnO1xuICB9O1xufTtcblxudmFyIGNyZWF0ZVN0eWxlID0gZXhwb3J0cy5jcmVhdGVTdHlsZSA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGlzU3R5bGVPYmplY3QocHJvcHMpKGtleSkgPyBzdHlsZVRvU3RyaW5nKHByb3BzW2tleV0pIDogcHJvcHNba2V5XTtcbiAgfTtcbn07XG5cbnZhciByZWR1Y2VQcm9wcyA9IGV4cG9ydHMucmVkdWNlUHJvcHMgPSBmdW5jdGlvbiByZWR1Y2VQcm9wcyhwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGEsIGtleSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGEsIF9kZWZpbmVQcm9wZXJ0eSh7fSwga2V5LCBjcmVhdGVTdHlsZShwcm9wcykoa2V5KSkpO1xuICB9O1xufTtcblxudmFyIHRyYW5zZm9ybVByb3BzID0gZXhwb3J0cy50cmFuc2Zvcm1Qcm9wcyA9IGZ1bmN0aW9uIHRyYW5zZm9ybVByb3BzKHByb3BzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykucmVkdWNlKHJlZHVjZVByb3BzKHByb3BzKSwge30pO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gdHJhbnNmb3JtUHJvcHM7IiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLkxheXpyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxudmFyIGtub3QgPSBmdW5jdGlvbiBrbm90KCkge1xuICB2YXIgZXh0ZW5kZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZ1bmN0aW9uIG9uKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBldmVudHNbbmFtZV0gPSBldmVudHNbbmFtZV0gfHwgW107XG4gICAgZXZlbnRzW25hbWVdLnB1c2goaGFuZGxlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBoYW5kbGVyLl9vbmNlID0gdHJ1ZTtcbiAgICBvbihuYW1lLCBoYW5kbGVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9mZihuYW1lKSB7XG4gICAgdmFyIGhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuXG4gICAgaGFuZGxlciA/IGV2ZW50c1tuYW1lXS5zcGxpY2UoZXZlbnRzW25hbWVdLmluZGV4T2YoaGFuZGxlciksIDEpIDogZGVsZXRlIGV2ZW50c1tuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChuYW1lKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgLy8gY2FjaGUgdGhlIGV2ZW50cywgdG8gYXZvaWQgY29uc2VxdWVuY2VzIG9mIG11dGF0aW9uXG4gICAgdmFyIGNhY2hlID0gZXZlbnRzW25hbWVdICYmIGV2ZW50c1tuYW1lXS5zbGljZSgpO1xuXG4gICAgLy8gb25seSBmaXJlIGhhbmRsZXJzIGlmIHRoZXkgZXhpc3RcbiAgICBjYWNoZSAmJiBjYWNoZS5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAvLyByZW1vdmUgaGFuZGxlcnMgYWRkZWQgd2l0aCAnb25jZSdcbiAgICAgIGhhbmRsZXIuX29uY2UgJiYgb2ZmKG5hbWUsIGhhbmRsZXIpO1xuXG4gICAgICAvLyBzZXQgJ3RoaXMnIGNvbnRleHQsIHBhc3MgYXJncyB0byBoYW5kbGVyc1xuICAgICAgaGFuZGxlci5hcHBseShfdGhpcywgYXJncyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgZXh0ZW5kZWQsIHtcblxuICAgIG9uOiBvbixcbiAgICBvbmNlOiBvbmNlLFxuICAgIG9mZjogb2ZmLFxuICAgIGVtaXQ6IGVtaXRcbiAgfSk7XG59O1xuXG52YXIgbGF5enIgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIHZhciBwcmV2TG9jID0gZ2V0TG9jKCk7XG4gIHZhciB0aWNraW5nID0gdm9pZCAwO1xuXG4gIHZhciBub2RlcyA9IHZvaWQgMDtcbiAgdmFyIHdpbmRvd0hlaWdodCA9IHZvaWQgMDtcblxuICAvLyBvcHRpb25zXG5cbiAgdmFyIHNldHRpbmdzID0ge1xuICAgIG5vcm1hbDogb3B0aW9ucy5ub3JtYWwgfHwgJ2RhdGEtbm9ybWFsJyxcbiAgICByZXRpbmE6IG9wdGlvbnMucmV0aW5hIHx8ICdkYXRhLXJldGluYScsXG4gICAgc3Jjc2V0OiBvcHRpb25zLnNyY3NldCB8fCAnZGF0YS1zcmNzZXQnLFxuICAgIHRocmVzaG9sZDogb3B0aW9ucy50aHJlc2hvbGQgfHwgMFxuICB9O1xuXG4gIC8vIGZlYXR1cmUgZGV0ZWN0aW9uXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2Jsb2IvbWFzdGVyL2ZlYXR1cmUtZGV0ZWN0cy9pbWcvc3Jjc2V0LmpzXG5cbiAgdmFyIHNyY3NldCA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzcmNzZXQnKSB8fCAnc3Jjc2V0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAvLyBkZXZpY2UgcGl4ZWwgcmF0aW9cbiAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRTEwIC0gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kbjI2NTAzMCh2PXZzLjg1KS5hc3B4XG5cbiAgdmFyIGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IHdpbmRvdy5zY3JlZW4uZGV2aWNlWERQSSAvIHdpbmRvdy5zY3JlZW4ubG9naWNhbFhEUEk7XG5cbiAgLy8gaW5zdGFuY2VcblxuICB2YXIgaW5zdGFuY2UgPSBrbm90KHtcbiAgICBoYW5kbGVyczogaGFuZGxlcnMsXG4gICAgY2hlY2s6IGNoZWNrLFxuICAgIHVwZGF0ZTogdXBkYXRlXG4gIH0pO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcblxuICAvLyBsb2NhdGlvbiBoZWxwZXJcblxuICBmdW5jdGlvbiBnZXRMb2MoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgfVxuXG4gIC8vIGRlYm91bmNlIGhlbHBlcnNcblxuICBmdW5jdGlvbiByZXF1ZXN0U2Nyb2xsKCkge1xuICAgIHByZXZMb2MgPSBnZXRMb2MoKTtcbiAgICByZXF1ZXN0RnJhbWUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXVlc3RGcmFtZSgpIHtcbiAgICBpZiAoIXRpY2tpbmcpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2hlY2soKTtcbiAgICAgIH0pO1xuICAgICAgdGlja2luZyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gb2Zmc2V0IGhlbHBlclxuXG4gIGZ1bmN0aW9uIGdldE9mZnNldChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcHJldkxvYztcbiAgfVxuXG4gIC8vIGluIHZpZXdwb3J0IGhlbHBlclxuXG4gIGZ1bmN0aW9uIGluVmlld3BvcnQobm9kZSkge1xuICAgIHZhciB2aWV3VG9wID0gcHJldkxvYztcbiAgICB2YXIgdmlld0JvdCA9IHZpZXdUb3AgKyB3aW5kb3dIZWlnaHQ7XG5cbiAgICB2YXIgbm9kZVRvcCA9IGdldE9mZnNldChub2RlKTtcbiAgICB2YXIgbm9kZUJvdCA9IG5vZGVUb3AgKyBub2RlLm9mZnNldEhlaWdodDtcblxuICAgIHZhciBvZmZzZXQgPSBzZXR0aW5ncy50aHJlc2hvbGQgLyAxMDAgKiB3aW5kb3dIZWlnaHQ7XG5cbiAgICByZXR1cm4gbm9kZUJvdCA+PSB2aWV3VG9wIC0gb2Zmc2V0ICYmIG5vZGVUb3AgPD0gdmlld0JvdCArIG9mZnNldDtcbiAgfVxuXG4gIC8vIHNvdXJjZSBoZWxwZXJcblxuICBmdW5jdGlvbiBzZXRTb3VyY2Uobm9kZSkge1xuICAgIGluc3RhbmNlLmVtaXQoJ3NyYzpiZWZvcmUnLCBub2RlKTtcblxuICAgIC8vIHByZWZlciBzcmNzZXQsIGZhbGxiYWNrIHRvIHBpeGVsIGRlbnNpdHlcbiAgICBpZiAoc3Jjc2V0ICYmIG5vZGUuaGFzQXR0cmlidXRlKHNldHRpbmdzLnNyY3NldCkpIHtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdzcmNzZXQnLCBub2RlLmdldEF0dHJpYnV0ZShzZXR0aW5ncy5zcmNzZXQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJldGluYSA9IGRwciA+IDEgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoc2V0dGluZ3MucmV0aW5hKTtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCByZXRpbmEgfHwgbm9kZS5nZXRBdHRyaWJ1dGUoc2V0dGluZ3Mubm9ybWFsKSk7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuZW1pdCgnc3JjOmFmdGVyJywgbm9kZSk7W3NldHRpbmdzLm5vcm1hbCwgc2V0dGluZ3MucmV0aW5hLCBzZXR0aW5ncy5zcmNzZXRdLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgIHJldHVybiBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICB9KTtcblxuICAgIHVwZGF0ZSgpO1xuICB9XG5cbiAgLy8gQVBJXG5cbiAgZnVuY3Rpb24gaGFuZGxlcnMoZmxhZykge1xuICAgIHZhciBhY3Rpb24gPSBmbGFnID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1snc2Nyb2xsJywgJ3Jlc2l6ZSddLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICByZXR1cm4gd2luZG93W2FjdGlvbl0oZXZlbnQsIHJlcXVlc3RTY3JvbGwpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgcmV0dXJuIGluVmlld3BvcnQobm9kZSkgJiYgc2V0U291cmNlKG5vZGUpO1xuICAgIH0pO1xuXG4gICAgdGlja2luZyA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnWycgKyBzZXR0aW5ncy5ub3JtYWwgKyAnXScpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbnJldHVybiBsYXl6cjtcblxufSkpKTtcbiIsImNvbnN0IGNyZWF0ZUJhciA9IChyb290LCBjbGFzc25hbWUpID0+IHtcbiAgbGV0IG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBsZXQgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgby5jbGFzc05hbWUgPSBjbGFzc25hbWUgXG4gIGkuY2xhc3NOYW1lID0gYCR7Y2xhc3NuYW1lfV9faW5uZXJgXG4gIG8uYXBwZW5kQ2hpbGQoaSlcbiAgcm9vdC5pbnNlcnRCZWZvcmUobywgcm9vdC5jaGlsZHJlblswXSlcblxuICByZXR1cm4ge1xuICAgIG91dGVyOiBvLFxuICAgIGlubmVyOiBpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKHJvb3QgPSBkb2N1bWVudC5ib2R5LCBvcHRzID0ge30pID0+IHtcbiAgbGV0IHRpbWVyID0gbnVsbFxuICBjb25zdCBzcGVlZCA9IG9wdHMuc3BlZWQgfHwgMjAwXG4gIGNvbnN0IGNsYXNzbmFtZSA9IG9wdHMuY2xhc3NuYW1lIHx8ICdwdXR6J1xuICBjb25zdCB0cmlja2xlID0gb3B0cy50cmlja2xlIHx8IDUgXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IDBcbiAgfVxuXG4gIGNvbnN0IGJhciA9IGNyZWF0ZUJhcihyb290LCBjbGFzc25hbWUpXG5cbiAgY29uc3QgcmVuZGVyID0gKHZhbCA9IDApID0+IHtcbiAgICBzdGF0ZS5wcm9ncmVzcyA9IHZhbFxuICAgIGJhci5pbm5lci5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKCR7c3RhdGUuYWN0aXZlID8gJzAnIDogJy0xMDAlJ30pIHRyYW5zbGF0ZVgoJHstMTAwICsgc3RhdGUucHJvZ3Jlc3N9JSk7YFxuICB9XG5cbiAgY29uc3QgZ28gPSB2YWwgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICByZW5kZXIoTWF0aC5taW4odmFsLCA5NSkpXG4gIH1cblxuICBjb25zdCBpbmMgPSAodmFsID0gKE1hdGgucmFuZG9tKCkgKiB0cmlja2xlKSkgPT4gZ28oc3RhdGUucHJvZ3Jlc3MgKyB2YWwpXG5cbiAgY29uc3QgZW5kID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlXG4gICAgcmVuZGVyKDEwMClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbmRlcigpLCBzcGVlZClcbiAgICBpZiAodGltZXIpeyBjbGVhclRpbWVvdXQodGltZXIpIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IHRydWVcbiAgICBpbmMoKVxuICB9XG5cbiAgY29uc3QgcHV0eiA9IChpbnRlcnZhbCA9IDUwMCkgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IGluYygpLCBpbnRlcnZhbClcbiAgfVxuICBcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoe1xuICAgIHB1dHosXG4gICAgc3RhcnQsXG4gICAgaW5jLFxuICAgIGdvLFxuICAgIGVuZCxcbiAgICBnZXRTdGF0ZTogKCkgPT4gc3RhdGVcbiAgfSx7XG4gICAgYmFyOiB7XG4gICAgICB2YWx1ZTogYmFyXG4gICAgfVxuICB9KVxufVxuIiwiY29uc3QgZmluZExpbmsgPSAoaWQsIGRhdGEpID0+IGRhdGEuZmlsdGVyKGwgPT4gbC5pZCA9PT0gaWQpWzBdXG5cbmNvbnN0IGNyZWF0ZUxpbmsgPSAoeyBhbnN3ZXJzIH0sIGRhdGEpID0+IGFuc3dlcnMuZm9yRWFjaChhID0+IHtcbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgbGV0IGlzR0lGID0gL2dpZi8udGVzdChhLm5leHQpID8gdHJ1ZSA6IGZhbHNlXG4gIGEubmV4dCA9IGlzUGF0aCB8fCBpc0dJRiA/IGEubmV4dCA6IGZpbmRMaW5rKGEubmV4dCwgZGF0YSlcbn0pXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTdG9yZSA9IChxdWVzdGlvbnMpID0+IHtcblx0cXVlc3Rpb25zLm1hcChxID0+IGNyZWF0ZUxpbmsocSwgcXVlc3Rpb25zKSlcblx0cmV0dXJuIHF1ZXN0aW9uc1xufVxuXG5leHBvcnQgZGVmYXVsdCBxdWVzdGlvbnMgPT4ge1xuICByZXR1cm4ge1xuICAgIHN0b3JlOiBjcmVhdGVTdG9yZShxdWVzdGlvbnMpLFxuICAgIGdldEFjdGl2ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmZpbHRlcihxID0+IHEuaWQgPT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoLyMvKVsxXSlbMF0gfHwgdGhpcy5zdG9yZVswXVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgW1xuICB7XG4gICAgaWQ6IDEsXG4gICAgcHJvbXB0OiBgaGkhIHdoYXQgYnJpbmdzIHlvdSB0byB0aGlzIG5lY2sgb2YgdGhlIGludGVyd2Vicz9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICd3aG8gciB1JyxcbiAgICAgICAgbmV4dDogMiBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnaGlyaW5nJyxcbiAgICAgICAgbmV4dDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBpdCdzIHlvdXIgbW9tYCxcbiAgICAgICAgbmV4dDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBmdW5ueSBqb2tlc2AsXG4gICAgICAgIG5leHQ6IDVcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAyLFxuICAgIHByb21wdDogYGknbSBtZWxhbmllIOKAkyBhIGdyYXBoaWMgZGVzaWduZXIgd29ya2luZyBpbiBleHBlcmllbnRpYWwgbWFya2V0aW5nICYgcHJvdWQgaW93YW4gdHJ5aW5nIHRvIGVhdCBBTEwgdGhlIEJMVHNgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aGF0J3MgZXhwZXJpZW50aWFsP2AsXG4gICAgICAgIG5leHQ6IDYgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHdoYXQncyBhIEJMVD9gLFxuICAgICAgICBuZXh0OiA3XG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDMsXG4gICAgcHJvbXB0OiBgcmFkISBjYW4gaSBzaG93IHlvdSBzb21lIHByb2plY3RzIGkndmUgd29ya2VkIG9uP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYHllcywgcGxlYXNlIWAsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgbmFoLCB0ZWxsIG1lIGFib3V0IHlvdWAsXG4gICAgICAgIG5leHQ6ICcvYWJvdXQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGknbGwgZW1haWwgeW91IGluc3RlYWRgLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDQsXG4gICAgcHJvbXB0OiBgaGkgbW9tISBpIGxvdmUgeW91IWAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYDopIGkgbG92ZSB5b3UgdG9vIWAsXG4gICAgICAgIG5leHQ6IDhcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgamssIG5vdCB5b3VyIG1vbWAsXG4gICAgICAgIG5leHQ6IDlcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNSxcbiAgICBwcm9tcHQ6IGB3aGF0J3MgZnVubmllciB0aGFuIGEgcmhldG9yaWNhbCBxdWVzdGlvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB5ZXNgLFxuICAgICAgICBuZXh0OiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBub2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9QMkh5ODhyQWpRZHNRL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNixcbiAgICBwcm9tcHQ6IGBleHBlcmllbnRpYWwgaXMgdGhpcyBjb29sIG5pY2hlIHR5cGUgb2YgbWFya2V0aW5nLCB5YSBrbm93P2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYHNvdW5kcyBjb29sLiB3aGF0IGhhdmUgeW91IGRvbmU/YCxcbiAgICAgICAgbmV4dDogJy93b3JrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aHkgZG8geW91IGxpa2UgaXQ/YCxcbiAgICAgICAgbmV4dDogMTFcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNyxcbiAgICBwcm9tcHQ6IGB0YWtlIGEgd2lsZCBndWVzcy4uLmAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYGJlZWYgbGl2ZXIgdG9hc3RgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvb0ZPczEwU0pTbnpvcy9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGJsdWViZXJyeSBsZW1vbiB0YXJ0YCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzNvN1RLd21uRGdRYjVqZW1qSy9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGJhY29uIGxldHR1Y2UgdG9tYXRvYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL2ZxenhjbWxZN29wT2cvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA4LFxuICAgIHByb21wdDogYHNvLi4uIGNhbiBpIHNoaXAgbGF1bmRyeSBob21lIHRvIGlvd2E/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgb2YgY291cnNlIWAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8xMXNCTFZ4TnM3djZXQS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHllYWgsIHN0aWxsIG5vdCB5b3VyIG1vbS4uLmAsXG4gICAgICAgIG5leHQ6IDEyXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDksXG4gICAgcHJvbXB0OiBgY2xpY2tpbmcgZm9yIGZ1biwgaHVoPyBnb29kIGx1Y2sgd2l0aCB0aGlzIG9uZS5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBibHVlIHBpbGxgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvRzdHTm9hVVNIN3NNVS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYHJlZCBwaWxsYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL1VqdWpHWTNtQTNKbGUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxMCxcbiAgICBwcm9tcHQ6IGBwYW5jYWtlcyBvciB3YWZmbGVzP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYGZyZW5jaCB0b2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8xNG5iNlRsSVJsYU4xdS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDExLFxuICAgIHByb21wdDogYGkgbGlrZSBleHBlcmllbnRpYWwgYmVjYXVzZSBpdCdzIGp1c3Qgc3VwZXIgY29vbCwgb2theT9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGB3aGF0IGFyZSB5b3VyIGZhdm9yaXRlIHByb2plY3RzP2AsXG4gICAgICAgIG5leHQ6IDE0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYGkgaGF2ZSBxdWVzdGlvbnMhIGNhbiBpIGVtYWlsIHlvdT9gLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSwgIFxuXG4gIHtcbiAgICBpZDogMTIsXG4gICAgcHJvbXB0OiBgdGFraW5nIHRoaXMgYSBsaXR0bGUgZmFyIGRvbid0IHlvdSB0aGluaz9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBzdXJlIGFtYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL3FJTnNmREdJMHo5eVUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBtdXN0IGNsaWNrIEFMTCBidXR0b25zYCxcbiAgICAgICAgbmV4dDogMTNcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTMsXG4gICAgcHJvbXB0OiBgeWVhaD9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBjbGlja2luZyB0aGlzIG1heSBoYXJtIGEga2l0dGVuYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL0lnZ2hrWFdrZG5FRW8vZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxNCxcbiAgICBwcm9tcHQ6IGBvZiBjb3Vyc2UgSSBsb3ZlIG15IG93biB3b3JrLCBidXQgdGhlc2UgcHJvamVjdHMgZGVzZXJ2ZSBzb21lIHNlcmlvdXMgcHJvcHNgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBwcm9qZWN0IDFgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly90d2l0dGVyLmNvbSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgcHJvamVjdCAyYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgcHJvamVjdCAzYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbl1cbiIsImltcG9ydCBoMCBmcm9tICdoMCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi4vbGliL2NvbG9ycydcblxuZXhwb3J0IGNvbnN0IGRpdiA9IGgwKCdkaXYnKVxuZXhwb3J0IGNvbnN0IGJ1dHRvbiA9IGgwKCdidXR0b24nKSh7Y2xhc3M6ICdoMiBtdjAgaW5saW5lLWJsb2NrJ30pXG5leHBvcnQgY29uc3QgdGl0bGUgPSBoMCgncCcpKHtjbGFzczogJ2gxIG10MCBtYjA1IGNiJ30pXG5cbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZSA9ICh7cHJvbXB0LCBhbnN3ZXJzfSwgY2IpID0+IHtcbiAgcmV0dXJuIGRpdih7Y2xhc3M6ICdxdWVzdGlvbid9KShcbiAgICB0aXRsZShwcm9tcHQpLFxuICAgIGRpdihcbiAgICAgIC4uLmFuc3dlcnMubWFwKChhLCBpKSA9PiBidXR0b24oe1xuICAgICAgICBvbmNsaWNrOiAoZSkgPT4gY2IoYS5uZXh0KSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBjb2xvcjogY29sb3JzLmNvbG9yc1tpXVxuICAgICAgICB9XG4gICAgICB9KShhLnZhbHVlKSlcbiAgICApXG4gIClcbn1cbiIsImltcG9ydCB7IHRhcnJ5LCBxdWV1ZSB9IGZyb20gJ3RhcnJ5LmpzJ1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dpZicpXG4gIGNvbnN0IGltZyA9IG1vZGFsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKVswXVxuXG4gIGNvbnN0IHNob3cgPSB0YXJyeSgoKSA9PiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJykgXG4gIGNvbnN0IGhpZGUgPSB0YXJyeSgoKSA9PiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKSBcbiAgY29uc3QgdG9nZ2xlID0gdGFycnkoXG4gICAgKCkgPT4gbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSBcbiAgICAgID8gbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgIDogbW9kYWwuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJylcbiAgKVxuXG4gIGNvbnN0IGxhenkgPSAodXJsLCBjYikgPT4ge1xuICAgIGxldCBidXJuZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgYnVybmVyLm9ubG9hZCA9ICgpID0+IGNiKHVybClcblxuICAgIGJ1cm5lci5zcmMgPSB1cmxcbiAgfVxuXG4gIGNvbnN0IG9wZW4gPSB1cmwgPT4ge1xuICAgIHdpbmRvdy5sb2FkZXIuc3RhcnQoKVxuICAgIHdpbmRvdy5sb2FkZXIucHV0eig1MDApXG5cbiAgICBsYXp5KHVybCwgdXJsID0+IHtcbiAgICAgIGltZy5zcmMgPSB1cmxcbiAgICAgIHF1ZXVlKHNob3csIHRvZ2dsZSgyMDApKSgpXG4gICAgICB3aW5kb3cubG9hZGVyLmVuZCgpXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIHF1ZXVlKHRvZ2dsZSwgaGlkZSgyMDApKSgpXG4gIH1cblxuICBtb2RhbC5vbmNsaWNrID0gY2xvc2VcblxuICByZXR1cm4ge1xuICAgIG9wZW4sXG4gICAgY2xvc2VcbiAgfVxufVxuIiwiaW1wb3J0IHJvdXRlciBmcm9tICcuLi9saWIvcm91dGVyJ1xuaW1wb3J0IHF1ZXN0aW9ucyBmcm9tICcuL2RhdGEvaW5kZXguanMnXG5pbXBvcnQgc3RvcmFnZSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgZ2lmZmVyIGZyb20gJy4vZ2lmZmVyJ1xuaW1wb3J0IHsgdGVtcGxhdGUgfSBmcm9tICcuL2VsZW1lbnRzJ1xuXG5sZXQgcHJldlxuY29uc3QgZGF0YSA9IHN0b3JhZ2UocXVlc3Rpb25zKVxuXG4vKipcbiAqIFJlbmRlciB0ZW1wbGF0ZSBhbmQgYXBwZW5kIHRvIERPTVxuICovXG5jb25zdCByZW5kZXIgPSAobmV4dCkgPT4ge1xuICBsZXQgcXVlc3Rpb25Sb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0aW9uUm9vdCcpXG5cbiAgbGV0IGVsID0gdGVtcGxhdGUobmV4dCwgdXBkYXRlKVxuICBxdWVzdGlvblJvb3QgJiYgcXVlc3Rpb25Sb290LmFwcGVuZENoaWxkKGVsKVxuICByZXR1cm4gZWwgXG59XG5cbi8qKlxuICogSGFuZGxlIERPTSB1cGRhdGVzLCBvdGhlciBsaW5rIGNsaWNrc1xuICovXG5jb25zdCB1cGRhdGUgPSAobmV4dCkgPT4ge1xuICBsZXQgcXVlc3Rpb25Sb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0aW9uUm9vdCcpXG5cbiAgbGV0IGlzR0lGID0gL2dpcGh5Ly50ZXN0KG5leHQpXG4gIGlmIChpc0dJRikgcmV0dXJuIGdpZmZlcigpLm9wZW4obmV4dClcblxuICBsZXQgaXNQYXRoID0gL15cXC8vLnRlc3QobmV4dClcbiAgaWYgKGlzUGF0aCkgcmV0dXJuIHJvdXRlci5nbyhuZXh0KVxuXG4gIGlmIChwcmV2ICYmIHF1ZXN0aW9uUm9vdCAmJiBxdWVzdGlvblJvb3QuY29udGFpbnMocHJldikpIHF1ZXN0aW9uUm9vdC5yZW1vdmVDaGlsZChwcmV2KVxuXG4gIHByZXYgPSByZW5kZXIobmV4dClcblxuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5leHQuaWRcbn1cblxuLyoqXG4gKiBXYWl0IHVudGlsIG5ldyBET00gaXMgcHJlc2VudCBiZWZvcmVcbiAqIHRyeWluZyB0byByZW5kZXIgdG8gaXRcbiAqL1xucm91dGVyLm9uKCdyb3V0ZTphZnRlcicsICh7IHJvdXRlIH0pID0+IHtcbiAgaWYgKHJvdXRlID09PSAnJyB8fCAvKF5cXC98XFwvI1swLTldfCNbMC05XSkvLnRlc3Qocm91dGUpKXtcbiAgICB1cGRhdGUoZGF0YS5nZXRBY3RpdmUoKSlcbiAgfVxufSlcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBwcmV2ID0gcmVuZGVyKGRhdGEuZ2V0QWN0aXZlKCkpXG59XG4iLCJpbXBvcnQgcHV0eiBmcm9tICdwdXR6J1xuaW1wb3J0IHJvdXRlciBmcm9tICcuL2xpYi9yb3V0ZXInXG5pbXBvcnQgYXBwIGZyb20gJy4vYXBwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2xpYi9jb2xvcnMnXG5cbmNvbnN0IGxvYWRlciA9IHdpbmRvdy5sb2FkZXIgPSBwdXR6KGRvY3VtZW50LmJvZHksIHtcbiAgc3BlZWQ6IDEwMCxcbiAgdHJpY2tsZTogMTBcbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBhcHAoKVxuXG4gIHJvdXRlci5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSB9KSA9PiB7XG4gICAgY29sb3JzLnVwZGF0ZSgpXG4gIH0pXG5cbiAgY29sb3JzLnVwZGF0ZSgpXG59KVxuIiwiY29uc3Qgcm9vdFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChyb290U3R5bGUpXG5cbmNvbnN0IGNvbG9ycyA9IFtcbiAgJyMzNUQzRTgnLFxuICAnI0ZGNEU0MicsXG4gICcjRkZFQTUxJ1xuXVxuXG5jb25zdCByYW5kb21Db2xvciA9ICgpID0+IGNvbG9yc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAoMiAtIDApICsgMCldXG5cbmNvbnN0IHNhdmVDb2xvciA9IGMgPT4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21qcycsIEpTT04uc3RyaW5naWZ5KHtcbiAgY29sb3I6IGNcbn0pKVxuXG5jb25zdCByZWFkQ29sb3IgPSAoKSA9PiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWpzJykgPyAoXG4gIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21qcycpKS5jb2xvclxuKSA6IChcbiAgbnVsbFxuKVxuXG5jb25zdCBnZXRDb2xvciA9ICgpID0+IHtcbiAgbGV0IGMgPSByYW5kb21Db2xvcigpXG4gIGxldCBwcmV2ID0gcmVhZENvbG9yKClcblxuICB3aGlsZSAoYyA9PT0gcHJldil7XG4gICAgYyA9IHJhbmRvbUNvbG9yKClcbiAgfVxuXG4gIHNhdmVDb2xvcihjKVxuICByZXR1cm4gY1xufVxuXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gIGxldCBjb2xvciA9IGdldENvbG9yKClcbiAgXG4gIHJvb3RTdHlsZS5pbm5lckhUTUwgPSBgXG4gICAgYm9keSB7IGNvbG9yOiAke2NvbG9yfSB9XG4gICAgOjotbW96LXNlbGVjdGlvbiB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfTtcbiAgICB9XG4gICAgOjpzZWxlY3Rpb24ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgfVxuICBgXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlOiB1cGRhdGUsXG4gIGNvbG9yc1xufVxuIiwiaW1wb3J0IGxheXpyIGZyb20gJ2xheXpyLmpzJ1xuaW1wb3J0IG9wZXJhdG9yIGZyb20gJ29wZXJhdG9yLmpzJ1xuXG4vKipcbiAqIFNlbmQgcGFnZSB2aWV3cyB0byBcbiAqIEdvb2dsZSBBbmFseXRpY3NcbiAqL1xuY29uc3QgZ2FUcmFja1BhZ2VWaWV3ID0gKHBhdGgsIHRpdGxlKSA9PiB7XG4gIGxldCBnYSA9IHdpbmRvdy5nYSA/IHdpbmRvdy5nYSA6IGZhbHNlXG5cbiAgaWYgKCFnYSkgcmV0dXJuXG5cbiAgZ2EoJ3NldCcsIHtwYWdlOiBwYXRoLCB0aXRsZTogdGl0bGV9KTtcbiAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbn1cblxuY29uc3QgaW1hZ2VzID0gbGF5enIoe30pXG5pbWFnZXMudXBkYXRlKCkuY2hlY2soKVxud2luZG93LmltYWdlcyA9IGltYWdlc1xuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCdcbn0pXG5cbmFwcC5vbigncm91dGU6YWZ0ZXInLCAoeyByb3V0ZSwgdGl0bGUgfSkgPT4ge1xuICBnYVRyYWNrUGFnZVZpZXcocm91dGUsIHRpdGxlKVxuICBpbWFnZXMudXBkYXRlKCkuY2hlY2soKVxufSlcblxuYXBwLm9uKCd0cmFuc2l0aW9uOmFmdGVyJywgKCkgPT4gbG9hZGVyICYmIGxvYWRlci5lbmQoKSlcblxud2luZG93LmFwcCA9IGFwcFxuXG5leHBvcnQgZGVmYXVsdCBhcHBcbiJdfQ==
