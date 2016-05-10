var name = 'src.dashboard';

angular.module(name, [
    require('./top-bar/module'),
    require('./side-bar/module'),
    require('./hosts/module'),
    require('./scenario/module')
]);

module.exports = name;