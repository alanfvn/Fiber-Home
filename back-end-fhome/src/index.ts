import dotenv from 'dotenv'
dotenv.config()

import express, {Express} from 'express'
import cors from 'cors'
import auth from './routes/auth'
import users from './routes/users'
import sells from './routes/sells'

const app: Express = express()
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//endpoints
app.use('/auth',auth)
app.use('/user', users)
app.use('/sell', sells)

app.listen(port, ()=>{
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})
