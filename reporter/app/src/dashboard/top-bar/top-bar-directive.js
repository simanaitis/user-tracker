module.exports = function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        controller: 'TopBarController',
        controllerAs: 'vm',
        templateUrl: 'app/src/dashboard/top-bar/top-bar.html'
    };
};