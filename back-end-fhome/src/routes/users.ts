import express from 'express' 
import User from '../models/user'
import { verifyToken } from '../jwt/jwt-man'
import {upsert_user, delete_user, get_users} from '../db/db_man'

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

//user list
users.get('/staff_list', async (req, res)=>{
  const query = `${req.query.filter||''}`
  const data = await get_users(query, true);
  res.json(data)
})

users.get('/client_list', async (req, res)=>{
  const query = `${req.query.filter||''}`
  const data = await get_users(query, false);
  res.json(data)
})

//update and insert user
users.post('/upsert', async (req,res)=>{
  const {
    user_name, user_group, user_password, 
    names, surnames, phone, 
    dpi, email, address,
    date_of_birth 
  } = req.body || {}

  if(!user_name || !user_group || 
    !names || !surnames || !phone || 
    !dpi || !email || !address || !date_of_birth) {
    res.status(400).send("Invalid request you must specify all parameters")
    return
  }

  const user = new User({
    user_name, user_group, user_password, 
    names, surnames, phone,dpi,
    email, address, date_of_birth 
  })
  const {log_data} = await upsert_user(user) || {}
  res.json({"message": log_data});
})

//delete user
users.delete('/delete', async (req, res)=>{
  const {uid} = req.body
  if(!uid){
    res.status(400).send("Invalid request you must specify the user id")
    return
  }
  const message = await delete_user(uid) 
  res.json(message)
})

export default users
