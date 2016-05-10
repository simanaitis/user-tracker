module.exports = ['$uibModal', 'CoreService', '$stateParams', '$http', '$q', '$scope', '$timeout', 'Config', function ($uibModal, CoreService, $stateParams, $http, $q, $scope, $timeout, Config) {

    var vm = this,
        events;

    vm.paths = [];

    vm.screenWidths = Config.SCREENS;
    vm.config = {
        screenWidth: vm.screenWidths[3]
    };

    CoreService.getHost($stateParams.hostId).then(function(host) {
        vm.host = host;
    });

    CoreService.getScenario($stateParams.hostId, $stateParams.scenarioId).then(function(scenario) {
        vm.scenario = scenario;

        vm.config.startDate = scenario.startDate;
        vm.config.endDate = scenario.endDate;

        CoreService.getEvents($stateParams.hostId, {}).then(function(eventsArray) {
            events = [].concat.apply([], eventsArray
                .map(function(eventsInfo) { return eventsInfo.events; }))
                .filter(function(eventInfo) { return eventInfo.type === 'click'; });

            vm.search();
        });
    });

    vm.search = function() {
        vm.loadComplete = false;

        generateScreenshot();
        if (events.length) {
            vm.config.path = events[0].path;
            vm.heatmapData = prepareHeatMapData();
        } else {
        //    ERROR NOTIFICATION
        }
    };

    function prepareHeatMapData() {
        var map = {},
            max = 0,
            eventArray = [];

        function isScreenWidthCorrect(event) {
            return vm.config.screenWidth.low <= event.documentWidth < vm.config.screenWidth.high;
        }

        events.forEach(function(event) {
            if (event.time >= vm.config.startDate && event.time <= vm.config.endDate) {
                if (event.path === vm.config.path && isScreenWidthCorrect(event)) {
                    var key = event.positionX + 'x' + event.positionY;

                    map[key] = map[key] ? map[key] + 1 : 1;

                    if (vm.paths.indexOf(event.path) === -1) {
                        vm.paths.push(event.path);
                    }
                }
            }
        });

        for (var position in map) {
            if (max < map[position]) max = map[position];

            var coords = position.split('x');

            eventArray.push({
                x: coords[0],
                y: coords[1],
                value: map[position]
            })
        }

        $timeout(function() {
            vm.loadComplete = true;
        });
        return {
            min: 0,
            max: max,
            data: eventArray
        };
    }

    function generateScreenshot() {
        return $http.get('/screenshot?url=' + vm.host.host/* + vm.pathUrl*/ + '&width=' + vm.screenWidth).then(function (resp) {
            if (resp.status && resp.data.status !== false) {
                vm.screenshotSrc = resp.data.base64;
            } else {
                return $q.reject('Failed to generate screenshot.');
            }
        });
    }

    vm.heatmapConfig = {
        blur: .9,
        opacity:.5
    };
}];