(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  var root = arguments.length <= 0 || arguments[0] === undefined ? document.body : arguments[0];
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
    var val = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

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
    var val = arguments.length <= 0 || arguments[0] === undefined ? Math.random() * trickle : arguments[0];
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
    var interval = arguments.length <= 0 || arguments[0] === undefined ? 500 : arguments[0];

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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  id: 0,
  prompt: 'Hi :) welcome to my site. What are you looking for?',
  answers: [{
    value: 'my work',
    next: 1
  }, {
    value: 'funny jokes',
    next: 2
  }, {
    value: 'GIFs',
    next: '/gifs'
  }]
}, {
  id: 1,
  prompt: 'Why?',
  answers: [{
    value: 'I want to hire you!',
    next: 3
  }, {
    value: 'just curious',
    next: 3
  }]
}, {
  id: 2,
  prompt: 'What\'s funnier than a rhetorical question?',
  answers: [{
    value: 'Yes',
    next: 0
  }, {
    value: 'No',
    next: 3
  }]
}, {
  id: 3,
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = exports.title = exports.button = exports.div = undefined;

var _h = require('h0');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var div = exports.div = (0, _h2.default)('div');
var button = exports.button = (0, _h2.default)('a')({ class: 'h1 mv05 mr1 inline-block' });
var title = exports.title = (0, _h2.default)('h1');

var template = exports.template = function template(_ref, cb) {
  var prompt = _ref.prompt;
  var answers = _ref.answers;

  return div(title(prompt), div.apply(undefined, _toConsumableArray(answers.map(function (a) {
    return button({
      onclick: function onclick(e) {
        return cb(a.next);
      }
    })(a.value);
  }))));
};

},{"h0":18}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = require('../lib/router');

var _router2 = _interopRequireDefault(_router);

var _test = require('./data/test');

var _test2 = _interopRequireDefault(_test);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _elements = require('./elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prev = void 0;
var questionRoot = document.getElementById('questionRoot');
var data = (0, _data2.default)(_test2.default);

var update = function update(next) {
  var isPath = typeof next === 'string' && next.match(/^\//) ? true : false;
  if (isPath) return _router2.default.go(next);

  if (prev) questionRoot.removeChild(prev);

  prev = render(next);

  _router2.default.push('#' + next.id);
};

var render = function render(next) {
  var el = (0, _elements.template)(next, update);
  questionRoot.appendChild(el);
  return el;
};

window.addEventListener('popstate', function (e) {
  update(data.getActive());
});

exports.default = function () {
  prev = render(data.getActive());
};

},{"../lib/router":7,"./data":2,"./data/test":3,"./elements":4}],6:[function(require,module,exports){
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('DOMContentLoaded', function () {
  (0, _app2.default)();
});

},{"./app":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _operator = require('../../../../operator');

var _operator2 = _interopRequireDefault(_operator);

var _putz = require('putz');

var _putz2 = _interopRequireDefault(_putz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import operator from 'operator.js'


var loader = (0, _putz2.default)(document.body, {
  speed: 100,
  trickle: 20
});
window.loader = loader;

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

app.on('before:route', function () {});

app.on('after:route', function (_ref) {
  var route = _ref.route;
  var title = _ref.title;

  gaTrackPageView(route, title);
});

app.on('after:transition', function () {
  return loader.end();
});

exports.default = app;

},{"../../../../operator":8,"putz":1}],8:[function(require,module,exports){
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
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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

    if (!_util.link.isSameOrigin(href) || a.getAttribute('rel') === 'external' || matches(e, route) || _util.link.isHash(href)) {
      return;
    }

    e.preventDefault();

    if (_util.link.isSameURL(href)) {
      return;
    }

    (0, _util.saveScrollPosition)();

    go(_util.origin + '/' + route, function (to) {
      return router.navigate(to);
    });
  });

  window.onpopstate = function (e) {
    var to = e.target.location.href;

    if (_util.link.isHash(to)) {
      return;
    }

    if (matches(e, to)) {
      window.location.reload();
      return;
    }

    /**
     * Popstate bypasses router, so we 
     * need to tell it where we went to
     * without pushing state
     */
    go(to, function (loc) {
      return router.resolve(loc);
    });
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';

    if (history.state && history.state.scrollTop !== undefined) {
      window.scrollTo(0, history.state.scrollTop);
    }

    window.onbeforeunload = _util.saveScrollPosition;
  }

  function go(route) {
    var cb = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var to = (0, _util.sanitize)(route);

    events.emit('before:route', { route: to });

    if (state.paused) {
      return;
    }

    var req = get(_util.origin + '/' + to, function (title) {
      events.emit('after:route', { route: to, title: title });
      cb ? cb(to, title) : router.navigate(to);

      // Update state
      pushRoute(to, title);
    });
  }

  function push() {
    var route = arguments.length <= 0 || arguments[0] === undefined ? state.route : arguments[0];

    router.navigate(route);
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
    var title = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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

},{"./lib/dom.js":9,"./lib/util.js":10,"delegate":12,"loop.js":13,"nanoajax":15,"navigo":16}],9:[function(require,module,exports){
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
  var root = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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

},{"./util":10,"tarry.js":17}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":14}],12:[function(require,module,exports){
var closest = require('closest');

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

},{"closest":11}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var listeners = {};

  var on = function on(e) {
    var cb = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    if (!cb) return;
    listeners[e] = listeners[e] || { queue: [] };
    listeners[e].queue.push(cb);
  };

  var emit = function emit(e) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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

},{}],14:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
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
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.tarry = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          }return arr2;
        } else {
          return Array.from(arr);
        }
      }

      var run = function run(cb, args) {
        cb();
        args.length > 0 ? args.shift().apply(undefined, _toConsumableArray(args)) : null;
      };

      var tarry = exports.tarry = function tarry(cb) {
        var delay = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return delay ? setTimeout(function () {
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
    }, {}] }, {}, [1])(1);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],18:[function(require,module,exports){
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
},{"./transform-props":19}],19:[function(require,module,exports){
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
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHV0ei9pbmRleC5qcyIsInNyYy9qcy9hcHAvZGF0YS5qcyIsInNyYy9qcy9hcHAvZGF0YS90ZXN0LmpzIiwic3JjL2pzL2FwcC9lbGVtZW50cy5qcyIsInNyYy9qcy9hcHAvaW5kZXguanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyIsIi4uL29wZXJhdG9yL2luZGV4LmpzIiwiLi4vb3BlcmF0b3IvbGliL2RvbS5qcyIsIi4uL29wZXJhdG9yL2xpYi91dGlsLmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL2Nsb3Nlc3QvaW5kZXguanMiLCIuLi9vcGVyYXRvci9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL2xvb3AuanMvaW5kZXguanMiLCIuLi9vcGVyYXRvci9ub2RlX21vZHVsZXMvbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy90YXJyeS5qcy9kaXN0L3RhcnJ5LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvaDAvZGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBcUI7QUFDckMsTUFBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFSO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZVQSxDQUFDLFVBQVMsQ0FBVCxFQUFXO0FBQUMsTUFBRyxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFpQixRQUFqQixJQUEyQixPQUFPLE1BQVAsS0FBZ0IsV0FBOUMsRUFBMEQ7QUFBQyxXQUFPLE9BQVAsR0FBZSxHQUFmO0FBQW1CLEdBQTlFLE1BQW1GLElBQUcsT0FBTyxNQUFQLEtBQWdCLFVBQWhCLElBQTRCLE9BQU8sR0FBdEMsRUFBMEM7QUFBQyxXQUFPLEVBQVAsRUFBVSxDQUFWO0FBQWEsR0FBeEQsTUFBNEQ7QUFBQyxRQUFJLENBQUosQ0FBTSxJQUFHLE9BQU8sTUFBUCxLQUFnQixXQUFuQixFQUErQjtBQUFDLFVBQUUsTUFBRjtBQUFTLEtBQXpDLE1BQThDLElBQUcsT0FBTyxNQUFQLEtBQWdCLFdBQW5CLEVBQStCO0FBQUMsVUFBRSxNQUFGO0FBQVMsS0FBekMsTUFBOEMsSUFBRyxPQUFPLElBQVAsS0FBYyxXQUFqQixFQUE2QjtBQUFDLFVBQUUsSUFBRjtBQUFPLEtBQXJDLE1BQXlDO0FBQUMsVUFBRSxJQUFGO0FBQU8sT0FBRSxLQUFGLEdBQVUsR0FBVjtBQUFjO0FBQUMsQ0FBL1QsRUFBaVUsWUFBVTtBQUFDLE1BQUksTUFBSixFQUFXLE1BQVgsRUFBa0IsT0FBbEIsQ0FBMEIsT0FBUSxTQUFTLENBQVQsQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUI7QUFBQyxhQUFTLENBQVQsQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlO0FBQUMsVUFBRyxDQUFDLEVBQUUsQ0FBRixDQUFKLEVBQVM7QUFBQyxZQUFHLENBQUMsRUFBRSxDQUFGLENBQUosRUFBUztBQUFDLGNBQUksSUFBRSxPQUFPLE9BQVAsSUFBZ0IsVUFBaEIsSUFBNEIsT0FBbEMsQ0FBMEMsSUFBRyxDQUFDLENBQUQsSUFBSSxDQUFQLEVBQVMsT0FBTyxFQUFFLENBQUYsRUFBSSxDQUFDLENBQUwsQ0FBUCxDQUFlLElBQUcsQ0FBSCxFQUFLLE9BQU8sRUFBRSxDQUFGLEVBQUksQ0FBQyxDQUFMLENBQVAsQ0FBZSxJQUFJLElBQUUsSUFBSSxLQUFKLENBQVUseUJBQXVCLENBQXZCLEdBQXlCLEdBQW5DLENBQU4sQ0FBOEMsTUFBTSxFQUFFLElBQUYsR0FBTyxrQkFBUCxFQUEwQixDQUFoQztBQUFrQyxhQUFJLElBQUUsRUFBRSxDQUFGLElBQUssRUFBQyxTQUFRLEVBQVQsRUFBWCxDQUF3QixFQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsSUFBUixDQUFhLEVBQUUsT0FBZixFQUF1QixVQUFTLENBQVQsRUFBVztBQUFDLGNBQUksSUFBRSxFQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQUFOLENBQWlCLE9BQU8sRUFBRSxJQUFFLENBQUYsR0FBSSxDQUFOLENBQVA7QUFBZ0IsU0FBcEUsRUFBcUUsQ0FBckUsRUFBdUUsRUFBRSxPQUF6RSxFQUFpRixDQUFqRixFQUFtRixDQUFuRixFQUFxRixDQUFyRixFQUF1RixDQUF2RjtBQUEwRixjQUFPLEVBQUUsQ0FBRixFQUFLLE9BQVo7QUFBb0IsU0FBSSxJQUFFLE9BQU8sT0FBUCxJQUFnQixVQUFoQixJQUE0QixPQUFsQyxDQUEwQyxLQUFJLElBQUksSUFBRSxDQUFWLEVBQVksSUFBRSxFQUFFLE1BQWhCLEVBQXVCLEdBQXZCO0FBQTJCLFFBQUUsRUFBRSxDQUFGLENBQUY7QUFBM0IsS0FBbUMsT0FBTyxDQUFQO0FBQVMsR0FBemIsQ0FBMmIsRUFBQyxHQUFFLENBQUMsVUFBUyxPQUFULEVBQWlCLE1BQWpCLEVBQXdCLE9BQXhCLEVBQWdDO0FBQzUwQjs7QUFFQSxhQUFPLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFDM0MsZUFBTztBQURvQyxPQUE3Qzs7QUFJQSxlQUFTLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDO0FBQUUsWUFBSSxNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQUosRUFBd0I7QUFBRSxlQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsT0FBTyxNQUFNLElBQUksTUFBVixDQUF2QixFQUEwQyxJQUFJLElBQUksTUFBbEQsRUFBMEQsR0FBMUQsRUFBK0Q7QUFBRSxpQkFBSyxDQUFMLElBQVUsSUFBSSxDQUFKLENBQVY7QUFBbUIsV0FBQyxPQUFPLElBQVA7QUFBYyxTQUE3SCxNQUFtSTtBQUFFLGlCQUFPLE1BQU0sSUFBTixDQUFXLEdBQVgsQ0FBUDtBQUF5QjtBQUFFOztBQUVuTSxVQUFJLE1BQU0sU0FBUyxHQUFULENBQWEsRUFBYixFQUFpQixJQUFqQixFQUF1QjtBQUMvQjtBQUNBLGFBQUssTUFBTCxHQUFjLENBQWQsR0FBa0IsS0FBSyxLQUFMLEdBQWEsS0FBYixDQUFtQixTQUFuQixFQUE4QixtQkFBbUIsSUFBbkIsQ0FBOUIsQ0FBbEIsR0FBNEUsSUFBNUU7QUFDRCxPQUhEOztBQUtBLFVBQUksUUFBUSxRQUFRLEtBQVIsR0FBZ0IsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUM3QyxZQUFJLFFBQVEsVUFBVSxNQUFWLElBQW9CLENBQXBCLElBQXlCLFVBQVUsQ0FBVixNQUFpQixTQUExQyxHQUFzRCxLQUF0RCxHQUE4RCxVQUFVLENBQVYsQ0FBMUU7QUFDQSxlQUFPLFlBQVk7QUFDakIsZUFBSyxJQUFJLE9BQU8sVUFBVSxNQUFyQixFQUE2QixPQUFPLE1BQU0sSUFBTixDQUFwQyxFQUFpRCxPQUFPLENBQTdELEVBQWdFLE9BQU8sSUFBdkUsRUFBNkUsTUFBN0UsRUFBcUY7QUFDbkYsaUJBQUssSUFBTCxJQUFhLFVBQVUsSUFBVixDQUFiO0FBQ0Q7O0FBRUQsaUJBQU8sUUFBUSxXQUFXLFlBQVk7QUFDcEMsbUJBQU8sSUFBSSxFQUFKLEVBQVEsSUFBUixDQUFQO0FBQ0QsV0FGYyxFQUVaLEtBRlksQ0FBUixHQUVLLElBQUksRUFBSixFQUFRLElBQVIsQ0FGWjtBQUdELFNBUkQ7QUFTRCxPQVhEOztBQWFBLFVBQUksUUFBUSxRQUFRLEtBQVIsR0FBZ0IsU0FBUyxLQUFULEdBQWlCO0FBQzNDLGFBQUssSUFBSSxRQUFRLFVBQVUsTUFBdEIsRUFBOEIsT0FBTyxNQUFNLEtBQU4sQ0FBckMsRUFBbUQsUUFBUSxDQUFoRSxFQUFtRSxRQUFRLEtBQTNFLEVBQWtGLE9BQWxGLEVBQTJGO0FBQ3pGLGVBQUssS0FBTCxJQUFjLFVBQVUsS0FBVixDQUFkO0FBQ0Q7O0FBRUQsZUFBTyxZQUFZO0FBQ2pCLGlCQUFPLEtBQUssS0FBTCxHQUFhLEtBQWIsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0FBUDtBQUNELFNBRkQ7QUFHRCxPQVJEO0FBVUMsS0FyQzB5QixFQXFDenlCLEVBckN5eUIsQ0FBSCxFQUEzYixFQXFDdFcsRUFyQ3NXLEVBcUNuVyxDQUFDLENBQUQsQ0FyQ21XLEVBcUM5VixDQXJDOFYsQ0FBUDtBQXNDclcsQ0F0Q0Q7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IGNyZWF0ZUJhciA9IChyb290LCBjbGFzc25hbWUpID0+IHtcbiAgbGV0IG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBsZXQgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgby5jbGFzc05hbWUgPSBjbGFzc25hbWUgXG4gIGkuY2xhc3NOYW1lID0gYCR7Y2xhc3NuYW1lfV9faW5uZXJgXG4gIG8uYXBwZW5kQ2hpbGQoaSlcbiAgcm9vdC5pbnNlcnRCZWZvcmUobywgcm9vdC5jaGlsZHJlblswXSlcblxuICByZXR1cm4ge1xuICAgIG91dGVyOiBvLFxuICAgIGlubmVyOiBpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKHJvb3QgPSBkb2N1bWVudC5ib2R5LCBvcHRzID0ge30pID0+IHtcbiAgbGV0IHRpbWVyID0gbnVsbFxuICBjb25zdCBzcGVlZCA9IG9wdHMuc3BlZWQgfHwgMjAwXG4gIGNvbnN0IGNsYXNzbmFtZSA9IG9wdHMuY2xhc3NuYW1lIHx8ICdwdXR6J1xuICBjb25zdCB0cmlja2xlID0gb3B0cy50cmlja2xlIHx8IDUgXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IDBcbiAgfVxuXG4gIGNvbnN0IGJhciA9IGNyZWF0ZUJhcihyb290LCBjbGFzc25hbWUpXG5cbiAgY29uc3QgcmVuZGVyID0gKHZhbCA9IDApID0+IHtcbiAgICBzdGF0ZS5wcm9ncmVzcyA9IHZhbFxuICAgIGJhci5pbm5lci5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKCR7c3RhdGUuYWN0aXZlID8gJzAnIDogJy0xMDAlJ30pIHRyYW5zbGF0ZVgoJHstMTAwICsgc3RhdGUucHJvZ3Jlc3N9JSk7YFxuICB9XG5cbiAgY29uc3QgZ28gPSB2YWwgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICByZW5kZXIoTWF0aC5taW4odmFsLCA5NSkpXG4gIH1cblxuICBjb25zdCBpbmMgPSAodmFsID0gKE1hdGgucmFuZG9tKCkgKiB0cmlja2xlKSkgPT4gZ28oc3RhdGUucHJvZ3Jlc3MgKyB2YWwpXG5cbiAgY29uc3QgZW5kID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlXG4gICAgcmVuZGVyKDEwMClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbmRlcigpLCBzcGVlZClcbiAgICBpZiAodGltZXIpeyBjbGVhclRpbWVvdXQodGltZXIpIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IHRydWVcbiAgICBpbmMoKVxuICB9XG5cbiAgY29uc3QgcHV0eiA9IChpbnRlcnZhbCA9IDUwMCkgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IGluYygpLCBpbnRlcnZhbClcbiAgfVxuICBcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoe1xuICAgIHB1dHosXG4gICAgc3RhcnQsXG4gICAgaW5jLFxuICAgIGdvLFxuICAgIGVuZCxcbiAgICBnZXRTdGF0ZTogKCkgPT4gc3RhdGVcbiAgfSx7XG4gICAgYmFyOiB7XG4gICAgICB2YWx1ZTogYmFyXG4gICAgfVxuICB9KVxufVxuIiwiY29uc3QgZmluZExpbmsgPSAoaWQsIGRhdGEpID0+IGRhdGEuZmlsdGVyKGwgPT4gbC5pZCA9PT0gaWQpWzBdXG5cbmNvbnN0IGNyZWF0ZUxpbmsgPSAoeyBhbnN3ZXJzIH0sIGRhdGEpID0+IGFuc3dlcnMuZm9yRWFjaChhID0+IHtcbiAgbGV0IGlzUGF0aCA9IC9eXFwvLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgbGV0IGlzR0lGID0gL2dpZi8udGVzdChhLm5leHQpID8gdHJ1ZSA6IGZhbHNlXG4gIGEubmV4dCA9IGlzUGF0aCB8fCBpc0dJRiA/IGEubmV4dCA6IGZpbmRMaW5rKGEubmV4dCwgZGF0YSlcbn0pXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTdG9yZSA9IChxdWVzdGlvbnMpID0+IHtcblx0cXVlc3Rpb25zLm1hcChxID0+IGNyZWF0ZUxpbmsocSwgcXVlc3Rpb25zKSlcblx0cmV0dXJuIHF1ZXN0aW9uc1xufVxuXG5leHBvcnQgZGVmYXVsdCBxdWVzdGlvbnMgPT4ge1xuICByZXR1cm4ge1xuICAgIHN0b3JlOiBjcmVhdGVTdG9yZShxdWVzdGlvbnMpLFxuICAgIGdldEFjdGl2ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmZpbHRlcihxID0+IHEuaWQgPT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoLyMvKVsxXSlbMF0gfHwgdGhpcy5zdG9yZVswXVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgW1xuICB7XG4gICAgaWQ6IDAsXG4gICAgcHJvbXB0OiBgSGkgOikgd2VsY29tZSB0byBteSBzaXRlLiBXaGF0IGFyZSB5b3UgbG9va2luZyBmb3I/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnbXkgd29yaycsXG4gICAgICAgIG5leHQ6IDEgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ2Z1bm55IGpva2VzJyxcbiAgICAgICAgbmV4dDogMiBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnR0lGcycsXG4gICAgICAgIG5leHQ6ICcvZ2lmcycgXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6IDEsXG4gICAgcHJvbXB0OiBgV2h5P2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogJ0kgd2FudCB0byBoaXJlIHlvdSEnLFxuICAgICAgICBuZXh0OiAzIFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdqdXN0IGN1cmlvdXMnLFxuICAgICAgICBuZXh0OiAzIFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAyLFxuICAgIHByb21wdDogYFdoYXQncyBmdW5uaWVyIHRoYW4gYSByaGV0b3JpY2FsIHF1ZXN0aW9uP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogJ1llcycsXG4gICAgICAgIG5leHQ6IDAgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ05vJyxcbiAgICAgICAgbmV4dDogMyBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogMyxcbiAgICBwcm9tcHQ6IGBNb20/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnSSBsb3ZlIHlvdSwgaG9uZXkhJyxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhL0ZHVFZtemtzYjJqMGsvZ2lwaHkuZ2lmJyBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnd2hhdCwgbm8nLFxuICAgICAgICBuZXh0OiAnL3dvcmsnIFxuICAgICAgfVxuICAgIF1cbiAgfSxcbl1cbiIsImltcG9ydCBoMCBmcm9tICdoMCdcblxuZXhwb3J0IGNvbnN0IGRpdiA9IGgwKCdkaXYnKVxuZXhwb3J0IGNvbnN0IGJ1dHRvbiA9IGgwKCdhJykoe2NsYXNzOiAnaDEgbXYwNSBtcjEgaW5saW5lLWJsb2NrJ30pXG5leHBvcnQgY29uc3QgdGl0bGUgPSBoMCgnaDEnKVxuXG5leHBvcnQgY29uc3QgdGVtcGxhdGUgPSAoe3Byb21wdCwgYW5zd2Vyc30sIGNiKSA9PiB7XG4gIHJldHVybiBkaXYoXG4gICAgdGl0bGUocHJvbXB0KSxcbiAgICBkaXYoXG4gICAgICAuLi5hbnN3ZXJzLm1hcChhID0+IGJ1dHRvbih7XG4gICAgICAgIG9uY2xpY2s6IChlKSA9PiBjYihhLm5leHQpXG4gICAgICB9KShhLnZhbHVlKSlcbiAgICApXG4gIClcbn1cbiIsImltcG9ydCByb3V0ZXIgZnJvbSAnLi4vbGliL3JvdXRlcidcbmltcG9ydCBxdWVzdGlvbnMgZnJvbSAnLi9kYXRhL3Rlc3QnXG5pbXBvcnQgc3RvcmFnZSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgeyB0ZW1wbGF0ZSB9IGZyb20gJy4vZWxlbWVudHMnXG5cbmxldCBwcmV2XG5jb25zdCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcbmNvbnN0IGRhdGEgPSBzdG9yYWdlKHF1ZXN0aW9ucylcblxuY29uc3QgdXBkYXRlID0gKG5leHQpID0+IHtcbiAgbGV0IGlzUGF0aCA9IHR5cGVvZiBuZXh0ID09PSAnc3RyaW5nJyAmJiBuZXh0Lm1hdGNoKC9eXFwvLykgPyB0cnVlIDogZmFsc2VcbiAgaWYgKGlzUGF0aCkgcmV0dXJuIHJvdXRlci5nbyhuZXh0KVxuXG4gIGlmIChwcmV2KSBxdWVzdGlvblJvb3QucmVtb3ZlQ2hpbGQocHJldilcblxuICBwcmV2ID0gcmVuZGVyKG5leHQpXG5cbiAgcm91dGVyLnB1c2goYCMke25leHQuaWR9YClcbn1cblxuY29uc3QgcmVuZGVyID0gKG5leHQpID0+IHtcbiAgbGV0IGVsID0gdGVtcGxhdGUobmV4dCwgdXBkYXRlKVxuICBxdWVzdGlvblJvb3QuYXBwZW5kQ2hpbGQoZWwpXG4gIHJldHVybiBlbCBcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZSA9PiB7XG4gIHVwZGF0ZShkYXRhLmdldEFjdGl2ZSgpKVxufSlcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICBwcmV2ID0gcmVuZGVyKGRhdGEuZ2V0QWN0aXZlKCkpXG59XG4iLCJpbXBvcnQgYXBwIGZyb20gJy4vYXBwJ1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgYXBwKClcbn0pXG4iLCIvLyBpbXBvcnQgb3BlcmF0b3IgZnJvbSAnb3BlcmF0b3IuanMnXG5pbXBvcnQgb3BlcmF0b3IgZnJvbSAnLi4vLi4vLi4vLi4vb3BlcmF0b3InXG5pbXBvcnQgcHV0eiBmcm9tICdwdXR6J1xuXG5jb25zdCBsb2FkZXIgPSBwdXR6KGRvY3VtZW50LmJvZHksIHtcbiAgc3BlZWQ6IDEwMCxcbiAgdHJpY2tsZTogMjBcbn0pXG53aW5kb3cubG9hZGVyID0gbG9hZGVyXG5cbi8qKlxuICogU2VuZCBwYWdlIHZpZXdzIHRvIFxuICogR29vZ2xlIEFuYWx5dGljc1xuICovXG5jb25zdCBnYVRyYWNrUGFnZVZpZXcgPSAocGF0aCwgdGl0bGUpID0+IHtcbiAgbGV0IGdhID0gd2luZG93LmdhID8gd2luZG93LmdhIDogZmFsc2VcblxuICBpZiAoIWdhKSByZXR1cm5cblxuICBnYSgnc2V0Jywge3BhZ2U6IHBhdGgsIHRpdGxlOiB0aXRsZX0pO1xuICBnYSgnc2VuZCcsICdwYWdldmlldycpO1xufVxuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCdcbn0pXG5cbmFwcC5vbignYmVmb3JlOnJvdXRlJywgKCkgPT4ge1xufSlcblxuYXBwLm9uKCdhZnRlcjpyb3V0ZScsICh7IHJvdXRlLCB0aXRsZSB9KSA9PiB7XG4gIGdhVHJhY2tQYWdlVmlldyhyb3V0ZSwgdGl0bGUpXG59KVxuXG5hcHAub24oJ2FmdGVyOnRyYW5zaXRpb24nLCAoKSA9PiBsb2FkZXIuZW5kKCkpXG5cbmV4cG9ydCBkZWZhdWx0IGFwcFxuIiwiaW1wb3J0IGxvb3AgZnJvbSAnbG9vcC5qcydcbmltcG9ydCBkZWxlZ2F0ZSBmcm9tICdkZWxlZ2F0ZSdcbmltcG9ydCBuYW5vYWpheCBmcm9tICduYW5vYWpheCdcbmltcG9ydCBuYXZpZ28gZnJvbSAnbmF2aWdvJ1xuaW1wb3J0IGRvbSBmcm9tICcuL2xpYi9kb20uanMnXG5pbXBvcnQgeyBcbiAgb3JpZ2luLCBcbiAgc2FuaXRpemUsXG4gIHNhdmVTY3JvbGxQb3NpdGlvbixcbiAgc2Nyb2xsVG9Mb2NhdGlvbixcbiAgbGluayxcbiAgc2V0QWN0aXZlTGlua3Ncbn0gZnJvbSAnLi9saWIvdXRpbC5qcydcblxuY29uc3Qgcm91dGVyID0gbmV3IG5hdmlnbyhvcmlnaW4pXG5cbmNvbnN0IHN0YXRlID0ge1xuICBfc3RhdGU6IHtcbiAgICByb3V0ZTogJycsXG4gICAgdGl0bGU6ICcnLFxuICAgIHByZXY6IHtcbiAgICAgIHJvdXRlOiAnLycsXG4gICAgICB0aXRsZTogJycsXG4gICAgfVxuICB9LFxuICBnZXQgcm91dGUoKXtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUucm91dGVcbiAgfSxcbiAgc2V0IHJvdXRlKGxvYyl7XG4gICAgdGhpcy5fc3RhdGUucHJldi5yb3V0ZSA9IHRoaXMucm91dGVcbiAgICB0aGlzLl9zdGF0ZS5yb3V0ZSA9IGxvY1xuICAgIHNldEFjdGl2ZUxpbmtzKGxvYylcbiAgfSxcbiAgZ2V0IHRpdGxlKCl7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnRpdGxlXG4gIH0sXG4gIHNldCB0aXRsZSh2YWwpe1xuICAgIHRoaXMuX3N0YXRlLnByZXYudGl0bGUgPSB0aGlzLnRpdGxlXG4gICAgdGhpcy5fc3RhdGUudGl0bGUgPSB2YWxcbiAgICBkb2N1bWVudC50aXRsZSA9IHZhbFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3Qgcm9vdCA9IG9wdGlvbnMucm9vdCB8fCBkb2N1bWVudC5ib2R5XG4gIGNvbnN0IGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiB8fCAwXG4gIGNvbnN0IGlnbm9yZSA9IG9wdGlvbnMuaWdub3JlIHx8IFtdXG5cbiAgY29uc3QgZXZlbnRzID0gbG9vcCgpXG4gIGNvbnN0IHJlbmRlciA9IGRvbShyb290LCBkdXJhdGlvbiwgZXZlbnRzKVxuXG4gIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSh7XG4gICAgLi4uZXZlbnRzLFxuICAgIHN0b3AoKXsgc3RhdGUucGF1c2VkID0gdHJ1ZSB9LFxuICAgIHN0YXJ0KCl7IHN0YXRlLnBhdXNlZCA9IGZhbHNlIH0sXG4gICAgZ28sXG4gICAgcHVzaFxuICB9LCB7XG4gICAgZ2V0U3RhdGU6IHtcbiAgICAgIHZhbHVlOiAoKSA9PiBzdGF0ZS5fc3RhdGVcbiAgICB9XG4gIH0pXG5cbiAgc3RhdGUucm91dGUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgc3RhdGUudGl0bGUgPSBkb2N1bWVudC50aXRsZSBcblxuICBkZWxlZ2F0ZShkb2N1bWVudCwgJ2EnLCAnY2xpY2snLCAoZSkgPT4ge1xuICAgIGxldCBhID0gZS5kZWxlZ2F0ZVRhcmdldFxuICAgIGxldCBocmVmID0gYS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCAnLydcbiAgICBsZXQgcm91dGUgPSBzYW5pdGl6ZShocmVmKVxuXG4gICAgaWYgKFxuICAgICAgIWxpbmsuaXNTYW1lT3JpZ2luKGhyZWYpXG4gICAgICB8fCBhLmdldEF0dHJpYnV0ZSgncmVsJykgPT09ICdleHRlcm5hbCdcbiAgICAgIHx8IG1hdGNoZXMoZSwgcm91dGUpXG4gICAgICB8fCBsaW5rLmlzSGFzaChocmVmKVxuICAgICl7IHJldHVybiB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmIChcbiAgICAgIGxpbmsuaXNTYW1lVVJMKGhyZWYpXG4gICAgKXsgcmV0dXJuIH1cblxuICAgIHNhdmVTY3JvbGxQb3NpdGlvbigpXG5cbiAgICBnbyhgJHtvcmlnaW59LyR7cm91dGV9YCwgdG8gPT4gcm91dGVyLm5hdmlnYXRlKHRvKSlcbiAgfSlcblxuICB3aW5kb3cub25wb3BzdGF0ZSA9IGUgPT4ge1xuICAgIGxldCB0byA9IGUudGFyZ2V0LmxvY2F0aW9uLmhyZWZcblxuICAgIGlmIChsaW5rLmlzSGFzaCh0bykpeyByZXR1cm4gfVxuXG4gICAgaWYgKG1hdGNoZXMoZSwgdG8pKXsgXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIHJldHVybiBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3BzdGF0ZSBieXBhc3NlcyByb3V0ZXIsIHNvIHdlIFxuICAgICAqIG5lZWQgdG8gdGVsbCBpdCB3aGVyZSB3ZSB3ZW50IHRvXG4gICAgICogd2l0aG91dCBwdXNoaW5nIHN0YXRlXG4gICAgICovXG4gICAgZ28odG8sIGxvYyA9PiByb3V0ZXIucmVzb2x2ZShsb2MpKVxuICB9XG5cbiAgaWYgKCdzY3JvbGxSZXN0b3JhdGlvbicgaW4gaGlzdG9yeSl7XG4gICAgaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnXG5cbiAgICBpZiAoaGlzdG9yeS5zdGF0ZSAmJiBoaXN0b3J5LnN0YXRlLnNjcm9sbFRvcCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBoaXN0b3J5LnN0YXRlLnNjcm9sbFRvcClcbiAgICB9XG5cbiAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBzYXZlU2Nyb2xsUG9zaXRpb24gXG4gIH1cblxuICBmdW5jdGlvbiBnbyhyb3V0ZSwgY2IgPSBudWxsKXtcbiAgICBsZXQgdG8gPSBzYW5pdGl6ZShyb3V0ZSlcblxuICAgIGV2ZW50cy5lbWl0KCdiZWZvcmU6cm91dGUnLCB7cm91dGU6IHRvfSlcblxuICAgIGlmIChzdGF0ZS5wYXVzZWQpeyByZXR1cm4gfVxuXG4gICAgbGV0IHJlcSA9IGdldChgJHtvcmlnaW59LyR7dG99YCwgdGl0bGUgPT4ge1xuICAgICAgZXZlbnRzLmVtaXQoJ2FmdGVyOnJvdXRlJywge3JvdXRlOiB0bywgdGl0bGV9KVxuICAgICAgY2IgPyBjYih0bywgdGl0bGUpIDogcm91dGVyLm5hdmlnYXRlKHRvKVxuICAgICAgXG4gICAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICAgIHB1c2hSb3V0ZSh0bywgdGl0bGUpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gocm91dGUgPSBzdGF0ZS5yb3V0ZSl7XG4gICAgcm91dGVyLm5hdmlnYXRlKHJvdXRlKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KHJvdXRlLCBjYil7XG4gICAgcmV0dXJuIG5hbm9hamF4LmFqYXgoeyBcbiAgICAgIG1ldGhvZDogJ0dFVCcsIFxuICAgICAgdXJsOiByb3V0ZSBcbiAgICB9LCAoc3RhdHVzLCByZXMsIHJlcSkgPT4ge1xuICAgICAgaWYgKHJlcS5zdGF0dXMgPCAyMDAgfHwgcmVxLnN0YXR1cyA+IDMwMCAmJiByZXEuc3RhdHVzICE9PSAzMDQpe1xuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gYCR7b3JpZ2lufS8ke3N0YXRlLl9zdGF0ZS5wcmV2LnJvdXRlfWBcbiAgICAgIH1cbiAgICAgIHJlbmRlcihyZXEucmVzcG9uc2UsIGNiKSBcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaFJvdXRlKGxvYywgdGl0bGUgPSBudWxsKXtcbiAgICBzdGF0ZS5yb3V0ZSA9IGxvY1xuICAgIHRpdGxlID8gc3RhdGUudGl0bGUgPSB0aXRsZSA6IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hdGNoZXMoZXZlbnQsIHJvdXRlKXtcbiAgICByZXR1cm4gaWdub3JlLmZpbHRlcih0ID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHQpKXtcbiAgICAgICAgbGV0IHJlcyA9IHRbMV0ocm91dGUpXG4gICAgICAgIGlmIChyZXMpeyBldmVudHMuZW1pdCh0WzBdLCB7cm91dGUsIGV2ZW50fSkgfVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdChyb3V0ZSkgXG4gICAgICB9XG4gICAgfSkubGVuZ3RoID4gMCA/IHRydWUgOiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlXG59XG4iLCJpbXBvcnQgeyB0YXJyeSwgcXVldWUgfSBmcm9tICd0YXJyeS5qcydcbmltcG9ydCB7IHJlc3RvcmVTY3JvbGxQb3MgfSBmcm9tICcuL3V0aWwnXG5cbi8qKlxuICogSW5pdCBuZXcgbmF0aXZlIHBhcnNlclxuICovXG5jb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcblxuLyoqXG4gKiBHZXQgdGhlIHRhcmdldCBvZiB0aGUgYWpheCByZXFcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIFN0cmluZ2lmaWVkIEhUTUxcbiAqIEByZXR1cm4ge29iamVjdH0gRE9NIG5vZGUsICNwYWdlXG4gKi9cbmNvbnN0IHBhcnNlUmVzcG9uc2UgPSBodG1sID0+IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIilcblxuLyoqXG4gKiBGaW5kcyBhbGwgPHNjcmlwdD4gdGFncyBpbiB0aGUgbmV3XG4gKiBtYXJrdXAgYW5kIGV2YWx1YXRlcyB0aGVpciBjb250ZW50c1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSByb290IERPTSBub2RlIGNvbnRhaW5pbmcgbmV3IG1hcmt1cCB2aWEgQUpBWFxuICogQHBhcmFtIHsuLi5vYmplY3R9IHNvdXJjZXMgT3RoZXIgRE9NIG5vZGVzIHRvIHNjcmFwZSBzY3JpcHQgdGFncyBmcm9tIFxuICovXG5jb25zdCBldmFsU2NyaXB0cyA9IChzb3VyY2UsIHJvb3QgPSBudWxsKSA9PiB7XG4gIGxldCBlcnJvcnMgPSBbXVxuICBjb25zdCBzY3JpcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc291cmNlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSlcbiAgY29uc3QgZXhpc3RpbmcgPSByb290ID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JykpIDogW11cblxuICBjb25zdCBkdXBlID0gcyA9PiBleGlzdGluZy5maWx0ZXIoZSA9PiBzLmlubmVySFRNTCA9PT0gZS5pbm5lckhUTUwgJiYgcy5zcmMgPT09IGUuc3JjKS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlIFxuXG4gIHNjcmlwdHMubGVuZ3RoID4gMCAmJiBzY3JpcHRzLmZvckVhY2godCA9PiB7XG4gICAgbGV0IHMgPSB0LmNsb25lTm9kZSh0cnVlKVxuXG4gICAgaWYgKGR1cGUocykpIHJldHVyblxuXG4gICAgcy5zZXRBdHRyaWJ1dGUoJ2RhdGEtYWpheGVkJywgJ3RydWUnKVxuXG4gICAgdHJ5IHtcbiAgICAgIGV2YWwocy5pbm5lckhUTUwpXG4gICAgfSBjYXRjaChlKXtcbiAgICAgIGVycm9ycy5wdXNoKGUpXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJvb3QgPyByb290Lmluc2VydEJlZm9yZShzLCByb290LmNoaWxkcmVuWzBdKSA6IHNvdXJjZS5yZXBsYWNlQ2hpbGQocywgdClcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgZXJyb3JzLnB1c2goZSlcbiAgICAgIGRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKHMsIGRvY3VtZW50LmhlYWQuY2hpbGRyZW5bMF0pXG4gICAgfVxuICB9KSBcblxuICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApe1xuICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoJ29wZXJhdG9yLmpzJylcbiAgICBlcnJvcnMuZm9yRWFjaChlID0+IGNvbnNvbGUubG9nKGUpKVxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICB9XG59XG5cbi8qKlxuICogR2V0IHdpZHRoL2hlaWdodCBvZiBlbGVtZW50IG9yIHdpbmRvd1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBlbCBFbGVtZW50IG9yIHdpbmRvd1xuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgJ0hlaWdodCcgb3IgJ1dpZHRoXG4gKi9cbmNvbnN0IHJldHVyblNpemUgPSAoZWwsIHR5cGUpID0+IHtcbiAgY29uc3QgaXNXaW5kb3cgPSBlbCAhPT0gbnVsbCAmJiBlbC53aW5kb3cgPyB0cnVlIDogZmFsc2VcblxuICBpZiAoaXNXaW5kb3cpe1xuICAgIHJldHVybiBNYXRoLm1heChlbFtgb3V0ZXIke3R5cGV9YF0sIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtgY2xpZW50JHt0eXBlfWBdKVxuICB9XG5cbiAgcmV0dXJuIE1hdGgubWF4KGVsW2BvZmZzZXQke3R5cGV9YF0sIGVsW2BjbGllbnQke3R5cGV9YF0pXG59XG5cbi8qKlxuICogSGVscGVyIHRvIHNtb290aGx5IHN3YXAgb2xkIFxuICogbWFya3VwIHdpdGggbmV3IG1hcmt1cFxuICogXG4gKiBAcGFyYW0ge29iamVjdH0gbWFya3VwIE5ldyBub2RlIHRvIGFwcGVuZCB0byBET01cbiAqL1xuZXhwb3J0IGRlZmF1bHQgKHJvb3QsIGR1cmF0aW9uLCBldmVudHMpID0+IChtYXJrdXAsIGNiKSA9PiB7XG4gIGNvbnN0IGRvbSA9IHBhcnNlUmVzcG9uc2UobWFya3VwKVxuICBjb25zdCB0aXRsZSA9IGRvbS5oZWFkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aXRsZScpWzBdLmlubmVySFRNTFxuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihyb290KVxuXG4gIGNvbnN0IHN0YXJ0ID0gdGFycnkoXG4gICAgKCkgPT4ge1xuICAgICAgZXZlbnRzLmVtaXQoJ2JlZm9yZTp0cmFuc2l0aW9uJylcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy10cmFuc2l0aW9uaW5nJykgXG4gICAgICBtYWluLnN0eWxlLmhlaWdodCA9IHJldHVyblNpemUobWFpbiwgJ0hlaWdodCcpKydweCdcbiAgICB9XG4gICwgZHVyYXRpb24pXG5cbiAgY29uc3QgcmVuZGVyID0gdGFycnkoXG4gICAgKCkgPT4ge1xuICAgICAgbWFpbi5pbm5lckhUTUwgPSBkb20ucXVlcnlTZWxlY3Rvcihyb290KS5pbm5lckhUTUxcbiAgICAgIGNiKHRpdGxlLCBtYWluKVxuICAgICAgZXZhbFNjcmlwdHMobWFpbilcbiAgICAgIGV2YWxTY3JpcHRzKGRvbS5oZWFkLCBkb2N1bWVudC5oZWFkKVxuICAgICAgcmVzdG9yZVNjcm9sbFBvcygpXG4gICAgfVxuICAsIGR1cmF0aW9uKVxuXG4gIGNvbnN0IHJlbW92ZVRyYW5zaXRpb25TdHlsZXMgPSB0YXJyeShcbiAgICAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdHJhbnNpdGlvbmluZycpIFxuICAgICAgbWFpbi5zdHlsZS5oZWlnaHQgPSAnJ1xuICAgIH1cbiAgLCBkdXJhdGlvbilcblxuICBjb25zdCBzaWduYWxFbmQgPSB0YXJyeShcbiAgICAoKSA9PiBldmVudHMuZW1pdCgnYWZ0ZXI6dHJhbnNpdGlvbicpXG4gICwgZHVyYXRpb24pXG5cbiAgcXVldWUoc3RhcnQsIHJlbmRlciwgcmVtb3ZlVHJhbnNpdGlvblN0eWxlcywgc2lnbmFsRW5kKSgpXG59XG4iLCJjb25zdCBnZXRPcmlnaW4gPSB1cmwgPT4gdXJsLm9yaWdpbiB8fCB1cmwucHJvdG9jb2wrJy8vJyt1cmwuaG9zdFxuXG5leHBvcnQgY29uc3Qgb3JpZ2luID0gZ2V0T3JpZ2luKHdpbmRvdy5sb2NhdGlvbikgXG5cbmV4cG9ydCBjb25zdCBvcmlnaW5SZWdFeCA9IG5ldyBSZWdFeHAob3JpZ2luKVxuXG4vKipcbiAqIFJlcGxhY2Ugc2l0ZSBvcmlnaW4sIGlmIHByZXNlbnQsXG4gKiByZW1vdmUgbGVhZGluZyBzbGFzaCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFJhdyBVUkwgdG8gcGFyc2VcbiAqIEByZXR1cm4ge3N0cmluZ30gVVJMIHNhbnMgb3JpZ2luIGFuZCBzYW5zIGxlYWRpbmcgY29tbWFcbiAqL1xuZXhwb3J0IGNvbnN0IHNhbml0aXplID0gdXJsID0+IHtcbiAgbGV0IHJvdXRlID0gdXJsLnJlcGxhY2Uob3JpZ2luUmVnRXgsICcnKVxuICBsZXQgY2xlYW4gPSByb3V0ZS5tYXRjaCgvXlxcLy8pID8gcm91dGUucmVwbGFjZSgvXFwvezF9LywnJykgOiByb3V0ZSAvLyByZW1vdmUgL1xuICByZXR1cm4gY2xlYW4gPT09ICcnID8gJy8nIDogY2xlYW5cbn1cblxuZXhwb3J0IGNvbnN0IHBhcnNlVVJMID0gdXJsID0+IHtcbiAgbGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgYS5ocmVmID0gdXJsXG4gIHJldHVybiBhXG59XG5cbmV4cG9ydCBjb25zdCBsaW5rID0ge1xuICBpc1NhbWVPcmlnaW46IGhyZWYgPT4gb3JpZ2luID09PSBnZXRPcmlnaW4ocGFyc2VVUkwoaHJlZikpLFxuICBpc0hhc2g6IGhyZWYgPT4gLyMvLnRlc3QoaHJlZiksXG4gIGlzU2FtZVVSTDogaHJlZiA9PiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IHBhcnNlVVJMKGhyZWYpLnBhdGhuYW1lXG59XG5cbmV4cG9ydCBjb25zdCBnZXRTY3JvbGxQb3NpdGlvbiA9ICgpID0+IHdpbmRvdy5wYWdlWU9mZnNldCB8fCB3aW5kb3cuc2Nyb2xsWVxuXG5leHBvcnQgY29uc3Qgc2F2ZVNjcm9sbFBvc2l0aW9uID0gKCkgPT4gd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHsgc2Nyb2xsVG9wOiBnZXRTY3JvbGxQb3NpdGlvbigpIH0sICcnKVxuXG5leHBvcnQgY29uc3QgcmVzdG9yZVNjcm9sbFBvcyA9ICgpID0+IHtcbiAgbGV0IHNjcm9sbFRvcCA9IGhpc3Rvcnkuc3RhdGUgPyBoaXN0b3J5LnN0YXRlLnNjcm9sbFRvcCA6IHVuZGVmaW5lZCBcbiAgaWYgKGhpc3Rvcnkuc3RhdGUgJiYgc2Nyb2xsVG9wICE9PSB1bmRlZmluZWQgKSB7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFRvcClcbiAgICByZXR1cm4gc2Nyb2xsVG9wXG4gIH0gZWxzZSB7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApXG4gIH1cbn1cblxuY29uc3QgYWN0aXZlTGlua3MgPSBbXVxuZXhwb3J0IGNvbnN0IHNldEFjdGl2ZUxpbmtzID0gcm91dGUgPT4ge1xuICBhY3RpdmVMaW5rcy5mb3JFYWNoKGEgPT4gYS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKSlcbiAgYWN0aXZlTGlua3Muc3BsaWNlKDAsIGFjdGl2ZUxpbmtzLmxlbmd0aClcbiAgYWN0aXZlTGlua3MucHVzaCguLi5BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbaHJlZiQ9XCIke3JvdXRlfVwiXWApKSlcbiAgYWN0aXZlTGlua3MuZm9yRWFjaChhID0+IGEuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJykpXG59XG4iLCJ2YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IsIGNoZWNrWW9TZWxmKSB7XHJcbiAgdmFyIHBhcmVudCA9IGNoZWNrWW9TZWxmID8gZWxlbWVudCA6IGVsZW1lbnQucGFyZW50Tm9kZVxyXG5cclxuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gZG9jdW1lbnQpIHtcclxuICAgIGlmIChtYXRjaGVzKHBhcmVudCwgc2VsZWN0b3IpKSByZXR1cm4gcGFyZW50O1xyXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGVcclxuICB9XHJcbn1cclxuIiwidmFyIGNsb3Nlc3QgPSByZXF1aXJlKCdjbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBsaXN0ZW5lckZuID0gbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEZpbmRzIGNsb3Nlc3QgbWF0Y2ggYW5kIGludm9rZXMgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGxpc3RlbmVyKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGUuZGVsZWdhdGVUYXJnZXQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZWxlbWVudCwgZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGU7XG4iLCJleHBvcnQgZGVmYXVsdCAobyA9IHt9KSA9PiB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IHt9XG5cbiAgY29uc3Qgb24gPSAoZSwgY2IgPSBudWxsKSA9PiB7XG4gICAgaWYgKCFjYikgcmV0dXJuXG4gICAgbGlzdGVuZXJzW2VdID0gbGlzdGVuZXJzW2VdIHx8IHsgcXVldWU6IFtdIH1cbiAgICBsaXN0ZW5lcnNbZV0ucXVldWUucHVzaChjYilcbiAgfVxuXG4gIGNvbnN0IGVtaXQgPSAoZSwgZGF0YSA9IG51bGwpID0+IHtcbiAgICBsZXQgaXRlbXMgPSBsaXN0ZW5lcnNbZV0gPyBsaXN0ZW5lcnNbZV0ucXVldWUgOiBmYWxzZVxuICAgIGl0ZW1zICYmIGl0ZW1zLmZvckVhY2goaSA9PiBpKGRhdGEpKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vLFxuICAgIGVtaXQsXG4gICAgb25cbiAgfVxufVxuIiwiXHJcbi8qKlxyXG4gKiBFbGVtZW50IHByb3RvdHlwZS5cclxuICovXHJcblxyXG52YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcclxuXHJcbi8qKlxyXG4gKiBWZW5kb3IgZnVuY3Rpb24uXHJcbiAqL1xyXG5cclxudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbi8qKlxyXG4gKiBFeHBvc2UgYG1hdGNoKClgLlxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XHJcblxyXG4vKipcclxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xyXG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xyXG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59IiwiLy8gQmVzdCBwbGFjZSB0byBmaW5kIGluZm9ybWF0aW9uIG9uIFhIUiBmZWF0dXJlcyBpczpcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9YTUxIdHRwUmVxdWVzdFxuXG52YXIgcmVxZmllbGRzID0gW1xuICAncmVzcG9uc2VUeXBlJywgJ3dpdGhDcmVkZW50aWFscycsICd0aW1lb3V0JywgJ29ucHJvZ3Jlc3MnXG5dXG5cbi8vIFNpbXBsZSBhbmQgc21hbGwgYWpheCBmdW5jdGlvblxuLy8gVGFrZXMgYSBwYXJhbWV0ZXJzIG9iamVjdCBhbmQgYSBjYWxsYmFjayBmdW5jdGlvblxuLy8gUGFyYW1ldGVyczpcbi8vICAtIHVybDogc3RyaW5nLCByZXF1aXJlZFxuLy8gIC0gaGVhZGVyczogb2JqZWN0IG9mIGB7aGVhZGVyX25hbWU6IGhlYWRlcl92YWx1ZSwgLi4ufWBcbi8vICAtIGJvZHk6XG4vLyAgICAgICsgc3RyaW5nIChzZXRzIGNvbnRlbnQgdHlwZSB0byAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyBpZiBub3Qgc2V0IGluIGhlYWRlcnMpXG4vLyAgICAgICsgRm9ybURhdGEgKGRvZXNuJ3Qgc2V0IGNvbnRlbnQgdHlwZSBzbyB0aGF0IGJyb3dzZXIgd2lsbCBzZXQgYXMgYXBwcm9wcmlhdGUpXG4vLyAgLSBtZXRob2Q6ICdHRVQnLCAnUE9TVCcsIGV0Yy4gRGVmYXVsdHMgdG8gJ0dFVCcgb3IgJ1BPU1QnIGJhc2VkIG9uIGJvZHlcbi8vICAtIGNvcnM6IElmIHlvdXIgdXNpbmcgY3Jvc3Mtb3JpZ2luLCB5b3Ugd2lsbCBuZWVkIHRoaXMgdHJ1ZSBmb3IgSUU4LTlcbi8vXG4vLyBUaGUgZm9sbG93aW5nIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCBvbnRvIHRoZSB4aHIgb2JqZWN0LlxuLy8gSU1QT1JUQU5UIE5PVEU6IFRoZSBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGNvbXBhdGliaWxpdHkgY2hlY2tpbmcuXG4vLyAgLSByZXNwb25zZVR5cGU6IHN0cmluZywgdmFyaW91cyBjb21wYXRhYmlsaXR5LCBzZWUgeGhyIGRvY3MgZm9yIGVudW0gb3B0aW9uc1xuLy8gIC0gd2l0aENyZWRlbnRpYWxzOiBib29sZWFuLCBJRTEwKywgQ09SUyBvbmx5XG4vLyAgLSB0aW1lb3V0OiBsb25nLCBtcyB0aW1lb3V0LCBJRTgrXG4vLyAgLSBvbnByb2dyZXNzOiBjYWxsYmFjaywgSUUxMCtcbi8vXG4vLyBDYWxsYmFjayBmdW5jdGlvbiBwcm90b3R5cGU6XG4vLyAgLSBzdGF0dXNDb2RlIGZyb20gcmVxdWVzdFxuLy8gIC0gcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVzcG9uc2VUeXBlIHNldCBhbmQgc3VwcG9ydGVkIGJ5IGJyb3dzZXIsIHRoaXMgaXMgYW4gb2JqZWN0IG9mIHNvbWUgdHlwZSAoc2VlIGRvY3MpXG4vLyAgICArIG90aGVyd2lzZSBpZiByZXF1ZXN0IGNvbXBsZXRlZCwgdGhpcyBpcyB0aGUgc3RyaW5nIHRleHQgb2YgdGhlIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlcXVlc3QgaXMgYWJvcnRlZCwgdGhpcyBpcyBcIkFib3J0XCJcbi8vICAgICsgaWYgcmVxdWVzdCB0aW1lcyBvdXQsIHRoaXMgaXMgXCJUaW1lb3V0XCJcbi8vICAgICsgaWYgcmVxdWVzdCBlcnJvcnMgYmVmb3JlIGNvbXBsZXRpbmcgKHByb2JhYmx5IGEgQ09SUyBpc3N1ZSksIHRoaXMgaXMgXCJFcnJvclwiXG4vLyAgLSByZXF1ZXN0IG9iamVjdFxuLy9cbi8vIFJldHVybnMgdGhlIHJlcXVlc3Qgb2JqZWN0LiBTbyB5b3UgY2FuIGNhbGwgLmFib3J0KCkgb3Igb3RoZXIgbWV0aG9kc1xuLy9cbi8vIERFUFJFQ0FUSU9OUzpcbi8vICAtIFBhc3NpbmcgYSBzdHJpbmcgaW5zdGVhZCBvZiB0aGUgcGFyYW1zIG9iamVjdCBoYXMgYmVlbiByZW1vdmVkIVxuLy9cbmV4cG9ydHMuYWpheCA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIC8vIEFueSB2YXJpYWJsZSB1c2VkIG1vcmUgdGhhbiBvbmNlIGlzIHZhcidkIGhlcmUgYmVjYXVzZVxuICAvLyBtaW5pZmljYXRpb24gd2lsbCBtdW5nZSB0aGUgdmFyaWFibGVzIHdoZXJlYXMgaXQgY2FuJ3QgbXVuZ2VcbiAgLy8gdGhlIG9iamVjdCBhY2Nlc3MuXG4gIHZhciBoZWFkZXJzID0gcGFyYW1zLmhlYWRlcnMgfHwge31cbiAgICAsIGJvZHkgPSBwYXJhbXMuYm9keVxuICAgICwgbWV0aG9kID0gcGFyYW1zLm1ldGhvZCB8fCAoYm9keSA/ICdQT1NUJyA6ICdHRVQnKVxuICAgICwgY2FsbGVkID0gZmFsc2VcblxuICB2YXIgcmVxID0gZ2V0UmVxdWVzdChwYXJhbXMuY29ycylcblxuICBmdW5jdGlvbiBjYihzdGF0dXNDb2RlLCByZXNwb25zZVRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgY2FsbGJhY2socmVxLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gc3RhdHVzQ29kZSA6IHJlcS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgIHJlcS5zdGF0dXMgPT09IDAgPyBcIkVycm9yXCIgOiAocmVxLnJlc3BvbnNlIHx8IHJlcS5yZXNwb25zZVRleHQgfHwgcmVzcG9uc2VUZXh0KSxcbiAgICAgICAgICAgICAgICAgcmVxKVxuICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVxLm9wZW4obWV0aG9kLCBwYXJhbXMudXJsLCB0cnVlKVxuXG4gIHZhciBzdWNjZXNzID0gcmVxLm9ubG9hZCA9IGNiKDIwMClcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHN1Y2Nlc3MoKVxuICB9XG4gIHJlcS5vbmVycm9yID0gY2IobnVsbCwgJ0Vycm9yJylcbiAgcmVxLm9udGltZW91dCA9IGNiKG51bGwsICdUaW1lb3V0JylcbiAgcmVxLm9uYWJvcnQgPSBjYihudWxsLCAnQWJvcnQnKVxuXG4gIGlmIChib2R5KSB7XG4gICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpXG5cbiAgICBpZiAoIWdsb2JhbC5Gb3JtRGF0YSB8fCAhKGJvZHkgaW5zdGFuY2VvZiBnbG9iYWwuRm9ybURhdGEpKSB7XG4gICAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVxZmllbGRzLmxlbmd0aCwgZmllbGQ7IGkgPCBsZW47IGkrKykge1xuICAgIGZpZWxkID0gcmVxZmllbGRzW2ldXG4gICAgaWYgKHBhcmFtc1tmaWVsZF0gIT09IHVuZGVmaW5lZClcbiAgICAgIHJlcVtmaWVsZF0gPSBwYXJhbXNbZmllbGRdXG4gIH1cblxuICBmb3IgKHZhciBmaWVsZCBpbiBoZWFkZXJzKVxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCBoZWFkZXJzW2ZpZWxkXSlcblxuICByZXEuc2VuZChib2R5KVxuXG4gIHJldHVybiByZXFcbn1cblxuZnVuY3Rpb24gZ2V0UmVxdWVzdChjb3JzKSB7XG4gIC8vIFhEb21haW5SZXF1ZXN0IGlzIG9ubHkgd2F5IHRvIGRvIENPUlMgaW4gSUUgOCBhbmQgOVxuICAvLyBCdXQgWERvbWFpblJlcXVlc3QgaXNuJ3Qgc3RhbmRhcmRzLWNvbXBhdGlibGVcbiAgLy8gTm90YWJseSwgaXQgZG9lc24ndCBhbGxvdyBjb29raWVzIHRvIGJlIHNlbnQgb3Igc2V0IGJ5IHNlcnZlcnNcbiAgLy8gSUUgMTArIGlzIHN0YW5kYXJkcy1jb21wYXRpYmxlIGluIGl0cyBYTUxIdHRwUmVxdWVzdFxuICAvLyBidXQgSUUgMTAgY2FuIHN0aWxsIGhhdmUgYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0LCBzbyB3ZSBkb24ndCB3YW50IHRvIHVzZSBpdFxuICBpZiAoY29ycyAmJiBnbG9iYWwuWERvbWFpblJlcXVlc3QgJiYgIS9NU0lFIDEvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpXG4gICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdFxuICBpZiAoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KVxuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Rcbn1cblxuZnVuY3Rpb24gc2V0RGVmYXVsdChvYmosIGtleSwgdmFsdWUpIHtcbiAgb2JqW2tleV0gPSBvYmpba2V5XSB8fCB2YWx1ZVxufVxuIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJOYXZpZ29cIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0dmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXHRcblx0dmFyIFBBUkFNRVRFUl9SRUdFWFAgPSAvKFs6Kl0pKFxcdyspL2c7XG5cdHZhciBXSUxEQ0FSRF9SRUdFWFAgPSAvXFwqL2c7XG5cdHZhciBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUCA9ICcoW15cXC9dKyknO1xuXHR2YXIgUkVQTEFDRV9XSUxEQ0FSRCA9ICcoPzouKiknO1xuXHR2YXIgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQID0gJyg/OlxcL3wkKSc7XG5cdFxuXHRmdW5jdGlvbiBjbGVhbihzKSB7XG5cdCAgaWYgKHMgaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiBzO1xuXHQgIHJldHVybiBzLnJlcGxhY2UoL1xcLyskLywgJycpLnJlcGxhY2UoL15cXC8rLywgJy8nKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIG5hbWVzKSB7XG5cdCAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cdCAgaWYgKCFtYXRjaCkgcmV0dXJuIG51bGw7XG5cdCAgcmV0dXJuIG1hdGNoLnNsaWNlKDEsIG1hdGNoLmxlbmd0aCkucmVkdWNlKGZ1bmN0aW9uIChwYXJhbXMsIHZhbHVlLCBpbmRleCkge1xuXHQgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgcGFyYW1zID0ge307XG5cdCAgICBwYXJhbXNbbmFtZXNbaW5kZXhdXSA9IHZhbHVlO1xuXHQgICAgcmV0dXJuIHBhcmFtcztcblx0ICB9LCBudWxsKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZSkge1xuXHQgIHZhciBwYXJhbU5hbWVzID0gW10sXG5cdCAgICAgIHJlZ2V4cDtcblx0XG5cdCAgaWYgKHJvdXRlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICByZWdleHAgPSByb3V0ZTtcblx0ICB9IGVsc2Uge1xuXHQgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChjbGVhbihyb3V0ZSkucmVwbGFjZShQQVJBTUVURVJfUkVHRVhQLCBmdW5jdGlvbiAoZnVsbCwgZG90cywgbmFtZSkge1xuXHQgICAgICBwYXJhbU5hbWVzLnB1c2gobmFtZSk7XG5cdCAgICAgIHJldHVybiBSRVBMQUNFX1ZBUklBQkxFX1JFR0VYUDtcblx0ICAgIH0pLnJlcGxhY2UoV0lMRENBUkRfUkVHRVhQLCBSRVBMQUNFX1dJTERDQVJEKSArIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCk7XG5cdCAgfVxuXHQgIHJldHVybiB7IHJlZ2V4cDogcmVnZXhwLCBwYXJhbU5hbWVzOiBwYXJhbU5hbWVzIH07XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGZpbmRNYXRjaGVkUm91dGVzKHVybCkge1xuXHQgIHZhciByb3V0ZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgcmV0dXJuIHJvdXRlcy5tYXAoZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICB2YXIgX3JlcGxhY2VEeW5hbWljVVJMUGFyID0gcmVwbGFjZUR5bmFtaWNVUkxQYXJ0cyhyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgdmFyIHJlZ2V4cCA9IF9yZXBsYWNlRHluYW1pY1VSTFBhci5yZWdleHA7XG5cdCAgICB2YXIgcGFyYW1OYW1lcyA9IF9yZXBsYWNlRHluYW1pY1VSTFBhci5wYXJhbU5hbWVzO1xuXHRcblx0ICAgIHZhciBtYXRjaCA9IHVybC5tYXRjaChyZWdleHApO1xuXHQgICAgdmFyIHBhcmFtcyA9IHJlZ0V4cFJlc3VsdFRvUGFyYW1zKG1hdGNoLCBwYXJhbU5hbWVzKTtcblx0XG5cdCAgICByZXR1cm4gbWF0Y2ggPyB7IG1hdGNoOiBtYXRjaCwgcm91dGU6IHJvdXRlLCBwYXJhbXM6IHBhcmFtcyB9IDogZmFsc2U7XG5cdCAgfSkuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG5cdCAgICByZXR1cm4gbTtcblx0ICB9KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gbWF0Y2godXJsLCByb3V0ZXMpIHtcblx0ICByZXR1cm4gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMpWzBdIHx8IGZhbHNlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByb290KHVybCwgcm91dGVzKSB7XG5cdCAgdmFyIG1hdGNoZWQgPSBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7XG5cdCAgICB2YXIgdSA9IGNsZWFuKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICByZXR1cm4gdSAhPT0gJycgJiYgdSAhPT0gJyonO1xuXHQgIH0pKTtcblx0ICB2YXIgZmFsbGJhY2tVUkwgPSBjbGVhbih1cmwpO1xuXHRcblx0ICBpZiAobWF0Y2hlZC5sZW5ndGggPiAwKSB7XG5cdCAgICByZXR1cm4gbWF0Y2hlZC5tYXAoZnVuY3Rpb24gKG0pIHtcblx0ICAgICAgcmV0dXJuIGNsZWFuKHVybC5zdWJzdHIoMCwgbS5tYXRjaC5pbmRleCkpO1xuXHQgICAgfSkucmVkdWNlKGZ1bmN0aW9uIChyb290LCBjdXJyZW50KSB7XG5cdCAgICAgIHJldHVybiBjdXJyZW50Lmxlbmd0aCA8IHJvb3QubGVuZ3RoID8gY3VycmVudCA6IHJvb3Q7XG5cdCAgICB9LCBmYWxsYmFja1VSTCk7XG5cdCAgfVxuXHQgIHJldHVybiBmYWxsYmFja1VSTDtcblx0fVxuXHRcblx0ZnVuY3Rpb24gaXNQdXNoU3RhdGVBdmFpbGFibGUoKSB7XG5cdCAgcmV0dXJuICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIE5hdmlnbyhyLCB1c2VIYXNoKSB7XG5cdCAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgdGhpcy5yb290ID0gdXNlSGFzaCAmJiByID8gci5yZXBsYWNlKC9cXC8kLywgJy8jJykgOiByIHx8IG51bGw7XG5cdCAgdGhpcy5fdXNlSGFzaCA9IHVzZUhhc2g7XG5cdCAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG5cdCAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG5cdCAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSBudWxsO1xuXHQgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX29rID0gIXVzZUhhc2ggJiYgaXNQdXNoU3RhdGVBdmFpbGFibGUoKTtcblx0ICB0aGlzLl9saXN0ZW4oKTtcblx0ICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXHR9XG5cdFxuXHROYXZpZ28ucHJvdG90eXBlID0ge1xuXHQgIGhlbHBlcnM6IHtcblx0ICAgIG1hdGNoOiBtYXRjaCxcblx0ICAgIHJvb3Q6IHJvb3QsXG5cdCAgICBjbGVhbjogY2xlYW5cblx0ICB9LFxuXHQgIG5hdmlnYXRlOiBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoLCBhYnNvbHV0ZSkge1xuXHQgICAgdmFyIHRvO1xuXHRcblx0ICAgIHBhdGggPSBwYXRoIHx8ICcnO1xuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHRvID0gKCFhYnNvbHV0ZSA/IHRoaXMuX2dldFJvb3QoKSArICcvJyA6ICcnKSArIGNsZWFuKHBhdGgpO1xuXHQgICAgICB0byA9IHRvLnJlcGxhY2UoLyhbXjpdKShcXC97Mix9KS9nLCAnJDEvJyk7XG5cdCAgICAgIGhpc3RvcnlbdGhpcy5fcGF1c2VkID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oe30sICcnLCB0byk7XG5cdCAgICAgIHRoaXMucmVzb2x2ZSgpO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoLyMoLiopJC8sICcnKSArICcjJyArIHBhdGg7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG9uOiBmdW5jdGlvbiBvbigpIHtcblx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcblx0ICAgICAgdGhpcy5fYWRkKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSwgYXJndW1lbnRzLmxlbmd0aCA8PSAxID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzFdKTtcblx0ICAgIH0gZWxzZSBpZiAoX3R5cGVvZihhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID09PSAnb2JqZWN0Jykge1xuXHQgICAgICBmb3IgKHZhciByb3V0ZSBpbiBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIHtcblx0ICAgICAgICB0aGlzLl9hZGQocm91dGUsIChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pW3JvdXRlXSk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBub3RGb3VuZDogZnVuY3Rpb24gbm90Rm91bmQoaGFuZGxlcikge1xuXHQgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gaGFuZGxlcjtcblx0ICB9LFxuXHQgIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoY3VycmVudCkge1xuXHQgICAgdmFyIGhhbmRsZXIsIG07XG5cdCAgICB2YXIgdXJsID0gKGN1cnJlbnQgfHwgdGhpcy5fY0xvYygpKS5yZXBsYWNlKHRoaXMuX2dldFJvb3QoKSwgJycpO1xuXHRcblx0ICAgIGlmICh0aGlzLl9wYXVzZWQgfHwgdXJsID09PSB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCkgcmV0dXJuIGZhbHNlO1xuXHQgICAgaWYgKHRoaXMuX3VzZUhhc2gpIHtcblx0ICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8jLywgJy8nKTtcblx0ICAgIH1cblx0ICAgIG0gPSBtYXRjaCh1cmwsIHRoaXMuX3JvdXRlcyk7XG5cdFxuXHQgICAgaWYgKG0pIHtcblx0ICAgICAgdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQgPSB1cmw7XG5cdCAgICAgIGhhbmRsZXIgPSBtLnJvdXRlLmhhbmRsZXI7XG5cdCAgICAgIG0ucm91dGUucm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgPyBoYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KG0ubWF0Y2guc2xpY2UoMSwgbS5tYXRjaC5sZW5ndGgpKSkgOiBoYW5kbGVyKG0ucGFyYW1zKTtcblx0ICAgICAgcmV0dXJuIG07XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX2RlZmF1bHRIYW5kbGVyICYmICh1cmwgPT09ICcnIHx8IHVybCA9PT0gJy8nKSkge1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlcigpO1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fbm90Rm91bmRIYW5kbGVyKSB7XG5cdCAgICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlcigpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH0sXG5cdCAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0ICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcblx0ICAgIGNsZWFyVGltZW91dCh0aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwpO1xuXHQgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cub25wb3BzdGF0ZSA9IG51bGwgOiBudWxsO1xuXHQgIH0sXG5cdCAgdXBkYXRlUGFnZUxpbmtzOiBmdW5jdGlvbiB1cGRhdGVQYWdlTGlua3MoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHQgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcblx0XG5cdCAgICB0aGlzLl9maW5kTGlua3MoKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5rKSB7XG5cdCAgICAgIGlmICghbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkKSB7XG5cdCAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdCAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXHRcblx0ICAgICAgICAgIGlmICghc2VsZi5fZGVzdHJveWVkKSB7XG5cdCAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgc2VsZi5uYXZpZ2F0ZShjbGVhbihsb2NhdGlvbikpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIGxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH0sXG5cdCAgZ2VuZXJhdGU6IGZ1bmN0aW9uIGdlbmVyYXRlKG5hbWUpIHtcblx0ICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgcmV0dXJuIHRoaXMuX3JvdXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcm91dGUpIHtcblx0ICAgICAgdmFyIGtleTtcblx0XG5cdCAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBuYW1lKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gcm91dGUucm91dGU7XG5cdCAgICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuXHQgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJzonICsga2V5LCBkYXRhW2tleV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSwgJycpO1xuXHQgIH0sXG5cdCAgbGluazogZnVuY3Rpb24gbGluayhwYXRoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0Um9vdCgpICsgcGF0aDtcblx0ICB9LFxuXHQgIHBhdXNlOiBmdW5jdGlvbiBwYXVzZShzdGF0dXMpIHtcblx0ICAgIHRoaXMuX3BhdXNlZCA9IHN0YXR1cztcblx0ICB9LFxuXHQgIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZTogZnVuY3Rpb24gZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlKCkge1xuXHQgICAgaWYgKCFpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpKSB7XG5cdCAgICAgIHRoaXMuZGVzdHJveSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2FkZDogZnVuY3Rpb24gX2FkZChyb3V0ZSkge1xuXHQgICAgdmFyIGhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBudWxsIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIGlmICgodHlwZW9mIGhhbmRsZXIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGhhbmRsZXIpKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIudXNlcywgbmFtZTogaGFuZGxlci5hcyB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyIH0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXMuX2FkZDtcblx0ICB9LFxuXHQgIF9nZXRSb290OiBmdW5jdGlvbiBfZ2V0Um9vdCgpIHtcblx0ICAgIGlmICh0aGlzLnJvb3QgIT09IG51bGwpIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgICB0aGlzLnJvb3QgPSByb290KHRoaXMuX2NMb2MoKSwgdGhpcy5fcm91dGVzKTtcblx0ICAgIHJldHVybiB0aGlzLnJvb3Q7XG5cdCAgfSxcblx0ICBfbGlzdGVuOiBmdW5jdGlvbiBfbGlzdGVuKCkge1xuXHQgICAgdmFyIF90aGlzID0gdGhpcztcblx0XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgX3RoaXMucmVzb2x2ZSgpO1xuXHQgICAgICB9O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgY2FjaGVkID0gX3RoaXMuX2NMb2MoKSxcblx0ICAgICAgICAgICAgY3VycmVudCA9IHVuZGVmaW5lZCxcblx0ICAgICAgICAgICAgX2NoZWNrID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgICBfY2hlY2sgPSBmdW5jdGlvbiBjaGVjaygpIHtcblx0ICAgICAgICAgIGN1cnJlbnQgPSBfdGhpcy5fY0xvYygpO1xuXHQgICAgICAgICAgaWYgKGNhY2hlZCAhPT0gY3VycmVudCkge1xuXHQgICAgICAgICAgICBjYWNoZWQgPSBjdXJyZW50O1xuXHQgICAgICAgICAgICBfdGhpcy5yZXNvbHZlKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBfdGhpcy5fbGlzdGVubmluZ0ludGVydmFsID0gc2V0VGltZW91dChfY2hlY2ssIDIwMCk7XG5cdCAgICAgICAgfTtcblx0ICAgICAgICBfY2hlY2soKTtcblx0ICAgICAgfSkoKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9jTG9jOiBmdW5jdGlvbiBfY0xvYygpIHtcblx0ICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gJyc7XG5cdCAgfSxcblx0ICBfZmluZExpbmtzOiBmdW5jdGlvbiBfZmluZExpbmtzKCkge1xuXHQgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbmF2aWdvXScpKTtcblx0ICB9XG5cdH07XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBOYXZpZ287XG5cdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uYXZpZ28uanMubWFwIiwiKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcudGFycnkgPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbnZhciBydW4gPSBmdW5jdGlvbiBydW4oY2IsIGFyZ3MpIHtcbiAgY2IoKTtcbiAgYXJncy5sZW5ndGggPiAwID8gYXJncy5zaGlmdCgpLmFwcGx5KHVuZGVmaW5lZCwgX3RvQ29uc3VtYWJsZUFycmF5KGFyZ3MpKSA6IG51bGw7XG59O1xuXG52YXIgdGFycnkgPSBleHBvcnRzLnRhcnJ5ID0gZnVuY3Rpb24gdGFycnkoY2IpIHtcbiAgdmFyIGRlbGF5ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbGF5ID8gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcnVuKGNiLCBhcmdzKTtcbiAgICB9LCBkZWxheSkgOiBydW4oY2IsIGFyZ3MpO1xuICB9O1xufTtcblxudmFyIHF1ZXVlID0gZXhwb3J0cy5xdWV1ZSA9IGZ1bmN0aW9uIHF1ZXVlKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFyZ3Muc2hpZnQoKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9O1xufTtcblxufSx7fV19LHt9LFsxXSkoMSlcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMgPSByZXF1aXJlKCcuL3RyYW5zZm9ybS1wcm9wcycpO1xuXG52YXIgX3RyYW5zZm9ybVByb3BzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RyYW5zZm9ybVByb3BzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGggPSBmdW5jdGlvbiBoKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBpc1Byb3BzKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPyBhcHBseVByb3BzKHRhZykoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA6IGFwcGVuZENoaWxkcmVuKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufTtcblxudmFyIGlzT2JqID0gZnVuY3Rpb24gaXNPYmoobykge1xuICByZXR1cm4gbyAhPT0gbnVsbCAmJiAodHlwZW9mIG8gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG8pKSA9PT0gJ29iamVjdCc7XG59O1xuXG52YXIgaXNQcm9wcyA9IGZ1bmN0aW9uIGlzUHJvcHMoYXJnKSB7XG4gIHJldHVybiBpc09iaihhcmcpICYmICEoYXJnIGluc3RhbmNlb2YgRWxlbWVudCk7XG59O1xuXG52YXIgYXBwbHlQcm9wcyA9IGZ1bmN0aW9uIGFwcGx5UHJvcHModGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSkge1xuICAgICAgICByZXR1cm4gaCh0YWcpKE9iamVjdC5hc3NpZ24oe30sIHByb3BzLCBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVsID0gaCh0YWcpLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICAgIHZhciBwID0gKDAsIF90cmFuc2Zvcm1Qcm9wczIuZGVmYXVsdCkocHJvcHMpO1xuICAgICAgT2JqZWN0LmtleXMocCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoL15vbi8udGVzdChrKSkge1xuICAgICAgICAgIGVsW2tdID0gcFtrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoaywgcFtrXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gIH07XG59O1xuXG52YXIgYXBwZW5kQ2hpbGRyZW4gPSBmdW5jdGlvbiBhcHBlbmRDaGlsZHJlbih0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgY2hpbGRyZW4gPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGNoaWxkcmVuW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICBjaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjIGluc3RhbmNlb2YgRWxlbWVudCA/IGMgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gZWwuYXBwZW5kQ2hpbGQoYyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsO1xuICB9O1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gaDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIga2ViYWIgPSBleHBvcnRzLmtlYmFiID0gZnVuY3Rpb24ga2ViYWIoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoZykge1xuICAgIHJldHVybiAnLScgKyBnLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufTtcblxudmFyIHBhcnNlVmFsdWUgPSBleHBvcnRzLnBhcnNlVmFsdWUgPSBmdW5jdGlvbiBwYXJzZVZhbHVlKHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyBhZGRQeChwcm9wKSh2YWwpIDogdmFsO1xuICB9O1xufTtcblxudmFyIHVuaXRsZXNzUHJvcGVydGllcyA9IGV4cG9ydHMudW5pdGxlc3NQcm9wZXJ0aWVzID0gWydsaW5lSGVpZ2h0JywgJ2ZvbnRXZWlnaHQnLCAnb3BhY2l0eScsICd6SW5kZXgnXG4vLyBQcm9iYWJseSBuZWVkIGEgZmV3IG1vcmUuLi5cbl07XG5cbnZhciBhZGRQeCA9IGV4cG9ydHMuYWRkUHggPSBmdW5jdGlvbiBhZGRQeChwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHVuaXRsZXNzUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wKSA/IHZhbCA6IHZhbCArICdweCc7XG4gIH07XG59O1xuXG52YXIgZmlsdGVyTnVsbCA9IGV4cG9ydHMuZmlsdGVyTnVsbCA9IGZ1bmN0aW9uIGZpbHRlck51bGwob2JqKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG9ialtrZXldICE9PSBudWxsO1xuICB9O1xufTtcblxudmFyIGNyZWF0ZURlYyA9IGV4cG9ydHMuY3JlYXRlRGVjID0gZnVuY3Rpb24gY3JlYXRlRGVjKHN0eWxlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtlYmFiKGtleSkgKyAnOicgKyBwYXJzZVZhbHVlKGtleSkoc3R5bGVba2V5XSk7XG4gIH07XG59O1xuXG52YXIgc3R5bGVUb1N0cmluZyA9IGV4cG9ydHMuc3R5bGVUb1N0cmluZyA9IGZ1bmN0aW9uIHN0eWxlVG9TdHJpbmcoc3R5bGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlKS5maWx0ZXIoZmlsdGVyTnVsbChzdHlsZSkpLm1hcChjcmVhdGVEZWMoc3R5bGUpKS5qb2luKCc7Jyk7XG59O1xuXG52YXIgaXNTdHlsZU9iamVjdCA9IGV4cG9ydHMuaXNTdHlsZU9iamVjdCA9IGZ1bmN0aW9uIGlzU3R5bGVPYmplY3QocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2V5ID09PSAnc3R5bGUnICYmIHByb3BzW2tleV0gIT09IG51bGwgJiYgX3R5cGVvZihwcm9wc1trZXldKSA9PT0gJ29iamVjdCc7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlU3R5bGUgPSBleHBvcnRzLmNyZWF0ZVN0eWxlID0gZnVuY3Rpb24gY3JlYXRlU3R5bGUocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaXNTdHlsZU9iamVjdChwcm9wcykoa2V5KSA/IHN0eWxlVG9TdHJpbmcocHJvcHNba2V5XSkgOiBwcm9wc1trZXldO1xuICB9O1xufTtcblxudmFyIHJlZHVjZVByb3BzID0gZXhwb3J0cy5yZWR1Y2VQcm9wcyA9IGZ1bmN0aW9uIHJlZHVjZVByb3BzKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYSwga2V5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYSwgX2RlZmluZVByb3BlcnR5KHt9LCBrZXksIGNyZWF0ZVN0eWxlKHByb3BzKShrZXkpKSk7XG4gIH07XG59O1xuXG52YXIgdHJhbnNmb3JtUHJvcHMgPSBleHBvcnRzLnRyYW5zZm9ybVByb3BzID0gZnVuY3Rpb24gdHJhbnNmb3JtUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKS5yZWR1Y2UocmVkdWNlUHJvcHMocHJvcHMpLCB7fSk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB0cmFuc2Zvcm1Qcm9wczsiXX0=
