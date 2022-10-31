
import {Modal, Form, Button, Alert} from 'react-bootstrap'
import {useState} from 'react'

function StaffModal(props){



  const {show, onHide} = props;
  const [error, setError] = useState()
  const [inputs, setInputs] = useState(show)
  //si show esta vacio {} estamos creando
  const editing = Object.keys(show).length !== 0
  //si el id de grupo es > 3 estamos editando cliente
  const staff = (show?.user_group ?? 1) <= 3


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

    const valid = false

    if(!valid){
      setError("ERROR: Debes llenar todos los campos")
      return
    }
    closeModal()
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
                <Form.Control as="select" name="user_group" defaultValue={inputs?.user_group ?? "3"}>
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
            <Form.Control name="dpi" onChange={handle} defaultValue={inputs?.dpi} maxLength="13"/>
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
