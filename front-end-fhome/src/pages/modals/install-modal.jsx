import AsyncSelect from 'react-select/async';
import HttpMan from '../../util/http-man'
import {Modal, Button} from 'react-bootstrap'
import { useState } from 'react'
import { get_group, get_uid } from '../../util/cookie-man';

function InstallModal(props){

  const {show, onHide} = props;
  const seller = get_group() >= 3 
  const disabled = show?.install_worker != get_uid() && seller
  const [inputs, setInputs] = useState(show)

  //requests
  const updateInstall = async (install) =>{
    try{
      await HttpMan.post('/installs/upsert', install)
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
      console.log(`Error when trying to get the staff: ${e}`)
    }
    return data
  }

  const closeModal = () =>{
    setInputs({})
    onHide()
  }

  const handleInputs = (e) =>{
    const {name, value} = e.target
    setInputs({...inputs, [name]: value})
    console.log(inputs)
  }

  const handleSelect = (e) => {
    const {value} = e || {}
    setInputs({...inputs, install_worker: value})
  }

  const submit = (e) => {
    e.preventDefault()
    if(disabled){
      closeModal()
      return
    }
    const {install_sell, install_worker, install_date: date} = inputs
    const install_date = !date ? null : date
    updateInstall({install_sell, install_worker, install_date}).then(()=>closeModal())
  }

  return (
    <Modal 
      size="lg"
      show={show}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Instalacion</Modal.Title>
      </Modal.Header>

      <form onSubmit={submit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-6">
              <label>UID Contrato</label>
              <input className='form-control' disabled defaultValue={inputs?.contract_uid}/>
            </div>
            <div className="col-6">
              <label>Cliente</label>
              <input className='form-control' disabled defaultValue={inputs?.client}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <label>Instalador designado</label>
              <AsyncSelect
                onChange={handleSelect}
                defaultValue={inputs?.install_worker ? {value: inputs?.install_worker, label: inputs?.worker} : null}
                isDisabled={seller}
                isClearable
                loadOptions={getStaff}
                />
            </div>
            <div className="col-6">
              <label>Fecha de instalacion</label>
              <input name="install_date" className='form-control' type="date" defaultValue={
                inputs?.install_date ? new Date(inputs?.install_date).toLocaleDateString('en-CA') : null
              }
                onChange={handleInputs}
                disabled={disabled}
                />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default InstallModal
