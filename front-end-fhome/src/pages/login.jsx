import {Container,Form, Button} from 'react-bootstrap'
import React from 'react'
import HttpMan from '../util/http-man'
import { set_cookies } from '../util/cookie-man'
import { useNavigate } from 'react-router-dom'


function Login(){

  const [data, setData] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const nav = useNavigate()

  //login function
  const login = async (user, pass)=>{
    let resp_data

    try{
      const resp = await HttpMan.post('/auth/login', {user, pass});
      resp_data = resp.data
    }catch(er){
      console.log(`ERROR ${er}`)
    }
    return resp_data
  }

  //handle user input
  const handleInput = (e) => {
    const {name, value} = e.target
    setData({...data, [name]: value})
  }

  //handle submit
  const submit = (e) => {
    e.preventDefault();
    const {username, pass} = data || {};
    if(!username || !pass){
      alert('Por favor ingresa todos los campos')
      return
    }
    setLoading(true)
    login(username,pass).then(data=>{
      if(!data){
        alert('No hemos podido autenticarte verifica tus credenciales')
        return
      }
      //autenticado
      set_cookies(data)
      nav('/')
    })
    setLoading(false)
  }

  return (
    <div className='login-form d-flex justify-content-center align-items-center'>
      <div className="rounded-lg bg-white shadow-sm col-10 col-sm-3 col-md-4 p-4">
        <h2 className='text-center'>Iniciar sesión</h2>
        <Form onSubmit={submit}>
          <Form.Group className='mb-3'>
            <Form.Label>Usuario:</Form.Label>
            <Form.Control name='username' disabled={loading} onChange={handleInput}/>
          </Form.Group>
          <Form.Group className='mb-4'>
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control name='pass' type='password' disabled={loading} onChange={handleInput}/>
          </Form.Group>
            <Button className='btn-block' type='submit' disabled={loading} >
            {
             loading 
              ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 
              : "Iniciar sesión"
            }
          </Button>
        </Form>
      </div>
    </div>
  ); 
}

export default Login
