var name = 'src.dashboard.scenario';

angular.module(name, [
        require('./scenario-edit/module'),
        'heatmap'
    ])
    .controller('ScenarioController', require('./scenario-controller'))
    .controller('AddScenarioController', require('./add-scenario/add-scenario-controller'));

module.exports = name;