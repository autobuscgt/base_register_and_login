const express = require('express')
const app = express()
const PORT = 7000;
const cors = require('cors');
const bcrypt = require('bcrypt')
const sequelize = require('./config/db')
const jwt = require('jsonwebtoken');
const { User } = require('./models/user');

const authMiddleware = require('./middleware/authMiddleware');
const checkRolemiddleware = require('./middleware/checkRolemiddleware');

app.use(cors())
app.use(express.json())

const generateJWT = (login,role) => {
    return jwt.sign({login,role},process.env.SECRET_KEY,{expiresIn:'24h'})
}

app.get('/admin_route',checkRolemiddleware('ADMIN'),(req,res)=>{
    return res.send('Administrator access');
})
app.get('/',authMiddleware,(req,res)=>{
    return res.send('hello from backend')
})
app.post('/register',async(req,res)=>{
    const {login,password,role} = req.body
    const candidate = await User.findOne({where:{login}})
    if(candidate){
        return res.send('Пользователь уже существует')
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({login,password:hashedPassword,role})
    const token = generateJWT(user.login,user.role)
    return res.send(token)
})
app.post('/login',async(req,res)=>{
    const {login,password} = req.body
    const candidate = await User.findOne({where:{login}})
    if(!candidate){
        return res.send('Не авторизован')
    }
    const isMatch = await bcrypt.compare(password,candidate.password)
    if(!isMatch){
        return res.send('Не совпадают пароли')
    }
    const token = generateJWT(candidate.login,candidate.role)
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