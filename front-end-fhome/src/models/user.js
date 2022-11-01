class User {

  constructor(params){
    this.user_name = null
    this.user_group = null
    this.user_password = null
    this.names = null
    this.surnames = null
    this.phone = null
    this.dpi = null
    this.email = null
    this.address = null
    this.date_of_birth = null
    Object.assign(this, params)
  }

  getInvalid(){
    let invalids = Object.entries(this).filter(([, val]) => !val || val === "-1").map(([key]) => key)
    invalids = invalids.filter(x => x !== 'user_password')
    return invalids
  }

}

export default User
