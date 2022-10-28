function CustomFooter(){

  const date = new Date()

  return (
    <div className="custom-footer">
      <footer className="py-3 bg-dark">
        <ul className="nav justify-content-center pb-3 mb-3">
            <a href="/#" className="text-light nav-link px-2">Contáctanos</a>
            <a href="/#" className="text-light nav-link px-2">Sucursales</a>
        </ul>
        <p className="text-center text-muted font-weight-bold">© {date.getFullYear()} Alan David González López</p>
      </footer>
    </div>
  )
}

export default CustomFooter
