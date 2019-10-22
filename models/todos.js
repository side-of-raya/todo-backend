module.exports = (Sequelize, DataTypes) => {
  const todos = Sequelize.define('todos', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    value: {    
      type: DataTypes.STRING,
    },
    is_checked: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  });
  return todos;
}