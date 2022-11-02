import express from 'express' 
import User from '../models/user'
import { verifyToken } from '../jwt/jwt-man'
import { upsert_user, delete_user, get_users, search_staff } from '../db/db_man'
import { isAdmin, isSupervisor } from '../util/perms'

const users = express.Router()
const NO_PERM = "You don't have access to this resource"

users.use((req, res, next)=>{
  const token = `${req.header('Authorization')?.replace('Bearer ', '')}`
  const payload = verifyToken(token)
  if(!payload){
    res.status(401).send("Invalid token")
    return
  }
  req.body.payload = (payload as any)
  next()
})

//user list
users.get('/staff_list', async (req, res)=>{
  const {gid} = req.body.payload
  const search = `${req.query.filter||''}`
  if(!isAdmin(gid)){
    res.status(403).send(NO_PERM)
    return
  }
  const data = await get_users(search, true);
  res.json(data)
})

users.get('/client_list', async (req, res)=>{
  const {gid} = req.body.payload
  if(!isSupervisor(gid)){
    res.status(403).send(NO_PERM)
    return
  }
  const query = `${req.query.filter||''}`
  const data = await get_users(query, false);
  res.json(data)
})

users.get('/staff_names', async (req, res)=>{
  const search = `${req.query.filter||''}`
  const data = await search_staff(search)
  res.json(data)
})

//update and insert user
users.post('/upsert', async (req,res)=>{
  const {payload, user_id, ...userData} = req.body
  const user = new User(userData)
  if(user.get_invalids().length > 0){
    res.status(400).send("Invalid request you must specify all parameters")
    return
  }
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
