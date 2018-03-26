(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch'), require('socket.io-client')) :
	typeof define === 'function' && define.amd ? define(['node-fetch', 'socket.io-client'], factory) :
	(global.room = factory(global.fetch,global.io));
}(this, (function (fetch,io) { 'use strict';

fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;
io = io && io.hasOwnProperty('default') ? io['default'] : io;

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}
function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {uri} location Location to connect (defaults to localhost:3000)
 */
function getEnv (key) {
  if (typeof process !== 'undefined') return process.env[key]
}

class Room {
  constructor (uri) {
    this.uri = uri || getEnv('LIVING_ROOM_URI') || 'http://localhost:3000';
    this._sockets = new Map();
    this._data = null;
    this._endpoint = null;
  }

  subscribe (facts) {
    const subscriptionName = facts.toString();
    if (this._sockets.has(subscriptionName)) {
      return this._sockets.get(subscriptionName)
    }

    const socket = io.connect(this.uri);
    socket.emit('subscribe', facts);

    this._sockets.set(subscriptionName, socket);
    return {
      on (callback) {
        const fillOut = object => {
          return Object.assign(
            { selections: [], retractions: [], assertions: [] },
            object
          )
        };
        socket.on('assertions', data => callback(fillOut(data)));
        socket.on('retractions', data => callback(fillOut(data)));
      },
      unsubscribe () {
        socket.emit('unsubscribe', subscriptionName);
      }
    }
  }

  _db () {
    if (!(this._data || this._endpoint)) {
      throw new Error(
        `please set _data and _endpoint using assert(), retract(), or select()`
      )
    }
    const endpoint = this.uri + '/' + this._endpoint;

    if (typeof this._data === 'string') this._data = [this._data];

    const post = {
      method: 'POST',
      body: JSON.stringify(this._data),
      headers: { 'Content-Type': 'application/json' }
    };

    return fetch(endpoint, post).then(response => {
      this._data = null;
      this._endpoint = null;
      return response
    })
  }

  facts () {
    this._data = {};
    this._endpoint = 'facts';
    return this
  }

  select (fact) {
    this._data = { fact };
    this._endpoint = 'select';
    return this
  }

  doAll (callbackFn) {
    this._db()
      .then(_ => _.json())
      .then(json => {
        const { solutions } = json;
        callbackFn(solutions);
      });
  }

  do (callbackFn) {
    this._db()
      .then(_ => _.json())
      .then(json => {
        const { solutions } = json;
        solutions.forEach(callbackFn);
      });
  }

  assert (fact) {
    this._data = { fact };
    this._endpoint = 'assert';
    this._db();
    return this
  }

  retract (fact) {
    this._data = { fact };
    this._endpoint = 'retract';
    this._db();
    return this
  }
}

return Room;

})));
//# sourceMappingURL=room.browser.js.map
