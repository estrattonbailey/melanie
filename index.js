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
  var delay = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  id: 0,
  prompt: 'Hi :) welcome to my site. What are you looking for?',
  answers: [{
    value: 'my work',
    next: '/work'
  }, {
    value: 'funny jokes',
    next: 1
  }, {
    value: 'GIFs',
    next: 'https://media.giphy.com/media/3o6ZsUJ44ffpnAW7Dy/giphy.gif'
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

},{}],5:[function(require,module,exports){
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
var title = exports.title = (0, _h2.default)('h1')({ class: 'mt0 cb' });

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

},{"h0":20}],6:[function(require,module,exports){
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

},{"tarry.js":2}],7:[function(require,module,exports){
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

var _giffer = require('./giffer');

var _giffer2 = _interopRequireDefault(_giffer);

var _elements = require('./elements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prev = void 0;
var data = (0, _data2.default)(_test2.default);

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

},{"../lib/router":9,"./data":3,"./data/test":4,"./elements":5,"./giffer":6}],8:[function(require,module,exports){
'use strict';

var _putz = require('putz');

var _putz2 = _interopRequireDefault(_putz);

var _router = require('./lib/router');

var _router2 = _interopRequireDefault(_router);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.__app = {
  colors: ['#35D3E8', '#FF4E42', '#FFEA51']
};

var returnColor = function returnColor() {
  return __app.colors[Math.round(Math.random() * (2 - 0) + 0)];
};

var loader = window.loader = (0, _putz2.default)(document.body, {
  speed: 100,
  trickle: 10
});

window.addEventListener('DOMContentLoaded', function () {
  (0, _app2.default)();

  _router2.default.on('after:route', function (_ref) {
    var route = _ref.route;

    document.body.style.color = returnColor();
  });
});

},{"./app":7,"./lib/router":9,"putz":1}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _operator = require('../../../../operator');

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
}; // import operator from 'operator.js'


var app = (0, _operator2.default)({
  root: '#root'
});

app.on('after:route', function (_ref) {
  var route = _ref.route;
  var title = _ref.title;

  gaTrackPageView(route, title);
});

app.on('after:transition', function () {
  return loader && loader.end();
});

window.app = app;

exports.default = app;

},{"../../../../operator":10}],10:[function(require,module,exports){
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
      cb ? cb(to, title) : router.navigate(to);

      // Update state
      pushRoute(to, title);

      events.emit('after:route', { route: to, title: title });
    });
  }

  function push() {
    var loc = arguments.length <= 0 || arguments[0] === undefined ? state.route : arguments[0];
    var title = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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

},{"./lib/dom.js":11,"./lib/util.js":12,"delegate":14,"loop.js":15,"nanoajax":17,"navigo":18}],11:[function(require,module,exports){
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

},{"./util":12,"tarry.js":19}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":16}],14:[function(require,module,exports){
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

},{"closest":13}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){

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
},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
  var delay = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
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

},{}],20:[function(require,module,exports){
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
},{"./transform-props":21}],21:[function(require,module,exports){
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
},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHV0ei9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90YXJyeS5qcy9pbmRleC5qcyIsInNyYy9qcy9hcHAvZGF0YS5qcyIsInNyYy9qcy9hcHAvZGF0YS90ZXN0LmpzIiwic3JjL2pzL2FwcC9lbGVtZW50cy5qcyIsInNyYy9qcy9hcHAvZ2lmZmVyLmpzIiwic3JjL2pzL2FwcC9pbmRleC5qcyIsInNyYy9qcy9pbmRleC5qcyIsInNyYy9qcy9saWIvcm91dGVyLmpzIiwiLi4vb3BlcmF0b3IvaW5kZXguanMiLCIuLi9vcGVyYXRvci9saWIvZG9tLmpzIiwiLi4vb3BlcmF0b3IvbGliL3V0aWwuanMiLCIuLi9vcGVyYXRvci9ub2RlX21vZHVsZXMvY2xvc2VzdC9pbmRleC5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy9kZWxlZ2F0ZS9zcmMvZGVsZWdhdGUuanMiLCIuLi9vcGVyYXRvci9ub2RlX21vZHVsZXMvbG9vcC5qcy9pbmRleC5qcyIsIi4uL29wZXJhdG9yL25vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL25hbm9hamF4L2luZGV4LmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL25hdmlnby9saWIvbmF2aWdvLmpzIiwiLi4vb3BlcmF0b3Ivbm9kZV9tb2R1bGVzL3RhcnJ5LmpzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvaDAvZGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2gwL2Rpc3QvdHJhbnNmb3JtLXByb3BzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQUMsSUFBRCxFQUFPLFNBQVAs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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IiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IGNyZWF0ZUJhciA9IChyb290LCBjbGFzc25hbWUpID0+IHtcbiAgbGV0IG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBsZXQgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgby5jbGFzc05hbWUgPSBjbGFzc25hbWUgXG4gIGkuY2xhc3NOYW1lID0gYCR7Y2xhc3NuYW1lfV9faW5uZXJgXG4gIG8uYXBwZW5kQ2hpbGQoaSlcbiAgcm9vdC5pbnNlcnRCZWZvcmUobywgcm9vdC5jaGlsZHJlblswXSlcblxuICByZXR1cm4ge1xuICAgIG91dGVyOiBvLFxuICAgIGlubmVyOiBpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKHJvb3QgPSBkb2N1bWVudC5ib2R5LCBvcHRzID0ge30pID0+IHtcbiAgbGV0IHRpbWVyID0gbnVsbFxuICBjb25zdCBzcGVlZCA9IG9wdHMuc3BlZWQgfHwgMjAwXG4gIGNvbnN0IGNsYXNzbmFtZSA9IG9wdHMuY2xhc3NuYW1lIHx8ICdwdXR6J1xuICBjb25zdCB0cmlja2xlID0gb3B0cy50cmlja2xlIHx8IDUgXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgcHJvZ3Jlc3M6IDBcbiAgfVxuXG4gIGNvbnN0IGJhciA9IGNyZWF0ZUJhcihyb290LCBjbGFzc25hbWUpXG5cbiAgY29uc3QgcmVuZGVyID0gKHZhbCA9IDApID0+IHtcbiAgICBzdGF0ZS5wcm9ncmVzcyA9IHZhbFxuICAgIGJhci5pbm5lci5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKCR7c3RhdGUuYWN0aXZlID8gJzAnIDogJy0xMDAlJ30pIHRyYW5zbGF0ZVgoJHstMTAwICsgc3RhdGUucHJvZ3Jlc3N9JSk7YFxuICB9XG5cbiAgY29uc3QgZ28gPSB2YWwgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICByZW5kZXIoTWF0aC5taW4odmFsLCA5NSkpXG4gIH1cblxuICBjb25zdCBpbmMgPSAodmFsID0gKE1hdGgucmFuZG9tKCkgKiB0cmlja2xlKSkgPT4gZ28oc3RhdGUucHJvZ3Jlc3MgKyB2YWwpXG5cbiAgY29uc3QgZW5kID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlXG4gICAgcmVuZGVyKDEwMClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlbmRlcigpLCBzcGVlZClcbiAgICBpZiAodGltZXIpeyBjbGVhclRpbWVvdXQodGltZXIpIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIHN0YXRlLmFjdGl2ZSA9IHRydWVcbiAgICBpbmMoKVxuICB9XG5cbiAgY29uc3QgcHV0eiA9IChpbnRlcnZhbCA9IDUwMCkgPT4ge1xuICAgIGlmICghc3RhdGUuYWN0aXZlKXsgcmV0dXJuIH1cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IGluYygpLCBpbnRlcnZhbClcbiAgfVxuICBcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoe1xuICAgIHB1dHosXG4gICAgc3RhcnQsXG4gICAgaW5jLFxuICAgIGdvLFxuICAgIGVuZCxcbiAgICBnZXRTdGF0ZTogKCkgPT4gc3RhdGVcbiAgfSx7XG4gICAgYmFyOiB7XG4gICAgICB2YWx1ZTogYmFyXG4gICAgfVxuICB9KVxufVxuIiwiY29uc3QgcnVuID0gKGNiLCBhcmdzKSA9PiB7XG4gIGNiKClcbiAgYXJncy5sZW5ndGggPiAwICYmIGFyZ3Muc2hpZnQoKSguLi5hcmdzKVxufVxuXG5leHBvcnQgY29uc3QgdGFycnkgPSAoY2IsIGRlbGF5ID0gbnVsbCkgPT4gKC4uLmFyZ3MpID0+IHtcbiAgbGV0IG92ZXJyaWRlID0gJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzBdID8gYXJnc1swXSA6IG51bGwgXG4gIHJldHVybiAnbnVtYmVyJyA9PT0gdHlwZW9mIG92ZXJyaWRlICYmIG92ZXJyaWRlID4gLTEgXG4gICAgPyB0YXJyeShjYiwgb3ZlcnJpZGUpIFxuICAgIDogJ251bWJlcicgPT09IHR5cGVvZiBkZWxheSAmJiBkZWxheSA+IC0xIFxuICAgICAgPyBzZXRUaW1lb3V0KCgpID0+IHJ1bihjYiwgYXJncyksIGRlbGF5KSBcbiAgICAgIDogcnVuKGNiLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgcXVldWUgPSAoLi4uYXJncykgPT4gKCkgPT4gYXJncy5zaGlmdCgpKC4uLmFyZ3MpXG4iLCJjb25zdCBmaW5kTGluayA9IChpZCwgZGF0YSkgPT4gZGF0YS5maWx0ZXIobCA9PiBsLmlkID09PSBpZClbMF1cblxuY29uc3QgY3JlYXRlTGluayA9ICh7IGFuc3dlcnMgfSwgZGF0YSkgPT4gYW5zd2Vycy5mb3JFYWNoKGEgPT4ge1xuICBsZXQgaXNQYXRoID0gL15cXC8vLnRlc3QoYS5uZXh0KSA/IHRydWUgOiBmYWxzZVxuICBsZXQgaXNHSUYgPSAvZ2lmLy50ZXN0KGEubmV4dCkgPyB0cnVlIDogZmFsc2VcbiAgYS5uZXh0ID0gaXNQYXRoIHx8IGlzR0lGID8gYS5uZXh0IDogZmluZExpbmsoYS5uZXh0LCBkYXRhKVxufSlcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKHF1ZXN0aW9ucykgPT4ge1xuXHRxdWVzdGlvbnMubWFwKHEgPT4gY3JlYXRlTGluayhxLCBxdWVzdGlvbnMpKVxuXHRyZXR1cm4gcXVlc3Rpb25zXG59XG5cbmV4cG9ydCBkZWZhdWx0IHF1ZXN0aW9ucyA9PiB7XG4gIHJldHVybiB7XG4gICAgc3RvcmU6IGNyZWF0ZVN0b3JlKHF1ZXN0aW9ucyksXG4gICAgZ2V0QWN0aXZlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmlsdGVyKHEgPT4gcS5pZCA9PSB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgvIy8pWzFdKVswXSB8fCB0aGlzLnN0b3JlWzBdXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBpZDogMCxcbiAgICBwcm9tcHQ6IGBIaSA6KSB3ZWxjb21lIHRvIG15IHNpdGUuIFdoYXQgYXJlIHlvdSBsb29raW5nIGZvcj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdteSB3b3JrJyxcbiAgICAgICAgbmV4dDogJy93b3JrJyBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnZnVubnkgam9rZXMnLFxuICAgICAgICBuZXh0OiAxIFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdHSUZzJyxcbiAgICAgICAgbmV4dDogJ2h0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzNvNlpzVUo0NGZmcG5BVzdEeS9naXBoeS5naWYnIFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGlkOiAxLFxuICAgIHByb21wdDogYFdoeT9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdJIHdhbnQgdG8gaGlyZSB5b3UhJyxcbiAgICAgICAgbmV4dDogMyBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHZhbHVlOiAnanVzdCBjdXJpb3VzJyxcbiAgICAgICAgbmV4dDogMyBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBpZDogMixcbiAgICBwcm9tcHQ6IGBXaGF0J3MgZnVubmllciB0aGFuIGEgcmhldG9yaWNhbCBxdWVzdGlvbj9gLFxuICAgIGFuc3dlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdZZXMnLFxuICAgICAgICBuZXh0OiAwIFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdmFsdWU6ICdObycsXG4gICAgICAgIG5leHQ6IDMgXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgaWQ6IDMsXG4gICAgcHJvbXB0OiBgTW9tP2AsXG4gICAgYW5zd2VyczogW1xuICAgICAge1xuICAgICAgICB2YWx1ZTogJ0kgbG92ZSB5b3UsIGhvbmV5IScsXG4gICAgICAgIG5leHQ6ICdodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS9GR1RWbXprc2IyajBrL2dpcGh5LmdpZicgXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB2YWx1ZTogJ3doYXQsIG5vJyxcbiAgICAgICAgbmV4dDogJy93b3JrJyBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5dXG4iLCJpbXBvcnQgaDAgZnJvbSAnaDAnXG5cbmV4cG9ydCBjb25zdCBkaXYgPSBoMCgnZGl2JylcbmV4cG9ydCBjb25zdCBidXR0b24gPSBoMCgnYnV0dG9uJykoe2NsYXNzOiAnaDIgbXYwIGlubGluZS1ibG9jayd9KVxuZXhwb3J0IGNvbnN0IHRpdGxlID0gaDAoJ2gxJykoe2NsYXNzOiAnbXQwIGNiJ30pXG5cbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZSA9ICh7cHJvbXB0LCBhbnN3ZXJzfSwgY2IpID0+IHtcbiAgcmV0dXJuIGRpdih7Y2xhc3M6ICdxdWVzdGlvbid9KShcbiAgICB0aXRsZShwcm9tcHQpLFxuICAgIGRpdihcbiAgICAgIC4uLmFuc3dlcnMubWFwKChhLCBpKSA9PiBidXR0b24oe1xuICAgICAgICBvbmNsaWNrOiAoZSkgPT4gY2IoYS5uZXh0KSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBjb2xvcjogd2luZG93Ll9fYXBwLmNvbG9yc1tpXVxuICAgICAgICB9XG4gICAgICB9KShhLnZhbHVlKSlcbiAgICApXG4gIClcbn1cbiIsImltcG9ydCB7IHRhcnJ5LCBxdWV1ZSB9IGZyb20gJ3RhcnJ5LmpzJ1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dpZicpXG4gIGNvbnN0IGltZyA9IG1vZGFsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKVswXVxuXG4gIGNvbnN0IHNob3cgPSB0YXJyeSgoKSA9PiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJykgXG4gIGNvbnN0IGhpZGUgPSB0YXJyeSgoKSA9PiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKSBcbiAgY29uc3QgdG9nZ2xlID0gdGFycnkoXG4gICAgKCkgPT4gbW9kYWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSBcbiAgICAgID8gbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgIDogbW9kYWwuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJylcbiAgKVxuXG4gIGNvbnN0IGxhenkgPSAodXJsLCBjYikgPT4ge1xuICAgIGxldCBidXJuZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgYnVybmVyLm9ubG9hZCA9ICgpID0+IGNiKHVybClcblxuICAgIGJ1cm5lci5zcmMgPSB1cmxcbiAgfVxuXG4gIGNvbnN0IG9wZW4gPSB1cmwgPT4ge1xuICAgIHdpbmRvdy5sb2FkZXIuc3RhcnQoKVxuICAgIHdpbmRvdy5sb2FkZXIucHV0eig1MDApXG5cbiAgICBsYXp5KHVybCwgdXJsID0+IHtcbiAgICAgIGltZy5zcmMgPSB1cmxcbiAgICAgIHF1ZXVlKHNob3csIHRvZ2dsZSgyMDApKSgpXG4gICAgICB3aW5kb3cubG9hZGVyLmVuZCgpXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIHF1ZXVlKHRvZ2dsZSwgaGlkZSgyMDApKSgpXG4gIH1cblxuICBtb2RhbC5vbmNsaWNrID0gY2xvc2VcblxuICByZXR1cm4ge1xuICAgIG9wZW4sXG4gICAgY2xvc2VcbiAgfVxufVxuIiwiaW1wb3J0IHJvdXRlciBmcm9tICcuLi9saWIvcm91dGVyJ1xuaW1wb3J0IHF1ZXN0aW9ucyBmcm9tICcuL2RhdGEvdGVzdCdcbmltcG9ydCBzdG9yYWdlIGZyb20gJy4vZGF0YSdcbmltcG9ydCBnaWZmZXIgZnJvbSAnLi9naWZmZXInXG5pbXBvcnQgeyB0ZW1wbGF0ZSB9IGZyb20gJy4vZWxlbWVudHMnXG5cbmxldCBwcmV2XG5jb25zdCBkYXRhID0gc3RvcmFnZShxdWVzdGlvbnMpXG5cbi8qKlxuICogUmVuZGVyIHRlbXBsYXRlIGFuZCBhcHBlbmQgdG8gRE9NXG4gKi9cbmNvbnN0IHJlbmRlciA9IChuZXh0KSA9PiB7XG4gIGxldCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcblxuICBsZXQgZWwgPSB0ZW1wbGF0ZShuZXh0LCB1cGRhdGUpXG4gIHF1ZXN0aW9uUm9vdCAmJiBxdWVzdGlvblJvb3QuYXBwZW5kQ2hpbGQoZWwpXG4gIHJldHVybiBlbCBcbn1cblxuLyoqXG4gKiBIYW5kbGUgRE9NIHVwZGF0ZXMsIG90aGVyIGxpbmsgY2xpY2tzXG4gKi9cbmNvbnN0IHVwZGF0ZSA9IChuZXh0KSA9PiB7XG4gIGxldCBxdWVzdGlvblJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb25Sb290JylcblxuICBsZXQgaXNHSUYgPSAvZ2lwaHkvLnRlc3QobmV4dClcbiAgaWYgKGlzR0lGKSByZXR1cm4gZ2lmZmVyKCkub3BlbihuZXh0KVxuXG4gIGxldCBpc1BhdGggPSAvXlxcLy8udGVzdChuZXh0KVxuICBpZiAoaXNQYXRoKSByZXR1cm4gcm91dGVyLmdvKG5leHQpXG5cbiAgaWYgKHByZXYgJiYgcXVlc3Rpb25Sb290ICYmIHF1ZXN0aW9uUm9vdC5jb250YWlucyhwcmV2KSkgcXVlc3Rpb25Sb290LnJlbW92ZUNoaWxkKHByZXYpXG5cbiAgcHJldiA9IHJlbmRlcihuZXh0KVxuXG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV4dC5pZFxufVxuXG4vKipcbiAqIFdhaXQgdW50aWwgbmV3IERPTSBpcyBwcmVzZW50IGJlZm9yZVxuICogdHJ5aW5nIHRvIHJlbmRlciB0byBpdFxuICovXG5yb3V0ZXIub24oJ2FmdGVyOnJvdXRlJywgKHtyb3V0ZX0pID0+IHtcbiAgaWYgKC8oXlxcL3xcXC8jWzAtOV18I1swLTldKS8udGVzdChyb3V0ZSkpe1xuICAgIHVwZGF0ZShkYXRhLmdldEFjdGl2ZSgpKVxuICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHByZXYgPSByZW5kZXIoZGF0YS5nZXRBY3RpdmUoKSlcbn1cbiIsImltcG9ydCBwdXR6IGZyb20gJ3B1dHonXG5pbXBvcnQgcm91dGVyIGZyb20gJy4vbGliL3JvdXRlcidcbmltcG9ydCBhcHAgZnJvbSAnLi9hcHAnXG5cbndpbmRvdy5fX2FwcCA9IHtcbiAgY29sb3JzOiBbXG4gICAgJyMzNUQzRTgnLFxuICAgICcjRkY0RTQyJyxcbiAgICAnI0ZGRUE1MSdcbiAgXVxufVxuXG5jb25zdCByZXR1cm5Db2xvciA9ICgpID0+IF9fYXBwLmNvbG9yc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAoMiAtIDApICsgMCldXG5cbmNvbnN0IGxvYWRlciA9IHdpbmRvdy5sb2FkZXIgPSBwdXR6KGRvY3VtZW50LmJvZHksIHtcbiAgc3BlZWQ6IDEwMCxcbiAgdHJpY2tsZTogMTBcbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBhcHAoKVxuXG4gIHJvdXRlci5vbignYWZ0ZXI6cm91dGUnLCAoeyByb3V0ZSB9KSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jb2xvciA9IHJldHVybkNvbG9yKClcbiAgfSlcbn0pXG4iLCIvLyBpbXBvcnQgb3BlcmF0b3IgZnJvbSAnb3BlcmF0b3IuanMnXG5pbXBvcnQgb3BlcmF0b3IgZnJvbSAnLi4vLi4vLi4vLi4vb3BlcmF0b3InXG5cbi8qKlxuICogU2VuZCBwYWdlIHZpZXdzIHRvIFxuICogR29vZ2xlIEFuYWx5dGljc1xuICovXG5jb25zdCBnYVRyYWNrUGFnZVZpZXcgPSAocGF0aCwgdGl0bGUpID0+IHtcbiAgbGV0IGdhID0gd2luZG93LmdhID8gd2luZG93LmdhIDogZmFsc2VcblxuICBpZiAoIWdhKSByZXR1cm5cblxuICBnYSgnc2V0Jywge3BhZ2U6IHBhdGgsIHRpdGxlOiB0aXRsZX0pO1xuICBnYSgnc2VuZCcsICdwYWdldmlldycpO1xufVxuXG5jb25zdCBhcHAgPSBvcGVyYXRvcih7XG4gIHJvb3Q6ICcjcm9vdCdcbn0pXG5cbmFwcC5vbignYWZ0ZXI6cm91dGUnLCAoeyByb3V0ZSwgdGl0bGUgfSkgPT4ge1xuICBnYVRyYWNrUGFnZVZpZXcocm91dGUsIHRpdGxlKVxufSlcblxuYXBwLm9uKCdhZnRlcjp0cmFuc2l0aW9uJywgKCkgPT4gbG9hZGVyICYmIGxvYWRlci5lbmQoKSlcblxud2luZG93LmFwcCA9IGFwcFxuXG5leHBvcnQgZGVmYXVsdCBhcHBcbiIsImltcG9ydCBsb29wIGZyb20gJ2xvb3AuanMnXG5pbXBvcnQgZGVsZWdhdGUgZnJvbSAnZGVsZWdhdGUnXG5pbXBvcnQgbmFub2FqYXggZnJvbSAnbmFub2FqYXgnXG5pbXBvcnQgbmF2aWdvIGZyb20gJ25hdmlnbydcbmltcG9ydCBkb20gZnJvbSAnLi9saWIvZG9tLmpzJ1xuaW1wb3J0IHsgXG4gIG9yaWdpbiwgXG4gIHNhbml0aXplLFxuICBzYXZlU2Nyb2xsUG9zaXRpb24sXG4gIHNjcm9sbFRvTG9jYXRpb24sXG4gIGxpbmssXG4gIHNldEFjdGl2ZUxpbmtzXG59IGZyb20gJy4vbGliL3V0aWwuanMnXG5cbmNvbnN0IHJvdXRlciA9IG5ldyBuYXZpZ28ob3JpZ2luKVxuXG5jb25zdCBzdGF0ZSA9IHtcbiAgX3N0YXRlOiB7XG4gICAgcm91dGU6ICcnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBwcmV2OiB7XG4gICAgICByb3V0ZTogJy8nLFxuICAgICAgdGl0bGU6ICcnLFxuICAgIH1cbiAgfSxcbiAgZ2V0IHJvdXRlKCl7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLnJvdXRlXG4gIH0sXG4gIHNldCByb3V0ZShsb2Mpe1xuICAgIHRoaXMuX3N0YXRlLnByZXYucm91dGUgPSB0aGlzLnJvdXRlXG4gICAgdGhpcy5fc3RhdGUucm91dGUgPSBsb2NcbiAgICBzZXRBY3RpdmVMaW5rcyhsb2MpXG4gIH0sXG4gIGdldCB0aXRsZSgpe1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS50aXRsZVxuICB9LFxuICBzZXQgdGl0bGUodmFsKXtcbiAgICB0aGlzLl9zdGF0ZS5wcmV2LnRpdGxlID0gdGhpcy50aXRsZVxuICAgIHRoaXMuX3N0YXRlLnRpdGxlID0gdmFsXG4gICAgZG9jdW1lbnQudGl0bGUgPSB2YWxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAob3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQuYm9keVxuICBjb25zdCBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gfHwgMFxuICBjb25zdCBpZ25vcmUgPSBvcHRpb25zLmlnbm9yZSB8fCBbXVxuXG4gIGNvbnN0IGV2ZW50cyA9IGxvb3AoKVxuICBjb25zdCByZW5kZXIgPSBkb20ocm9vdCwgZHVyYXRpb24sIGV2ZW50cylcblxuICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoe1xuICAgIC4uLmV2ZW50cyxcbiAgICBzdG9wKCl7IHN0YXRlLnBhdXNlZCA9IHRydWUgfSxcbiAgICBzdGFydCgpeyBzdGF0ZS5wYXVzZWQgPSBmYWxzZSB9LFxuICAgIGdvLFxuICAgIHB1c2hcbiAgfSwge1xuICAgIGdldFN0YXRlOiB7XG4gICAgICB2YWx1ZTogKCkgPT4gc3RhdGUuX3N0YXRlXG4gICAgfVxuICB9KVxuXG4gIHN0YXRlLnJvdXRlID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG4gIHN0YXRlLnRpdGxlID0gZG9jdW1lbnQudGl0bGUgXG5cbiAgZGVsZWdhdGUoZG9jdW1lbnQsICdhJywgJ2NsaWNrJywgKGUpID0+IHtcbiAgICBsZXQgYSA9IGUuZGVsZWdhdGVUYXJnZXRcbiAgICBsZXQgaHJlZiA9IGEuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJy8nXG4gICAgbGV0IHJvdXRlID0gc2FuaXRpemUoaHJlZilcblxuICAgIGlmIChcbiAgICAgICFsaW5rLmlzU2FtZU9yaWdpbihocmVmKVxuICAgICAgfHwgYS5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnXG4gICAgICB8fCBtYXRjaGVzKGUsIHJvdXRlKVxuICAgICAgfHwgbGluay5pc0hhc2goaHJlZilcbiAgICApeyByZXR1cm4gfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAoXG4gICAgICBsaW5rLmlzU2FtZVVSTChocmVmKVxuICAgICl7IHJldHVybiB9XG5cbiAgICBzYXZlU2Nyb2xsUG9zaXRpb24oKVxuXG4gICAgZ28oYCR7b3JpZ2lufS8ke3JvdXRlfWAsIHRvID0+IHJvdXRlci5uYXZpZ2F0ZSh0bykpXG4gIH0pXG5cbiAgd2luZG93Lm9ucG9wc3RhdGUgPSBlID0+IHtcbiAgICBsZXQgdG8gPSBlLnRhcmdldC5sb2NhdGlvbi5ocmVmXG5cbiAgICBpZiAobWF0Y2hlcyhlLCB0bykpeyBcbiAgICAgIGlmIChsaW5rLmlzSGFzaCh0bykpeyByZXR1cm4gfVxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICByZXR1cm4gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9wc3RhdGUgYnlwYXNzZXMgcm91dGVyLCBzbyB3ZSBcbiAgICAgKiBuZWVkIHRvIHRlbGwgaXQgd2hlcmUgd2Ugd2VudCB0b1xuICAgICAqIHdpdGhvdXQgcHVzaGluZyBzdGF0ZVxuICAgICAqL1xuICAgIGdvKHRvLCBsb2MgPT4gcm91dGVyLnJlc29sdmUobG9jKSlcbiAgfVxuXG4gIGlmICgnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3Rvcnkpe1xuICAgIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJ1xuXG4gICAgaWYgKGhpc3Rvcnkuc3RhdGUgJiYgaGlzdG9yeS5zdGF0ZS5zY3JvbGxUb3AgIT09IHVuZGVmaW5lZCl7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgaGlzdG9yeS5zdGF0ZS5zY3JvbGxUb3ApXG4gICAgfVxuXG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gc2F2ZVNjcm9sbFBvc2l0aW9uIFxuICB9XG5cbiAgZnVuY3Rpb24gZ28ocm91dGUsIGNiID0gbnVsbCl7XG4gICAgbGV0IHRvID0gc2FuaXRpemUocm91dGUpXG5cbiAgICBldmVudHMuZW1pdCgnYmVmb3JlOnJvdXRlJywge3JvdXRlOiB0b30pXG5cbiAgICBpZiAoc3RhdGUucGF1c2VkKXsgcmV0dXJuIH1cblxuICAgIGxldCByZXEgPSBnZXQoYCR7b3JpZ2lufS8ke3RvfWAsIHRpdGxlID0+IHtcbiAgICAgIGNiID8gY2IodG8sIHRpdGxlKSA6IHJvdXRlci5uYXZpZ2F0ZSh0bylcbiAgICAgIFxuICAgICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgICBwdXNoUm91dGUodG8sIHRpdGxlKVxuXG4gICAgICBldmVudHMuZW1pdCgnYWZ0ZXI6cm91dGUnLCB7cm91dGU6IHRvLCB0aXRsZX0pXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2gobG9jID0gc3RhdGUucm91dGUsIHRpdGxlID0gbnVsbCl7XG4gICAgcm91dGVyLm5hdmlnYXRlKGxvYylcbiAgICBzdGF0ZS5yb3V0ZSA9IGxvY1xuICAgIHRpdGxlID8gc3RhdGUudGl0bGUgPSB0aXRsZSA6IG51bGxcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldChyb3V0ZSwgY2Ipe1xuICAgIHJldHVybiBuYW5vYWpheC5hamF4KHsgXG4gICAgICBtZXRob2Q6ICdHRVQnLCBcbiAgICAgIHVybDogcm91dGUgXG4gICAgfSwgKHN0YXR1cywgcmVzLCByZXEpID0+IHtcbiAgICAgIGlmIChyZXEuc3RhdHVzIDwgMjAwIHx8IHJlcS5zdGF0dXMgPiAzMDAgJiYgcmVxLnN0YXR1cyAhPT0gMzA0KXtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IGAke29yaWdpbn0vJHtzdGF0ZS5fc3RhdGUucHJldi5yb3V0ZX1gXG4gICAgICB9XG4gICAgICByZW5kZXIocmVxLnJlc3BvbnNlLCBjYikgXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hSb3V0ZShsb2MsIHRpdGxlID0gbnVsbCl7XG4gICAgc3RhdGUucm91dGUgPSBsb2NcbiAgICB0aXRsZSA/IHN0YXRlLnRpdGxlID0gdGl0bGUgOiBudWxsXG4gIH1cblxuICBmdW5jdGlvbiBtYXRjaGVzKGV2ZW50LCByb3V0ZSl7XG4gICAgcmV0dXJuIGlnbm9yZS5maWx0ZXIodCA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0KSl7XG4gICAgICAgIGxldCByZXMgPSB0WzFdKHJvdXRlKVxuICAgICAgICBpZiAocmVzKXsgZXZlbnRzLmVtaXQodFswXSwge3JvdXRlLCBldmVudH0pIH1cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHQocm91dGUpIFxuICAgICAgfVxuICAgIH0pLmxlbmd0aCA+IDAgPyB0cnVlIDogZmFsc2VcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZVxufVxuIiwiaW1wb3J0IHsgdGFycnksIHF1ZXVlIH0gZnJvbSAndGFycnkuanMnXG5pbXBvcnQgeyByZXN0b3JlU2Nyb2xsUG9zIH0gZnJvbSAnLi91dGlsJ1xuXG4vKipcbiAqIEluaXQgbmV3IG5hdGl2ZSBwYXJzZXJcbiAqL1xuY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpXG5cbi8qKlxuICogR2V0IHRoZSB0YXJnZXQgb2YgdGhlIGFqYXggcmVxXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBTdHJpbmdpZmllZCBIVE1MXG4gKiBAcmV0dXJuIHtvYmplY3R9IERPTSBub2RlLCAjcGFnZVxuICovXG5jb25zdCBwYXJzZVJlc3BvbnNlID0gaHRtbCA9PiBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpXG5cbi8qKlxuICogRmluZHMgYWxsIDxzY3JpcHQ+IHRhZ3MgaW4gdGhlIG5ld1xuICogbWFya3VwIGFuZCBldmFsdWF0ZXMgdGhlaXIgY29udGVudHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gcm9vdCBET00gbm9kZSBjb250YWluaW5nIG5ldyBtYXJrdXAgdmlhIEFKQVhcbiAqIEBwYXJhbSB7Li4ub2JqZWN0fSBzb3VyY2VzIE90aGVyIERPTSBub2RlcyB0byBzY3JhcGUgc2NyaXB0IHRhZ3MgZnJvbSBcbiAqL1xuY29uc3QgZXZhbFNjcmlwdHMgPSAoc291cmNlLCByb290ID0gbnVsbCkgPT4ge1xuICBsZXQgZXJyb3JzID0gW11cbiAgY29uc3Qgc2NyaXB0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNvdXJjZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JykpXG4gIGNvbnN0IGV4aXN0aW5nID0gcm9vdCA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHJvb3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpKSA6IFtdXG5cbiAgY29uc3QgZHVwZSA9IHMgPT4gZXhpc3RpbmcuZmlsdGVyKGUgPT4gcy5pbm5lckhUTUwgPT09IGUuaW5uZXJIVE1MICYmIHMuc3JjID09PSBlLnNyYykubGVuZ3RoID4gMCA/IHRydWUgOiBmYWxzZSBcblxuICBzY3JpcHRzLmxlbmd0aCA+IDAgJiYgc2NyaXB0cy5mb3JFYWNoKHQgPT4ge1xuICAgIGxldCBzID0gdC5jbG9uZU5vZGUodHJ1ZSlcblxuICAgIGlmIChkdXBlKHMpKSByZXR1cm5cblxuICAgIHMuc2V0QXR0cmlidXRlKCdkYXRhLWFqYXhlZCcsICd0cnVlJylcblxuICAgIHRyeSB7XG4gICAgICBldmFsKHMuaW5uZXJIVE1MKVxuICAgIH0gY2F0Y2goZSl7XG4gICAgICBlcnJvcnMucHVzaChlKVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByb290ID8gcm9vdC5pbnNlcnRCZWZvcmUocywgcm9vdC5jaGlsZHJlblswXSkgOiBzb3VyY2UucmVwbGFjZUNoaWxkKHMsIHQpXG4gICAgfSBjYXRjaChlKXtcbiAgICAgIGVycm9ycy5wdXNoKGUpXG4gICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShzLCBkb2N1bWVudC5oZWFkLmNoaWxkcmVuWzBdKVxuICAgIH1cbiAgfSkgXG5cbiAgaWYgKGVycm9ycy5sZW5ndGggPiAwKXtcbiAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKCdvcGVyYXRvci5qcycpXG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBjb25zb2xlLmxvZyhlKSlcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgfVxufVxuXG4vKipcbiAqIEdldCB3aWR0aC9oZWlnaHQgb2YgZWxlbWVudCBvciB3aW5kb3dcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gZWwgRWxlbWVudCBvciB3aW5kb3dcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlICdIZWlnaHQnIG9yICdXaWR0aFxuICovXG5jb25zdCByZXR1cm5TaXplID0gKGVsLCB0eXBlKSA9PiB7XG4gIGNvbnN0IGlzV2luZG93ID0gZWwgIT09IG51bGwgJiYgZWwud2luZG93ID8gdHJ1ZSA6IGZhbHNlXG5cbiAgaWYgKGlzV2luZG93KXtcbiAgICByZXR1cm4gTWF0aC5tYXgoZWxbYG91dGVyJHt0eXBlfWBdLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbYGNsaWVudCR7dHlwZX1gXSlcbiAgfVxuXG4gIHJldHVybiBNYXRoLm1heChlbFtgb2Zmc2V0JHt0eXBlfWBdLCBlbFtgY2xpZW50JHt0eXBlfWBdKVxufVxuXG4vKipcbiAqIEhlbHBlciB0byBzbW9vdGhseSBzd2FwIG9sZCBcbiAqIG1hcmt1cCB3aXRoIG5ldyBtYXJrdXBcbiAqIFxuICogQHBhcmFtIHtvYmplY3R9IG1hcmt1cCBOZXcgbm9kZSB0byBhcHBlbmQgdG8gRE9NXG4gKi9cbmV4cG9ydCBkZWZhdWx0IChyb290LCBkdXJhdGlvbiwgZXZlbnRzKSA9PiAobWFya3VwLCBjYikgPT4ge1xuICBjb25zdCBkb20gPSBwYXJzZVJlc3BvbnNlKG1hcmt1cClcbiAgY29uc3QgdGl0bGUgPSBkb20uaGVhZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGl0bGUnKVswXS5pbm5lckhUTUxcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iocm9vdClcblxuICBjb25zdCBzdGFydCA9IHRhcnJ5KFxuICAgICgpID0+IHtcbiAgICAgIGV2ZW50cy5lbWl0KCdiZWZvcmU6dHJhbnNpdGlvbicpXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtdHJhbnNpdGlvbmluZycpIFxuICAgICAgbWFpbi5zdHlsZS5oZWlnaHQgPSByZXR1cm5TaXplKG1haW4sICdIZWlnaHQnKSsncHgnXG4gICAgfVxuICAsIGR1cmF0aW9uKVxuXG4gIGNvbnN0IHJlbmRlciA9IHRhcnJ5KFxuICAgICgpID0+IHtcbiAgICAgIG1haW4uaW5uZXJIVE1MID0gZG9tLnF1ZXJ5U2VsZWN0b3Iocm9vdCkuaW5uZXJIVE1MXG4gICAgICBjYih0aXRsZSwgbWFpbilcbiAgICAgIGV2YWxTY3JpcHRzKG1haW4pXG4gICAgICBldmFsU2NyaXB0cyhkb20uaGVhZCwgZG9jdW1lbnQuaGVhZClcbiAgICAgIHJlc3RvcmVTY3JvbGxQb3MoKVxuICAgIH1cbiAgLCBkdXJhdGlvbilcblxuICBjb25zdCByZW1vdmVUcmFuc2l0aW9uU3R5bGVzID0gdGFycnkoXG4gICAgKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXRyYW5zaXRpb25pbmcnKSBcbiAgICAgIG1haW4uc3R5bGUuaGVpZ2h0ID0gJydcbiAgICB9XG4gICwgZHVyYXRpb24pXG5cbiAgY29uc3Qgc2lnbmFsRW5kID0gdGFycnkoXG4gICAgKCkgPT4gZXZlbnRzLmVtaXQoJ2FmdGVyOnRyYW5zaXRpb24nKVxuICAsIGR1cmF0aW9uKVxuXG4gIHF1ZXVlKHN0YXJ0LCByZW5kZXIsIHJlbW92ZVRyYW5zaXRpb25TdHlsZXMsIHNpZ25hbEVuZCkoKVxufVxuIiwiY29uc3QgZ2V0T3JpZ2luID0gdXJsID0+IHVybC5vcmlnaW4gfHwgdXJsLnByb3RvY29sKycvLycrdXJsLmhvc3RcblxuZXhwb3J0IGNvbnN0IG9yaWdpbiA9IGdldE9yaWdpbih3aW5kb3cubG9jYXRpb24pIFxuXG5leHBvcnQgY29uc3Qgb3JpZ2luUmVnRXggPSBuZXcgUmVnRXhwKG9yaWdpbilcblxuLyoqXG4gKiBSZXBsYWNlIHNpdGUgb3JpZ2luLCBpZiBwcmVzZW50LFxuICogcmVtb3ZlIGxlYWRpbmcgc2xhc2gsIGlmIHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBSYXcgVVJMIHRvIHBhcnNlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFVSTCBzYW5zIG9yaWdpbiBhbmQgc2FucyBsZWFkaW5nIGNvbW1hXG4gKi9cbmV4cG9ydCBjb25zdCBzYW5pdGl6ZSA9IHVybCA9PiB7XG4gIGxldCByb3V0ZSA9IHVybC5yZXBsYWNlKG9yaWdpblJlZ0V4LCAnJylcbiAgbGV0IGNsZWFuID0gcm91dGUubWF0Y2goL15cXC8vKSA/IHJvdXRlLnJlcGxhY2UoL1xcL3sxfS8sJycpIDogcm91dGUgLy8gcmVtb3ZlIC9cbiAgcmV0dXJuIGNsZWFuID09PSAnJyA/ICcvJyA6IGNsZWFuXG59XG5cbmV4cG9ydCBjb25zdCBwYXJzZVVSTCA9IHVybCA9PiB7XG4gIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gIGEuaHJlZiA9IHVybFxuICByZXR1cm4gYVxufVxuXG5leHBvcnQgY29uc3QgbGluayA9IHtcbiAgaXNTYW1lT3JpZ2luOiBocmVmID0+IG9yaWdpbiA9PT0gZ2V0T3JpZ2luKHBhcnNlVVJMKGhyZWYpKSxcbiAgaXNIYXNoOiBocmVmID0+IC8jLy50ZXN0KGhyZWYpLFxuICBpc1NhbWVVUkw6IGhyZWYgPT4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBwYXJzZVVSTChocmVmKS5wYXRobmFtZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0U2Nyb2xsUG9zaXRpb24gPSAoKSA9PiB3aW5kb3cucGFnZVlPZmZzZXQgfHwgd2luZG93LnNjcm9sbFlcblxuZXhwb3J0IGNvbnN0IHNhdmVTY3JvbGxQb3NpdGlvbiA9ICgpID0+IHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IHNjcm9sbFRvcDogZ2V0U2Nyb2xsUG9zaXRpb24oKSB9LCAnJylcblxuZXhwb3J0IGNvbnN0IHJlc3RvcmVTY3JvbGxQb3MgPSAoKSA9PiB7XG4gIGxldCBzY3JvbGxUb3AgPSBoaXN0b3J5LnN0YXRlID8gaGlzdG9yeS5zdGF0ZS5zY3JvbGxUb3AgOiB1bmRlZmluZWQgXG4gIGlmIChoaXN0b3J5LnN0YXRlICYmIHNjcm9sbFRvcCAhPT0gdW5kZWZpbmVkICkge1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGxUb3ApXG4gICAgcmV0dXJuIHNjcm9sbFRvcFxuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKVxuICB9XG59XG5cbmNvbnN0IGFjdGl2ZUxpbmtzID0gW11cbmV4cG9ydCBjb25zdCBzZXRBY3RpdmVMaW5rcyA9IHJvdXRlID0+IHtcbiAgYWN0aXZlTGlua3MuZm9yRWFjaChhID0+IGEuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJykpXG4gIGFjdGl2ZUxpbmtzLnNwbGljZSgwLCBhY3RpdmVMaW5rcy5sZW5ndGgpXG4gIGFjdGl2ZUxpbmtzLnB1c2goLi4uQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2hyZWYkPVwiJHtyb3V0ZX1cIl1gKSkpXG4gIGFjdGl2ZUxpbmtzLmZvckVhY2goYSA9PiBhLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpKVxufVxuIiwidmFyIG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdG9yLCBjaGVja1lvU2VsZikge1xyXG4gIHZhciBwYXJlbnQgPSBjaGVja1lvU2VsZiA/IGVsZW1lbnQgOiBlbGVtZW50LnBhcmVudE5vZGVcclxuXHJcbiAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAobWF0Y2hlcyhwYXJlbnQsIHNlbGVjdG9yKSkgcmV0dXJuIHBhcmVudDtcclxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlXHJcbiAgfVxyXG59XHJcbiIsInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnY2xvc2VzdCcpO1xuXG4vKipcbiAqIERlbGVnYXRlcyBldmVudCB0byBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBkZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBjbG9zZXN0IG1hdGNoIGFuZCBpbnZva2VzIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBsaXN0ZW5lcihlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IsIHRydWUpO1xuXG4gICAgICAgIGlmIChlLmRlbGVnYXRlVGFyZ2V0KSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsZW1lbnQsIGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlO1xuIiwiZXhwb3J0IGRlZmF1bHQgKG8gPSB7fSkgPT4ge1xuICBjb25zdCBsaXN0ZW5lcnMgPSB7fVxuXG4gIGNvbnN0IG9uID0gKGUsIGNiID0gbnVsbCkgPT4ge1xuICAgIGlmICghY2IpIHJldHVyblxuICAgIGxpc3RlbmVyc1tlXSA9IGxpc3RlbmVyc1tlXSB8fCB7IHF1ZXVlOiBbXSB9XG4gICAgbGlzdGVuZXJzW2VdLnF1ZXVlLnB1c2goY2IpXG4gIH1cblxuICBjb25zdCBlbWl0ID0gKGUsIGRhdGEgPSBudWxsKSA9PiB7XG4gICAgbGV0IGl0ZW1zID0gbGlzdGVuZXJzW2VdID8gbGlzdGVuZXJzW2VdLnF1ZXVlIDogZmFsc2VcbiAgICBpdGVtcyAmJiBpdGVtcy5mb3JFYWNoKGkgPT4gaShkYXRhKSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ubyxcbiAgICBlbWl0LFxuICAgIG9uXG4gIH1cbn1cbiIsIlxyXG4vKipcclxuICogRWxlbWVudCBwcm90b3R5cGUuXHJcbiAqL1xyXG5cclxudmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XHJcblxyXG4vKipcclxuICogVmVuZG9yIGZ1bmN0aW9uLlxyXG4gKi9cclxuXHJcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4vKipcclxuICogRXhwb3NlIGBtYXRjaCgpYC5cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoO1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cclxuICpcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcclxuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcclxuICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcclxuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufSIsIi8vIEJlc3QgcGxhY2UgdG8gZmluZCBpbmZvcm1hdGlvbiBvbiBYSFIgZmVhdHVyZXMgaXM6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3RcblxudmFyIHJlcWZpZWxkcyA9IFtcbiAgJ3Jlc3BvbnNlVHlwZScsICd3aXRoQ3JlZGVudGlhbHMnLCAndGltZW91dCcsICdvbnByb2dyZXNzJ1xuXVxuXG4vLyBTaW1wbGUgYW5kIHNtYWxsIGFqYXggZnVuY3Rpb25cbi8vIFRha2VzIGEgcGFyYW1ldGVycyBvYmplY3QgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb25cbi8vIFBhcmFtZXRlcnM6XG4vLyAgLSB1cmw6IHN0cmluZywgcmVxdWlyZWRcbi8vICAtIGhlYWRlcnM6IG9iamVjdCBvZiBge2hlYWRlcl9uYW1lOiBoZWFkZXJfdmFsdWUsIC4uLn1gXG4vLyAgLSBib2R5OlxuLy8gICAgICArIHN0cmluZyAoc2V0cyBjb250ZW50IHR5cGUgdG8gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgaWYgbm90IHNldCBpbiBoZWFkZXJzKVxuLy8gICAgICArIEZvcm1EYXRhIChkb2Vzbid0IHNldCBjb250ZW50IHR5cGUgc28gdGhhdCBicm93c2VyIHdpbGwgc2V0IGFzIGFwcHJvcHJpYXRlKVxuLy8gIC0gbWV0aG9kOiAnR0VUJywgJ1BPU1QnLCBldGMuIERlZmF1bHRzIHRvICdHRVQnIG9yICdQT1NUJyBiYXNlZCBvbiBib2R5XG4vLyAgLSBjb3JzOiBJZiB5b3VyIHVzaW5nIGNyb3NzLW9yaWdpbiwgeW91IHdpbGwgbmVlZCB0aGlzIHRydWUgZm9yIElFOC05XG4vL1xuLy8gVGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgb250byB0aGUgeGhyIG9iamVjdC5cbi8vIElNUE9SVEFOVCBOT1RFOiBUaGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb21wYXRpYmlsaXR5IGNoZWNraW5nLlxuLy8gIC0gcmVzcG9uc2VUeXBlOiBzdHJpbmcsIHZhcmlvdXMgY29tcGF0YWJpbGl0eSwgc2VlIHhociBkb2NzIGZvciBlbnVtIG9wdGlvbnNcbi8vICAtIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbiwgSUUxMCssIENPUlMgb25seVxuLy8gIC0gdGltZW91dDogbG9uZywgbXMgdGltZW91dCwgSUU4K1xuLy8gIC0gb25wcm9ncmVzczogY2FsbGJhY2ssIElFMTArXG4vL1xuLy8gQ2FsbGJhY2sgZnVuY3Rpb24gcHJvdG90eXBlOlxuLy8gIC0gc3RhdHVzQ29kZSBmcm9tIHJlcXVlc3Rcbi8vICAtIHJlc3BvbnNlXG4vLyAgICArIGlmIHJlc3BvbnNlVHlwZSBzZXQgYW5kIHN1cHBvcnRlZCBieSBicm93c2VyLCB0aGlzIGlzIGFuIG9iamVjdCBvZiBzb21lIHR5cGUgKHNlZSBkb2NzKVxuLy8gICAgKyBvdGhlcndpc2UgaWYgcmVxdWVzdCBjb21wbGV0ZWQsIHRoaXMgaXMgdGhlIHN0cmluZyB0ZXh0IG9mIHRoZSByZXNwb25zZVxuLy8gICAgKyBpZiByZXF1ZXN0IGlzIGFib3J0ZWQsIHRoaXMgaXMgXCJBYm9ydFwiXG4vLyAgICArIGlmIHJlcXVlc3QgdGltZXMgb3V0LCB0aGlzIGlzIFwiVGltZW91dFwiXG4vLyAgICArIGlmIHJlcXVlc3QgZXJyb3JzIGJlZm9yZSBjb21wbGV0aW5nIChwcm9iYWJseSBhIENPUlMgaXNzdWUpLCB0aGlzIGlzIFwiRXJyb3JcIlxuLy8gIC0gcmVxdWVzdCBvYmplY3Rcbi8vXG4vLyBSZXR1cm5zIHRoZSByZXF1ZXN0IG9iamVjdC4gU28geW91IGNhbiBjYWxsIC5hYm9ydCgpIG9yIG90aGVyIG1ldGhvZHNcbi8vXG4vLyBERVBSRUNBVElPTlM6XG4vLyAgLSBQYXNzaW5nIGEgc3RyaW5nIGluc3RlYWQgb2YgdGhlIHBhcmFtcyBvYmplY3QgaGFzIGJlZW4gcmVtb3ZlZCFcbi8vXG5leHBvcnRzLmFqYXggPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAvLyBBbnkgdmFyaWFibGUgdXNlZCBtb3JlIHRoYW4gb25jZSBpcyB2YXInZCBoZXJlIGJlY2F1c2VcbiAgLy8gbWluaWZpY2F0aW9uIHdpbGwgbXVuZ2UgdGhlIHZhcmlhYmxlcyB3aGVyZWFzIGl0IGNhbid0IG11bmdlXG4gIC8vIHRoZSBvYmplY3QgYWNjZXNzLlxuICB2YXIgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzIHx8IHt9XG4gICAgLCBib2R5ID0gcGFyYW1zLmJvZHlcbiAgICAsIG1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgKGJvZHkgPyAnUE9TVCcgOiAnR0VUJylcbiAgICAsIGNhbGxlZCA9IGZhbHNlXG5cbiAgdmFyIHJlcSA9IGdldFJlcXVlc3QocGFyYW1zLmNvcnMpXG5cbiAgZnVuY3Rpb24gY2Ioc3RhdHVzQ29kZSwgcmVzcG9uc2VUZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IHN0YXR1c0NvZGUgOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgICAgICByZXEuc3RhdHVzID09PSAwID8gXCJFcnJvclwiIDogKHJlcS5yZXNwb25zZSB8fCByZXEucmVzcG9uc2VUZXh0IHx8IHJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgIHJlcSlcbiAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSlcblxuICB2YXIgc3VjY2VzcyA9IHJlcS5vbmxvYWQgPSBjYigyMDApXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSBzdWNjZXNzKClcbiAgfVxuICByZXEub25lcnJvciA9IGNiKG51bGwsICdFcnJvcicpXG4gIHJlcS5vbnRpbWVvdXQgPSBjYihudWxsLCAnVGltZW91dCcpXG4gIHJlcS5vbmFib3J0ID0gY2IobnVsbCwgJ0Fib3J0JylcblxuICBpZiAoYm9keSkge1xuICAgIHNldERlZmF1bHQoaGVhZGVycywgJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKVxuXG4gICAgaWYgKCFnbG9iYWwuRm9ybURhdGEgfHwgIShib2R5IGluc3RhbmNlb2YgZ2xvYmFsLkZvcm1EYXRhKSkge1xuICAgICAgc2V0RGVmYXVsdChoZWFkZXJzLCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcWZpZWxkcy5sZW5ndGgsIGZpZWxkOyBpIDwgbGVuOyBpKyspIHtcbiAgICBmaWVsZCA9IHJlcWZpZWxkc1tpXVxuICAgIGlmIChwYXJhbXNbZmllbGRdICE9PSB1bmRlZmluZWQpXG4gICAgICByZXFbZmllbGRdID0gcGFyYW1zW2ZpZWxkXVxuICB9XG5cbiAgZm9yICh2YXIgZmllbGQgaW4gaGVhZGVycylcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgaGVhZGVyc1tmaWVsZF0pXG5cbiAgcmVxLnNlbmQoYm9keSlcblxuICByZXR1cm4gcmVxXG59XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoY29ycykge1xuICAvLyBYRG9tYWluUmVxdWVzdCBpcyBvbmx5IHdheSB0byBkbyBDT1JTIGluIElFIDggYW5kIDlcbiAgLy8gQnV0IFhEb21haW5SZXF1ZXN0IGlzbid0IHN0YW5kYXJkcy1jb21wYXRpYmxlXG4gIC8vIE5vdGFibHksIGl0IGRvZXNuJ3QgYWxsb3cgY29va2llcyB0byBiZSBzZW50IG9yIHNldCBieSBzZXJ2ZXJzXG4gIC8vIElFIDEwKyBpcyBzdGFuZGFyZHMtY29tcGF0aWJsZSBpbiBpdHMgWE1MSHR0cFJlcXVlc3RcbiAgLy8gYnV0IElFIDEwIGNhbiBzdGlsbCBoYXZlIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdCwgc28gd2UgZG9uJ3Qgd2FudCB0byB1c2UgaXRcbiAgaWYgKGNvcnMgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0ICYmICEvTVNJRSAxLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKVxuICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3RcbiAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdClcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHQob2JqLCBrZXksIHZhbHVlKSB7XG4gIG9ialtrZXldID0gb2JqW2tleV0gfHwgdmFsdWVcbn1cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiTmF2aWdvXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk5hdmlnb1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJOYXZpZ29cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblx0XG5cdHZhciBQQVJBTUVURVJfUkVHRVhQID0gLyhbOipdKShcXHcrKS9nO1xuXHR2YXIgV0lMRENBUkRfUkVHRVhQID0gL1xcKi9nO1xuXHR2YXIgUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFAgPSAnKFteXFwvXSspJztcblx0dmFyIFJFUExBQ0VfV0lMRENBUkQgPSAnKD86LiopJztcblx0dmFyIEZPTExPV0VEX0JZX1NMQVNIX1JFR0VYUCA9ICcoPzpcXC98JCknO1xuXHRcblx0ZnVuY3Rpb24gY2xlYW4ocykge1xuXHQgIGlmIChzIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gcztcblx0ICByZXR1cm4gcy5yZXBsYWNlKC9cXC8rJC8sICcnKS5yZXBsYWNlKC9eXFwvKy8sICcvJyk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlZ0V4cFJlc3VsdFRvUGFyYW1zKG1hdGNoLCBuYW1lcykge1xuXHQgIGlmIChuYW1lcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHQgIGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuXHQgIHJldHVybiBtYXRjaC5zbGljZSgxLCBtYXRjaC5sZW5ndGgpLnJlZHVjZShmdW5jdGlvbiAocGFyYW1zLCB2YWx1ZSwgaW5kZXgpIHtcblx0ICAgIGlmIChwYXJhbXMgPT09IG51bGwpIHBhcmFtcyA9IHt9O1xuXHQgICAgcGFyYW1zW25hbWVzW2luZGV4XV0gPSB2YWx1ZTtcblx0ICAgIHJldHVybiBwYXJhbXM7XG5cdCAgfSwgbnVsbCk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUpIHtcblx0ICB2YXIgcGFyYW1OYW1lcyA9IFtdLFxuXHQgICAgICByZWdleHA7XG5cdFxuXHQgIGlmIChyb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHQgICAgcmVnZXhwID0gcm91dGU7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoY2xlYW4ocm91dGUpLnJlcGxhY2UoUEFSQU1FVEVSX1JFR0VYUCwgZnVuY3Rpb24gKGZ1bGwsIGRvdHMsIG5hbWUpIHtcblx0ICAgICAgcGFyYW1OYW1lcy5wdXNoKG5hbWUpO1xuXHQgICAgICByZXR1cm4gUkVQTEFDRV9WQVJJQUJMRV9SRUdFWFA7XG5cdCAgICB9KS5yZXBsYWNlKFdJTERDQVJEX1JFR0VYUCwgUkVQTEFDRV9XSUxEQ0FSRCkgKyBGT0xMT1dFRF9CWV9TTEFTSF9SRUdFWFApO1xuXHQgIH1cblx0ICByZXR1cm4geyByZWdleHA6IHJlZ2V4cCwgcGFyYW1OYW1lczogcGFyYW1OYW1lcyB9O1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBmaW5kTWF0Y2hlZFJvdXRlcyh1cmwpIHtcblx0ICB2YXIgcm91dGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMV07XG5cdFxuXHQgIHJldHVybiByb3V0ZXMubWFwKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIF9yZXBsYWNlRHluYW1pY1VSTFBhciA9IHJlcGxhY2VEeW5hbWljVVJMUGFydHMocm91dGUucm91dGUpO1xuXHRcblx0ICAgIHZhciByZWdleHAgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucmVnZXhwO1xuXHQgICAgdmFyIHBhcmFtTmFtZXMgPSBfcmVwbGFjZUR5bmFtaWNVUkxQYXIucGFyYW1OYW1lcztcblx0XG5cdCAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXhwKTtcblx0ICAgIHZhciBwYXJhbXMgPSByZWdFeHBSZXN1bHRUb1BhcmFtcyhtYXRjaCwgcGFyYW1OYW1lcyk7XG5cdFxuXHQgICAgcmV0dXJuIG1hdGNoID8geyBtYXRjaDogbWF0Y2gsIHJvdXRlOiByb3V0ZSwgcGFyYW1zOiBwYXJhbXMgfSA6IGZhbHNlO1xuXHQgIH0pLmZpbHRlcihmdW5jdGlvbiAobSkge1xuXHQgICAgcmV0dXJuIG07XG5cdCAgfSk7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIG1hdGNoKHVybCwgcm91dGVzKSB7XG5cdCAgcmV0dXJuIGZpbmRNYXRjaGVkUm91dGVzKHVybCwgcm91dGVzKVswXSB8fCBmYWxzZTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gcm9vdCh1cmwsIHJvdXRlcykge1xuXHQgIHZhciBtYXRjaGVkID0gZmluZE1hdGNoZWRSb3V0ZXModXJsLCByb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuXHQgICAgdmFyIHUgPSBjbGVhbihyb3V0ZS5yb3V0ZSk7XG5cdFxuXHQgICAgcmV0dXJuIHUgIT09ICcnICYmIHUgIT09ICcqJztcblx0ICB9KSk7XG5cdCAgdmFyIGZhbGxiYWNrVVJMID0gY2xlYW4odXJsKTtcblx0XG5cdCAgaWYgKG1hdGNoZWQubGVuZ3RoID4gMCkge1xuXHQgICAgcmV0dXJuIG1hdGNoZWQubWFwKGZ1bmN0aW9uIChtKSB7XG5cdCAgICAgIHJldHVybiBjbGVhbih1cmwuc3Vic3RyKDAsIG0ubWF0Y2guaW5kZXgpKTtcblx0ICAgIH0pLnJlZHVjZShmdW5jdGlvbiAocm9vdCwgY3VycmVudCkge1xuXHQgICAgICByZXR1cm4gY3VycmVudC5sZW5ndGggPCByb290Lmxlbmd0aCA/IGN1cnJlbnQgOiByb290O1xuXHQgICAgfSwgZmFsbGJhY2tVUkwpO1xuXHQgIH1cblx0ICByZXR1cm4gZmFsbGJhY2tVUkw7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCkge1xuXHQgIHJldHVybiAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBOYXZpZ28ociwgdXNlSGFzaCkge1xuXHQgIHRoaXMuX3JvdXRlcyA9IFtdO1xuXHQgIHRoaXMucm9vdCA9IHVzZUhhc2ggJiYgciA/IHIucmVwbGFjZSgvXFwvJC8sICcvIycpIDogciB8fCBudWxsO1xuXHQgIHRoaXMuX3VzZUhhc2ggPSB1c2VIYXNoO1xuXHQgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXHQgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gbnVsbDtcblx0ICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIgPSBudWxsO1xuXHQgIHRoaXMuX2RlZmF1bHRIYW5kbGVyID0gbnVsbDtcblx0ICB0aGlzLl9vayA9ICF1c2VIYXNoICYmIGlzUHVzaFN0YXRlQXZhaWxhYmxlKCk7XG5cdCAgdGhpcy5fbGlzdGVuKCk7XG5cdCAgdGhpcy51cGRhdGVQYWdlTGlua3MoKTtcblx0fVxuXHRcblx0TmF2aWdvLnByb3RvdHlwZSA9IHtcblx0ICBoZWxwZXJzOiB7XG5cdCAgICBtYXRjaDogbWF0Y2gsXG5cdCAgICByb290OiByb290LFxuXHQgICAgY2xlYW46IGNsZWFuXG5cdCAgfSxcblx0ICBuYXZpZ2F0ZTogZnVuY3Rpb24gbmF2aWdhdGUocGF0aCwgYWJzb2x1dGUpIHtcblx0ICAgIHZhciB0bztcblx0XG5cdCAgICBwYXRoID0gcGF0aCB8fCAnJztcblx0ICAgIGlmICh0aGlzLl9vaykge1xuXHQgICAgICB0byA9ICghYWJzb2x1dGUgPyB0aGlzLl9nZXRSb290KCkgKyAnLycgOiAnJykgKyBjbGVhbihwYXRoKTtcblx0ICAgICAgdG8gPSB0by5yZXBsYWNlKC8oW146XSkoXFwvezIsfSkvZywgJyQxLycpO1xuXHQgICAgICBoaXN0b3J5W3RoaXMuX3BhdXNlZCA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHt9LCAnJywgdG8pO1xuXHQgICAgICB0aGlzLnJlc29sdmUoKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC8jKC4qKSQvLCAnJykgKyAnIycgKyBwYXRoO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdCAgfSxcblx0ICBvbjogZnVuY3Rpb24gb24oKSB7XG5cdCAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG5cdCAgICAgIHRoaXMuX2FkZChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0sIGFyZ3VtZW50cy5sZW5ndGggPD0gMSA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1sxXSk7XG5cdCAgICB9IGVsc2UgaWYgKF90eXBlb2YoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgZm9yICh2YXIgcm91dGUgaW4gYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSB7XG5cdCAgICAgICAgdGhpcy5fYWRkKHJvdXRlLCAoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKVtyb3V0ZV0pO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2UgaWYgKHR5cGVvZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHQgIH0sXG5cdCAgbm90Rm91bmQ6IGZ1bmN0aW9uIG5vdEZvdW5kKGhhbmRsZXIpIHtcblx0ICAgIHRoaXMuX25vdEZvdW5kSGFuZGxlciA9IGhhbmRsZXI7XG5cdCAgfSxcblx0ICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKGN1cnJlbnQpIHtcblx0ICAgIHZhciBoYW5kbGVyLCBtO1xuXHQgICAgdmFyIHVybCA9IChjdXJyZW50IHx8IHRoaXMuX2NMb2MoKSkucmVwbGFjZSh0aGlzLl9nZXRSb290KCksICcnKTtcblx0XG5cdCAgICBpZiAodGhpcy5fcGF1c2VkIHx8IHVybCA9PT0gdGhpcy5fbGFzdFJvdXRlUmVzb2x2ZWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLl91c2VIYXNoKSB7XG5cdCAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvIy8sICcvJyk7XG5cdCAgICB9XG5cdCAgICBtID0gbWF0Y2godXJsLCB0aGlzLl9yb3V0ZXMpO1xuXHRcblx0ICAgIGlmIChtKSB7XG5cdCAgICAgIHRoaXMuX2xhc3RSb3V0ZVJlc29sdmVkID0gdXJsO1xuXHQgICAgICBoYW5kbGVyID0gbS5yb3V0ZS5oYW5kbGVyO1xuXHQgICAgICBtLnJvdXRlLnJvdXRlIGluc3RhbmNlb2YgUmVnRXhwID8gaGFuZGxlci5hcHBseSh1bmRlZmluZWQsIF90b0NvbnN1bWFibGVBcnJheShtLm1hdGNoLnNsaWNlKDEsIG0ubWF0Y2gubGVuZ3RoKSkpIDogaGFuZGxlcihtLnBhcmFtcyk7XG5cdCAgICAgIHJldHVybiBtO1xuXHQgICAgfSBlbHNlIGlmICh0aGlzLl9kZWZhdWx0SGFuZGxlciAmJiAodXJsID09PSAnJyB8fCB1cmwgPT09ICcvJykpIHtcblx0ICAgICAgdGhpcy5fZGVmYXVsdEhhbmRsZXIoKTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGVsc2UgaWYgKHRoaXMuX25vdEZvdW5kSGFuZGxlcikge1xuXHQgICAgICB0aGlzLl9ub3RGb3VuZEhhbmRsZXIoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9LFxuXHQgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcblx0ICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cdCAgICBjbGVhclRpbWVvdXQodGhpcy5fbGlzdGVubmluZ0ludGVydmFsKTtcblx0ICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm9ucG9wc3RhdGUgPSBudWxsIDogbnVsbDtcblx0ICB9LFxuXHQgIHVwZGF0ZVBhZ2VMaW5rczogZnVuY3Rpb24gdXBkYXRlUGFnZUxpbmtzKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0ICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cdFxuXHQgICAgdGhpcy5fZmluZExpbmtzKCkuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xuXHQgICAgICBpZiAoIWxpbmsuaGFzTGlzdGVuZXJBdHRhY2hlZCkge1xuXHQgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblx0XG5cdCAgICAgICAgICBpZiAoIXNlbGYuX2Rlc3Ryb3llZCkge1xuXHQgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIHNlbGYubmF2aWdhdGUoY2xlYW4obG9jYXRpb24pKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgICBsaW5rLmhhc0xpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIGdlbmVyYXRlOiBmdW5jdGlvbiBnZW5lcmF0ZShuYW1lKSB7XG5cdCAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXHRcblx0ICAgIHJldHVybiB0aGlzLl9yb3V0ZXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHJvdXRlKSB7XG5cdCAgICAgIHZhciBrZXk7XG5cdFxuXHQgICAgICBpZiAocm91dGUubmFtZSA9PT0gbmFtZSkge1xuXHQgICAgICAgIHJlc3VsdCA9IHJvdXRlLnJvdXRlO1xuXHQgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcblx0ICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc6JyArIGtleSwgZGF0YVtrZXldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sICcnKTtcblx0ICB9LFxuXHQgIGxpbms6IGZ1bmN0aW9uIGxpbmsocGF0aCkge1xuXHQgICAgcmV0dXJuIHRoaXMuX2dldFJvb3QoKSArIHBhdGg7XG5cdCAgfSxcblx0ICBwYXVzZTogZnVuY3Rpb24gcGF1c2Uoc3RhdHVzKSB7XG5cdCAgICB0aGlzLl9wYXVzZWQgPSBzdGF0dXM7XG5cdCAgfSxcblx0ICBkaXNhYmxlSWZBUElOb3RBdmFpbGFibGU6IGZ1bmN0aW9uIGRpc2FibGVJZkFQSU5vdEF2YWlsYWJsZSgpIHtcblx0ICAgIGlmICghaXNQdXNoU3RhdGVBdmFpbGFibGUoKSkge1xuXHQgICAgICB0aGlzLmRlc3Ryb3koKTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIF9hZGQ6IGZ1bmN0aW9uIF9hZGQocm91dGUpIHtcblx0ICAgIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblx0XG5cdCAgICBpZiAoKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihoYW5kbGVyKSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgIHRoaXMuX3JvdXRlcy5wdXNoKHsgcm91dGU6IHJvdXRlLCBoYW5kbGVyOiBoYW5kbGVyLnVzZXMsIG5hbWU6IGhhbmRsZXIuYXMgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB0aGlzLl9yb3V0ZXMucHVzaCh7IHJvdXRlOiByb3V0ZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzLl9hZGQ7XG5cdCAgfSxcblx0ICBfZ2V0Um9vdDogZnVuY3Rpb24gX2dldFJvb3QoKSB7XG5cdCAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSByZXR1cm4gdGhpcy5yb290O1xuXHQgICAgdGhpcy5yb290ID0gcm9vdCh0aGlzLl9jTG9jKCksIHRoaXMuX3JvdXRlcyk7XG5cdCAgICByZXR1cm4gdGhpcy5yb290O1xuXHQgIH0sXG5cdCAgX2xpc3RlbjogZnVuY3Rpb24gX2xpc3RlbigpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgaWYgKHRoaXMuX29rKSB7XG5cdCAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIF90aGlzLnJlc29sdmUoKTtcblx0ICAgICAgfTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIGNhY2hlZCA9IF90aGlzLl9jTG9jKCksXG5cdCAgICAgICAgICAgIGN1cnJlbnQgPSB1bmRlZmluZWQsXG5cdCAgICAgICAgICAgIF9jaGVjayA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgICAgX2NoZWNrID0gZnVuY3Rpb24gY2hlY2soKSB7XG5cdCAgICAgICAgICBjdXJyZW50ID0gX3RoaXMuX2NMb2MoKTtcblx0ICAgICAgICAgIGlmIChjYWNoZWQgIT09IGN1cnJlbnQpIHtcblx0ICAgICAgICAgICAgY2FjaGVkID0gY3VycmVudDtcblx0ICAgICAgICAgICAgX3RoaXMucmVzb2x2ZSgpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgX3RoaXMuX2xpc3Rlbm5pbmdJbnRlcnZhbCA9IHNldFRpbWVvdXQoX2NoZWNrLCAyMDApO1xuXHQgICAgICAgIH07XG5cdCAgICAgICAgX2NoZWNrKCk7XG5cdCAgICAgIH0pKCk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBfY0xvYzogZnVuY3Rpb24gX2NMb2MoKSB7XG5cdCAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0sXG5cdCAgX2ZpbmRMaW5rczogZnVuY3Rpb24gX2ZpbmRMaW5rcygpIHtcblx0ICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW5hdmlnb10nKSk7XG5cdCAgfVxuXHR9O1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTmF2aWdvO1xuXHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmF2aWdvLmpzLm1hcCIsImNvbnN0IHJ1biA9IChjYiwgYXJncykgPT4ge1xuICBjYigpXG4gIGFyZ3MubGVuZ3RoID4gMCAmJiBhcmdzLnNoaWZ0KCkoLi4uYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHRhcnJ5ID0gKGNiLCBkZWxheSA9IG51bGwpID0+ICguLi5hcmdzKSA9PiB7XG4gIGxldCBvdmVycmlkZSA9ICdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSA/IGFyZ3NbMF0gOiBudWxsIFxuICByZXR1cm4gJ251bWJlcicgPT09IHR5cGVvZiBvdmVycmlkZSAmJiBvdmVycmlkZSA+IC0xIFxuICAgID8gdGFycnkoY2IsIG92ZXJyaWRlKSBcbiAgICA6ICdudW1iZXInID09PSB0eXBlb2YgZGVsYXkgJiYgZGVsYXkgPiAtMSBcbiAgICAgID8gc2V0VGltZW91dCgoKSA9PiBydW4oY2IsIGFyZ3MpLCBkZWxheSkgXG4gICAgICA6IHJ1bihjYiwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IHF1ZXVlID0gKC4uLmFyZ3MpID0+ICgpID0+IGFyZ3Muc2hpZnQoKSguLi5hcmdzKVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF90cmFuc2Zvcm1Qcm9wcyA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtLXByb3BzJyk7XG5cbnZhciBfdHJhbnNmb3JtUHJvcHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHJhbnNmb3JtUHJvcHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaCA9IGZ1bmN0aW9uIGgodGFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGlzUHJvcHMoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSA/IGFwcGx5UHJvcHModGFnKShhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIDogYXBwZW5kQ2hpbGRyZW4odGFnKS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG52YXIgaXNPYmogPSBmdW5jdGlvbiBpc09iaihvKSB7XG4gIHJldHVybiBvICE9PSBudWxsICYmICh0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobykpID09PSAnb2JqZWN0Jztcbn07XG5cbnZhciBpc1Byb3BzID0gZnVuY3Rpb24gaXNQcm9wcyhhcmcpIHtcbiAgcmV0dXJuIGlzT2JqKGFyZykgJiYgIShhcmcgaW5zdGFuY2VvZiBFbGVtZW50KTtcbn07XG5cbnZhciBhcHBseVByb3BzID0gZnVuY3Rpb24gYXBwbHlQcm9wcyh0YWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaXNQcm9wcyhhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHJldHVybiBoKHRhZykoT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIGFyZ3VtZW50cy5sZW5ndGggPD0gMCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1swXSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWwgPSBoKHRhZykuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgdmFyIHAgPSAoMCwgX3RyYW5zZm9ybVByb3BzMi5kZWZhdWx0KShwcm9wcyk7XG4gICAgICBPYmplY3Qua2V5cyhwKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmICgvXm9uLy50ZXN0KGspKSB7XG4gICAgICAgICAgZWxba10gPSBwW2tdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrLCBwW2tdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgfTtcbn07XG5cbnZhciBhcHBlbmRDaGlsZHJlbiA9IGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHRhZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjaGlsZHJlbiA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgY2hpbGRyZW5bX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGMgaW5zdGFuY2VvZiBFbGVtZW50ID8gYyA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGMpO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBlbC5hcHBlbmRDaGlsZChjKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWw7XG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBoOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBrZWJhYiA9IGV4cG9ydHMua2ViYWIgPSBmdW5jdGlvbiBrZWJhYihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uIChnKSB7XG4gICAgcmV0dXJuICctJyArIGcudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59O1xuXG52YXIgcGFyc2VWYWx1ZSA9IGV4cG9ydHMucGFyc2VWYWx1ZSA9IGZ1bmN0aW9uIHBhcnNlVmFsdWUocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IGFkZFB4KHByb3ApKHZhbCkgOiB2YWw7XG4gIH07XG59O1xuXG52YXIgdW5pdGxlc3NQcm9wZXJ0aWVzID0gZXhwb3J0cy51bml0bGVzc1Byb3BlcnRpZXMgPSBbJ2xpbmVIZWlnaHQnLCAnZm9udFdlaWdodCcsICdvcGFjaXR5JywgJ3pJbmRleCdcbi8vIFByb2JhYmx5IG5lZWQgYSBmZXcgbW9yZS4uLlxuXTtcblxudmFyIGFkZFB4ID0gZXhwb3J0cy5hZGRQeCA9IGZ1bmN0aW9uIGFkZFB4KHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdW5pdGxlc3NQcm9wZXJ0aWVzLmluY2x1ZGVzKHByb3ApID8gdmFsIDogdmFsICsgJ3B4JztcbiAgfTtcbn07XG5cbnZhciBmaWx0ZXJOdWxsID0gZXhwb3J0cy5maWx0ZXJOdWxsID0gZnVuY3Rpb24gZmlsdGVyTnVsbChvYmopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV0gIT09IG51bGw7XG4gIH07XG59O1xuXG52YXIgY3JlYXRlRGVjID0gZXhwb3J0cy5jcmVhdGVEZWMgPSBmdW5jdGlvbiBjcmVhdGVEZWMoc3R5bGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2ViYWIoa2V5KSArICc6JyArIHBhcnNlVmFsdWUoa2V5KShzdHlsZVtrZXldKTtcbiAgfTtcbn07XG5cbnZhciBzdHlsZVRvU3RyaW5nID0gZXhwb3J0cy5zdHlsZVRvU3RyaW5nID0gZnVuY3Rpb24gc3R5bGVUb1N0cmluZyhzdHlsZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3R5bGUpLmZpbHRlcihmaWx0ZXJOdWxsKHN0eWxlKSkubWFwKGNyZWF0ZURlYyhzdHlsZSkpLmpvaW4oJzsnKTtcbn07XG5cbnZhciBpc1N0eWxlT2JqZWN0ID0gZXhwb3J0cy5pc1N0eWxlT2JqZWN0ID0gZnVuY3Rpb24gaXNTdHlsZU9iamVjdChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkgPT09ICdzdHlsZScgJiYgcHJvcHNba2V5XSAhPT0gbnVsbCAmJiBfdHlwZW9mKHByb3BzW2tleV0pID09PSAnb2JqZWN0JztcbiAgfTtcbn07XG5cbnZhciBjcmVhdGVTdHlsZSA9IGV4cG9ydHMuY3JlYXRlU3R5bGUgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZShwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBpc1N0eWxlT2JqZWN0KHByb3BzKShrZXkpID8gc3R5bGVUb1N0cmluZyhwcm9wc1trZXldKSA6IHByb3BzW2tleV07XG4gIH07XG59O1xuXG52YXIgcmVkdWNlUHJvcHMgPSBleHBvcnRzLnJlZHVjZVByb3BzID0gZnVuY3Rpb24gcmVkdWNlUHJvcHMocHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhLCBrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhLCBfZGVmaW5lUHJvcGVydHkoe30sIGtleSwgY3JlYXRlU3R5bGUocHJvcHMpKGtleSkpKTtcbiAgfTtcbn07XG5cbnZhciB0cmFuc2Zvcm1Qcm9wcyA9IGV4cG9ydHMudHJhbnNmb3JtUHJvcHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZShyZWR1Y2VQcm9wcyhwcm9wcyksIHt9KTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zZm9ybVByb3BzOyJdfQ==
