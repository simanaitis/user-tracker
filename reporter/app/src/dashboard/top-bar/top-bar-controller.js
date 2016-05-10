module.exports = ['UserService', '$state', 'CoreService', function (UserService, $state, CoreService) {
    var vm = this;

    vm.signOut = function () {
        UserService.signOutUser();
        $state.go('front-page');
    };

    CoreService.getHosts().then(function(hosts) {
        vm.hosts = hosts;

        vm.hosts.forEach(function(host) {
            CoreService.getScenarios(host.id).then(
                function(scenarios) {
                    host.scenarios = scenarios;

                    host.activeScenario = scenarios.filter(function(scenario) {
                        return scenario.status;
                    })[0];

                    if (host.activeScenario) {
                        if (new Date().getTime() < new Date(host.activeScenario.startDate).getTime()) {
                            host.progress = 0;
                        } else if (new Date().getTime() > new Date(host.activeScenario.endDate).getTime()) {
                            host.progress = 100;
                        } else {
                            host.progress = (new Date().getTime() - new Date(host.activeScenario.startDate).getTime()) * 100 /
                                (new Date(host.activeScenario.endDate).getTime() - new Date(host.activeScenario.startDate).getTime());

                            if (isFinite(host.progress)) {
                                host.progress = host.progress.toFixed(2);
                            } else {
                                host.progress = 100;
                            }
                        }
                    }
                }, function() {
                    host.scenarios = [];
                }
            );
        });

        function getDays(timeStamp) {
            return Math.round(Math.abs((timeStamp - new Date(2016).getTime())/(24*60*60*1000)));
        }
    });
}];