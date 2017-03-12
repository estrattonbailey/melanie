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
  prompt: 'Hi! What brings you to this neck of the web?',
  answers: [{
    value: 'Who r u?',
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
  prompt: 'I\'m melanie \u2013 a graphic designer working in experiential marketing & proud Iowan trying to eat ALL the BLTs.',
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
  prompt: 'Hi mom. I love you!',
  answers: [{
    value: 'jk, not your mom',
    next: 9
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
  prompt: 'Experiential marketing engages directly with consumers, inviting them to particpate in the evolution of a brand.',
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
  prompt: 'I like experiential because it\'s just super cool, okay?',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L2NhY2hlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9ldmFsLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL2Rpc3QvbGlua3MuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L29wZXJhdG9yLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC9yZW5kZXIuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9kaXN0L3N0YXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2UvZGlzdC91cmwuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2Nsb3Nlc3QuanMiLCIuLi8uLi9vc3Mvb3BlcmF0b3IuanMvcGFja2FnZS9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vLi4vb3NzL29wZXJhdG9yLmpzL3BhY2thZ2Uvbm9kZV9tb2R1bGVzL2xvb3AuanMvZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy9zY3JvbGwtcmVzdG9yYXRpb24vZGlzdC9pbmRleC5qcyIsIi4uLy4uL29zcy9vcGVyYXRvci5qcy9wYWNrYWdlL25vZGVfbW9kdWxlcy90YXJyeS5qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9oMC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIiwibm9kZV9tb2R1bGVzL3B1dHovaW5kZXguanMiLCJzcmMvanMvYXBwL2RhdGEuanMiLCJzcmMvanMvYXBwL2RhdGEvaW5kZXguanMiLCJzcmMvanMvYXBwL2VsZW1lbnRzLmpzIiwic3JjL2pzL2FwcC9naWZmZXIuanMiLCJzcmMvanMvYXBwL2luZGV4LmpzIiwic3JjL2pzL2luZGV4LmpzIiwic3JjL2pzL2xpYi9jb2xvcnMuanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0RUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLElBQUQsRUFBTyxTQUFQLEVBQXFCO0FBQ3JDLE1BQUksSUFBSSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjtBQUNBLE1BQUksSUFBSSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjs7QUFFQSxJQUFFLFNBQUYsR0FBYyxTQUFkO0FBQ0EsSUFBRSxTQUFGLEdBQWlCLFNBQWpCO0FBQ0EsSUFBRSxXQUFGLENBQWMsQ0FBZDtBQUNBLE9BQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXJCOztBQUVBLFNBQU87QUFDTCxXQUFPLENBREY7QUFFTCxXQUFPO0FBRkYsR0FBUDtBQUlELENBYkQ7O2tCQWVlLFlBQXFDO0FBQUEsTUFBcEMsSUFBb0MsdUVBQTdCLFNBQVMsSUFBb0I7QUFBQSxNQUFkLElBQWMsdUVBQVAsRUFBTzs7QUFDbEQsTUFBSSxRQUFRLElBQVo7QUFDQSxNQUFNLFFBQVEsS0FBSyxLQUFMLElBQWMsR0FBNUI7QUFDQSxNQUFNLFlBQVksS0FBSyxTQUFMLElBQWtCLE1BQXBDO0FBQ0EsTUFBTSxVQUFVLEtBQUssT0FBTCxJQUFnQixDQUFoQztBQUNBLE1BQU0sUUFBUTtBQUNaLFlBQVEsS0FESTtBQUVaLGNBQVU7QUFGRSxHQUFkOztBQUtBLE1BQU0sTUFBTSxVQUFVLElBQVYsRUFBZ0IsU0FBaEIsQ0FBWjs7QUFFQSxNQUFNLFNBQVMsU0FBVCxNQUFTLEdBQWE7QUFBQSxRQUFaLEdBQVksdUVBQU4sQ0FBTTs7QUFDMUIsVUFBTSxRQUFOLEdBQWlCLEdBQWpCO0FBQ0EsUUFBSSxLQUFKLENBQVUsS0FBVixDQUFnQixPQUFoQix1Q0FDMEIsTUFBTSxNQUFOLEdBQWUsR0FBZixHQUFxQixPQUQvQyx1QkFDc0UsQ0FBQyxHQUFELEdBQU8sTUFBTSxRQURuRjtBQUVELEdBSkQ7O0FBTUEsTUFBTSxLQUFLLFNBQUwsRUFBSyxNQUFPO0FBQ2hCLFFBQUksQ0FBQyxNQUFNLE1BQVgsRUFBa0I7QUFBRTtBQUFRO0FBQzVCLFdBQU8sS0FBSyxHQUFMLENBQVMsR0FBVCxFQUFjLEVBQWQsQ0FBUDtBQUNELEdBSEQ7O0FBS0EsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFFBQUMsR0FBRCx1RUFBUSxLQUFLLE1BQUwsS0FBZ0IsT0FBeEI7QUFBQSxXQUFxQyxHQUFHLE1BQU0sUUFBTixHQUFpQixHQUFwQixDQUFyQztBQUFBLEdBQVo7O0FBRUEsTUFBTSxNQUFNLFNBQU4sR0FBTSxHQUFNO0FBQ2hCLFVBQU0sTUFBTixHQUFlLEtBQWY7QUFDQSxXQUFPLEdBQVA7QUFDQSxlQUFXO0FBQUEsYUFBTSxRQUFOO0FBQUEsS0FBWCxFQUEyQixLQUEzQjtBQUNBLFFBQUksS0FBSixFQUFVO0FBQUUsbUJBQWEsS0FBYjtBQUFxQjtBQUNsQyxHQUxEOztBQU9BLE1BQU0sUUFBUSxTQUFSLEtBQVEsR0FBTTtBQUNsQixVQUFNLE1BQU4sR0FBZSxJQUFmO0FBQ0E7QUFDRCxHQUhEOztBQUtBLE1BQU0sT0FBTyxTQUFQLElBQU8sR0FBb0I7QUFBQSxRQUFuQixRQUFtQix1RUFBUixHQUFROztBQUMvQixRQUFJLENBQUMsTUFBTSxNQUFYLEVBQWtCO0FBQUU7QUFBUTtBQUM1QixZQUFRLFlBQVk7QUFBQSxhQUFNLEtBQU47QUFBQSxLQUFaLEVBQXlCLFFBQXpCLENBQVI7QUFDRCxHQUhEOztBQUtBLFNBQU8sT0FBTyxNQUFQLENBQWM7QUFDbkIsY0FEbUI7QUFFbkIsZ0JBRm1CO0FBR25CLFlBSG1CO0FBSW5CLFVBSm1CO0FBS25CLFlBTG1CO0FBTW5CLGNBQVU7QUFBQSxhQUFNLEtBQU47QUFBQTtBQU5TLEdBQWQsRUFPTDtBQUNBLFNBQUs7QUFDSCxhQUFPO0FBREo7QUFETCxHQVBLLENBQVA7QUFZRCxDOzs7Ozs7Ozs7O0FDckVELElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQUssSUFBTDtBQUFBLFNBQWMsS0FBSyxNQUFMLENBQVk7QUFBQSxXQUFLLEVBQUUsRUFBRixLQUFTLEVBQWQ7QUFBQSxHQUFaLEVBQThCLENBQTlCLENBQWQ7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLE9BQWMsSUFBZDtBQUFBLE1BQUcsT0FBSCxRQUFHLE9BQUg7QUFBQSxTQUF1QixRQUFRLE9BQVIsQ0FBZ0IsYUFBSztBQUM3RCxRQUFJLFNBQVMsTUFBTSxJQUFOLENBQVcsRUFBRSxJQUFiLElBQXFCLElBQXJCLEdBQTRCLEtBQXpDO0FBQ0EsUUFBSSxRQUFRLE1BQU0sSUFBTixDQUFXLEVBQUUsSUFBYixJQUFxQixJQUFyQixHQUE0QixLQUF4QztBQUNBLE1BQUUsSUFBRixHQUFTLFVBQVUsS0FBVixHQUFrQixFQUFFLElBQXBCLEdBQTJCLFNBQVMsRUFBRSxJQUFYLEVBQWlCLElBQWpCLENBQXBDO0FBQ0QsR0FKeUMsQ0FBdkI7QUFBQSxDQUFuQjs7QUFNTyxJQUFNLG9DQUFjLFNBQWQsV0FBYyxDQUFDLFNBQUQsRUFBZTtBQUN6QyxZQUFVLEdBQVYsQ0FBYztBQUFBLFdBQUssV0FBVyxDQUFYLEVBQWMsU0FBZCxDQUFMO0FBQUEsR0FBZDtBQUNBLFNBQU8sU0FBUDtBQUNBLENBSE07O2tCQUtRLHFCQUFhO0FBQzFCLFNBQU87QUFDTCxXQUFPLFlBQVksU0FBWixDQURGO0FBRUwsZUFBVyxxQkFBVTtBQUNuQixhQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0I7QUFBQSxlQUFLLEVBQUUsRUFBRixJQUFRLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixHQUEzQixFQUFnQyxDQUFoQyxDQUFiO0FBQUEsT0FBbEIsRUFBbUUsQ0FBbkUsS0FBeUUsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFoRjtBQUNEO0FBSkksR0FBUDtBQU1ELEM7Ozs7Ozs7O2tCQ3BCYyxDQUNiO0FBQ0UsTUFBSSxDQUROO0FBRUUsd0RBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSxXQUFPLFVBRFQ7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UseUJBREY7QUFFRSxVQUFNO0FBRlIsR0FMTyxFQVNQO0FBQ0UsK0JBREY7QUFFRSxVQUFNO0FBRlIsR0FUTyxFQWFQO0FBQ0UsOEJBREY7QUFFRSxVQUFNO0FBRlIsR0FiTztBQUhYLENBRGEsRUF3QmI7QUFDRSxNQUFJLENBRE47QUFFRSw4SEFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLGtDQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLDJCQURGO0FBRUUsVUFBTTtBQUZSLEdBTE87QUFIWCxDQXhCYSxFQXVDYjtBQUNFLE1BQUksQ0FETjtBQUVFLDhEQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0UseUJBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0Usb0NBREY7QUFFRSxVQUFNO0FBRlIsR0FMTyxFQVNQO0FBQ0UscUNBREY7QUFFRSxVQUFNO0FBRlIsR0FUTztBQUhYLENBdkNhLEVBMERiO0FBQ0UsTUFBSSxDQUROO0FBRUUsK0JBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSw2QkFERjtBQUVFLFVBQU07QUFGUixHQURPO0FBSFgsQ0ExRGEsRUFxRWI7QUFDRSxNQUFJLENBRE47QUFFRSx1REFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLGdCQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLGVBREY7QUFFRSxVQUFNO0FBRlIsR0FMTztBQUhYLENBckVhLEVBb0ZiO0FBQ0UsTUFBSSxDQUROO0FBRUUsNEhBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSw2Q0FERjtBQUVFLFVBQU07QUFGUixHQURPLEVBS1A7QUFDRSxnQ0FERjtBQUVFLFVBQU07QUFGUixHQUxPO0FBSFgsQ0FwRmEsRUFtR2I7QUFDRSxNQUFJLENBRE47QUFFRSx3QkFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLDZCQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLDZCQURGO0FBRUUsVUFBTTtBQUZSLEdBTE8sRUFTUDtBQUNFLGlDQURGO0FBRUUsVUFBTTtBQUZSLEdBVE87QUFIWCxDQW5HYSxFQXNIYjtBQUNFLE1BQUksQ0FETjtBQUVFLHNEQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0Usc0JBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0UscUJBREY7QUFFRSxVQUFNO0FBRlIsR0FMTztBQUhYLENBdEhhLEVBcUliO0FBQ0UsTUFBSSxFQUROO0FBRUUsZ0NBRkY7QUFHRSxXQUFTLENBQ1A7QUFDRSx5QkFERjtBQUVFLFVBQU07QUFGUixHQURPO0FBSFgsQ0FySWEsRUFnSmI7QUFDRSxNQUFJLEVBRE47QUFFRSxvRUFGRjtBQUdFLFdBQVMsQ0FDUDtBQUNFLDZDQURGO0FBRUUsVUFBTTtBQUZSLEdBRE8sRUFLUDtBQUNFLCtDQURGO0FBRUUsVUFBTTtBQUZSLEdBTE87QUFIWCxDQWhKYSxFQStKYjtBQUNFLE1BQUksRUFETjtBQUVFLHNGQUZGO0FBR0UsV0FBUyxDQUNQO0FBQ0Usc0JBREY7QUFFRSxVQUFNO0FBRlIsR0FETyxFQUtQO0FBQ0Usc0JBREY7QUFFRSxVQUFNO0FBRlIsR0FMTyxFQVVQO0FBQ0Usc0JBREY7QUFFRSxVQUFNO0FBRlIsR0FWTztBQUhYLENBL0phLEM7Ozs7Ozs7Ozs7QUNBZjs7OztBQUNBOzs7Ozs7OztBQUVPLElBQU0sb0JBQU0saUJBQUcsS0FBSCxDQUFaO0FBQ0EsSUFBTSwwQkFBUyxpQkFBRyxRQUFILEVBQWEsRUFBQyxPQUFPLHFCQUFSLEVBQWIsQ0FBZjtBQUNBLElBQU0sd0JBQVEsaUJBQUcsR0FBSCxFQUFRLEVBQUMsT0FBTyxnQkFBUixFQUFSLENBQWQ7O0FBRUEsSUFBTSw4QkFBVyxTQUFYLFFBQVcsT0FBb0IsRUFBcEIsRUFBMkI7QUFBQSxNQUF6QixNQUF5QixRQUF6QixNQUF5QjtBQUFBLE1BQWpCLE9BQWlCLFFBQWpCLE9BQWlCOztBQUNqRCxTQUFPLElBQUksRUFBQyxPQUFPLFVBQVIsRUFBSixFQUNMLE1BQU0sTUFBTixDQURLLEVBRUwsd0NBQ0ssUUFBUSxHQUFSLENBQVksVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFdBQVUsT0FBTztBQUM5QixlQUFTLGlCQUFDLENBQUQ7QUFBQSxlQUFPLEdBQUcsRUFBRSxJQUFMLENBQVA7QUFBQSxPQURxQjtBQUU5QixhQUFPO0FBQ0wsZUFBTyxpQkFBTyxNQUFQLENBQWMsQ0FBZDtBQURGO0FBRnVCLEtBQVAsRUFLdEIsRUFBRSxLQUxvQixDQUFWO0FBQUEsR0FBWixDQURMLEVBRkssQ0FBUDtBQVdELENBWk07Ozs7Ozs7OztBQ1BQOztrQkFFZSxZQUFNO0FBQ25CLE1BQU0sUUFBUSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBZDtBQUNBLE1BQU0sTUFBTSxNQUFNLG9CQUFOLENBQTJCLEtBQTNCLEVBQWtDLENBQWxDLENBQVo7O0FBRUEsTUFBTSxPQUFPLGtCQUFNO0FBQUEsV0FBTSxNQUFNLEtBQU4sQ0FBWSxPQUFaLEdBQXNCLE9BQTVCO0FBQUEsR0FBTixDQUFiO0FBQ0EsTUFBTSxPQUFPLGtCQUFNO0FBQUEsV0FBTSxNQUFNLEtBQU4sQ0FBWSxPQUFaLEdBQXNCLE1BQTVCO0FBQUEsR0FBTixDQUFiO0FBQ0EsTUFBTSxTQUFTLGtCQUNiO0FBQUEsV0FBTSxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsV0FBekIsSUFDRixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsV0FBdkIsQ0FERSxHQUVGLE1BQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixXQUFwQixDQUZKO0FBQUEsR0FEYSxDQUFmOztBQU1BLE1BQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxHQUFELEVBQU0sRUFBTixFQUFhO0FBQ3hCLFFBQUksU0FBUyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBYjs7QUFFQSxXQUFPLE1BQVAsR0FBZ0I7QUFBQSxhQUFNLEdBQUcsR0FBSCxDQUFOO0FBQUEsS0FBaEI7O0FBRUEsV0FBTyxHQUFQLEdBQWEsR0FBYjtBQUNELEdBTkQ7O0FBUUEsTUFBTSxPQUFPLFNBQVAsSUFBTyxNQUFPO0FBQ2xCLFdBQU8sTUFBUCxDQUFjLEtBQWQ7QUFDQSxXQUFPLE1BQVAsQ0FBYyxJQUFkLENBQW1CLEdBQW5COztBQUVBLFNBQUssR0FBTCxFQUFVLGVBQU87QUFDZixVQUFJLEdBQUosR0FBVSxHQUFWO0FBQ0Esd0JBQU0sSUFBTixFQUFZLE9BQU8sR0FBUCxDQUFaO0FBQ0EsYUFBTyxNQUFQLENBQWMsR0FBZDtBQUNELEtBSkQ7QUFLRCxHQVREOztBQVdBLE1BQU0sUUFBUSxTQUFSLEtBQVEsR0FBTTtBQUNsQixzQkFBTSxNQUFOLEVBQWMsS0FBSyxHQUFMLENBQWQ7QUFDRCxHQUZEOztBQUlBLFFBQU0sT0FBTixHQUFnQixLQUFoQjs7QUFFQSxTQUFPO0FBQ0wsY0FESztBQUVMO0FBRkssR0FBUDtBQUlELEM7Ozs7Ozs7OztBQzNDRDs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBSSxhQUFKO0FBQ0EsSUFBTSxPQUFPLG9DQUFiOztBQUVBOzs7QUFHQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsSUFBRCxFQUFVO0FBQ3ZCLE1BQUksZUFBZSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBbkI7O0FBRUEsTUFBSSxLQUFLLHdCQUFTLElBQVQsRUFBZSxNQUFmLENBQVQ7QUFDQSxrQkFBZ0IsYUFBYSxXQUFiLENBQXlCLEVBQXpCLENBQWhCO0FBQ0EsU0FBTyxFQUFQO0FBQ0QsQ0FORDs7QUFRQTs7O0FBR0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFDLElBQUQsRUFBVTtBQUN2QixNQUFJLGVBQWUsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQW5COztBQUVBLE1BQUksUUFBUSxRQUFRLElBQVIsQ0FBYSxJQUFiLENBQVo7QUFDQSxNQUFJLEtBQUosRUFBVyxPQUFPLHdCQUFTLElBQVQsQ0FBYyxJQUFkLENBQVA7O0FBRVgsTUFBSSxTQUFTLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBYjtBQUNBLE1BQUksTUFBSixFQUFZLE9BQU8saUJBQU8sRUFBUCxDQUFVLElBQVYsQ0FBUDs7QUFFWixNQUFJLFFBQVEsWUFBUixJQUF3QixhQUFhLFFBQWIsQ0FBc0IsSUFBdEIsQ0FBNUIsRUFBeUQsYUFBYSxXQUFiLENBQXlCLElBQXpCOztBQUV6RCxTQUFPLE9BQU8sSUFBUCxDQUFQOztBQUVBLFNBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixLQUFLLEVBQTVCO0FBQ0QsQ0FkRDs7QUFnQkE7Ozs7QUFJQSxpQkFBTyxFQUFQLENBQVUsYUFBVixFQUF5QixnQkFBZTtBQUFBLE1BQVosS0FBWSxRQUFaLEtBQVk7O0FBQ3RDLE1BQUksVUFBVSxFQUFWLElBQWdCLHdCQUF3QixJQUF4QixDQUE2QixLQUE3QixDQUFwQixFQUF3RDtBQUN0RCxXQUFPLEtBQUssU0FBTCxFQUFQO0FBQ0Q7QUFDRixDQUpEOztrQkFNZSxZQUFNO0FBQ25CLFNBQU8sT0FBTyxLQUFLLFNBQUwsRUFBUCxDQUFQO0FBQ0QsQzs7Ozs7QUNuREQ7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sU0FBUyxPQUFPLE1BQVAsR0FBZ0Isb0JBQUssU0FBUyxJQUFkLEVBQW9CO0FBQ2pELFNBQU8sR0FEMEM7QUFFakQsV0FBUztBQUZ3QyxDQUFwQixDQUEvQjs7QUFLQSxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQ2hEOztBQUVBLG1CQUFPLEVBQVAsQ0FBVSxhQUFWLEVBQXlCLGdCQUFlO0FBQUEsUUFBWixLQUFZLFFBQVosS0FBWTs7QUFDdEMscUJBQU8sTUFBUDtBQUNELEdBRkQ7O0FBSUEsbUJBQU8sTUFBUDtBQUNELENBUkQ7Ozs7Ozs7O0FDVkEsSUFBTSxZQUFZLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFsQjtBQUNBLFNBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsU0FBMUI7O0FBRUEsSUFBTSxTQUFTLENBQ2IsU0FEYSxFQUViLFNBRmEsRUFHYixTQUhhLENBQWY7O0FBTUEsSUFBTSxjQUFjLFNBQWQsV0FBYztBQUFBLFNBQU0sT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsTUFBaUIsSUFBSSxDQUFyQixJQUEwQixDQUFyQyxDQUFQLENBQU47QUFBQSxDQUFwQjs7QUFFQSxJQUFNLFlBQVksU0FBWixTQUFZO0FBQUEsU0FBSyxhQUFhLE9BQWIsQ0FBcUIsS0FBckIsRUFBNEIsS0FBSyxTQUFMLENBQWU7QUFDaEUsV0FBTztBQUR5RCxHQUFmLENBQTVCLENBQUw7QUFBQSxDQUFsQjs7QUFJQSxJQUFNLFlBQVksU0FBWixTQUFZO0FBQUEsU0FBTSxhQUFhLE9BQWIsQ0FBcUIsS0FBckIsSUFDdEIsS0FBSyxLQUFMLENBQVcsYUFBYSxPQUFiLENBQXFCLEtBQXJCLENBQVgsRUFBd0MsS0FEbEIsR0FHdEIsSUFIZ0I7QUFBQSxDQUFsQjs7QUFNQSxJQUFNLFdBQVcsU0FBWCxRQUFXLEdBQU07QUFDckIsTUFBSSxJQUFJLGFBQVI7QUFDQSxNQUFJLE9BQU8sV0FBWDs7QUFFQSxTQUFPLE1BQU0sSUFBYixFQUFrQjtBQUNoQixRQUFJLGFBQUo7QUFDRDs7QUFFRCxZQUFVLENBQVY7QUFDQSxTQUFPLENBQVA7QUFDRCxDQVZEOztBQVlBLElBQU0sU0FBUyxTQUFULE1BQVMsR0FBTTtBQUNuQixNQUFJLFFBQVEsVUFBWjs7QUFFQSxZQUFVLFNBQVYsNEJBQ2tCLEtBRGxCLDREQUd3QixLQUh4Qiw2REFNd0IsS0FOeEIsK0NBU2EsS0FUYjtBQVlELENBZkQ7O2tCQWlCZTtBQUNiLFVBQVEsTUFESztBQUViO0FBRmEsQzs7Ozs7Ozs7O0FDbERmOzs7Ozs7QUFFQTs7OztBQUlBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBaUI7QUFDdkMsTUFBSSxLQUFLLE9BQU8sRUFBUCxHQUFZLE9BQU8sRUFBbkIsR0FBd0IsS0FBakM7O0FBRUEsTUFBSSxDQUFDLEVBQUwsRUFBUzs7QUFFVCxLQUFHLEtBQUgsRUFBVSxFQUFDLE1BQU0sSUFBUCxFQUFhLE9BQU8sS0FBcEIsRUFBVjtBQUNBLEtBQUcsTUFBSCxFQUFXLFVBQVg7QUFDRCxDQVBEOztBQVNBLElBQU0sTUFBTSx3QkFBUztBQUNuQixRQUFNO0FBRGEsQ0FBVCxDQUFaOztBQUlBLElBQUksRUFBSixDQUFPLGFBQVAsRUFBc0IsZ0JBQXNCO0FBQUEsTUFBbkIsS0FBbUIsUUFBbkIsS0FBbUI7QUFBQSxNQUFaLEtBQVksUUFBWixLQUFZOztBQUMxQyxrQkFBZ0IsS0FBaEIsRUFBdUIsS0FBdkI7QUFDRCxDQUZEOztBQUlBLElBQUksRUFBSixDQUFPLGtCQUFQLEVBQTJCO0FBQUEsU0FBTSxVQUFVLE9BQU8sR0FBUCxFQUFoQjtBQUFBLENBQTNCOztBQUVBLE9BQU8sR0FBUCxHQUFhLEdBQWI7O2tCQUVlLEciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBjYWNoZSA9IHt9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHNldDogZnVuY3Rpb24gc2V0KHJvdXRlLCByZXMpIHtcbiAgICBjYWNoZSA9IF9leHRlbmRzKHt9LCBjYWNoZSwgX2RlZmluZVByb3BlcnR5KHt9LCByb3V0ZSwgcmVzKSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gZ2V0KHJvdXRlKSB7XG4gICAgcmV0dXJuIGNhY2hlW3JvdXRlXTtcbiAgfSxcbiAgZ2V0Q2FjaGU6IGZ1bmN0aW9uIGdldENhY2hlKCkge1xuICAgIHJldHVybiBjYWNoZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgaXNEdXBlID0gZnVuY3Rpb24gaXNEdXBlKHNjcmlwdCwgZXhpc3RpbmcpIHtcbiAgdmFyIGR1cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBleGlzdGluZy5sZW5ndGg7IGkrKykge1xuICAgIHNjcmlwdC5pc0VxdWFsTm9kZShleGlzdGluZ1tpXSkgJiYgZHVwZXMucHVzaChpKTtcbiAgfVxuXG4gIHJldHVybiBkdXBlcy5sZW5ndGggPiAwO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKG5ld0RvbSwgZXhpc3RpbmdEb20pIHtcbiAgdmFyIGV4aXN0aW5nID0gZXhpc3RpbmdEb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuICB2YXIgc2NyaXB0cyA9IG5ld0RvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzRHVwZShzY3JpcHRzW2ldLCBleGlzdGluZykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgdmFyIHNyYyA9IHNjcmlwdHNbaV0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ3NyYycpO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgcy5zcmMgPSBzcmMudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHMuaW5uZXJIVE1MID0gc2NyaXB0c1tpXS5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGVsZWdhdGUgPSByZXF1aXJlKCdkZWxlZ2F0ZScpO1xuXG52YXIgX2RlbGVnYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlbGVnYXRlKTtcblxudmFyIF9vcGVyYXRvciA9IHJlcXVpcmUoJy4vb3BlcmF0b3InKTtcblxudmFyIF9vcGVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vcGVyYXRvcik7XG5cbnZhciBfdXJsID0gcmVxdWlyZSgnLi91cmwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKF9yZWYpIHtcbiAgdmFyIF9yZWYkcm9vdCA9IF9yZWYucm9vdCxcbiAgICAgIHJvb3QgPSBfcmVmJHJvb3QgPT09IHVuZGVmaW5lZCA/IGRvY3VtZW50LmJvZHkgOiBfcmVmJHJvb3QsXG4gICAgICBfcmVmJGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbixcbiAgICAgIGR1cmF0aW9uID0gX3JlZiRkdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gMCA6IF9yZWYkZHVyYXRpb24sXG4gICAgICBfcmVmJGhhbmRsZXJzID0gX3JlZi5oYW5kbGVycyxcbiAgICAgIGhhbmRsZXJzID0gX3JlZiRoYW5kbGVycyA9PT0gdW5kZWZpbmVkID8gW10gOiBfcmVmJGhhbmRsZXJzO1xuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZVxuICAgKi9cbiAgdmFyIG9wZXJhdG9yID0gbmV3IF9vcGVyYXRvcjIuZGVmYXVsdCh7XG4gICAgcm9vdDogcm9vdCxcbiAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgaGFuZGxlcnM6IGhhbmRsZXJzXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBCb290c3RyYXBcbiAgICovXG4gIG9wZXJhdG9yLnNldFN0YXRlKHtcbiAgICByb3V0ZTogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCxcbiAgICB0aXRsZTogZG9jdW1lbnQudGl0bGVcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEJpbmQgYW5kIHZhbGlkYXRlIGFsbCBsaW5rc1xuICAgKi9cbiAgKDAsIF9kZWxlZ2F0ZTIuZGVmYXVsdCkoZG9jdW1lbnQsICdhJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgYW5jaG9yID0gZS5kZWxlZ2F0ZVRhcmdldDtcbiAgICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCAnLyc7XG5cbiAgICB2YXIgaW50ZXJuYWwgPSBfdXJsLmxpbmsuaXNTYW1lT3JpZ2luKGhyZWYpO1xuICAgIHZhciBleHRlcm5hbCA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnO1xuICAgIHZhciBkaXNhYmxlZCA9IGFuY2hvci5jbGFzc0xpc3QuY29udGFpbnMoJ25vLWFqYXgnKTtcbiAgICB2YXIgaWdub3JlZCA9IG9wZXJhdG9yLnZhbGlkYXRlKGUsIGhyZWYpO1xuICAgIHZhciBoYXNoID0gX3VybC5saW5rLmlzSGFzaChocmVmKTtcblxuICAgIGlmICghaW50ZXJuYWwgfHwgZXh0ZXJuYWwgfHwgZGlzYWJsZWQgfHwgaWdub3JlZCB8fCBoYXNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKF91cmwubGluay5pc1NhbWVVUkwoaHJlZikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcGVyYXRvci5nbyhocmVmKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBwb3BzdGF0ZVxuICAgKi9cbiAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBocmVmID0gZS50YXJnZXQubG9jYXRpb24uaHJlZjtcblxuICAgIGlmIChvcGVyYXRvci52YWxpZGF0ZShlLCBocmVmKSkge1xuICAgICAgaWYgKF91cmwubGluay5pc0hhc2goaHJlZikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvcHN0YXRlIGJ5cGFzc2VzIHJvdXRlciwgc28gd2VcbiAgICAgKiBuZWVkIHRvIHRlbGwgaXQgd2hlcmUgd2Ugd2VudCB0b1xuICAgICAqIHdpdGhvdXQgcHVzaGluZyBzdGF0ZVxuICAgICAqL1xuICAgIG9wZXJhdG9yLmdvKGhyZWYsIG51bGwsIHRydWUpO1xuICB9O1xuXG4gIHJldHVybiBvcGVyYXRvcjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxudmFyIGFjdGl2ZUxpbmtzID0gW107XG5cbnZhciB0b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGUoYm9vbCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdGl2ZUxpbmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgYWN0aXZlTGlua3NbaV0uY2xhc3NMaXN0W2Jvb2wgPyAnYWRkJyA6ICdyZW1vdmUnXSgnaXMtYWN0aXZlJyk7XG4gIH1cbn07XG5cbi8vIFRPRE8gZG8gSSBuZWVkIHRvIGVtcHR5IHRoZSBhcnJheVxuLy8gb3IgY2FuIEkganVzdCByZXNldCB0byBbXVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAocm91dGUpIHtcbiAgdG9nZ2xlKGZhbHNlKTtcblxuICBhY3RpdmVMaW5rcy5zcGxpY2UoMCwgYWN0aXZlTGlua3MubGVuZ3RoKTtcbiAgYWN0aXZlTGlua3MucHVzaC5hcHBseShhY3RpdmVMaW5rcywgX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmJD1cIicgKyByb3V0ZSArICdcIl0nKSkpKTtcblxuICB0b2dnbGUodHJ1ZSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9uYW5vYWpheCA9IHJlcXVpcmUoJ25hbm9hamF4Jyk7XG5cbnZhciBfbmFub2FqYXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbmFub2FqYXgpO1xuXG52YXIgX25hdmlnbyA9IHJlcXVpcmUoJ25hdmlnbycpO1xuXG52YXIgX25hdmlnbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9uYXZpZ28pO1xuXG52YXIgX3Njcm9sbFJlc3RvcmF0aW9uID0gcmVxdWlyZSgnc2Nyb2xsLXJlc3RvcmF0aW9uJyk7XG5cbnZhciBfc2Nyb2xsUmVzdG9yYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsUmVzdG9yYXRpb24pO1xuXG52YXIgX2xvb3AgPSByZXF1aXJlKCdsb29wLmpzJyk7XG5cbnZhciBfbG9vcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb29wKTtcblxudmFyIF91cmwgPSByZXF1aXJlKCcuL3VybCcpO1xuXG52YXIgX2xpbmtzID0gcmVxdWlyZSgnLi9saW5rcycpO1xuXG52YXIgX2xpbmtzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpbmtzKTtcblxudmFyIF9yZW5kZXIgPSByZXF1aXJlKCcuL3JlbmRlcicpO1xuXG52YXIgX3JlbmRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZW5kZXIpO1xuXG52YXIgX3N0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xuXG52YXIgX3N0YXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0YXRlKTtcblxudmFyIF9jYWNoZSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcblxudmFyIF9jYWNoZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWNoZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciByb3V0ZXIgPSBuZXcgX25hdmlnbzIuZGVmYXVsdChfdXJsLm9yaWdpbik7XG5cbnZhciBPcGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gT3BlcmF0b3IoY29uZmlnKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE9wZXJhdG9yKTtcblxuICAgIHZhciBldmVudHMgPSAoMCwgX2xvb3AyLmRlZmF1bHQpKCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIC8vIGNyZWF0ZSBjdXJyaWVkIHJlbmRlciBmdW5jdGlvblxuICAgIHRoaXMucmVuZGVyID0gKDAsIF9yZW5kZXIyLmRlZmF1bHQpKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpLCBjb25maWcsIGV2ZW50cy5lbWl0KTtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgZXZlbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhPcGVyYXRvciwgW3tcbiAgICBrZXk6ICdzdG9wJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5wYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0YXJ0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBfc3RhdGUyLmRlZmF1bHQucGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0U3RhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICAgIHJldHVybiBfc3RhdGUyLmRlZmF1bHQuX3N0YXRlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NldFN0YXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3RhdGUoX3JlZikge1xuICAgICAgdmFyIHJvdXRlID0gX3JlZi5yb3V0ZSxcbiAgICAgICAgICB0aXRsZSA9IF9yZWYudGl0bGU7XG5cbiAgICAgIF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSA9IHJvdXRlID09PSAnJyA/ICcvJyA6IHJvdXRlO1xuICAgICAgdGl0bGUgPyBfc3RhdGUyLmRlZmF1bHQudGl0bGUgPSB0aXRsZSA6IG51bGw7XG5cbiAgICAgICgwLCBfbGlua3MyLmRlZmF1bHQpKF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZSk7XG5cbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhyZWZcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzb2x2ZSBVc2UgTmF2aWdvLnJlc29sdmUoKSwgYnlwYXNzIE5hdmlnby5uYXZpZ2F0ZSgpXG4gICAgICpcbiAgICAgKiBQb3BzdGF0ZSBjaGFuZ2VzIHRoZSBVUkwgZm9yIHVzLCBzbyBpZiB3ZSB3ZXJlIHRvXG4gICAgICogcm91dGVyLm5hdmlnYXRlKCkgdG8gdGhlIHByZXZpb3VzIGxvY2F0aW9uLCBpdCB3b3VsZCBwdXNoXG4gICAgICogYSBkdXBsaWNhdGUgcm91dGUgdG8gaGlzdG9yeSBhbmQgd2Ugd291bGQgY3JlYXRlIGEgbG9vcC5cbiAgICAgKlxuICAgICAqIHJvdXRlci5yZXNvbHZlKCkgbGV0J3MgTmF2aWdvIGtub3cgd2UndmUgbW92ZWQsIHdpdGhvdXRcbiAgICAgKiBhbHRlcmluZyBoaXN0b3J5LlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdnbycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdvKGhyZWYpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIHZhciByZXNvbHZlID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICBpZiAoX3N0YXRlMi5kZWZhdWx0LnBhdXNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIGNhbGxiYWNrKHRpdGxlKSB7XG4gICAgICAgIHZhciByZXMgPSB7XG4gICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgIHJvdXRlOiByb3V0ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc29sdmUgPyByb3V0ZXIucmVzb2x2ZShyb3V0ZSkgOiByb3V0ZXIubmF2aWdhdGUocm91dGUpO1xuXG4gICAgICAgIF9zY3JvbGxSZXN0b3JhdGlvbjIuZGVmYXVsdC5yZXN0b3JlKCk7XG5cbiAgICAgICAgX3RoaXMuc2V0U3RhdGUocmVzKTtcblxuICAgICAgICBfdGhpcy5lbWl0KCdyb3V0ZTphZnRlcicsIHJlcyk7XG5cbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IocmVzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHJvdXRlID0gKDAsIF91cmwuc2FuaXRpemUpKGhyZWYpO1xuXG4gICAgICBpZiAoIXJlc29sdmUpIHtcbiAgICAgICAgX3Njcm9sbFJlc3RvcmF0aW9uMi5kZWZhdWx0LnNhdmUoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhY2hlZCA9IF9jYWNoZTIuZGVmYXVsdC5nZXQocm91dGUpO1xuXG4gICAgICB0aGlzLmVtaXQoJ3JvdXRlOmJlZm9yZScsIHsgcm91dGU6IHJvdXRlIH0pO1xuXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihyb3V0ZSwgY2FjaGVkLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ2V0KHJvdXRlLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KHJvdXRlLCBjYikge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBfbmFub2FqYXgyLmRlZmF1bHQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogX3VybC5vcmlnaW4gKyAnLycgKyByb3V0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHN0YXR1cywgcmVzLCByZXEpIHtcbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPCAyMDAgfHwgcmVxLnN0YXR1cyA+IDMwMCAmJiByZXEuc3RhdHVzICE9PSAzMDQpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBfdXJsLm9yaWdpbiArICcvJyArIF9zdGF0ZTIuZGVmYXVsdC5wcmV2LnJvdXRlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jYWNoZTIuZGVmYXVsdC5zZXQocm91dGUsIHJlcS5yZXNwb25zZSk7XG5cbiAgICAgICAgX3RoaXMyLnJlbmRlcihyb3V0ZSwgcmVxLnJlc3BvbnNlLCBjYik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdwdXNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHVzaCgpIHtcbiAgICAgIHZhciByb3V0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHZhciB0aXRsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogX3N0YXRlMi5kZWZhdWx0LnRpdGxlO1xuXG4gICAgICBpZiAoIXJvdXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUocm91dGUpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJvdXRlOiByb3V0ZSwgdGl0bGU6IHRpdGxlIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3ZhbGlkYXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsaWRhdGUoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIGV2ZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgICAgdmFyIGhyZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IF9zdGF0ZTIuZGVmYXVsdC5yb3V0ZTtcblxuICAgICAgdmFyIHJvdXRlID0gKDAsIF91cmwuc2FuaXRpemUpKGhyZWYpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuaGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHQpKSB7XG4gICAgICAgICAgdmFyIHJlcyA9IHRbMV0ocm91dGUpO1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIF90aGlzMy5lbWl0KHRbMF0sIHtcbiAgICAgICAgICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0KHJvdXRlKTtcbiAgICAgICAgfVxuICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gT3BlcmF0b3I7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE9wZXJhdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90YXJyeSA9IHJlcXVpcmUoJ3RhcnJ5LmpzJyk7XG5cbnZhciBfZXZhbCA9IHJlcXVpcmUoJy4vZXZhbC5qcycpO1xuXG52YXIgX2V2YWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXZhbCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBwYXJzZXIgPSBuZXcgd2luZG93LkRPTVBhcnNlcigpO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIFN0cmluZ2lmaWVkIEhUTUxcbiAqIEByZXR1cm4ge29iamVjdH0gRE9NIG5vZGUsICNwYWdlXG4gKi9cbnZhciBwYXJzZVJlc3BvbnNlID0gZnVuY3Rpb24gcGFyc2VSZXNwb25zZShodG1sKSB7XG4gIHJldHVybiBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IHBhZ2UgUm9vdCBhcHBsaWNhdGlvbiBET00gbm9kZVxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBEdXJhdGlvbiBhbmQgcm9vdCBub2RlIHNlbGVjdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBlbWl0IEVtaXR0ZXIgZnVuY3Rpb24gZnJvbSBPcGVyYXRvciBpbnN0YW5jZVxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1hcmt1cCBOZXcgbWFya3VwIGZyb20gQUpBWCByZXNwb25zZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgT3B0aW9uYWwgY2FsbGJhY2tcbiAqL1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAocGFnZSwgX3JlZiwgZW1pdCkge1xuICB2YXIgZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uLFxuICAgICAgcm9vdCA9IF9yZWYucm9vdDtcbiAgcmV0dXJuIGZ1bmN0aW9uIChyb3V0ZSwgbWFya3VwLCBjYikge1xuICAgIHZhciByZXMgPSBwYXJzZVJlc3BvbnNlKG1hcmt1cCk7XG4gICAgdmFyIHRpdGxlID0gcmVzLnRpdGxlO1xuXG4gICAgdmFyIHN0YXJ0ID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgZW1pdCgndHJhbnNpdGlvbjpiZWZvcmUnLCB7IHJvdXRlOiByb3V0ZSB9KTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy10cmFuc2l0aW9uaW5nJyk7XG4gICAgICBwYWdlLnN0eWxlLmhlaWdodCA9IHBhZ2UuY2xpZW50SGVpZ2h0ICsgJ3B4JztcbiAgICB9KTtcblxuICAgIHZhciByZW5kZXIgPSAoMCwgX3RhcnJ5LnRhcnJ5KShmdW5jdGlvbiAoKSB7XG4gICAgICBwYWdlLmlubmVySFRNTCA9IHJlcy5xdWVyeVNlbGVjdG9yKHJvb3QpLmlubmVySFRNTDtcbiAgICAgICgwLCBfZXZhbDIuZGVmYXVsdCkocmVzLCBkb2N1bWVudCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZW5kID0gKDAsIF90YXJyeS50YXJyeSkoZnVuY3Rpb24gKCkge1xuICAgICAgY2IodGl0bGUpO1xuICAgICAgcGFnZS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy10cmFuc2l0aW9uaW5nJyk7XG4gICAgICBlbWl0KCd0cmFuc2l0aW9uOmFmdGVyJywgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgfSk7XG5cbiAgICAoMCwgX3RhcnJ5LnF1ZXVlKShzdGFydCgwKSwgcmVuZGVyKGR1cmF0aW9uKSwgZW5kKDApKSgpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gIHBhdXNlZDogZmFsc2UsXG4gIF9zdGF0ZToge1xuICAgIHJvdXRlOiAnJyxcbiAgICB0aXRsZTogJycsXG4gICAgcHJldjoge1xuICAgICAgcm91dGU6ICcvJyxcbiAgICAgIHRpdGxlOiAnJ1xuICAgIH1cbiAgfSxcbiAgZ2V0IHJvdXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5yb3V0ZTtcbiAgfSxcbiAgc2V0IHJvdXRlKGxvYykge1xuICAgIHRoaXMuX3N0YXRlLnByZXYucm91dGUgPSB0aGlzLnJvdXRlO1xuICAgIHRoaXMuX3N0YXRlLnJvdXRlID0gbG9jO1xuICB9LFxuICBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnRpdGxlO1xuICB9LFxuICBzZXQgdGl0bGUodmFsKSB7XG4gICAgdGhpcy5fc3RhdGUucHJldi50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgdGhpcy5fc3RhdGUudGl0bGUgPSB2YWw7XG4gIH0sXG4gIGdldCBwcmV2KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5wcmV2O1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBnZXRPcmlnaW4gPSBmdW5jdGlvbiBnZXRPcmlnaW4obG9jYXRpb24pIHtcbiAgdmFyIHByb3RvY29sID0gbG9jYXRpb24ucHJvdG9jb2wsXG4gICAgICBob3N0ID0gbG9jYXRpb24uaG9zdDtcblxuICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgaG9zdDtcbn07XG5cbnZhciBwYXJzZVVSTCA9IGZ1bmN0aW9uIHBhcnNlVVJMKHVybCkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgYS5ocmVmID0gdXJsO1xuICByZXR1cm4gYTtcbn07XG5cbnZhciBvcmlnaW4gPSBleHBvcnRzLm9yaWdpbiA9IGdldE9yaWdpbih3aW5kb3cubG9jYXRpb24pO1xuXG52YXIgb3JpZ2luUmVnRXggPSBuZXcgUmVnRXhwKG9yaWdpbik7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBSYXcgVVJMIHRvIHBhcnNlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFVSTCBzYW5zIG9yaWdpbiBhbmQgc2FucyBsZWFkaW5nIHNsYXNoXG4gKi9cbnZhciBzYW5pdGl6ZSA9IGV4cG9ydHMuc2FuaXRpemUgPSBmdW5jdGlvbiBzYW5pdGl6ZSh1cmwpIHtcbiAgdmFyIHJvdXRlID0gdXJsLnJlcGxhY2Uob3JpZ2luUmVnRXgsICcnKTtcbiAgcmV0dXJuIHJvdXRlLm1hdGNoKC9eXFwvLykgPyByb3V0ZS5yZXBsYWNlKC9cXC97MX0vLCAnJykgOiByb3V0ZTsgLy8gcmVtb3ZlIC8gYW5kIHJldHVyblxufTtcblxudmFyIGxpbmsgPSBleHBvcnRzLmxpbmsgPSB7XG4gIGlzU2FtZU9yaWdpbjogZnVuY3Rpb24gaXNTYW1lT3JpZ2luKGhyZWYpIHtcbiAgICByZXR1cm4gb3JpZ2luID09PSBnZXRPcmlnaW4ocGFyc2VVUkwoaHJlZikpO1xuICB9LFxuICBpc0hhc2g6IGZ1bmN0aW9uIGlzSGFzaChocmVmKSB7XG4gICAgcmV0dXJuICgvIy8udGVzdChocmVmKVxuICAgICk7XG4gIH0sXG4gIGlzU2FtZVVSTDogZnVuY3Rpb24gaXNTYW1lVVJMKGhyZWYpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnNlYXJjaCA9PT0gcGFyc2VVUkwoaHJlZikuc2VhcmNoICYmIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gcGFyc2VVUkwoaHJlZikucGF0aG5hbWU7XG4gIH1cbn07IiwidmFyIERPQ1VNRU5UX05PREVfVFlQRSA9IDk7XG5cbi8qKlxuICogQSBwb2x5ZmlsbCBmb3IgRWxlbWVudC5tYXRjaGVzKClcbiAqL1xuaWYgKHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIHZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG4gICAgcHJvdG8ubWF0Y2hlcyA9IHByb3RvLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgcGFyZW50IHRoYXQgbWF0Y2hlcyBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY2xvc2VzdCAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSBET0NVTUVOVF9OT0RFX1RZUEUpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHJldHVybiBlbGVtZW50O1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIiwidmFyIGNsb3Nlc3QgPSByZXF1aXJlKCcuL2Nsb3Nlc3QnKTtcblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gZGVsZWdhdGUoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gICAgdmFyIGxpc3RlbmVyRm4gPSBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICB2YXIgbGlzdGVuZXJzID0ge307XG5cbiAgdmFyIG9uID0gZnVuY3Rpb24gb24oZSkge1xuICAgIHZhciBjYiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIGlmICghY2IpIHJldHVybjtcbiAgICBsaXN0ZW5lcnNbZV0gPSBsaXN0ZW5lcnNbZV0gfHwgeyBxdWV1ZTogW10gfTtcbiAgICBsaXN0ZW5lcnNbZV0ucXVldWUucHVzaChjYik7XG4gIH07XG5cbiAgdmFyIGVtaXQgPSBmdW5jdGlvbiBlbWl0KGUpIHtcbiAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIHZhciBpdGVtcyA9IGxpc3RlbmVyc1tlXSA/IGxpc3RlbmVyc1tlXS5xdWV1ZSA6IGZhbHNlO1xuICAgIGl0ZW1zICYmIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiBpKGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgbywge1xuICAgIGVtaXQ6IGVtaXQsXG4gICAgb246IG9uXG4gIH0pO1xufTsiLCIvLyBCZXN0IHBsYWNlIHRvIGZpbmQgaW5mb3JtYXRpb24gb24gWEhSIGZlYXR1cmVzIGlzOlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XG5cbnZhciByZXFmaWVsZHMgPSBbXG4gICdyZXNwb25zZVR5cGUnLCAnd2l0aENyZWRlbnRpYWxzJywgJ3RpbWVvdXQnLCAnb25wcm9ncmVzcydcbl1cblxuLy8gU2ltcGxlIGFuZCBzbWFsbCBhamF4IGZ1bmN0aW9uXG4vLyBUYWtlcyBhIHBhcmFtZXRlcnMgb2JqZWN0IGFuZCBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4vLyBQYXJhbWV0ZXJzOlxuLy8gIC0gdXJsOiBzdHJpbmcsIHJlcXVpcmVkXG4vLyAgLSBoZWFkZXJzOiBvYmplY3Qgb2YgYHtoZWFkZXJfbmFtZTogaGVhZGVyX3ZhbHVlLCAuLi59YFxuLy8gIC0gYm9keTpcbi8vICAgICAgKyBzdHJpbmcgKHNldHMgY29udGVudCB0eXBlIHRvICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIGlmIG5vdCBzZXQgaW4gaGVhZGVycylcbi8vICAgICAgKyBGb3JtRGF0YSAoZG9lc24ndCBzZXQgY29udGVudCB0eXBlIHNvIHRoYXQgYnJvd3NlciB3aWxsIHNldCBhcyBhcHByb3ByaWF0ZSlcbi8vICAtIG1ldGhvZDogJ0dFVCcsICdQT1NUJywgZXRjLiBEZWZhdWx0cyB0byAnR0VUJyBvciAnUE9TVCcgYmFzZWQgb24gYm9keVxuLy8gIC0gY29yczogSWYgeW91ciB1c2luZyBjcm9zcy1vcmlnaW4sIHlvdSB3aWxsIG5lZWQgdGhpcyB0cnVlIGZvciBJRTgtOVxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgcGFyYW1ldGVycyBhcmUgcGFzc2VkIG9udG8gdGhlIHhociBvYmplY3QuXG4vLyBJTVBPUlRBTlQgTk9URTogVGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgY29tcGF0aWJpbGl0eSBjaGVja2luZy5cbi8vICAtIHJlc3BvbnNlVHlwZTogc3RyaW5nLCB2YXJpb3VzIGNvbXBhdGFiaWxpdHksIHNlZSB4aHIgZG9jcyBmb3IgZW51bSBvcHRpb25zXG4vLyAgLSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4sIElFMTArLCBDT1JTIG9ubHlcbi8vICAtIHRpbWVvdXQ6IGxvbmcsIG1zIHRpbWVvdXQsIElFOCtcbi8vICAtIG9ucHJvZ3Jlc3M6IGNhbGxiYWNrLCBJRTEwK1xuLy9cbi8vIENhbGxiYWNrIGZ1bmN0aW9uIHByb3RvdHlwZTpcbi8vICAtIHN0YXR1c0NvZGUgZnJvbSByZXF1ZXN0XG4vLyAgLSByZXNwb25zZVxuLy8gICAgKyBpZiByZXNwb25zZVR5cGUgc2V0IGFuZCBzdXBwb3J0ZWQgYnkgYnJvd3NlciwgdGhpcyBpcyBhbiBvYmplY3Qgb2Ygc29tZSB0eXBlIChzZWUgZG9jcylcbi8vICAgICsgb3RoZXJ3aXNlIGlmIHJlcXVlc3QgY29tcGxldGVkLCB0aGlzIGlzIHRoZSBzdHJpbmcgdGV4dCBvZiB0aGUgcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVxdWVzdCBpcyBhYm9ydGVkLCB0aGlzIGlzIFwiQWJvcnRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IHRpbWVzIG91dCwgdGhpcyBpcyBcIlRpbWVvdXRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IGVycm9ycyBiZWZvcmUgY29tcGxldGluZyAocHJvYmFibHkgYSBDT1JTIGlzc3VlKSwgdGhpcyBpcyBcIkVycm9yXCJcbi8vICAtIHJlcXVlc3Qgb2JqZWN0XG4vL1xuLy8gUmV0dXJucyB0aGUgcmVxdWVzdCBvYmplY3QuIFNvIHlvdSBjYW4gY2FsbCAuYWJvcnQoKSBvciBvdGhlciBtZXRob2RzXG4vL1xuLy8gREVQUkVDQVRJT05TOlxuLy8gIC0gUGFzc2luZyBhIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBwYXJhbXMgb2JqZWN0IGhhcyBiZWVuIHJlbW92ZWQhXG4vL1xuZXhwb3J0cy5hamF4ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgLy8gQW55IHZhcmlhYmxlIHVzZWQgbW9yZSB0aGFuIG9uY2UgaXMgdmFyJ2QgaGVyZSBiZWNhdXNlXG4gIC8vIG1pbmlmaWNhdGlvbiB3aWxsIG11bmdlIHRoZSB2YXJpYWJsZXMgd2hlcmVhcyBpdCBjYW4ndCBtdW5nZVxuICAvLyB0aGUgb2JqZWN0IGFjY2Vzcy5cbiAgdmFyIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyB8fCB7fVxuICAgICwgYm9keSA9IHBhcmFtcy5ib2R5XG4gICAgLCBtZXRob2QgPSBwYXJhbXMubWV0aG9kIHx8IChib2R5ID8gJ1BPU1QnIDogJ0dFVCcpXG4gICAgLCBjYWxsZWQgPSBmYWxzZVxuXG4gIHZhciByZXEgPSBnZXRSZXF1ZXN0KHBhcmFtcy5jb3JzKVxuXG4gIGZ1bmN0aW9uIGNiKHN0YXR1c0NvZGUsIHJlc3BvbnNlVGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzID09PSB1bmRlZmluZWQgPyBzdGF0dXNDb2RlIDogcmVxLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgcmVxLnN0YXR1cyA9PT0gMCA/IFwiRXJyb3JcIiA6IChyZXEucmVzcG9uc2UgfHwgcmVxLnJlc3BvbnNlVGV4dCB8fCByZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgICAgICByZXEpXG4gICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXEub3BlbihtZXRob2QsIHBhcmFtcy51cmwsIHRydWUpXG5cbiAgdmFyIHN1Y2Nlc3MgPSByZXEub25sb2FkID0gY2IoMjAwKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkgc3VjY2VzcygpXG4gIH1cbiAgcmVxLm9uZXJyb3IgPSBjYihudWxsLCAnRXJyb3InKVxuICByZXEub250aW1lb3V0ID0gY2IobnVsbCwgJ1RpbWVvdXQnKVxuICByZXEub25hYm9ydCA9IGNiKG51bGwsICdBYm9ydCcpXG5cbiAgaWYgKGJvZHkpIHtcbiAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0JylcblxuICAgIGlmICghZ2xvYmFsLkZvcm1EYXRhIHx8ICEoYm9keSBpbnN0YW5jZW9mIGdsb2JhbC5Gb3JtRGF0YSkpIHtcbiAgICAgIHNldERlZmF1bHQoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXFmaWVsZHMubGVuZ3RoLCBmaWVsZDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZmllbGQgPSByZXFmaWVsZHNbaV1cbiAgICBpZiAocGFyYW1zW2ZpZWxkXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmVxW2ZpZWxkXSA9IHBhcmFtc1tmaWVsZF1cbiAgfVxuXG4gIGZvciAodmFyIGZpZWxkIGluIGhlYWRlcnMpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIGhlYWRlcnNbZmllbGRdKVxuXG4gIHJlcS5zZW5kKGJvZHkpXG5cbiAgcmV0dXJuIHJlcVxufVxuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KGNvcnMpIHtcbiAgLy8gWERvbWFpblJlcXVlc3QgaXMgb25seSB3YXkgdG8gZG8gQ09SUyBpbiBJRSA4IGFuZCA5XG4gIC8vIEJ1dCBYRG9tYWluUmVxdWVzdCBpc24ndCBzdGFuZGFyZHMtY29tcGF0aWJsZVxuICAvLyBOb3RhYmx5LCBpdCBkb2Vzbid0IGFsbG93IGNvb2tpZXMgdG8gYmUgc2VudCBvciBzZXQgYnkgc2VydmVyc1xuICAvLyBJRSAxMCsgaXMgc3RhbmRhcmRzLWNvbXBhdGlibGUgaW4gaXRzIFhNTEh0dHBSZXF1ZXN0XG4gIC8vIGJ1dCBJRSAxMCBjYW4gc3RpbGwgaGF2ZSBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3QsIHNvIHdlIGRvbid0IHdhbnQgdG8gdXNlIGl0XG4gIGlmIChjb3JzICYmIGdsb2JhbC5YRG9tYWluUmVxdWVzdCAmJiAhL01TSUUgMS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0XG4gIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpXG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdFxufVxuXG5mdW5jdGlvbiBzZXREZWZhdWx0KG9iaiwga2V5LCB2YWx1ZSkge1xuICBvYmpba2V5XSA9IG9ialtrZXldIHx8IHZhbHVlXG59XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIk5hdmlnb1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHR2YXIgUEFSQU1FVEVSX1JFR0VYUCA9IC8oWzoqXSkoXFx3KykvZztcblx0dmFyIFdJTERDQVJEX1JFR0VYUCA9IC9cXCovZztcblx0dmFyIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQID0gJyhbXlxcL10rKSc7XG5cdHZhciBSRVBMQUNFX1dJTERDQVJEID0gJyg/Oi4qKSc7XG5cdHZhciBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFAgPSAnKD86XFwvJHwkKSc7XG5cdFxuXHRmdW5jdGlvbiBjbGVhbihzKSB7XG5cdCAgaWYgKHMgaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiBzO1xuXHQgIHJldHVybiBzLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL15cXC8rLywgJy8nKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIG5hbWVzKSB7XG5cdCAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdCAgaWYgKCFtYXRjaCkgcmV0dXJuIG51bGw7XG5cdCAgcmV0dXJuIG1hdGNoLnNsaWNlKDEsIG1hdGNoLmxlbmd0aCkucmVkdWNlKGZ1bmN0aW9uIChwYXJhbXMsIHZhbHVlLCBpbmRleCkge1xuXHQgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgcGFyYW1zID0ge307XG5cdCAgICBwYXJhbXNbbmFtZXNbaW5kZXhdXSA9IHZhbHVlO1xuXHQgICAgcmV0dXJuIHBhcmFtcztcblx0ICB9LCBudWxsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZSkge1xuXHQgIHZhciBwYXJhbU5hbWVzID0gW10sXG5cdCAgICAgIHJlZ2V4cDtcblx0XG5cdCAgaWYgKHJvdXRlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICByZWdleHAgPSByb3V0ZTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChjbGVhbihyb3V0ZSkucmVwbGFjZShQQVJBTUVURVJfUkVHRVhQLCBmdW5jdGlvbiAoZnVsbCwgZG90cywgbmFtZSkge1xuXHQgICAgICBwYXJhbU5hbWVzLnB1c2gobmFtZSk7XG5cdCAgICAgIHJldHVybiBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUDtcblx0ICAgIH0pLnJlcGxhY2UoV0lMRENBUkRfUkVHRVhQLCBSRVBMQUNFX1dJTERDQVJEKSArIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCk7XG5cdCAgfVxuXHQgIHJldHVybiB7IHJlZ2V4cDogcmVnZXhwLCBwYXJhbU5hbWVzOiBwYXJhbU5hbWVzIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGdldFVybERlcHRoKHVybCkge1xuXHQgIHJldHVybiB1cmwucmVwbGFjZSgvXFwvJC8sICcnKS5zcGxpdCgnLycpLmxlbmd0aDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY29tcGFyZVVybERlcHRoKHVybEEsIHVybEIpIHtcblx0ICByZXR1cm4gZ2V0VXJsRGVwdGgodXJsQSkgPCBnZXRVcmxEZXB0aCh1cmxCKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmluZE1hdGNoZWRSb3V0ZXModXJsKSB7XG5cdCAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICByZXR1cm4gcm91dGVzLm1hcChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciBfcmVwbGFjZUR5bmFtaWNVUkxQYXIgPSByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICB2YXIgcmVnZXhwID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnJlZ2V4cDtcblx0ICAgIHZhciBwYXJhbU5hbWVzID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnBhcmFtTmFtZXM7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gdXJsLm1hdGNoKHJlZ2V4cCk7XG5cdCAgICB2YXIgcGFyYW1zID0gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIHBhcmFtTmFtZXMpO1xuXHRcblx0ICAgIHJldHVybiBtYXRjaCA/IHsgbWF0Y2g6IG1hdGNoLCByb3V0ZTogcm91dGUsIHBhcmFtczogcGFyYW1zIH0gOiBmYWxzZTtcblx0ICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcblx0ICAgIHJldHVybiBtO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBtYXRjaCh1cmwsIHJvdXRlcykge1xuXHQgIHJldHVybiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcylbMF0gfHwgZmFsc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJvb3QodXJsLCByb3V0ZXMpIHtcblx0ICB2YXIgbWF0Y2hlZCA9IGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciB1ID0gY2xlYW4ocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHJldHVybiB1ICE9PSAnJyAmJiB1ICE9PSAnKic7XG5cdCAgfSkpO1xuXHQgIHZhciBmYWxsYmFja1VSTCA9IGNsZWFuKHVybCk7XG5cdFxuXHQgIGlmIChtYXRjaGVkLmxlbmd0aCA+IDApIHtcblx0ICAgIHJldHVybiBtYXRjaGVkLm1hcChmdW5jdGlvbiAobSkge1xuXHQgICAgICByZXR1cm4gY2xlYW4odXJsLnN1YnN0cigwLCBtLm1hdGNoLmluZGV4KSk7XG5cdCAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJvb3QsIGN1cnJlbnQpIHtcblx0ICAgICAgcmV0dXJuIGN1cnJlbnQubGVuZ3RoIDwgcm9vdC5sZW5ndGggPyBjdXJyZW50IDogcm9vdDtcblx0ICAgIH0sIGZhbGxiYWNrVVJMKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZhbGxiYWNrVVJMO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpIHtcblx0ICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVtb3ZlR0VUUGFyYW1zKHVybCkge1xuXHQgIHJldHVybiB1cmwucmVwbGFjZSgvXFw/KC4qKT8kLywgJycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBOYXZpZ28ociwgdXNlSGFzaCkge1xuXHQgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgIHRoaXMucm9vdCA9IHVzZUhhc2ggJiYgciA/IHIucmVwbGFjZSgvXFwvJC8sICcvIycpIDogciB8fCBudWxsO1xuXHQgIHRoaXMuX3VzZUhhc2ggPSB1c2VIYXNoO1xuXHQgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gbnVsbDtcblx0ICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9vayA9ICF1c2VIYXNoICYmIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCk7XG5cdCAgdGhpcy5fbGlzdGVuKCk7XG5cdCAgdGhpcy51cGRhdGVQYWdlTGlua3MoKTtcblx0fVxuXHRcblx0TmF2aWdvLnByb3RvdHlwZSA9IHtcblx0ICBoZWxwZXJzOiB7XG5cdCAgICBtYXRjaDogbWF0Y2gsXG5cdCAgICByb290OiByb290LFxuXHQgICAgY2xlYW46IGNsZWFuXG5cdCAgfSxcblx0ICBuYXZpZ2F0ZTogZnVuY3Rpb24gbmF2aWdhdGUocGF0aCwgYWJzb2x1dGUpIHtcblx0ICAgIHZhciB0bztcblx0XG5cdCAgICBwYXRoID0gcGF0aCB8fCAnJztcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB0byA9ICghYWJzb2x1dGUgPyB0aGlzLl9nZXRSb290KCkgKyAnLycgOiAnJykgKyBjbGVhbihwYXRoKTtcblx0ICAgICAgdG8gPSB0by5yZXBsYWNlKC8oW146XSkoXFwvezIsfSkvZywgJyQxLycpO1xuXHQgICAgICBoaXN0b3J5W3RoaXMuX3BhdXNlZCA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHt9LCAnJywgdG8pO1xuXHQgICAgICB0aGlzLnJlc29sdmUoKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC8jKC4qKSQvLCAnJykgKyAnIycgKyBwYXRoO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBvbjogZnVuY3Rpb24gb24oKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgaWYgKGFyZ3MubGVuZ3RoID49IDIpIHtcblx0ICAgICAgdGhpcy5fYWRkKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuXHQgICAgfSBlbHNlIGlmIChfdHlwZW9mKGFyZ3NbMF0pID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB2YXIgb3JkZXJlZFJvdXRlcyA9IE9iamVjdC5rZXlzKGFyZ3NbMF0pLnNvcnQoY29tcGFyZVVybERlcHRoKTtcblx0XG5cdCAgICAgIG9yZGVyZWRSb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgICAgICBfdGhpcy5fYWRkKHJvdXRlLCBhcmdzWzBdW3JvdXRlXSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IGFyZ3NbMF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG5vdEZvdW5kOiBmdW5jdGlvbiBub3RGb3VuZChoYW5kbGVyKSB7XG5cdCAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBoYW5kbGVyO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZShjdXJyZW50KSB7XG5cdCAgICB2YXIgaGFuZGxlciwgbTtcblx0ICAgIHZhciB1cmwgPSAoY3VycmVudCB8fCB0aGlzLl9jTG9jKCkpLnJlcGxhY2UodGhpcy5fZ2V0Um9vdCgpLCAnJyk7XG5cdFxuXHQgICAgaWYgKHRoaXMuX3BhdXNlZCB8fCB1cmwgPT09IHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5fdXNlSGFzaCkge1xuXHQgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLyMvLCAnLycpO1xuXHQgICAgfVxuXHQgICAgdXJsID0gcmVtb3ZlR0VUUGFyYW1zKHVybCk7XG5cdCAgICBtID0gbWF0Y2godXJsLCB0aGlzLl9yb3V0ZXMpO1xuXHRcblx0ICAgIGlmIChtKSB7XG5cdCAgICAgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gdXJsO1xuXHQgICAgICBoYW5kbGVyID0gbS5yb3V0ZS5oYW5kbGVyO1xuXHQgICAgICBtLnJvdXRlLnJvdXRlIGluc3RhbmNlb2YgUmVnRXhwID8gaGFuZGxlci5hcHBseSh1bmRlZmluZWQsIF90b0NvbnN1bWFibGVBcnJheShtLm1hdGNoLnNsaWNlKDEsIG0ubWF0Y2gubGVuZ3RoKSkpIDogaGFuZGxlcihtLnBhcmFtcyk7XG5cdCAgICAgIHJldHVybiBtO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9kZWZhdWx0SGFuZGxlciAmJiAodXJsID09PSAnJyB8fCB1cmwgPT09ICcvJykpIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyKCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZEhhbmRsZXIpIHtcblx0ICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSxcblx0ICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXHQgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCk7XG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbCA6IG51bGw7XG5cdCAgfSxcblx0ICB1cGRhdGVQYWdlTGlua3M6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VMaW5rcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0XG5cdCAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXHRcblx0ICAgIHRoaXMuX2ZpbmRMaW5rcygpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0ICAgICAgaWYgKCFsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQpIHtcblx0ICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0ICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFxuXHQgICAgICAgICAgaWYgKCFzZWxmLl9kZXN0cm95ZWQpIHtcblx0ICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBzZWxmLm5hdmlnYXRlKGNsZWFuKGxvY2F0aW9uKSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSkge1xuXHQgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICByZXR1cm4gdGhpcy5fcm91dGVzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3V0ZSkge1xuXHQgICAgICB2YXIga2V5O1xuXHRcblx0ICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IG5hbWUpIHtcblx0ICAgICAgICByZXN1bHQgPSByb3V0ZS5yb3V0ZTtcblx0ICAgICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnOicgKyBrZXksIGRhdGFba2V5XSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LCAnJyk7XG5cdCAgfSxcblx0ICBsaW5rOiBmdW5jdGlvbiBsaW5rKHBhdGgpIHtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRSb290KCkgKyBwYXRoO1xuXHQgIH0sXG5cdCAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHN0YXR1cykge1xuXHQgICAgdGhpcy5fcGF1c2VkID0gc3RhdHVzO1xuXHQgIH0sXG5cdCAgZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlOiBmdW5jdGlvbiBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGUoKSB7XG5cdCAgICBpZiAoIWlzUHVzaFN0YXRlQXZhaWxhYmxlKCkpIHtcblx0ICAgICAgdGhpcy5kZXN0cm95KCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfYWRkOiBmdW5jdGlvbiBfYWRkKHJvdXRlKSB7XG5cdCAgICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgaWYgKCh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaGFuZGxlcikpID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlci51c2VzLCBuYW1lOiBoYW5kbGVyLmFzIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fYWRkO1xuXHQgIH0sXG5cdCAgX2dldFJvb3Q6IGZ1bmN0aW9uIF9nZXRSb290KCkge1xuXHQgICAgaWYgKHRoaXMucm9vdCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMucm9vdDtcblx0ICAgIHRoaXMucm9vdCA9IHJvb3QodGhpcy5fY0xvYygpLCB0aGlzLl9yb3V0ZXMpO1xuXHQgICAgcmV0dXJuIHRoaXMucm9vdDtcblx0ICB9LFxuXHQgIF9saXN0ZW46IGZ1bmN0aW9uIF9saXN0ZW4oKSB7XG5cdCAgICB2YXIgX3RoaXMyID0gdGhpcztcblx0XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgX3RoaXMyLnJlc29sdmUoKTtcblx0ICAgICAgfTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIGNhY2hlZCA9IF90aGlzMi5fY0xvYygpLFxuXHQgICAgICAgICAgICBjdXJyZW50ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgICAgICBfY2hlY2sgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICAgIF9jaGVjayA9IGZ1bmN0aW9uIGNoZWNrKCkge1xuXHQgICAgICAgICAgY3VycmVudCA9IF90aGlzMi5fY0xvYygpO1xuXHQgICAgICAgICAgaWYgKGNhY2hlZCAhPT0gY3VycmVudCkge1xuXHQgICAgICAgICAgICBjYWNoZWQgPSBjdXJyZW50O1xuXHQgICAgICAgICAgICBfdGhpczIucmVzb2x2ZSgpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgX3RoaXMyLl9saXN0ZW5uaW5nSW50ZXJ2YWwgPSBzZXRUaW1lb3V0KF9jaGVjaywgMjAwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICAgIF9jaGVjaygpO1xuXHQgICAgICB9KSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2NMb2M6IGZ1bmN0aW9uIF9jTG9jKCkge1xuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0ICB9LFxuXHQgIF9maW5kTGlua3M6IGZ1bmN0aW9uIF9maW5kTGlua3MoKSB7XG5cdCAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uYXZpZ29dJykpO1xuXHQgIH1cblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE5hdmlnbztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdmlnby5qcy5tYXAiLCIndXNlIHN0cmljdCc7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO3ZhciBzY3JvbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIHdpbmRvdy5zY3JvbGxUbygwLGEpfSxzdGF0ZT1mdW5jdGlvbigpe3JldHVybiBoaXN0b3J5LnN0YXRlP2hpc3Rvcnkuc3RhdGUuc2Nyb2xsUG9zaXRpb246MH0sc2F2ZT1mdW5jdGlvbigpe3ZhciBhPTA8YXJndW1lbnRzLmxlbmd0aCYmYXJndW1lbnRzWzBdIT09dm9pZCAwP2FyZ3VtZW50c1swXTpudWxsO3dpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7c2Nyb2xsUG9zaXRpb246YXx8d2luZG93LnBhZ2VZT2Zmc2V0fHx3aW5kb3cuc2Nyb2xsWX0sJycpfSxyZXN0b3JlPWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOm51bGwsYj1zdGF0ZSgpO2E/YShiKTpzY3JvbGwoYil9LGluaXQ9ZnVuY3Rpb24oKXsnc2Nyb2xsUmVzdG9yYXRpb24naW4gaGlzdG9yeSYmKGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb249J21hbnVhbCcsc2Nyb2xsKHN0YXRlKCkpLHdpbmRvdy5vbmJlZm9yZXVubG9hZD1mdW5jdGlvbigpe3JldHVybiBzYXZlKCl9KX07ZXhwb3J0cy5kZWZhdWx0PSd1bmRlZmluZWQnPT10eXBlb2Ygd2luZG93P3t9Ontpbml0OmluaXQsc2F2ZTpzYXZlLHJlc3RvcmU6cmVzdG9yZSxzdGF0ZTpzdGF0ZX07IiwiZnVuY3Rpb24gbmV4dChhcmdzKXtcbiAgYXJncy5sZW5ndGggPiAwICYmIGFyZ3Muc2hpZnQoKS5hcHBseSh0aGlzLCBhcmdzKVxufVxuXG5mdW5jdGlvbiBydW4oY2IsIGFyZ3Mpe1xuICBjYigpXG4gIG5leHQoYXJncylcbn1cblxuZnVuY3Rpb24gdGFycnkoY2IsIGRlbGF5KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICB2YXIgb3ZlcnJpZGUgPSBhcmdzWzBdXG4gICAgXG4gICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygb3ZlcnJpZGUpe1xuICAgICAgcmV0dXJuIHRhcnJ5KGNiLCBvdmVycmlkZSlcbiAgICB9XG4gICAgXG4gICAgJ251bWJlcicgPT09IHR5cGVvZiBkZWxheSA/IChcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgcnVuKGNiLCBhcmdzKVxuICAgICAgfSwgZGVsYXkpIFxuICAgICkgOiAoXG4gICAgICBydW4oY2IsIGFyZ3MpXG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXVlKCl7XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gIHJldHVybiB0YXJyeShmdW5jdGlvbigpe1xuICAgIG5leHQoYXJncy5zbGljZSgwKSlcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0ge1xuICB0YXJyeTogdGFycnksXG4gIHF1ZXVlOiBxdWV1ZVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wcyA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtLXByb3BzJyk7XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHJhbnNmb3JtUHJvcHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaCA9IGZ1bmN0aW9uIGgodGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA/IGFwcGx5UHJvcHModGFnKShhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIDogYXBwZW5kQ2hpbGRyZW4odGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG52YXIgaXNPYmogPSBmdW5jdGlvbiBpc09iaihvKSB7XG4gIHJldHVybiBvICE9PSBudWxsICYmICh0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobykpID09PSAnb2JqZWN0Jztcbn07XG5cbnZhciBpc1Byb3BzID0gZnVuY3Rpb24gaXNQcm9wcyhhcmcpIHtcbiAgcmV0dXJuIGlzT2JqKGFyZykgJiYgIShhcmcgaW5zdGFuY2VvZiBFbGVtZW50KTtcbn07XG5cbnZhciBhcHBseVByb3BzID0gZnVuY3Rpb24gYXBwbHlQcm9wcyh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHJldHVybiBoKHRhZykoT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWwgPSBoKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgdmFyIHAgPSAoMCwgX3RyYW5zZm9ybVByb3BzMi5kZWZhdWx0KShwcm9wcyk7XG4gICAgICBPYmplY3Qua2V5cyhwKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmICgvXm9uLy50ZXN0KGspKSB7XG4gICAgICAgICAgZWxba10gPSBwW2tdO1xuICAgICAgICB9IGVsc2UgaWYgKGsgPT09ICdfX2h0bWwnKSB7XG4gICAgICAgICAgZWwuaW5uZXJIVE1MID0gcFtrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoaywgcFtrXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gIH07XG59O1xuXG52YXIgYXBwZW5kQ2hpbGRyZW4gPSBmdW5jdGlvbiBhcHBlbmRDaGlsZHJlbih0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgY2hpbGRyZW4gPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGNoaWxkcmVuW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICBjaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjIGluc3RhbmNlb2YgRWxlbWVudCA/IGMgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gZWwuYXBwZW5kQ2hpbGQoYyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsO1xuICB9O1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gaDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIga2ViYWIgPSBleHBvcnRzLmtlYmFiID0gZnVuY3Rpb24ga2ViYWIoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoZykge1xuICAgIHJldHVybiAnLScgKyBnLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufTtcblxudmFyIHBhcnNlVmFsdWUgPSBleHBvcnRzLnBhcnNlVmFsdWUgPSBmdW5jdGlvbiBwYXJzZVZhbHVlKHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyBhZGRQeChwcm9wKSh2YWwpIDogdmFsO1xuICB9O1xufTtcblxudmFyIHVuaXRsZXNzUHJvcGVydGllcyA9IGV4cG9ydHMudW5pdGxlc3NQcm9wZXJ0aWVzID0gWydsaW5lSGVpZ2h0JywgJ2ZvbnRXZWlnaHQnLCAnb3BhY2l0eScsICd6SW5kZXgnXG4vLyBQcm9iYWJseSBuZWVkIGEgZmV3IG1vcmUuLi5cbl07XG5cbnZhciBhZGRQeCA9IGV4cG9ydHMuYWRkUHggPSBmdW5jdGlvbiBhZGRQeChwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHVuaXRsZXNzUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wKSA/IHZhbCA6IHZhbCArICdweCc7XG4gIH07XG59O1xuXG52YXIgZmlsdGVyTnVsbCA9IGV4cG9ydHMuZmlsdGVyTnVsbCA9IGZ1bmN0aW9uIGZpbHRlck51bGwob2JqKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG9ialtrZXldICE9PSBudWxsO1xuICB9O1xufTtcblxudmFyIGNyZWF0ZURlYyA9IGV4cG9ydHMuY3JlYXRlRGVjID0gZnVuY3Rpb24gY3JlYXRlRGVjKHN0eWxlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtlYmFiKGtleSkgKyAnOicgKyBwYXJzZVZhbHVlKGtleSkoc3R5bGVba2V5XSk7XG4gIH07XG59O1xuXG52YXIgc3R5bGVUb1N0cmluZyA9IGV4cG9ydHMuc3R5bGVUb1N0cmluZyA9IGZ1bmN0aW9uIHN0eWxlVG9TdHJpbmcoc3R5bGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlKS5maWx0ZXIoZmlsdGVyTnVsbChzdHlsZSkpLm1hcChjcmVhdGVEZWMoc3R5bGUpKS5qb2luKCc7Jyk7XG59O1xuXG52YXIgaXNTdHlsZU9iamVjdCA9IGV4cG9ydHMuaXNTdHlsZU9iamVjdCA9IGZ1bmN0aW9uIGlzU3R5bGVPYmplY3QocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2V5ID09PSAnc3R5bGUnICYmIHByb3BzW2tleV0gIT09IG51bGwgJiYgX3R5cGVvZihwcm9wc1trZXldKSA9PT0gJ29iamVjdCc7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlU3R5bGUgPSBleHBvcnRzLmNyZWF0ZVN0eWxlID0gZnVuY3Rpb24gY3JlYXRlU3R5bGUocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaXNTdHlsZU9iamVjdChwcm9wcykoa2V5KSA/IHN0eWxlVG9TdHJpbmcocHJvcHNba2V5XSkgOiBwcm9wc1trZXldO1xuICB9O1xufTtcblxudmFyIHJlZHVjZVByb3BzID0gZXhwb3J0cy5yZWR1Y2VQcm9wcyA9IGZ1bmN0aW9uIHJlZHVjZVByb3BzKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYSwga2V5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYSwgX2RlZmluZVByb3BlcnR5KHt9LCBrZXksIGNyZWF0ZVN0eWxlKHByb3BzKShrZXkpKSk7XG4gIH07XG59O1xuXG52YXIgdHJhbnNmb3JtUHJvcHMgPSBleHBvcnRzLnRyYW5zZm9ybVByb3BzID0gZnVuY3Rpb24gdHJhbnNmb3JtUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKS5yZWR1Y2UocmVkdWNlUHJvcHMocHJvcHMpLCB7fSk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB0cmFuc2Zvcm1Qcm9wczsiLCJjb25zdCBjcmVhdGVCYXIgPSAocm9vdCwgY2xhc3NuYW1lKSA9PiB7XG4gIGxldCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgbGV0IGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gIG8uY2xhc3NOYW1lID0gY2xhc3NuYW1lIFxuICBpLmNsYXNzTmFtZSA9IGAke2NsYXNzbmFtZX1fX2lubmVyYFxuICBvLmFwcGVuZENoaWxkKGkpXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKG8sIHJvb3QuY2hpbGRyZW5bMF0pXG5cbiAgcmV0dXJuIHtcbiAgICBvdXRlcjogbyxcbiAgICBpbm5lcjogaVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChyb290ID0gZG9jdW1lbnQuYm9keSwgb3B0cyA9IHt9KSA9PiB7XG4gIGxldCB0aW1lciA9IG51bGxcbiAgY29uc3Qgc3BlZWQgPSBvcHRzLnNwZWVkIHx8IDIwMFxuICBjb25zdCBjbGFzc25hbWUgPSBvcHRzLmNsYXNzbmFtZSB8fCAncHV0eidcbiAgY29uc3QgdHJpY2tsZSA9IG9wdHMudHJpY2tsZSB8fCA1IFxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHByb2dyZXNzOiAwXG4gIH1cblxuICBjb25zdCBiYXIgPSBjcmVhdGVCYXIocm9vdCwgY2xhc3NuYW1lKVxuXG4gIGNvbnN0IHJlbmRlciA9ICh2YWwgPSAwKSA9PiB7XG4gICAgc3RhdGUucHJvZ3Jlc3MgPSB2YWxcbiAgICBiYXIuaW5uZXIuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgke3N0YXRlLmFjdGl2ZSA/ICcwJyA6ICctMTAwJSd9KSB0cmFuc2xhdGVYKCR7LTEwMCArIHN0YXRlLnByb2dyZXNzfSUpO2BcbiAgfVxuXG4gIGNvbnN0IGdvID0gdmFsID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgcmVuZGVyKE1hdGgubWluKHZhbCwgOTUpKVxuICB9XG5cbiAgY29uc3QgaW5jID0gKHZhbCA9IChNYXRoLnJhbmRvbSgpICogdHJpY2tsZSkpID0+IGdvKHN0YXRlLnByb2dyZXNzICsgdmFsKVxuXG4gIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSBmYWxzZVxuICAgIHJlbmRlcigxMDApXG4gICAgc2V0VGltZW91dCgoKSA9PiByZW5kZXIoKSwgc3BlZWQpXG4gICAgaWYgKHRpbWVyKXsgY2xlYXJUaW1lb3V0KHRpbWVyKSB9XG4gIH1cblxuICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICBzdGF0ZS5hY3RpdmUgPSB0cnVlXG4gICAgaW5jKClcbiAgfVxuXG4gIGNvbnN0IHB1dHogPSAoaW50ZXJ2YWwgPSA1MDApID0+IHtcbiAgICBpZiAoIXN0YXRlLmFjdGl2ZSl7IHJldHVybiB9XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiBpbmMoKSwgaW50ZXJ2YWwpXG4gIH1cbiAgXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKHtcbiAgICBwdXR6LFxuICAgIHN0YXJ0LFxuICAgIGluYyxcbiAgICBnbyxcbiAgICBlbmQsXG4gICAgZ2V0U3RhdGU6ICgpID0+IHN0YXRlXG4gIH0se1xuICAgIGJhcjoge1xuICAgICAgdmFsdWU6IGJhclxuICAgIH1cbiAgfSlcbn1cbiIsImNvbnN0IGZpbmRMaW5rID0gKGlkLCBkYXRhKSA9PiBkYXRhLmZpbHRlcihsID0+IGwuaWQgPT09IGlkKVswXVxuXG5jb25zdCBjcmVhdGVMaW5rID0gKHsgYW5zd2VycyB9LCBkYXRhKSA9PiBhbnN3ZXJzLmZvckVhY2goYSA9PiB7XG4gIGxldCBpc1BhdGggPSAvXlxcLy8udGVzdChhLm5leHQpID8gdHJ1ZSA6IGZhbHNlXG4gIGxldCBpc0dJRiA9IC9naWYvLnRlc3QoYS5uZXh0KSA/IHRydWUgOiBmYWxzZVxuICBhLm5leHQgPSBpc1BhdGggfHwgaXNHSUYgPyBhLm5leHQgOiBmaW5kTGluayhhLm5leHQsIGRhdGEpXG59KVxuXG5leHBvcnQgY29uc3QgY3JlYXRlU3RvcmUgPSAocXVlc3Rpb25zKSA9PiB7XG5cdHF1ZXN0aW9ucy5tYXAocSA9PiBjcmVhdGVMaW5rKHEsIHF1ZXN0aW9ucykpXG5cdHJldHVybiBxdWVzdGlvbnNcbn1cblxuZXhwb3J0IGRlZmF1bHQgcXVlc3Rpb25zID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzdG9yZTogY3JlYXRlU3RvcmUocXVlc3Rpb25zKSxcbiAgICBnZXRBY3RpdmU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZS5maWx0ZXIocSA9PiBxLmlkID09IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KC8jLylbMV0pWzBdIHx8IHRoaXMuc3RvcmVbMF1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IFtcbiAge1xuICAgIGlkOiAxLFxuICAgIHByb21wdDogYEhpISBXaGF0IGJyaW5ncyB5b3UgdG8gdGhpcyBuZWNrIG9mIHRoZSB3ZWI/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnV2hvIHIgdT8nLFxuICAgICAgICBuZXh0OiAyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEknbSBoaXJpbmcuYCxcbiAgICAgICAgbmV4dDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBJdCdzIHlvdXIgbW90aGVyLmAsXG4gICAgICAgIG5leHQ6IDRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgRnVubnkgam9rZXMsIHBsei5gLFxuICAgICAgICBuZXh0OiA1XG4gICAgICB9XG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMixcbiAgICBwcm9tcHQ6IGBJJ20gbWVsYW5pZSDigJMgYSBncmFwaGljIGRlc2lnbmVyIHdvcmtpbmcgaW4gZXhwZXJpZW50aWFsIG1hcmtldGluZyAmIHByb3VkIElvd2FuIHRyeWluZyB0byBlYXQgQUxMIHRoZSBCTFRzLmAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYFdoYXQncyBleHBlcmllbnRpYWw/YCxcbiAgICAgICAgbmV4dDogNlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBXaGF0J3MgYSBCTFQ/YCxcbiAgICAgICAgbmV4dDogN1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiAzLFxuICAgIHByb21wdDogYFJhZC4gQ2FuIEkgc2hvdyB5b3Ugc29tZSBwcm9qZWN0cyBJJ3ZlIHdvcmtlZCBvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBZZXMsIHBsZWFzZSFgLFxuICAgICAgICBuZXh0OiAnL3dvcmsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYE5haCwgdGVsbCBtZSBhYm91dCB5b3UuYCxcbiAgICAgICAgbmV4dDogJy9hYm91dCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgSSdsbCBlbWFpbCB5b3UgaW5zdGVhZC5gLFxuICAgICAgICBuZXh0OiAnL2NvbnRhY3QnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDQsXG4gICAgcHJvbXB0OiBgSGkgbW9tLiBJIGxvdmUgeW91IWAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYGprLCBub3QgeW91ciBtb21gLFxuICAgICAgICBuZXh0OiA5XG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDUsXG4gICAgcHJvbXB0OiBgV2hhdCdzIGZ1bm5pZXIgdGhhbiBhIHJoZXRvcmljYWwgcXVlc3Rpb24/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgWWVzYCxcbiAgICAgICAgbmV4dDogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgTm9gLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvUDJIeTg4ckFqUWRzUS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDYsXG4gICAgcHJvbXB0OiBgRXhwZXJpZW50aWFsIG1hcmtldGluZyBlbmdhZ2VzIGRpcmVjdGx5IHdpdGggY29uc3VtZXJzLCBpbnZpdGluZyB0aGVtIHRvIHBhcnRpY3BhdGUgaW4gdGhlIGV2b2x1dGlvbiBvZiBhIGJyYW5kLmAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYFNvdW5kcyBjb29sLiBXaGF0IGhhdmUgeW91IGRvbmU/YCxcbiAgICAgICAgbmV4dDogJy93b3JrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBXaHkgZG8geW91IGxpa2UgaXQ/YCxcbiAgICAgICAgbmV4dDogMTFcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogNyxcbiAgICBwcm9tcHQ6IGBZb3UgdGVsbCBtZS5gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCZWVmIExpdmVyIFRvYXN0YCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL29GT3MxMFNKU256b3MvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBCZXJyeSBMZW1vbiBUYXJ0YCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzNvN1RLd21uRGdRYjVqZW1qSy9naXBoeS5naWYnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogYEJhY29uIExldHR1Y2UgVG9tYXRvYCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL2ZxenhjbWxZN29wT2cvZ2lwaHkuZ2lmJ1xuICAgICAgfSxcbiAgICBdXG4gIH0sXG5cbiAge1xuICAgIGlkOiA5LFxuICAgIHByb21wdDogYENsaWNraW5nIGZvciBmdW4/IEdvb2QgbHVjayB3aXRoIHRoaXMgb25lLmAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYEJsdWUgUGlsbGAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9HN0dOb2FVU0g3c01VL2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgUmVkIFBpbGxgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvVWp1akdZM21BM0psZS9naXBoeS5naWYnXG4gICAgICB9LFxuICAgIF1cbiAgfSxcblxuICB7XG4gICAgaWQ6IDEwLFxuICAgIHByb21wdDogYFBhbmNha2VzIG9yIHdhZmZsZXM/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgRnJlbmNoIFRvYXN0YCxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzE0bmI2VGxJUmxhTjF1L2dpcGh5LmdpZidcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTEsXG4gICAgcHJvbXB0OiBgSSBsaWtlIGV4cGVyaWVudGlhbCBiZWNhdXNlIGl0J3MganVzdCBzdXBlciBjb29sLCBva2F5P2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYFdoYXQgYXJlIHlvdXIgZmF2b3JpdGUgcHJvamVjdHM/YCxcbiAgICAgICAgbmV4dDogMTRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiBgSSBoYXZlIHF1ZXN0aW9ucyEgQ2FuIEkgZW1haWwgeW91P2AsXG4gICAgICAgIG5leHQ6ICcvY29udGFjdCdcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXG4gIHtcbiAgICBpZDogMTQsXG4gICAgcHJvbXB0OiBgSSBsb3ZlIHRoZSB3b3JrIEkndmUgZG9uZSwgYnV0IHRoZXNlIHByb2plY3RzIGRlc2VydmUgc29tZSBzZXJpb3VzIHByb3BzLmAsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogYHByb2plY3QgMWAsXG4gICAgICAgIG5leHQ6ICdodHRwczovL3R3aXR0ZXIuY29tJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBwcm9qZWN0IDJgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly90d2l0dGVyLmNvbSdcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgdmFsdWU6IGBwcm9qZWN0IDNgLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly90d2l0dGVyLmNvbSdcbiAgICAgIH0sXG4gICAgXVxuICB9LFxuXVxuIiwiaW1wb3J0IGgwIGZyb20gJ2gwJ1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuLi9saWIvY29sb3JzJ1xuXG5leHBvcnQgY29uc3QgZGl2ID0gaDAoJ2RpdicpXG5leHBvcnQgY29uc3QgYnV0dG9uID0gaDAoJ2J1dHRvbicpKHtjbGFzczogJ2gyIG12MCBpbmxpbmUtYmxvY2snfSlcbmV4cG9ydCBjb25zdCB0aXRsZSA9IGgwKCdwJykoe2NsYXNzOiAnaDEgbXQwIG1iMDUgY2InfSlcblxuZXhwb3J0IGNvbnN0IHRlbXBsYXRlID0gKHtwcm9tcHQsIGFuc3dlcnN9LCBjYikgPT4ge1xuICByZXR1cm4gZGl2KHtjbGFzczogJ3F1ZXN0aW9uJ30pKFxuICAgIHRpdGxlKHByb21wdCksXG4gICAgZGl2KFxuICAgICAgLi4uYW5zd2Vycy5tYXAoKGEsIGkpID0+IGJ1dHRvbih7XG4gICAgICAgIG9uY2xpY2s6IChlKSA9PiBjYihhLm5leHQpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiBjb2xvcnMuY29sb3JzW2ldXG4gICAgICAgIH1cbiAgICAgIH0pKGEudmFsdWUpKVxuICAgIClcbiAgKVxufVxuIiwiaW1wb3J0IHsgdGFycnksIHF1ZXVlIH0gZnJvbSAndGFycnkuanMnXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2lmJylcbiAgY29uc3QgaW1nID0gbW9kYWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdXG5cbiAgY29uc3Qgc2hvdyA9IHRhcnJ5KCgpID0+IG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snKSBcbiAgY29uc3QgaGlkZSA9IHRhcnJ5KCgpID0+IG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScpIFxuICBjb25zdCB0b2dnbGUgPSB0YXJyeShcbiAgICAoKSA9PiBtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpIFxuICAgICAgPyBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgOiBtb2RhbC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKVxuICApXG5cbiAgY29uc3QgbGF6eSA9ICh1cmwsIGNiKSA9PiB7XG4gICAgbGV0IGJ1cm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cbiAgICBidXJuZXIub25sb2FkID0gKCkgPT4gY2IodXJsKVxuXG4gICAgYnVybmVyLnNyYyA9IHVybFxuICB9XG5cbiAgY29uc3Qgb3BlbiA9IHVybCA9PiB7XG4gICAgd2luZG93LmxvYWRlci5zdGFydCgpXG4gICAgd2luZG93LmxvYWRlci5wdXR6KDUwMClcblxuICAgIGxhenkodXJsLCB1cmwgPT4ge1xuICAgICAgaW1nLnNyYyA9IHVybFxuICAgICAgcXVldWUoc2hvdywgdG9nZ2xlKDIwMCkpKClcbiAgICAgIHdpbmRvdy5sb2FkZXIuZW5kKClcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgcXVldWUodG9nZ2xlLCBoaWRlKDIwMCkpKClcbiAgfVxuXG4gIG1vZGFsLm9uY2xpY2sgPSBjbG9zZVxuXG4gIHJldHVybiB7XG4gICAgb3BlbixcbiAgICBjbG9zZVxuICB9XG59XG4iLCJpbXBvcnQgcm91dGVyIGZyb20gJy4uL2xpYi9yb3V0ZXInXG5pbXBvcnQgcXVlc3Rpb25zIGZyb20gJy4vZGF0YS9pbmRleC5qcydcbmltcG9ydCBzdG9yYWdlIGZyb20gJy4vZGF0YSdcbmltcG9ydCBnaWZmZXIgZnJvbSAnLi9naWZmZXInXG5pbXBvcnQgeyB0ZW1wbGF0ZSB9IGZyb20gJy4vZWxlbWVudHMnXG5cbmxldCBwcmV2XG5jb25zdCBkYXRhID0gc3RvcmFnZShxdWVzdGlvbnMpXG5cbi8qKlxuICogUmVuZGVyIHRlbXBsYXRlIGFuZCBhcHBlbmQgdG8gRE9NXG4gKi9cbmNvbnN0IHJlbmRlciA9IChuZXh0KSA9PiB7XG4gIGxldCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcblxuICBsZXQgZWwgPSB0ZW1wbGF0ZShuZXh0LCB1cGRhdGUpXG4gIHF1ZXN0aW9uUm9vdCAmJiBxdWVzdGlvblJvb3QuYXBwZW5kQ2hpbGQoZWwpXG4gIHJldHVybiBlbCBcbn1cblxuLyoqXG4gKiBIYW5kbGUgRE9NIHVwZGF0ZXMsIG90aGVyIGxpbmsgY2xpY2tzXG4gKi9cbmNvbnN0IHVwZGF0ZSA9IChuZXh0KSA9PiB7XG4gIGxldCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcblxuICBsZXQgaXNHSUYgPSAvZ2lwaHkvLnRlc3QobmV4dClcbiAgaWYgKGlzR0lGKSByZXR1cm4gZ2lmZmVyKCkub3BlbihuZXh0KVxuXG4gIGxldCBpc1BhdGggPSAvXlxcLy8udGVzdChuZXh0KVxuICBpZiAoaXNQYXRoKSByZXR1cm4gcm91dGVyLmdvKG5leHQpXG5cbiAgaWYgKHByZXYgJiYgcXVlc3Rpb25Sb290ICYmIHF1ZXN0aW9uUm9vdC5jb250YWlucyhwcmV2KSkgcXVlc3Rpb25Sb290LnJlbW92ZUNoaWxkKHByZXYpXG5cbiAgcHJldiA9IHJlbmRlcihuZXh0KVxuXG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV4dC5pZFxufVxuXG4vKipcbiAqIFdhaXQgdW50aWwgbmV3IERPTSBpcyBwcmVzZW50IGJlZm9yZVxuICogdHJ5aW5nIHRvIHJlbmRlciB0byBpdFxuICovXG5yb3V0ZXIub24oJ3JvdXRlOmFmdGVyJywgKHsgcm91dGUgfSkgPT4ge1xuICBpZiAocm91dGUgPT09ICcnIHx8IC8oXlxcL3xcXC8jWzAtOV18I1swLTldKS8udGVzdChyb3V0ZSkpe1xuICAgIHVwZGF0ZShkYXRhLmdldEFjdGl2ZSgpKVxuICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHByZXYgPSByZW5kZXIoZGF0YS5nZXRBY3RpdmUoKSlcbn1cbiIsImltcG9ydCBwdXR6IGZyb20gJ3B1dHonXG5pbXBvcnQgcm91dGVyIGZyb20gJy4vbGliL3JvdXRlcidcbmltcG9ydCBhcHAgZnJvbSAnLi9hcHAnXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vbGliL2NvbG9ycydcblxuY29uc3QgbG9hZGVyID0gd2luZG93LmxvYWRlciA9IHB1dHooZG9jdW1lbnQuYm9keSwge1xuICBzcGVlZDogMTAwLFxuICB0cmlja2xlOiAxMFxufSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGFwcCgpXG5cbiAgcm91dGVyLm9uKCdyb3V0ZTphZnRlcicsICh7IHJvdXRlIH0pID0+IHtcbiAgICBjb2xvcnMudXBkYXRlKClcbiAgfSlcblxuICBjb2xvcnMudXBkYXRlKClcbn0pXG4iLCJjb25zdCByb290U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHJvb3RTdHlsZSlcblxuY29uc3QgY29sb3JzID0gW1xuICAnIzM1RDNFOCcsXG4gICcjRkY0RTQyJyxcbiAgJyNGRkVBNTEnXG5dXG5cbmNvbnN0IHJhbmRvbUNvbG9yID0gKCkgPT4gY29sb3JzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgyIC0gMCkgKyAwKV1cblxuY29uc3Qgc2F2ZUNvbG9yID0gYyA9PiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbWpzJywgSlNPTi5zdHJpbmdpZnkoe1xuICBjb2xvcjogY1xufSkpXG5cbmNvbnN0IHJlYWRDb2xvciA9ICgpID0+IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtanMnKSA/IChcbiAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWpzJykpLmNvbG9yXG4pIDogKFxuICBudWxsXG4pXG5cbmNvbnN0IGdldENvbG9yID0gKCkgPT4ge1xuICBsZXQgYyA9IHJhbmRvbUNvbG9yKClcbiAgbGV0IHByZXYgPSByZWFkQ29sb3IoKVxuXG4gIHdoaWxlIChjID09PSBwcmV2KXtcbiAgICBjID0gcmFuZG9tQ29sb3IoKVxuICB9XG5cbiAgc2F2ZUNvbG9yKGMpXG4gIHJldHVybiBjXG59XG5cbmNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgbGV0IGNvbG9yID0gZ2V0Q29sb3IoKVxuICBcbiAgcm9vdFN0eWxlLmlubmVySFRNTCA9IGBcbiAgICBib2R5IHsgY29sb3I6ICR7Y29sb3J9IH1cbiAgICA6Oi1tb3otc2VsZWN0aW9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7Y29sb3J9O1xuICAgIH1cbiAgICA6OnNlbGVjdGlvbiB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfTtcbiAgICB9XG4gICAgLnRoZW1lIGEge1xuICAgICAgY29sb3I6ICR7Y29sb3J9XG4gICAgfVxuICBgXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXBkYXRlOiB1cGRhdGUsXG4gIGNvbG9yc1xufVxuIiwiaW1wb3J0IG9wZXJhdG9yIGZyb20gJ29wZXJhdG9yLmpzJ1xuXG4vKipcbiAqIFNlbmQgcGFnZSB2aWV3cyB0byBcbiAqIEdvb2dsZSBBbmFseXRpY3NcbiAqL1xuY29uc3QgZ2FUcmFja1BhZ2VWaWV3ID0gKHBhdGgsIHRpdGxlKSA9PiB7XG4gIGxldCBnYSA9IHdpbmRvdy5nYSA/IHdpbmRvdy5nYSA6IGZhbHNlXG5cbiAgaWYgKCFnYSkgcmV0dXJuXG5cbiAgZ2EoJ3NldCcsIHtwYWdlOiBwYXRoLCB0aXRsZTogdGl0bGV9KTtcbiAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbn1cblxuY29uc3QgYXBwID0gb3BlcmF0b3Ioe1xuICByb290OiAnI3Jvb3QnXG59KVxuXG5hcHAub24oJ3JvdXRlOmFmdGVyJywgKHsgcm91dGUsIHRpdGxlIH0pID0+IHtcbiAgZ2FUcmFja1BhZ2VWaWV3KHJvdXRlLCB0aXRsZSlcbn0pXG5cbmFwcC5vbigndHJhbnNpdGlvbjphZnRlcicsICgpID0+IGxvYWRlciAmJiBsb2FkZXIuZW5kKCkpXG5cbndpbmRvdy5hcHAgPSBhcHBcblxuZXhwb3J0IGRlZmF1bHQgYXBwXG4iXX0=
