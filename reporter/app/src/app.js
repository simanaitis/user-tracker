angular
    .module('myApp',
        [
            'chart.js', 'templates', 'ui.router', 'angular-maps', 'angularModalService', 'ui.bootstrap', 'btorfs.multiselect',
            require('./dashboard/module'), require('./dashboard/details/module'), require('./utils/module')
        ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);

        $stateProvider
            .state('front-page', {
                name: 'front-page',
                url: '/',
                templateUrl: 'app/src/front-page/front-page.html'
            })
            .state('about', {
                name: 'about',
                url: '/about',
                templateUrl: 'app/src/front-page/about-page/about-page.html'
            })
            .state('dashboard', {
                abstract: true,
                templateUrl: 'app/src/dashboard/dashboard.html',
                controller: 'MainController',
                resolve: {
                    singIn: function (UserService) {
                        return UserService.checkIfCookieIsValid();
                    }
                }
            })
            /*.state('dashboard.overview', {
                url: '/overview',
                templateUrl: 'app/src/dashboard/overview/overview.html',
                controller: 'MainController'
            })*/
            .state('dashboard.hosts', {
                url: '/hosts',
                templateUrl: 'app/src/dashboard/hosts/hosts.html',
                controller: 'HostsController as vm'
            })
            .state('dashboard.host', {
                url: '/hosts/:hostId',
                templateUrl: 'app/src/dashboard/hosts/host/host.html',
                controller: 'HostController as vm'
            })
            .state('dashboard.scenario', {
                url: '/scenarios/:hostId/:scenarioId',
                templateUrl: 'app/src/dashboard/scenario/scenario.html',
                controller: 'ScenarioController as vm'
            })
            .state('dashboard.details', {
                url: '/details',
                templateUrl: 'app/src/dashboard/details/details.html',
                controller: 'DetailsController as vm'
            });

        /*$urlRouterProvider.when('/', {
         templateUrl: 'app/src/dashboard/dashboard.html'
         controller: 'MainController'
         });*/
    })
    .run(['$rootScope', 'UserService', '$state', function ($rootScope, UserService, $state) {
        /*
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.name !== 'login' && !UserService.getModel().userId) {
             event.preventDefault();
             $state.go('login');
             }
        });*/
    }])
    .controller('MainController', [function () {

    }])
    .controller('SignController', require('./front-page/sign/sign-controller.js'))