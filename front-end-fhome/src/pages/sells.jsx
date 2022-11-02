import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import SellModal from "./modals/sell-modal";
import { Container, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";

function Sells(){

  const [query, setQuery] = useState({})
  const [sells, setSells] = useState([])
  const [sell, setCurrentSell] = useState()
  const [fetch, setFetch] = useState(false)
  const triggerFetch = () => setFetch(t => !t)



  const handleQuery = (e) =>{
    const {name, value, checked} = e.target
    const val = name === "not_programmed" ? checked : value
    setQuery({...query, [name]: val})
  }

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
      selector: row =><Badge variant={row.year ? "danger" : "success"} text="light">No programada</Badge> 
    },
    {
      name: 'Visualizar',
      selector: row => <button onClick={()=>{
      }} className="btn btn-info "><i className="fa-solid fa-clipboard-list"/></button>
    },
    {
      name: 'Eliminar',
      selector: row => <button onClick={()=>{
        if(!window.confirm("Deseas borrar este registro")){
          return
        }
      }} className="btn btn-danger "><i className="fa-solid fa-trash"/></button>,
    },
  ];


  useEffect(()=>{
    console.log(query)
    // const delay = setTimeout(()=>fetchStaff(), 500)
    // return () => clearTimeout(delay)
  },[query])

  //useEffect
  useEffect(()=>{
  },[fetch])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <Container className="mt-5 mb-5">
          { sell && <SellModal show={sell} onHide={()=>setCurrentSell(null)}/> }
          <div className="d-flex mb-4">
            <input name="filter" onChange={handleQuery} className="form-control rounded-0" type="search" placeholder="Buscar ventas.." aria-label="Search"/>
          </div>
          <div className="form-check mb-4">
            <input name="not_programmed" onChange={handleQuery} className="form-check-input" id="instalaciones" type="checkbox"/>
            <label className="form-check-label" htmlFor="instalaciones">Instalaciones no programadas</label>
          </div>
          <DataTable
            columns={columns}
            data={sells}
            pagination
            />
          <div className="mt-3">
            <a className="btn btn-success" onClick={()=>setCurrentSell({})}> 
              <i className="fa-solida fa-plus"/> Agregar venta 
            </a>
          </div>
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Sells
