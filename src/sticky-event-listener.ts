/*!
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-4.0
 * http://creativecommons.org/licenses/by/4.0/
 */

class StickyEventListener {
    /** Options */
    options: {
        /** Whether or not to monitor the sticker to stick to the top. */
        monitorTop?: boolean;

        /** Whether or not to monitor the sticker to unstick from the bottom. */
        monitorBottom?: boolean;
    };

    /** The sticky element. */
    sticker: HTMLElement;

    /** The sentinel elements. */
    sentinels: {
        top?: HTMLElement;
        bottom?: HTMLElement;
    };

    /** Variable to keep track of the sticky state. */
    _isStuck: boolean;

    /** Variable to keep track of the sticky states. */
    _stuckAt: {
        top?: boolean;
        bottom?: boolean;
    };

    constructor(elem, options = {}) {
        //	Exit for old browsers.
        if (!('IntersectionObserver' in window)) {
            return;
        }

        this.options = {};
        const defaults = {
            monitorTop: true,
            monitorBottom: false
        };

        for (let option in defaults) {
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
        } else {
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
    _setSentinelsStyles() {
        const sentinelStyles = {
            width: '0px',
            position: 'absolute',
            zIndex: '-100',
            pointerEvents: 'none'
        };

        for (let pos in this.sentinels) {
            for (let prop in sentinelStyles) {
                this.sentinels[pos].style[prop] = sentinelStyles[prop];
            }
        }

        this.setStickerTop();
        this.setStickerPosition();
    }

    /**
     * Remeasures the "top" property for the sticker and update the position for the sentinels,
     * 	Should be called when the CSS "top" property for the sticker changes.
     */
    setStickerTop() {
        for (let pos in this.sentinels) {
            this.sentinels[pos].style.bottom =
                'calc(100% + ' +
                window.getComputedStyle(this.sticker).top +
                ')';
        }
    }

    /**
     * Update the height for the sentinels,
     * 	Should be called when the height of the <body> changes.
     */
    setStickerPosition() {
        for (let pos in this.sentinels) {
            this.sentinels[pos].style.height =
                document.body.scrollHeight + 'px';
        }
    }

    /**
     * Add an observer for the specified sentinel.
     * @param {string} pos The position for the sentinel. Can be "top" or "bottom".
     */
    _addObserver(pos: 'top' | 'bottom') {
        const observer = new IntersectionObserver(entries => {
            this._stuckAt[pos] = !entries[0].isIntersecting;

            let isStuck = this._stuckAt.top && !this._stuckAt.bottom;

            if (isStuck != this._isStuck) {
                this._isStuck = isStuck;
                this.sticker.dispatchEvent(
                    new CustomEvent('sticky', { detail: { stuck: isStuck } })
                );
            }
        });
        observer.observe(this.sentinels[pos]);
    }
}

//  Export module
export default StickyEventListener;

//	Global namespace
window['StickyEventListener'] = StickyEventListener;
