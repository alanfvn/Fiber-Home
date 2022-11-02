import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import InstallModal from "./modals/install-modal";
import {useState, useEffect } from "react";
import { Container, Badge, Alert} from "react-bootstrap";
import HttpMan from "../util/http-man";

function Installation(){

  const [modal,setModal] = useState()
  const [query, setQuery] = useState({})
  const [installs, setInstalls] = useState([{}])
  const [install, setCurrentInstall] = useState()

  //requests
  const getInstalls = async ()=>{
    try{
      await HttpMan.get('/installs/list',{params: {}})
    }catch(e){
      console.log(`Error when trying to get installs ${e}`)
    }
  }

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
    },
    {
      name: 'Instalcion realizada',
      selector: row =><Badge bg={row.install_worker ? "success" : "danger"} text="light">
        {row.install_worker ? "Realizada" : "No realizada"}
      </Badge> 
    },
    {
      name: 'Visualizar',
      selector: row => 
        <button onClick={()=>{
          // setCurrentSell(sells.find(x => x.sell_id === row.sell_id))
      }} className="btn btn-primary">
        <i className="fa-solid fa-clipboard-list"/>
      </button>
    },
  ];

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <InstallModal show={modal} onHide={()=>setModal(null)}/>
        <Container className="mt-5 mb-5">
          <div className="alert alert-warning mb-5" role="alert">
            <h4 className="alert-heading">Instalaciones pendientes</h4>
            <p className="mb-0">Tienes 5 instalaciones pendientes.</p>
          </div>
          <div className="d-flex mb-4">
            <input className="form-control rounded-0" type="search" placeholder="Buscar instalaciones.." aria-label="Search"/>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" id="instalaciones" type="checkbox"/>
            <label className="form-check-label" htmlFor="instalaciones">Instalaciones no realizadas</label>
          </div>
          <DataTable
            columns={columns}
            data={installs}
            pagination
            />
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Installation
