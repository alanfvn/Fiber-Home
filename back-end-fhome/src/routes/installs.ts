
import express from 'express' 
import Install from '../models/install'
import { verifyToken } from '../jwt/jwt-man'
import { get_installs, upsert_install } from '../db/db_man'

const installs = express.Router()

installs.use((req, res, next)=>{
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
installs.get('/list', async (req, res)=>{
  const { filter, not_done } =  req.query 
  const search = `${filter||''}`
  const no_done = not_done === "true"
  const installs = await get_installs(search, no_done)
  res.json(installs)
})

//update 
installs.post('/upsert', async (req,res)=>{
  const {payload, ...data} = req.body || {}
  const install = new Install(data)
  if(install.install_sell === -1){
    res.status(400).send("Invalid request you must specify the sell id")
    return 
  }
  const {log_text}= await upsert_install(install) || {}
  res.json({message: log_text})
})


export default installs
