module.exports = function() {

    var COOKIE_TIME_LONG = new Date().setYear(new Date().getYear() + 1901),
        COOKIE_TIME_SHORT = new Date().setHours(new Date().getHours() + 1),

        EVENTS = ['click', 'dblclick', 'resize'/*, 'startscreen'*/, 'focus', 'dragstart', 'drop', 'scroll', 'change'],

        SCREENS = [
            {
                value: '<600',
                low: 0,
                high: 600
            }, {
                value: 800,
                low: 600,
                high: 800
            }, {
                value: 1024,
                low: 800,
                high: 1024
            }, {
                value: 1280,
                low: 1024,
                high: 1280
            }, {
                value: 1366,
                low: 1280,
                high: 1366
            }, {
                value: 1440,
                low: 1366,
                high: 1440
            }, {
                value: 1600,
                low: 1440,
                high: 1600
            }, {
                value: 1920,
                low: 1600,
                high: 1920
            },
            {
                value: '>1920',
                low: 1920,
                high: Number.MAX_SAFE_INTEGER
            }];

    return {
        COOKIE_TIME_LONG: COOKIE_TIME_LONG,
        COOKIE_TIME_SHORT: COOKIE_TIME_SHORT,

        EVENTS: EVENTS,

        SCREENS: SCREENS,

        BASE_URL: 'http://localhost:3001/api/'
    }
};