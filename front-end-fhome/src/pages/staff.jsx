import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import UserModal from './modals/user-modal'
import HttpMan from "../util/http-man";
import { Container, Badge } from "react-bootstrap";
import {useState, useEffect} from "react";
import { get_group, get_token } from "../util/cookie-man";
import { get_group_name} from '../util/groups'

function Staff(){

  const group = get_group()
  const token = get_token()
  const [search, setSearch] = useState()
  const [users, setUsers] = useState([])
  const [user, setCurrentUser] = useState()

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
      selector: row =><Badge bg="primary" text="light">{get_group_name(row.user_group)}</Badge> 
    },
    {
      name: 'Editar',
      selector: row => <button onClick={()=>{
        setCurrentUser(users.find(x => x.user_id === row.user_id))
      }} className="btn btn-warning fa-solid fa-user-pen"/>
    },
    {
      name: 'Eliminar',
      selector: row => <button onClick={()=>{
        if(!window.confirm("De verdad deseas borrar?")){
          return
        }
        deleteUser(row.user_id).then(()=>{
          setSearch()
          
        })
      }} className="btn btn-danger fa-solid fa-trash"/>,
    },
  ];

  const fetchStaff = async () =>{
    try{
      const resp = await HttpMan.get('/user/staff_list', {
        headers: {
          'Authorization': token
        },
        params:{
          'filter': search
        }
      });
      setUsers(resp.data)
    }catch(e){
      console.log(`Fetch client error: ${e}`)
    }
  }

  const deleteUser = async (uid) =>{
    try{
      const resp = await HttpMan.delete('/user/delete', {
        headers: {
          'Authorization': token
        },
        data:{
          uid
        }
      })
    }catch(e){
      console.log(`Error when trying to delete the user ${e}`)
    }
  }

  useEffect(()=>{
    const delay = setTimeout(()=>{
      console.log(search)
    }, 500)
    return ()=>clearTimeout(delay)
  },[search])


  useEffect(()=>{
    fetchStaff()
  }, [])

  return (
    <div className="layout">
      <CustomNavbar/>
      <main>
        <Container className="mt-5 mb-5">
          {
          group === "1" ?
            <>
              {user && <UserModal show={user} onHide={()=>setCurrentUser(null)}/>}
              <div className="d-flex px-0 mb-4">
                <input className="form-control rounded-0" type="search" onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar personal.."/>
              </div>
              <DataTable
                columns={columns}
                data={users}
                pagination
                />
              <div className="mt-3">
                <a className="btn btn-success fas-fa fa-plus rounded-0" onClick={()=>setCurrentUser({})}> Agregar personal</a>
              </div>
            </>
            :
            <>
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Error</h4>
                <p>No tienes permiso para acceder a este apartado.</p>
                <hr />
                <p className="mb-0">Si consideras que esto es un error ponte en contacto con la administración.</p>
              </div>
            </>
        }
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Staff
