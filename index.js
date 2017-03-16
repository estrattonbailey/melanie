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
    next: 'https://media.giphy.com/media/P2Hy88rAjQdsQ/giphy.gif'
  }]
}, {
  id: 6,
  prompt: 'Experiential marketing engages directly with consumers. Examples? Hip pop-up shops, wild installations, or simple street teams distributing product samples.',
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
    next: 'https://media.giphy.com/media/14nb6TlIRlaN1u/giphy.gif'
  }]
}, {
  id: 11,
  prompt: 'There are a number of reasons, but a major hook is the challenge to consistently create ways to surprise and delight consumers.',
  answers: [{
    value: 'What are your favorite projects?',
    next: 14
  }, {
    value: 'I have questions! Can I email you?',
    next: '/contact'
  }]
}, {
  id: 14,
  prompt: 'I love the work I\'ve done, but these projects deserve some serious props.',
  answers: [{
    value: 'Project 1',
    next: 'https://twitter.com'
  }, {
    value: 'Project 2',
    next: 'https://twitter.com'
  }, {
    value: 'Project 3',
    next: 'https://twitter.com'
  }]
}, {
  id: 15,
  prompt: 'It is you, Mom!',
  answers: [{
    value: 'Yay!',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L2NhY2hlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL2Rpc3QvbGlua3MuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9yZW5kZXIuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L3N0YXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2Nsb3Nlc3QuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL2xvb3AuanMvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy90YXJyeS5qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oMC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL3B1dHovaW5kZXguanMiLCJzcmMvanMvYXBwL2RhdGEuanMiLCJzcmMvanMvYXBwL2RhdGEvaW5kZXguanMiLCJzcmMvanMvYXBwL2VsZW1lbnRzLmpzIiwic3JjL2pzL2FwcC9naWZmZXIuanMiLCJzcmMvanMvYXBwL2luZGV4LmpzIiwic3JjL2pzL2luZGV4LmpzIiwic3JjL2pzL2xpYi9jb2xvcnMuanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUksT0FBTyxXQUFYOztBQUVBLFNBQU8sTUFBTSxJQUFiLEVBQWtCO0FBQ2hCLFFBQUksYUFBSjtBQUNEOztBQUVELFlBQVUsQ0FBVjtBQUNBLFNBQU8sQ0FBUDtBQUNELENBVkQ7O0FBWUEsSUFBTSxTQUFTLFNBQVQsTUFBUyxHQUFNO0FBQ25CLE1BQUksUUFBUSxVQUFaOztBQUVBLFlBQVUsU0FBViw0QkFDa0IsS0FEbEIsNERBR3dCLEtBSHhCLDZEQU13QixLQU54QiwrQ0FTYSxLQVRiO0FBWUQsQ0FmRDs7a0JBaUJlO0FBQ2IsVUFBUSxNQURLO0FBRWI7QUFGYSxDOzs7Ozs7Ozs7QUNsRGY7Ozs7OztBQUVBOzs7O0FBSUEsSUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFpQjtBQUN2QyxNQUFJLEtBQUssT0FBTyxFQUFQLEdBQVksT0FBTyxFQUFuQixHQUF3QixLQUFqQzs7QUFFQSxNQUFJLENBQUMsRUFBTCxFQUFTOztBQUVULEtBQUcsS0FBSCxFQUFVLEVBQUMsTUFBTSxJQUFQLEVBQWEsT0FBTyxLQUFwQixFQUFWO0FBQ0EsS0FBRyxNQUFILEVBQVcsVUFBWDtBQUNELENBUEQ7O0FBU0EsSUFBTSxNQUFNLHdCQUFTO0FBQ25CLFFBQU07QUFEYSxDQUFULENBQVo7O0FBSUEsSUFBSSxFQUFKLENBQU8sYUFBUCxFQUFzQixnQkFBc0I7QUFBQSxNQUFuQixLQUFtQixRQUFuQixLQUFtQjtBQUFBLE1BQVosS0FBWSxRQUFaLEtBQVk7O0FBQzFDLGtCQUFnQixLQUFoQixFQUF1QixLQUF2QjtBQUNELENBRkQ7O0FBSUEsSUFBSSxFQUFKLENBQU8sa0JBQVAsRUFBMkI7QUFBQSxTQUFNLFVBQVUsT0FBTyxHQUFQLEVBQWhCO0FBQUEsQ0FBM0I7O0FBRUEsT0FBTyxHQUFQLEdBQWEsR0FBYjs7a0JBRWUsRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGNhY2hlID0ge307XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgc2V0OiBmdW5jdGlvbiBzZXQocm91dGUsIHJlcykge1xuICAgIGNhY2hlID0gX2V4dGVuZHMoe30sIGNhY2hlLCBfZGVmaW5lUHJvcGVydHkoe30sIHJvdXRlLCByZXMpKTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQocm91dGUpIHtcbiAgICByZXR1cm4gY2FjaGVbcm91dGVdO1xuICB9LFxuICBnZXRDYWNoZTogZnVuY3Rpb24gZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIGNhY2hlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBpc0R1cGUgPSBmdW5jdGlvbiBpc0R1cGUoc2NyaXB0LCBleGlzdGluZykge1xuICB2YXIgZHVwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGV4aXN0aW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgc2NyaXB0LmlzRXF1YWxOb2RlKGV4aXN0aW5nW2ldKSAmJiBkdXBlcy5wdXNoKGkpO1xuICB9XG5cbiAgcmV0dXJuIGR1cGVzLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAobmV3RG9tLCBleGlzdGluZ0RvbSkge1xuICB2YXIgZXhpc3RpbmcgPSBleGlzdGluZ0RvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG4gIHZhciBzY3JpcHRzID0gbmV3RG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaXNEdXBlKHNjcmlwdHNbaV0sIGV4aXN0aW5nKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB2YXIgc3JjID0gc2NyaXB0c1tpXS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnc3JjJyk7XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICBzLnNyYyA9IHNyYy52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcy5pbm5lckhUTUwgPSBzY3JpcHRzW2ldLmlubmVySFRNTDtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kZWxlZ2F0ZSA9IHJlcXVpcmUoJ2RlbGVnYXRlJyk7XG5cbnZhciBfZGVsZWdhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVsZWdhdGUpO1xuXG52YXIgX29wZXJhdG9yID0gcmVxdWlyZSgnLi9vcGVyYXRvcicpO1xuXG52YXIgX29wZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29wZXJhdG9yKTtcblxudmFyIF91cmwgPSByZXF1aXJlKCcuL3VybCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoX3JlZikge1xuICB2YXIgX3JlZiRyb290ID0gX3JlZi5yb290LFxuICAgICAgcm9vdCA9IF9yZWYkcm9vdCA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQuYm9keSA6IF9yZWYkcm9vdCxcbiAgICAgIF9yZWYkZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uLFxuICAgICAgZHVyYXRpb24gPSBfcmVmJGR1cmF0aW9uID09PSB1bmRlZmluZWQgPyAwIDogX3JlZiRkdXJhdGlvbixcbiAgICAgIF9yZWYkaGFuZGxlcnMgPSBfcmVmLmhhbmRsZXJzLFxuICAgICAgaGFuZGxlcnMgPSBfcmVmJGhhbmRsZXJzID09PSB1bmRlZmluZWQgPyBbXSA6IF9yZWYkaGFuZGxlcnM7XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlXG4gICAqL1xuICB2YXIgb3BlcmF0b3IgPSBuZXcgX29wZXJhdG9yMi5kZWZhdWx0KHtcbiAgICByb290OiByb290LFxuICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICBoYW5kbGVyczogaGFuZGxlcnNcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEJvb3RzdHJhcFxuICAgKi9cbiAgb3BlcmF0b3Iuc2V0U3RhdGUoe1xuICAgIHJvdXRlOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoLFxuICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZVxuICB9KTtcblxuICAvKipcbiAgICogQmluZCBhbmQgdmFsaWRhdGUgYWxsIGxpbmtzXG4gICAqL1xuICAoMCwgX2RlbGVnYXRlMi5kZWZhdWx0KShkb2N1bWVudCwgJ2EnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBhbmNob3IgPSBlLmRlbGVnYXRlVGFyZ2V0O1xuICAgIHZhciBocmVmID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcvJztcblxuICAgIHZhciBpbnRlcm5hbCA9IF91cmwubGluay5pc1NhbWVPcmlnaW4oaHJlZik7XG4gICAgdmFyIGV4dGVybmFsID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCc7XG4gICAgdmFyIGRpc2FibGVkID0gYW5jaG9yLmNsYXNzTGlzdC5jb250YWlucygnbm8tYWpheCcpO1xuICAgIHZhciBpZ25vcmVkID0gb3BlcmF0b3IudmFsaWRhdGUoZSwgaHJlZik7XG4gICAgdmFyIGhhc2ggPSBfdXJsLmxpbmsuaXNIYXNoKGhyZWYpO1xuXG4gICAgaWYgKCFpbnRlcm5hbCB8fCBleHRlcm5hbCB8fCBkaXNhYmxlZCB8fCBpZ25vcmVkIHx8IGhhc2gpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoX3VybC5saW5rLmlzU2FtZVVSTChocmVmKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wZXJhdG9yLmdvKGhyZWYpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAvKipcbiAgICogSGFuZGxlIHBvcHN0YXRlXG4gICAqL1xuICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGhyZWYgPSBlLnRhcmdldC5sb2NhdGlvbi5ocmVmO1xuXG4gICAgaWYgKG9wZXJhdG9yLnZhbGlkYXRlKGUsIGhyZWYpKSB7XG4gICAgICBpZiAoX3VybC5saW5rLmlzSGFzaChocmVmKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9wc3RhdGUgYnlwYXNzZXMgcm91dGVyLCBzbyB3ZVxuICAgICAqIG5lZWQgdG8gdGVsbCBpdCB3aGVyZSB3ZSB3ZW50IHRvXG4gICAgICogd2l0aG91dCBwdXNoaW5nIHN0YXRlXG4gICAgICovXG4gICAgb3BlcmF0b3IuZ28oaHJlZiwgbnVsbCwgdHJ1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIG9wZXJhdG9yO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgYWN0aXZlTGlua3MgPSBbXTtcblxudmFyIHRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZShib29sKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aXZlTGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICBhY3RpdmVMaW5rc1tpXS5jbGFzc0xpc3RbYm9vbCA/ICdhZGQnIDogJ3JlbW92ZSddKCdpcy1hY3RpdmUnKTtcbiAgfVxufTtcblxuLy8gVE9ETyBkbyBJIG5lZWQgdG8gZW1wdHkgdGhlIGFycmF5XG4vLyBvciBjYW4gSSBqdXN0IHJlc2V0IHRvIFtdXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICB0b2dnbGUoZmFsc2UpO1xuXG4gIGFjdGl2ZUxpbmtzLnNwbGljZSgwLCBhY3RpdmVMaW5rcy5sZW5ndGgpO1xuICBhY3RpdmVMaW5rcy5wdXNoLmFwcGx5KGFjdGl2ZUxpbmtzLCBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWYkPVwiJyArIHJvdXRlICsgJ1wiXScpKSkpO1xuXG4gIHRvZ2dsZSh0cnVlKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX25hbm9hamF4ID0gcmVxdWlyZSgnbmFub2FqYXgnKTtcblxudmFyIF9uYW5vYWpheDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9uYW5vYWpheCk7XG5cbnZhciBfbmF2aWdvID0gcmVxdWlyZSgnbmF2aWdvJyk7XG5cbnZhciBfbmF2aWdvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hdmlnbyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24gPSByZXF1aXJlKCdzY3JvbGwtcmVzdG9yYXRpb24nKTtcblxudmFyIF9zY3JvbGxSZXN0b3JhdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxSZXN0b3JhdGlvbik7XG5cbnZhciBfbG9vcCA9IHJlcXVpcmUoJ2xvb3AuanMnKTtcblxudmFyIF9sb29wMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvb3ApO1xuXG52YXIgX3VybCA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbnZhciBfbGlua3MgPSByZXF1aXJlKCcuL2xpbmtzJyk7XG5cbnZhciBfbGlua3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGlua3MpO1xuXG52YXIgX3JlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyJyk7XG5cbnZhciBfcmVuZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlbmRlcik7XG5cbnZhciBfc3RhdGUgPSByZXF1aXJlKCcuL3N0YXRlJyk7XG5cbnZhciBfc3RhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RhdGUpO1xuXG52YXIgX2NhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuXG52YXIgX2NhY2hlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhY2hlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIHJvdXRlciA9IG5ldyBfbmF2aWdvMi5kZWZhdWx0KF91cmwub3JpZ2luKTtcblxudmFyIE9wZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBPcGVyYXRvcihjb25maWcpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3BlcmF0b3IpO1xuXG4gICAgdmFyIGV2ZW50cyA9ICgwLCBfbG9vcDIuZGVmYXVsdCkoKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgLy8gY3JlYXRlIGN1cnJpZWQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgdGhpcy5yZW5kZXIgPSAoMCwgX3JlbmRlcjIuZGVmYXVsdCkoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdCksIGNvbmZpZywgZXZlbnRzLmVtaXQpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBldmVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE9wZXJhdG9yLCBbe1xuICAgIGtleTogJ3N0b3AnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RhcnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRTdGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgICAgcmV0dXJuIF9zdGF0ZTIuZGVmYXVsdC5fc3RhdGU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0U3RhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRTdGF0ZShfcmVmKSB7XG4gICAgICB2YXIgcm91dGUgPSBfcmVmLnJvdXRlLFxuICAgICAgICAgIHRpdGxlID0gX3JlZi50aXRsZTtcblxuICAgICAgX3N0YXRlMi5kZWZhdWx0LnJvdXRlID0gcm91dGUgPT09ICcnID8gJy8nIDogcm91dGU7XG4gICAgICB0aXRsZSA/IF9zdGF0ZTIuZGVmYXVsdC50aXRsZSA9IHRpdGxlIDogbnVsbDtcblxuICAgICAgKDAsIF9saW5rczIuZGVmYXVsdCkoX3N0YXRlMi5kZWZhdWx0LnJvdXRlKTtcblxuICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHJlZlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZXNvbHZlIFVzZSBOYXZpZ28ucmVzb2x2ZSgpLCBieXBhc3MgTmF2aWdvLm5hdmlnYXRlKClcbiAgICAgKlxuICAgICAqIFBvcHN0YXRlIGNoYW5nZXMgdGhlIFVSTCBmb3IgdXMsIHNvIGlmIHdlIHdlcmUgdG9cbiAgICAgKiByb3V0ZXIubmF2aWdhdGUoKSB0byB0aGUgcHJldmlvdXMgbG9jYXRpb24sIGl0IHdvdWxkIHB1c2hcbiAgICAgKiBhIGR1cGxpY2F0ZSByb3V0ZSB0byBoaXN0b3J5IGFuZCB3ZSB3b3VsZCBjcmVhdGUgYSBsb29wLlxuICAgICAqXG4gICAgICogcm91dGVyLnJlc29sdmUoKSBsZXQncyBOYXZpZ28ga25vdyB3ZSd2ZSBtb3ZlZCwgd2l0aG91dFxuICAgICAqIGFsdGVyaW5nIGhpc3RvcnkuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2dvJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ28oaHJlZikge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICAgICAgdmFyIHJlc29sdmUgPSBhcmd1bWVudHNbMl07XG5cbiAgICAgIGlmIChfc3RhdGUyLmRlZmF1bHQucGF1c2VkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2sodGl0bGUpIHtcbiAgICAgICAgdmFyIHJlcyA9IHtcbiAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzb2x2ZSA/IHJvdXRlci5yZXNvbHZlKHJvdXRlKSA6IHJvdXRlci5uYXZpZ2F0ZShyb3V0ZSk7XG5cbiAgICAgICAgX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnJlc3RvcmUoKTtcblxuICAgICAgICBfdGhpcy5zZXRTdGF0ZShyZXMpO1xuXG4gICAgICAgIF90aGlzLmVtaXQoJ3JvdXRlOmFmdGVyJywgcmVzKTtcblxuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjYihyZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgcm91dGUgPSAoMCwgX3VybC5zYW5pdGl6ZSkoaHJlZik7XG5cbiAgICAgIGlmICghcmVzb2x2ZSkge1xuICAgICAgICBfc2Nyb2xsUmVzdG9yYXRpb24yLmRlZmF1bHQuc2F2ZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FjaGVkID0gX2NhY2hlMi5kZWZhdWx0LmdldChyb3V0ZSk7XG5cbiAgICAgIHRoaXMuZW1pdCgncm91dGU6YmVmb3JlJywgeyByb3V0ZTogcm91dGUgfSk7XG5cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKHJvdXRlLCBjYWNoZWQsIGNhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5nZXQocm91dGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQocm91dGUsIGNiKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgcmV0dXJuIF9uYW5vYWpheDIuZGVmYXVsdC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiBfdXJsLm9yaWdpbiArICcvJyArIHJvdXRlXG4gICAgICB9LCBmdW5jdGlvbiAoc3RhdHVzLCByZXMsIHJlcSkge1xuICAgICAgICBpZiAocmVxLnN0YXR1cyA8IDIwMCB8fCByZXEuc3RhdHVzID4gMzAwICYmIHJlcS5zdGF0dXMgIT09IDMwNCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IF91cmwub3JpZ2luICsgJy8nICsgX3N0YXRlMi5kZWZhdWx0LnByZXYucm91dGU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NhY2hlMi5kZWZhdWx0LnNldChyb3V0ZSwgcmVxLnJlc3BvbnNlKTtcblxuICAgICAgICBfdGhpczIucmVuZGVyKHJvdXRlLCByZXEucmVzcG9uc2UsIGNiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3B1c2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXNoKCkge1xuICAgICAgdmFyIHJvdXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgICAgdmFyIHRpdGxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBfc3RhdGUyLmRlZmF1bHQudGl0bGU7XG5cbiAgICAgIGlmICghcm91dGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcm91dGU6IHJvdXRlLCB0aXRsZTogdGl0bGUgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndmFsaWRhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICB2YXIgZXZlbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICB2YXIgaHJlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX3N0YXRlMi5kZWZhdWx0LnJvdXRlO1xuXG4gICAgICB2YXIgcm91dGUgPSAoMCwgX3VybC5zYW5pdGl6ZSkoaHJlZik7XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5oYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodCkpIHtcbiAgICAgICAgICB2YXIgcmVzID0gdFsxXShyb3V0ZSk7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgX3RoaXMzLmVtaXQodFswXSwge1xuICAgICAgICAgICAgICByb3V0ZTogcm91dGUsXG4gICAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHQocm91dGUpO1xuICAgICAgICB9XG4gICAgICB9KS5sZW5ndGggPiAwO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBPcGVyYXRvcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gT3BlcmF0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3RhcnJ5ID0gcmVxdWlyZSgndGFycnkuanMnKTtcblxudmFyIF9ldmFsID0gcmVxdWlyZSgnLi9ldmFsLmpzJyk7XG5cbnZhciBfZXZhbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ldmFsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHBhcnNlciA9IG5ldyB3aW5kb3cuRE9NUGFyc2VyKCk7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgU3RyaW5naWZpZWQgSFRNTFxuICogQHJldHVybiB7b2JqZWN0fSBET00gbm9kZSwgI3BhZ2VcbiAqL1xudmFyIHBhcnNlUmVzcG9uc2UgPSBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlKGh0bWwpIHtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ3RleHQvaHRtbCcpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge29iamVjdH0gcGFnZSBSb290IGFwcGxpY2F0aW9uIERPTSBub2RlXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIER1cmF0aW9uIGFuZCByb290IG5vZGUgc2VsZWN0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGVtaXQgRW1pdHRlciBmdW5jdGlvbiBmcm9tIE9wZXJhdG9yIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWFya3VwIE5ldyBtYXJrdXAgZnJvbSBBSkFYIHJlc3BvbnNlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYiBPcHRpb25hbCBjYWxsYmFja1xuICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChwYWdlLCBfcmVmLCBlbWl0KSB7XG4gIHZhciBkdXJhdGlvbiA9IF9yZWYuZHVyYXRpb24sXG4gICAgICByb290ID0gX3JlZi5yb290O1xuICByZXR1cm4gZnVuY3Rpb24gKHJvdXRlLCBtYXJrdXAsIGNiKSB7XG4gICAgdmFyIHJlcyA9IHBhcnNlUmVzcG9uc2UobWFya3VwKTtcbiAgICB2YXIgdGl0bGUgPSByZXMudGl0bGU7XG5cbiAgICB2YXIgc3RhcnQgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBlbWl0KCd0cmFuc2l0aW9uOmJlZm9yZScsIHsgcm91dGU6IHJvdXRlIH0pO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgIHBhZ2Uuc3R5bGUuaGVpZ2h0ID0gcGFnZS5jbGllbnRIZWlnaHQgKyAncHgnO1xuICAgIH0pO1xuXG4gICAgdmFyIHJlbmRlciA9ICgwLCBfdGFycnkudGFycnkpKGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhZ2UuaW5uZXJIVE1MID0gcmVzLnF1ZXJ5U2VsZWN0b3Iocm9vdCkuaW5uZXJIVE1MO1xuICAgICAgKDAsIF9ldmFsMi5kZWZhdWx0KShyZXMsIGRvY3VtZW50KTtcbiAgICB9KTtcblxuICAgIHZhciBlbmQgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBjYih0aXRsZSk7XG4gICAgICBwYWdlLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgIGVtaXQoJ3RyYW5zaXRpb246YWZ0ZXInLCB7IHJvdXRlOiByb3V0ZSB9KTtcbiAgICB9KTtcblxuICAgICgwLCBfdGFycnkucXVldWUpKHN0YXJ0KDApLCByZW5kZXIoZHVyYXRpb24pLCBlbmQoMCkpKCk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgcGF1c2VkOiBmYWxzZSxcbiAgX3N0YXRlOiB7XG4gICAgcm91dGU6ICcnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBwcmV2OiB7XG4gICAgICByb3V0ZTogJy8nLFxuICAgICAgdGl0bGU6ICcnXG4gICAgfVxuICB9LFxuICBnZXQgcm91dGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnJvdXRlO1xuICB9LFxuICBzZXQgcm91dGUobG9jKSB7XG4gICAgdGhpcy5fc3RhdGUucHJldi5yb3V0ZSA9IHRoaXMucm91dGU7XG4gICAgdGhpcy5fc3RhdGUucm91dGUgPSBsb2M7XG4gIH0sXG4gIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUudGl0bGU7XG4gIH0sXG4gIHNldCB0aXRsZSh2YWwpIHtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB0aGlzLl9zdGF0ZS50aXRsZSA9IHZhbDtcbiAgfSxcbiAgZ2V0IHByZXYoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnByZXY7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGdldE9yaWdpbiA9IGZ1bmN0aW9uIGdldE9yaWdpbihsb2NhdGlvbikge1xuICB2YXIgcHJvdG9jb2wgPSBsb2NhdGlvbi5wcm90b2NvbCxcbiAgICAgIGhvc3QgPSBsb2NhdGlvbi5ob3N0O1xuXG4gIHJldHVybiBwcm90b2NvbCArICcvLycgKyBob3N0O1xufTtcblxudmFyIHBhcnNlVVJMID0gZnVuY3Rpb24gcGFyc2VVUkwodXJsKSB7XG4gIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBhLmhyZWYgPSB1cmw7XG4gIHJldHVybiBhO1xufTtcblxudmFyIG9yaWdpbiA9IGV4cG9ydHMub3JpZ2luID0gZ2V0T3JpZ2luKHdpbmRvdy5sb2NhdGlvbik7XG5cbnZhciBvcmlnaW5SZWdFeCA9IG5ldyBSZWdFeHAob3JpZ2luKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFJhdyBVUkwgdG8gcGFyc2VcbiAqIEByZXR1cm4ge3N0cmluZ30gVVJMIHNhbnMgb3JpZ2luIGFuZCBzYW5zIGxlYWRpbmcgc2xhc2hcbiAqL1xudmFyIHNhbml0aXplID0gZXhwb3J0cy5zYW5pdGl6ZSA9IGZ1bmN0aW9uIHNhbml0aXplKHVybCkge1xuICB2YXIgcm91dGUgPSB1cmwucmVwbGFjZShvcmlnaW5SZWdFeCwgJycpO1xuICByZXR1cm4gcm91dGUubWF0Y2goL15cXC8vKSA/IHJvdXRlLnJlcGxhY2UoL1xcL3sxfS8sICcnKSA6IHJvdXRlOyAvLyByZW1vdmUgLyBhbmQgcmV0dXJuXG59O1xuXG52YXIgbGluayA9IGV4cG9ydHMubGluayA9IHtcbiAgaXNTYW1lT3JpZ2luOiBmdW5jdGlvbiBpc1NhbWVPcmlnaW4oaHJlZikge1xuICAgIHJldHVybiBvcmlnaW4gPT09IGdldE9yaWdpbihwYXJzZVVSTChocmVmKSk7XG4gIH0sXG4gIGlzSGFzaDogZnVuY3Rpb24gaXNIYXNoKGhyZWYpIHtcbiAgICByZXR1cm4gKC8jLy50ZXN0KGhyZWYpXG4gICAgKTtcbiAgfSxcbiAgaXNTYW1lVVJMOiBmdW5jdGlvbiBpc1NhbWVVUkwoaHJlZikge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uc2VhcmNoID09PSBwYXJzZVVSTChocmVmKS5zZWFyY2ggJiYgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBwYXJzZVVSTChocmVmKS5wYXRobmFtZTtcbiAgfVxufTsiLCJ2YXIgRE9DVU1FTlRfTk9ERV9UWVBFID0gOTtcblxuLyoqXG4gKiBBIHBvbHlmaWxsIGZvciBFbGVtZW50Lm1hdGNoZXMoKVxuICovXG5pZiAodHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgdmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XG5cbiAgICBwcm90by5tYXRjaGVzID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5vTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgY2xvc2VzdCBwYXJlbnQgdGhhdCBtYXRjaGVzIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IERPQ1VNRU5UX05PREVfVFlQRSkge1xuICAgICAgICBpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb3Nlc3Q7XG4iLCJ2YXIgY2xvc2VzdCA9IHJlcXVpcmUoJy4vY2xvc2VzdCcpO1xuXG4vKipcbiAqIERlbGVnYXRlcyBldmVudCB0byBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBkZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBjbG9zZXN0IG1hdGNoIGFuZCBpbnZva2VzIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBsaXN0ZW5lcihlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IpO1xuXG4gICAgICAgIGlmIChlLmRlbGVnYXRlVGFyZ2V0KSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsZW1lbnQsIGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG8gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB7fTtcblxuICB2YXIgb24gPSBmdW5jdGlvbiBvbihlKSB7XG4gICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgaWYgKCFjYikgcmV0dXJuO1xuICAgIGxpc3RlbmVyc1tlXSA9IGxpc3RlbmVyc1tlXSB8fCB7IHF1ZXVlOiBbXSB9O1xuICAgIGxpc3RlbmVyc1tlXS5xdWV1ZS5wdXNoKGNiKTtcbiAgfTtcblxuICB2YXIgZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZSkge1xuICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgdmFyIGl0ZW1zID0gbGlzdGVuZXJzW2VdID8gbGlzdGVuZXJzW2VdLnF1ZXVlIDogZmFsc2U7XG4gICAgaXRlbXMgJiYgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIGkoZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBvLCB7XG4gICAgZW1pdDogZW1pdCxcbiAgICBvbjogb25cbiAgfSk7XG59OyIsIi8vIEJlc3QgcGxhY2UgdG8gZmluZCBpbmZvcm1hdGlvbiBvbiBYSFIgZmVhdHVyZXMgaXM6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3RcblxudmFyIHJlcWZpZWxkcyA9IFtcbiAgJ3Jlc3BvbnNlVHlwZScsICd3aXRoQ3JlZGVudGlhbHMnLCAndGltZW91dCcsICdvbnByb2dyZXNzJ1xuXVxuXG4vLyBTaW1wbGUgYW5kIHNtYWxsIGFqYXggZnVuY3Rpb25cbi8vIFRha2VzIGEgcGFyYW1ldGVycyBvYmplY3QgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb25cbi8vIFBhcmFtZXRlcnM6XG4vLyAgLSB1cmw6IHN0cmluZywgcmVxdWlyZWRcbi8vICAtIGhlYWRlcnM6IG9iamVjdCBvZiBge2hlYWRlcl9uYW1lOiBoZWFkZXJfdmFsdWUsIC4uLn1gXG4vLyAgLSBib2R5OlxuLy8gICAgICArIHN0cmluZyAoc2V0cyBjb250ZW50IHR5cGUgdG8gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgaWYgbm90IHNldCBpbiBoZWFkZXJzKVxuLy8gICAgICArIEZvcm1EYXRhIChkb2Vzbid0IHNldCBjb250ZW50IHR5cGUgc28gdGhhdCBicm93c2VyIHdpbGwgc2V0IGFzIGFwcHJvcHJpYXRlKVxuLy8gIC0gbWV0aG9kOiAnR0VUJywgJ1BPU1QnLCBldGMuIERlZmF1bHRzIHRvICdHRVQnIG9yICdQT1NUJyBiYXNlZCBvbiBib2R5XG4vLyAgLSBjb3JzOiBJZiB5b3VyIHVzaW5nIGNyb3NzLW9yaWdpbiwgeW91IHdpbGwgbmVlZCB0aGlzIHRydWUgZm9yIElFOC05XG4vL1xuLy8gVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgb250byB0aGUgeGhyIG9iamVjdC5cbi8vIElNUE9SVEFOVCBOT1RFOiBUaGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb21wYXRpYmlsaXR5IGNoZWNraW5nLlxuLy8gIC0gcmVzcG9uc2VUeXBlOiBzdHJpbmcsIHZhcmlvdXMgY29tcGF0YWJpbGl0eSwgc2VlIHhociBkb2NzIGZvciBlbnVtIG9wdGlvbnNcbi8vICAtIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbiwgSUUxMCssIENPUlMgb25seVxuLy8gIC0gdGltZW91dDogbG9uZywgbXMgdGltZW91dCwgSUU4K1xuLy8gIC0gb25wcm9ncmVzczogY2FsbGJhY2ssIElFMTArXG4vL1xuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gcHJvdG90eXBlOlxuLy8gIC0gc3RhdHVzQ29kZSBmcm9tIHJlcXVlc3Rcbi8vICAtIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlc3BvbnNlVHlwZSBzZXQgYW5kIHN1cHBvcnRlZCBieSBicm93c2VyLCB0aGlzIGlzIGFuIG9iamVjdCBvZiBzb21lIHR5cGUgKHNlZSBkb2NzKVxuLy8gICAgKyBvdGhlcndpc2UgaWYgcmVxdWVzdCBjb21wbGV0ZWQsIHRoaXMgaXMgdGhlIHN0cmluZyB0ZXh0IG9mIHRoZSByZXNwb25zZVxuLy8gICAgKyBpZiByZXF1ZXN0IGlzIGFib3J0ZWQsIHRoaXMgaXMgXCJBYm9ydFwiXG4vLyAgICArIGlmIHJlcXVlc3QgdGltZXMgb3V0LCB0aGlzIGlzIFwiVGltZW91dFwiXG4vLyAgICArIGlmIHJlcXVlc3QgZXJyb3JzIGJlZm9yZSBjb21wbGV0aW5nIChwcm9iYWJseSBhIENPUlMgaXNzdWUpLCB0aGlzIGlzIFwiRXJyb3JcIlxuLy8gIC0gcmVxdWVzdCBvYmplY3Rcbi8vXG4vLyBSZXR1cm5zIHRoZSByZXF1ZXN0IG9iamVjdC4gU28geW91IGNhbiBjYWxsIC5hYm9ydCgpIG9yIG90aGVyIG1ldGhvZHNcbi8vXG4vLyBERVBSRUNBVElPTlM6XG4vLyAgLSBQYXNzaW5nIGEgc3RyaW5nIGluc3RlYWQgb2YgdGhlIHBhcmFtcyBvYmplY3QgaGFzIGJlZW4gcmVtb3ZlZCFcbi8vXG5leHBvcnRzLmFqYXggPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAvLyBBbnkgdmFyaWFibGUgdXNlZCBtb3JlIHRoYW4gb25jZSBpcyB2YXInZCBoZXJlIGJlY2F1c2VcbiAgLy8gbWluaWZpY2F0aW9uIHdpbGwgbXVuZ2UgdGhlIHZhcmlhYmxlcyB3aGVyZWFzIGl0IGNhbid0IG11bmdlXG4gIC8vIHRoZSBvYmplY3QgYWNjZXNzLlxuICB2YXIgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzIHx8IHt9XG4gICAgLCBib2R5ID0gcGFyYW1zLmJvZHlcbiAgICAsIG1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgKGJvZHkgPyAnUE9TVCcgOiAnR0VUJylcbiAgICAsIGNhbGxlZCA9IGZhbHNlXG5cbiAgdmFyIHJlcSA9IGdldFJlcXVlc3QocGFyYW1zLmNvcnMpXG5cbiAgZnVuY3Rpb24gY2Ioc3RhdHVzQ29kZSwgcmVzcG9uc2VUZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IHN0YXR1c0NvZGUgOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICByZXEuc3RhdHVzID09PSAwID8gXCJFcnJvclwiIDogKHJlcS5yZXNwb25zZSB8fCByZXEucmVzcG9uc2VUZXh0IHx8IHJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgIHJlcSlcbiAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSlcblxuICB2YXIgc3VjY2VzcyA9IHJlcS5vbmxvYWQgPSBjYigyMDApXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSBzdWNjZXNzKClcbiAgfVxuICByZXEub25lcnJvciA9IGNiKG51bGwsICdFcnJvcicpXG4gIHJlcS5vbnRpbWVvdXQgPSBjYihudWxsLCAnVGltZW91dCcpXG4gIHJlcS5vbmFib3J0ID0gY2IobnVsbCwgJ0Fib3J0JylcblxuICBpZiAoYm9keSkge1xuICAgIHNldERlZmF1bHQoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKVxuXG4gICAgaWYgKCFnbG9iYWwuRm9ybURhdGEgfHwgIShib2R5IGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSkge1xuICAgICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcWZpZWxkcy5sZW5ndGgsIGZpZWxkOyBpIDwgbGVuOyBpKyspIHtcbiAgICBmaWVsZCA9IHJlcWZpZWxkc1tpXVxuICAgIGlmIChwYXJhbXNbZmllbGRdICE9PSB1bmRlZmluZWQpXG4gICAgICByZXFbZmllbGRdID0gcGFyYW1zW2ZpZWxkXVxuICB9XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gaGVhZGVycylcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgaGVhZGVyc1tmaWVsZF0pXG5cbiAgcmVxLnNlbmQoYm9keSlcblxuICByZXR1cm4gcmVxXG59XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoY29ycykge1xuICAvLyBYRG9tYWluUmVxdWVzdCBpcyBvbmx5IHdheSB0byBkbyBDT1JTIGluIElFIDggYW5kIDlcbiAgLy8gQnV0IFhEb21haW5SZXF1ZXN0IGlzbid0IHN0YW5kYXJkcy1jb21wYXRpYmxlXG4gIC8vIE5vdGFibHksIGl0IGRvZXNuJ3QgYWxsb3cgY29va2llcyB0byBiZSBzZW50IG9yIHNldCBieSBzZXJ2ZXJzXG4gIC8vIElFIDEwKyBpcyBzdGFuZGFyZHMtY29tcGF0aWJsZSBpbiBpdHMgWE1MSHR0cFJlcXVlc3RcbiAgLy8gYnV0IElFIDEwIGNhbiBzdGlsbCBoYXZlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB1c2UgaXRcbiAgaWYgKGNvcnMgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICEvTVNJRSAxLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3RcbiAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdClcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHQob2JqLCBrZXksIHZhbHVlKSB7XG4gIG9ialtrZXldID0gb2JqW2tleV0gfHwgdmFsdWVcbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiTmF2aWdvXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdHZhciBQQVJBTUVURVJfUkVHRVhQID0gLyhbOipdKShcXHcrKS9nO1xuXHR2YXIgV0lMRENBUkRfUkVHRVhQID0gL1xcKi9nO1xuXHR2YXIgUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFAgPSAnKFteXFwvXSspJztcblx0dmFyIFJFUExBQ0VfV0lMRENBUkQgPSAnKD86LiopJztcblx0dmFyIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCA9ICcoPzpcXC8kfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZ2V0VXJsRGVwdGgodXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXC8kLywgJycpLnNwbGl0KCcvJykubGVuZ3RoO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBjb21wYXJlVXJsRGVwdGgodXJsQSwgdXJsQikge1xuXHQgIHJldHVybiBnZXRVcmxEZXB0aCh1cmxBKSA8IGdldFVybERlcHRoKHVybEIpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwpIHtcblx0ICB2YXIgcm91dGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHJldHVybiByb3V0ZXMubWFwKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIF9yZXBsYWNlRHluYW1pY1VSTFBhciA9IHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHZhciByZWdleHAgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucmVnZXhwO1xuXHQgICAgdmFyIHBhcmFtTmFtZXMgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucGFyYW1OYW1lcztcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXhwKTtcblx0ICAgIHZhciBwYXJhbXMgPSByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgcGFyYW1OYW1lcyk7XG5cdFxuXHQgICAgcmV0dXJuIG1hdGNoID8geyBtYXRjaDogbWF0Y2gsIHJvdXRlOiByb3V0ZSwgcGFyYW1zOiBwYXJhbXMgfSA6IGZhbHNlO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbiAobSkge1xuXHQgICAgcmV0dXJuIG07XG5cdCAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIG1hdGNoKHVybCwgcm91dGVzKSB7XG5cdCAgcmV0dXJuIGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzKVswXSB8fCBmYWxzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcm9vdCh1cmwsIHJvdXRlcykge1xuXHQgIHZhciBtYXRjaGVkID0gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIHUgPSBjbGVhbihyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgcmV0dXJuIHUgIT09ICcnICYmIHUgIT09ICcqJztcblx0ICB9KSk7XG5cdCAgdmFyIGZhbGxiYWNrVVJMID0gY2xlYW4odXJsKTtcblx0XG5cdCAgaWYgKG1hdGNoZWQubGVuZ3RoID4gMCkge1xuXHQgICAgcmV0dXJuIG1hdGNoZWQubWFwKGZ1bmN0aW9uIChtKSB7XG5cdCAgICAgIHJldHVybiBjbGVhbih1cmwuc3Vic3RyKDAsIG0ubWF0Y2guaW5kZXgpKTtcblx0ICAgIH0pLnJlZHVjZShmdW5jdGlvbiAocm9vdCwgY3VycmVudCkge1xuXHQgICAgICByZXR1cm4gY3VycmVudC5sZW5ndGggPCByb290Lmxlbmd0aCA/IGN1cnJlbnQgOiByb290O1xuXHQgICAgfSwgZmFsbGJhY2tVUkwpO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsbGJhY2tVUkw7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCkge1xuXHQgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZW1vdmVHRVRQYXJhbXModXJsKSB7XG5cdCAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXD8oLiopPyQvLCAnJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIE5hdmlnbyhyLCB1c2VIYXNoKSB7XG5cdCAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgdGhpcy5yb290ID0gdXNlSGFzaCAmJiByID8gci5yZXBsYWNlKC9cXC8kLywgJy8jJykgOiByIHx8IG51bGw7XG5cdCAgdGhpcy5fdXNlSGFzaCA9IHVzZUhhc2g7XG5cdCAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG5cdCAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG5cdCAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSBudWxsO1xuXHQgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX29rID0gIXVzZUhhc2ggJiYgaXNQdXNoU3RhdGVBdmFpbGFibGUoKTtcblx0ICB0aGlzLl9saXN0ZW4oKTtcblx0ICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXHR9XG5cdFxuXHROYXZpZ28ucHJvdG90eXBlID0ge1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIG1hdGNoOiBtYXRjaCxcblx0ICAgIHJvb3Q6IHJvb3QsXG5cdCAgICBjbGVhbjogY2xlYW5cblx0ICB9LFxuXHQgIG5hdmlnYXRlOiBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoLCBhYnNvbHV0ZSkge1xuXHQgICAgdmFyIHRvO1xuXHRcblx0ICAgIHBhdGggPSBwYXRoIHx8ICcnO1xuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHRvID0gKCFhYnNvbHV0ZSA/IHRoaXMuX2dldFJvb3QoKSArICcvJyA6ICcnKSArIGNsZWFuKHBhdGgpO1xuXHQgICAgICB0byA9IHRvLnJlcGxhY2UoLyhbXjpdKShcXC97Mix9KS9nLCAnJDEvJyk7XG5cdCAgICAgIGhpc3RvcnlbdGhpcy5fcGF1c2VkID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sICcnLCB0byk7XG5cdCAgICAgIHRoaXMucmVzb2x2ZSgpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyMoLiopJC8sICcnKSArICcjJyArIHBhdGg7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG9uOiBmdW5jdGlvbiBvbigpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICBpZiAoYXJncy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICB9IGVsc2UgaWYgKF90eXBlb2YoYXJnc1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHZhciBvcmRlcmVkUm91dGVzID0gT2JqZWN0LmtleXMoYXJnc1swXSkuc29ydChjb21wYXJlVXJsRGVwdGgpO1xuXHRcblx0ICAgICAgb3JkZXJlZFJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgICAgIF90aGlzLl9hZGQocm91dGUsIGFyZ3NbMF1bcm91dGVdKTtcblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gYXJnc1swXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgbm90Rm91bmQ6IGZ1bmN0aW9uIG5vdEZvdW5kKGhhbmRsZXIpIHtcblx0ICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IGhhbmRsZXI7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKGN1cnJlbnQpIHtcblx0ICAgIHZhciBoYW5kbGVyLCBtO1xuXHQgICAgdmFyIHVybCA9IChjdXJyZW50IHx8IHRoaXMuX2NMb2MoKSkucmVwbGFjZSh0aGlzLl9nZXRSb290KCksICcnKTtcblx0XG5cdCAgICBpZiAodGhpcy5fcGF1c2VkIHx8IHVybCA9PT0gdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLl91c2VIYXNoKSB7XG5cdCAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvIy8sICcvJyk7XG5cdCAgICB9XG5cdCAgICB1cmwgPSByZW1vdmVHRVRQYXJhbXModXJsKTtcblx0ICAgIG0gPSBtYXRjaCh1cmwsIHRoaXMuX3JvdXRlcyk7XG5cdFxuXHQgICAgaWYgKG0pIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIGhhbmRsZXIgPSBtLnJvdXRlLmhhbmRsZXI7XG5cdCAgICAgIG0ucm91dGUucm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgPyBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KG0ubWF0Y2guc2xpY2UoMSwgbS5tYXRjaC5sZW5ndGgpKSkgOiBoYW5kbGVyKG0ucGFyYW1zKTtcblx0ICAgICAgcmV0dXJuIG07XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX2RlZmF1bHRIYW5kbGVyICYmICh1cmwgPT09ICcnIHx8IHVybCA9PT0gJy8nKSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIoKTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX25vdEZvdW5kSGFuZGxlcikge1xuXHQgICAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9LFxuXHQgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cdCAgICBjbGVhclRpbWVvdXQodGhpcy5fbGlzdGVubmluZ0ludGVydmFsKTtcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm9ucG9wc3RhdGUgPSBudWxsIDogbnVsbDtcblx0ICB9LFxuXHQgIHVwZGF0ZVBhZ2VMaW5rczogZnVuY3Rpb24gdXBkYXRlUGFnZUxpbmtzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdFxuXHQgICAgdGhpcy5fZmluZExpbmtzKCkuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHQgICAgICBpZiAoIWxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCkge1xuXHQgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XG5cdCAgICAgICAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZCkge1xuXHQgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIHNlbGYubmF2aWdhdGUoY2xlYW4obG9jYXRpb24pKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgICBsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShuYW1lKSB7XG5cdCAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHJldHVybiB0aGlzLl9yb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHJvdXRlKSB7XG5cdCAgICAgIHZhciBrZXk7XG5cdFxuXHQgICAgICBpZiAocm91dGUubmFtZSA9PT0gbmFtZSkge1xuXHQgICAgICAgIHJlc3VsdCA9IHJvdXRlLnJvdXRlO1xuXHQgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc6JyArIGtleSwgZGF0YVtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sICcnKTtcblx0ICB9LFxuXHQgIGxpbms6IGZ1bmN0aW9uIGxpbmsocGF0aCkge1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFJvb3QoKSArIHBhdGg7XG5cdCAgfSxcblx0ICBwYXVzZTogZnVuY3Rpb24gcGF1c2Uoc3RhdHVzKSB7XG5cdCAgICB0aGlzLl9wYXVzZWQgPSBzdGF0dXM7XG5cdCAgfSxcblx0ICBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGU6IGZ1bmN0aW9uIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZSgpIHtcblx0ICAgIGlmICghaXNQdXNoU3RhdGVBdmFpbGFibGUoKSkge1xuXHQgICAgICB0aGlzLmRlc3Ryb3koKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9hZGQ6IGZ1bmN0aW9uIF9hZGQocm91dGUpIHtcblx0ICAgIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBpZiAoKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihoYW5kbGVyKSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyLnVzZXMsIG5hbWU6IGhhbmRsZXIuYXMgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLl9hZGQ7XG5cdCAgfSxcblx0ICBfZ2V0Um9vdDogZnVuY3Rpb24gX2dldFJvb3QoKSB7XG5cdCAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSByZXR1cm4gdGhpcy5yb290O1xuXHQgICAgdGhpcy5yb290ID0gcm9vdCh0aGlzLl9jTG9jKCksIHRoaXMuX3JvdXRlcyk7XG5cdCAgICByZXR1cm4gdGhpcy5yb290O1xuXHQgIH0sXG5cdCAgX2xpc3RlbjogZnVuY3Rpb24gX2xpc3RlbigpIHtcblx0ICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpczIucmVzb2x2ZSgpO1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgY2FjaGVkID0gX3RoaXMyLl9jTG9jKCksXG5cdCAgICAgICAgICAgIGN1cnJlbnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgICAgIF9jaGVjayA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgICAgX2NoZWNrID0gZnVuY3Rpb24gY2hlY2soKSB7XG5cdCAgICAgICAgICBjdXJyZW50ID0gX3RoaXMyLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzMi5yZXNvbHZlKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBfdGhpczIuX2xpc3Rlbm5pbmdJbnRlcnZhbCA9IHNldFRpbWVvdXQoX2NoZWNrLCAyMDApO1xuXHQgICAgICAgIH07XG5cdCAgICAgICAgX2NoZWNrKCk7XG5cdCAgICAgIH0pKCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfY0xvYzogZnVuY3Rpb24gX2NMb2MoKSB7XG5cdCAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0sXG5cdCAgX2ZpbmRMaW5rczogZnVuY3Rpb24gX2ZpbmRMaW5rcygpIHtcblx0ICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5hdmlnb10nKSk7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTmF2aWdvO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmF2aWdvLmpzLm1hcCIsIid1c2Ugc3RyaWN0JztPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywnX19lc01vZHVsZScse3ZhbHVlOiEwfSk7dmFyIHNjcm9sbD1mdW5jdGlvbihhKXtyZXR1cm4gd2luZG93LnNjcm9sbFRvKDAsYSl9LHN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGhpc3Rvcnkuc3RhdGU/aGlzdG9yeS5zdGF0ZS5zY3JvbGxQb3NpdGlvbjowfSxzYXZlPWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOm51bGw7d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtzY3JvbGxQb3NpdGlvbjphfHx3aW5kb3cucGFnZVlPZmZzZXR8fHdpbmRvdy5zY3JvbGxZfSwnJyl9LHJlc3RvcmU9ZnVuY3Rpb24oKXt2YXIgYT0wPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1swXSE9PXZvaWQgMD9hcmd1bWVudHNbMF06bnVsbCxiPXN0YXRlKCk7YT9hKGIpOnNjcm9sbChiKX0saW5pdD1mdW5jdGlvbigpeydzY3JvbGxSZXN0b3JhdGlvbidpbiBoaXN0b3J5JiYoaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbj0nbWFudWFsJyxzY3JvbGwoc3RhdGUoKSksd2luZG93Lm9uYmVmb3JldW5sb2FkPWZ1bmN0aW9uKCl7cmV0dXJuIHNhdmUoKX0pfTtleHBvcnRzLmRlZmF1bHQ9J3VuZGVmaW5lZCc9PXR5cGVvZiB3aW5kb3c/e306e2luaXQ6aW5pdCxzYXZlOnNhdmUscmVzdG9yZTpyZXN0b3JlLHN0YXRlOnN0YXRlfTsiLCJmdW5jdGlvbiBuZXh0KGFyZ3Mpe1xuICBhcmdzLmxlbmd0aCA+IDAgJiYgYXJncy5zaGlmdCgpLmFwcGx5KHRoaXMsIGFyZ3MpXG59XG5cbmZ1bmN0aW9uIHJ1bihjYiwgYXJncyl7XG4gIGNiKClcbiAgbmV4dChhcmdzKVxufVxuXG5mdW5jdGlvbiB0YXJyeShjYiwgZGVsYXkpe1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgIHZhciBvdmVycmlkZSA9IGFyZ3NbMF1cbiAgICBcbiAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBvdmVycmlkZSl7XG4gICAgICByZXR1cm4gdGFycnkoY2IsIG92ZXJyaWRlKVxuICAgIH1cbiAgICBcbiAgICAnbnVtYmVyJyA9PT0gdHlwZW9mIGRlbGF5ID8gKFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBydW4oY2IsIGFyZ3MpXG4gICAgICB9LCBkZWxheSkgXG4gICAgKSA6IChcbiAgICAgIHJ1bihjYiwgYXJncylcbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gcXVldWUoKXtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgcmV0dXJuIHRhcnJ5KGZ1bmN0aW9uKCl7XG4gICAgbmV4dChhcmdzLnNsaWNlKDApKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB7XG4gIHRhcnJ5OiB0YXJyeSxcbiAgcXVldWU6IHF1ZXVlXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3RyYW5zZm9ybVByb3BzID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0tcHJvcHMnKTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFuc2Zvcm1Qcm9wcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBoID0gZnVuY3Rpb24gaCh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID8gYXBwbHlQcm9wcyh0YWcpKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgOiBhcHBlbmRDaGlsZHJlbih0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5cbnZhciBpc09iaiA9IGZ1bmN0aW9uIGlzT2JqKG8pIHtcbiAgcmV0dXJuIG8gIT09IG51bGwgJiYgKHR5cGVvZiBvID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvKSkgPT09ICdvYmplY3QnO1xufTtcblxudmFyIGlzUHJvcHMgPSBmdW5jdGlvbiBpc1Byb3BzKGFyZykge1xuICByZXR1cm4gaXNPYmooYXJnKSAmJiAhKGFyZyBpbnN0YW5jZW9mIEVsZW1lbnQpO1xufTtcblxudmFyIGFwcGx5UHJvcHMgPSBmdW5jdGlvbiBhcHBseVByb3BzKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIGgodGFnKShPYmplY3QuYXNzaWduKHt9LCBwcm9wcywgYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbCA9IGgodGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICB2YXIgcCA9ICgwLCBfdHJhbnNmb3JtUHJvcHMyLmRlZmF1bHQpKHByb3BzKTtcbiAgICAgIE9iamVjdC5rZXlzKHApLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKC9eb24vLnRlc3QoaykpIHtcbiAgICAgICAgICBlbFtrXSA9IHBba107XG4gICAgICAgIH0gZWxzZSBpZiAoayA9PT0gJ19faHRtbCcpIHtcbiAgICAgICAgICBlbC5pbm5lckhUTUwgPSBwW2tdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrLCBwW2tdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgfTtcbn07XG5cbnZhciBhcHBlbmRDaGlsZHJlbiA9IGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjaGlsZHJlbiA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgY2hpbGRyZW5bX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgaW5zdGFuY2VvZiBFbGVtZW50ID8gYyA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGMpO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBlbC5hcHBlbmRDaGlsZChjKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWw7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBoOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBrZWJhYiA9IGV4cG9ydHMua2ViYWIgPSBmdW5jdGlvbiBrZWJhYihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgcmV0dXJuICctJyArIGcudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59O1xuXG52YXIgcGFyc2VWYWx1ZSA9IGV4cG9ydHMucGFyc2VWYWx1ZSA9IGZ1bmN0aW9uIHBhcnNlVmFsdWUocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IGFkZFB4KHByb3ApKHZhbCkgOiB2YWw7XG4gIH07XG59O1xuXG52YXIgdW5pdGxlc3NQcm9wZXJ0aWVzID0gZXhwb3J0cy51bml0bGVzc1Byb3BlcnRpZXMgPSBbJ2xpbmVIZWlnaHQnLCAnZm9udFdlaWdodCcsICdvcGFjaXR5JywgJ3pJbmRleCdcbi8vIFByb2JhYmx5IG5lZWQgYSBmZXcgbW9yZS4uLlxuXTtcblxudmFyIGFkZFB4ID0gZXhwb3J0cy5hZGRQeCA9IGZ1bmN0aW9uIGFkZFB4KHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdW5pdGxlc3NQcm9wZXJ0aWVzLmluY2x1ZGVzKHByb3ApID8gdmFsIDogdmFsICsgJ3B4JztcbiAgfTtcbn07XG5cbnZhciBmaWx0ZXJOdWxsID0gZXhwb3J0cy5maWx0ZXJOdWxsID0gZnVuY3Rpb24gZmlsdGVyTnVsbChvYmopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV0gIT09IG51bGw7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlRGVjID0gZXhwb3J0cy5jcmVhdGVEZWMgPSBmdW5jdGlvbiBjcmVhdGVEZWMoc3R5bGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2ViYWIoa2V5KSArICc6JyArIHBhcnNlVmFsdWUoa2V5KShzdHlsZVtrZXldKTtcbiAgfTtcbn07XG5cbnZhciBzdHlsZVRvU3RyaW5nID0gZXhwb3J0cy5zdHlsZVRvU3RyaW5nID0gZnVuY3Rpb24gc3R5bGVUb1N0cmluZyhzdHlsZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGUpLmZpbHRlcihmaWx0ZXJOdWxsKHN0eWxlKSkubWFwKGNyZWF0ZURlYyhzdHlsZSkpLmpvaW4oJzsnKTtcbn07XG5cbnZhciBpc1N0eWxlT2JqZWN0ID0gZXhwb3J0cy5pc1N0eWxlT2JqZWN0ID0gZnVuY3Rpb24gaXNTdHlsZU9iamVjdChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPT09ICdzdHlsZScgJiYgcHJvcHNba2V5XSAhPT0gbnVsbCAmJiBfdHlwZW9mKHByb3BzW2tleV0pID09PSAnb2JqZWN0JztcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVTdHlsZSA9IGV4cG9ydHMuY3JlYXRlU3R5bGUgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZShwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBpc1N0eWxlT2JqZWN0KHByb3BzKShrZXkpID8gc3R5bGVUb1N0cmluZyhwcm9wc1trZXldKSA6IHByb3BzW2tleV07XG4gIH07XG59O1xuXG52YXIgcmVkdWNlUHJvcHMgPSBleHBvcnRzLnJlZHVjZVByb3BzID0gZnVuY3Rpb24gcmVkdWNlUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhLCBrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhLCBfZGVmaW5lUHJvcGVydHkoe30sIGtleSwgY3JlYXRlU3R5bGUocHJvcHMpKGtleSkpKTtcbiAgfTtcbn07XG5cbnZhciB0cmFuc2Zvcm1Qcm9wcyA9IGV4cG9ydHMudHJhbnNmb3JtUHJvcHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShyZWR1Y2VQcm9wcyhwcm9wcyksIHt9KTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zZm9ybVByb3BzOyIsImNvbnN0IGNyZWF0ZUJhciA9IChyb290LCBjbGFzc25hbWUpID0+IHtcbiAgbGV0IG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBsZXQgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgby5jbGFzc05hbWUgPSBjbGFzc25hbWUgXG4gIGkuY2xhc3NOYW1lID0gYCR7Y2xhc3NuYW1lfV9faW5uZXJgXG4gIG8uYXBwZW5kQ2hpbGQoaSlcbiAgcm9vdC5pbnNlcnRCZWZvcmUobywgcm9vdC5jaGlsZHJlblswXSlcblxuICByZXR1cm4ge1xuICAgIG91dGVyOiBvLFxuICAgIGlubmVyOiBpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKHJvb3QgPSBkb2N1bWVudC5ib2R5LCBvcHRzID0ge30pID0+IHtcbiAgbGV0IHRpbWVyID0gbnVsbFxuICBjb25zdCBzcGVlZCA9IG9wdHMuc3BlZWQgfHwgMjAwXG4gIGNvbnN0IGNsYXNzbmFtZSA9IG9wdHMuY2xhc3NuYW1lIHx8ICdwdXR6J1xuICBjb25zdCB0cmlja2xlID0gb3B0cy50cmlja2xlIHx8IDUgXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IDBcbiAgfVxuXG4gIGNvbnN0IGJhciA9IGNyZWF0ZUJhcihyb290LCBjbGFzc25hbWUpXG5cbiAgY29uc3QgcmVuZGVyID0gKHZhbCA9IDApID0+IHtcbiAgICBzdGF0ZS5wcm9ncmVzcyA9IHZhbFxuICAgIGJhci5pbm5lci5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKCR7c3RhdGUuYWN0aXZlID8gJzAnIDogJy0xMDAlJ30pIHRyYW5zbGF0ZVgoJHstMTAwICsgc3RhdGUucHJvZ3Jlc3N9JSk7YFxuICB9XG5cbiAgY29uc3QgZ28gPSB2YWwgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICByZW5kZXIoTWF0aC5taW4odmFsLCA5NSkpXG4gIH1cblxuICBjb25zdCBpbmMgPSAodmFsID0gKE1hdGgucmFuZG9tKCkgKiB0cmlja2xlKSkgPT4gZ28oc3RhdGUucHJvZ3Jlc3MgKyB2YWwpXG5cbiAgY29uc3QgZW5kID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlXG4gICAgcmVuZGVyKDEwMClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbmRlcigpLCBzcGVlZClcbiAgICBpZiAodGltZXIpeyBjbGVhclRpbWVvdXQodGltZXIpIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IHRydWVcbiAgICBpbmMoKVxuICB9XG5cbiAgY29uc3QgcHV0eiA9IChpbnRlcnZhbCA9IDUwMCkgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IGluYygpLCBpbnRlcnZhbClcbiAgfVxuICBcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoe1xuICAgIHB1dHosXG4gICAgc3RhcnQsXG4gICAgaW5jLFxuICAgIGdvLFxuICAgIGVuZCxcbiAgICBnZXRTdGF0ZTogKCkgPT4gc3RhdGVcbiAgfSx7XG4gICAgYmFyOiB7XG4gICAgICB2YWx1ZTogYmFyXG4gICAgfVxuICB9KVxufVxuIiwiY29uc3QgZmluZExpbmsgPSAoaWQsIGRhdGEpID0+IGRhdGEuZmlsdGVyKGwgPT4gbC5pZCA9PT0gaWQpWzBdXG5cbmNvbnN0IGNyZWF0ZUxpbmsgPSAoeyBhbnN3ZXJzIH0sIGRhdGEpID0+IGFuc3dlcnMuZm9yRWFjaChhID0+IHtcbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgbGV0IGlzR0lGID0gL2dpZi8udGVzdChhLm5leHQpID8gdHJ1ZSA6IGZhbHNlXG4gIGEubmV4dCA9IGlzUGF0aCB8fCBpc0dJRiA/IGEubmV4dCA6IGZpbmRMaW5rKGEubmV4dCwgZGF0YSlcbn0pXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTdG9yZSA9IChxdWVzdGlvbnMpID0+IHtcblx0cXVlc3Rpb25zLm1hcChxID0+IGNyZWF0ZUxpbmsocSwgcXVlc3Rpb25zKSlcblx0cmV0dXJuIHF1ZXN0aW9uc1xufVxuXG5leHBvcnQgZGVmYXVsdCBxdWVzdGlvbnMgPT4ge1xuICByZXR1cm4ge1xuICAgIHN0b3JlOiBjcmVhdGVTdG9yZShxdWVzdGlvbnMpLFxuICAgIGdldEFjdGl2ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmZpbHRlcihxID0+IHEuaWQgPT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoLyMvKVsxXSlbMF0gfHwgdGhpcy5zdG9yZVswXVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgW1xuICB7XG4gICAgaWQ6IDEsXG4gICAgcHJvbXB0OiBgSGkhIFdoYXQgYnJpbmdzIHlvdSB0byB0aGlzIGNvcm5lciBvZiB0aGUgd2ViP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogJ1dobyBhcmUgeW91PycsXG4gICAgICAgIG5leHQ6IDJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgSSdtIGhpcmluZy5gLFxuICAgICAgICBuZXh0OiAzXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEl0J3MgeW91ciBtb3RoZXIuYCxcbiAgICAgICAgbmV4dDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBGdW5ueSBqb2tlcywgcGx6LmAsXG4gICAgICAgIG5leHQ6IDVcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAyLFxuICAgIHByb21wdDogYEknbSBNZWxhbmllIOKAkyBhIGdyYXBoaWMgZGVzaWduZXIgd29ya2luZyBpbiBleHBlcmllbnRpYWwgbWFya2V0aW5nICYgcHJvdWQgSW93YW4gdHJ5aW5nIHRvIGVhdCBBTEwgdGhlIEJMVHMuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2hhdCdzIGV4cGVyaWVudGlhbD9gLFxuICAgICAgICBuZXh0OiA2XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYFdoYXQncyBhIEJMVD9gLFxuICAgICAgICBuZXh0OiA3XG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDMsXG4gICAgcHJvbXB0OiBgUmFkLiBDYW4gSSBzaG93IHlvdSBzb21lIHByb2plY3RzIEkndmUgd29ya2VkIG9uP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYFllcywgcGxlYXNlIWAsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgTmFoLCB0ZWxsIG1lIGFib3V0IHlvdS5gLFxuICAgICAgICBuZXh0OiAnL2Fib3V0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBJJ2xsIGVtYWlsIHlvdSBpbnN0ZWFkLmAsXG4gICAgICAgIG5leHQ6ICcvY29udGFjdCdcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNCxcbiAgICBwcm9tcHQ6IGBIaSBNb20uIEkgbG92ZSB5b3UhYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgSkssIG5vdCB5b3VyIG1vbS5gLFxuICAgICAgICBuZXh0OiA5XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYFdoYXQgZG9lcyAnSksnIG1lYW4/YCxcbiAgICAgICAgbmV4dDogMTVcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNSxcbiAgICBwcm9tcHQ6IGBXaGF0J3MgZnVubmllciB0aGFuIGEgcmhldG9yaWNhbCBxdWVzdGlvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBZZXNgLFxuICAgICAgICBuZXh0OiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBOb2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9QMkh5ODhyQWpRZHNRL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNixcbiAgICBwcm9tcHQ6IGBFeHBlcmllbnRpYWwgbWFya2V0aW5nIGVuZ2FnZXMgZGlyZWN0bHkgd2l0aCBjb25zdW1lcnMuIEV4YW1wbGVzPyBIaXAgcG9wLXVwIHNob3BzLCB3aWxkIGluc3RhbGxhdGlvbnMsIG9yIHNpbXBsZSBzdHJlZXQgdGVhbXMgZGlzdHJpYnV0aW5nIHByb2R1Y3Qgc2FtcGxlcy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBTb3VuZHMgY29vbC4gV2hhdCBoYXZlIHlvdSBkb25lP2AsXG4gICAgICAgIG5leHQ6ICcvd29yaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgV2h5IGRvIHlvdSBsaWtlIGl0P2AsXG4gICAgICAgIG5leHQ6IDExXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDcsXG4gICAgcHJvbXB0OiBgWW91IHRlbGwgbWUuYCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgQmVlZiBMaXZlciBUb2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9vRk9zMTBTSlNuem9zL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgQmVycnkgTGVtb24gVGFydGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8zbzdUS3dtbkRnUWI1amVtaksvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCYWNvbiBMZXR0dWNlIFRvbWF0b2AsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9mcXp4Y21sWTdvcE9nL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogOSxcbiAgICBwcm9tcHQ6IGBDbGlja2luZyBmb3IgZnVuPyBHb29kIGx1Y2sgd2l0aCB0aGlzIG9uZS5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCbHVlIFBpbGxgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvRzdHTm9hVVNIN3NNVS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYFJlZCBQaWxsYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL1VqdWpHWTNtQTNKbGUvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAxMCxcbiAgICBwcm9tcHQ6IGBQYW5jYWtlcyBvciB3YWZmbGVzP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYEZyZW5jaCBUb2FzdGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS8xNG5iNlRsSVJsYU4xdS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDExLFxuICAgIHByb21wdDogYFRoZXJlIGFyZSBhIG51bWJlciBvZiByZWFzb25zLCBidXQgYSBtYWpvciBob29rIGlzIHRoZSBjaGFsbGVuZ2UgdG8gY29uc2lzdGVudGx5IGNyZWF0ZSB3YXlzIHRvIHN1cnByaXNlIGFuZCBkZWxpZ2h0IGNvbnN1bWVycy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBXaGF0IGFyZSB5b3VyIGZhdm9yaXRlIHByb2plY3RzP2AsXG4gICAgICAgIG5leHQ6IDE0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEkgaGF2ZSBxdWVzdGlvbnMhIENhbiBJIGVtYWlsIHlvdT9gLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDE0LFxuICAgIHByb21wdDogYEkgbG92ZSB0aGUgd29yayBJJ3ZlIGRvbmUsIGJ1dCB0aGVzZSBwcm9qZWN0cyBkZXNlcnZlIHNvbWUgc2VyaW91cyBwcm9wcy5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBQcm9qZWN0IDFgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly90d2l0dGVyLmNvbSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgUHJvamVjdCAyYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgUHJvamVjdCAzYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vdHdpdHRlci5jb20nXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAxNSxcbiAgICBwcm9tcHQ6IGBJdCBpcyB5b3UsIE1vbSFgLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBZYXkhYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL2tyZXdYVUI2TEJqYS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfVxuXVxuIiwiaW1wb3J0IGgwIGZyb20gJ2gwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuLi9saWIvY29sb3JzJ1xuXG5leHBvcnQgY29uc3QgZGl2ID0gaDAoJ2RpdicpXG5leHBvcnQgY29uc3QgYnV0dG9uID0gaDAoJ2J1dHRvbicpKHtjbGFzczogJ2gyIG12MCBpbmxpbmUtYmxvY2snfSlcbmV4cG9ydCBjb25zdCB0aXRsZSA9IGgwKCdwJykoe2NsYXNzOiAnaDEgbXQwIG1iMDUgY2InfSlcblxuZXhwb3J0IGNvbnN0IHRlbXBsYXRlID0gKHtwcm9tcHQsIGFuc3dlcnN9LCBjYikgPT4ge1xuICByZXR1cm4gZGl2KHtjbGFzczogJ3F1ZXN0aW9uJ30pKFxuICAgIHRpdGxlKHByb21wdCksXG4gICAgZGl2KFxuICAgICAgLi4uYW5zd2Vycy5tYXAoKGEsIGkpID0+IGJ1dHRvbih7XG4gICAgICAgIG9uY2xpY2s6IChlKSA9PiBjYihhLm5leHQpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiBjb2xvcnMuY29sb3JzW2ldXG4gICAgICAgIH1cbiAgICAgIH0pKGEudmFsdWUpKVxuICAgIClcbiAgKVxufVxuIiwiaW1wb3J0IHsgdGFycnksIHF1ZXVlIH0gZnJvbSAndGFycnkuanMnXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2lmJylcbiAgY29uc3QgaW1nID0gbW9kYWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdXG5cbiAgY29uc3Qgc2hvdyA9IHRhcnJ5KCgpID0+IG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snKSBcbiAgY29uc3QgaGlkZSA9IHRhcnJ5KCgpID0+IG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScpIFxuICBjb25zdCB0b2dnbGUgPSB0YXJyeShcbiAgICAoKSA9PiBtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpIFxuICAgICAgPyBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgOiBtb2RhbC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKVxuICApXG5cbiAgY29uc3QgbGF6eSA9ICh1cmwsIGNiKSA9PiB7XG4gICAgbGV0IGJ1cm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cbiAgICBidXJuZXIub25sb2FkID0gKCkgPT4gY2IodXJsKVxuXG4gICAgYnVybmVyLnNyYyA9IHVybFxuICB9XG5cbiAgY29uc3Qgb3BlbiA9IHVybCA9PiB7XG4gICAgd2luZG93LmxvYWRlci5zdGFydCgpXG4gICAgd2luZG93LmxvYWRlci5wdXR6KDUwMClcblxuICAgIGxhenkodXJsLCB1cmwgPT4ge1xuICAgICAgaW1nLnNyYyA9IHVybFxuICAgICAgcXVldWUoc2hvdywgdG9nZ2xlKDIwMCkpKClcbiAgICAgIHdpbmRvdy5sb2FkZXIuZW5kKClcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgcXVldWUodG9nZ2xlLCBoaWRlKDIwMCkpKClcbiAgfVxuXG4gIG1vZGFsLm9uY2xpY2sgPSBjbG9zZVxuXG4gIHJldHVybiB7XG4gICAgb3BlbixcbiAgICBjbG9zZVxuICB9XG59XG4iLCJpbXBvcnQgcm91dGVyIGZyb20gJy4uL2xpYi9yb3V0ZXInXG5pbXBvcnQgcXVlc3Rpb25zIGZyb20gJy4vZGF0YS9pbmRleC5qcydcbmltcG9ydCBzdG9yYWdlIGZyb20gJy4vZGF0YSdcbmltcG9ydCBnaWZmZXIgZnJvbSAnLi9naWZmZXInXG5pbXBvcnQgeyB0ZW1wbGF0ZSB9IGZyb20gJy4vZWxlbWVudHMnXG5cbmxldCBwcmV2XG5jb25zdCBkYXRhID0gc3RvcmFnZShxdWVzdGlvbnMpXG5cbi8qKlxuICogUmVuZGVyIHRlbXBsYXRlIGFuZCBhcHBlbmQgdG8gRE9NXG4gKi9cbmNvbnN0IHJlbmRlciA9IChuZXh0KSA9PiB7XG4gIGxldCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcblxuICBsZXQgZWwgPSB0ZW1wbGF0ZShuZXh0LCB1cGRhdGUpXG4gIHF1ZXN0aW9uUm9vdCAmJiBxdWVzdGlvblJvb3QuYXBwZW5kQ2hpbGQoZWwpXG4gIHJldHVybiBlbCBcbn1cblxuLyoqXG4gKiBIYW5kbGUgRE9NIHVwZGF0ZXMsIG90aGVyIGxpbmsgY2xpY2tzXG4gKi9cbmNvbnN0IHVwZGF0ZSA9IChuZXh0KSA9PiB7XG4gIGxldCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcblxuICBsZXQgaXNHSUYgPSAvZ2lwaHkvLnRlc3QobmV4dClcbiAgaWYgKGlzR0lGKSByZXR1cm4gZ2lmZmVyKCkub3BlbihuZXh0KVxuXG4gIGxldCBpc1BhdGggPSAvXlxcLy8udGVzdChuZXh0KVxuICBpZiAoaXNQYXRoKSByZXR1cm4gcm91dGVyLmdvKG5leHQpXG5cbiAgaWYgKHByZXYgJiYgcXVlc3Rpb25Sb290ICYmIHF1ZXN0aW9uUm9vdC5jb250YWlucyhwcmV2KSkgcXVlc3Rpb25Sb290LnJlbW92ZUNoaWxkKHByZXYpXG5cbiAgcHJldiA9IHJlbmRlcihuZXh0KVxuXG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV4dC5pZFxufVxuXG4vKipcbiAqIFdhaXQgdW50aWwgbmV3IERPTSBpcyBwcmVzZW50IGJlZm9yZVxuICogdHJ5aW5nIHRvIHJlbmRlciB0byBpdFxuICovXG5yb3V0ZXIub24oJ3JvdXRlOmFmdGVyJywgKHsgcm91dGUgfSkgPT4ge1xuICBpZiAocm91dGUgPT09ICcnIHx8IC8oXlxcL3xcXC8jWzAtOV18I1swLTldKS8udGVzdChyb3V0ZSkpe1xuICAgIHVwZGF0ZShkYXRhLmdldEFjdGl2ZSgpKVxuICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHByZXYgPSByZW5kZXIoZGF0YS5nZXRBY3RpdmUoKSlcbn1cbiIsImltcG9ydCBwdXR6IGZyb20gJ3B1dHonXG5pbXBvcnQgcm91dGVyIGZyb20gJy4vbGliL3JvdXRlcidcbmltcG9ydCBhcHAgZnJvbSAnLi9hcHAnXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vbGliL2NvbG9ycydcblxuY29uc3QgbG9hZGVyID0gd2luZG93LmxvYWRlciA9IHB1dHooZG9jdW1lbnQuYm9keSwge1xuICBzcGVlZDogMTAwLFxuICB0cmlja2xlOiAxMFxufSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGFwcCgpXG5cbiAgcm91dGVyLm9uKCdyb3V0ZTphZnRlcicsICh7IHJvdXRlIH0pID0+IHtcbiAgICBjb2xvcnMudXBkYXRlKClcbiAgfSlcblxuICBjb2xvcnMudXBkYXRlKClcbn0pXG4iLCJjb25zdCByb290U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHJvb3RTdHlsZSlcblxuY29uc3QgY29sb3JzID0gW1xuICAnIzM1RDNFOCcsXG4gICcjRkY0RTQyJyxcbiAgJyNGRkVBNTEnXG5dXG5cbmNvbnN0IHJhbmRvbUNvbG9yID0gKCkgPT4gY29sb3JzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgyIC0gMCkgKyAwKV1cblxuY29uc3Qgc2F2ZUNvbG9yID0gYyA9PiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbWpzJywgSlNPTi5zdHJpbmdpZnkoe1xuICBjb2xvcjogY1xufSkpXG5cbmNvbnN0IHJlYWRDb2xvciA9ICgpID0+IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtanMnKSA/IChcbiAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWpzJykpLmNvbG9yXG4pIDogKFxuICBudWxsXG4pXG5cbmNvbnN0IGdldENvbG9yID0gKCkgPT4ge1xuICBsZXQgYyA9IHJhbmRvbUNvbG9yKClcbiAgbGV0IHByZXYgPSByZWFkQ29sb3IoKVxuXG4gIHdoaWxlIChjID09PSBwcmV2KXtcbiAgICBjID0gcmFuZG9tQ29sb3IoKVxuICB9XG5cbiAgc2F2ZUNvbG9yKGMpXG4gIHJldHVybiBjXG59XG5cbmNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgbGV0IGNvbG9yID0gZ2V0Q29sb3IoKVxuICBcbiAgcm9vdFN0eWxlLmlubmVySFRNTCA9IGBcbiAgICBib2R5IHsgY29sb3I6ICR7Y29sb3J9IH1cbiAgICA6Oi1tb3otc2VsZWN0aW9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7Y29sb3J9O1xuICAgIH1cbiAgICA6OnNlbGVjdGlvbiB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfTtcbiAgICB9XG4gICAgLnRoZW1lIGEge1xuICAgICAgY29sb3I6ICR7Y29sb3J9XG4gICAgfVxuICBgXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlOiB1cGRhdGUsXG4gIGNvbG9yc1xufVxuIiwiaW1wb3J0IG9wZXJhdG9yIGZyb20gJ29wZXJhdG9yLmpzJ1xuXG4vKipcbiAqIFNlbmQgcGFnZSB2aWV3cyB0byBcbiAqIEdvb2dsZSBBbmFseXRpY3NcbiAqL1xuY29uc3QgZ2FUcmFja1BhZ2VWaWV3ID0gKHBhdGgsIHRpdGxlKSA9PiB7XG4gIGxldCBnYSA9IHdpbmRvdy5nYSA/IHdpbmRvdy5nYSA6IGZhbHNlXG5cbiAgaWYgKCFnYSkgcmV0dXJuXG5cbiAgZ2EoJ3NldCcsIHtwYWdlOiBwYXRoLCB0aXRsZTogdGl0bGV9KTtcbiAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbn1cblxuY29uc3QgYXBwID0gb3BlcmF0b3Ioe1xuICByb290OiAnI3Jvb3QnXG59KVxuXG5hcHAub24oJ3JvdXRlOmFmdGVyJywgKHsgcm91dGUsIHRpdGxlIH0pID0+IHtcbiAgZ2FUcmFja1BhZ2VWaWV3KHJvdXRlLCB0aXRsZSlcbn0pXG5cbmFwcC5vbigndHJhbnNpdGlvbjphZnRlcicsICgpID0+IGxvYWRlciAmJiBsb2FkZXIuZW5kKCkpXG5cbndpbmRvdy5hcHAgPSBhcHBcblxuZXhwb3J0IGRlZmF1bHQgYXBwXG4iXX0=
