import {Modal, Form, Button, Alert} from 'react-bootstrap'
import React from 'react'
import Select from 'react-select'

function InstallModal(props){

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

    //guardado exitoso
    closeModal()
  }

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

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

      <Form onSubmit={submit}>
        <Modal.Body>
          { error && <Alert variant='danger'>{error}</Alert> }
          <Form.Group className='mb-2'>
            <Form.Label>UID Contrato</Form.Label>
            <Form.Control value="" disabled/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Cliente</Form.Label>
            <Form.Control value="" disabled/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Fecha Instalacion</Form.Label>
            <Form.Control  type='date'/>
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Instalador designado</Form.Label>
            <Select
              // defaultValue={"alan"}
              isLoading={true}
              isClearable={true}
              isSearchable={true}
              name="installer"
              options={options}
              />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default InstallModal
