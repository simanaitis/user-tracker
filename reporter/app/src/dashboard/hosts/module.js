var name = 'src.dashboard.hosts';

angular.module(name, [])
    .controller('HostsController', require('./hosts-controller'))
    .controller('HostController', require('./host/host-controller'))
    .controller('AddHostController', require('./add-host/add-host-controller'));

module.exports = name;