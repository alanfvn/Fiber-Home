import dotenv from 'dotenv'
dotenv.config()

import express, {Express} from 'express'
import cors from 'cors'

const app: Express = express()
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(port, ()=>{
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})
