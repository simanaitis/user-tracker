module.exports = function(TrackedUser) {
  TrackedUser.disableRemoteMethod('createChangeStream', true);
  TrackedUser.disableRemoteMethod("count", true);
  TrackedUser.disableRemoteMethod("exists", true);
  TrackedUser.disableRemoteMethod("findById", true);
  TrackedUser.disableRemoteMethod("findOne", true);
  TrackedUser.disableRemoteMethod("update", true);
  TrackedUser.disableRemoteMethod("updateAll", true);
  TrackedUser.disableRemoteMethod("upsert", true);
};
