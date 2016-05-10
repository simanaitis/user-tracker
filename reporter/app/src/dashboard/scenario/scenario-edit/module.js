var name = 'src.dashboard.scenario.scenario-edit';

angular.module(name, [])
    .directive('uxScenarioEdit', require('./scenario-edit-directive'))
    .controller('ScenarioEditController', require('./scenario-edit-controller'));

module.exports = name;