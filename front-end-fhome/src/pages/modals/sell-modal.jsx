import Select from 'react-select'
import HttpMan from '../../util/http-man';
import {Modal, Button, Alert} from 'react-bootstrap'
import {useState} from 'react'

function SellModal(props){

  const {show, onHide} = props;
  const [error, setError] = useState()
  const [inputs, setInputs] = useState(show)
  const isNew = Object.keys(show).length === 0
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const saveData = async () => {

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
                  <input type="date" className="form-control" name="contract_start_date" defaultValue={new Date().toLocaleString('en-CA')}/>
                </div>
                <div className="col-6">
                  <label>Inicio de contrato</label>
                  <input type="date" className="form-control" name="contract_end_date"/>
                </div>
              </div>
            </>
            :
            <>
              {/* apartado de cliente */}
              <div className='row mb-3'>
                <div className="col-6">
                  <label>UID Contrato</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
                <div className="col-6">
                  <label>Cliente</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
              </div>
              {/* apartado del vendedor */}
              <div className="row mb-3">
                <div className="col-6">
                  <label>Vendedor</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
                <div className="col-6">
                  <label>Fecha venta</label>
                  <input type="text" disabled={true} className="form-control"/>
                </div>
              </div>

              {/* apartado de instalacion */}
              <div className="row mb-3">
                <div className="col-6">
                  <label>Instalador designado</label>
                  <Select
                    defaultValue={"alan"}
                    isLoading={true}
                    isClearable={true}
                    isSearchable={true}
                    name="installer"
                    options={options}
                    />
                </div>
                <div className="col-6">
                  <label>Fecha de Instalación</label>
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
