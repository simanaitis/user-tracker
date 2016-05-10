module.exports = ['CookieService', '$q', 'Config', '$http', function (CookieService, $q, Config, $http) {

    var model = {};

    var getModel = function() {
        return model;
    };

    var signInUser = function (name, password, remmember) {
        return $http.post(Config.BASE_URL + 'Users/login', {
            username: name,
            password: password
        }).then(
            function(resp) {
                var cookieDuration = remmember ? Config.COOKIE_TIME_LONG : Config.COOKIE_TIME_SHORT;
                _handleAuthSuccess(resp.data, cookieDuration);
            },
            function() {
                return $q.reject('Username or password was incorrect.');
            }
        );
    };

    var signUpUser = function (name, password, email, remmember) {
        return $http.post(Config.BASE_URL + 'Users', {
            username: name,
            password: password,
            email: email
        }).then(
            function() {
                var cookieDuration = remmember ? Config.COOKIE_TIME_LONG : Config.COOKIE_TIME_SHORT;

                $http.post(Config.BASE_URL + 'Users/login', {
                    username: name,
                    password: password
                }).then(
                    function(resp) {
                        _handleAuthSuccess(resp.data, cookieDuration);
                    },
                    function() {
                        return $q.reject('Failed to create user.');
                    }
                );
            },
            function() {
                return $q.reject('Failed to create user.');
            }
        );
    };

    var signOutUser = function() {
        return $http.post(Config.BASE_URL + 'Users/logout?access_token=' + model.token).then(function() {
            CookieService.eraseCookie(CookieService.cookieName);
            for (var prop in model) delete model[prop];

            alertify.success('Farewell');
        });
    };

    function _handleAuthSuccess(data, cookieDuration) {
        data.token = data.id;
        delete data.id;

        Object.assign(model, data);
        
        CookieService.createCookie(CookieService.cookieName, JSON.stringify(data), cookieDuration);
        alertify.success('Welcome aboard');
    }

    var checkIfCookieIsValid = function () {
        var cookieInfo = CookieService.readCookie(CookieService.cookieName);

        if (cookieInfo) {
            Object.assign(model, JSON.parse(cookieInfo));
            return $q.when();
        } else {
            return $q.reject();
        }
    };

    return {
        getModel: getModel,

        signInUser: signInUser,
        signOutUser: signOutUser,
        signUpUser: signUpUser,

        checkIfCookieIsValid: checkIfCookieIsValid
    };
}];