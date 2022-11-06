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
app.use('/api/auth',auth)
app.use('/api/user', users)
app.use('/api/sells', sells)
app.use('/api/installs', installs)

app.listen(port, ()=>{
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})
