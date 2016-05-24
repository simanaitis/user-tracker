module.exports = function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            scenario: '=',
            createEmpty: '=',
            onChange: '='
        },
        bindToController: {
            scenario: '=',
            createEmpty: '='
        },
        controller: 'ScenarioEditController',
        controllerAs: 'vm',
        templateUrl: 'app/src/dashboard/scenario/scenario-edit/scenario-edit.html',
        link: function(scope, el) {
            el.on('input change', function() {
                scope.$applyAsync(function() {
                    console.log('oncahnge', scope.onChange);
                    if (scope.onChange) scope.onChange(scope.scenario);
                });
            });
        }
    };
};