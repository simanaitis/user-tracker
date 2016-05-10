module.exports = ['$q', '$uibModalInstance', 'CoreService', '$stateParams', function ($q, $uibModalInstance, CoreService, $stateParams) {

    var vm = this,
        host;

    vm.scenario = {
        active: false
    };

    CoreService.getHost($stateParams.hostId).then(function(hostData) {
        host = hostData;
    });

    vm.onScenarioSubmit = function () {
        return CoreService.createScenario(host, vm.scenario)
            .then(function(scenario) {
                $uibModalInstance.close(scenario);
            });
    };
}];