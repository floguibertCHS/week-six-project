'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    messageId: DataTypes.FLOAT,
    userId: DataTypes.FLOAT,
    username: DataTypes.STRING
  });
  like.associate = function (models) {
    like.belongsTo(models.user, { foreignKey: 'userId'});
    like.belongsTo(models.message, { foreignKey: 'messageId'});

  }
  return like;
};

