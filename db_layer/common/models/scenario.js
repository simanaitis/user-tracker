module.exports = function(Scenario) {
  Scenario.disableRemoteMethod('createChangeStream', true);
  Scenario.disableRemoteMethod("count", true);
  Scenario.disableRemoteMethod("exists", true);
  Scenario.disableRemoteMethod("findById", true);
  Scenario.disableRemoteMethod("findOne", true);
  Scenario.disableRemoteMethod("update", true);
  Scenario.disableRemoteMethod("updateAll", true);
  Scenario.disableRemoteMethod("upsert", true);
};
