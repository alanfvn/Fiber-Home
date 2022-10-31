import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import InstallModal from "./modals/install-modal";
import React from "react";
import { Container, Badge } from "react-bootstrap";

function Installation(){

  const [modal,setModal] = React.useState(false)
  const data = []

  const columns = [
    {
      name: 'Id instalacion',
      selector: row => row.title,
    },
    {
      name: 'Trabajador asignado',
      selector: row => row.year,
    },
    {
      name: 'Fecha de instalacion',
      selector: row => '02/02/2022'
      // selector: row =><Badge bg="danger" text="light">No programada</Badge> 
    },
    {
      name: 'Instalcion realizada',
      selector: row =><Badge bg="success" text="light">No programada</Badge> 
      // selector: row =><Badge bg="danger" text="light">No programada</Badge> 
    },
    {
      name: 'Visualizar',
      selector: row => <button onClick={()=>{setModal(true)}} className="btn btn-info fa-solid fa-clipboard-list"/>
    },
  ];


  for(let i =0; i< 1005; i++){
    data[i] = {id: i, title: `p: ${i}`, year: '1900'}
  }

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <InstallModal show={modal} onHide={()=>setModal(false)}/>
        <Container className="mt-5 mb-5">

          <div className="d-flex mb-4">
            <input className="form-control rounded-0" type="search" placeholder="Buscar instalaciones.." aria-label="Search"/>
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
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Installation

