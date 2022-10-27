import jwt, {Secret} from 'jsonwebtoken'

const EXP_TIME = 60*5
const SECRET_KEY: Secret = `${process.env.JWT_KEY}` 

function createToken(user: string){
  const token = jwt.sign(
    { username: user}, 
    SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: EXP_TIME 
    })
  return token
}

function verifyToken(token: string){
  let payload
  try{
    payload = jwt.verify(token, SECRET_KEY)
  }catch(e){
    payload = null
  }
  return payload
}

export {createToken, verifyToken}
