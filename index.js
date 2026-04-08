require('dotenv').config()

const express = require('express')
const app = express()
const PORT = 7000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const models = require('./models/models');
const {User} = require('./models/models')

const jwt = require('jsonwebtoken')
const authMiddleware = require('./middleware/authMiddleware');
const checkRolemiddleware = require('./middleware/checkRolemiddleware');

app.use(cors())
app.use(express.json())

const generateJWT = (email,role) => {
    return jwt.sign({email,role},process.env.SECRET_KEY,{expiresIn:'24h'})
}

// ================= МАРШРУТЫ ================= //



// ================= АВТОРИЗАЦИЯ/РЕГИСТРАЦИЯ ================= //
app.post('/register',async(req,res)=>{
    const {email,password,role,name} = req.body
    const candidate = await User.findOne({where:{email}})
    if(candidate){
        return res.send('Пользователь уже существует')
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({email,password:hashedPassword,role,name})
    const token = generateJWT(user.email,user.role)
    return res.send(token)
})

app.post('/login',async(req,res)=>{
    const {email,password} = req.body
    const candidate = await User.findOne({where:{email}})
    if(!candidate){
        return res.send('Не авторизован')
    }
    const isMatch = await bcrypt.compare(password,candidate.password)
    if(!isMatch){
        return res.send('Не совпадают пароли')
    }
    const token = generateJWT(candidate.email,candidate.role)
    return res.send(token)
})

async function start() {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT,()=> {
        console.log(`server: http://localhost:${PORT}`);
    })
}
start()