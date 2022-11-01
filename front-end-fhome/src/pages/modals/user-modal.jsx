
import HttpMan from '../../util/http-man'
import User from '../../models/user'
import {Modal, Form, Button, Alert} from 'react-bootstrap'
import { useState } from 'react'
import { get_token } from '../../util/cookie-man'

function StaffModal(props){
  const token = get_token()
  const {show, onHide} = props;
  const [error, setError] = useState()
  const [inputs, setInputs] = useState(show)
  const editing = Object.keys(show).length !== 0 //si el objeto no esta vacio estamos editando
  const staff = (show?.user_group ?? 1) <= 3 //si el id de grupo es > 3 estamos editando cliente

  const saveData = async () =>{
    try{
      const resp = await HttpMan.post('/user/upsert', inputs, {
        headers: { Authorization: token }
      }); 
      console.log(resp.data)
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
    saveData().then(()=>{
      closeModal()
    })
  }

  return (
    <Modal 
      show={show}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Usuario</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit}>
        <Modal.Body>
          { error && <Alert variant='danger'>{error}</Alert> }
          <Form.Group className='mb-2'>
            <Form.Label>Usuario</Form.Label>
            <Form.Control name="user_name" defaultValue={inputs?.user_name} disabled={editing} onChange={handle}/>
          </Form.Group>
          { staff && 
            <>
              <Form.Group className='mb-2'>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="user_password" onChange={handle}/>
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label>Rol</Form.Label>
                <Form.Control as="select" name="user_group" onChange={handle} defaultValue={inputs?.user_group}>
                  <option value="-1">Selecciona una opcion</option>
                  <option value="1">Administrador</option>
                  <option value="2">Supervisor</option>
                  <option value="3">Trabajador</option>
                </Form.Control>
              </Form.Group>
            </>
          }
          <Form.Group className='mb-2'>
            <Form.Label>Nombres</Form.Label>
            <Form.Control name="names" onChange={handle} defaultValue={inputs?.names}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Apellidos</Form.Label>
            <Form.Control name="surnames" onChange={handle} defaultValue={inputs?.surnames}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Telefono</Form.Label>
            <Form.Control name="phone" maxLength="8" onChange={handle} defaultValue={inputs?.phone}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>DPI</Form.Label>
            <Form.Control name="dpi" maxLength="13" onChange={handle} defaultValue={inputs?.dpi} />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" onChange={handle} defaultValue={inputs?.email} type='email'/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Direccion</Form.Label>
            <Form.Control name="address" defaultValue={inputs?.address} onChange={handle}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control name="date_of_birth" onChange={handle} defaultValue={
              new Date(Date.parse(inputs?.date_of_birth)).toLocaleDateString('en-CA')
            } type="date"/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default StaffModal
