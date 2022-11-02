import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import UserModal from './modals/user-modal'
import HttpMan from '../util/http-man'
import Permission from "./components/permission";
import { Container } from "react-bootstrap";
import { useEffect, useState} from "react";

function Clients(){
  const [search, setSearch] = useState()
  const [users, setUsers] = useState([])
  const [user, setCurrentUser] = useState()
  const [fetch, setFetch] = useState(true)
  const triggerFetch = () => setFetch(t => !t)

  //endpoints
  const fetchClients = async () =>{
    try{
      const resp = await HttpMan.get('/user/client_list', {
        params: { 'filter': search }
      });
      setUsers(resp.data)
    }catch(e){
      console.log(`Fetch client error: ${e}`)
    }
  }

  const deleteUser = async (uid) =>{
    try{
       await HttpMan.delete('/user/delete', {
        data: { uid }
      })
    }catch(e){
      console.log(`Error when trying to delete the user ${e}`)
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
        setCurrentUser(users.find(x => x.user_id === row.user_id))
      }} className="btn btn-warning"><i className="fa-solid fa-user-pen"/></button>
    },
    {
      name: 'Eliminar',
      selector: row => <button onClick={()=>{
        if(!window.confirm("De verdad deseas borrar?")){
          return
        }
        deleteUser(row.user_id).then(()=>triggerFetch())
      }} className="btn btn-danger"><i className="fa-solid fa-trash"/></button>,
    },
  ];


  //search
  useEffect(()=>{
    const delay = setTimeout(()=>fetchClients(), 500)
    return () => clearTimeout(delay)
  },[search])

  //fetch clients
  useEffect(()=>{
    fetchClients()
  }, [fetch])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        {user && <UserModal show={user} onHide={()=>{
          triggerFetch()
          setCurrentUser(null)
        }}/>}
        <Container className="mt-5 mb-5">
          <Permission group_access={[1,2]}>
            <div className="d-flex px-0 mb-4">
              <input 
                className="form-control rounded-0" 
                placeholder="Buscar cliente.." 
                onChange={(e)=>setSearch(e.target.value)}
                />
            </div>
            {/* contenido de la tabla */}
            <DataTable
              columns={columns}
              data={users}
              pagination
              />
          </Permission>
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Clients
