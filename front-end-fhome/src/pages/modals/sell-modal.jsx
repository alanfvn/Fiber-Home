import AsyncSelect from 'react-select/async';
import HttpMan from '../../util/http-man';
import User from '../../models/user';
import {Modal, Button, Alert} from 'react-bootstrap'
import {useState} from 'react'
import { get_group } from '../../util/cookie-man';

function SellModal(props){

  const {show, onHide} = props;
  const [error, setError] = useState()
  const [inputs, setInputs] = useState(show)
  const isNew = Object.keys(show).length === 0
  const seller = get_group() >= 3

  //requests
  const createSell = async (sell)=>{
    const {...data} = sell
    try{
      const resp = await HttpMan.post('/sells/create', data)
    }catch(e){
      console.log(`Error on sell creation: ${e}`)
    }
  }

  const updateInstall = async (install) =>{
    try{
      const resp = await HttpMan.post('/installs/upsert', install)
    }catch(e){
      console.log(`Error on install update: ${e}`)
    }
  }

  const getStaff = async (filter)=>{
    let data
    try{
      const resp = await HttpMan.get('/user/staff_names', {params: { filter }})
      data = resp.data.map(x => ({value: x.uid, label: x.username}))
    }catch(e){
      console.log(`Error ${e}`)
    }
    return data
  }


  const closeModal = () =>{
    setInputs({})
    setError()
    onHide()
  }

  const handle = (e) =>{
    const {name, value} = e.target || {}
    setError(null)
    setInputs({...inputs, [name]: value})
  }

  const handleSelect = (e) => {
    const {value} = e || {}
    setInputs({...inputs, install_worker: value})
  }

  const submit = (e) => {
    e.preventDefault()

    if(isNew){
      //dsa
      const {contract_start_date, contract_end_date, ...udata} = inputs
      const user = new User(udata)
      user.user_group = 4
      const invalid = user.getInvalid()

      if(invalid.length > 0){
        let errors = 'ERROR debes llenar los siguientes campos: '
        errors += invalid.join(',\n')
        setError(errors)
        return
      }
      if(!contract_start_date || !contract_end_date){
        setError('ERROR: debes llenar los campos de las fechas de los contratos')
        return
      }
      Object.assign(user, {contract_start_date, contract_end_date})
      createSell(user).then(()=>closeModal())
    }else{
      //updating a sell
      if(seller){
        closeModal()
        return
      }
      const {install_worker, install_date, sell_id: install_sell} = inputs
      updateInstall({install_sell, install_worker, install_date}).then(x=>closeModal())
    }
  }


  return (
    <Modal 
      size="lg"
      show={show}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Venta</Modal.Title>
      </Modal.Header>
      <form onSubmit={submit}>
        <Modal.Body>
          { error && <Alert variant='danger'>{error}</Alert> }
          {
          isNew ?
            <>
              {/* new sell */}
              <div className="row mb-3">
                <div className="col-6">
                  <label>Usuario</label>
                  <input className='form-control' name="user_name" onChange={handle}/>
                </div>
                <div className="col-6">
                  <label>Email</label>
                  <input className='form-control' name="email" onChange={handle}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Nombres</label>
                  <input className="form-control" name="names" onChange={handle}/>
                </div>
                <div className="col-6">
                  <label>Apellidos</label>
                  <input className="form-control" name="surnames" onChange={handle}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Teléfono</label>
                  <input className="form-control" name="phone" maxLength={8} onChange={handle}/>
                </div>
                <div className="col-6">
                  <label>DPI</label>
                  <input className="form-control" name="dpi" maxLength={13} onChange={handle}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Dirección</label>
                  <input type="text" className="form-control" name="address" onChange={handle}/>
                </div>
                <div className="col-6">
                  <label>Fecha nacimiento</label>
                  <input type="date" className="form-control" name="date_of_birth" onChange={handle}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label>Inicio de contrato</label>
                  <input type="date" className="form-control" name="contract_start_date" onChange={handle}/>
                </div>
                <div className="col-6">
                  <label>Fin de contrato</label>
                  <input type="date" className="form-control" onChange={handle} name="contract_end_date"/>
                </div>
              </div>
            </>
            :
            <>
              {/* apartado de cliente */}
              <div className='row mb-3'>
                <div className="col-6">
                  <label>UID Contrato</label>
                  <input type="text" disabled={true} defaultValue={inputs?.contract_uid} className="form-control"/>
                </div>
                <div className="col-6">
                  <label>Cliente</label>
                  <input type="text" disabled={true} defaultValue={inputs?.client} className="form-control"/>
                </div>
              </div>
              {/* apartado del vendedor */}
              <div className="row mb-3">
                <div className="col-6">
                  <label>Vendedor</label>
                  <input type="text" disabled={true} defaultValue={inputs?.seller} className="form-control"/>
                </div>
                <div className="col-6">
                  <label>Fecha venta</label>
                  <input type="date" disabled={true} className="form-control" defaultValue={
                    new Date(Date.parse(inputs?.sell_date)).toLocaleDateString('en-CA')
                  }/>
                </div>
              </div>

              {/* apartado de instalacion */}
              <div className="row mb-3">
                <div className="col-6">
                  <label>Instalador designado</label>
                  <AsyncSelect
                    onChange={handleSelect}
                    defaultValue={inputs?.install_worker ? {value: inputs?.install_worker, label: inputs?.installer} : null}
                    isDisabled={seller}
                    isClearable
                    loadOptions={getStaff}
                    />
                </div>
              </div>
            </>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}


export default SellModal
