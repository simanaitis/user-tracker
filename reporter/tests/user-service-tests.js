describe('User service', function() {

    var UserService,
        $q,
        deferred,
        $rootScope,
        CoreServiceMock,
        CookieServiceMock;


    beforeEach(function() {
        angular.mock.module(require('../app/src/utils/module'));

        CoreServiceMock = {
            signIn: function() {
                deferred = $q.defer();
                return deferred.promise;
            }
        };

        CookieServiceMock = {
            createCookie: function() {}
        }

        angular.mock.module(function ($provide) {
            $provide.value('CoreService', CoreServiceMock);
            $provide.value('CookieService', CookieServiceMock);
        });

        spyOn(CookieServiceMock, 'createCookie');
    });

    beforeEach(inject(function (_UserService_, _$q_, _$rootScope_) {
        UserService = _UserService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it('should be defined', function () {
        expect(UserService).toBeDefined();
    });

    it('should get user model', function () {
        expect(UserService.getModel()).toBeDefined();
    });

    it('should get user model', function () {
        UserService.signInUser();
        deferred.resolve({id: 'userId'});
        $rootScope.$apply();

        expect(CookieServiceMock.createCookie).toHaveBeenCalled();
    });
});
