const {Sequelize} = require('sequelize')

module.exports = new Sequelize('exam','postgres','0000',{dialect:'postgres'})