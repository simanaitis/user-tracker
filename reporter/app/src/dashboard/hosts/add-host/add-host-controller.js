module.exports = ['$q', '$uibModalInstance', 'CoreService', 'Config', function ($q, $uibModalInstance, CoreService, Config) {

    var vm = this;

    vm.host = {
        scenarios: [{
        }]
    };

    vm.onHostSubmit = function () {
        var scenarios = vm.host.scenarios.splice(0);
        vm.host.scenarios.length = 0;

        return CoreService.createHost(vm.host)
            .then(
                function(host) {
                    vm.host = host;

                    var deferred = $q.defer(),
                        promise = deferred.promise;

                    scenarios.forEach(function(scenario) {
                        promise = promise.then(function() {
                            return CoreService.createScenario(host, scenario);
                        });
                    });

                    deferred.resolve();
                    return promise;
                },
                function() {
                    alertify.error('Failed to create host.');
                }
            )
            .then(
                function() {
                    $uibModalInstance.close(vm.host);
                },
                function() {
                    alertify.error('Scenario data is not valid.');
                }
            );
    };

    vm.hostRegex = '[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
}];