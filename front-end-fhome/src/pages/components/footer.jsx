function CustomFooter(){
  return (
    <div className="custom-footer">
      <footer className="py-3 bg-dark">
        <ul className="nav justify-content-center pb-3 mb-3">
          <li className="nav-item">
            <a href="/#" className="nav-link px-2">Inicio</a>
          </li>
          <li className="nav-item">
            <a href="/#" className="nav-link px-2">Link2</a>
          </li>
          <li className="nav-item">
            <a href="/#" className="nav-link px-2">Link3</a>
          </li>
        </ul>
        <p className="text-center text-muted">© 2022 Alan David González López</p>
      </footer>
    </div>
  )
}

export default CustomFooter
