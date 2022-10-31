import Cookies from "universal-cookie"

const cookies = new Cookies()

function get_cookie(name){
  /* available cookies:
  - jwt
  - uid -> user id
  - username
  - gid -> group id
  - fullname  */
  return cookies.get(name)
}

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

export {get_cookie, clean_cookies, set_cookies, is_user_auth}
