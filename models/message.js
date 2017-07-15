'use strict';
module.exports = function(sequelize, DataTypes) {
  var message = sequelize.define('message', {
    content: DataTypes.STRING(140),
    userId: DataTypes.INTEGER,
    author: DataTypes.STRING(140),
    timestamp: DataTypes.STRING,
    likedBy: DataTypes.ARRAY(DataTypes.STRING),
    likeCount: DataTypes.INTEGER


  });
  message.associate = function (models) {
    message.belongsTo(models.user, { foreignKey: 'userId'});
    message.hasMany(models.like);
  }
  return message;
};

 