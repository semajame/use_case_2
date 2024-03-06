const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    productname: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    productcategory: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    isactive: { type: DataTypes.STRING, allowNull: true },
  };

  const options = {
    defaultScope: {},
    scopes: {},
  };

  return sequelize.define("Product", attributes, options);
}
