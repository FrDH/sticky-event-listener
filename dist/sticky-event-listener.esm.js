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
export default StickyEventListener;
//	Global namespace
window['StickyEventListener'] = StickyEventListener;
