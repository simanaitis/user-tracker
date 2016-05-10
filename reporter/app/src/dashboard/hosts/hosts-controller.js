module.exports = ['$rootScope', 'CoreService', '$uibModal', function ($rootScope, CoreService, $uibModal) {

    var vm = this;

    CoreService.getHosts().then(function(hosts) {
        vm.hosts = hosts;

        vm.hosts.forEach(function(host) {
            CoreService.getScenarios(host.id).then(
                function(scenarios) {
                    host.scenarios = scenarios;
                    assignActiveScenario(host);
                }, function() {
                    host.scenarios = [];
                }
            );
        });
    });

    vm.openAddNewScenarioModal = function() {
        $uibModal.open({
                animation: true,
                templateUrl: 'app/src/dashboard/hosts/add-host/add-host-modal.html',
                controller: 'AddHostController',
                controllerAs: "vm",
                size: 'lg'
            })
            .result.then(function(host) {
                assignActiveScenario(host);
                vm.hosts.push(host);
            }
        );
    };

    vm.deleteHost = function(host) {
        var scope = $rootScope.$new();
        scope.title = 'Delete.';
        scope.content = 'Do you really want to delete this host?';

        $uibModal.open({
            animation: true,
            templateUrl: 'app/src/utils/modal/confirmation-modal.html',
            size: 'md',
            scope: scope,
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.$uibModalInstance = $uibModalInstance;
            }]
        })
            .result.then(function(shouldDelete) {
                if (shouldDelete) {
                    CoreService.deleteHost(host).then(function() {
                        var indexToBeRemoved = vm.hosts.indexOf(host);

                        vm.hosts.splice(indexToBeRemoved, 1);
                    });
                }
            });
    };

    vm.disableHost = function(host) {
        var scope = $rootScope.$new();
        scope.title = 'Disable.';
        scope.content = 'Do you really want to disable active scenario in this host?';

        $uibModal.open({
                animation: true,
                templateUrl: 'app/src/utils/modal/confirmation-modal.html',
                size: 'md',
                scope: scope,
                controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                    $scope.$uibModalInstance = $uibModalInstance;
                }]
            })
            .result.then(function(shouldDisable) {
                if (shouldDisable) {
                    var data = JSON.parse(JSON.stringify(host.activeScenario));
                    data.status = false;

                    CoreService.updateScenario(host, host.activeScenario, data).then(function() {
                        host.activeScenario = null;
                    });
                }
        });
    };

    function getActiveScenario(scenarios) {
        var activeScenario = scenarios.filter(function(scenario) {
            return scenario.status;
        });

        return activeScenario.length ? activeScenario[0] : null;
    }

    function assignActiveScenario(host) {
        host.activeScenario = getActiveScenario(host.scenarios);
    }
}];