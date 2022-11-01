import {Modal, Button, Alert} from 'react-bootstrap'
import React from 'react'
import Select from 'react-select'

function SellModal(props){

  const {show, onHide} = props;
  const [error, setError] = React.useState()
  const [inputs, setInputs] = React.useState(show)
  const isNew = Object.keys(show).length === 0

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
        <Modal.Title>Cliente</Modal.Title>
      </Modal.Header>

      <form onSubmit={submit}>
        <Modal.Body>
          { error && <Alert variant='danger'>{error}</Alert> }
          {

          isNew ?
            <>
              {/* new sell */}

            </>
            :
            <>
              {/* apartado de cliente */}
              <div className='form-row'>
                <div className="form-group col-6">
                  <label htmlFor="">UID Contrato</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Cliente</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
              </div>
              {/* apartado del vendedor */}
              <div className="form-row">
                <div className="form-group col-6">
                  <label htmlFor="">Vendedor</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Fecha venta</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
              </div>

              {/* apartado de instalacion */}
              <div className="form-row">
                <div className="form-group col-6">
                  <label htmlFor="">Instalador designado</label>
                  <Select
                    // defaultValue={"alan"}
                    isLoading={true}
                    isClearable={true}
                    isSearchable={true}
                    name="installer"
                    options={options}
                    />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Fecha de Instalación</label>
                  <input type="date" className="form-control"/>
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
