class Install{

  install_sell: number
  install_worker: number | null
  install_date: Date | null

  constructor(params: any){
    this.install_sell = -1
    this.install_worker = null
    this.install_date = null
    Object.assign(this, params)
  }
}

export default Install
