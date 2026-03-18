require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 7000;
const cors = require('cors');
const bcrypt = require('bcrypt')
const sequelize = require('./config/db')
const { User } = require('./models/user');

const authMiddleware = require('./middleware/authMiddleware');
const checkRolemiddleware = require('./middleware/checkRolemiddleware');
const { Cars } = require('./models/cars');
const { generateJWT } = require('./middleware/jwtFunction');

app.use(cors())
app.use(express.json())

// ============ ФУНКЦИЯ ГЕНЕРАЦИИ ТОКЕНА =============== //

const generateJWT = (login,role) => {
    return jwt.sign({login,role},process.env.SECRET_KEY,{expiresIn:'24h'})
}


// ================= БАЗОВЫЕ МАРШРУТЫ ================= //

//Добавление транспорта
app.post('/cars',checkRolemiddleware('ADMIN'),async(req,res)=>{
    const {name,year,price} = req.body;
    await Cars.create({name,year,price});
    return res.send('Машина успешно добавлена')
});

//Удаление объекта по ID
app.delete('/cars/:id',checkRolemiddleware('ADMIN'),async(req,res)=>{
    const {id} = req.params;
    const candidate = await Cars.findByPk(id)
    if(!candidate){return req.send('Не найдено')}
    await candidate.destroy()
    return res.send('Машина успешно добавлена')
});

//Обновление объекта по ID
app.put('/cars/:id',checkRolemiddleware('ADMIN'),async(req,res)=>{
    const {id} = req.params
    const {name,year,price} = req.body;
    const candidate = await Cars.findByPk(id)
    if(!candidate){return req.send('Не найдено')}
    await candidate({name,year,price})
    return res.send('Машина успешно обновлена')
});

//Получение всех объектов
app.get('/cars',authMiddleware, async(req,res)=>{
    const cars = await Cars.findAll();
    return res.send(cars)
})

//Получение одного объекта по ID
app.get('/cars/:id',authMiddleware, async(req,res)=>{
    const {id} = req.params;
    const candidate = await Cars.findByPk(id);
    if(!candidate){
        return res.status(404).json({message:'Не найдено'})
    }
    return res.send(candidate);
})


// ================= АВТОРИЗАЦИЯ/РЕГИСТРАЦИЯ ================= //
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