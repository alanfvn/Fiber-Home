import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import UserModal from './modals/user-modal'
import HttpMan from '../util/http-man'
import { useEffect, useState} from "react";
import { get_token } from "../util/cookie-man";
import { Container } from "react-bootstrap";

function Clients(){

  const [modal,setModal] = useState(false)
  const [search, setSearch] = useState()
  const [users, setUsers] = useState([])

  const fetchClients = async (query) =>{
    try{
      const resp = await HttpMan.get('/user/client_list', {
        headers: {
          'Authorization': get_token() 
        }
      });
      setUsers(resp.data)
      console.log(resp)
    }catch(e){
      console.log(`Fetch client error: ${e}`)
    }
  }

  //table data
  const columns = [
    {
      name: 'Id',
      selector: row => row.user_id,
    },
    {
      name: 'Nombre completo',
      selector: row => `${row.names} ${row.surnames}`,
    },
    {
      name: 'DPI',
      selector: row => row.dpi,
    },
    {
      name: 'Editar',
      selector: row => <button onClick={()=>{
        setModal(true)
      }} className="btn btn-warning fa-solid fa-user-pen"/>
    },
    {
      name: 'Eliminar',
      selector: row => <button onClick={()=>{
        setModal(true)
      }} className="btn btn-danger fa-solid fa-trash"/>,

    },
  ];

  useEffect(()=>{
    fetchClients()
  }, [])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <UserModal show={modal} onHide={()=>setModal(false)}/>
        <Container className="mt-5 mb-5">
          {/* buscador */}
          <div className="d-flex px-0 mb-4">
            <input 
              className="form-control rounded-0 w-75" 
              placeholder="Buscar cliente.." 
              onChange={(e)=>setSearch(e.target.value)}
              />
            <button className="btn btn-primary rounded-0" onClick={()=>alert(search)}>
              Buscar cliente
            </button>
          </div>
          {/* contenido de la tabla */}
          <DataTable
            columns={columns}
            data={users}
            pagination
            />
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Clients
