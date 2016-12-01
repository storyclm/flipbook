/**
* @param treshold
* @param multitouch
* @param onSwipeNext = function (direction) {}
* @param onSwipePrev = function (direction) {}
*/

var StoryCLMNavigation = function (data) {
    if (this instanceof StoryCLMNavigation) {
        var self = this;

        data = data || {};
        this.isSwipeAllBlock = false;
        this.isSwipePrevBlock = false;
        this.isSwipeNextBlock = false;
        this.isCanSwipeBackward = false;

        var next = document.querySelector('meta[name="clm-swipe-next"]').getAttribute('content');
        var previous = document.querySelector('meta[name="clm-swipe-previous"]').getAttribute('content');

        var swipeEl = document.body;
        var direction = 0;


        this.swObj = new Hammer(swipeEl);

        this.swObj.get('pan').set({
            threshold: data.threshold || 200,
            pointers: data.swipePointsCount || 1
        });

        this.swObj.on('panleft', function () {
            if (self.isSwipeAllBlock || self.isSwipeNextBlock) return false;
            direction = 1;
        });

        this.swObj.on('panright', function () {
            if (self.isCanSwipeBackward) direction = 3;
            if (self.isSwipeAllBlock || self.isSwipePrevBlock) return false;
            direction = 2;
        });

        this.swObj.on('panend', function () {
            if (direction == 1) {
                direction = 0;
                self.isEmptyMeta(next) ? self.onSwipeNext(false) : self.onSwipeNext(next);
            } else if (direction == 2) {
                direction = 0;
                self.isEmptyMeta(previous) ? self.onSwipePrev(false) : self.onSwipePrev(previous);
            } else if (direction == 3) {
                self.onSwipeBackward(1);
            }
        });
    } else {
        return new StoryCLMNavigation(treshold);
    }
};

StoryCLMNavigation.prototype = {
    /**
     * Блокирует всю навигацию
     */
    block: function (bool) {
        var self = this;

        if (bool === true) {
            self.isSwipeAllBlock = bool;
        } else {
            //мини-таймаут, чтоб не сработал panend
            setTimeout(function () {
                self.isSwipeAllBlock = false;
            }, 50);
        }
    },

    /**
     * Блокирует навигацию вперед
     */
    blockNext: function (bool) {
        var self = this;

        if (bool === true) {

            self.isSwipeNextBlock = bool;
        } else {
            //мини-таймаут, чтоб не сработал panend
            setTimeout(function () {
                self.isSwipeNextBlock = false;
            }, 50);
        }
    },

    /**
     * Блокирует навигацию назад
     */
    blockPrev: function (bool) {
        var self = this;

        if (bool === true) {
            self.isSwipePrevBlock = bool;
        } else {
            //мини-таймаут, чтоб не сработал panend
            setTimeout(function () {
                self.isSwipePrevBlock = false;
            }, 50);
        }
    },

    /**
     * Одноразовый блок pan-ов
     */
    blockSwipe: function () {
        this.swObj.stop();
    },

    /**
     * Проверка на наличие следующего/предыдущего слайда
     */
    isEmptyMeta: function (direction) {
        return !direction.length;
    },

    /**
     * Свайп вперед по умолчанию
     */
    onSwipeNext: function (direction) {
        window.location = direction;
    },

    /**
     * Свайп назад по умолчанию
     */
    onSwipePrev: function (direction) {
        window.location = direction;
    },

    /**
     * Свайп назад по истории по умолчанию
     */
    onSwipeBackward: function (count) {
    }
};