import dotenv from 'dotenv'
dotenv.config()

import express, {Express} from 'express'
import cors from 'cors'
import auth from './routes/auth'
import users from './routes/users'
import sells from './routes/sells'
import installs from './routes/installs'

const app: Express = express()
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//endpoints
app.use('/auth',auth)
app.use('/user', users)
app.use('/sells', sells)
app.use('/installs', installs)

app.listen(port, ()=>{
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})
