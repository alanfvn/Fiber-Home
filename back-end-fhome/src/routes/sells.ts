import express from 'express' 
import User from '../models/user'
import { verifyToken } from '../jwt/jwt-man'
import { create_sell, delete_sell, get_sells } from '../db/db_man'

const sells = express.Router()
const NO_PERM = "No tienes permiso para acceder a este recurso"

sells.use((req, res, next)=>{
  const token = `${req.header('Authorization')?.replace('Bearer ', '')}`
  const payload = verifyToken(token)
  if(!payload){
    res.status(401).send("Token invalido")
    return
  }
  req.body.payload = (payload as any)
  next()
})

//user list
sells.get('/list', async (req, res)=>{
  const { filter, not_programmed } =  req.query 
  const search = `${filter||''}`
  const no_prog = not_programmed === "true"
  const data = await get_sells(search, no_prog)
  res.json(data)
})

//update 
sells.post('/create', async (req,res)=>{
  const {
    contract_start_date, contract_end_date, payload,
    ...newData
  } = req.body || {}
  const user = new User(newData)
  if(user.get_invalids().length > 0 || (!contract_start_date || !contract_end_date)){
    res.status(400).send("Invalid request you must specify all parameters")
    return
  }
  const {cid} = await create_sell(payload.uid, contract_start_date, contract_end_date, user) || {}
  res.json({"uid": cid});
})

//delete
sells.delete('/delete', async(req, res)=>{
  const {sell_id} = req.body || {}
  if(!sell_id){
    res.status(400).send("Invalid request you must specify all parameters")
    return
  }
  await delete_sell(sell_id)
  res.json({"message": "OK"})
})


export default sells
