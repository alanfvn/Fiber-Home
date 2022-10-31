import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import SellModal from "./modals/sell-modal";
import React from "react";
import { Container, Badge } from "react-bootstrap";

function Sells(){

  const [modal,setModal] = React.useState(false)
  const data = []

  const columns = [
    {
      name: 'UID Contrato',
      selector: row => row.title,
    },
    {
      name: 'Fecha',
      selector: row => row.year,
    },
    {
      name: 'Instalación programada',
      selector: row =><Badge bg="success" text="light">No programada</Badge> 
      // selector: row =><Badge bg="danger" text="light">No programada</Badge> 
    },
    {
      name: 'Visualizar',
      selector: row => <button onClick={()=>{setModal(true)}} className="btn btn-info fa-solid fa-clipboard-list"/>
    },
    {
      name: 'Eliminar',
      selector: row => <button onClick={()=>{setModal(true)}} className="btn btn-danger fa-solid fa-trash"/>,
    },
  ];


  for(let i =0; i< 5; i++){
    data[i] = {id: i, title: `p: ${i}`, year: '1900'}
  }

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <SellModal show={modal} onHide={()=>setModal(false)}/>
        <Container className="mt-5 mb-5">

          <div className="d-flex mb-4">
            <input className="form-control rounded-0 w-75" type="search" placeholder="Buscar ventas.." aria-label="Search"/>
            <button className="btn btn-primary rounded-0">Buscar venta</button>
          </div>
          <div className="d-flex mb-4">
            <input className="form-control rounded-0 w-25" type="date"/>
            <input className="form-control rounded-0 w-25" type="date"/>
          </div>

          <div className="form-check mb-4">
            <input className="form-check-input" id="instalaciones" type="checkbox"/>
            <label className="form-check-label" htmlFor="instalaciones">Instalaciones no programadas</label>
          </div>

          <DataTable
            columns={columns}
            data={data}
            pagination
            />
          <div className="mt-3">
            <a className="btn btn-success fas-fa fa-plus rounded-0" onClick={()=>{}}> Agregar Venta</a>
          </div>
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Sells

