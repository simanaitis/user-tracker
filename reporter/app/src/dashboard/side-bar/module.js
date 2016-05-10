var name = 'src.dashboard.side-bar';

angular.module(name, [])
    .directive('uxSideBar', require('./side-bar-directive'));

module.exports = name;