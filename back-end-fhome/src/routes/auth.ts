import express from 'express' 
import { login } from '../db/db_man'
import { createToken } from '../jwt/jwt-man'
import AuthenticatedUser from '../models/user_auth'

const auth = express.Router()


auth.post('/login', async (req,res)=>{

  const {user, pass} = req.body || {}

  if(!user || !pass){
    res.status(400).send("Invalid request you must specify user and password")
    return
  }

  const data = await login(user, pass) || {}

  if(Object.keys(data).length === 0){
    res.status(401).send('The user and password are invalid')
    return
  }

  const loginData = new AuthenticatedUser(data);
  const token = createToken(loginData);

  res.status(201).json({
    'jwt': token, 
    'user_info': loginData 
  })
})


export default auth
