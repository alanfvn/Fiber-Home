import jwt, {Secret} from 'jsonwebtoken'
import AuthenticatedUser from '../models/user_auth'

const EXP_TIME = 60*5
const SECRET_KEY: Secret = `${process.env.JWT_KEY}` 

function createToken(user: AuthenticatedUser){
  const{ ...data } = user;

  const token = jwt.sign(
    data, 
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
