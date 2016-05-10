module.exports = ['Config', function (Config) {

    var vm = this;

    vm.eventsToTrack = Config.EVENTS;

    console.log(vm.createEmpty);
    if (vm.createEmpty) createEmptyScenario();

    function createEmptyScenario() {
        var defaultScenarioSettings = {
            status: true,
            name: 'New scenario',
            trackDuration: 60,
            trackPercentage: 10,
            amountToTrack: 50,
            eventsToTrack: [Config.EVENTS[0]],
            startDate: new Date(),
            endDate: new Date().setMonth(new Date().getMonth() + 1)
        };

        function getEndDate() {
            var time = new Date();
            time.setDate(time.getDate()+30);

            return time;
        }

        Object.assign(vm.scenario, defaultScenarioSettings);
    }
}];