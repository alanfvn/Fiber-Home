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

async function upsert_user(user: User){
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

async function get_users(search: string, staff: boolean){
  let client
  let data

  let query = `select * from tb_users 
where user_group ${staff ? "!=" : "="} 4 
and (user_name = coalesce($1, user_name) 
or concat(names,' ', surnames) ilike concat('%', $1, '%'));` 

  try{
    client = await conPool.connect()
    data = await client.query(query, [search]);
  }catch(e){
    console.log(`Error ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows
}

async function delete_user(uid: number){
  let client
  let data = {'message': ''}
  try{
    client = await conPool.connect()
    await client.query("delete from tb_users where user_id = $1", [uid])
    data['message'] = 'OK';
  }catch(e){
    console.log(`Error deleting user: ${e}`)
    data['message'] = `ERROR: ${e}`
  }finally{
    client?.release()
  }
  return data
}

export { login, upsert_user, get_users, delete_user}
