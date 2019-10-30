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
      references: {
        model: 'users',
        key: 'id'
      }
    },
    value: {    
      type: DataTypes.STRING,
    },
    is_checked: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    queue_number: {
      type: DataTypes.INTEGER,
    }
  },
  {
    timestamps: false
  });
  return todos;
}