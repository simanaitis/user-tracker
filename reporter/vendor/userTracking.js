(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UserTracking = (function () {
    'use strict';

    var instance;

    function UserTracking() {

        var userTracking = new Object(),
            Const = require('./refactorConst.js'),

            Console = require('./refactorConsole.js'),
            UserDataManager = require('./userDataManager.js'),
            UserActionListener = require('./userActionListener.js'),
            DataStorage = require('./dataStorage.js'),
            ServerFunctions = require('./serverFunctions.js'),
            CookieManager = require('./cookieManager.js');

        userTracking.init = function () {
            if (!isLocalStorageEnalbed()) return;

            //FIX ME CAPTAIN
            DataStorage.initializeActionsArray();
            checkScreenSize();


            checkUser().then(function () {
                var eventsToTrack = getEventsToTrack();
                if (eventsToTrack.length) {
                    userTracking.startTracking(eventsToTrack);
                };
            });


        };

        userTracking.startTracking = function (settings) {
            Console.log('recording actions');

            userTracking.sessionInProgress = true;
            userTracking.addListeners(settings);
            sessionTimer(settings.endTime ? settings.endTime : Date.now() + Const.SESSION_TIME);
        };

        userTracking.stopTracking = function () {
            Console.log('deleted session cookie');

            userTracking.sessionInProgress = false;
            CookieManager.eraseCookie(Const.SESSION_NAME);
            if (CookieManager.readCookie(Const.SESSION_NAME) !== null) {
                CookieManager.createCookie(Const.SESSION_NAME, Const.SESSION_FAILED, userTracking.sessionMinutes * 1000);
            }
            userTracking.removeListeners();
            clearInterval(userTracking.interval);
        };

        userTracking.addListener = UserActionListener.addListener;
        userTracking.addListeners = UserActionListener.addListeners;
        userTracking.removeListeners = UserActionListener.removeListeners;

        function isLocalStorageEnalbed() {
            var mod = 'test';
            try {
                localStorage.setItem(mod, mod);
                localStorage.removeItem(mod);
                return true;
            } catch (e) {
                console.log('local storage is not supported in this browser');
                return false;
            }
        }

        function getEventsToTrack() {
            var sessionStatus = CookieManager.readCookie(Const.SESSION_NAME);

            if (!sessionStatus || sessionStatus !== 'undefined') {
                var data = {status: true, actionsToTrack: ['click', 'dbclick', 'scroll', 'zoom'], duration: 10000};
                Console.log('TRACKING EVENTS:', data.actionsToTrack);
                CookieManager.createCookie(Const.SESSION_NAME, JSON.stringify(data.actionsToTrack), data.duration);
                return data.actionsToTrack;
                //     ServerFunctions.shouldRecord(function(data) {
                //         data = {status: true, actionsToTrack: ['click', 'dbclick', 'scroll', 'zoom'], duration: 10000};
                //         //if (data.status) {
                //             Console.log('TRACKING EVENTS:', data.actionsToTrack);
                //             CookieManager.createCookie(Const.SESSION_NAME, JSON.stringify(data.actionsToTrack), data.duration);
                //             return data.actionsToTrack;
                //         /*} else {
                //             CookieManager.createCookie(Const.SESSION_NAME, Const.SESSION_STOPPED, data.duration);
                //             return [];
                //         }*/
                //     });
                // } else if (sessionStatus !== Const.DO_NOTHING) {
                //     return JSON.parse(sessionStatus);
            }

            return [];
        }

        function sessionTimer(endDate) {
            if (!endDate) return;
            //Console.info('launched timer');

            userTracking.interval = setInterval(function () {
                if (endDate >= Date.now()) {
                    DataStorage.checkStorageSize(true);
                    userTracking.stopTracking();
                }
            }, Const.INTERVAL_TIME);
        }

        function checkScreenSize() {
            //on script start get screen size if it is not saved
            var startscreenExists = userTracking.userActions.filter(function (action) {
                return action.eventType === 'startscreen';
            });
            if (!userTracking.userActions.length || !startscreenExists) {
                document.dispatchEvent(new CustomEvent('startscreen'));
            }
        }

        function checkUser() {
            var promise = new Promise(
                function (resolve, reject) {
                    var cookieInfo = CookieManager.readCookie(Const.KEY);
                    if (cookieInfo === null || cookieInfo.replace(Const.REGEXP, '$1') == undefined) {
                        ServerFunctions.getUserId().then(
                            function () {
                                resolve(CookieManager.readCookie(Const.KEY));
                            }
                        );
                    } else {
                        resolve(cookieInfo);
                    }
                });
            return promise;

        }

        // VERRY TEMP
        userTracking.userActions = [];
        userTracking.userActionsTemp = [];
        userTracking.userActionsToSend = [];
        userTracking.repeater = 1;
        userTracking.divider = 0;
        userTracking.isSending = false;
        userTracking.sessionInProgress = false;
        // VERRY TEMP

        return userTracking;
    }

    function createInstance() {
        return new UserTracking();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// EXPOSING INTENTIONALLY
userTracking = UserTracking.getInstance();

userTracking.init();

},{"./cookieManager.js":2,"./dataStorage.js":3,"./refactorConsole.js":6,"./refactorConst.js":7,"./serverFunctions.js":8,"./userActionListener.js":9,"./userDataManager.js":10}],2:[function(require,module,exports){
module.exports = (function CookieManager() {

    var createCookie = function(name, value, ms) {
        var expires = '';
        if (ms) {
            var date = new Date();
            date.setTime(date.getTime() + (ms * 1000));
            expires = '; expires=' + date.toGMTString();
        } else {
            expires = '';
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    };

    var readCookie = function(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };

    var eraseCookie = function(name) {
        createCookie(name, '', -1);
    };

    return {
        createCookie: createCookie,
        readCookie: readCookie,
        eraseCookie: eraseCookie
    };
})();
},{}],3:[function(require,module,exports){
module.exports = (function DataStorage() {
    'use strict';

    var UserDataManager = require('./userDataManager.js'),
        ServerFunctions = require('./serverFunctions.js'),
        Const = require('./refactorConst.js');

    var initializeActionsArray = function() {
        var value = localStorage[Const.KEY];
        if (value !== undefined) {
            localStorage.removeItem(Const.KEY);
            var tmp = userTracking.userActions.concat(JSON.parse(value));
            userTracking.userActions = tmp;
        } else {
            userTracking.userActions = [];
        }
    };

    var saveEventInfo = function(eventInfo) {
        console.log('saveEventInfo', eventInfo);

        userTracking.userActions.push(eventInfo);
        checkStorageSize();
    }; 

    var clearData = function() {
        userTracking.userActions.length = 0;
    };

    var checkStorageSize = function(sendNow) {
        var size = userTracking.userActions.length;
        if (size === 0 && sendNow) {
            sendNow = false;
        }
        console.log('Log contains ' + size + ' item(s), and will sync after reaches ' + Const.MAX_ALLOWED_SIZE);
        if (size === Const.MAX_ALLOWED_SIZE - 1) {
            console.log('will sync after one more log entry');
        }
        if ((size >= Const.MAX_ALLOWED_SIZE && (size % userTracking.repeater) === 0 ) || (sendNow && size > 1)) { // jshint ignore:line
            if (userTracking.isSending === true) {
                console.log('won\'t send, because currently is sending');
                return;
            }
            userTracking.isSending = true;
            console.log('will send, because currently isn\'t sending');

            if (userTracking.userActionsTemp.length === 0) {
                userTracking.userActionsTemp = userTracking.userActions.slice(0);
            }
            userTracking.userActionsToSend =
                userTracking.userActions.slice(userTracking.divider);

            clearData();
            var formData = UserDataManager.formUserData(userTracking.userActionsToSend);
            ServerFunctions.sendEventsToServer(userTracking.userActionsToSend);
        }

    };

    var writeActionsToStorage = function() {
        if (userTracking.userActionsTemp && userTracking.userActionsTemp.length) {
            userTracking.userActions = userTracking.userActions.concat(userTracking.userActionsTemp);
        }
        if (userTracking.userActions.length > 0) {
            localStorage.setItem(Const.KEY, JSON.stringify(userTracking.userActions));
            console.log('wrote actions to local storage');
        }
    };

    return {
        initializeActionsArray: initializeActionsArray,
        saveEventInfo: saveEventInfo,
        clearData: clearData,
        checkStorageSize: checkStorageSize,
        writeActionsToStorage: writeActionsToStorage
    };
})();
},{"./refactorConst.js":7,"./serverFunctions.js":8,"./userDataManager.js":10}],4:[function(require,module,exports){
module.exports = (function EventFactory() {
    'use strict';

    // POSSIBILITY TO CHANGE PRECISION ON RUNTIME
    var Precision = require('./utils/precision.js');
    // Precision.setPrecision(new Precision.tenthsFloorPrecision());

    function _getCoordinates(event) {
        var X,
            Y;
        if ((event.clientX || event.clientY) && document.body &&
            document.body.scrollLeft !== null) {
            X = event.clientX + document.body.scrollLeft;
            Y = event.clientY + document.body.scrollTop;
        }
        if ((event.clientX || event.clientY) &&
            document.compatMode === 'CSS1Compat' && document.documentElement &&
            document.documentElement.scrollLeft !== null) {
            X = event.clientX + document.documentElement.scrollLeft;
            Y = event.clientY + document.documentElement.scrollTop;
        }
        if (event.pageX || event.pageY) {
            X = event.pageX;
            Y = event.pageY;
        }
        if (event.type === 'scroll') {
            X = pageXOffset;
            Y = pageYOffset;
        }

        if (event.type === 'focus' || event.type === 'change') {
            if (event.target.getBoundingClientRect) {
                var bodyRect = document.body.getBoundingClientRect(),
                    elemRect = event.target.getBoundingClientRect();
                X = elemRect.top - bodyRect.top;
                Y = elemRect.left - bodyRect.left;
            }
        }

        return Precision.calculate({
            X: X,
            Y: Y
        });
    }

    function _getScreenSize() {
        var winW, winH;

        if (document.body && document.body.offsetWidth) {
            winW = document.body.offsetWidth;
            winH = document.body.offsetHeight;
        }
        if (document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth ) {
            winW = document.documentElement.offsetWidth;
            winH = document.documentElement.offsetHeight;
        }
        if (window.innerWidth && window.innerHeight) {
            winW = window.innerWidth;
            winH = window.innerHeight;
        }
        return {width: winW, height: winH};
    }

    // Factory
    function createEvent(event) {
        var createdEvent;

        switch (event.type) {
            case 'click':
            case 'dblclick':
            case 'focus':
            case 'dragstart':
            case 'drop':
            case 'change':
                createdEvent = new InteractEvent(event);
            break;
            case 'resize':
            case 'startscreen':
                createdEvent = new BasicEvent(event);
            break;
            case 'scroll':
                createdEvent = new ScrollEvent(event);
            break;
        }

        return createdEvent;
    }

    // Base class
    function BasicEvent (event) {
        var body = document.body,
            html = document.documentElement;

        this.type = event.type;
        this.time = Date.now(); // or event.timeStamp
        this.documentHeight = Math.max(body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        this.documentWidth = Math.max(body.scrollWidth, body.offsetWidth, 
            html.clientWidth, html.scrollWidth, html.offsetWidth);

        var screenSize = _getScreenSize();
        this.screenWidth = screenSize.width;
        this.screenHeight = screenSize.height;

        this.path = window.location.pathname;
    }

    // InteractEvent
    function InteractEvent(event) {
        // Call the parent constructor
        BasicEvent.call(this, event);

        if (event.target && event.target.id) {
            this.elementId = event.target.id;
        }

        var coordinates = _getCoordinates(event);
        this.positionX = coordinates.X;
        this.positionY = coordinates.Y;
    }
    // inherit 
    InteractEvent.prototype = BasicEvent;
    // correct the constructor pointer because it points to BasicEvent
    InteractEvent.prototype.constructor = InteractEvent;


    // ScrollEvent
    function ScrollEvent(event) {
        BasicEvent.call(this, event);

        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    ScrollEvent.prototype = BasicEvent;
    ScrollEvent.prototype.constructor = ScrollEvent;

    return {
        createEvent: createEvent
    };
})();
},{"./utils/precision.js":11}],5:[function(require,module,exports){
module.exports = (function Mediator() {
    'use strict';

    var mediators = [];

    var subscribe = function(channel, fn){
        var mediator = mediators[mediators.indexOf(this)];

        if (!mediator.channels[channel]) {
            mediator.channels[channel] = [];
        }
        mediator.channels[channel].push({ context : this, callback : fn });

        console.log('sub', this, channel, fn);

        return this;
    };

    var publish = function(channel){
        var mediator = mediators[mediators.indexOf(this)],
            mediatorChannel = mediator.channels[channel];
        
        if (!mediatorChannel) return;

        var args = Array.prototype.slice.call(arguments, 1);
        console.log('publish', this, channel);

        for(var i = 0, l = mediatorChannel.length; i < l; i++){
            var subscription = mediatorChannel[i];
        console.log('publish subscription',subscription);

            subscription.callback.apply(subscription.context, args);
        };
        return this;
    };

    return {
        installTo: function(obj){
            obj.channels = [];
            mediators.push(obj);
            
            obj.subscribe = subscribe;
            obj.publish = publish
        }
    };
})();
},{}],6:[function(require,module,exports){
module.exports = (function Console() {

	var log = function() {
		console.log.apply(console, arguments);
	};

	var info = function() {
		console.info ? console.info.apply(console, arguments) : log(arguments);
	};

	var warn = function() {
		console.warn ? console.warn.apply(console, arguments) : log(arguments);
	};

	var error = function() {
		console.error ? console.error.apply(console, arguments) : log(arguments);
	};

	return {
		log: log,
		info: info,
		warn: warn,
		error: error
	}
})();
},{}],7:[function(require,module,exports){
module.exports = (function Const() {

	var BASE = 'http://localhost:3000/api/',
		KEY = 'userTracking',
		VISITKEY = 'SessionId';

    /*if (location.host.indexOf('localhost') !== -1) {
        BASE = 'http://localhost:3000/api/';
    } else if (location.host.indexOf('herokuapp') !== -1) {
        BASE = '';
    }*/

	return {
		SESSION_STOPPED: 'doNothing',
		SESSION_FAILED: 'failed',
		SESSION_NAME: 'userTracking',

		SESSION_TIME: 60 * 60 * 1000,
		INTERVAL_TIME: 20000,
		MAX_ALLOWED_SIZE: 10,

		KEY: KEY,
		VISITKEY:VISITKEY,
		REGEXP: new RegExp('(?:(?:^|.*;s*)' + KEY + 's*=s*([^;]*).*$)|^.*$'),

		BASE: BASE
	};
})();
},{}],8:[function(require,module,exports){
module.exports = (function ServerFunctions() {
    'use strict';
    var Const = require('./refactorConst.js'),
        CookieManager = require('./cookieManager.js'),
        UserDataManager = require('./userDataManager.js'),
        XHRService = require('./xhrService.js');

    var userModel = UserDataManager.getModel();

    var sendToServer = function(sendingData) {
        var dataToSend = {events: sendingData}
        console.log('sendingToServer');
        console.log(CookieManager.readCookie(Const.VISITKEY));
        XHRService.POST(Const.BASE + 'Visits/' + CookieManager.readCookie(Const.VISITKEY) + '/event', dataToSend).then(
            function(responseData, textStatus, jqXHR){
                onSendSuccess();
                return true;
            },
            function(response, textStatus, errorThrown){
                var responseData = JSON.parse(response.target.response);
                onSendError(responseData);


                return false;
            }
        );
    };

    var startVisit = function(calback){
        XHRService.POST(Const.BASE + 'users/' + CookieManager.readCookie(Const.KEY) + '/visits/', {"startTime": Date.now()}).then(
            function(response, textStatus, jqXHR) {
                var responseData = JSON.parse(response.target.response);

                console.log('seting session data', responseData.id);
                CookieManager.createCookie(Const.VISITKEY,
                    responseData.id, 999999 * 24 * 60 * 60 * 1000);
                console.log('setting visit id');
                calback();
                return true;
            });
    };

    var getUserId = function() {
        var data2 = {};
        data2.title = 'userTracking';
        data2.w = screen.width;
        data2.h = screen.height;
        data2.registrationTime = Date.now();
        console.log(data2);

        var promise = new Promise(function(resolve, reject){
            XHRService.POST(Const.BASE + 'users', data2).then(
                function(response, textStatus, jqXHR) {
                    var responseData = JSON.parse(response.target.response);

                    console.log('setting users data', responseData);
                    CookieManager.createCookie(Const.KEY,
                        responseData.id, 999999 * 24 * 60 * 60 * 1000);
                    startVisit(resolve);
                    userModel.publish('userLogin', responseData.id);
                    //return true;
                },
                function(responseData, textStatus, errorThrown) {
                    startVisit(resolve);
                    console.log('setCookies', 'unregistered');
                    CookieManager.createCookie(Const.KEY,
                        'unregistered', 999999 * 24 * 60 * 60 * 1000);
                    console.log('o ffs');
                    userModel.publish('userLogout');
                    //return false;
                });
        });


        return promise;

    };

    var recordVisitStart = function(callback) {
        var dataObject = {};
        dataObject.hostname = location.host;
        dataObject.startTime = Date.now();

        XHRService.POST(Const.BASE + 'users/' + CookieManager.readCookie(Const.KEY) + '/visits', dataObject).then(
            function(response, textStatus, jqXHR) {
                var responseData = JSON.parse(response.target.response);
                callback(responseData);
            }, function(responseData, textStatus, errorThrown) {
                return false;
            }
        );
    };


    function onSendSuccess() {
        userTracking.isSending = false;
        console.log('success');

        console.log('minus', Math.abs(userTracking.userActionsTemp.length -
            userTracking.userActionsToSend.length));

        var difference = Math.abs(userTracking.userActionsTemp.length -
            userTracking.userActionsToSend.length);

        userTracking.userActions = userTracking.userActionsTemp.slice(0,
            difference).concat(userTracking.userActions);

        console.log('success, left:', userTracking.userActions.length);
        userTracking.userActionsToSend.length = 0;
        userTracking.userActionsTemp.length = 0;
        userTracking.repeater = 1;
        userTracking.divider = 0;
        // should stop session or should it continue when there are
        // events not sent?
        // if (userTracking.sessionInProgress) {
        //     userTracking.stopTracking();
        // }
    }

    function onSendError(e) {
        console.log('failure, but setted cookie and deleted logs');
        userTracking.isSending = false;
        switch (e.detail.status) {
            case 0:
                userTracking.repeater = 3;
                if (userTracking.userActionsTemp !== undefined && userTracking.userActionsTemp.length > 0) { // jshint ignore:line
                    userTracking.userActions =
                        userTracking.userActions.concat(userTracking.userActionsTemp);
                }
                userTracking.userActionsTemp.length = 0;
                console.log('server down');
                break;
            case 401:
                CookieManager.deleteCookies();

                var userId = JSON.parse(e.detail.responseText).userId;
                CookieManager.createCookie(Const.KEY, userId, 999999);
                
                DataStorage.clearData();
                break;
            case 413:
                console.log('too much info sent');
                if (userTracking.userActionsTemp !== undefined && userTracking.userActionsTemp.length > 0) { // jshint ignore:line
                    userTracking.userActions =
                        userTracking.userActions.concat(userTracking.userActionsTemp);
                }
                console.log('asdasdsa', userTracking.userActions.length);
                userTracking.userActionsTemp.length = 0;
                if (userTracking.divider === 0) {
                    console.log('userTracking.divider 0', userTracking.divider);
                    userTracking.divider = userTracking.userActions.length / 2;
                } else {
                    console.log('userTracking.divider > 0', userTracking.divider);
                    userTracking.divider += userTracking.divider / 2;
                }
                // CONSIDER THIS
                if (userTracking.divider.length >= userTracking.userActions.length) {
                    userTracking.userActionsToSend.length = 0;
                    userTracking.userActionsTemp.length = 0;
                    userTracking.repeater = 1;
                    userTracking.divider = 0;
                    DataStorage.clearData();
                }
                console.log('userTracking.divider', userTracking.divider);
                break;
            default:
                break;
        }
    }

    return {
        sendEventsToServer: sendToServer,
        shouldRecord: recordVisitStart,
        getUserId: getUserId
    };
})();
},{"./cookieManager.js":2,"./refactorConst.js":7,"./userDataManager.js":10,"./xhrService.js":12}],9:[function(require,module,exports){
module.exports = (function UserActionListener() {
    'use strict';

    var Console = require('./refactorConsole.js'),
        UserDataManager = require('./userDataManager.js'),
        DataStorage = require('./dataStorage.js'),
        EventFactory = require('./eventFactory.js');
 
    var addListeners = function(settings) {
        removeListeners();

        Console.log('settings passed to action lisener', settings);

        // Listens to startscreen and unload. These functions should work always
        document.addEventListener('startscreen', genericEventHandler, false);
        window.addEventListener('unload', unloadHandler, false);

        var actions = typeof settings === 'string' ? settings.split(',') : settings;

        for (var i = 0, l = actions.length; i < l; i ++) {
            addListener(actions[i]);
        }
    };

    var addListener = function(eventType) {
        eventType = eventType.trim();
        switch(eventType) {
            case 'dblclick':
            case 'change':
            case 'dragstart':
            case 'drop':
                document.addEventListener(eventType, genericEventHandler, false);
            break;
            case 'focus':
                document.addEventListener(eventType, genericEventHandler, true);
            break;
            case 'click':
                document.addEventListener('click', clickHandler, false);
            break;
            case 'resize':
                window.addEventListener('resize', resizeHandler, false);
            break;
            case 'scroll':
                window.addEventListener('scroll', scrollHandler, false);
            break;
        }
    };

    var removeListeners = function() {
        Console.log('stopped listening to actions');
        document.removeEventListener('click', clickHandler, false);
        document.removeEventListener('dblclick', genericEventHandler, false);
        window.removeEventListener('resize', resizeHandler, false);
        document.removeEventListener('startscreen', genericEventHandler, false);
        document.removeEventListener('change', genericEventHandler, false);
        window.removeEventListener('unload', unloadHandler, false);
        window.removeEventListener('scroll', scrollHandler, false);
        document.removeEventListener('dragstart', genericEventHandler, false);
        document.removeEventListener('drop', genericEventHandler, false);
        document.removeEventListener('focus', genericEventHandler, true);
    };

    function saveEvent(e) {
        var createdEvent = EventFactory.createEvent(e);
        DataStorage.saveEventInfo(createdEvent);
    }

    function genericEventHandler(e) {
        // MAKE ME ALRIGHT AGAIN
        Console.log(e.detail);
        saveEvent(e);
    }

    var clickAllowed = true;
    function clickHandler(e) {
        if (clickAllowed) {
            clickAllowed = false;
            Console.log('click');
            saveEvent(e);
            setTimeout(function() {
                clickAllowed = true;
            }, 250);
        }
    }

    var resizeTimeout;
    function resizeHandler(e) {
        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function() {
            Console.log('resize');
            saveEvent(e);
        }, 400);
    }

    function unloadHandler(e) {
        //TODO end visit here
        Console.log('unload');
        DataStorage.writeActionsToStorage();
    }

    var scrollTimeout;
    function scrollHandler(e) {
        if (scrollTimeout) clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function() {
            Console.log('scroll');
            saveEvent(e);
        }, 400);
    }

    return {
        addListener: addListener,
        addListeners: addListeners,
        removeListeners: removeListeners
    }
})();
},{"./dataStorage.js":3,"./eventFactory.js":4,"./refactorConsole.js":6,"./userDataManager.js":10}],10:[function(require,module,exports){
module.exports = (function UserDataManager() {
    'use strict';

    var Const = require('./refactorConst.js'),
        MediatorService = require('./mediator.js'),
        CookieManager = require('./cookieManager.js');

    var userModel = {
            id: null
        },
        _url = null,
        _actions = [];

    (function init() {
        MediatorService.installTo(userModel);

        userModel.subscribe('userLogin', function(userId) {
            userModel.id = userId;
        });
        userModel.subscribe('userLogout', function() {
            userModel.id = null;
        });
    })();

    function _formSesionID() {
        console.log('user id was set:' + userModel.id);
        if ( !CookieManager.readCookie(Const.KEY)) {
            console.log('id was undefined');
            return false;
        }
        return true;
    }

    function _formUrl() {
        _url = document.domain;
        console.log('Domain: ' + document.domain);
    }

    function _formActions() {
        _actions = userTracking.userActions;
    }

    function formUserData(dataForSending) {
        if (_formSesionID()) {
            _actions = dataForSending;
        }
         
        _formUrl();
        var data = {
            userID: userModel.id,
            url: _url,
            actions: _actions
        };

        return data;
    }


    function getModel() {
        return userModel;
    }

    return {
        formUserData: formUserData,
        getModel: getModel
    };
})();
},{"./cookieManager.js":2,"./mediator.js":5,"./refactorConst.js":7}],11:[function(require,module,exports){
module.exports = (function Precision() {
    function pixelPrecision() {
        this.calculate = function(coordinates) {
           return coordinates;
        }
    };
     
    function tenthsFloorPrecision() {
        this.calculate = function(coordinates) {
            coordinates.X = Math.floor(coordinates.X / 10) * 10;
            coordinates.Y = Math.floor(coordinates.Y / 10) * 10;
            return coordinates;
        }
    };
     
    function tenthsCeilPrecision() {
        this.calculate = function(coordinates) {
            coordinates.X = Math.ceil(coordinates.X / 10) * 10;
            coordinates.Y = Math.ceil(coordinates.Y / 10) * 10;
            return coordinates;
        }
    };
     
    function customFloorPrecition(precision) {
        this.calculate = function(coordinates) {
            coordinates.X = Math.floor(coordinates.X / precision) * precision;
            coordinates.Y = Math.ceil(coordinates.Y / precision) * precision;
            return coordinates;
        }
    };

    function customCeilPrecition(precision) {
        this.calculate = function(coordinates) {
            coordinates.X = Math.ceil(coordinates.X / precision) * precision;
            coordinates.Y = Math.ceil(coordinates.Y / precision) * precision;
            return coordinates;
        }
    };

    var precision = new pixelPrecision();
    
    return {
        setPrecision: function(prs) {
            precision = prs;
        },
     
        calculate: function(coordinates) {
            return precision.calculate(coordinates);
        },

        pixelPrecision: pixelPrecision,
        tenthsFloorPrecision: tenthsFloorPrecision,
        tenthsCeilPrecision: tenthsCeilPrecision,
        customFloorPrecition: customFloorPrecition,
        customCeilPrecition: customCeilPrecition
    };
})();
},{}],12:[function(require,module,exports){
module.exports = (function XHRService() {

    var _xhr = function(method, url, data) {

        /*function progressHandler(e) {
            promise.notify(e);
        }*/

            var xhr = new XMLHttpRequest();

            function completeHandler(e) {
                removeHandlers();

                if (e.target.status === 200) {
                    var response;
                    if(e.target.response) {
                        response = JSON.parse(e.target.response);
                    }
                    return response;
                } else {
                    errorHandler(e);
                }
            }

            function errorHandler(e) {
                removeHandlers();

                var data;
                try {
                    data = JSON.parse(e.target.response);
                    data.error.message = ErrorMessageTranslator.formatMessage(data.error.code, data.error.message);
                } catch(err) {
                    if(data && data.error) data.error.message = e.target.status + ': ' + e.target.statusText;
                }
                
                return e;
            }

            function canceledHandler(e) {
                removeHandlers();
                promise.reject('Upload canceled.');
            }

            function removeHandlers() {
                //xhr.upload.removeEventListener('progress', progressHandler);
                xhr.removeEventListener('load', completeHandler);
                xhr.removeEventListener('error', errorHandler);
                xhr.removeEventListener('abort', canceledHandler);
            }


        var promise = new Promise(function (completeHandler, errorHandler) {
            //xhr.upload.addEventListener('progress', progressHandler, false);
            xhr.addEventListener('load', completeHandler, false);
            xhr.addEventListener('error', errorHandler, false);
            xhr.addEventListener('abort', canceledHandler, false);

            try {
                xhr.open(method, url);
            } catch(err) {
                removeHandlers();
                promise.reject(err);
                return promise;
            }

            /*if (RequestHeaders && RequestHeaders.Token) {
                xhr.setRequestHeader('token', RequestHeaders.Token);
            }*/

            if (!(data instanceof FormData)) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                data = JSON.stringify(data);
            }

            xhr.send(data);


        });

        return promise;
    };

    var GET = function(url, data) {
        return _xhr('GET', url, data);
    };

    var POST = function(url, data) {
        return _xhr('POST', url, data);
    };

    var DELETE = function(url, data) {
        return _xhr('DELETE', url, data);
    };

    var PATCH = function(url, data) {
        return _xhr('PATCH', url, data);
    };

    var PUT = function(url, data) {
        return _xhr('PUT', url, data);
    };

    return {
        GET: GET,
        POST: POST,
        PUT: PUT,
        DELETE: DELETE,
        PATCH: PATCH
    };
})();
},{}]},{},[1]);
