'use strict';

module.exports = ['$http', 'UserService', 'Config', function ($http, UserService, Config) {

    var model = UserService.getModel();

    function returnData(resp) {
        return resp.data;
    }

    function formQuery() {
        return '?access_token=' + model.token;
    }

    // HOST
    var getHosts = function() {
        return $http.get(Config.BASE_URL + 'Domains' + formQuery()+ '&filter=' + escape(JSON.stringify({'where': {'ownerId': model.userId }}))).then(returnData);
    };

    var getHost = function(hostId) {
        return getHosts().then(function(resp) {
            var host = resp.filter(function(host) {
                return host.id === hostId;
            });

            return host.length && host[0] || null;
        });
    };

    var createHost = function(hostData) {
        hostData.ownerId = model.userId;

        return $http.post(Config.BASE_URL + 'Domains' + formQuery(), hostData).then(returnData);
    };


    var updateHost = function(host, hostData) {
        return $http.put(Config.BASE_URL + 'Domains/' + host.id + formQuery(), hostData).then(function(resp) {
            return Object.assign(host, resp.data);
        });
    };

    var deleteHost = function(host) {
        return $http.delete(Config.BASE_URL + 'Domains/' + host.id + formQuery());
    };


    // SCENARIOS
    var getScenarios = function(domainId) {
        return $http.get(Config.BASE_URL + 'Domains/' + domainId + '/scenario' + formQuery()).then(function(resp) {
            return resp.data.map(function(scenario) {
                scenario.startDate = new Date(scenario.startDate);
                scenario.endDate = new Date(scenario.endDate);
                return scenario;
            });
        });
    };

    var getScenario = function(hostId, scenarioId) {
        return $http.get(Config.BASE_URL + 'Domains/' + hostId + '/scenario/' + scenarioId + formQuery()).then(function(resp) {
            resp.data.startDate = new Date(resp.data.startDate);
            resp.data.endDate = new Date(resp.data.endDate);
            return resp.data;
        });
    };

    var createScenario = function(host, scenarioData) {
        scenarioData.domainId = host.id;

        return $http.post(Config.BASE_URL + 'Domains/' + host.id + '/scenario/' + formQuery(), scenarioData).then(function(resp) {
            host.scenarios = host.scenarios || [];
            host.scenarios.push(resp.data);
            return resp.data;
        });
    };

    var updateScenario = function(host, scenario, scenarioData) {
        scenarioData.domainId = host.id;

        return $http.put(Config.BASE_URL + 'Domains/' + host.id + '/scenario/' + scenario.id + formQuery(), scenarioData).then(function(resp) {
            Object.assign(scenario, resp.data);
            return resp.data;
        });
    };

    var deleteScenario = function(host, scenarioId) {
        return $http.delete(Config.BASE_URL + 'Domains/' + host.id + '/scenario/' + scenarioId + formQuery()).then(function(resp) {
            var scenarioToBeDeleted = host.scenarios.filter(function(scenario) { return scenario.id === scenarioId})[0],
                indexOfScenario = host.scenarios.indexOf(scenarioToBeDeleted);

            host.splice(indexOfScenario, 1);
        });
    };

    // VISITS
    var getVisit = function(visitId) {
        return $http.get(Config.BASE_URL + 'Vists/' + visitId + formQuery()).then(returnData);
    };

    var getEvents = function(domainId, filterData) {
        if (filterData) {
            filterData['events.domainId'] = domainId;
        } else {
            filterData = { 'events.domainId': domainId };
        }

        return $http.get(Config.BASE_URL + 'EventArrays' + formQuery() + '&filter=' + escape(JSON.stringify({'where': filterData}))).then(returnData);
    };

    var getExportEventsUrl = function(domainId) {
        return $http.get(Config.BASE_URL + 'EventArrays' + formQuery()
            + '&filter=' + escape(JSON.stringify({'where': { 'events.domainId': domainId }}))
            + '&download=true');
    };

    // TRACKED USERS
    var getTrackedUsers = function(domainId) {
        return $http.get(Config.BASE_URL + 'Domains/' + domainId + '/tracked_user' + formQuery()).then(returnData);
    };

    return {
        getHosts: getHosts,

        getHost: getHost,
        createHost: createHost,
        updateHost: updateHost,
        deleteHost: deleteHost,

        getScenarios: getScenarios,
        getScenario: getScenario,
        createScenario: createScenario,
        updateScenario: updateScenario,
        deleteScenario: deleteScenario,

        getVisit: getVisit,

        getEvents: getEvents,
        getExportEventsUrl: getExportEventsUrl,

        getTrackedUsers: getTrackedUsers
    };
}];