module.exports = ['$uibModal', 'CoreService', '$stateParams', function ($uibModal, CoreService, $stateParams) {

    var vm = this;

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    CoreService.getTrackedUsers($stateParams.hostId).then(function(trackedUsers) {
        vm.series = trackedUsers
            .map(function(trackedUser) {
                return trackedUser.operatingSystem;
            })
            .filter(onlyUnique);

        vm.labels = trackedUsers
            .map(function(trackedUser) {
                return trackedUser.browserName;
            })
            .filter(onlyUnique);

        vm.data = [];

        vm.deleteScenario = function (scenarioId) {
            CoreService.deleteScenario({id:$stateParams.hostId, scenarios: vm.scenarios} ,scenarioId);
        };

        vm.updateScenario = function(scenarioId, scenario) {
            var indexOfChanged = vm.changed.indexOf(scenario.id);
            vm.changed.splice(indexOfChanged, 1);
            CoreService.updateScenario({id: $stateParams.hostId}, scenario, scenario);
        };

        vm.changed = [];
        vm.onChange = function(scenario) {
            vm.changed.push(scenario.id);
        };

        vm.isChanged = function(scenario) {
            return vm.changed.indexOf(scenario.id) !== -1;
        };

        vm.series.forEach(function(operatingSystem) {
            var data = [];
            vm.labels.forEach(function(browser) {
                var number = trackedUsers.filter(function(trackedUser) {
                    return trackedUser.operatingSystem === operatingSystem && trackedUser.browserName === browser;
                }).length;
                data.push(number);
            });

            vm.data.push(data);
        });
    });

    vm.onClick = function (points, evt) {
        console.log(points, evt);
    };

    //-----------------------------
    vm.hostId = $stateParams.hostId;

    CoreService.getHost($stateParams.hostId).then(function(hostData) {
        CoreService.getScenarios($stateParams.hostId).then(function(scenarios) {
            vm.scenarios = scenarios;
        });
    });

    vm.openAddNewScenarioModal = function() {
        $uibModal.open({
                animation: true,
                templateUrl: 'app/src/dashboard/scenario/add-scenario/add-scenario-modal.html',
                controller: 'AddScenarioController',
                controllerAs: "vm",
                size: 'lg'
            })
            .result.then(function(scenario) {
                vm.scenarios.push(scenario);
            }
        );
    };

    vm.toggleStatus = function(scenario) {
        scenario.status = !scenario.status;
    };
}];