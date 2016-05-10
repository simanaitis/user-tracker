module.exports = function(Event) {
  Event.disableRemoteMethod('createChangeStream', true);
  Event.disableRemoteMethod("count", true);
  Event.disableRemoteMethod("exists", true);
  Event.disableRemoteMethod("findById", true);
  Event.disableRemoteMethod("findOne", true);
  Event.disableRemoteMethod("update", true);
  Event.disableRemoteMethod("updateAll", true);
  Event.disableRemoteMethod("upsert", true);
};
