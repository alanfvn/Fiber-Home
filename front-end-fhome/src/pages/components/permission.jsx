import { get_group } from "../../util/cookie-man"

function Permission(props){
  const group = parseInt(get_group())
  const perm = props.group_access
  const hasPerm = perm.includes(group)

  if(!hasPerm){
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>No tienes permiso para acceder a este apartado.</p>
        <hr/>
        <p className="mb-0">Si consideras que esto es un error ponte en contacto con la administración.</p>
      </div>
    )
  }
  return (
    <>
      { props.children }
    </>
  )
}

export default Permission
