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
var button = exports.button = (0, _h2.default)('button')({ class: 'h2 mv0 inline-block' });
var title = exports.title = (0, _h2.default)('h1')({ class: 'mt0' });

var template = exports.template = function template(_ref, cb) {
  var prompt = _ref.prompt;
  var answers = _ref.answers;

  return div({ class: 'question' })(title(prompt), div.apply(undefined, _toConsumableArray(answers.map(function (a, i) {
    return button({
      onclick: function onclick(e) {
        return cb(a.next);
      },
      style: {
        color: window.__app.colors[i]
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

window.__app = {
  colors: ['#35D3E8', '#FF4E42', '#FFEA51']
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHV0ei9pbmRleC5qcyIsInNyYy9qcy9hcHAvZGF0YS5qcyIsInNyYy9qcy9hcHAvZGF0YS90ZXN0LmpzIiwic3JjL2pzL2FwcC9lbGVtZW50cy5qcyIsInNyYy9qcy9hcHAvaW5kZXguanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbGliL3JvdXRlci5qcyIsIi4uL29wZXJhdG9yL2luZGV4LmpzIiwiLi4vb3BlcmF0b3IvbGliL2RvbS5qcyIsIi4uL29wZXJhdG9yL2xpYi91dGlsLmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL2Nsb3Nlc3QvaW5kZXguanMiLCIuLi9vcGVyYXRvci9ub2RlX21vZHVsZXMvZGVsZWdhdGUvc3JjL2RlbGVnYXRlLmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL2xvb3AuanMvaW5kZXguanMiLCIuLi9vcGVyYXRvci9ub2RlX21vZHVsZXMvbWF0Y2hlcy1zZWxlY3Rvci9pbmRleC5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy9uYW5vYWpheC9pbmRleC5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy9uYXZpZ28vbGliL25hdmlnby5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy90YXJyeS5qcy9kaXN0L3RhcnJ5LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvaDAvZGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBcUI7QUFDckMsTUFBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFSO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdlVBLENBQUMsVUFBUyxDQUFULEVBQVc7QUFBQyxNQUFHLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQWlCLFFBQWpCLElBQTJCLE9BQU8sTUFBUCxLQUFnQixXQUE5QyxFQUEwRDtBQUFD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dCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgY3JlYXRlQmFyID0gKHJvb3QsIGNsYXNzbmFtZSkgPT4ge1xuICBsZXQgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGxldCBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICBvLmNsYXNzTmFtZSA9IGNsYXNzbmFtZSBcbiAgaS5jbGFzc05hbWUgPSBgJHtjbGFzc25hbWV9X19pbm5lcmBcbiAgby5hcHBlbmRDaGlsZChpKVxuICByb290Lmluc2VydEJlZm9yZShvLCByb290LmNoaWxkcmVuWzBdKVxuXG4gIHJldHVybiB7XG4gICAgb3V0ZXI6IG8sXG4gICAgaW5uZXI6IGlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAocm9vdCA9IGRvY3VtZW50LmJvZHksIG9wdHMgPSB7fSkgPT4ge1xuICBsZXQgdGltZXIgPSBudWxsXG4gIGNvbnN0IHNwZWVkID0gb3B0cy5zcGVlZCB8fCAyMDBcbiAgY29uc3QgY2xhc3NuYW1lID0gb3B0cy5jbGFzc25hbWUgfHwgJ3B1dHonXG4gIGNvbnN0IHRyaWNrbGUgPSBvcHRzLnRyaWNrbGUgfHwgNSBcbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgYWN0aXZlOiBmYWxzZSxcbiAgICBwcm9ncmVzczogMFxuICB9XG5cbiAgY29uc3QgYmFyID0gY3JlYXRlQmFyKHJvb3QsIGNsYXNzbmFtZSlcblxuICBjb25zdCByZW5kZXIgPSAodmFsID0gMCkgPT4ge1xuICAgIHN0YXRlLnByb2dyZXNzID0gdmFsXG4gICAgYmFyLmlubmVyLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoJHtzdGF0ZS5hY3RpdmUgPyAnMCcgOiAnLTEwMCUnfSkgdHJhbnNsYXRlWCgkey0xMDAgKyBzdGF0ZS5wcm9ncmVzc30lKTtgXG4gIH1cblxuICBjb25zdCBnbyA9IHZhbCA9PiB7XG4gICAgaWYgKCFzdGF0ZS5hY3RpdmUpeyByZXR1cm4gfVxuICAgIHJlbmRlcihNYXRoLm1pbih2YWwsIDk1KSlcbiAgfVxuXG4gIGNvbnN0IGluYyA9ICh2YWwgPSAoTWF0aC5yYW5kb20oKSAqIHRyaWNrbGUpKSA9PiBnbyhzdGF0ZS5wcm9ncmVzcyArIHZhbClcblxuICBjb25zdCBlbmQgPSAoKSA9PiB7XG4gICAgc3RhdGUuYWN0aXZlID0gZmFsc2VcbiAgICByZW5kZXIoMTAwKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gcmVuZGVyKCksIHNwZWVkKVxuICAgIGlmICh0aW1lcil7IGNsZWFyVGltZW91dCh0aW1lcikgfVxuICB9XG5cbiAgY29uc3Qgc3RhcnQgPSAoKSA9PiB7XG4gICAgc3RhdGUuYWN0aXZlID0gdHJ1ZVxuICAgIGluYygpXG4gIH1cblxuICBjb25zdCBwdXR6ID0gKGludGVydmFsID0gNTAwKSA9PiB7XG4gICAgaWYgKCFzdGF0ZS5hY3RpdmUpeyByZXR1cm4gfVxuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gaW5jKCksIGludGVydmFsKVxuICB9XG4gIFxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh7XG4gICAgcHV0eixcbiAgICBzdGFydCxcbiAgICBpbmMsXG4gICAgZ28sXG4gICAgZW5kLFxuICAgIGdldFN0YXRlOiAoKSA9PiBzdGF0ZVxuICB9LHtcbiAgICBiYXI6IHtcbiAgICAgIHZhbHVlOiBiYXJcbiAgICB9XG4gIH0pXG59XG4iLCJjb25zdCBmaW5kTGluayA9IChpZCwgZGF0YSkgPT4gZGF0YS5maWx0ZXIobCA9PiBsLmlkID09PSBpZClbMF1cblxuY29uc3QgY3JlYXRlTGluayA9ICh7IGFuc3dlcnMgfSwgZGF0YSkgPT4gYW5zd2Vycy5mb3JFYWNoKGEgPT4ge1xuICBsZXQgaXNQYXRoID0gL15cXC8vLnRlc3QoYS5uZXh0KSA/IHRydWUgOiBmYWxzZVxuICBsZXQgaXNHSUYgPSAvZ2lmLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgYS5uZXh0ID0gaXNQYXRoIHx8IGlzR0lGID8gYS5uZXh0IDogZmluZExpbmsoYS5uZXh0LCBkYXRhKVxufSlcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKHF1ZXN0aW9ucykgPT4ge1xuXHRxdWVzdGlvbnMubWFwKHEgPT4gY3JlYXRlTGluayhxLCBxdWVzdGlvbnMpKVxuXHRyZXR1cm4gcXVlc3Rpb25zXG59XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXN0aW9ucyA9PiB7XG4gIHJldHVybiB7XG4gICAgc3RvcmU6IGNyZWF0ZVN0b3JlKHF1ZXN0aW9ucyksXG4gICAgZ2V0QWN0aXZlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmlsdGVyKHEgPT4gcS5pZCA9PSB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgvIy8pWzFdKVswXSB8fCB0aGlzLnN0b3JlWzBdXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBpZDogMCxcbiAgICBwcm9tcHQ6IGBIaSA6KSB3ZWxjb21lIHRvIG15IHNpdGUuIFdoYXQgYXJlIHlvdSBsb29raW5nIGZvcj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdteSB3b3JrJyxcbiAgICAgICAgbmV4dDogMSBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnZnVubnkgam9rZXMnLFxuICAgICAgICBuZXh0OiAyIFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdHSUZzJyxcbiAgICAgICAgbmV4dDogJy9naWZzJyBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogMSxcbiAgICBwcm9tcHQ6IGBXaHk/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnSSB3YW50IHRvIGhpcmUgeW91IScsXG4gICAgICAgIG5leHQ6IDMgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ2p1c3QgY3VyaW91cycsXG4gICAgICAgIG5leHQ6IDMgXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6IDIsXG4gICAgcHJvbXB0OiBgV2hhdCdzIGZ1bm5pZXIgdGhhbiBhIHJoZXRvcmljYWwgcXVlc3Rpb24/YCxcbiAgICBhbnN3ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnWWVzJyxcbiAgICAgICAgbmV4dDogMCBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnTm8nLFxuICAgICAgICBuZXh0OiAzIFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAzLFxuICAgIHByb21wdDogYE1vbT9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdJIGxvdmUgeW91LCBob25leSEnLFxuICAgICAgICBuZXh0OiAnaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvRkdUVm16a3NiMmoway9naXBoeS5naWYnIFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICd3aGF0LCBubycsXG4gICAgICAgIG5leHQ6ICcvd29yaycgXG4gICAgICB9XG4gICAgXVxuICB9LFxuXVxuIiwiaW1wb3J0IGgwIGZyb20gJ2gwJ1xuXG5leHBvcnQgY29uc3QgZGl2ID0gaDAoJ2RpdicpXG5leHBvcnQgY29uc3QgYnV0dG9uID0gaDAoJ2J1dHRvbicpKHtjbGFzczogJ2gyIG12MCBpbmxpbmUtYmxvY2snfSlcbmV4cG9ydCBjb25zdCB0aXRsZSA9IGgwKCdoMScpKHtjbGFzczogJ210MCd9KVxuXG5leHBvcnQgY29uc3QgdGVtcGxhdGUgPSAoe3Byb21wdCwgYW5zd2Vyc30sIGNiKSA9PiB7XG4gIHJldHVybiBkaXYoe2NsYXNzOiAncXVlc3Rpb24nfSkoXG4gICAgdGl0bGUocHJvbXB0KSxcbiAgICBkaXYoXG4gICAgICAuLi5hbnN3ZXJzLm1hcCgoYSwgaSkgPT4gYnV0dG9uKHtcbiAgICAgICAgb25jbGljazogKGUpID0+IGNiKGEubmV4dCksXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6IHdpbmRvdy5fX2FwcC5jb2xvcnNbaV1cbiAgICAgICAgfVxuICAgICAgfSkoYS52YWx1ZSkpXG4gICAgKVxuICApXG59XG4iLCJpbXBvcnQgcm91dGVyIGZyb20gJy4uL2xpYi9yb3V0ZXInXG5pbXBvcnQgcXVlc3Rpb25zIGZyb20gJy4vZGF0YS90ZXN0J1xuaW1wb3J0IHN0b3JhZ2UgZnJvbSAnLi9kYXRhJ1xuaW1wb3J0IHsgdGVtcGxhdGUgfSBmcm9tICcuL2VsZW1lbnRzJ1xuXG5sZXQgcHJldlxuY29uc3QgcXVlc3Rpb25Sb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0aW9uUm9vdCcpXG5jb25zdCBkYXRhID0gc3RvcmFnZShxdWVzdGlvbnMpXG5cbmNvbnN0IHVwZGF0ZSA9IChuZXh0KSA9PiB7XG4gIGxldCBpc1BhdGggPSB0eXBlb2YgbmV4dCA9PT0gJ3N0cmluZycgJiYgbmV4dC5tYXRjaCgvXlxcLy8pID8gdHJ1ZSA6IGZhbHNlXG4gIGlmIChpc1BhdGgpIHJldHVybiByb3V0ZXIuZ28obmV4dClcblxuICBpZiAocHJldikgcXVlc3Rpb25Sb290LnJlbW92ZUNoaWxkKHByZXYpXG5cbiAgcHJldiA9IHJlbmRlcihuZXh0KVxuXG4gIHJvdXRlci5wdXNoKGAjJHtuZXh0LmlkfWApXG59XG5cbmNvbnN0IHJlbmRlciA9IChuZXh0KSA9PiB7XG4gIGxldCBlbCA9IHRlbXBsYXRlKG5leHQsIHVwZGF0ZSlcbiAgcXVlc3Rpb25Sb290LmFwcGVuZENoaWxkKGVsKVxuICByZXR1cm4gZWwgXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGUgPT4ge1xuICB1cGRhdGUoZGF0YS5nZXRBY3RpdmUoKSlcbn0pXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgcHJldiA9IHJlbmRlcihkYXRhLmdldEFjdGl2ZSgpKVxufVxuIiwiaW1wb3J0IGFwcCBmcm9tICcuL2FwcCdcblxud2luZG93Ll9fYXBwID0ge1xuICBjb2xvcnM6IFtcbiAgICAnIzM1RDNFOCcsXG4gICAgJyNGRjRFNDInLFxuICAgICcjRkZFQTUxJ1xuICBdXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBhcHAoKVxufSlcbiIsIi8vIGltcG9ydCBvcGVyYXRvciBmcm9tICdvcGVyYXRvci5qcydcbmltcG9ydCBvcGVyYXRvciBmcm9tICcuLi8uLi8uLi8uLi9vcGVyYXRvcidcbmltcG9ydCBwdXR6IGZyb20gJ3B1dHonXG5cbmNvbnN0IGxvYWRlciA9IHB1dHooZG9jdW1lbnQuYm9keSwge1xuICBzcGVlZDogMTAwLFxuICB0cmlja2xlOiAyMFxufSlcbndpbmRvdy5sb2FkZXIgPSBsb2FkZXJcblxuLyoqXG4gKiBTZW5kIHBhZ2Ugdmlld3MgdG8gXG4gKiBHb29nbGUgQW5hbHl0aWNzXG4gKi9cbmNvbnN0IGdhVHJhY2tQYWdlVmlldyA9IChwYXRoLCB0aXRsZSkgPT4ge1xuICBsZXQgZ2EgPSB3aW5kb3cuZ2EgPyB3aW5kb3cuZ2EgOiBmYWxzZVxuXG4gIGlmICghZ2EpIHJldHVyblxuXG4gIGdhKCdzZXQnLCB7cGFnZTogcGF0aCwgdGl0bGU6IHRpdGxlfSk7XG4gIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG59XG5cbmNvbnN0IGFwcCA9IG9wZXJhdG9yKHtcbiAgcm9vdDogJyNyb290J1xufSlcblxuYXBwLm9uKCdiZWZvcmU6cm91dGUnLCAoKSA9PiB7XG59KVxuXG5hcHAub24oJ2FmdGVyOnJvdXRlJywgKHsgcm91dGUsIHRpdGxlIH0pID0+IHtcbiAgZ2FUcmFja1BhZ2VWaWV3KHJvdXRlLCB0aXRsZSlcbn0pXG5cbmFwcC5vbignYWZ0ZXI6dHJhbnNpdGlvbicsICgpID0+IGxvYWRlci5lbmQoKSlcblxuZXhwb3J0IGRlZmF1bHQgYXBwXG4iLCJpbXBvcnQgbG9vcCBmcm9tICdsb29wLmpzJ1xuaW1wb3J0IGRlbGVnYXRlIGZyb20gJ2RlbGVnYXRlJ1xuaW1wb3J0IG5hbm9hamF4IGZyb20gJ25hbm9hamF4J1xuaW1wb3J0IG5hdmlnbyBmcm9tICduYXZpZ28nXG5pbXBvcnQgZG9tIGZyb20gJy4vbGliL2RvbS5qcydcbmltcG9ydCB7IFxuICBvcmlnaW4sIFxuICBzYW5pdGl6ZSxcbiAgc2F2ZVNjcm9sbFBvc2l0aW9uLFxuICBzY3JvbGxUb0xvY2F0aW9uLFxuICBsaW5rLFxuICBzZXRBY3RpdmVMaW5rc1xufSBmcm9tICcuL2xpYi91dGlsLmpzJ1xuXG5jb25zdCByb3V0ZXIgPSBuZXcgbmF2aWdvKG9yaWdpbilcblxuY29uc3Qgc3RhdGUgPSB7XG4gIF9zdGF0ZToge1xuICAgIHJvdXRlOiAnJyxcbiAgICB0aXRsZTogJycsXG4gICAgcHJldjoge1xuICAgICAgcm91dGU6ICcvJyxcbiAgICAgIHRpdGxlOiAnJyxcbiAgICB9XG4gIH0sXG4gIGdldCByb3V0ZSgpe1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5yb3V0ZVxuICB9LFxuICBzZXQgcm91dGUobG9jKXtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnJvdXRlID0gdGhpcy5yb3V0ZVxuICAgIHRoaXMuX3N0YXRlLnJvdXRlID0gbG9jXG4gICAgc2V0QWN0aXZlTGlua3MobG9jKVxuICB9LFxuICBnZXQgdGl0bGUoKXtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUudGl0bGVcbiAgfSxcbiAgc2V0IHRpdGxlKHZhbCl7XG4gICAgdGhpcy5fc3RhdGUucHJldi50aXRsZSA9IHRoaXMudGl0bGVcbiAgICB0aGlzLl9zdGF0ZS50aXRsZSA9IHZhbFxuICAgIGRvY3VtZW50LnRpdGxlID0gdmFsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCByb290ID0gb3B0aW9ucy5yb290IHx8IGRvY3VtZW50LmJvZHlcbiAgY29uc3QgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uIHx8IDBcbiAgY29uc3QgaWdub3JlID0gb3B0aW9ucy5pZ25vcmUgfHwgW11cblxuICBjb25zdCBldmVudHMgPSBsb29wKClcbiAgY29uc3QgcmVuZGVyID0gZG9tKHJvb3QsIGR1cmF0aW9uLCBldmVudHMpXG5cbiAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKHtcbiAgICAuLi5ldmVudHMsXG4gICAgc3RvcCgpeyBzdGF0ZS5wYXVzZWQgPSB0cnVlIH0sXG4gICAgc3RhcnQoKXsgc3RhdGUucGF1c2VkID0gZmFsc2UgfSxcbiAgICBnbyxcbiAgICBwdXNoXG4gIH0sIHtcbiAgICBnZXRTdGF0ZToge1xuICAgICAgdmFsdWU6ICgpID0+IHN0YXRlLl9zdGF0ZVxuICAgIH1cbiAgfSlcblxuICBzdGF0ZS5yb3V0ZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICBzdGF0ZS50aXRsZSA9IGRvY3VtZW50LnRpdGxlIFxuXG4gIGRlbGVnYXRlKGRvY3VtZW50LCAnYScsICdjbGljaycsIChlKSA9PiB7XG4gICAgbGV0IGEgPSBlLmRlbGVnYXRlVGFyZ2V0XG4gICAgbGV0IGhyZWYgPSBhLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcvJ1xuICAgIGxldCByb3V0ZSA9IHNhbml0aXplKGhyZWYpXG5cbiAgICBpZiAoXG4gICAgICAhbGluay5pc1NhbWVPcmlnaW4oaHJlZilcbiAgICAgIHx8IGEuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJ1xuICAgICAgfHwgbWF0Y2hlcyhlLCByb3V0ZSlcbiAgICAgIHx8IGxpbmsuaXNIYXNoKGhyZWYpXG4gICAgKXsgcmV0dXJuIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgaWYgKFxuICAgICAgbGluay5pc1NhbWVVUkwoaHJlZilcbiAgICApeyByZXR1cm4gfVxuXG4gICAgc2F2ZVNjcm9sbFBvc2l0aW9uKClcblxuICAgIGdvKGAke29yaWdpbn0vJHtyb3V0ZX1gLCB0byA9PiByb3V0ZXIubmF2aWdhdGUodG8pKVxuICB9KVxuXG4gIHdpbmRvdy5vbnBvcHN0YXRlID0gZSA9PiB7XG4gICAgbGV0IHRvID0gZS50YXJnZXQubG9jYXRpb24uaHJlZlxuXG4gICAgaWYgKGxpbmsuaXNIYXNoKHRvKSl7IHJldHVybiB9XG5cbiAgICBpZiAobWF0Y2hlcyhlLCB0bykpeyBcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgcmV0dXJuIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvcHN0YXRlIGJ5cGFzc2VzIHJvdXRlciwgc28gd2UgXG4gICAgICogbmVlZCB0byB0ZWxsIGl0IHdoZXJlIHdlIHdlbnQgdG9cbiAgICAgKiB3aXRob3V0IHB1c2hpbmcgc3RhdGVcbiAgICAgKi9cbiAgICBnbyh0bywgbG9jID0+IHJvdXRlci5yZXNvbHZlKGxvYykpXG4gIH1cblxuICBpZiAoJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5KXtcbiAgICBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCdcblxuICAgIGlmIChoaXN0b3J5LnN0YXRlICYmIGhpc3Rvcnkuc3RhdGUuc2Nyb2xsVG9wICE9PSB1bmRlZmluZWQpe1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGhpc3Rvcnkuc3RhdGUuc2Nyb2xsVG9wKVxuICAgIH1cblxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IHNhdmVTY3JvbGxQb3NpdGlvbiBcbiAgfVxuXG4gIGZ1bmN0aW9uIGdvKHJvdXRlLCBjYiA9IG51bGwpe1xuICAgIGxldCB0byA9IHNhbml0aXplKHJvdXRlKVxuXG4gICAgZXZlbnRzLmVtaXQoJ2JlZm9yZTpyb3V0ZScsIHtyb3V0ZTogdG99KVxuXG4gICAgaWYgKHN0YXRlLnBhdXNlZCl7IHJldHVybiB9XG5cbiAgICBsZXQgcmVxID0gZ2V0KGAke29yaWdpbn0vJHt0b31gLCB0aXRsZSA9PiB7XG4gICAgICBldmVudHMuZW1pdCgnYWZ0ZXI6cm91dGUnLCB7cm91dGU6IHRvLCB0aXRsZX0pXG4gICAgICBjYiA/IGNiKHRvLCB0aXRsZSkgOiByb3V0ZXIubmF2aWdhdGUodG8pXG4gICAgICBcbiAgICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgICAgcHVzaFJvdXRlKHRvLCB0aXRsZSlcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaChyb3V0ZSA9IHN0YXRlLnJvdXRlKXtcbiAgICByb3V0ZXIubmF2aWdhdGUocm91dGUpXG4gIH1cblxuICBmdW5jdGlvbiBnZXQocm91dGUsIGNiKXtcbiAgICByZXR1cm4gbmFub2FqYXguYWpheCh7IFxuICAgICAgbWV0aG9kOiAnR0VUJywgXG4gICAgICB1cmw6IHJvdXRlIFxuICAgIH0sIChzdGF0dXMsIHJlcywgcmVxKSA9PiB7XG4gICAgICBpZiAocmVxLnN0YXR1cyA8IDIwMCB8fCByZXEuc3RhdHVzID4gMzAwICYmIHJlcS5zdGF0dXMgIT09IDMwNCl7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSBgJHtvcmlnaW59LyR7c3RhdGUuX3N0YXRlLnByZXYucm91dGV9YFxuICAgICAgfVxuICAgICAgcmVuZGVyKHJlcS5yZXNwb25zZSwgY2IpIFxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBwdXNoUm91dGUobG9jLCB0aXRsZSA9IG51bGwpe1xuICAgIHN0YXRlLnJvdXRlID0gbG9jXG4gICAgdGl0bGUgPyBzdGF0ZS50aXRsZSA9IHRpdGxlIDogbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24gbWF0Y2hlcyhldmVudCwgcm91dGUpe1xuICAgIHJldHVybiBpZ25vcmUuZmlsdGVyKHQgPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodCkpe1xuICAgICAgICBsZXQgcmVzID0gdFsxXShyb3V0ZSlcbiAgICAgICAgaWYgKHJlcyl7IGV2ZW50cy5lbWl0KHRbMF0sIHtyb3V0ZSwgZXZlbnR9KSB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0KHJvdXRlKSBcbiAgICAgIH1cbiAgICB9KS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlXG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2Vcbn1cbiIsImltcG9ydCB7IHRhcnJ5LCBxdWV1ZSB9IGZyb20gJ3RhcnJ5LmpzJ1xuaW1wb3J0IHsgcmVzdG9yZVNjcm9sbFBvcyB9IGZyb20gJy4vdXRpbCdcblxuLyoqXG4gKiBJbml0IG5ldyBuYXRpdmUgcGFyc2VyXG4gKi9cbmNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuXG4vKipcbiAqIEdldCB0aGUgdGFyZ2V0IG9mIHRoZSBhamF4IHJlcVxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgU3RyaW5naWZpZWQgSFRNTFxuICogQHJldHVybiB7b2JqZWN0fSBET00gbm9kZSwgI3BhZ2VcbiAqL1xuY29uc3QgcGFyc2VSZXNwb25zZSA9IGh0bWwgPT4gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKVxuXG4vKipcbiAqIEZpbmRzIGFsbCA8c2NyaXB0PiB0YWdzIGluIHRoZSBuZXdcbiAqIG1hcmt1cCBhbmQgZXZhbHVhdGVzIHRoZWlyIGNvbnRlbnRzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHJvb3QgRE9NIG5vZGUgY29udGFpbmluZyBuZXcgbWFya3VwIHZpYSBBSkFYXG4gKiBAcGFyYW0gey4uLm9iamVjdH0gc291cmNlcyBPdGhlciBET00gbm9kZXMgdG8gc2NyYXBlIHNjcmlwdCB0YWdzIGZyb20gXG4gKi9cbmNvbnN0IGV2YWxTY3JpcHRzID0gKHNvdXJjZSwgcm9vdCA9IG51bGwpID0+IHtcbiAgbGV0IGVycm9ycyA9IFtdXG4gIGNvbnN0IHNjcmlwdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzb3VyY2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpKVxuICBjb25zdCBleGlzdGluZyA9IHJvb3QgPyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChyb290LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSkgOiBbXVxuXG4gIGNvbnN0IGR1cGUgPSBzID0+IGV4aXN0aW5nLmZpbHRlcihlID0+IHMuaW5uZXJIVE1MID09PSBlLmlubmVySFRNTCAmJiBzLnNyYyA9PT0gZS5zcmMpLmxlbmd0aCA+IDAgPyB0cnVlIDogZmFsc2UgXG5cbiAgc2NyaXB0cy5sZW5ndGggPiAwICYmIHNjcmlwdHMuZm9yRWFjaCh0ID0+IHtcbiAgICBsZXQgcyA9IHQuY2xvbmVOb2RlKHRydWUpXG5cbiAgICBpZiAoZHVwZShzKSkgcmV0dXJuXG5cbiAgICBzLnNldEF0dHJpYnV0ZSgnZGF0YS1hamF4ZWQnLCAndHJ1ZScpXG5cbiAgICB0cnkge1xuICAgICAgZXZhbChzLmlubmVySFRNTClcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgZXJyb3JzLnB1c2goZSlcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcm9vdCA/IHJvb3QuaW5zZXJ0QmVmb3JlKHMsIHJvb3QuY2hpbGRyZW5bMF0pIDogc291cmNlLnJlcGxhY2VDaGlsZChzLCB0KVxuICAgIH0gY2F0Y2goZSl7XG4gICAgICBlcnJvcnMucHVzaChlKVxuICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUocywgZG9jdW1lbnQuaGVhZC5jaGlsZHJlblswXSlcbiAgICB9XG4gIH0pIFxuXG4gIGlmIChlcnJvcnMubGVuZ3RoID4gMCl7XG4gICAgY29uc29sZS5ncm91cENvbGxhcHNlZCgnb3BlcmF0b3IuanMnKVxuICAgIGVycm9ycy5mb3JFYWNoKGUgPT4gY29uc29sZS5sb2coZSkpXG4gICAgY29uc29sZS5ncm91cEVuZCgpXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgd2lkdGgvaGVpZ2h0IG9mIGVsZW1lbnQgb3Igd2luZG93XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGVsIEVsZW1lbnQgb3Igd2luZG93XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAnSGVpZ2h0JyBvciAnV2lkdGhcbiAqL1xuY29uc3QgcmV0dXJuU2l6ZSA9IChlbCwgdHlwZSkgPT4ge1xuICBjb25zdCBpc1dpbmRvdyA9IGVsICE9PSBudWxsICYmIGVsLndpbmRvdyA/IHRydWUgOiBmYWxzZVxuXG4gIGlmIChpc1dpbmRvdyl7XG4gICAgcmV0dXJuIE1hdGgubWF4KGVsW2BvdXRlciR7dHlwZX1gXSwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W2BjbGllbnQke3R5cGV9YF0pXG4gIH1cblxuICByZXR1cm4gTWF0aC5tYXgoZWxbYG9mZnNldCR7dHlwZX1gXSwgZWxbYGNsaWVudCR7dHlwZX1gXSlcbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gc21vb3RobHkgc3dhcCBvbGQgXG4gKiBtYXJrdXAgd2l0aCBuZXcgbWFya3VwXG4gKiBcbiAqIEBwYXJhbSB7b2JqZWN0fSBtYXJrdXAgTmV3IG5vZGUgdG8gYXBwZW5kIHRvIERPTVxuICovXG5leHBvcnQgZGVmYXVsdCAocm9vdCwgZHVyYXRpb24sIGV2ZW50cykgPT4gKG1hcmt1cCwgY2IpID0+IHtcbiAgY29uc3QgZG9tID0gcGFyc2VSZXNwb25zZShtYXJrdXApXG4gIGNvbnN0IHRpdGxlID0gZG9tLmhlYWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpdGxlJylbMF0uaW5uZXJIVE1MXG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHJvb3QpXG5cbiAgY29uc3Qgc3RhcnQgPSB0YXJyeShcbiAgICAoKSA9PiB7XG4gICAgICBldmVudHMuZW1pdCgnYmVmb3JlOnRyYW5zaXRpb24nKVxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXRyYW5zaXRpb25pbmcnKSBcbiAgICAgIG1haW4uc3R5bGUuaGVpZ2h0ID0gcmV0dXJuU2l6ZShtYWluLCAnSGVpZ2h0JykrJ3B4J1xuICAgIH1cbiAgLCBkdXJhdGlvbilcblxuICBjb25zdCByZW5kZXIgPSB0YXJyeShcbiAgICAoKSA9PiB7XG4gICAgICBtYWluLmlubmVySFRNTCA9IGRvbS5xdWVyeVNlbGVjdG9yKHJvb3QpLmlubmVySFRNTFxuICAgICAgY2IodGl0bGUsIG1haW4pXG4gICAgICBldmFsU2NyaXB0cyhtYWluKVxuICAgICAgZXZhbFNjcmlwdHMoZG9tLmhlYWQsIGRvY3VtZW50LmhlYWQpXG4gICAgICByZXN0b3JlU2Nyb2xsUG9zKClcbiAgICB9XG4gICwgZHVyYXRpb24pXG5cbiAgY29uc3QgcmVtb3ZlVHJhbnNpdGlvblN0eWxlcyA9IHRhcnJ5KFxuICAgICgpID0+IHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy10cmFuc2l0aW9uaW5nJykgXG4gICAgICBtYWluLnN0eWxlLmhlaWdodCA9ICcnXG4gICAgfVxuICAsIGR1cmF0aW9uKVxuXG4gIGNvbnN0IHNpZ25hbEVuZCA9IHRhcnJ5KFxuICAgICgpID0+IGV2ZW50cy5lbWl0KCdhZnRlcjp0cmFuc2l0aW9uJylcbiAgLCBkdXJhdGlvbilcblxuICBxdWV1ZShzdGFydCwgcmVuZGVyLCByZW1vdmVUcmFuc2l0aW9uU3R5bGVzLCBzaWduYWxFbmQpKClcbn1cbiIsImNvbnN0IGdldE9yaWdpbiA9IHVybCA9PiB1cmwub3JpZ2luIHx8IHVybC5wcm90b2NvbCsnLy8nK3VybC5ob3N0XG5cbmV4cG9ydCBjb25zdCBvcmlnaW4gPSBnZXRPcmlnaW4od2luZG93LmxvY2F0aW9uKSBcblxuZXhwb3J0IGNvbnN0IG9yaWdpblJlZ0V4ID0gbmV3IFJlZ0V4cChvcmlnaW4pXG5cbi8qKlxuICogUmVwbGFjZSBzaXRlIG9yaWdpbiwgaWYgcHJlc2VudCxcbiAqIHJlbW92ZSBsZWFkaW5nIHNsYXNoLCBpZiBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgUmF3IFVSTCB0byBwYXJzZVxuICogQHJldHVybiB7c3RyaW5nfSBVUkwgc2FucyBvcmlnaW4gYW5kIHNhbnMgbGVhZGluZyBjb21tYVxuICovXG5leHBvcnQgY29uc3Qgc2FuaXRpemUgPSB1cmwgPT4ge1xuICBsZXQgcm91dGUgPSB1cmwucmVwbGFjZShvcmlnaW5SZWdFeCwgJycpXG4gIGxldCBjbGVhbiA9IHJvdXRlLm1hdGNoKC9eXFwvLykgPyByb3V0ZS5yZXBsYWNlKC9cXC97MX0vLCcnKSA6IHJvdXRlIC8vIHJlbW92ZSAvXG4gIHJldHVybiBjbGVhbiA9PT0gJycgPyAnLycgOiBjbGVhblxufVxuXG5leHBvcnQgY29uc3QgcGFyc2VVUkwgPSB1cmwgPT4ge1xuICBsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICBhLmhyZWYgPSB1cmxcbiAgcmV0dXJuIGFcbn1cblxuZXhwb3J0IGNvbnN0IGxpbmsgPSB7XG4gIGlzU2FtZU9yaWdpbjogaHJlZiA9PiBvcmlnaW4gPT09IGdldE9yaWdpbihwYXJzZVVSTChocmVmKSksXG4gIGlzSGFzaDogaHJlZiA9PiAvIy8udGVzdChocmVmKSxcbiAgaXNTYW1lVVJMOiBocmVmID0+IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gcGFyc2VVUkwoaHJlZikucGF0aG5hbWVcbn1cblxuZXhwb3J0IGNvbnN0IGdldFNjcm9sbFBvc2l0aW9uID0gKCkgPT4gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IHdpbmRvdy5zY3JvbGxZXG5cbmV4cG9ydCBjb25zdCBzYXZlU2Nyb2xsUG9zaXRpb24gPSAoKSA9PiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBzY3JvbGxUb3A6IGdldFNjcm9sbFBvc2l0aW9uKCkgfSwgJycpXG5cbmV4cG9ydCBjb25zdCByZXN0b3JlU2Nyb2xsUG9zID0gKCkgPT4ge1xuICBsZXQgc2Nyb2xsVG9wID0gaGlzdG9yeS5zdGF0ZSA/IGhpc3Rvcnkuc3RhdGUuc2Nyb2xsVG9wIDogdW5kZWZpbmVkIFxuICBpZiAoaGlzdG9yeS5zdGF0ZSAmJiBzY3JvbGxUb3AgIT09IHVuZGVmaW5lZCApIHtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsVG9wKVxuICAgIHJldHVybiBzY3JvbGxUb3BcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMClcbiAgfVxufVxuXG5jb25zdCBhY3RpdmVMaW5rcyA9IFtdXG5leHBvcnQgY29uc3Qgc2V0QWN0aXZlTGlua3MgPSByb3V0ZSA9PiB7XG4gIGFjdGl2ZUxpbmtzLmZvckVhY2goYSA9PiBhLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpKVxuICBhY3RpdmVMaW5rcy5zcGxpY2UoMCwgYWN0aXZlTGlua3MubGVuZ3RoKVxuICBhY3RpdmVMaW5rcy5wdXNoKC4uLkFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtocmVmJD1cIiR7cm91dGV9XCJdYCkpKVxuICBhY3RpdmVMaW5rcy5mb3JFYWNoKGEgPT4gYS5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKSlcbn1cbiIsInZhciBtYXRjaGVzID0gcmVxdWlyZSgnbWF0Y2hlcy1zZWxlY3RvcicpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtZW50LCBzZWxlY3RvciwgY2hlY2tZb1NlbGYpIHtcclxuICB2YXIgcGFyZW50ID0gY2hlY2tZb1NlbGYgPyBlbGVtZW50IDogZWxlbWVudC5wYXJlbnROb2RlXHJcblxyXG4gIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50ICE9PSBkb2N1bWVudCkge1xyXG4gICAgaWYgKG1hdGNoZXMocGFyZW50LCBzZWxlY3RvcikpIHJldHVybiBwYXJlbnQ7XHJcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZVxyXG4gIH1cclxufVxyXG4iLCJ2YXIgY2xvc2VzdCA9IHJlcXVpcmUoJ2Nsb3Nlc3QnKTtcblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUNhcHR1cmVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gZGVsZWdhdGUoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKSB7XG4gICAgdmFyIGxpc3RlbmVyRm4gPSBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyRm4sIHVzZUNhcHR1cmUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yLCB0cnVlKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiIsImV4cG9ydCBkZWZhdWx0IChvID0ge30pID0+IHtcbiAgY29uc3QgbGlzdGVuZXJzID0ge31cblxuICBjb25zdCBvbiA9IChlLCBjYiA9IG51bGwpID0+IHtcbiAgICBpZiAoIWNiKSByZXR1cm5cbiAgICBsaXN0ZW5lcnNbZV0gPSBsaXN0ZW5lcnNbZV0gfHwgeyBxdWV1ZTogW10gfVxuICAgIGxpc3RlbmVyc1tlXS5xdWV1ZS5wdXNoKGNiKVxuICB9XG5cbiAgY29uc3QgZW1pdCA9IChlLCBkYXRhID0gbnVsbCkgPT4ge1xuICAgIGxldCBpdGVtcyA9IGxpc3RlbmVyc1tlXSA/IGxpc3RlbmVyc1tlXS5xdWV1ZSA6IGZhbHNlXG4gICAgaXRlbXMgJiYgaXRlbXMuZm9yRWFjaChpID0+IGkoZGF0YSkpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm8sXG4gICAgZW1pdCxcbiAgICBvblxuICB9XG59XG4iLCJcclxuLyoqXHJcbiAqIEVsZW1lbnQgcHJvdG90eXBlLlxyXG4gKi9cclxuXHJcbnZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiAqIFZlbmRvciBmdW5jdGlvbi5cclxuICovXHJcblxyXG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXHJcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuLyoqXHJcbiAqIEV4cG9zZSBgbWF0Y2goKWAuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcclxuXHJcbi8qKlxyXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcclxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XHJcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XHJcbiAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn0iLCIvLyBCZXN0IHBsYWNlIHRvIGZpbmQgaW5mb3JtYXRpb24gb24gWEhSIGZlYXR1cmVzIGlzOlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hNTEh0dHBSZXF1ZXN0XG5cbnZhciByZXFmaWVsZHMgPSBbXG4gICdyZXNwb25zZVR5cGUnLCAnd2l0aENyZWRlbnRpYWxzJywgJ3RpbWVvdXQnLCAnb25wcm9ncmVzcydcbl1cblxuLy8gU2ltcGxlIGFuZCBzbWFsbCBhamF4IGZ1bmN0aW9uXG4vLyBUYWtlcyBhIHBhcmFtZXRlcnMgb2JqZWN0IGFuZCBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4vLyBQYXJhbWV0ZXJzOlxuLy8gIC0gdXJsOiBzdHJpbmcsIHJlcXVpcmVkXG4vLyAgLSBoZWFkZXJzOiBvYmplY3Qgb2YgYHtoZWFkZXJfbmFtZTogaGVhZGVyX3ZhbHVlLCAuLi59YFxuLy8gIC0gYm9keTpcbi8vICAgICAgKyBzdHJpbmcgKHNldHMgY29udGVudCB0eXBlIHRvICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIGlmIG5vdCBzZXQgaW4gaGVhZGVycylcbi8vICAgICAgKyBGb3JtRGF0YSAoZG9lc24ndCBzZXQgY29udGVudCB0eXBlIHNvIHRoYXQgYnJvd3NlciB3aWxsIHNldCBhcyBhcHByb3ByaWF0ZSlcbi8vICAtIG1ldGhvZDogJ0dFVCcsICdQT1NUJywgZXRjLiBEZWZhdWx0cyB0byAnR0VUJyBvciAnUE9TVCcgYmFzZWQgb24gYm9keVxuLy8gIC0gY29yczogSWYgeW91ciB1c2luZyBjcm9zcy1vcmlnaW4sIHlvdSB3aWxsIG5lZWQgdGhpcyB0cnVlIGZvciBJRTgtOVxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgcGFyYW1ldGVycyBhcmUgcGFzc2VkIG9udG8gdGhlIHhociBvYmplY3QuXG4vLyBJTVBPUlRBTlQgTk9URTogVGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3IgY29tcGF0aWJpbGl0eSBjaGVja2luZy5cbi8vICAtIHJlc3BvbnNlVHlwZTogc3RyaW5nLCB2YXJpb3VzIGNvbXBhdGFiaWxpdHksIHNlZSB4aHIgZG9jcyBmb3IgZW51bSBvcHRpb25zXG4vLyAgLSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW4sIElFMTArLCBDT1JTIG9ubHlcbi8vICAtIHRpbWVvdXQ6IGxvbmcsIG1zIHRpbWVvdXQsIElFOCtcbi8vICAtIG9ucHJvZ3Jlc3M6IGNhbGxiYWNrLCBJRTEwK1xuLy9cbi8vIENhbGxiYWNrIGZ1bmN0aW9uIHByb3RvdHlwZTpcbi8vICAtIHN0YXR1c0NvZGUgZnJvbSByZXF1ZXN0XG4vLyAgLSByZXNwb25zZVxuLy8gICAgKyBpZiByZXNwb25zZVR5cGUgc2V0IGFuZCBzdXBwb3J0ZWQgYnkgYnJvd3NlciwgdGhpcyBpcyBhbiBvYmplY3Qgb2Ygc29tZSB0eXBlIChzZWUgZG9jcylcbi8vICAgICsgb3RoZXJ3aXNlIGlmIHJlcXVlc3QgY29tcGxldGVkLCB0aGlzIGlzIHRoZSBzdHJpbmcgdGV4dCBvZiB0aGUgcmVzcG9uc2Vcbi8vICAgICsgaWYgcmVxdWVzdCBpcyBhYm9ydGVkLCB0aGlzIGlzIFwiQWJvcnRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IHRpbWVzIG91dCwgdGhpcyBpcyBcIlRpbWVvdXRcIlxuLy8gICAgKyBpZiByZXF1ZXN0IGVycm9ycyBiZWZvcmUgY29tcGxldGluZyAocHJvYmFibHkgYSBDT1JTIGlzc3VlKSwgdGhpcyBpcyBcIkVycm9yXCJcbi8vICAtIHJlcXVlc3Qgb2JqZWN0XG4vL1xuLy8gUmV0dXJucyB0aGUgcmVxdWVzdCBvYmplY3QuIFNvIHlvdSBjYW4gY2FsbCAuYWJvcnQoKSBvciBvdGhlciBtZXRob2RzXG4vL1xuLy8gREVQUkVDQVRJT05TOlxuLy8gIC0gUGFzc2luZyBhIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBwYXJhbXMgb2JqZWN0IGhhcyBiZWVuIHJlbW92ZWQhXG4vL1xuZXhwb3J0cy5hamF4ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgLy8gQW55IHZhcmlhYmxlIHVzZWQgbW9yZSB0aGFuIG9uY2UgaXMgdmFyJ2QgaGVyZSBiZWNhdXNlXG4gIC8vIG1pbmlmaWNhdGlvbiB3aWxsIG11bmdlIHRoZSB2YXJpYWJsZXMgd2hlcmVhcyBpdCBjYW4ndCBtdW5nZVxuICAvLyB0aGUgb2JqZWN0IGFjY2Vzcy5cbiAgdmFyIGhlYWRlcnMgPSBwYXJhbXMuaGVhZGVycyB8fCB7fVxuICAgICwgYm9keSA9IHBhcmFtcy5ib2R5XG4gICAgLCBtZXRob2QgPSBwYXJhbXMubWV0aG9kIHx8IChib2R5ID8gJ1BPU1QnIDogJ0dFVCcpXG4gICAgLCBjYWxsZWQgPSBmYWxzZVxuXG4gIHZhciByZXEgPSBnZXRSZXF1ZXN0KHBhcmFtcy5jb3JzKVxuXG4gIGZ1bmN0aW9uIGNiKHN0YXR1c0NvZGUsIHJlc3BvbnNlVGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzID09PSB1bmRlZmluZWQgPyBzdGF0dXNDb2RlIDogcmVxLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgcmVxLnN0YXR1cyA9PT0gMCA/IFwiRXJyb3JcIiA6IChyZXEucmVzcG9uc2UgfHwgcmVxLnJlc3BvbnNlVGV4dCB8fCByZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgICAgICByZXEpXG4gICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXEub3BlbihtZXRob2QsIHBhcmFtcy51cmwsIHRydWUpXG5cbiAgdmFyIHN1Y2Nlc3MgPSByZXEub25sb2FkID0gY2IoMjAwKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkgc3VjY2VzcygpXG4gIH1cbiAgcmVxLm9uZXJyb3IgPSBjYihudWxsLCAnRXJyb3InKVxuICByZXEub250aW1lb3V0ID0gY2IobnVsbCwgJ1RpbWVvdXQnKVxuICByZXEub25hYm9ydCA9IGNiKG51bGwsICdBYm9ydCcpXG5cbiAgaWYgKGJvZHkpIHtcbiAgICBzZXREZWZhdWx0KGhlYWRlcnMsICdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0JylcblxuICAgIGlmICghZ2xvYmFsLkZvcm1EYXRhIHx8ICEoYm9keSBpbnN0YW5jZW9mIGdsb2JhbC5Gb3JtRGF0YSkpIHtcbiAgICAgIHNldERlZmF1bHQoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXFmaWVsZHMubGVuZ3RoLCBmaWVsZDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZmllbGQgPSByZXFmaWVsZHNbaV1cbiAgICBpZiAocGFyYW1zW2ZpZWxkXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmVxW2ZpZWxkXSA9IHBhcmFtc1tmaWVsZF1cbiAgfVxuXG4gIGZvciAodmFyIGZpZWxkIGluIGhlYWRlcnMpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIGhlYWRlcnNbZmllbGRdKVxuXG4gIHJlcS5zZW5kKGJvZHkpXG5cbiAgcmV0dXJuIHJlcVxufVxuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0KGNvcnMpIHtcbiAgLy8gWERvbWFpblJlcXVlc3QgaXMgb25seSB3YXkgdG8gZG8gQ09SUyBpbiBJRSA4IGFuZCA5XG4gIC8vIEJ1dCBYRG9tYWluUmVxdWVzdCBpc24ndCBzdGFuZGFyZHMtY29tcGF0aWJsZVxuICAvLyBOb3RhYmx5LCBpdCBkb2Vzbid0IGFsbG93IGNvb2tpZXMgdG8gYmUgc2VudCBvciBzZXQgYnkgc2VydmVyc1xuICAvLyBJRSAxMCsgaXMgc3RhbmRhcmRzLWNvbXBhdGlibGUgaW4gaXRzIFhNTEh0dHBSZXF1ZXN0XG4gIC8vIGJ1dCBJRSAxMCBjYW4gc3RpbGwgaGF2ZSBhbiBYRG9tYWluUmVxdWVzdCBvYmplY3QsIHNvIHdlIGRvbid0IHdhbnQgdG8gdXNlIGl0XG4gIGlmIChjb3JzICYmIGdsb2JhbC5YRG9tYWluUmVxdWVzdCAmJiAhL01TSUUgMS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0XG4gIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpXG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdFxufVxuXG5mdW5jdGlvbiBzZXREZWZhdWx0KG9iaiwga2V5LCB2YWx1ZSkge1xuICBvYmpba2V5XSA9IG9ialtrZXldIHx8IHZhbHVlXG59XG4iLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIk5hdmlnb1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTmF2aWdvXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cdFxuXHR2YXIgUEFSQU1FVEVSX1JFR0VYUCA9IC8oWzoqXSkoXFx3KykvZztcblx0dmFyIFdJTERDQVJEX1JFR0VYUCA9IC9cXCovZztcblx0dmFyIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQID0gJyhbXlxcL10rKSc7XG5cdHZhciBSRVBMQUNFX1dJTERDQVJEID0gJyg/Oi4qKSc7XG5cdHZhciBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFAgPSAnKD86XFwvfCQpJztcblx0XG5cdGZ1bmN0aW9uIGNsZWFuKHMpIHtcblx0ICBpZiAocyBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHM7XG5cdCAgcmV0dXJuIHMucmVwbGFjZSgvXFwvKyQvLCAnJykucmVwbGFjZSgvXlxcLysvLCAnLycpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgbmFtZXMpIHtcblx0ICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblx0ICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gbWF0Y2guc2xpY2UoMSwgbWF0Y2gubGVuZ3RoKS5yZWR1Y2UoZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUsIGluZGV4KSB7XG5cdCAgICBpZiAocGFyYW1zID09PSBudWxsKSBwYXJhbXMgPSB7fTtcblx0ICAgIHBhcmFtc1tuYW1lc1tpbmRleF1dID0gdmFsdWU7XG5cdCAgICByZXR1cm4gcGFyYW1zO1xuXHQgIH0sIG51bGwpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlKSB7XG5cdCAgdmFyIHBhcmFtTmFtZXMgPSBbXSxcblx0ICAgICAgcmVnZXhwO1xuXHRcblx0ICBpZiAocm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgIHJlZ2V4cCA9IHJvdXRlO1xuXHQgIH0gZWxzZSB7XG5cdCAgICByZWdleHAgPSBuZXcgUmVnRXhwKGNsZWFuKHJvdXRlKS5yZXBsYWNlKFBBUkFNRVRFUl9SRUdFWFAsIGZ1bmN0aW9uIChmdWxsLCBkb3RzLCBuYW1lKSB7XG5cdCAgICAgIHBhcmFtTmFtZXMucHVzaChuYW1lKTtcblx0ICAgICAgcmV0dXJuIFJFUExBQ0VfVkFSSUFCTEVfUkVHRVhQO1xuXHQgICAgfSkucmVwbGFjZShXSUxEQ0FSRF9SRUdFWFAsIFJFUExBQ0VfV0lMRENBUkQpICsgRk9MTE9XRURfQllfU0xBU0hfUkVHRVhQKTtcblx0ICB9XG5cdCAgcmV0dXJuIHsgcmVnZXhwOiByZWdleHAsIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMgfTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZmluZE1hdGNoZWRSb3V0ZXModXJsKSB7XG5cdCAgdmFyIHJvdXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICByZXR1cm4gcm91dGVzLm1hcChmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciBfcmVwbGFjZUR5bmFtaWNVUkxQYXIgPSByZXBsYWNlRHluYW1pY1VSTFBhcnRzKHJvdXRlLnJvdXRlKTtcblx0XG5cdCAgICB2YXIgcmVnZXhwID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnJlZ2V4cDtcblx0ICAgIHZhciBwYXJhbU5hbWVzID0gX3JlcGxhY2VEeW5hbWljVVJMUGFyLnBhcmFtTmFtZXM7XG5cdFxuXHQgICAgdmFyIG1hdGNoID0gdXJsLm1hdGNoKHJlZ2V4cCk7XG5cdCAgICB2YXIgcGFyYW1zID0gcmVnRXhwUmVzdWx0VG9QYXJhbXMobWF0Y2gsIHBhcmFtTmFtZXMpO1xuXHRcblx0ICAgIHJldHVybiBtYXRjaCA/IHsgbWF0Y2g6IG1hdGNoLCByb3V0ZTogcm91dGUsIHBhcmFtczogcGFyYW1zIH0gOiBmYWxzZTtcblx0ICB9KS5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcblx0ICAgIHJldHVybiBtO1xuXHQgIH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBtYXRjaCh1cmwsIHJvdXRlcykge1xuXHQgIHJldHVybiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwsIHJvdXRlcylbMF0gfHwgZmFsc2U7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJvb3QodXJsLCByb3V0ZXMpIHtcblx0ICB2YXIgbWF0Y2hlZCA9IGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHtcblx0ICAgIHZhciB1ID0gY2xlYW4ocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHJldHVybiB1ICE9PSAnJyAmJiB1ICE9PSAnKic7XG5cdCAgfSkpO1xuXHQgIHZhciBmYWxsYmFja1VSTCA9IGNsZWFuKHVybCk7XG5cdFxuXHQgIGlmIChtYXRjaGVkLmxlbmd0aCA+IDApIHtcblx0ICAgIHJldHVybiBtYXRjaGVkLm1hcChmdW5jdGlvbiAobSkge1xuXHQgICAgICByZXR1cm4gY2xlYW4odXJsLnN1YnN0cigwLCBtLm1hdGNoLmluZGV4KSk7XG5cdCAgICB9KS5yZWR1Y2UoZnVuY3Rpb24gKHJvb3QsIGN1cnJlbnQpIHtcblx0ICAgICAgcmV0dXJuIGN1cnJlbnQubGVuZ3RoIDwgcm9vdC5sZW5ndGggPyBjdXJyZW50IDogcm9vdDtcblx0ICAgIH0sIGZhbGxiYWNrVVJMKTtcblx0ICB9XG5cdCAgcmV0dXJuIGZhbGxiYWNrVVJMO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpIHtcblx0ICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gTmF2aWdvKHIsIHVzZUhhc2gpIHtcblx0ICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICB0aGlzLnJvb3QgPSB1c2VIYXNoICYmIHIgPyByLnJlcGxhY2UoL1xcLyQvLCAnLyMnKSA6IHIgfHwgbnVsbDtcblx0ICB0aGlzLl91c2VIYXNoID0gdXNlSGFzaDtcblx0ICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcblx0ICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IG51bGw7XG5cdCAgdGhpcy5fbm90Rm91bmRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IG51bGw7XG5cdCAgdGhpcy5fb2sgPSAhdXNlSGFzaCAmJiBpc1B1c2hTdGF0ZUF2YWlsYWJsZSgpO1xuXHQgIHRoaXMuX2xpc3RlbigpO1xuXHQgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG5cdH1cblx0XG5cdE5hdmlnby5wcm90b3R5cGUgPSB7XG5cdCAgaGVscGVyczoge1xuXHQgICAgbWF0Y2g6IG1hdGNoLFxuXHQgICAgcm9vdDogcm9vdCxcblx0ICAgIGNsZWFuOiBjbGVhblxuXHQgIH0sXG5cdCAgbmF2aWdhdGU6IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGgsIGFic29sdXRlKSB7XG5cdCAgICB2YXIgdG87XG5cdFxuXHQgICAgcGF0aCA9IHBhdGggfHwgJyc7XG5cdCAgICBpZiAodGhpcy5fb2spIHtcblx0ICAgICAgdG8gPSAoIWFic29sdXRlID8gdGhpcy5fZ2V0Um9vdCgpICsgJy8nIDogJycpICsgY2xlYW4ocGF0aCk7XG5cdCAgICAgIHRvID0gdG8ucmVwbGFjZSgvKFteOl0pKFxcL3syLH0pL2csICckMS8nKTtcblx0ICAgICAgaGlzdG9yeVt0aGlzLl9wYXVzZWQgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7fSwgJycsIHRvKTtcblx0ICAgICAgdGhpcy5yZXNvbHZlKCk7XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvIyguKikkLywgJycpICsgJyMnICsgcGF0aDtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgb246IGZ1bmN0aW9uIG9uKCkge1xuXHQgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuXHQgICAgICB0aGlzLl9hZGQoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdLCBhcmd1bWVudHMubGVuZ3RoIDw9IDEgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMV0pO1xuXHQgICAgfSBlbHNlIGlmIChfdHlwZW9mKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIGZvciAodmFyIHJvdXRlIGluIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkge1xuXHQgICAgICAgIHRoaXMuX2FkZChyb3V0ZSwgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSlbcm91dGVdKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgKGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9LFxuXHQgIG5vdEZvdW5kOiBmdW5jdGlvbiBub3RGb3VuZChoYW5kbGVyKSB7XG5cdCAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBoYW5kbGVyO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZShjdXJyZW50KSB7XG5cdCAgICB2YXIgaGFuZGxlciwgbTtcblx0ICAgIHZhciB1cmwgPSAoY3VycmVudCB8fCB0aGlzLl9jTG9jKCkpLnJlcGxhY2UodGhpcy5fZ2V0Um9vdCgpLCAnJyk7XG5cdFxuXHQgICAgaWYgKHRoaXMuX3BhdXNlZCB8fCB1cmwgPT09IHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkKSByZXR1cm4gZmFsc2U7XG5cdCAgICBpZiAodGhpcy5fdXNlSGFzaCkge1xuXHQgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLyMvLCAnLycpO1xuXHQgICAgfVxuXHQgICAgbSA9IG1hdGNoKHVybCwgdGhpcy5fcm91dGVzKTtcblx0XG5cdCAgICBpZiAobSkge1xuXHQgICAgICB0aGlzLl9sYXN0Um91dGVSZXNvbHZlZCA9IHVybDtcblx0ICAgICAgaGFuZGxlciA9IG0ucm91dGUuaGFuZGxlcjtcblx0ICAgICAgbS5yb3V0ZS5yb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCA/IGhhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBfdG9Db25zdW1hYmxlQXJyYXkobS5tYXRjaC5zbGljZSgxLCBtLm1hdGNoLmxlbmd0aCkpKSA6IGhhbmRsZXIobS5wYXJhbXMpO1xuXHQgICAgICByZXR1cm4gbTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmYXVsdEhhbmRsZXIgJiYgKHVybCA9PT0gJycgfHwgdXJsID09PSAnLycpKSB7XG5cdCAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyKCk7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9ub3RGb3VuZEhhbmRsZXIpIHtcblx0ICAgICAgdGhpcy5fbm90Rm91bmRIYW5kbGVyKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSxcblx0ICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgdGhpcy5fcm91dGVzID0gW107XG5cdCAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXHQgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCk7XG5cdCAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbCA6IG51bGw7XG5cdCAgfSxcblx0ICB1cGRhdGVQYWdlTGlua3M6IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VMaW5rcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0XG5cdCAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXHRcblx0ICAgIHRoaXMuX2ZpbmRMaW5rcygpLmZvckVhY2goZnVuY3Rpb24gKGxpbmspIHtcblx0ICAgICAgaWYgKCFsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQpIHtcblx0ICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0ICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cdFxuXHQgICAgICAgICAgaWYgKCFzZWxmLl9kZXN0cm95ZWQpIHtcblx0ICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBzZWxmLm5hdmlnYXRlKGNsZWFuKGxvY2F0aW9uKSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgbGluay5oYXNMaXN0ZW5lckF0dGFjaGVkID0gdHJ1ZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBnZW5lcmF0ZTogZnVuY3Rpb24gZ2VuZXJhdGUobmFtZSkge1xuXHQgICAgdmFyIGRhdGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICByZXR1cm4gdGhpcy5fcm91dGVzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCByb3V0ZSkge1xuXHQgICAgICB2YXIga2V5O1xuXHRcblx0ICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IG5hbWUpIHtcblx0ICAgICAgICByZXN1bHQgPSByb3V0ZS5yb3V0ZTtcblx0ICAgICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG5cdCAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgnOicgKyBrZXksIGRhdGFba2V5XSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LCAnJyk7XG5cdCAgfSxcblx0ICBsaW5rOiBmdW5jdGlvbiBsaW5rKHBhdGgpIHtcblx0ICAgIHJldHVybiB0aGlzLl9nZXRSb290KCkgKyBwYXRoO1xuXHQgIH0sXG5cdCAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKHN0YXR1cykge1xuXHQgICAgdGhpcy5fcGF1c2VkID0gc3RhdHVzO1xuXHQgIH0sXG5cdCAgZGlzYWJsZUlmQVBJTm90QXZhaWxhYmxlOiBmdW5jdGlvbiBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGUoKSB7XG5cdCAgICBpZiAoIWlzUHVzaFN0YXRlQXZhaWxhYmxlKCkpIHtcblx0ICAgICAgdGhpcy5kZXN0cm95KCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfYWRkOiBmdW5jdGlvbiBfYWRkKHJvdXRlKSB7XG5cdCAgICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgICAgaWYgKCh0eXBlb2YgaGFuZGxlciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaGFuZGxlcikpID09PSAnb2JqZWN0Jykge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlci51c2VzLCBuYW1lOiBoYW5kbGVyLmFzIH0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdGhpcy5fcm91dGVzLnB1c2goeyByb3V0ZTogcm91dGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fYWRkO1xuXHQgIH0sXG5cdCAgX2dldFJvb3Q6IGZ1bmN0aW9uIF9nZXRSb290KCkge1xuXHQgICAgaWYgKHRoaXMucm9vdCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMucm9vdDtcblx0ICAgIHRoaXMucm9vdCA9IHJvb3QodGhpcy5fY0xvYygpLCB0aGlzLl9yb3V0ZXMpO1xuXHQgICAgcmV0dXJuIHRoaXMucm9vdDtcblx0ICB9LFxuXHQgIF9saXN0ZW46IGZ1bmN0aW9uIF9saXN0ZW4oKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBfdGhpcy5yZXNvbHZlKCk7XG5cdCAgICAgIH07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciBjYWNoZWQgPSBfdGhpcy5fY0xvYygpLFxuXHQgICAgICAgICAgICBjdXJyZW50ID0gdW5kZWZpbmVkLFxuXHQgICAgICAgICAgICBfY2hlY2sgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICAgIF9jaGVjayA9IGZ1bmN0aW9uIGNoZWNrKCkge1xuXHQgICAgICAgICAgY3VycmVudCA9IF90aGlzLl9jTG9jKCk7XG5cdCAgICAgICAgICBpZiAoY2FjaGVkICE9PSBjdXJyZW50KSB7XG5cdCAgICAgICAgICAgIGNhY2hlZCA9IGN1cnJlbnQ7XG5cdCAgICAgICAgICAgIF90aGlzLnJlc29sdmUoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIF90aGlzLl9saXN0ZW5uaW5nSW50ZXJ2YWwgPSBzZXRUaW1lb3V0KF9jaGVjaywgMjAwKTtcblx0ICAgICAgICB9O1xuXHQgICAgICAgIF9jaGVjaygpO1xuXHQgICAgICB9KSgpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgX2NMb2M6IGZ1bmN0aW9uIF9jTG9jKCkge1xuXHQgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0ICB9LFxuXHQgIF9maW5kTGlua3M6IGZ1bmN0aW9uIF9maW5kTGlua3MoKSB7XG5cdCAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1uYXZpZ29dJykpO1xuXHQgIH1cblx0fTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE5hdmlnbztcblx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdmlnby5qcy5tYXAiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy50YXJyeSA9IGYoKX19KShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxudmFyIHJ1biA9IGZ1bmN0aW9uIHJ1bihjYiwgYXJncykge1xuICBjYigpO1xuICBhcmdzLmxlbmd0aCA+IDAgPyBhcmdzLnNoaWZ0KCkuYXBwbHkodW5kZWZpbmVkLCBfdG9Db25zdW1hYmxlQXJyYXkoYXJncykpIDogbnVsbDtcbn07XG5cbnZhciB0YXJyeSA9IGV4cG9ydHMudGFycnkgPSBmdW5jdGlvbiB0YXJyeShjYikge1xuICB2YXIgZGVsYXkgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVsYXkgPyBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBydW4oY2IsIGFyZ3MpO1xuICAgIH0sIGRlbGF5KSA6IHJ1bihjYiwgYXJncyk7XG4gIH07XG59O1xuXG52YXIgcXVldWUgPSBleHBvcnRzLnF1ZXVlID0gZnVuY3Rpb24gcXVldWUoKSB7XG4gIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJncy5zaGlmdCgpLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gIH07XG59O1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wcyA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtLXByb3BzJyk7XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHJhbnNmb3JtUHJvcHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaCA9IGZ1bmN0aW9uIGgodGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA/IGFwcGx5UHJvcHModGFnKShhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIDogYXBwZW5kQ2hpbGRyZW4odGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG52YXIgaXNPYmogPSBmdW5jdGlvbiBpc09iaihvKSB7XG4gIHJldHVybiBvICE9PSBudWxsICYmICh0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobykpID09PSAnb2JqZWN0Jztcbn07XG5cbnZhciBpc1Byb3BzID0gZnVuY3Rpb24gaXNQcm9wcyhhcmcpIHtcbiAgcmV0dXJuIGlzT2JqKGFyZykgJiYgIShhcmcgaW5zdGFuY2VvZiBFbGVtZW50KTtcbn07XG5cbnZhciBhcHBseVByb3BzID0gZnVuY3Rpb24gYXBwbHlQcm9wcyh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHJldHVybiBoKHRhZykoT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWwgPSBoKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgdmFyIHAgPSAoMCwgX3RyYW5zZm9ybVByb3BzMi5kZWZhdWx0KShwcm9wcyk7XG4gICAgICBPYmplY3Qua2V5cyhwKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmICgvXm9uLy50ZXN0KGspKSB7XG4gICAgICAgICAgZWxba10gPSBwW2tdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrLCBwW2tdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgfTtcbn07XG5cbnZhciBhcHBlbmRDaGlsZHJlbiA9IGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjaGlsZHJlbiA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgY2hpbGRyZW5bX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgaW5zdGFuY2VvZiBFbGVtZW50ID8gYyA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGMpO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBlbC5hcHBlbmRDaGlsZChjKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWw7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBoOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBrZWJhYiA9IGV4cG9ydHMua2ViYWIgPSBmdW5jdGlvbiBrZWJhYihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgcmV0dXJuICctJyArIGcudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59O1xuXG52YXIgcGFyc2VWYWx1ZSA9IGV4cG9ydHMucGFyc2VWYWx1ZSA9IGZ1bmN0aW9uIHBhcnNlVmFsdWUocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IGFkZFB4KHByb3ApKHZhbCkgOiB2YWw7XG4gIH07XG59O1xuXG52YXIgdW5pdGxlc3NQcm9wZXJ0aWVzID0gZXhwb3J0cy51bml0bGVzc1Byb3BlcnRpZXMgPSBbJ2xpbmVIZWlnaHQnLCAnZm9udFdlaWdodCcsICdvcGFjaXR5JywgJ3pJbmRleCdcbi8vIFByb2JhYmx5IG5lZWQgYSBmZXcgbW9yZS4uLlxuXTtcblxudmFyIGFkZFB4ID0gZXhwb3J0cy5hZGRQeCA9IGZ1bmN0aW9uIGFkZFB4KHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdW5pdGxlc3NQcm9wZXJ0aWVzLmluY2x1ZGVzKHByb3ApID8gdmFsIDogdmFsICsgJ3B4JztcbiAgfTtcbn07XG5cbnZhciBmaWx0ZXJOdWxsID0gZXhwb3J0cy5maWx0ZXJOdWxsID0gZnVuY3Rpb24gZmlsdGVyTnVsbChvYmopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV0gIT09IG51bGw7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlRGVjID0gZXhwb3J0cy5jcmVhdGVEZWMgPSBmdW5jdGlvbiBjcmVhdGVEZWMoc3R5bGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2ViYWIoa2V5KSArICc6JyArIHBhcnNlVmFsdWUoa2V5KShzdHlsZVtrZXldKTtcbiAgfTtcbn07XG5cbnZhciBzdHlsZVRvU3RyaW5nID0gZXhwb3J0cy5zdHlsZVRvU3RyaW5nID0gZnVuY3Rpb24gc3R5bGVUb1N0cmluZyhzdHlsZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGUpLmZpbHRlcihmaWx0ZXJOdWxsKHN0eWxlKSkubWFwKGNyZWF0ZURlYyhzdHlsZSkpLmpvaW4oJzsnKTtcbn07XG5cbnZhciBpc1N0eWxlT2JqZWN0ID0gZXhwb3J0cy5pc1N0eWxlT2JqZWN0ID0gZnVuY3Rpb24gaXNTdHlsZU9iamVjdChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPT09ICdzdHlsZScgJiYgcHJvcHNba2V5XSAhPT0gbnVsbCAmJiBfdHlwZW9mKHByb3BzW2tleV0pID09PSAnb2JqZWN0JztcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVTdHlsZSA9IGV4cG9ydHMuY3JlYXRlU3R5bGUgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZShwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBpc1N0eWxlT2JqZWN0KHByb3BzKShrZXkpID8gc3R5bGVUb1N0cmluZyhwcm9wc1trZXldKSA6IHByb3BzW2tleV07XG4gIH07XG59O1xuXG52YXIgcmVkdWNlUHJvcHMgPSBleHBvcnRzLnJlZHVjZVByb3BzID0gZnVuY3Rpb24gcmVkdWNlUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhLCBrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhLCBfZGVmaW5lUHJvcGVydHkoe30sIGtleSwgY3JlYXRlU3R5bGUocHJvcHMpKGtleSkpKTtcbiAgfTtcbn07XG5cbnZhciB0cmFuc2Zvcm1Qcm9wcyA9IGV4cG9ydHMudHJhbnNmb3JtUHJvcHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShyZWR1Y2VQcm9wcyhwcm9wcyksIHt9KTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zZm9ybVByb3BzOyJdfQ==
