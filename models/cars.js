const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');

const Cars = sequelize.define('cars',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type:DataTypes.STRING},
    price:{type:DataTypes.INTEGER},
    year:{type:DataTypes.STRING},
})

module.exports = {Cars}