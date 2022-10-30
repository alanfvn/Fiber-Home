import express from 'express' 
import User from '../models/user'
import { verifyToken } from '../jwt/jwt-man'
import {create_staff} from '../db/db_man'

const users = express.Router()

users.use((req, res, next)=>{
  const token = `${req.header('Authorization')?.replace('Bearer ', '')}`
  const payload = verifyToken(token)
  if(!payload){
    res.status(403).send("Token invalido")
    return
  }
  req.body.payload = (payload as any).username;
  next()
})

users.post('/upsert_user', async (req,res)=>{
  const {
    user_name, user_group, user_password, 
    names, surnames, phone, 
    dpi, email, address,
    date_of_birth 
  } = req.body || {}

  if(!user_name || !user_group || !user_password || 
    !names && !surnames || !phone || 
    !dpi || !email || !address || !date_of_birth) {
    res.status(400).send("Invalid request you must specify all parameters")
    return
  }

  const user = new User({
    user_name, user_group, user_password, 
    names, surnames, phone,dpi,
    email, address, date_of_birth 
  })
  const {log_data} = await create_staff(user) || {}
  res.json({"message": log_data});
})

users.get('/user_list', async (req, res)=>{

  res.json({})
})

export default users
