import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import ClientModal from "./modals/client-modal";
import { Container } from "react-bootstrap";
import React from "react";

function Clients(){

  const [modal,setModal] = React.useState(false)
  const data = []

  const columns = [
    {
      name: 'Nombres',
      selector: row => row.title,
    },
    {
      name: 'Usuario',
      selector: row => row.year,
    },
    {
      name: 'Editar',
      selector: row => <button onClick={()=>{setModal(true)}} className="btn btn-warning fa-solid fa-user-pen"/>
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
        <ClientModal show={modal} onHide={()=>setModal(false)}/>
        <Container className="mt-5 mb-5">
          <div className="d-flex px-0 mb-4 justify-content-center">
            <input class="form-control rounded-0 w-75" type="search" placeholder="Buscar usuario.." aria-label="Search"/>
            <button class="btn btn-primary rounded-0">Buscar cliente</button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            pagination
            />
          <div className="mt-3">
            <a className="btn btn-success fas-fa fa-plus rounded-0" onClick={()=>{}}> Agregar cliente</a>
          </div>
        </Container>
      </main>
      <CustomFooter/>
    </div>
  )
}

export default Clients
