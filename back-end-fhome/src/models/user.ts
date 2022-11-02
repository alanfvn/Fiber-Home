class User{

  user_name: string | null
  user_group: number | null
  user_password: string | null
  names: string | null
  surnames: string | null
  phone: string | null
  dpi: string | null
  email: string | null
  address: string | null
  date_of_birth: string | null

  constructor(data: any){
    this.user_name = null
    this.user_group = 4
    this.user_password = null
    this.names = null
    this.surnames = null
    this.phone = null
    this.dpi = null
    this.email = null
    this.address = null
    this.date_of_birth = null
    Object.assign(this, data)
  }

  get_invalids(){
    let invalids = Object.entries(this).filter(([, val]) => !val || val === "-1").map(([key]) => key)
    invalids = invalids.filter(x => x !== 'user_password')
    return invalids
  }
}

export default User
