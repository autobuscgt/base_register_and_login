const sequelize = require('../config/db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('users',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    login:{type:DataTypes.STRING},
    password:{type:DataTypes.STRING},
    role:{type:DataTypes.ENUM('ADMIN','USER'),defaultValue:'USER'},
})
module.exports = {User}