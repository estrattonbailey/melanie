(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	var FOLLOWED_BY_SLASH_REGEXP = '(?:\/|$)';
	
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
	    if (arguments.length >= 2) {
	      this._add(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
	    } else if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
	      for (var route in arguments.length <= 0 ? undefined : arguments[0]) {
	        this._add(route, (arguments.length <= 0 ? undefined : arguments[0])[route]);
	      }
	    } else if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function') {
	      this._defaultHandler = arguments.length <= 0 ? undefined : arguments[0];
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
	    m = match(url, this._routes);
	
	    if (m) {
	      this._lastRouteResolved = url;
	      handler = m.route.handler;
	      m.route.route instanceof RegExp ? handler.apply(undefined, _toConsumableArray(m.match.slice(1, m.match.length))) : handler(m.params);
	      return m;
	    } else if (this._defaultHandler && (url === '' || url === '/')) {
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
	    var _this = this;
	
	    if (this._ok) {
	      window.onpopstate = function () {
	        _this.resolve();
	      };
	    } else {
	      (function () {
	        var cached = _this._cLoc(),
	            current = undefined,
	            _check = undefined;
	
	        _check = function check() {
	          current = _this._cLoc();
	          if (cached !== current) {
	            cached = current;
	            _this.resolve();
	          }
	          _this._listenningInterval = setTimeout(_check, 200);
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

},{}],2:[function(require,module,exports){
module.exports = function(str) {
  var hash = 5381,
      i    = str.length

  while(i)
    hash = (hash * 33) ^ str.charCodeAt(--i)

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, if the high bit
   * is set, unset it and add it back in through (64-bit IEEE) addition. */
  return hash >= 0 ? hash : (hash & 0x7FFFFFFF) + 0x80000000
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  prompt: 'Hi :) welcome to my site. What are you looking for?',
  answers: [{
    value: 'my work',
    next: 'Why?'
  }, {
    value: 'funny jokes',
    next: 'What\'s funnier than a rhetoical question?'
  }, {
    value: 'GIFs',
    next: '/gifs'
  }]
}, {
  prompt: 'Why?',
  answers: [{
    value: 'I want to hire you!',
    next: 'Mom?'
  }, {
    value: 'just curious',
    next: 'Mom?'
  }]
}, {
  prompt: 'What\'s funnier than a rhetorical question?',
  answers: [{
    value: 'Yes',
    next: 'Hi :) welcome to my site. What are you looking for?'
  }, {
    value: 'No',
    next: 'Hi :) welcome to my site. What are you looking for?'
  }]
}, {
  prompt: 'Mom?',
  answers: [{
    value: 'I love you, honey!',
    next: 'https://media.giphy.com/media/FGTVmzksb2j0k/giphy.gif'
  }, {
    value: 'what, no',
    next: '/work'
  }]
}];

},{}],4:[function(require,module,exports){
'use strict';

var _h = require('h0');

var _h2 = _interopRequireDefault(_h);

var _navigo = require('navigo');

var _navigo2 = _interopRequireDefault(_navigo);

var _test = require('./data/test');

var _test2 = _interopRequireDefault(_test);

var _data = require('./lib/data');

var _elements = require('./lib/elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _navigo2.default(window.location.origin);

var container = document.getElementById('app');

var DATA = (0, _data.createStore)(_test2.default);

var prev = void 0;

var update = function update(next) {
  var isPath = typeof next === 'string' && next.match(/^\//) ? true : false;
  if (isPath) return router.navigate(next);

  if (prev) container.removeChild(prev);

  prev = render(next);

  router.navigate('#' + next.id);
};

var render = function render(next) {
  var el = (0, _elements.template)(next, update);
  container.appendChild(el);
  return el;
};

window.addEventListener('DOMContentLoaded', function () {
  var curr = DATA.filter(function (q) {
    return q.id == window.location.hash.split(/#/)[1];
  })[0];
  prev = render(curr ? curr : DATA[0]);
});

},{"./data/test":3,"./lib/data":5,"./lib/elements":6,"h0":7,"navigo":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = undefined;

var _stringHash = require('string-hash');

var _stringHash2 = _interopRequireDefault(_stringHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findLink = function findLink(hash, data) {
  return data.filter(function (l) {
    return l.id === hash;
  })[0];
};

var addHash = function addHash(_ref) {
  var prompt = _ref.prompt;
  var answers = _ref.answers;
  return { id: (0, _stringHash2.default)(prompt), prompt: prompt, answers: answers };
};

var createLink = function createLink(_ref2, data) {
  var answers = _ref2.answers;
  return answers.forEach(function (a) {
    var isPath = a.next.match(/^\//) ? true : false;
    var isGIF = a.next.match(/gif/) ? true : false;
    a.next = isPath || isGIF ? a.next : findLink((0, _stringHash2.default)(a.next), data);
  });
};

var createStore = exports.createStore = function createStore(questions) {
  var res = [];

  questions.forEach(function (q) {
    return res.push(addHash(q));
  });
  res.forEach(function (q) {
    return createLink(q, res);
  });

  return res;
};

},{"string-hash":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = exports.title = exports.button = exports.div = undefined;

var _h = require('h0');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var div = exports.div = (0, _h2.default)('div');
var button = exports.button = (0, _h2.default)('button')({ class: 'link mv05 mr1 inline-block' });
var title = exports.title = (0, _h2.default)('h1')({ class: 'h2' });

var template = exports.template = function template(_ref, cb) {
  var prompt = _ref.prompt;
  var answers = _ref.answers;

  return div({ class: 'pv2 ph2 h2' })(title(prompt), div({ class: 'mt1' }).apply(undefined, _toConsumableArray(answers.map(function (a) {
    return button({
      onclick: function onclick(e) {
        return cb(a.next);
      }
    })(a.value);
  }))));
};

},{"h0":7}],7:[function(require,module,exports){
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
},{"./transform-props":8}],8:[function(require,module,exports){
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
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbmF2aWdvL2xpYi9uYXZpZ28uanMiLCJub2RlX21vZHVsZXMvc3RyaW5nLWhhc2gvaW5kZXguanMiLCJzcmMvanMvZGF0YS90ZXN0LmpzIiwic3JjL2pzL2luZGV4LmpzIiwic3JjL2pzL2xpYi9kYXRhLmpzIiwic3JjL2pzL2xpYi9lbGVtZW50cy5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2gwL2Rpc3QvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9oMC9kaXN0L3RyYW5zZm9ybS1wcm9wcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIk5hdmlnb1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHR2YXIgUEFSQU1FVEVSX1JFR0VYUCA9IC8oWzoqXSkoXFx3KykvZztcblx0dmFyIFdJTERDQVJEX1JFR0VYUCA9IC9cXCovZztcblx0dmFyIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQID0gJyhbXlxcL10rKSc7XG5cdHZhciBSRVBMQUNFX1dJTERDQVJEID0gJyg/Oi4qKSc7XG5cdHZhciBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFAgPSAnKD86XFwvfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmluZE1hdGNoZWRSb3V0ZXModXJsKSB7XG5cdCAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICByZXR1cm4gcm91dGVzLm1hcChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciBfcmVwbGFjZUR5bmFtaWNVUkxQYXIgPSByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICB2YXIgcmVnZXhwID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnJlZ2V4cDtcblx0ICAgIHZhciBwYXJhbU5hbWVzID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnBhcmFtTmFtZXM7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gdXJsLm1hdGNoKHJlZ2V4cCk7XG5cdCAgICB2YXIgcGFyYW1zID0gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIHBhcmFtTmFtZXMpO1xuXHRcblx0ICAgIHJldHVybiBtYXRjaCA/IHsgbWF0Y2g6IG1hdGNoLCByb3V0ZTogcm91dGUsIHBhcmFtczogcGFyYW1zIH0gOiBmYWxzZTtcblx0ICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcblx0ICAgIHJldHVybiBtO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBtYXRjaCh1cmwsIHJvdXRlcykge1xuXHQgIHJldHVybiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcylbMF0gfHwgZmFsc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJvb3QodXJsLCByb3V0ZXMpIHtcblx0ICB2YXIgbWF0Y2hlZCA9IGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciB1ID0gY2xlYW4ocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHJldHVybiB1ICE9PSAnJyAmJiB1ICE9PSAnKic7XG5cdCAgfSkpO1xuXHQgIHZhciBmYWxsYmFja1VSTCA9IGNsZWFuKHVybCk7XG5cdFxuXHQgIGlmIChtYXRjaGVkLmxlbmd0aCA+IDApIHtcblx0ICAgIHJldHVybiBtYXRjaGVkLm1hcChmdW5jdGlvbiAobSkge1xuXHQgICAgICByZXR1cm4gY2xlYW4odXJsLnN1YnN0cigwLCBtLm1hdGNoLmluZGV4KSk7XG5cdCAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJvb3QsIGN1cnJlbnQpIHtcblx0ICAgICAgcmV0dXJuIGN1cnJlbnQubGVuZ3RoIDwgcm9vdC5sZW5ndGggPyBjdXJyZW50IDogcm9vdDtcblx0ICAgIH0sIGZhbGxiYWNrVVJMKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZhbGxiYWNrVVJMO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpIHtcblx0ICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gTmF2aWdvKHIsIHVzZUhhc2gpIHtcblx0ICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICB0aGlzLnJvb3QgPSB1c2VIYXNoICYmIHIgPyByLnJlcGxhY2UoL1xcLyQvLCAnLyMnKSA6IHIgfHwgbnVsbDtcblx0ICB0aGlzLl91c2VIYXNoID0gdXNlSGFzaDtcblx0ICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IG51bGw7XG5cdCAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fb2sgPSAhdXNlSGFzaCAmJiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpO1xuXHQgIHRoaXMuX2xpc3RlbigpO1xuXHQgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG5cdH1cblx0XG5cdE5hdmlnby5wcm90b3R5cGUgPSB7XG5cdCAgaGVscGVyczoge1xuXHQgICAgbWF0Y2g6IG1hdGNoLFxuXHQgICAgcm9vdDogcm9vdCxcblx0ICAgIGNsZWFuOiBjbGVhblxuXHQgIH0sXG5cdCAgbmF2aWdhdGU6IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGgsIGFic29sdXRlKSB7XG5cdCAgICB2YXIgdG87XG5cdFxuXHQgICAgcGF0aCA9IHBhdGggfHwgJyc7XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgdG8gPSAoIWFic29sdXRlID8gdGhpcy5fZ2V0Um9vdCgpICsgJy8nIDogJycpICsgY2xlYW4ocGF0aCk7XG5cdCAgICAgIHRvID0gdG8ucmVwbGFjZSgvKFteOl0pKFxcL3syLH0pL2csICckMS8nKTtcblx0ICAgICAgaGlzdG9yeVt0aGlzLl9wYXVzZWQgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7fSwgJycsIHRvKTtcblx0ICAgICAgdGhpcy5yZXNvbHZlKCk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvIyguKikkLywgJycpICsgJyMnICsgcGF0aDtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgb246IGZ1bmN0aW9uIG9uKCkge1xuXHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdLCBhcmd1bWVudHMubGVuZ3RoIDw9IDEgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMV0pO1xuXHQgICAgfSBlbHNlIGlmIChfdHlwZW9mKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIGZvciAodmFyIHJvdXRlIGluIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkge1xuXHQgICAgICAgIHRoaXMuX2FkZChyb3V0ZSwgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSlbcm91dGVdKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG5vdEZvdW5kOiBmdW5jdGlvbiBub3RGb3VuZChoYW5kbGVyKSB7XG5cdCAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBoYW5kbGVyO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZShjdXJyZW50KSB7XG5cdCAgICB2YXIgaGFuZGxlciwgbTtcblx0ICAgIHZhciB1cmwgPSAoY3VycmVudCB8fCB0aGlzLl9jTG9jKCkpLnJlcGxhY2UodGhpcy5fZ2V0Um9vdCgpLCAnJyk7XG5cdFxuXHQgICAgaWYgKHRoaXMuX3BhdXNlZCB8fCB1cmwgPT09IHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5fdXNlSGFzaCkge1xuXHQgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLyMvLCAnLycpO1xuXHQgICAgfVxuXHQgICAgbSA9IG1hdGNoKHVybCwgdGhpcy5fcm91dGVzKTtcblx0XG5cdCAgICBpZiAobSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgaGFuZGxlciA9IG0ucm91dGUuaGFuZGxlcjtcblx0ICAgICAgbS5yb3V0ZS5yb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IGhhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBfdG9Db25zdW1hYmxlQXJyYXkobS5tYXRjaC5zbGljZSgxLCBtLm1hdGNoLmxlbmd0aCkpKSA6IGhhbmRsZXIobS5wYXJhbXMpO1xuXHQgICAgICByZXR1cm4gbTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmYXVsdEhhbmRsZXIgJiYgKHVybCA9PT0gJycgfHwgdXJsID09PSAnLycpKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyKCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZEhhbmRsZXIpIHtcblx0ICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSxcblx0ICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXHQgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCk7XG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbCA6IG51bGw7XG5cdCAgfSxcblx0ICB1cGRhdGVQYWdlTGlua3M6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VMaW5rcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0XG5cdCAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXHRcblx0ICAgIHRoaXMuX2ZpbmRMaW5rcygpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0ICAgICAgaWYgKCFsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQpIHtcblx0ICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0ICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFxuXHQgICAgICAgICAgaWYgKCFzZWxmLl9kZXN0cm95ZWQpIHtcblx0ICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBzZWxmLm5hdmlnYXRlKGNsZWFuKGxvY2F0aW9uKSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSkge1xuXHQgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICByZXR1cm4gdGhpcy5fcm91dGVzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3V0ZSkge1xuXHQgICAgICB2YXIga2V5O1xuXHRcblx0ICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IG5hbWUpIHtcblx0ICAgICAgICByZXN1bHQgPSByb3V0ZS5yb3V0ZTtcblx0ICAgICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnOicgKyBrZXksIGRhdGFba2V5XSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LCAnJyk7XG5cdCAgfSxcblx0ICBsaW5rOiBmdW5jdGlvbiBsaW5rKHBhdGgpIHtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRSb290KCkgKyBwYXRoO1xuXHQgIH0sXG5cdCAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHN0YXR1cykge1xuXHQgICAgdGhpcy5fcGF1c2VkID0gc3RhdHVzO1xuXHQgIH0sXG5cdCAgZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlOiBmdW5jdGlvbiBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGUoKSB7XG5cdCAgICBpZiAoIWlzUHVzaFN0YXRlQXZhaWxhYmxlKCkpIHtcblx0ICAgICAgdGhpcy5kZXN0cm95KCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfYWRkOiBmdW5jdGlvbiBfYWRkKHJvdXRlKSB7XG5cdCAgICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgaWYgKCh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaGFuZGxlcikpID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlci51c2VzLCBuYW1lOiBoYW5kbGVyLmFzIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fYWRkO1xuXHQgIH0sXG5cdCAgX2dldFJvb3Q6IGZ1bmN0aW9uIF9nZXRSb290KCkge1xuXHQgICAgaWYgKHRoaXMucm9vdCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMucm9vdDtcblx0ICAgIHRoaXMucm9vdCA9IHJvb3QodGhpcy5fY0xvYygpLCB0aGlzLl9yb3V0ZXMpO1xuXHQgICAgcmV0dXJuIHRoaXMucm9vdDtcblx0ICB9LFxuXHQgIF9saXN0ZW46IGZ1bmN0aW9uIF9saXN0ZW4oKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpcy5yZXNvbHZlKCk7XG5cdCAgICAgIH07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciBjYWNoZWQgPSBfdGhpcy5fY0xvYygpLFxuXHQgICAgICAgICAgICBjdXJyZW50ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgICAgICBfY2hlY2sgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICAgIF9jaGVjayA9IGZ1bmN0aW9uIGNoZWNrKCkge1xuXHQgICAgICAgICAgY3VycmVudCA9IF90aGlzLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzLnJlc29sdmUoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIF90aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwgPSBzZXRUaW1lb3V0KF9jaGVjaywgMjAwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICAgIF9jaGVjaygpO1xuXHQgICAgICB9KSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2NMb2M6IGZ1bmN0aW9uIF9jTG9jKCkge1xuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0ICB9LFxuXHQgIF9maW5kTGlua3M6IGZ1bmN0aW9uIF9maW5kTGlua3MoKSB7XG5cdCAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uYXZpZ29dJykpO1xuXHQgIH1cblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE5hdmlnbztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdmlnby5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cikge1xuICB2YXIgaGFzaCA9IDUzODEsXG4gICAgICBpICAgID0gc3RyLmxlbmd0aFxuXG4gIHdoaWxlKGkpXG4gICAgaGFzaCA9IChoYXNoICogMzMpIF4gc3RyLmNoYXJDb2RlQXQoLS1pKVxuXG4gIC8qIEphdmFTY3JpcHQgZG9lcyBiaXR3aXNlIG9wZXJhdGlvbnMgKGxpa2UgWE9SLCBhYm92ZSkgb24gMzItYml0IHNpZ25lZFxuICAgKiBpbnRlZ2Vycy4gU2luY2Ugd2Ugd2FudCB0aGUgcmVzdWx0cyB0byBiZSBhbHdheXMgcG9zaXRpdmUsIGlmIHRoZSBoaWdoIGJpdFxuICAgKiBpcyBzZXQsIHVuc2V0IGl0IGFuZCBhZGQgaXQgYmFjayBpbiB0aHJvdWdoICg2NC1iaXQgSUVFRSkgYWRkaXRpb24uICovXG4gIHJldHVybiBoYXNoID49IDAgPyBoYXNoIDogKGhhc2ggJiAweDdGRkZGRkZGKSArIDB4ODAwMDAwMDBcbn1cbiIsImV4cG9ydCBkZWZhdWx0IFtcbiAge1xuICAgIHByb21wdDogYEhpIDopIHdlbGNvbWUgdG8gbXkgc2l0ZS4gV2hhdCBhcmUgeW91IGxvb2tpbmcgZm9yP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogJ215IHdvcmsnLFxuICAgICAgICBuZXh0OiAnV2h5PycgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ2Z1bm55IGpva2VzJyxcbiAgICAgICAgbmV4dDogYFdoYXQncyBmdW5uaWVyIHRoYW4gYSByaGV0b2ljYWwgcXVlc3Rpb24/YCBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnR0lGcycsXG4gICAgICAgIG5leHQ6ICcvZ2lmcycgXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgcHJvbXB0OiBgV2h5P2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogJ0kgd2FudCB0byBoaXJlIHlvdSEnLFxuICAgICAgICBuZXh0OiAnTW9tPycgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ2p1c3QgY3VyaW91cycsXG4gICAgICAgIG5leHQ6ICdNb20/JyBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBwcm9tcHQ6IGBXaGF0J3MgZnVubmllciB0aGFuIGEgcmhldG9yaWNhbCBxdWVzdGlvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdZZXMnLFxuICAgICAgICBuZXh0OiAnSGkgOikgd2VsY29tZSB0byBteSBzaXRlLiBXaGF0IGFyZSB5b3UgbG9va2luZyBmb3I/JyBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnTm8nLFxuICAgICAgICBuZXh0OiAnSGkgOikgd2VsY29tZSB0byBteSBzaXRlLiBXaGF0IGFyZSB5b3UgbG9va2luZyBmb3I/JyBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBwcm9tcHQ6IGBNb20/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnSSBsb3ZlIHlvdSwgaG9uZXkhJyxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL0ZHVFZtemtzYjJqMGsvZ2lwaHkuZ2lmJyBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnd2hhdCwgbm8nLFxuICAgICAgICBuZXh0OiAnL3dvcmsnIFxuICAgICAgfVxuICAgIF1cbiAgfSxcbl1cbiIsImltcG9ydCBoMCBmcm9tICdoMCdcbmltcG9ydCBuYXZpZ28gZnJvbSAnbmF2aWdvJ1xuaW1wb3J0IHF1ZXN0aW9ucyBmcm9tICcuL2RhdGEvdGVzdCdcbmltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi9saWIvZGF0YSdcbmltcG9ydCB7IHRlbXBsYXRlIH0gZnJvbSAnLi9saWIvZWxlbWVudHMnXG5cbmNvbnN0IHJvdXRlciA9IG5ldyBuYXZpZ28od2luZG93LmxvY2F0aW9uLm9yaWdpbilcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXG5cbmNvbnN0IERBVEEgPSBjcmVhdGVTdG9yZShxdWVzdGlvbnMpXG5cbmxldCBwcmV2XG5cbmNvbnN0IHVwZGF0ZSA9IChuZXh0KSA9PiB7XG4gIGxldCBpc1BhdGggPSB0eXBlb2YgbmV4dCA9PT0gJ3N0cmluZycgJiYgbmV4dC5tYXRjaCgvXlxcLy8pID8gdHJ1ZSA6IGZhbHNlXG4gIGlmIChpc1BhdGgpIHJldHVybiByb3V0ZXIubmF2aWdhdGUobmV4dClcblxuICBpZiAocHJldikgY29udGFpbmVyLnJlbW92ZUNoaWxkKHByZXYpXG5cbiAgcHJldiA9IHJlbmRlcihuZXh0KVxuXG4gIHJvdXRlci5uYXZpZ2F0ZShgIyR7bmV4dC5pZH1gKVxufVxuXG5jb25zdCByZW5kZXIgPSAobmV4dCkgPT4ge1xuICBsZXQgZWwgPSB0ZW1wbGF0ZShuZXh0LCB1cGRhdGUpXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbClcbiAgcmV0dXJuIGVsIFxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgbGV0IGN1cnIgPSBEQVRBLmZpbHRlcihxID0+IHEuaWQgPT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoLyMvKVsxXSlbMF1cbiAgcHJldiA9IHJlbmRlcihjdXJyID8gY3VyciA6IERBVEFbMF0pXG59KVxuIiwiaW1wb3J0IGhhc2ggZnJvbSAnc3RyaW5nLWhhc2gnXG5cbmNvbnN0IGZpbmRMaW5rID0gKGhhc2gsIGRhdGEpID0+IGRhdGEuZmlsdGVyKGwgPT4gbC5pZCA9PT0gaGFzaClbMF1cblxuY29uc3QgYWRkSGFzaCA9ICh7IHByb21wdCwgYW5zd2VycyB9KSA9PiB7IHJldHVybiB7aWQ6IGhhc2gocHJvbXB0KSwgcHJvbXB0LCBhbnN3ZXJzfSB9XG5cbmNvbnN0IGNyZWF0ZUxpbmsgPSAoeyBhbnN3ZXJzIH0sIGRhdGEpID0+IGFuc3dlcnMuZm9yRWFjaChhID0+IHtcbiAgbGV0IGlzUGF0aCA9IGEubmV4dC5tYXRjaCgvXlxcLy8pID8gdHJ1ZSA6IGZhbHNlXG4gIGxldCBpc0dJRiA9IGEubmV4dC5tYXRjaCgvZ2lmLykgPyB0cnVlIDogZmFsc2VcbiAgYS5uZXh0ID0gaXNQYXRoIHx8IGlzR0lGID8gYS5uZXh0IDogZmluZExpbmsoaGFzaChhLm5leHQpLCBkYXRhKVxufSlcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKHF1ZXN0aW9ucykgPT4ge1xuICBjb25zdCByZXMgPSBbXVxuXG4gIHF1ZXN0aW9ucy5mb3JFYWNoKHEgPT4gcmVzLnB1c2goYWRkSGFzaChxKSkpXG4gIHJlcy5mb3JFYWNoKHEgPT4gY3JlYXRlTGluayhxLCByZXMpKVxuXG4gIHJldHVybiByZXNcbn1cbiIsImltcG9ydCBoMCBmcm9tICdoMCdcblxuZXhwb3J0IGNvbnN0IGRpdiA9IGgwKCdkaXYnKVxuZXhwb3J0IGNvbnN0IGJ1dHRvbiA9IGgwKCdidXR0b24nKSh7Y2xhc3M6ICdsaW5rIG12MDUgbXIxIGlubGluZS1ibG9jayd9KVxuZXhwb3J0IGNvbnN0IHRpdGxlID0gaDAoJ2gxJykoe2NsYXNzOiAnaDInfSlcblxuZXhwb3J0IGNvbnN0IHRlbXBsYXRlID0gKHtwcm9tcHQsIGFuc3dlcnN9LCBjYikgPT4ge1xuICByZXR1cm4gZGl2KHtjbGFzczogJ3B2MiBwaDIgaDInfSkoXG4gICAgdGl0bGUocHJvbXB0KSxcbiAgICBkaXYoe2NsYXNzOiAnbXQxJ30pKFxuICAgICAgLi4uYW5zd2Vycy5tYXAoYSA9PiBidXR0b24oe1xuICAgICAgICBvbmNsaWNrOiAoZSkgPT4gY2IoYS5uZXh0KVxuICAgICAgfSkoYS52YWx1ZSkpXG4gICAgKVxuICApXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3RyYW5zZm9ybVByb3BzID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0tcHJvcHMnKTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFuc2Zvcm1Qcm9wcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBoID0gZnVuY3Rpb24gaCh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID8gYXBwbHlQcm9wcyh0YWcpKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgOiBhcHBlbmRDaGlsZHJlbih0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5cbnZhciBpc09iaiA9IGZ1bmN0aW9uIGlzT2JqKG8pIHtcbiAgcmV0dXJuIG8gIT09IG51bGwgJiYgKHR5cGVvZiBvID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvKSkgPT09ICdvYmplY3QnO1xufTtcblxudmFyIGlzUHJvcHMgPSBmdW5jdGlvbiBpc1Byb3BzKGFyZykge1xuICByZXR1cm4gaXNPYmooYXJnKSAmJiAhKGFyZyBpbnN0YW5jZW9mIEVsZW1lbnQpO1xufTtcblxudmFyIGFwcGx5UHJvcHMgPSBmdW5jdGlvbiBhcHBseVByb3BzKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIGgodGFnKShPYmplY3QuYXNzaWduKHt9LCBwcm9wcywgYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbCA9IGgodGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICB2YXIgcCA9ICgwLCBfdHJhbnNmb3JtUHJvcHMyLmRlZmF1bHQpKHByb3BzKTtcbiAgICAgIE9iamVjdC5rZXlzKHApLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKC9eb24vLnRlc3QoaykpIHtcbiAgICAgICAgICBlbFtrXSA9IHBba107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGssIHBba10pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuICB9O1xufTtcblxudmFyIGFwcGVuZENoaWxkcmVuID0gZnVuY3Rpb24gYXBwZW5kQ2hpbGRyZW4odGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGNoaWxkcmVuID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBjaGlsZHJlbltfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYyBpbnN0YW5jZW9mIEVsZW1lbnQgPyBjIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYyk7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGVsLmFwcGVuZENoaWxkKGMpO1xuICAgIH0pO1xuICAgIHJldHVybiBlbDtcbiAgfTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGg7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIGtlYmFiID0gZXhwb3J0cy5rZWJhYiA9IGZ1bmN0aW9uIGtlYmFiKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKGcpIHtcbiAgICByZXR1cm4gJy0nICsgZy50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn07XG5cbnZhciBwYXJzZVZhbHVlID0gZXhwb3J0cy5wYXJzZVZhbHVlID0gZnVuY3Rpb24gcGFyc2VWYWx1ZShwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInID8gYWRkUHgocHJvcCkodmFsKSA6IHZhbDtcbiAgfTtcbn07XG5cbnZhciB1bml0bGVzc1Byb3BlcnRpZXMgPSBleHBvcnRzLnVuaXRsZXNzUHJvcGVydGllcyA9IFsnbGluZUhlaWdodCcsICdmb250V2VpZ2h0JywgJ29wYWNpdHknLCAnekluZGV4J1xuLy8gUHJvYmFibHkgbmVlZCBhIGZldyBtb3JlLi4uXG5dO1xuXG52YXIgYWRkUHggPSBleHBvcnRzLmFkZFB4ID0gZnVuY3Rpb24gYWRkUHgocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB1bml0bGVzc1Byb3BlcnRpZXMuaW5jbHVkZXMocHJvcCkgPyB2YWwgOiB2YWwgKyAncHgnO1xuICB9O1xufTtcblxudmFyIGZpbHRlck51bGwgPSBleHBvcnRzLmZpbHRlck51bGwgPSBmdW5jdGlvbiBmaWx0ZXJOdWxsKG9iaikge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBvYmpba2V5XSAhPT0gbnVsbDtcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVEZWMgPSBleHBvcnRzLmNyZWF0ZURlYyA9IGZ1bmN0aW9uIGNyZWF0ZURlYyhzdHlsZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZWJhYihrZXkpICsgJzonICsgcGFyc2VWYWx1ZShrZXkpKHN0eWxlW2tleV0pO1xuICB9O1xufTtcblxudmFyIHN0eWxlVG9TdHJpbmcgPSBleHBvcnRzLnN0eWxlVG9TdHJpbmcgPSBmdW5jdGlvbiBzdHlsZVRvU3RyaW5nKHN0eWxlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdHlsZSkuZmlsdGVyKGZpbHRlck51bGwoc3R5bGUpKS5tYXAoY3JlYXRlRGVjKHN0eWxlKSkuam9pbignOycpO1xufTtcblxudmFyIGlzU3R5bGVPYmplY3QgPSBleHBvcnRzLmlzU3R5bGVPYmplY3QgPSBmdW5jdGlvbiBpc1N0eWxlT2JqZWN0KHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleSA9PT0gJ3N0eWxlJyAmJiBwcm9wc1trZXldICE9PSBudWxsICYmIF90eXBlb2YocHJvcHNba2V5XSkgPT09ICdvYmplY3QnO1xuICB9O1xufTtcblxudmFyIGNyZWF0ZVN0eWxlID0gZXhwb3J0cy5jcmVhdGVTdHlsZSA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGlzU3R5bGVPYmplY3QocHJvcHMpKGtleSkgPyBzdHlsZVRvU3RyaW5nKHByb3BzW2tleV0pIDogcHJvcHNba2V5XTtcbiAgfTtcbn07XG5cbnZhciByZWR1Y2VQcm9wcyA9IGV4cG9ydHMucmVkdWNlUHJvcHMgPSBmdW5jdGlvbiByZWR1Y2VQcm9wcyhwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGEsIGtleSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGEsIF9kZWZpbmVQcm9wZXJ0eSh7fSwga2V5LCBjcmVhdGVTdHlsZShwcm9wcykoa2V5KSkpO1xuICB9O1xufTtcblxudmFyIHRyYW5zZm9ybVByb3BzID0gZXhwb3J0cy50cmFuc2Zvcm1Qcm9wcyA9IGZ1bmN0aW9uIHRyYW5zZm9ybVByb3BzKHByb3BzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykucmVkdWNlKHJlZHVjZVByb3BzKHByb3BzKSwge30pO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gdHJhbnNmb3JtUHJvcHM7Il19
