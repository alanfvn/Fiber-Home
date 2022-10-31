
const groups = {1: 'Administrador', 2: 'Supervisor', 3: 'Trabajador', 4: 'Cliente'} 

function get_group_name(id){
  return groups[id] ?? "Desconocido"
}

export {get_group_name}
