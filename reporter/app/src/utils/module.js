var name = 'src.utils';

angular.module(name, [])
    .factory('Config', require('./config.js'))
    .factory('CoreService', require('./core-service.js'))
    .factory('CookieService', require('./cookie-service.js'))
    .factory('UserService', require('./user-service.js'));

module.exports = name;