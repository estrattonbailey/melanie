(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(exports,"__esModule",{value:!0});var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},cache={};exports.default={set:function(e,t){cache=_extends({},cache,_defineProperty({},e,t))},get:function(e){return cache[e]},getCache:function(){return cache}};
},{}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var isDupe=function(e,t){for(var r=[],n=0;n<t.length;n++)e.isEqualNode(t[n])&&r.push(n);return r.length>0};exports.default=function(e,t){for(var r=t.getElementsByTagName("script"),n=e.getElementsByTagName("script"),s=0;s<n.length;s++)if(!isDupe(n[s],r)){var a=document.createElement("script"),i=n[s].attributes.getNamedItem("src");i?a.src=i.value:a.innerHTML=n[s].innerHTML,document.body.appendChild(a)}};
},{}],3:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _delegate=require("delegate"),_delegate2=_interopRequireDefault(_delegate),_operator=require("./operator"),_operator2=_interopRequireDefault(_operator),_url=require("./url");exports.default=function(e){var t=e.root,r=void 0===t?document.body:t,o=e.duration,a=void 0===o?0:o,i=e.handlers,n=void 0===i?[]:i,l=new _operator2.default({root:r,duration:a,handlers:n});return l.setState({route:window.location.pathname+window.location.search,title:document.title}),(0,_delegate2.default)(document,"a","click",function(e){var t=e.delegateTarget,r=t.getAttribute("href")||"/",o=_url.link.isSameOrigin(r),a="external"===t.getAttribute("rel"),i=t.classList.contains("no-ajax"),n=l.validate(e,r),u=_url.link.isHash(r);if(!(!o||a||i||n||u||(e.preventDefault(),_url.link.isSameURL(r))))return l.go(r),!1}),window.onpopstate=function(e){var t=e.target.location.href;if(l.validate(e,t)){if(_url.link.isHash(t))return;return window.location.reload()}l.go(t,null,!0)},l};
},{"./operator":5,"./url":8,"delegate":10}],4:[function(require,module,exports){
"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}Object.defineProperty(exports,"__esModule",{value:!0});var activeLinks=[],toggle=function(e){for(var r=0;r<activeLinks.length;r++)activeLinks[r].classList[e?"add":"remove"]("is-active")};exports.default=function(e){toggle(!1),activeLinks.splice(0,activeLinks.length),activeLinks.push.apply(activeLinks,_toConsumableArray(Array.prototype.slice.call(document.querySelectorAll('[href$="'+e+'"]')))),toggle(!0)};
},{}],5:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),_nanoajax=require("nanoajax"),_nanoajax2=_interopRequireDefault(_nanoajax),_navigo=require("navigo"),_navigo2=_interopRequireDefault(_navigo),_scrollRestoration=require("scroll-restoration"),_scrollRestoration2=_interopRequireDefault(_scrollRestoration),_loop=require("loop.js"),_loop2=_interopRequireDefault(_loop),_url=require("./url"),_links=require("./links"),_links2=_interopRequireDefault(_links),_render=require("./render"),_render2=_interopRequireDefault(_render),_state=require("./state"),_state2=_interopRequireDefault(_state),_cache=require("./cache"),_cache2=_interopRequireDefault(_cache),router=new _navigo2.default(_url.origin),Operator=function(){function e(t){_classCallCheck(this,e);var r=(0,_loop2.default)();this.config=t,this.render=(0,_render2.default)(document.querySelector(t.root),t,r.emit),Object.assign(this,r)}return _createClass(e,[{key:"stop",value:function(){_state2.default.paused=!0}},{key:"start",value:function(){_state2.default.paused=!1}},{key:"getState",value:function(){return _state2.default._state}},{key:"setState",value:function(e){var t=e.route,r=e.title;_state2.default.route=""===t?"/":t,r&&(_state2.default.title=r),(0,_links2.default)(_state2.default.route),document.title=r}},{key:"go",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,a=arguments[2];if(!_state2.default.paused){var n=function(e){var n={title:e,route:u};a?router.resolve(u):router.navigate(u),_scrollRestoration2.default.restore(),t.setState(n),t.emit("route:after",n),r&&r(n)},u=(0,_url.sanitize)(e);a||_scrollRestoration2.default.save();var o=_cache2.default.get(u);if(this.emit("route:before",{route:u}),o)return this.render(u,o,n);this.get(u,n)}}},{key:"get",value:function(e,t){var r=this;return _nanoajax2.default.ajax({method:"GET",url:_url.origin+"/"+e},function(a,n,u){if(u.status<200||u.status>300&&304!==u.status)return void(window.location=_url.origin+"/"+_state2.default.prev.route);_cache2.default.set(e,u.response),r.render(e,u.response,t)})}},{key:"push",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:_state2.default.title;e&&(this.router.navigate(e),this.setState({route:e,title:t}))}},{key:"validate",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:_state2.default.route,a=(0,_url.sanitize)(r);return this.config.handlers.filter(function(r){if(Array.isArray(r)){var n=r[1](a);return n&&e.emit(r[0],{route:a,event:t}),n}return r(a)}).length>0}}]),e}();exports.default=Operator;
},{"./cache":1,"./links":4,"./render":6,"./state":7,"./url":8,"loop.js":11,"nanoajax":12,"navigo":13,"scroll-restoration":14}],6:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _tarry=require("tarry.js"),_eval=require("./eval.js"),_eval2=_interopRequireDefault(_eval),parser=new window.DOMParser,parseResponse=function(e){return parser.parseFromString(e,"text/html")};exports.default=function(e,t,r){var n=t.duration,i=t.root;return function(t,a,o){var u=parseResponse(a),s=u.title,l=(0,_tarry.tarry)(function(){r("transition:before",{route:t}),document.documentElement.classList.add("is-transitioning"),e.style.height=e.clientHeight+"px"}),c=(0,_tarry.tarry)(function(){e.innerHTML=u.querySelector(i).innerHTML,(0,_eval2.default)(u,document)}),d=(0,_tarry.tarry)(function(){o(s),e.style.height="",document.documentElement.classList.remove("is-transitioning"),r("transition:after",{route:t})});(0,_tarry.queue)(l(0),c(n),d(0))()}};
},{"./eval.js":2,"tarry.js":15}],7:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default={paused:!1,_state:{route:"",title:"",prev:{route:"/",title:""}},get route(){return this._state.route},set route(t){this._state.prev.route=this.route,this._state.route=t},get title(){return this._state.title},set title(t){this._state.prev.title=this.title,this._state.title=t},get prev(){return this._state.prev}};
},{}],8:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var getOrigin=function(e){return e.protocol+"//"+e.host},parseURL=function(e){var n=document.createElement("a");return n.href=e,n},origin=exports.origin=getOrigin(window.location),originRegEx=new RegExp(origin),sanitize=exports.sanitize=function(e){var n=e.replace(originRegEx,"");return n.match(/^\//)?n.replace(/\/{1}/,""):n},link=exports.link={isSameOrigin:function(e){return origin===getOrigin(parseURL(e))},isHash:function(e){return/#/.test(e)},isSameURL:function(e){return window.location.search===parseURL(e).search&&window.location.pathname===parseURL(e).pathname}};
},{}],9:[function(require,module,exports){
function closest(e,t){for(;e&&e.nodeType!==DOCUMENT_NODE_TYPE;){if(e.matches(t))return e;e=e.parentNode}}var DOCUMENT_NODE_TYPE=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var proto=Element.prototype;proto.matches=proto.matchesSelector||proto.mozMatchesSelector||proto.msMatchesSelector||proto.oMatchesSelector||proto.webkitMatchesSelector}module.exports=closest;
},{}],10:[function(require,module,exports){
function delegate(e,t,r,n,l){var s=listener.apply(this,arguments);return e.addEventListener(r,s,l),{destroy:function(){e.removeEventListener(r,s,l)}}}function listener(e,t,r,n){return function(r){r.delegateTarget=closest(r.target,t),r.delegateTarget&&n.call(e,r)}}var closest=require("./closest");module.exports=delegate;
},{"./closest":9}],11:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};exports.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={},n=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;n&&(t[e]=t[e]||{queue:[]},t[e].queue.push(n))};return _extends({},e,{emit:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=!!t[e]&&t[e].queue;r&&r.forEach(function(e){return e(n)})},on:n})};
},{}],12:[function(require,module,exports){
(function (global){
function getRequest(e){return e&&global.XDomainRequest&&!/MSIE 1/.test(navigator.userAgent)?new XDomainRequest:global.XMLHttpRequest?new XMLHttpRequest:void 0}function setDefault(e,t,o){e[t]=e[t]||o}var reqfields=["responseType","withCredentials","timeout","onprogress"];exports.ajax=function(e,t){function o(e,o){return function(){a||(t(void 0===u.status?e:u.status,0===u.status?"Error":u.response||u.responseText||o,u),a=!0)}}var r=e.headers||{},n=e.body,s=e.method||(n?"POST":"GET"),a=!1,u=getRequest(e.cors);u.open(s,e.url,!0);var l=u.onload=o(200);u.onreadystatechange=function(){4===u.readyState&&l()},u.onerror=o(null,"Error"),u.ontimeout=o(null,"Timeout"),u.onabort=o(null,"Abort"),n&&(setDefault(r,"X-Requested-With","XMLHttpRequest"),global.FormData&&n instanceof global.FormData||setDefault(r,"Content-Type","application/x-www-form-urlencoded"));for(var i,d=0,f=reqfields.length;d<f;d++)i=reqfields[d],void 0!==e[i]&&(u[i]=e[i]);for(var i in r)u.setRequestHeader(i,r[i]);return u.send(n),u};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Navigo",[],e):"object"==typeof exports?exports.Navigo=e():t.Navigo=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return t[o].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e){"use strict";function n(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function o(t){return t instanceof RegExp?t:t.replace(/\/+$/,"").replace(/^\/+/,"/")}function r(t,e){return 0===e.length?null:t?t.slice(1,t.length).reduce(function(t,n,o){return null===t&&(t={}),t[e[o]]=n,t},null):null}function i(t){var e,n=[];return e=t instanceof RegExp?t:new RegExp(o(t).replace(_,function(t,e,o){return n.push(o),g}).replace(v,y)+m),{regexp:e,paramNames:n}}function u(t){return t.replace(/\/$/,"").split("/").length}function s(t,e){return u(t)<u(e)}function a(t){return(arguments.length<=1||void 0===arguments[1]?[]:arguments[1]).map(function(e){var n=i(e.route),o=n.regexp,u=n.paramNames,s=t.match(o),a=r(s,u);return!!s&&{match:s,route:e,params:a}}).filter(function(t){return t})}function l(t,e){return a(t,e)[0]||!1}function c(t,e){var n=a(t,e.filter(function(t){var e=o(t.route);return""!==e&&"*"!==e})),r=o(t);return n.length>0?n.map(function(e){return o(t.substr(0,e.match.index))}).reduce(function(t,e){return e.length<t.length?e:t},r):r}function f(){return!("undefined"==typeof window||!window.history||!window.history.pushState)}function d(t){return t.replace(/\?(.*)?$/,"")}function h(t,e){this._routes=[],this.root=e&&t?t.replace(/\/$/,"/#"):t||null,this._useHash=e,this._paused=!1,this._destroyed=!1,this._lastRouteResolved=null,this._notFoundHandler=null,this._defaultHandler=null,this._ok=!e&&f(),this._listen(),this.updatePageLinks()}var p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};Object.defineProperty(e,"__esModule",{value:!0});var _=/([:*])(\w+)/g,v=/\*/g,g="([^/]+)",y="(?:.*)",m="(?:/$|$)";h.prototype={helpers:{match:l,root:c,clean:o},navigate:function(t,e){var n;return t=t||"",this._ok?(n=(e?"":this._getRoot()+"/")+o(t),n=n.replace(/([^:])(\/{2,})/g,"$1/"),history[this._paused?"replaceState":"pushState"]({},"",n),this.resolve()):"undefined"!=typeof window&&(window.location.href=window.location.href.replace(/#(.*)$/,"")+"#"+t),this},on:function(){for(var t=this,e=arguments.length,n=Array(e),o=0;o<e;o++)n[o]=arguments[o];if(n.length>=2)this._add(n[0],n[1]);else if("object"===p(n[0])){var r=Object.keys(n[0]).sort(s);r.forEach(function(e){t._add(e,n[0][e])})}else"function"==typeof n[0]&&(this._defaultHandler=n[0]);return this},notFound:function(t){this._notFoundHandler=t},resolve:function(t){var e,o,r=(t||this._cLoc()).replace(this._getRoot(),"");return!this._paused&&r!==this._lastRouteResolved&&(this._useHash&&(r=r.replace(/^\/#/,"/")),r=d(r),(o=l(r,this._routes))?(this._lastRouteResolved=r,e=o.route.handler,o.route.route instanceof RegExp?e.apply(void 0,n(o.match.slice(1,o.match.length))):e(o.params),o):!this._defaultHandler||""!==r&&"/"!==r?(this._notFoundHandler&&this._notFoundHandler(),!1):(this._lastRouteResolved=r,this._defaultHandler(),!0))},destroy:function(){this._routes=[],this._destroyed=!0,clearTimeout(this._listenningInterval),"undefined"!=typeof window&&(window.onpopstate=null)},updatePageLinks:function(){var t=this;"undefined"!=typeof document&&this._findLinks().forEach(function(e){e.hasListenerAttached||(e.addEventListener("click",function(n){var r=e.getAttribute("href");t._destroyed||(n.preventDefault(),t.navigate(o(r)))}),e.hasListenerAttached=!0)})},generate:function(t){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return this._routes.reduce(function(n,o){var r;if(o.name===t){n=o.route;for(r in e)n=n.replace(":"+r,e[r])}return n},"")},link:function(t){return this._getRoot()+t},pause:function(t){this._paused=t},disableIfAPINotAvailable:function(){f()||this.destroy()},_add:function(t){var e=arguments.length<=1||void 0===arguments[1]?null:arguments[1];return"object"===(void 0===e?"undefined":p(e))?this._routes.push({route:t,handler:e.uses,name:e.as}):this._routes.push({route:t,handler:e}),this._add},_getRoot:function(){return null!==this.root?this.root:(this.root=c(this._cLoc(),this._routes),this.root)},_listen:function(){var t=this;this._ok?window.onpopstate=function(){t.resolve()}:function(){var e=t._cLoc(),n=void 0,o=void 0;(o=function(){n=t._cLoc(),e!==n&&(e=n,t.resolve()),t._listenningInterval=setTimeout(o,200)})()}()},_cLoc:function(){return"undefined"!=typeof window?window.location.href:""},_findLinks:function(){return[].slice.call(document.querySelectorAll("[data-navigo]"))}},e.default=h,t.exports=e.default}])});
},{}],14:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var scroll=function(t){return window.scrollTo(0,t)},state=function(){return history.state?history.state.scrollPosition:0},save=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;window.history.replaceState({scrollPosition:t||window.pageYOffset||window.scrollY},"")},restore=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,o=state();t?t(o):scroll(o)},init=function(){"scrollRestoration"in history&&(history.scrollRestoration="manual",scroll(state()),window.onbeforeunload=function(){return save()})};exports.default="undefined"==typeof window?{}:{init:init,save:save,restore:restore,state:state};
},{}],15:[function(require,module,exports){
function next(t){t.length>0&&t.shift().apply(this,t)}function run(t,n){t(),next(n)}function tarry(t,n){return function(){var e=[].slice.call(arguments),r=e[0];if("number"==typeof r)return tarry(t,r);"number"==typeof n?setTimeout(function(){run(t,e)},n):run(t,e)}}function queue(){var t=[].slice.call(arguments);return tarry(function(){next(t.slice(0))})}module.exports=exports={tarry:tarry,queue:queue};
},{}],16:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(exports,"__esModule",{value:!0});var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},_transformProps=require("./transform-props"),_transformProps2=_interopRequireDefault(_transformProps),h=function(t){return function(){return isProps(arguments.length<=0?void 0:arguments[0])?applyProps(t)(arguments.length<=0?void 0:arguments[0]):appendChildren(t).apply(void 0,arguments)}},isObj=function(t){return null!==t&&"object"===(void 0===t?"undefined":_typeof(t))},isProps=function(t){return isObj(t)&&!(t instanceof Element)},applyProps=function(t){return function(e){return function(){if(isProps(arguments.length<=0?void 0:arguments[0]))return h(t)(Object.assign({},e,arguments.length<=0?void 0:arguments[0]));var n=h(t).apply(void 0,arguments),r=(0,_transformProps2.default)(e);return Object.keys(r).forEach(function(t){/^on/.test(t)?n[t]=r[t]:"__html"===t?n.innerHTML=r[t]:n.setAttribute(t,r[t])}),n}}},appendChildren=function(t){return function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];var o=document.createElement(t);return n.map(function(t){return t instanceof Element?t:document.createTextNode(t)}).forEach(function(t){return o.appendChild(t)}),o}};exports.default=h;
},{"./transform-props":17}],17:[function(require,module,exports){
"use strict";function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(exports,"__esModule",{value:!0});var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},kebab=exports.kebab=function(e){return e.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()})},parseValue=exports.parseValue=function(e){return function(t){return"number"==typeof t?addPx(e)(t):t}},unitlessProperties=exports.unitlessProperties=["lineHeight","fontWeight","opacity","zIndex"],addPx=exports.addPx=function(e){return function(t){return unitlessProperties.includes(e)?t:t+"px"}},filterNull=exports.filterNull=function(e){return function(t){return null!==e[t]}},createDec=exports.createDec=function(e){return function(t){return kebab(t)+":"+parseValue(t)(e[t])}},styleToString=exports.styleToString=function(e){return Object.keys(e).filter(filterNull(e)).map(createDec(e)).join(";")},isStyleObject=exports.isStyleObject=function(e){return function(t){return"style"===t&&null!==e[t]&&"object"===_typeof(e[t])}},createStyle=exports.createStyle=function(e){return function(t){return isStyleObject(e)(t)?styleToString(e[t]):e[t]}},reduceProps=exports.reduceProps=function(e){return function(t,r){return Object.assign(t,_defineProperty({},r,createStyle(e)(r)))}},transformProps=exports.transformProps=function(e){return Object.keys(e).reduce(reduceProps(e),{})};exports.default=transformProps;
},{}],18:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var createBar=function(e,t){var n=document.createElement("div"),r=document.createElement("div");return n.className=t,r.className=t+"__inner",n.appendChild(r),e.insertBefore(n,e.children[0]),{outer:n,inner:r}};exports.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=null,r=t.speed||200,a=t.classname||"putz",i=t.trickle||5,c={active:!1,progress:0},o=createBar(e,a),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;c.progress=e,o.inner.style.cssText="\n      transform: translateY("+(c.active?"0":"-100%")+") translateX("+(-100+c.progress)+"%);"},s=function(e){c.active&&u(Math.min(e,95))},l=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Math.random()*i;return s(c.progress+e)},v=function(){c.active=!1,u(100),setTimeout(function(){return u()},r),n&&clearTimeout(n)},d=function(){c.active=!0,l()},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500;c.active&&(n=setInterval(function(){return l()},e))};return Object.create({putz:f,start:d,inc:l,go:s,end:v,getState:function(){return c}},{bar:{value:o}})};
},{}],19:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],20:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var findLink=function(t,e){return e.filter(function(e){return e.id===t})[0]},createLink=function(t,e){return t.answers.forEach(function(t){var n=!!/^\//.test(t.next),r=!!/gif/.test(t.next);t.next=n||r?t.next:findLink(t.next,e)})},createStore=exports.createStore=function(t){return t.map(function(e){return createLink(e,t)}),t};exports.default=function(t){return{store:createStore(t),getActive:function(){return this.store.filter(function(t){return t.id==window.location.hash.split(/#/)[1]})[0]||this.store[0]}}};
},{}],21:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=[{id:1,prompt:"Hi! What brings you to this neck of the web?",answers:[{value:"Who r u?",next:2},{value:"I'm hiring.",next:3},{value:"It's your mother.",next:4},{value:"Funny jokes, plz.",next:5}]},{id:2,prompt:"I'm melanie – a graphic designer working in experiential marketing & proud Iowan trying to eat ALL the BLTs.",answers:[{value:"What's experiential?",next:6},{value:"What's a BLT?",next:7}]},{id:3,prompt:"Rad. Can I show you some projects I've worked on?",answers:[{value:"Yes, please!",next:"/work"},{value:"Nah, tell me about you.",next:"/about"},{value:"I'll email you instead.",next:"/contact"}]},{id:4,prompt:"Hi mom. I love you!",answers:[{value:"jk, not your mom",next:9}]},{id:5,prompt:"What's funnier than a rhetorical question?",answers:[{value:"Yes",next:10},{value:"No",next:"https://media.giphy.com/media/P2Hy88rAjQdsQ/giphy.gif"}]},{id:6,prompt:"Experiential marketing engages directly with consumers, inviting them to particpate in the evolution of a brand.",answers:[{value:"Sounds cool. What have you done?",next:"/work"},{value:"Why do you like it?",next:11}]},{id:7,prompt:"You tell me.",answers:[{value:"Beef Liver Toast",next:"https://media.giphy.com/media/oFOs10SJSnzos/giphy.gif"},{value:"Berry Lemon Tart",next:"https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif"},{value:"Bacon Lettuce Tomato",next:"https://media.giphy.com/media/fqzxcmlY7opOg/giphy.gif"}]},{id:9,prompt:"Clicking for fun? Good luck with this one.",answers:[{value:"Blue Pill",next:"https://media.giphy.com/media/G7GNoaUSH7sMU/giphy.gif"},{value:"Red Pill",next:"https://media.giphy.com/media/UjujGY3mA3Jle/giphy.gif"}]},{id:10,prompt:"Pancakes or waffles?",answers:[{value:"French Toast",next:"https://media.giphy.com/media/14nb6TlIRlaN1u/giphy.gif"}]},{id:11,prompt:"I like experiential because it's just super cool, okay?",answers:[{value:"What are your favorite projects?",next:14},{value:"I have questions! Can I email you?",next:"/contact"}]},{id:14,prompt:"I love the work I've done, but these projects deserve some serious props.",answers:[{value:"project 1",next:"https://twitter.com"},{value:"project 2",next:"https://twitter.com"},{value:"project 3",next:"https://twitter.com"}]}];
},{}],22:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.template=exports.title=exports.button=exports.div=void 0;var _h=require("h0"),_h2=_interopRequireDefault(_h),_colors=require("../lib/colors"),_colors2=_interopRequireDefault(_colors),div=exports.div=(0,_h2.default)("div"),button=exports.button=(0,_h2.default)("button")({class:"h2 mv0 inline-block"}),title=exports.title=(0,_h2.default)("p")({class:"h1 mt0 mb05 cb"}),template=exports.template=function(t,e){var r=t.prompt,o=t.answers;return div({class:"question"})(title(r),div.apply(void 0,_toConsumableArray(o.map(function(t,r){return button({onclick:function(r){return e(t.next)},style:{color:_colors2.default.colors[r]}})(t.value)}))))};
},{"../lib/colors":26,"h0":16}],23:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _tarry=require("tarry.js");exports.default=function(){var t=document.getElementById("gif"),e=t.getElementsByTagName("img")[0],r=(0,_tarry.tarry)(function(){return t.style.display="block"}),n=(0,_tarry.tarry)(function(){return t.style.display="none"}),a=(0,_tarry.tarry)(function(){return t.classList.contains("is-active")?t.classList.remove("is-active"):t.classList.add("is-active")}),i=function(t,e){var r=document.createElement("img");r.onload=function(){return e(t)},r.src=t},o=function(t){window.loader.start(),window.loader.putz(500),i(t,function(t){e.src=t,(0,_tarry.queue)(r,a(200))(),window.loader.end()})},s=function(){(0,_tarry.queue)(a,n(200))()};return t.onclick=s,{open:o,close:s}};
},{"tarry.js":19}],24:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _router=require("../lib/router"),_router2=_interopRequireDefault(_router),_index=require("./data/index.js"),_index2=_interopRequireDefault(_index),_data=require("./data"),_data2=_interopRequireDefault(_data),_giffer=require("./giffer"),_giffer2=_interopRequireDefault(_giffer),_elements=require("./elements"),prev=void 0,data=(0,_data2.default)(_index2.default),render=function(e){var t=document.getElementById("questionRoot"),r=(0,_elements.template)(e,update);return t&&t.appendChild(r),r},update=function(e){var t=document.getElementById("questionRoot");return/giphy/.test(e)?(0,_giffer2.default)().open(e):/^\//.test(e)?_router2.default.go(e):(prev&&t&&t.contains(prev)&&t.removeChild(prev),prev=render(e),void(window.location.hash=e.id))};_router2.default.on("route:after",function(e){var t=e.route;(""===t||/(^\/|\/#[0-9]|#[0-9])/.test(t))&&update(data.getActive())}),exports.default=function(){prev=render(data.getActive())};
},{"../lib/router":27,"./data":20,"./data/index.js":21,"./elements":22,"./giffer":23}],25:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var _putz=require("putz"),_putz2=_interopRequireDefault(_putz),_router=require("./lib/router"),_router2=_interopRequireDefault(_router),_app=require("./app"),_app2=_interopRequireDefault(_app),_colors=require("./lib/colors"),_colors2=_interopRequireDefault(_colors),loader=window.loader=(0,_putz2.default)(document.body,{speed:100,trickle:10});window.addEventListener("DOMContentLoaded",function(){(0,_app2.default)(),_router2.default.on("route:after",function(e){e.route;_colors2.default.update()}),_colors2.default.update()});
},{"./app":24,"./lib/colors":26,"./lib/router":27,"putz":18}],26:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var rootStyle=document.createElement("style");document.head.appendChild(rootStyle);var colors=["#35D3E8","#FF4E42","#FFEA51"],randomColor=function(){return colors[Math.round(2*Math.random()+0)]},saveColor=function(o){return localStorage.setItem("mjs",JSON.stringify({color:o}))},readColor=function(){return localStorage.getItem("mjs")?JSON.parse(localStorage.getItem("mjs")).color:null},getColor=function(){for(var o=randomColor(),r=readColor();o===r;)o=randomColor();return saveColor(o),o},update=function(){var o=getColor();rootStyle.innerHTML="\n    body { color: "+o+" }\n    ::-moz-selection {\n      background-color: "+o+";\n    }\n    ::selection {\n      background-color: "+o+";\n    }\n    .theme a {\n      color: "+o+"\n    }\n  "};exports.default={update:update,colors:colors};
},{}],27:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _operator=require("operator.js"),_operator2=_interopRequireDefault(_operator),gaTrackPageView=function(e,r){var t=!!window.ga&&window.ga;t&&(t("set",{page:e,title:r}),t("send","pageview"))},app=(0,_operator2.default)({root:"#root"});app.on("route:after",function(e){gaTrackPageView(e.route,e.title)}),app.on("transition:after",function(){return loader&&loader.end()}),window.app=app,exports.default=app;
},{"operator.js":3}]},{},[25])


//# sourceMappingURL=index.js.map