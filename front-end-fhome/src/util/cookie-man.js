import Cookies from "universal-cookie"

const cookies = new Cookies()

/*available cookies:
- jwt
- uid -> user id
- username
- gid -> group id
- fullname  
*/

function clean_cookies(){
  const stored_cookies = cookies.getAll()
  for(const k of Object.keys(stored_cookies)){
    cookies.remove(k, {path: "/"})
  }
}

function set_cookies(data){
  const {jwt, user_info} = data 
  cookies.set('jwt', jwt, {path:"/"})
  for(const[k, v] of Object.entries(user_info)){
    cookies.set(k, v, {path: "/"})
  }
}

function is_user_auth(){
  return cookies.get('jwt') ?? false
}

function get_token(){
  const token = cookies.get('jwt')
  return token ? `Bearer ${token}` : null
}

function get_group(){
  return cookies.get('gid') ?? 99
}

function get_uid(){
  return cookies.get('uid') ?? -1
}

export {clean_cookies, set_cookies, is_user_auth, get_token, get_group, get_uid}
