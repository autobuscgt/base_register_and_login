export const generateJWT = (login,role) => {
    return jwt.sign({login,role},process.env.SECRET_KEY,{expiresIn:'24h'})
}
