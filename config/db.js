const {Sequelize} = require('sequelize')

module.exports = new Sequelize('userValidator','postgres','0000',{dialect:'postgres'})