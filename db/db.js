const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('nodejsdatabase', 'owner', 'mysql_owner', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Соединение с БД было успешно установлено')
} catch (e) {
    console.log('Невозможно выполнить подключение к БД: ', e)
}

const users = sequelize.define('user', {

    login: Sequelize.STRING,
    password: Sequelize.STRING,
}, {timestamps: false})
sequelize.sync({ alter: true })
module.exports = users;