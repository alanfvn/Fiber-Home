import {Pool} from 'pg'
import Install from '../models/install'
import User from '../models/user'

const conPool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

//functions
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

async function search_staff(query: string){
  let data
  let client 
  try{
    client = await conPool.connect()
    data = await client.query("select * from search_staff($1)", [query])
  }catch(e){
    console.log(`Search error: ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows
}

//users
async function upsert_user(user: User){
  let client 
  let data
  const params = [...Object.values(user), '']

  try{
    client = await conPool.connect()
    data = await client.query("call upsert_user($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::timestamp at time zone 'cst', $11)", params) 
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

  let query = `select * from users 
where user_group ${staff ? "!=" : "="} 4 
and (user_name = coalesce($1, user_name) 
or concat(names,' ', surnames) ilike $1);` 
  try{
    client = await conPool.connect()
    data = await client.query(query, [`%${search}%`]);
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

// sells
async function create_sell(seller: number, start: Date, end: Date,user: User){
  let client
  let data 
  const params = [seller, start, end, ...Object.values(user), null]

  try{
    client = await conPool.connect()
    data = await client.query(
      "call create_sell($1, $2::timestamp at time zone 'cst', $3::timestamp at time zone 'cst', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::timestamp at time zone 'cst', $14::uuid)"
      , params)
  }catch(e){
    console.log(`ERROR Creating sell: ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows[0]
}

async function get_sells(search: string, unprogrammed: boolean){
  let client 
  let data
  let query = `select * from sells where ${unprogrammed ? "install_worker is null and " : ""}(seller ilike $1 or client ilike $1)`
  try{
    client = await conPool.connect()
    data = await client.query(query, [`%${search}%`])
  }catch(e){
    console.log(`ERROR getting sells: ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows
}

async function delete_sell(id: number){
  let client 
  try{
    client = await conPool.connect()
    await client.query('delete from tb_sells where sell_id = $1', [id])
  }catch(e){
    console.log(`ERROR getting sells: ${e}`)
  }finally{
    client?.release()
  }
}
//installs
async function upsert_install(idata: Install){
  let client 
  let data
  const params = [...Object.values(idata), null]
  try{
    client = await conPool.connect()
    data = await client.query("call upsert_install($1, $2, $3::timestamp at time zone 'cst', $4)", params) 
  }catch(e){
    console.log(`Error upsert install ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows[0]
}

async function get_installs(search: string, not_done: boolean){
  let client 
  let data
  let query = `select * from installs where ${not_done ? "install_date is null and " : ""}(worker ilike $1)`
  try{
    client = await conPool.connect()
    data = await client.query(query, [`%${search}%`])
  }catch(e){
    console.log(`ERROR getting installations: ${e}`)
  }finally{
    client?.release()
  }
  return data?.rows
}

export { login, upsert_user, get_users, delete_user, get_sells, create_sell, delete_sell, search_staff, upsert_install, get_installs}
