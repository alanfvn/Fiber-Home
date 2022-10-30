import {Modal, Form, Button, Alert} from 'react-bootstrap'
import React from 'react'

function StaffModal(props){

  const [error, setError] = React.useState()
  const [inputs, setInputs] = React.useState({})
  const {show, onHide} = props;

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
    const {
      user, names, 
      surnames, phone, 
      dpi, email, 
      address, birth_date
    } = inputs 

    const valid = ( user && names && surnames && phone
    && dpi && email && address && birth_date )

    if(!valid){
      setError("ERROR: Debes llenar todos los campos")
      return
    }
    //guardado exitoso
    closeModal()
  }

  return (
    <Modal 
      show={show}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Personal</Modal.Title>
      </Modal.Header>

      <Form onSubmit={submit}>
        <Modal.Body>
          { error && <Alert variant='danger'>{error}</Alert> }
          <Form.Group className='mb-2'>
            <Form.Label>Usuario</Form.Label>
            <Form.Control name="user" onChange={handle}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Nombres</Form.Label>
            <Form.Control name="names" onChange={handle}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Apellidos</Form.Label>
            <Form.Control name="surnames" onChange={handle}/>
          </Form.Group>

          <Form.Group className='mb-2'>
            <Form.Label>Rol</Form.Label>
            <Form.Control as="select" defaultValue="1">
              <option value="1">Administrador</option>
              <option value="2">Supervisor</option>
              <option value="3">Ventas</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className='mb-2'>
            <Form.Label>Telefono</Form.Label>
            <Form.Control name="phone" onChange={handle}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>DPI</Form.Label>
            <Form.Control name="dpi" onChange={handle}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" onChange={handle} type='email'/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Direccion</Form.Label>
            <Form.Control name="address" onChange={handle}/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control name="birth_date" onChange={handle} type="date"/>
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
