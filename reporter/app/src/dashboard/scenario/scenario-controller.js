module.exports = ['$uibModal', 'CoreService', '$stateParams', '$http', '$q', '$scope', '$timeout', 'Config', function ($uibModal, CoreService, $stateParams, $http, $q, $scope, $timeout, Config) {

    var vm = this,
        events;

    vm.paths = [];

    vm.screenWidths = Config.SCREENS;
    vm.config = {
        screenWidth: vm.screenWidths[3]
    };

    var infoPlacement = angular.element('#infoPlacement');

    var previuosEvent
    vm.onChange = function () {
        var isHeightDiferent = 0;
        vm.paths.length = 0;
        if (events.length) {
            events.forEach(function (event, index, array) {
                if (event.time >= vm.config.startDate && event.time <= vm.config.endDate) {
                    if (vm.paths.indexOf(event.path) === -1 && isScreenWidthCorrect(event)) {
                        vm.paths.push(event.path);
                    }
                }
                if (!isHeightDiferent && array.length != index && array[index+1]) {
                    isHeightDiferent = ((event.documentHeight - array[index+1].documentHeight) !== 0) ? true + 1 : 0;
                }
            });
            if(isHeightDiferent){
                //alertify.error('You are viewing dynamic page, be aware that heatmap points might be out of synch');
            }
            if (!vm.config.path) vm.config.path = vm.paths[0];
        } else {
            vm.config.path = null;
        }
    };

    function isScreenWidthCorrect(event) {
        return vm.config.screenWidth.low <= event.documentWidth && event.documentWidth < vm.config.screenWidth.high;
    }

    CoreService.getHost($stateParams.hostId).then(function(host) {
        vm.host = host;
    });

    CoreService.getScenario($stateParams.hostId, $stateParams.scenarioId).then(function(scenario) {
        vm.scenario = scenario;

        vm.config.startDate = scenario.startDate;
        vm.config.endDate = scenario.endDate;

        getEvents(vm.onChange);
        vm.search(true);
    });

    vm.search = function(skipGetEvents) {
        if (!skipGetEvents) {
            vm.generatingScreenshot = true;
            getEvents(generateScreenshot);
        }
        vm.loadComplete = false;
    };

    vm.getExportEventsUrl = function() {
        CoreService.getExportEventsUrl($stateParams.hostId);
    };

    function getEvents(callback) {
        CoreService.getEvents($stateParams.hostId, {}).then(function(eventsArray) {
            events = [].concat.apply([], eventsArray
                .map(function (eventsInfo) {
                    return eventsInfo.events;
                }))
                .filter(function (eventInfo) {
                    return eventInfo.type === 'click';
                });

            if (callback) callback();
        });
    }

    function prepareHeatMapData(imageWidth, imageHeight) {
        var map = {},
            max = 0,
            eventArray = [];

        function fixWidthHeight(event) {
            return event.positionX + 'x' + event.positionY;
            var positionX = event.positionX * imageWidth / event.documentWidth,
                positionY = event.positionY * imageHeight / event.documentHeight;
            return parseInt(positionX) + 'x' + parseInt(positionY);
        }

        events.forEach(function(event) {
            if (event.time >= vm.config.startDate && event.time <= vm.config.endDate && isScreenWidthCorrect(event)) {
                if (event.path === vm.config.path) {
                    var key = fixWidthHeight(event);

                    console.log( event.positionX + 'x' + event.positionY, key);
                    map[key] = map[key] ? map[key] + 1 : 1;
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
        vm.generatingScreenshot = true;

        var url = vm.host.host
            + (vm.config.path ? vm.config.path : '')
            + '&width=' + vm.config.screenWidth.high;

        return $http.get('/screenshot?url=' + url).then(function (resp) {
            if (resp.status && resp.data.status !== false) {
                vm.screenshotSrc = resp.data.base64;
                getWidthHeight(resp.data.base64);
            } else {
                return $q.reject('Failed to generate screenshot.');
            }
        });
    }

    vm.heatmapConfig = {
        blur: .9,
        opacity:.5
    };

    function getWidthHeight(base64) {
        var image = new Image();

        image.onload = function(){
            vm.generatingScreenshot = false;
            infoPlacement[0].style.width = image.width + 'px';
            infoPlacement[0].style.height = image.height + 'px';

            if (events.length) {
                debugger;
                vm.heatmapData = prepareHeatMapData(image.width, image.height);
            } else {
                //    ERROR NOTIFICATION
            }


            $timeout(function() {
                vm.enableHeatmap = false;
                $timeout(function() {
                    vm.enableHeatmap = true;
                });
            });
        };

        image.src = 'data:image/png;base64,' + base64;
    }
}];