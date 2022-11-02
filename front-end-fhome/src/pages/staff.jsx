import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import UserModal from './modals/user-modal'
import Permission from "./components/permission";
import HttpMan from "../util/http-man";
import { Container, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import { get_group_name } from '../util/groups'

function Staff(){

  const [search, setSearch] = useState()
  const [users, setUsers] = useState([])
  const [user, setCurrentUser] = useState()
  const [fetch, setFetch] = useState(true)
  const triggerFetch = () => setFetch(t => !t)

  //endpoints
  const fetchStaff = async () =>{
    try{
      const resp = await HttpMan.get('/user/staff_list', {
        params: { 'filter': search }
      });
      setUsers(resp.data)
    }catch(e){
      console.log(`Fetch client error: ${e}`)
    }
  }

  const deleteUser = async (uid) =>{
    try{
       await HttpMan.delete('/user/delete', { data: { uid } })
    }catch(e){
      console.log(`Error when trying to delete the user ${e}`)
    }
  }

  //data table
  const columns = [
    {
      name: 'Id',
      selector: row => row.user_id,
    },
    {
      name: 'Usuario',
      selector: row => row.user_name,
    },
    {
      name: 'Nombre completo',
      selector: row => `${row.names} ${row.surnames}`,
    },
    {
      name: 'Rol',
      selector: row =><Badge variant="primary" text="light">{get_group_name(row.user_group)}</Badge> 
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
    const delay = setTimeout(()=>fetchStaff(), 500)
    return () => clearTimeout(delay)
  },[search])

  //fetch data
  useEffect(()=>{
    fetchStaff()
  }, [fetch])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <Container className="mt-5 mb-5">
          {user && <UserModal show={user} onHide={()=>{
            triggerFetch()
            setCurrentUser(null)
          }}/>}
          <Permission group_access={[1]}>
            <div className="d-flex px-0 mb-4">
              <input className="form-control rounded-0" type="search" onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar personal.."/>
            </div>
            <DataTable
              columns={columns}
              data={users}
              pagination
              />
            <div className="mt-3">
              <a className="btn btn-success" onClick={()=>setCurrentUser({})}>
                <i className="fa-solida fa-plus"/> Agregar personal
              </a>
            </div>
          </Permission>
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Staff
