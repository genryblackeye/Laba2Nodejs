const bcrypt = require("bcrypt")
const ApiError = require("./api-error.js")
const users = require("./db/db.js")
const jwt = require("jsonwebtoken")
const {secret} = require("./config")

const generateAccessToken = (id, roles) => {
    const payload1 =  {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class AuthService{
    async registraion(login, password, passwordConfirm){
        if(password!==passwordConfirm)
            throw ApiError.BadRequest("пароли не совпадают")
        const candidates = await users.findAll({
            where:{
                login
            }
        })
        if(candidates.length)
            throw ApiError.BadRequest("пользователь с данным логином уже существует")
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt)
        const user = await users.create({login,password})
        return {status:"ok"}
    }
    async auth(login,password){
        const candidate = await users.findOne({
            where:{
                login
            }
        })
        if(!candidate)
            throw ApiError.BadRequest("Пользователь с данным email не найден")
        if (!await bcrypt.compare(password,candidate.password))
            throw ApiError.BadRequest("не верный пароль")
        const access_token = generateAccessToken(candidate.id,candidate.password)
        return access_token
    }
}
module.exports = new AuthService()