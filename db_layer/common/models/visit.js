module.exports = function(Visit) {
  Visit.disableRemoteMethod('createChangeStream', true);
  Visit.disableRemoteMethod("count", true);
  Visit.disableRemoteMethod("exists", true);
  Visit.disableRemoteMethod("findById", true);
  Visit.disableRemoteMethod("findOne", true);
  Visit.disableRemoteMethod("update", true);
  Visit.disableRemoteMethod("updateAll", true);
  Visit.disableRemoteMethod("upsert", true);
};
