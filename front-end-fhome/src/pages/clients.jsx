import CustomNavbar from "./components/navbar"
import CustomFooter from './components/footer'
import DataTable from 'react-data-table-component';
import ClientModal from "./modals/client-modal";
import React from "react";
import { Container } from "react-bootstrap";

function Clients(){

  const [modal,setModal] = React.useState(false)
  const data = []

  const columns = [
    {
      name: 'Id',
      selector: row => row.title,
    },
    {
      name: 'Nombre completo',
      selector: row => row.year,
    },
    {
      name: 'DPI',
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
          <div className="d-flex px-0 mb-4">
            <input className="form-control rounded-0 w-75" type="search" placeholder="Buscar cliente.." aria-label="Search"/>
            <button className="btn btn-primary rounded-0">Buscar cliente</button>
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

export default Clients
