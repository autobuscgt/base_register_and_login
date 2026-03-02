const jwt = require('jsonwebtoken');
const SECRET_KEY = 'akjsfklafs';
module.exports = function(req,res,next){
    if(req.method === 'OPTIONS'){
        next()
    }
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Нет заголовка авторизации' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.send('no auth')
    }
    const decoded = jwt.verify(token,SECRET_KEY);
    if(!decoded){
        return res.send('no auth')
    }
    req.user = decoded;
    next();
}