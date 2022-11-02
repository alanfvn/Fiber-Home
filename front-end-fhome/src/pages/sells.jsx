import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import SellModal from "./modals/sell-modal";
import HttpMan from "../util/http-man";
import { Container, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";

function Sells(){
  const [query, setQuery] = useState({})
  const [sells, setSells] = useState([])
  const [sell, setCurrentSell] = useState()
  const [fetch, setFetch] = useState(false)

  //trigger fetch function to update view
  const triggerFetch = () => setFetch(t => !t)

  //capture the query
  const handleQuery = (e) =>{
    const {name, value, checked} = e.target
    const val = name === "not_programmed" ? checked : value
    setQuery({...query, [name]: val})
  }

  const fetchSells = async () =>{
    try{
      const resp = await HttpMan.get('/sells/list', {params: query})
      setSells(resp.data)
    }catch(e){
      console.log(`Error fetching sells ${e}`)
    }
  }

  const deleteSell = async (sell_id) =>{
    try{
      await HttpMan.delete('/sells/delete', {data: {sell_id}})
    }catch(e){
      console.log(`Error deleting sell ${e}`)
    }
  }

  const columns = [
    {
      name: 'Vendedor',
      selector: row => row.seller,
    },
    {
      name: 'Cliente',
      selector: row => row.client
    },
    {
      name: 'Fecha',
      selector: row => new Date(row.sell_date).toLocaleDateString()
    },
    {
      name: 'Instalación programada',
      selector: row =><Badge bg={row.install_worker ? "success" : "danger"} text="light">
        {row.install_worker ? "Programada" : "No programada"}
      </Badge> 
    },
    {
      name: 'Visualizar',
      selector: row => 
        <button onClick={()=>{
          setCurrentSell(sells.find(x => x.sell_id === row.sell_id))
      }} className="btn btn-primary">
        <i className="fa-solid fa-clipboard-list"/>
      </button>
    },
    {
      name: 'Eliminar',
      selector: row => <button onClick={()=>{
        if(!window.confirm("Deseas borrar este registro")){
          return
        }
        deleteSell(row.sell_id).then(()=>triggerFetch())
      }} className="btn btn-danger"><i className="fa-solid fa-trash"/></button>,
    },
  ];

  //query effect
  useEffect(()=>{
    const delay = setTimeout(()=>fetchSells(), 500)
    return () => clearTimeout(delay)
  },[query])

  //useEffect
  useEffect(()=>{
    fetchSells()
  },[fetch])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <Container className="mt-5 mb-5">
          { sell && <SellModal show={sell} onHide={()=>{
            triggerFetch()
            setCurrentSell(null)
          }}/> }

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
