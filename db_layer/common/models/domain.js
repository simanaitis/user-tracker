module.exports = function (Domain) {
  Domain.disableRemoteMethod('createChangeStream', true);
  Domain.disableRemoteMethod("count", true);
  Domain.disableRemoteMethod("exists", true);
  Domain.disableRemoteMethod("findById", true);
  Domain.disableRemoteMethod("findOne", true);
  Domain.disableRemoteMethod("update", true);
  Domain.disableRemoteMethod("updateAll", true);
  Domain.disableRemoteMethod("upsert", true);
  Domain.disableRemoteMethod("__count__TrackedUsers", true);
};
