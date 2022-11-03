import HttpMan from '../../util/http-man'
import User from '../../models/user'
import { Modal, Button, Alert } from 'react-bootstrap'
import { useState } from 'react'

function StaffModal(props){

  const {show, onHide} = props;
  const [error, setError] = useState()
  const [inputs, setInputs] = useState(show)
  const editing = Object.keys(show).length !== 0 //si el objeto no esta vacio estamos editando
  const staff = (show?.user_group ?? 1) <= 3 //si el id de grupo es > 3 estamos editando cliente

  const saveData = async (user) =>{
    const {...data} = user
    try{
      await HttpMan.post('/user/upsert', data); 
    }catch(err){
      console.log(err)
    }
  }

  const closeModal = () =>{
    setInputs({})
    setError()
    onHide()
  }

  const handle = (e) =>{
    const {name, value} = e.target
    setError(null)
    setInputs({...inputs, [name]: value})
  }

  const submit = (e) => {
    e.preventDefault()
    const user = new User(inputs);
    const invalid = user.getInvalid()

    if(!staff){
      user.user_group = 4
    }
    if(invalid.length > 0){
      let errors = 'ERROR: debes llenar los siguientes campos: '
      errors += invalid.join(',\n')
      setError(errors)
      return
    }
    saveData(user).then(()=>{
      closeModal()
    })
  }

  return (
    <Modal 
      size="lg"
      show={show}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Usuario</Modal.Title>
      </Modal.Header>
      <form onSubmit={submit}>
        <Modal.Body>
          { error && <Alert variant='danger'>{error}</Alert> }
          <div className="row mb-3">
            <div className="col-6">
              <label>Usuario</label>
              <input className='form-control' name="user_name" defaultValue={inputs?.user_name} disabled={editing} onChange={handle}/>
            </div>
            <div className="col-6">
              <label>Email</label>
              <input className='form-control' name="email" defaultValue={inputs?.email} onChange={handle}/>
            </div>
          </div>

          {staff &&
            <div className="row mb-3">
              <div className="col-6">
                <label htmlFor="">Grupo</label>
                <select className="form-control" name="user_group" onChange={handle} defaultValue={inputs?.user_group}>
                  <option value="-1">Selecciona una opcion</option>
                  <option value="1">Administrador</option>
                  <option value="2">Supervisor</option>
                  <option value="3">Trabajador</option>
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="">Contraseña</label>
                <input type='password' className="form-control" name="user_password" onChange={handle}/>
              </div>
            </div>
          }
          {/* nombres y apellidos */}
          <div className="row mb-3">
            <div className="col-6">
              <label htmlFor="">Nombres</label>
              <input className="form-control" name="names" onChange={handle} defaultValue={inputs?.names}/>
            </div>
            <div className="col-6">
              <label htmlFor="">Apellidos</label>
              <input className="form-control" name="surnames" onChange={handle} defaultValue={inputs?.surnames}/>
            </div>
          </div>

          {/* telefono y dpi */}
          <div className="row mb-3">
            <div className="col-6">
              <label htmlFor="">Teléfono</label>
              <input className="form-control" name="phone" maxLength={8} onChange={handle} defaultValue={inputs?.phone}/>
            </div>
            <div className="col-6">
              <label htmlFor="">DPI</label>
              <input className="form-control" name="dpi" maxLength={13} onChange={handle} defaultValue={inputs?.dpi}/>
            </div>
          </div>

          {/* direccion y fecha nacimiento */}
          <div className="row mb-3">
            <div className="col-6">
              <label htmlFor="">Dirección</label>
              <input type="text" className="form-control" name="address" onChange={handle} defaultValue={inputs?.address}/>
            </div>
            <div className="col-6">
              <label htmlFor="">Fecha nacimiento</label>
              <input type="date" className="form-control" name="date_of_birth" onChange={handle} defaultValue={
                new Date(Date.parse(inputs?.date_of_birth)).toLocaleDateString('en-CA')
              }/>
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

export default StaffModal
