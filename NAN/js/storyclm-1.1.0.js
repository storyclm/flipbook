/*!
* StoryCLM Library v1.1.0
* Copyright(c) 2016, Vladimir Klyuev, Breffi Inc. All rights reserved.
* License: Licensed under The MIT License.
*/

; (function () {

    if (window.StoryCLMBridge) return;
    
    var messagingIframe;
    var sendMessageQueue = [];

    var responseCallbacks = {};
    var uniqueId = 1;

    var CUSTOM_PROTOCOL_SCHEME = 'storyclm';
    var QUEUE_HAS_MESSAGE = 'SCLM_QUEUE';

    var slideData;

    function _createQueueReadyIframe(doc) {
        messagingIframe = doc.createElement('iframe');
        messagingIframe.style.display = 'none';
        doc.documentElement.appendChild(messagingIframe);
    }

    function _GUID() {
        return UUIDcreatePart(4) +
            UUIDcreatePart(2) +
            UUIDcreatePart(2) +
            UUIDcreatePart(2) +
            UUIDcreatePart(6);
    };

    function UUIDcreatePart(length) {
        var uuidpart = "";
        for (var i = 0; i < length; i++) {
            var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
            if (uuidchar.length == 1) {
                uuidchar = "0" + uuidchar;
            }
            uuidpart += uuidchar;
        }
        return uuidpart;
    }
    
    
    function _invoke(command, data, responseCallback) {
        var message = { Command: command, Data: data };
        if (responseCallback)
        {
            var GUID = 'GUID_' + (uniqueId++) + _GUID();
            responseCallbacks[GUID] = responseCallback;
            message.GUID = GUID;
        }
        sendMessageQueue.push(message);
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + ':' + QUEUE_HAS_MESSAGE;
    }

    function _getQueue() {
        var messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        return messageQueueString;
    }

    function _storyCLMHandler(messageJSON) {
        setTimeout(function () {
            if (!messageJSON) return;
            var message = JSON.parse(messageJSON);
            if (!message.GUID) return;
            var responseCallback = responseCallbacks[message.GUID];
            if (typeof responseCallback !== "function") return;
            responseCallback(message);
            delete responseCallbacks[message.GUID];
        }, 1);
    }

    function _getNavigationData()
    {
        return slideData;
    }

    _createQueueReadyIframe(window.document);
    window.StoryCLMBridge = {
        Invoke: _invoke,
        GetQueue: _getQueue,
        StoryCLMHandler: _storyCLMHandler,
        GetNavigationData: _getNavigationData
    };

    StoryCLMBridge.Invoke("getNavigationData", {}, function (data) {
        try {
            var dr = new StoryCLMApiMessage(data);
            slideData = dr.data;
        }
        catch (ex)
        { }
    });

})();

//try { if (window.StoryCLMBridge) { window.StoryCLMBridge.SetNavigationData("КОты");}} catch (e) { }

//new
(function (debug) {

    try
    {
        if (!window.StoryCLMBridge || !debug) return;
        var console = {};

        console.log = function (log) {
            try
            {
                StoryCLMBridge.Invoke("consolelog", { log: log });
            }
            catch (ex)
            { }
        };

        console.info = function (info) {
            try
            {
                StoryCLMBridge.Invoke("consoleinfo", { info: info });
            }
            catch (ex)
            { }
        };

        console.warn = function (warn) {
            try
            {
                StoryCLMBridge.Invoke("consolewarn", { warn: warn });
            }
            catch (ex)
            { }
        };

        console.error = function (exception) {
            try
            {
                if (typeof exception.stack !== 'undefined') {
                    StoryCLMBridge.Invoke("consoleerror", { error: exception.stack });
                } else {
                    StoryCLMBridge.Invoke("consoleerror", { error: arguments });
                }
            }
            catch (ex)
            { }
        }

        window.console = console;
    }
    catch (ex)
    { }

})(true);

function StoryCLMApiMessage(data)
{
    if (this instanceof StoryCLMApiMessage) {
        if (data) {
            this.status = data.Status;
            this.errorCode = data.ErrorCode;
            this.errorMessage = data.ErrorMessage;
            this.data = data.Data;
        }
        else {
            this.status = "error";
            this.errorCode = -2;
            this.errorMessage = "Data is empty";
            this.data = {};
        }
    }
    else return new StoryCLMApiMessage(data);
}

function StoryCLMparametersErrorMessge(callback)
{
    if (typeof callback === "function")
        callback(new StoryCLMApiMessage({
            status: "error",
            errorCode: -3,
            errorMessage: "Error Parameters",
            data: {}
        }));
}

var StoryCLM = {};

StoryCLM.Go = function (name, data, callback) {
    var options = {};
    if (typeof name !== "string") {
        StoryCLMparametersErrorMessge(callback);
        return;
    }
    if (arguments.length >= 3)
    {
        data = data || {};
    }
    else if (arguments.length === 2)
    {
        if (typeof data === "function")
        {
            callback = data;
            data = {};
        }
        data = data || {};
    }
    options = { slideName: name, data: data };
    StoryCLMBridge.Invoke("go", options, function (data) {
        if (typeof callback === "function")
            callback(new StoryCLMApiMessage(data));
    });
}

StoryCLM.GetNavigationData = function () {

}

StoryCLM.System = (function () {

    function _getInfo(callback)
    {
        StoryCLMBridge.Invoke("getAppInfo", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }
    return {
        GetInfo: _getInfo
    };
})();

StoryCLM.Presentation = (function () {

    function _open(presId, slideName, data, callback) {
        var options = {};
        if (typeof presId !== "number") {
            StoryCLMparametersErrorMessge(callback);
            return;
        }
        if (arguments.length === 3) {
            if (typeof data === "function") {
                callback = data;
                data = {};
            }
        }
        else if (arguments.length === 2) {
            if (typeof slideName === "function") {
                callback = slideName;
                slideName = "";
            }
            else {
                if (typeof slideName !== "string") {
                    StoryCLMparametersErrorMessge(callback);
                    return;
                }
            }
        }
        slideName = slideName || "";
        data = data || {};
        options = { presId: presId, slideName: slideName, data: data };
        StoryCLMBridge.Invoke("open", options, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _close(callback) {
        StoryCLMBridge.Invoke("closePresentation", {});
    }

    function _setComplete(callback) {
        StoryCLMBridge.Invoke("setPresentationComplete", {});
    }

    function _getInfo(callback) {
        StoryCLMBridge.Invoke("getPresentationInfo", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getPreviousSlide(callback) {
        StoryCLMBridge.Invoke("getPreviousSlide", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getNextSlide(callback) {
        StoryCLMBridge.Invoke("getNextSlide", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getBackForwardList(callback) {
        StoryCLMBridge.Invoke("getBackForwardList", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getBackForwardPresList(callback) {
        StoryCLMBridge.Invoke("getBackForwardPresList", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getMediaFiles(callback) {
        StoryCLMBridge.Invoke("getMediaFiles", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getPresentations(callback) {
        StoryCLMBridge.Invoke("getPresentations", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _openMediaFile(name, id, callback) {
        var options = {};
        if (typeof name !== "string") {
            StoryCLMparametersErrorMessge(callback);
            return;
        }
        if (arguments.length >= 3) {
            if (typeof id !== "number") {
                StoryCLMparametersErrorMessge(callback);
                return;
            }
        }
        else if (arguments.length === 2) {
            if (typeof id === "function") {
                callback = id;
                id = -1;
            }
            else {
                if (typeof id !== "number")
                {
                    StoryCLMparametersErrorMessge(callback);
                    return;
                }
            }
        }
        id = id || -1;
        options = { id: id, name: name };
        StoryCLMBridge.Invoke("openMediaFile", options, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getMap(callback) {
        StoryCLMBridge.Invoke("getMap", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _getCurrentSlideName(callback) {
        StoryCLMBridge.Invoke("getCurrentSlideName", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    return {
        Open: _open,
        OpenMediaFile: _openMediaFile,
        Close: _close,
        GetInfo: _getInfo,
        GetPreviousSlide: _getPreviousSlide,
        GetNextSlide: _getNextSlide,
        GetBackForwardList: _getBackForwardList,
        GetMediaFiles: _getMediaFiles,
        GetPresentations: _getPresentations,
        GetMap: _getMap,
        GetCurrentSlideName: _getCurrentSlideName,
        GetBackForwardPresList: _getBackForwardPresList,
        SetComplete: _setComplete
    };
})();


StoryCLM.User = (function () {

    function _get(callback) {
        StoryCLMBridge.Invoke("getUserInfo", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }
    return {
        Get: _get
    };
})();

StoryCLM.Geolocation = (function () {

    function _get(callback) {
        StoryCLMBridge.Invoke("getGeoLocationInfo", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }
    return {
        Get: _get
    };
})();

StoryCLM.CustomEvents = (function () {

    function _set(key, value, callback) {
        if (typeof key !== "string") return;
        StoryCLMBridge.Invoke("setCustomEvent", { key: key, value: value + "" }, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }
    return {
        Set: _set
    };
})();


StoryCLM.UI = (function () {

    function _openMediaLibrary() {
        StoryCLMBridge.Invoke("openMediaLibrary ", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _hideCloseBtn() {
        StoryCLMBridge.Invoke("hideCloseBtn", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _hideMediaLibraryBtn() {
        StoryCLMBridge.Invoke("hideMediaLibraryBtn", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _hideMapBtn() {
        StoryCLMBridge.Invoke("hideMapBtn", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    function _hideSystemBtns() {
        StoryCLMBridge.Invoke("hideSystemBtns", {}, function (data) {
            if (typeof callback === "function")
                callback(new StoryCLMApiMessage(data));
        });
    }

    return {
        OpenMediaLibrary: _openMediaLibrary,
        HideCloseBtn: _hideCloseBtn,
        HideMediaLibraryBtn: _hideMediaLibraryBtn,
        HideMapBtn: _hideMapBtn,
        HideSystemBtns: _hideSystemBtns
    };
})();