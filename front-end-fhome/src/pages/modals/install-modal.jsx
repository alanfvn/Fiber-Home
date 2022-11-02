import AsyncSelect from 'react-select/async';
import HttpMan from '../../util/http-man'
import {Modal, Form, Button, Alert} from 'react-bootstrap'
import {useState} from 'react'
import { get_group } from '../../util/cookie-man';

function InstallModal(props){

  const admin = get_group() >= 2
  const {show, onHide} = props;
  const [inputs, setInputs] = useState({})
  const [installs, setInstalls] = useState([])

  //requests
  // const 
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
  }

  const handleSelect = (e) =>{
  }

  const submit = (e) => {
    e.preventDefault()
    closeModal()
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
              <input className='form-control' disabled/>
            </div>
            <div className="col-6">
              <label>Cliente</label>
              <input className='form-control' disabled/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <label>Instalador designado</label>
              <AsyncSelect/>
            </div>
            <div className="col-6">
              <label>Fecha de instalacion</label>
              <input className='form-control' type="date"/>
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
