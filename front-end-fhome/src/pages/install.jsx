import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import InstallModal from "./modals/install-modal";
import {useState, useEffect } from "react";
import { Container, Badge} from "react-bootstrap";
import HttpMan from "../util/http-man";

function Installation(){

  const [query, setQuery] = useState({})
  const [installs, setInstalls] = useState([])
  const [pending, setPending] = useState(0)
  const [install, setCurrentInstall] = useState()
  const [fetch, setFetch] = useState(true)
  const triggerFetch = () => setFetch(t => !t)

  //requests
  const fetchInstalls = async ()=>{
    try{
      const resp = await HttpMan.get('/installs/list', {params: query})
      setInstalls(resp.data)
    }catch(e){
      console.log(`Error when trying to get installs ${e}`)
    }
  }
  
  //other
  const handleQuery = (e) =>{
    const {name, value, checked} = e.target || {}
    const val = name === "not_done" ? checked : value
    setQuery({...query, [name]: val})
  }

  const columns = [
    {
      name: 'Id de instalación',
      selector: row => row.install_id,
    },
    {
      name: 'Trabajador asignado',
      selector: row => row.worker,
    },
    {
      name: 'Fecha de instalación',
      selector: row => row.install_date ? new Date(row.install_date).toLocaleDateString() : "No asignado"
    },
    {
      name: 'Instalción realizada',
      selector: row =><Badge bg={row.install_date ? "success" : "danger"} text="light">
        {row.install_date ? "Realizada" : "No realizada"}
      </Badge> 
    },
    {
      name: 'Visualizar',
      selector: row => 
        <button onClick={()=>{
          setCurrentInstall(installs.find(x => x.install_sell === row.install_sell))
      }} className="btn btn-primary">
        <i className="fa-solid fa-clipboard-list"/>
      </button>
    },
  ];

  useEffect(()=>{
    const delay = setTimeout(()=>fetchInstalls(), 500)
    return () => clearTimeout(delay)
  }, [query])

  useEffect(()=>{
    fetchInstalls()
  }, [fetch])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        { install && <InstallModal show={install} onHide={()=>{
          triggerFetch()
          setCurrentInstall(null)
        }}/> }
        <Container className="mt-5 mb-5">
          { pending > 0 &&
          <div className="alert alert-warning mb-5" role="alert">
            <h4 className="alert-heading">Instalaciones pendientes</h4>
            <p className="mb-0">Tienes {pending} instalaciones pendientes.</p>
          </div>
          }
          <div className="d-flex mb-4">
            <input name='filter' onChange={handleQuery} className="form-control rounded-0" type="search" placeholder="Buscar instalaciones.." aria-label="Search"/>
          </div>
          <div className="form-check mb-4">
            <input name='not_done' onChange={handleQuery} className="form-check-input" id="instalaciones" type="checkbox"/>
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
