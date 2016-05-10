var name = 'src.dashboard.top-bar';

angular.module(name, [])
    .directive('uxTopBar', require('./top-bar-directive'))
    .controller('TopBarController', require('./top-bar-controller'));

module.exports = name;