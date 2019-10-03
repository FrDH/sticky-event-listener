/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*!
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-4.0
 * http://creativecommons.org/licenses/by/4.0/
 */
var StickyEventListener = /** @class */ (function () {
    function StickyEventListener(elem, options) {
        if (options === void 0) { options = {}; }
        //	Exit for old browsers.
        if (!('IntersectionObserver' in window)) {
            return;
        }
        this.options = {};
        var defaults = {
            monitorTop: true,
            monitorBottom: false
        };
        for (var option in defaults) {
            this.options[option] =
                typeof options[option] != 'undefined'
                    ? options[option]
                    : defaults[option];
        }
        this.sticker = elem;
        this.sentinels = {};
        this._isStuck = false;
        this._stuckAt = {
            top: false,
            bottom: false
        };
        //	Detect sticking to the top.
        if (this.options.monitorTop) {
            this.sentinels.top = document.createElement('em');
            this.sentinels.top.style.marginBottom = '1px';
            this.sticker.prepend(this.sentinels.top);
            this._addObserver('top');
        }
        else {
            this._stuckAt.top = true;
        }
        //	Detect unsticking from the bottom.
        if (this.options.monitorBottom) {
            this.sentinels.bottom = document.createElement('em');
            this.sticker.prepend(this.sentinels.bottom);
            this._addObserver('bottom');
        }
        this._setSentinelsStyles();
    }
    /**
     * Set the styles for the sentinels.
     */
    StickyEventListener.prototype._setSentinelsStyles = function () {
        var sentinelStyles = {
            width: '0px',
            position: 'absolute',
            zIndex: '-100',
            pointerEvents: 'none'
        };
        for (var pos in this.sentinels) {
            for (var prop in sentinelStyles) {
                this.sentinels[pos].style[prop] = sentinelStyles[prop];
            }
        }
        this.setStickerTop();
        this.setStickerPosition();
    };
    /**
     * Remeasures the "top" property for the sticker and update the position for the sentinels,
     * 	Should be called when the CSS "top" property for the sticker changes.
     */
    StickyEventListener.prototype.setStickerTop = function () {
        for (var pos in this.sentinels) {
            this.sentinels[pos].style.bottom =
                'calc(100% + ' +
                    window.getComputedStyle(this.sticker).top +
                    ')';
        }
    };
    /**
     * Update the height for the sentinels,
     * 	Should be called when the height of the <body> changes.
     */
    StickyEventListener.prototype.setStickerPosition = function () {
        for (var pos in this.sentinels) {
            this.sentinels[pos].style.height =
                document.body.scrollHeight + 'px';
        }
    };
    /**
     * Add an observer for the specified sentinel.
     * @param {string} pos The position for the sentinel. Can be "top" or "bottom".
     */
    StickyEventListener.prototype._addObserver = function (pos) {
        var _this = this;
        var observer = new IntersectionObserver(function (entries) {
            _this._stuckAt[pos] = !entries[0].isIntersecting;
            var isStuck = _this._stuckAt.top && !_this._stuckAt.bottom;
            if (isStuck != _this._isStuck) {
                _this._isStuck = isStuck;
                _this.sticker.dispatchEvent(new CustomEvent('sticky', { detail: { stuck: isStuck } }));
            }
        });
        observer.observe(this.sentinels[pos]);
    };
    return StickyEventListener;
}());
//  Export module
/* harmony default export */ __webpack_exports__["default"] = (StickyEventListener);
//	Global namespace
window['StickyEventListener'] = StickyEventListener;


/***/ })
/******/ ]);