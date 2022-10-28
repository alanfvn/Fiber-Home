import {Container,Form, Button} from 'react-bootstrap'
import React from 'react'


function Login(){

  const [data, setData] = React.useState({})

  //handle user input
  const handleInput = (e) => {
    const {name, value} = e.target
    setData({...data, [name]: value})
  }

  //handle submit
  const submit = async (e) => {
    const {username, pass} = data || {};
    e.preventDefault();
    if(!username || !pass){
      return
    }
  }

  return (
    <div className='login-form d-flex justify-content-center align-items-center'>
      <Container className='rounded-lg bg-white shadow-sm p-4 col-sm-5 col-md-5 col-lg-3'>
        <h2 className='text-center'>Iniciar sesión</h2>
        <Form onSubmit={submit}>
          <Form.Group className='mb-3'>
            <Form.Label>Usuario:</Form.Label>
            <Form.Control name='username' onChange={handleInput}/>
          </Form.Group>
          <Form.Group className='mb-4'>
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control name='pass' type='password' onChange={handleInput}/>
          </Form.Group>
            <Button type='submit' className='btn-block'>Iniciar sesión</Button>
        </Form>
      </Container>
    </div>
  ); 
}

export default Login
