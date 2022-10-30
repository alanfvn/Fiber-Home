import {Pool} from 'pg'
import User from '../models/user'

const conPool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false
    }
});


async function login(user: string, pass: string){
  let data
  let client 
  try{
    client = await conPool.connect()
    data = await client.query("select * from auth_user($1, $2)", [user, pass])
  }catch(e){
    console.log(`Login error: ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows[0]
}

async function create_staff(user: User){
  let client 
  let data

  const params = [...Object.values(user), '']

  try{
    client = await conPool.connect()
    data = await client.query('call upsert_user($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params) 
  }catch(e){
    console.log(`Error create staff: ${e}`)
  }finally{
    client?.release()
  }

  return data?.rows[0]
}



export { login, create_staff }
