module.exports = function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            scenario: '=',
            createEmpty: '='
        },
        bindToController: {
            scenario: '=',
            createEmpty: '='
        },
        controller: 'ScenarioEditController',
        controllerAs: 'vm',
        templateUrl: 'app/src/dashboard/scenario/scenario-edit/scenario-edit.html'
    };
};