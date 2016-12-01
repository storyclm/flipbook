/*!
* StoryCLMStorage Library v1.0.0
* Copyright(c) 2016, Vladimir Klyuev, Breffi Inc. All rights reserved.
* License: Licensed under The MIT License.
*/

window.StoryCLMStoragePrefix = "PresName";

; (function (w) {

    w.StoryCLMStorage = (function () {

        var _presentationName = "SCLMS_" + w.StoryCLMStoragePrefix;
        var _state = {};

        function _getState() {
            var result = localStorage.getItem(_presentationName);
            if (result) {
                _state = JSON.parse(result).data || {};
            }
            return _state;
        }

        function _setState() {
            if (_state) {
                localStorage.setItem(_presentationName, JSON.stringify({ data: _state }));
            }
        }

        function _cleanState() {
            _state = {};
            _setState();
        }

        function iOS() {
            var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];
            while (iDevices.length) {
                if (navigator.platform === iDevices.pop()) { return true; }
            }
            return false;
        }

        w.addEventListener(iOS() ? "pagehide" : 'beforeunload', function () {
            _setState();
        });

        w.PresentationState = _getState();
        console.log(w.PresentationState);

        return {
            Clear: _cleanState
        };
    })();
})(window);